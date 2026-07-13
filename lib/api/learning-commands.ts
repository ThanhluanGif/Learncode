function clamp(value: unknown, min: number, max: number, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback;
}

export function validateLearningCommand(payload: unknown) {
  if (!payload || typeof payload !== "object") throw new Error("Invalid payload");
  const command = payload as Record<string, unknown>;
  
  if (command.action === "start_session") {
    const targetMinutes = clamp(command.targetMinutes, 15, 300, 150);
    return {
      action: "start_session" as const,
      examPaperId: typeof command.examPaperId === "number" ? command.examPaperId : null,
      mode: command.mode === "practice" ? "practice" : "exam",
      targetMinutes,
    };
  }

  if (command.action === "set_status") {
    if (typeof command.sessionId !== "number") throw new Error("Invalid sessionId");
    if (typeof command.status !== "string" || !["active", "paused", "completed"].includes(command.status)) throw new Error("Invalid status");
    return {
      action: "set_status" as const,
      sessionId: command.sessionId,
      status: command.status as "active" | "paused" | "completed",
      score: command.score !== undefined ? clamp(command.score, 0, 1000, 0) : undefined,
    };
  }

  if (command.action === "record_attempt") {
    if (typeof command.problemId !== "number") throw new Error("Invalid problemId");
    const validStatuses = ["AC", "WA", "TLE", "MLE", "RTE", "CE", "PE", "attempted"];
    if (typeof command.status !== "string" || !validStatuses.includes(command.status)) throw new Error("Invalid status");
    if (typeof command.score !== "number" || command.score < 0) throw new Error("Invalid score");
    if (typeof command.confidence !== "number" || command.confidence < 1 || command.confidence > 5) throw new Error("Invalid confidence");
    
    return {
      action: "record_attempt" as const,
      sessionId: typeof command.sessionId === "number" ? command.sessionId : null,
      problemId: command.problemId,
      status: command.status,
      score: command.score,
      language: typeof command.language === "string" ? command.language.trim().slice(0, 30) : "C++",
      confidence: Math.round(command.confidence) as 1|2|3|4|5,
      timeSpentSeconds: clamp(command.timeSpentSeconds, 0, 86400, 0),
    };
  }

  if (command.action === "save_reflection") {
    if (command.reviewAt !== undefined && typeof command.reviewAt !== "string") throw new Error("Invalid reviewAt date");
    if (typeof command.reviewAt === "string" && Number.isNaN(Date.parse(command.reviewAt))) throw new Error("Invalid reviewAt date");
    return {
      action: "save_reflection" as const,
      sessionId: typeof command.sessionId === "number" ? command.sessionId : null,
      problemId: typeof command.problemId === "number" ? command.problemId : null,
      successNote: typeof command.successNote === "string" ? command.successNote.trim().slice(0, 2000) : "",
      errorNote: typeof command.errorNote === "string" ? command.errorNote.trim().slice(0, 2000) : "",
      causeNote: typeof command.causeNote === "string" ? command.causeNote.trim().slice(0, 2000) : "",
      solutionNote: typeof command.solutionNote === "string" ? command.solutionNote.trim().slice(0, 2000) : "",
      nextAction: typeof command.nextAction === "string" ? command.nextAction.trim().slice(0, 2000) : "",
      reviewAt: typeof command.reviewAt === "string" ? new Date(command.reviewAt).toISOString() : null,
    };
  }

  throw new Error("Invalid action");
}
