function clamp(value: unknown, min: number, max: number, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback;
}

export function validateLearningCommand(payload: any) {
  if (!payload || typeof payload !== "object") throw new Error("Invalid payload");
  
  if (payload.action === "start_session") {
    let targetMinutes = clamp(payload.targetMinutes, 15, 300, 150);
    return {
      action: "start_session" as const,
      examPaperId: typeof payload.examPaperId === "number" ? payload.examPaperId : null,
      mode: payload.mode === "practice" ? "practice" : "exam",
      targetMinutes,
    };
  }

  if (payload.action === "set_status") {
    if (typeof payload.sessionId !== "number") throw new Error("Invalid sessionId");
    if (!["active", "paused", "completed"].includes(payload.status)) throw new Error("Invalid status");
    return {
      action: "set_status" as const,
      sessionId: payload.sessionId,
      status: payload.status as "active" | "paused" | "completed",
      score: payload.score !== undefined ? clamp(payload.score, 0, 1000, 0) : undefined,
    };
  }

  if (payload.action === "record_attempt") {
    if (typeof payload.problemId !== "number") throw new Error("Invalid problemId");
    const validStatuses = ["AC", "WA", "TLE", "MLE", "RTE", "CE", "PE", "attempted"];
    if (!validStatuses.includes(payload.status)) throw new Error("Invalid status");
    if (typeof payload.score !== "number" || payload.score < 0) throw new Error("Invalid score");
    if (typeof payload.confidence !== "number" || payload.confidence < 1 || payload.confidence > 5) throw new Error("Invalid confidence");
    
    return {
      action: "record_attempt" as const,
      sessionId: typeof payload.sessionId === "number" ? payload.sessionId : null,
      problemId: payload.problemId,
      status: payload.status,
      score: payload.score,
      language: typeof payload.language === "string" ? payload.language.trim().slice(0, 30) : "C++",
      confidence: Math.round(payload.confidence) as 1|2|3|4|5,
      timeSpentSeconds: clamp(payload.timeSpentSeconds, 0, 86400, 0),
    };
  }

  if (payload.action === "save_reflection") {
    if (payload.reviewAt && isNaN(Date.parse(payload.reviewAt))) throw new Error("Invalid reviewAt date");
    return {
      action: "save_reflection" as const,
      sessionId: typeof payload.sessionId === "number" ? payload.sessionId : null,
      problemId: typeof payload.problemId === "number" ? payload.problemId : null,
      successNote: typeof payload.successNote === "string" ? payload.successNote.trim().slice(0, 2000) : "",
      errorNote: typeof payload.errorNote === "string" ? payload.errorNote.trim().slice(0, 2000) : "",
      causeNote: typeof payload.causeNote === "string" ? payload.causeNote.trim().slice(0, 2000) : "",
      solutionNote: typeof payload.solutionNote === "string" ? payload.solutionNote.trim().slice(0, 2000) : "",
      nextAction: typeof payload.nextAction === "string" ? payload.nextAction.trim().slice(0, 2000) : "",
      reviewAt: typeof payload.reviewAt === "string" ? new Date(payload.reviewAt).toISOString() : null,
    };
  }

  throw new Error("Invalid action");
}
