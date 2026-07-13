import test from "node:test";
import assert from "node:assert/strict";
import { buildLibraryFilters } from "../lib/api/library-query.ts";

test("library filters cover all required fields", () => {
  const searchParams = new URLSearchParams({
    year: "2022",
    division: "B",
    q: "search query",
    round: "Chung kết",
    topic: "Toán",
    sourceStatus: "official",
    examId: "1",
  });

  const { appliedFilters } = buildLibraryFilters(searchParams);

  assert.equal(appliedFilters.year, 2022);
  assert.equal(appliedFilters.division, "B");
  assert.equal(appliedFilters.q, "search query");
  assert.equal(appliedFilters.round, "Chung kết");
  assert.equal(appliedFilters.topic, "Toán");
  assert.equal(appliedFilters.sourceStatus, "official");
  assert.equal(appliedFilters.examId, 1);
});

test("library empty query works", () => {
  const { appliedFilters } = buildLibraryFilters(new URLSearchParams());
  
  assert.equal(appliedFilters.year, null);
  assert.equal(appliedFilters.division, null);
  assert.equal(appliedFilters.q, null);
  assert.equal(appliedFilters.round, null);
  assert.equal(appliedFilters.topic, null);
  assert.equal(appliedFilters.sourceStatus, null);
  assert.equal(appliedFilters.examId, null);
});

test("library ignores invalid types", () => {
  const searchParams = new URLSearchParams({
    year: "not-a-year",
    examId: "NaN",
  });

  const { appliedFilters } = buildLibraryFilters(searchParams);
  
  assert.equal(appliedFilters.year, null);
  assert.equal(appliedFilters.examId, null);
});
