export function validatePilotFeedback(payload: any) {
  if (!payload.role || !["student", "teacher"].includes(payload.role)) {
    throw new Error("Invalid role");
  }
  if (typeof payload.rating !== "number" || payload.rating < 1 || payload.rating > 5) {
    throw new Error("Invalid rating");
  }
  if (typeof payload.minutesSpent !== "number" || payload.minutesSpent < 1 || payload.minutesSpent > 180) {
    throw new Error("Invalid minutesSpent");
  }
  if (payload.comment && payload.comment.length > 1000) {
    throw new Error("Comment too long");
  }
  return {
    role: payload.role as "student" | "teacher",
    rating: payload.rating as number,
    completedCycle: Boolean(payload.completedCycle),
    minutesSpent: payload.minutesSpent as number,
    comment: payload.comment?.trim().slice(0, 1000) || "",
  };
}
