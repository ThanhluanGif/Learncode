import test from "node:test";
import assert from "node:assert/strict";
import { validateLearningCommand } from "../lib/api/learning-commands.ts";

test("validates start_session", () => {
  const res = validateLearningCommand({ action: "start_session", targetMinutes: 60, mode: "exam" });
  assert.equal(res.action, "start_session");
  assert.equal(res.targetMinutes, 60);
});

test("validates record_attempt limits and types", () => {
  const res = validateLearningCommand({
    action: "record_attempt",
    problemId: 1,
    status: "AC",
    score: 100,
    confidence: 5,
    timeSpentSeconds: 120,
    language: "Python"
  });
  assert.equal(res.status, "AC");
  
  assert.throws(() => {
    validateLearningCommand({
      action: "record_attempt", problemId: 1, status: "INVALID", score: 100, confidence: 5, timeSpentSeconds: 120
    });
  }, /Invalid status/);

  assert.throws(() => {
    validateLearningCommand({
      action: "record_attempt", problemId: 1, status: "AC", score: 100, confidence: 6, timeSpentSeconds: 120
    });
  }, /Invalid confidence/);
});

test("validates save_reflection dates and strings", () => {
  const res = validateLearningCommand({
    action: "save_reflection",
    successNote: " Good ",
    causeNote: " Bad ",
    reviewAt: "2026-07-20T00:00:00Z"
  });
  assert.equal(res.successNote, "Good");
  assert.equal(res.causeNote, "Bad");
  assert.ok(res.reviewAt?.includes("2026-07-20"));

  assert.throws(() => {
    validateLearningCommand({ action: "save_reflection", reviewAt: "not-a-date" });
  }, /Invalid reviewAt date/);
});
