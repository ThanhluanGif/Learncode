import { and, asc, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { contentSources, examPapers, problemAttempts, problems, studySessions } from "../../../db/schema";
import { requireCurrentLearner } from "../../../lib/auth/current-learner";
import { handledApiError } from "../../../lib/api/errors";
import { buildLibraryFilters } from "../../../lib/api/library-query";

export async function GET(request: Request) {
  try {
    const learner = await requireCurrentLearner(request.headers);
    const url = new URL(request.url);
    const { examFilters, problemFilters, appliedFilters } = buildLibraryFilters(url.searchParams);
    
    const db = getDb();

    const [sources, exams, problemRows, stats, recentSessions] = await Promise.all([
      db.select().from(contentSources).orderBy(desc(contentSources.isOfficial), asc(contentSources.id)),
      db.select({
        id: examPapers.id,
        year: examPapers.year,
        title: examPapers.title,
        round: examPapers.round,
        division: examPapers.division,
        durationMinutes: examPapers.durationMinutes,
        totalPoints: examPapers.totalPoints,
        officialUrl: examPapers.officialUrl,
        sourceStatus: examPapers.sourceStatus,
        sourceTitle: contentSources.title,
        sourceId: examPapers.sourceId,
      }).from(examPapers).innerJoin(contentSources, eq(examPapers.sourceId, contentSources.id))
        .where(examFilters.length ? and(...examFilters) : undefined)
        .orderBy(desc(examPapers.year), asc(examPapers.division)),
      db.select().from(problems)
        .where(problemFilters.length ? and(...problemFilters) : undefined)
        .orderBy(desc(problems.id)).limit(100),
      db.select({
        problems: sql<number>`count(distinct ${problems.id})`,
        attempts: sql<number>`count(distinct ${problemAttempts.id})`,
      }).from(problems).leftJoin(problemAttempts, eq(problemAttempts.problemId, problems.id)),
      db.select().from(studySessions).where(eq(studySessions.learnerId, learner.id)).orderBy(desc(studySessions.updatedAt)).limit(5),
    ]);

    return Response.json({
      sources,
      exams,
      problems: problemRows.map((problem) => ({
        ...problem,
        topics: JSON.parse(problem.topicsJson) as string[],
        sourceMetadata: JSON.parse(problem.sourceMetadataJson) as Record<string, unknown>,
      })),
      stats: { sources: sources.length, exams: exams.length, problems: stats[0]?.problems ?? 0, attempts: stats[0]?.attempts ?? 0 },
      appliedFilters,
      recentSessions,
    });
  } catch (error) {
    return handledApiError(error);
  }
}
