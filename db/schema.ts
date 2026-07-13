import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const learners = sqliteTable("learners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email"),
  displayName: text("display_name").notNull(),
  division: text("division").notNull().default("B"),
  schoolLevel: text("school_level").notNull().default("THCS"),
  xp: integer("xp").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("learners_email_unique").on(table.email),
]);

export const contentSources = sqliteTable("content_sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  sourceType: text("source_type").notNull(),
  url: text("url").notNull(),
  isOfficial: integer("is_official", { mode: "boolean" }).notNull().default(false),
  yearFrom: integer("year_from"),
  yearTo: integer("year_to"),
  usagePolicy: text("usage_policy").notNull().default("link_only"),
  verifiedAt: text("verified_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("content_sources_slug_unique").on(table.slug),
  index("content_sources_official_idx").on(table.isOfficial),
]);

export const examPapers = sqliteTable("exam_papers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sourceId: integer("source_id").notNull().references(() => contentSources.id, { onDelete: "restrict" }),
  externalId: text("external_id").notNull(),
  year: integer("year").notNull(),
  title: text("title").notNull(),
  round: text("round").notNull(),
  division: text("division").notNull(),
  durationMinutes: integer("duration_minutes"),
  totalPoints: integer("total_points"),
  officialUrl: text("official_url").notNull(),
  sourceStatus: text("source_status").notNull().default("verified"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("exam_papers_source_external_unique").on(table.sourceId, table.externalId),
  index("exam_papers_year_division_idx").on(table.year, table.division),
]);

export const problems = sqliteTable("problems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sourceId: integer("source_id").notNull().references(() => contentSources.id, { onDelete: "restrict" }),
  examPaperId: integer("exam_paper_id").references(() => examPapers.id, { onDelete: "set null" }),
  externalId: text("external_id").notNull(),
  title: text("title").notNull(),
  division: text("division").notNull(),
  topicsJson: text("topics_json").notNull().default("[]"),
  difficulty: text("difficulty").notNull().default("Chưa phân loại"),
  points: integer("points").notNull().default(100),
  timeLimitMs: integer("time_limit_ms"),
  officialUrl: text("official_url").notNull(),
  shortDescription: text("short_description").notNull().default(""),
  sourceMetadataJson: text("source_metadata_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("problems_source_external_unique").on(table.sourceId, table.externalId),
  index("problems_exam_idx").on(table.examPaperId),
  index("problems_division_idx").on(table.division),
]);

export const studySessions = sqliteTable("study_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  learnerId: integer("learner_id").notNull().references(() => learners.id, { onDelete: "cascade" }),
  examPaperId: integer("exam_paper_id").references(() => examPapers.id, { onDelete: "set null" }),
  mode: text("mode").notNull().default("exam"),
  status: text("status").notNull().default("active"),
  targetMinutes: integer("target_minutes").notNull().default(150),
  score: integer("score"),
  startedAt: text("started_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  pausedAt: text("paused_at"),
  completedAt: text("completed_at"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("study_sessions_learner_status_idx").on(table.learnerId, table.status),
  index("study_sessions_exam_idx").on(table.examPaperId),
]);

export const problemAttempts = sqliteTable("problem_attempts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  learnerId: integer("learner_id").notNull().references(() => learners.id, { onDelete: "cascade" }),
  studySessionId: integer("study_session_id").references(() => studySessions.id, { onDelete: "cascade" }),
  problemId: integer("problem_id").notNull().references(() => problems.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("attempted"),
  score: integer("score").notNull().default(0),
  language: text("language").notNull().default("C++"),
  confidence: integer("confidence").notNull().default(3),
  timeSpentSeconds: integer("time_spent_seconds").notNull().default(0),
  submittedAt: text("submitted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("problem_attempts_learner_problem_idx").on(table.learnerId, table.problemId),
  index("problem_attempts_session_idx").on(table.studySessionId),
]);

export const learningReflections = sqliteTable("learning_reflections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  learnerId: integer("learner_id").notNull().references(() => learners.id, { onDelete: "cascade" }),
  studySessionId: integer("study_session_id").references(() => studySessions.id, { onDelete: "cascade" }),
  problemId: integer("problem_id").references(() => problems.id, { onDelete: "set null" }),
  successNote: text("success_note").notNull().default(""),
  errorNote: text("error_note").notNull().default(""),
  causeNote: text("cause_note").notNull().default(""),
  solutionNote: text("solution_note").notNull().default(""),
  nextAction: text("next_action").notNull().default(""),
  reviewAt: text("review_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("learning_reflections_learner_idx").on(table.learnerId, table.createdAt),
  index("learning_reflections_session_idx").on(table.studySessionId),
]);

export const savedProblems = sqliteTable("saved_problems", {
  learnerId: integer("learner_id").notNull().references(() => learners.id, { onDelete: "cascade" }),
  problemId: integer("problem_id").notNull().references(() => problems.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("saved_problems_learner_problem_unique").on(table.learnerId, table.problemId),
]);

export const pilotFeedback = sqliteTable("pilot_feedback", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  learnerId: integer("learner_id").notNull().references(() => learners.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  rating: integer("rating").notNull(),
  completedCycle: integer("completed_cycle", { mode: "boolean" }).notNull(),
  minutesSpent: integer("minutes_spent").notNull(),
  comment: text("comment").notNull().default(""),
  submittedAt: text("submitted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("pilot_feedback_learner_idx").on(table.learnerId),
  uniqueIndex("pilot_feedback_learner_unique").on(table.learnerId),
]);
