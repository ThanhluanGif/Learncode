import { eq, like, or } from "drizzle-orm";
import { examPapers, problems } from "../../db/schema.ts";

export function buildLibraryFilters(searchParams: URLSearchParams) {
  const year = Number(searchParams.get("year"));
  const division = searchParams.get("division")?.trim();
  const query = searchParams.get("q")?.trim();
  const round = searchParams.get("round")?.trim();
  const topic = searchParams.get("topic")?.trim();
  const sourceStatus = searchParams.get("sourceStatus")?.trim();
  const examId = Number(searchParams.get("examId"));

  const examFilters = [
    Number.isFinite(year) && year > 0 ? eq(examPapers.year, year) : undefined,
    division ? eq(examPapers.division, division) : undefined,
    query ? or(like(examPapers.title, `%${query}%`), like(examPapers.round, `%${query}%`)) : undefined,
    round ? eq(examPapers.round, round) : undefined,
    sourceStatus ? eq(examPapers.sourceStatus, sourceStatus) : undefined,
  ].filter(Boolean);

  const problemFilters = [
    division ? or(eq(problems.division, division), eq(problems.division, "B/C")) : undefined,
    query ? or(like(problems.title, `%${query}%`), like(problems.topicsJson, `%${query}%`)) : undefined,
    topic ? like(problems.topicsJson, `%${topic}%`) : undefined,
    Number.isFinite(examId) && examId > 0 ? eq(problems.examPaperId, examId) : undefined,
  ].filter(Boolean);

  return {
    examFilters,
    problemFilters,
    appliedFilters: {
      q: query || null,
      year: Number.isFinite(year) && year > 0 ? year : null,
      division: division || null,
      round: round || null,
      topic: topic || null,
      sourceStatus: sourceStatus || null,
      examId: Number.isFinite(examId) && examId > 0 ? examId : null,
    }
  };
}
