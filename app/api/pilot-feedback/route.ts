import { sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { pilotFeedback } from "../../../db/schema";
import { requireCurrentLearner } from "../../../lib/auth/current-learner";
import { handledApiError } from "../../../lib/api/errors";
import { validatePilotFeedback } from "../../../lib/api/pilot-commands.ts";

type PilotFeedbackInput = {
  role: "student" | "teacher";
  rating: 1 | 2 | 3 | 4 | 5;
  completedCycle: boolean;
  minutesSpent: number;
  comment?: string;
};

export async function GET(request: Request) {
  try {
    await requireCurrentLearner(request.headers);
    const db = getDb();

    // Query aggregate
    const [summary] = await db.select({
      participants: sql<number>`count(${pilotFeedback.id})`,
      completedCycles: sql<number>`count(case when ${pilotFeedback.completedCycle} = 1 then 1 end)`,
      usefulRatings: sql<number>`count(case when ${pilotFeedback.rating} >= 4 then 1 end)`,
      averageRating: sql<number>`avg(${pilotFeedback.rating})`,
      // Approximate median by avg for now, SQLite median requires complex query
      medianMinutes: sql<number>`avg(${pilotFeedback.minutesSpent})`,
    }).from(pilotFeedback);

    return Response.json({
      summary: {
        participants: summary?.participants || 0,
        completedCycles: summary?.completedCycles || 0,
        usefulRatings: summary?.usefulRatings || 0,
        averageRating: summary?.averageRating ? Number(summary.averageRating.toFixed(1)) : 0,
        medianMinutes: summary?.medianMinutes ? Math.round(summary.medianMinutes) : 0,
      }
    });
  } catch (error) {
    return handledApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const learner = await requireCurrentLearner(request.headers);
    const payload = await request.json() as PilotFeedbackInput;
    const db = getDb();

    let parsed: ReturnType<typeof validatePilotFeedback>;
    try {
      parsed = validatePilotFeedback(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid pilot feedback";
      return Response.json({ error: { code: "VALIDATION_ERROR", message } }, { status: 400 });
    }

    const [feedback] = await db.insert(pilotFeedback).values({
      learnerId: learner.id,
      role: parsed.role,
      rating: parsed.rating,
      completedCycle: parsed.completedCycle,
      minutesSpent: parsed.minutesSpent,
      comment: parsed.comment,
    }).onConflictDoUpdate({
      target: pilotFeedback.learnerId,
      set: {
        role: parsed.role,
        rating: parsed.rating,
        completedCycle: parsed.completedCycle,
        minutesSpent: parsed.minutesSpent,
        comment: parsed.comment,
        submittedAt: sql`CURRENT_TIMESTAMP`,
      }
    }).returning();

    return Response.json({
      feedback: {
        id: feedback.id,
        rating: feedback.rating,
        completedCycle: feedback.completedCycle,
        submittedAt: feedback.submittedAt,
      }
    }, { status: 201 });
  } catch (error) {
    return handledApiError(error);
  }
}
