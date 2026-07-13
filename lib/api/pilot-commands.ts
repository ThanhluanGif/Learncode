export function validatePilotFeedback(payload: unknown) {
  if (!payload || typeof payload !== "object") throw new Error("Invalid payload");
  const feedback = payload as Record<string, unknown>;

  if (typeof feedback.role !== "string" || !["student", "teacher"].includes(feedback.role)) {
    throw new Error("Invalid role");
  }
  if (typeof feedback.rating !== "number" || feedback.rating < 1 || feedback.rating > 5) {
    throw new Error("Invalid rating");
  }
  if (typeof feedback.minutesSpent !== "number" || feedback.minutesSpent < 1 || feedback.minutesSpent > 180) {
    throw new Error("Invalid minutesSpent");
  }
  if (feedback.comment !== undefined && typeof feedback.comment !== "string") {
    throw new Error("Invalid comment");
  }
  if (typeof feedback.comment === "string" && feedback.comment.length > 1000) {
    throw new Error("Comment too long");
  }
  return {
    role: feedback.role as "student" | "teacher",
    rating: feedback.rating,
    completedCycle: Boolean(feedback.completedCycle),
    minutesSpent: feedback.minutesSpent,
    comment: typeof feedback.comment === "string" ? feedback.comment.trim().slice(0, 1000) : "",
  };
}
