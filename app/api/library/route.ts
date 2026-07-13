import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { contentSources, examPapers, problemAttempts, problems, studySessions } from "../../../db/schema";

function databaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "Không thể đọc thư viện";
  if (message.includes("no such table") || message.includes("D1 binding")) {
    return "Kho dữ liệu chưa được khởi tạo. Hãy áp dụng migration D1 trước khi sử dụng.";
  }
  return message;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const year = Number(url.searchParams.get("year"));
    const division = url.searchParams.get("division")?.trim();
    const query = url.searchParams.get("q")?.trim();
    const db = getDb();

    const examFilters = [
      Number.isFinite(year) && year > 0 ? eq(examPapers.year, year) : undefined,
      division ? eq(examPapers.division, division) : undefined,
      query ? or(like(examPapers.title, `%${query}%`), like(examPapers.round, `%${query}%`)) : undefined,
    ].filter(Boolean);

    const problemFilters = [
      division ? or(eq(problems.division, division), eq(problems.division, "B/C")) : undefined,
      query ? or(like(problems.title, `%${query}%`), like(problems.topicsJson, `%${query}%`)) : undefined,
    ].filter(Boolean);

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
      db.select().from(studySessions).where(eq(studySessions.learnerId, 1)).orderBy(desc(studySessions.updatedAt)).limit(5),
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
      recentSessions,
    });
  } catch (error) {
    return Response.json({ error: databaseError(error) }, { status: 500 });
  }
}
