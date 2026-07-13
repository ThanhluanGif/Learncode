import test from "node:test";
import assert from "node:assert/strict";
import { validatePilotFeedback } from "../lib/api/pilot-commands.ts";

test("validates pilot feedback correctly", () => {
  const res = validatePilotFeedback({
    role: "student",
    rating: 5,
    completedCycle: true,
    minutesSpent: 45,
    comment: " Great! "
  });
  assert.equal(res.role, "student");
  assert.equal(res.rating, 5);
  assert.equal(res.completedCycle, true);
  assert.equal(res.minutesSpent, 45);
  assert.equal(res.comment, "Great!");
});

test("rejects invalid pilot feedback", () => {
  assert.throws(() => {
    validatePilotFeedback({ role: "admin", rating: 5, completedCycle: true, minutesSpent: 45 });
  }, /Invalid role/);

  assert.throws(() => {
    validatePilotFeedback({ role: "student", rating: 6, completedCycle: true, minutesSpent: 45 });
  }, /Invalid rating/);

  assert.throws(() => {
    validatePilotFeedback({ role: "student", rating: 4, completedCycle: true, minutesSpent: 200 });
  }, /Invalid minutesSpent/);
});
