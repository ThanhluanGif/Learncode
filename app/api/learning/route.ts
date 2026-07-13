import { and, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { examPapers, learningReflections, problemAttempts, problems, studySessions } from "../../../db/schema";

type LearningAction =
  | { action: "start_session"; examPaperId?: number; mode?: string; targetMinutes?: number }
  | { action: "set_status"; sessionId?: number; status?: "active" | "paused" | "completed"; score?: number }
  | { action: "record_attempt"; sessionId?: number; problemId?: number; status?: string; score?: number; language?: string; confidence?: number; timeSpentSeconds?: number }
  | { action: "save_reflection"; sessionId?: number; problemId?: number; successNote?: string; errorNote?: string; nextAction?: string };

const learnerId = 1;

function positiveInteger(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : null;
}

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

export async function GET() {
  try {
    const db = getDb();
    const [sessions, attempts, reflections] = await Promise.all([
      db.select().from(studySessions).where(eq(studySessions.learnerId, learnerId)).orderBy(desc(studySessions.updatedAt)).limit(20),
      db.select().from(problemAttempts).where(eq(problemAttempts.learnerId, learnerId)).orderBy(desc(problemAttempts.submittedAt)).limit(50),
      db.select().from(learningReflections).where(eq(learningReflections.learnerId, learnerId)).orderBy(desc(learningReflections.createdAt)).limit(20),
    ]);
    return Response.json({ sessions, attempts, reflections });
  } catch (error) {
    return Response.json({ error: databaseError(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as LearningAction;
    const db = getDb();

    if (payload.action === "start_session") {
      const examPaperId = payload.examPaperId ? positiveInteger(payload.examPaperId) : null;
      let targetMinutes = clamp(payload.targetMinutes, 15, 300, 150);
      if (examPaperId) {
        const [exam] = await db.select().from(examPapers).where(eq(examPapers.id, examPaperId)).limit(1);
        if (!exam) return Response.json({ error: "Không tìm thấy đề thi" }, { status: 404 });
        targetMinutes = exam.durationMinutes ?? targetMinutes;
      }
      const [session] = await db.insert(studySessions).values({
        learnerId,
        examPaperId,
        mode: payload.mode?.trim().slice(0, 30) || "exam",
        targetMinutes,
      }).returning();
      const sessionProblems = examPaperId
        ? await db.select().from(problems).where(eq(problems.examPaperId, examPaperId)).orderBy(problems.id)
        : [];
      return Response.json({ session, problems: sessionProblems }, { status: 201 });
    }

    if (payload.action === "set_status") {
      const sessionId = positiveInteger(payload.sessionId);
      if (!sessionId || !payload.status) return Response.json({ error: "Thiếu phiên học hoặc trạng thái" }, { status: 400 });
      const now = new Date().toISOString();
      const [session] = await db.update(studySessions).set({
        status: payload.status,
        score: payload.score === undefined ? undefined : clamp(payload.score, 0, 1000, 0),
        pausedAt: payload.status === "paused" ? now : payload.status === "active" ? null : undefined,
        completedAt: payload.status === "completed" ? now : undefined,
        updatedAt: now,
      }).where(and(eq(studySessions.id, sessionId), eq(studySessions.learnerId, learnerId))).returning();
      if (!session) return Response.json({ error: "Không tìm thấy phiên học" }, { status: 404 });
      return Response.json({ session });
    }

    if (payload.action === "record_attempt") {
      const problemId = positiveInteger(payload.problemId);
      const sessionId = payload.sessionId ? positiveInteger(payload.sessionId) : null;
      if (!problemId) return Response.json({ error: "Thiếu bài tập" }, { status: 400 });
      if (sessionId) {
        const [ownedSession] = await db.select({ id: studySessions.id }).from(studySessions).where(and(eq(studySessions.id, sessionId), eq(studySessions.learnerId, learnerId))).limit(1);
        if (!ownedSession) return Response.json({ error: "Không tìm thấy phiên học" }, { status: 404 });
      }
      const [problem] = await db.select().from(problems).where(eq(problems.id, problemId)).limit(1);
      if (!problem) return Response.json({ error: "Không tìm thấy bài tập" }, { status: 404 });
      const [attempt] = await db.insert(problemAttempts).values({
        learnerId,
        studySessionId: sessionId,
        problemId,
        status: payload.status?.trim().slice(0, 30) || "attempted",
        score: clamp(payload.score, 0, problem.points, 0),
        language: payload.language?.trim().slice(0, 30) || "C++",
        confidence: clamp(payload.confidence, 1, 5, 3),
        timeSpentSeconds: clamp(payload.timeSpentSeconds, 0, 86400, 0),
      }).returning();
      return Response.json({ attempt }, { status: 201 });
    }

    if (payload.action === "save_reflection") {
      const sessionId = payload.sessionId ? positiveInteger(payload.sessionId) : null;
      const problemId = payload.problemId ? positiveInteger(payload.problemId) : null;
      if (sessionId) {
        const [ownedSession] = await db.select({ id: studySessions.id }).from(studySessions).where(and(eq(studySessions.id, sessionId), eq(studySessions.learnerId, learnerId))).limit(1);
        if (!ownedSession) return Response.json({ error: "Không tìm thấy phiên học" }, { status: 404 });
      }
      const [reflection] = await db.insert(learningReflections).values({
        learnerId,
        studySessionId: sessionId,
        problemId,
        successNote: payload.successNote?.trim().slice(0, 2000) || "",
        errorNote: payload.errorNote?.trim().slice(0, 2000) || "",
        nextAction: payload.nextAction?.trim().slice(0, 2000) || "",
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
