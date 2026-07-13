import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { learningReflections, problemAttempts, problems, studySessions } from "../../../db/schema";
import { requireCurrentLearner } from "../../../lib/auth/current-learner";
import { handledApiError } from "../../../lib/api/errors";

export async function GET(request: Request) {
  try {
    const learner = await requireCurrentLearner(request.headers);
    const db = getDb();

    const [sessionStats] = await db.select({
      sessions: sql<number>`count(${studySessions.id})`,
      completedSessions: sql<number>`count(case when ${studySessions.status} = 'completed' then 1 end)`,
    }).from(studySessions).where(eq(studySessions.learnerId, learner.id));

    const [attemptStats] = await db.select({
      attempts: sql<number>`count(${problemAttempts.id})`,
      accepted: sql<number>`count(case when ${problemAttempts.status} = 'AC' then 1 end)`,
      studySeconds: sql<number>`sum(${problemAttempts.timeSpentSeconds})`,
    }).from(problemAttempts).where(eq(problemAttempts.learnerId, learner.id));

    const errorsResult = await db.select({
      status: problemAttempts.status,
      count: sql<number>`count(${problemAttempts.id})`,
    })
      .from(problemAttempts)
      .where(and(eq(problemAttempts.learnerId, learner.id), sql`${problemAttempts.status} != 'AC'`, sql`${problemAttempts.status} != 'attempted'`))
      .groupBy(problemAttempts.status)
      .orderBy(desc(sql`count(${problemAttempts.id})`))
      .limit(5);

    const reviewsResult = await db.select({
      reflectionId: learningReflections.id,
      reviewAt: learningReflections.reviewAt,
      nextAction: learningReflections.nextAction,
      errorNote: learningReflections.errorNote,
      causeNote: learningReflections.causeNote,
    })
      .from(learningReflections)
      .where(and(eq(learningReflections.learnerId, learner.id), isNotNull(learningReflections.reviewAt)))
      .orderBy(learningReflections.reviewAt)
      .limit(10);

    const rawAttempts = await db.select({
      status: problemAttempts.status,
      confidence: problemAttempts.confidence,
      topicsJson: problems.topicsJson,
    })
      .from(problemAttempts)
      .innerJoin(problems, eq(problems.id, problemAttempts.problemId))
      .where(eq(problemAttempts.learnerId, learner.id));

    const topicMap = new Map<string, { attempts: number; accepted: number; totalConfidence: number }>();
    for (const row of rawAttempts) {
      let topics: string[] = [];
      try {
        topics = JSON.parse(row.topicsJson);
      } catch {
        // ignore invalid json
      }
      for (const topic of topics) {
        let stats = topicMap.get(topic);
        if (!stats) {
          stats = { attempts: 0, accepted: 0, totalConfidence: 0 };
          topicMap.set(topic, stats);
        }
        stats.attempts++;
        if (row.status === "AC") stats.accepted++;
        stats.totalConfidence += row.confidence;
      }
    }

    const topics = Array.from(topicMap.entries()).map(([topic, stats]) => {
      const averageConfidence = stats.attempts > 0 ? stats.totalConfidence / stats.attempts : 0;
      const acRate = stats.attempts > 0 ? stats.accepted / stats.attempts : 0;
      let strength: "strong" | "developing" | "review" = "developing";
      if (acRate > 0.8 && averageConfidence >= 4) strength = "strong";
      else if (acRate < 0.4 || averageConfidence <= 2) strength = "review";

      return {
        topic,
        attempts: stats.attempts,
        accepted: stats.accepted,
        averageConfidence: Number(averageConfidence.toFixed(1)),
        strength,
      };
    }).sort((a, b) => b.attempts - a.attempts).slice(0, 10);

    return Response.json({
      totals: {
        sessions: sessionStats?.sessions || 0,
        completedSessions: sessionStats?.completedSessions || 0,
        attempts: attemptStats?.attempts || 0,
        accepted: attemptStats?.accepted || 0,
        studySeconds: attemptStats?.studySeconds || 0,
      },
      topics,
      commonErrors: errorsResult.map(e => ({ status: e.status, count: e.count })),
      nextReviews: reviewsResult.map(r => ({
        reflectionId: r.reflectionId,
        reviewAt: r.reviewAt!,
        nextAction: r.nextAction,
        reason: r.errorNote || r.causeNote || "Cần ôn tập lại",
      })),
    });
  } catch (error) {
    return handledApiError(error);
  }
}
