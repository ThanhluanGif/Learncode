import { and, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { requireCurrentLearner } from "../../../lib/auth/current-learner";
import { validateLearningCommand } from "../../../lib/api/learning-commands.ts";
import { examPapers, learningReflections, problemAttempts, problems, studySessions } from "../../../db/schema";

function clamp(value: unknown, min: number, max: number, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback;
}

function databaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "Không thể lưu hoạt động học tập";
  if (message.includes("no such table") || message.includes("D1 binding")) {
    return "Kho dữ liệu chưa được khởi tạo. Hãy áp dụng migration D1 trước khi sử dụng.";
  }
  return message;
}

export async function GET(request: Request) {
  try {
    const learner = await requireCurrentLearner(request.headers);
    const db = getDb();
    const [sessions, attempts, reflections] = await Promise.all([
      db.select().from(studySessions).where(eq(studySessions.learnerId, learner.id)).orderBy(desc(studySessions.updatedAt)).limit(20),
      db.select().from(problemAttempts).where(eq(problemAttempts.learnerId, learner.id)).orderBy(desc(problemAttempts.submittedAt)).limit(50),
      db.select().from(learningReflections).where(eq(learningReflections.learnerId, learner.id)).orderBy(desc(learningReflections.createdAt)).limit(20),
    ]);
    return Response.json({ sessions, attempts, reflections });
  } catch (error) {
    return Response.json({ error: databaseError(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const learner = await requireCurrentLearner(request.headers);
    const rawPayload = await request.json();
    let payload: ReturnType<typeof validateLearningCommand>;
    try {
      payload = validateLearningCommand(rawPayload);
    } catch (e: any) {
      return Response.json({ error: { code: "VALIDATION_ERROR", message: e.message } }, { status: 400 });
    }
    const db = getDb();

    if (payload.action === "start_session") {
      const examPaperId = payload.examPaperId;
      let targetMinutes = payload.targetMinutes;
      if (examPaperId) {
        const [exam] = await db.select().from(examPapers).where(eq(examPapers.id, examPaperId)).limit(1);
        if (!exam) return Response.json({ error: "Không tìm thấy đề thi" }, { status: 404 });
        targetMinutes = exam.durationMinutes ?? targetMinutes;
      }
      const [session] = await db.insert(studySessions).values({
        learnerId: learner.id,
        examPaperId,
        mode: payload.mode,
        targetMinutes,
      }).returning();
      const sessionProblems = examPaperId
        ? await db.select().from(problems).where(eq(problems.examPaperId, examPaperId)).orderBy(problems.id)
        : [];
      return Response.json({ session, problems: sessionProblems }, { status: 201 });
    }

    if (payload.action === "set_status") {
      const sessionId = payload.sessionId;
      const now = new Date().toISOString();
      const [session] = await db.update(studySessions).set({
        status: payload.status,
        score: payload.score,
        pausedAt: payload.status === "paused" ? now : payload.status === "active" ? null : undefined,
        completedAt: payload.status === "completed" ? now : undefined,
        updatedAt: now,
      }).where(and(eq(studySessions.id, sessionId), eq(studySessions.learnerId, learner.id))).returning();
      if (!session) return Response.json({ error: "Không tìm thấy phiên học" }, { status: 404 });
      return Response.json({ session });
    }

    if (payload.action === "record_attempt") {
      const problemId = payload.problemId;
      const sessionId = payload.sessionId;
      if (sessionId) {
        const [ownedSession] = await db.select({ id: studySessions.id }).from(studySessions).where(and(eq(studySessions.id, sessionId), eq(studySessions.learnerId, learner.id))).limit(1);
        if (!ownedSession) return Response.json({ error: "Không tìm thấy phiên học" }, { status: 404 });
      }
      const [problem] = await db.select().from(problems).where(eq(problems.id, problemId)).limit(1);
      if (!problem) return Response.json({ error: "Không tìm thấy bài tập" }, { status: 404 });
      const [attempt] = await db.insert(problemAttempts).values({
        learnerId: learner.id,
        studySessionId: sessionId,
        problemId,
        status: payload.status,
        score: payload.score,
        language: payload.language,
        confidence: payload.confidence,
        timeSpentSeconds: payload.timeSpentSeconds,
      }).returning();
      return Response.json({ attempt }, { status: 201 });
    }

    if (payload.action === "save_reflection") {
      const sessionId = payload.sessionId;
      const problemId = payload.problemId;
      if (sessionId) {
        const [ownedSession] = await db.select({ id: studySessions.id }).from(studySessions).where(and(eq(studySessions.id, sessionId), eq(studySessions.learnerId, learner.id))).limit(1);
        if (!ownedSession) return Response.json({ error: "Không tìm thấy phiên học" }, { status: 404 });
      }
      const [reflection] = await db.insert(learningReflections).values({
        learnerId: learner.id,
        studySessionId: sessionId,
        problemId,
        successNote: payload.successNote,
        errorNote: payload.errorNote,
        causeNote: payload.causeNote,
        solutionNote: payload.solutionNote,
        nextAction: payload.nextAction,
        reviewAt: payload.reviewAt,
      }).returning();
      if (sessionId) {
        await db.update(studySessions).set({ updatedAt: sql`CURRENT_TIMESTAMP` }).where(eq(studySessions.id, sessionId));
      }
      return Response.json({ reflection }, { status: 201 });
    }

    return Response.json({ error: "Nghiệp vụ không được hỗ trợ" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: databaseError(error) }, { status: 500 });
  }
}
