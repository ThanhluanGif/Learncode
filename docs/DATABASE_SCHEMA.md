# 🗄️ DATABASE SCHEMA - TINHOCTRE PLATFORM

> Tài liệu mô tả chi tiết schema database, migration scripts, và indexes cho PostgreSQL 16.

---

## 1. TỔNG QUAN SCHEMA

### 1.1. Sơ đồ quan hệ tóm tắt

```
users ─┬──< submissions ──< submission_results
       ├──< study_sessions ──< learning_reflections
       ├──< contest_participants
       └──< classes_members

problems ─┬──< subtasks
           ├──< test_cases
           ├──< submissions
           ├──< problem_topics >── topics
           └──< contest_problems

contests ─┬──< contest_problems
           ├──< contest_participants
           └──< contest_submissions

classes ─┬──< classes_members
         └──< class_assignments

exam_papers ──< problems
content_sources ──< exam_papers
```

### 1.2. Phân nhóm bảng

| Nhóm | Bảng | Mô tả |
|:---|:---|:---|
| **Auth & Users** | `users` | Tài khoản người dùng |
| **Content** | `problems`, `subtasks`, `test_cases`, `topics`, `problem_topics`, `exam_papers`, `content_sources` | Nội dung học liệu |
| **Judging** | `submissions`, `submission_results` | Nộp bài và chấm bài |
| **Contest** | `contests`, `contest_problems`, `contest_participants` | Kỳ thi |
| **Learning** | `study_sessions`, `learning_reflections` | Phiên học và phản tư |
| **Classes** | `classes`, `classes_members`, `class_assignments` | Quản lý lớp |

---

## 2. DRIZZLE ORM SCHEMA

### 2.1. Users

```typescript
// lib/db/schema/users.ts
import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['student', 'teacher', 'admin']);
export const gradeLevelEnum = pgEnum('grade_level', ['tieu_hoc', 'thcs', 'thpt']);
export const competitionBoardEnum = pgEnum('competition_board', ['A', 'B', 'C1', 'C2']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').notNull().default('student'),
  gradeLevel: gradeLevelEnum('grade_level'),
  competitionBoard: competitionBoardEnum('competition_board'),
  school: varchar('school', { length: 255 }),
  province: varchar('province', { length: 100 }),
  googleId: varchar('google_id', { length: 255 }).unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### 2.2. Problems

```typescript
// lib/db/schema/problems.ts
import { pgTable, uuid, varchar, text, integer, timestamp, pgEnum, jsonb } from 'drizzle-orm/pg-core';

export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard', 'expert']);
export const contentStatusEnum = pgEnum('content_status', ['official', 'community', 'legacy', 'unverified']);

export const problems = pgTable('problems', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  descriptionMd: text('description_md').notNull(),
  inputFormat: text('input_format'),
  outputFormat: text('output_format'),
  sampleInput: text('sample_input'),
  sampleOutput: text('sample_output'),
  constraints: text('constraints'),
  timeLimitMs: integer('time_limit_ms').notNull().default(1000),
  memoryLimitKb: integer('memory_limit_kb').notNull().default(262144),
  allowedLanguages: jsonb('allowed_languages').$type<string[]>().default(['cpp17', 'python3', 'pascal']),
  difficulty: difficultyEnum('difficulty').notNull().default('medium'),
  board: competitionBoardEnum('board').notNull(),
  sourceExam: varchar('source_exam', { length: 255 }),
  sourceYear: integer('source_year'),
  sourceRound: varchar('source_round', { length: 100 }),
  sourceUrl: text('source_url'),
  contentStatus: contentStatusEnum('content_status').notNull().default('unverified'),
  examPaperId: uuid('exam_paper_id').references(() => examPapers.id),
  totalSubmissions: integer('total_submissions').notNull().default(0),
  acceptedSubmissions: integer('accepted_submissions').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### 2.3. Subtasks & Test Cases

```typescript
// lib/db/schema/subtasks.ts
export const subtasks = pgTable('subtasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  problemId: uuid('problem_id').notNull().references(() => problems.id, { onDelete: 'cascade' }),
  subtaskNumber: integer('subtask_number').notNull(),
  maxScore: integer('max_score').notNull(),
  constraints: text('constraints'),
});

// lib/db/schema/test-cases.ts
export const testCases = pgTable('test_cases', {
  id: uuid('id').defaultRandom().primaryKey(),
  problemId: uuid('problem_id').notNull().references(() => problems.id, { onDelete: 'cascade' }),
  subtaskId: uuid('subtask_id').references(() => subtasks.id, { onDelete: 'set null' }),
  testNumber: integer('test_number').notNull(),
  inputData: text('input_data').notNull(),
  expectedOutput: text('expected_output').notNull(),
  isSample: boolean('is_sample').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 2.4. Submissions & Results

```typescript
// lib/db/schema/submissions.ts
export const verdictEnum = pgEnum('verdict', [
  'PENDING', 'JUDGING', 'AC', 'WA', 'TLE', 'MLE', 'RTE', 'CE', 'PE'
]);

export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  problemId: uuid('problem_id').notNull().references(() => problems.id),
  contestId: uuid('contest_id').references(() => contests.id),
  sourceCode: text('source_code').notNull(),
  language: varchar('language', { length: 20 }).notNull(),
  status: verdictEnum('status').notNull().default('PENDING'),
  score: integer('score').notNull().default(0),
  maxScore: integer('max_score').notNull().default(100),
  timeMs: integer('time_ms'),
  memoryKb: integer('memory_kb'),
  compilerOutput: text('compiler_output'),
  aiFeedback: text('ai_feedback'),
  aiFeedbackStatus: varchar('ai_feedback_status', { length: 20 }).default('none'),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

export const submissionResults = pgTable('submission_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id').notNull().references(() => submissions.id, { onDelete: 'cascade' }),
  testCaseId: uuid('test_case_id').notNull().references(() => testCases.id),
  subtaskId: uuid('subtask_id').references(() => subtasks.id),
  verdict: verdictEnum('verdict').notNull(),
  timeMs: integer('time_ms'),
  memoryKb: integer('memory_kb'),
  actualOutput: text('actual_output'),
});
```

### 2.5. Contests

```typescript
// lib/db/schema/contests.ts
export const scoreboardStatusEnum = pgEnum('scoreboard_status', ['public', 'hidden', 'frozen']);

export const contests = pgTable('contests', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  freezeTime: timestamp('freeze_time'),
  board: competitionBoardEnum('board'),
  maxSubmissionsPerProblem: integer('max_submissions_per_problem').default(50),
  penaltyMinutes: integer('penalty_minutes').default(5),
  scoreboardStatus: scoreboardStatusEnum('scoreboard_status').notNull().default('public'),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  rules: jsonb('rules').$type<ContestRules>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const contestProblems = pgTable('contest_problems', {
  contestId: uuid('contest_id').notNull().references(() => contests.id, { onDelete: 'cascade' }),
  problemId: uuid('problem_id').notNull().references(() => problems.id),
  label: varchar('label', { length: 10 }).notNull(), // 'A', 'B', 'C', ...
  maxScore: integer('max_score').notNull().default(100),
  displayOrder: integer('display_order').notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.contestId, t.problemId] }),
}));

export const contestParticipants = pgTable('contest_participants', {
  contestId: uuid('contest_id').notNull().references(() => contests.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  totalScore: integer('total_score').notNull().default(0),
  totalPenalty: integer('total_penalty').notNull().default(0),
  rank: integer('rank'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.contestId, t.userId] }),
}));
```

### 2.6. Topics

```typescript
// lib/db/schema/topics.ts
export const topics = pgTable('topics', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  parentTopicId: uuid('parent_topic_id').references(() => topics.id),
  description: text('description'),
  displayOrder: integer('display_order').notNull().default(0),
});

export const problemTopics = pgTable('problem_topics', {
  problemId: uuid('problem_id').notNull().references(() => problems.id, { onDelete: 'cascade' }),
  topicId: uuid('topic_id').notNull().references(() => topics.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.problemId, t.topicId] }),
}));
```

### 2.7. Study Sessions & Reflections

```typescript
// lib/db/schema/study-sessions.ts
export const sessionStatusEnum = pgEnum('session_status', ['active', 'paused', 'completed']);

export const studySessions = pgTable('study_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  problemId: uuid('problem_id').references(() => problems.id),
  examPaperId: uuid('exam_paper_id').references(() => examPapers.id),
  targetDurationMin: integer('target_duration_min'),
  actualDurationMin: integer('actual_duration_min'),
  status: sessionStatusEnum('status').notNull().default('active'),
  selfScore: integer('self_score'),
  confidenceLevel: integer('confidence_level'), // 1-5
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

export const learningReflections = pgTable('learning_reflections', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull().references(() => studySessions.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  whatWentWell: text('what_went_well'),
  mistakesMade: text('mistakes_made'),
  rootCause: text('root_cause'),
  correctApproach: text('correct_approach'),
  nextSteps: text('next_steps'),
  reviewDate: timestamp('review_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 2.8. Classes

```typescript
// lib/db/schema/classes.ts
export const classMemberRoleEnum = pgEnum('class_member_role', ['student', 'assistant']);

export const classes = pgTable('classes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  teacherId: uuid('teacher_id').notNull().references(() => users.id),
  board: competitionBoardEnum('board'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const classesMembers = pgTable('classes_members', {
  classId: uuid('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  role: classMemberRoleEnum('role').notNull().default('student'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.classId, t.userId] }),
}));

export const classAssignments = pgTable('class_assignments', {
  id: uuid('id').defaultRandom().primaryKey(),
  classId: uuid('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  problemId: uuid('problem_id').notNull().references(() => problems.id),
  dueDate: timestamp('due_date'),
  instructions: text('instructions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 2.9. Content Sources & Exam Papers

```typescript
// lib/db/schema/content-sources.ts
export const sourceTypeEnum = pgEnum('source_type', ['official', 'community', 'textbook', 'video']);
export const verificationStatusEnum = pgEnum('verification_status', ['verified', 'unverified', 'disputed']);
export const digitizationStatusEnum = pgEnum('digitization_status', ['raw', 'partial', 'complete']);

export const contentSources = pgTable('content_sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }),
  url: text('url'),
  sourceType: sourceTypeEnum('source_type').notNull(),
  yearRange: varchar('year_range', { length: 50 }),
  boards: jsonb('boards').$type<string[]>(),
  verificationStatus: verificationStatusEnum('verification_status').notNull().default('unverified'),
  usagePolicy: text('usage_policy'),
  lastChecked: timestamp('last_checked'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const examPapers = pgTable('exam_papers', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceId: uuid('source_id').references(() => contentSources.id),
  title: varchar('title', { length: 255 }).notNull(),
  year: integer('year').notNull(),
  round: varchar('round', { length: 100 }),
  board: competitionBoardEnum('board').notNull(),
  region: varchar('region', { length: 100 }),
  fileUrl: text('file_url'),
  digitizationStatus: digitizationStatusEnum('digitization_status').notNull().default('raw'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

---

## 3. SQL MIGRATION SCRIPT

```sql
-- Migration: 0001_create_enums.sql
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE grade_level AS ENUM ('tieu_hoc', 'thcs', 'thpt');
CREATE TYPE competition_board AS ENUM ('A', 'B', 'C1', 'C2');
CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard', 'expert');
CREATE TYPE content_status AS ENUM ('official', 'community', 'legacy', 'unverified');
CREATE TYPE verdict AS ENUM ('PENDING', 'JUDGING', 'AC', 'WA', 'TLE', 'MLE', 'RTE', 'CE', 'PE');
CREATE TYPE scoreboard_status AS ENUM ('public', 'hidden', 'frozen');
CREATE TYPE session_status AS ENUM ('active', 'paused', 'completed');
CREATE TYPE source_type AS ENUM ('official', 'community', 'textbook', 'video');
CREATE TYPE verification_status AS ENUM ('verified', 'unverified', 'disputed');
CREATE TYPE digitization_status AS ENUM ('raw', 'partial', 'complete');
CREATE TYPE class_member_role AS ENUM ('student', 'assistant');

-- Migration: 0002_create_tables.sql
-- (Generated by Drizzle ORM from schema above)

-- Migration: 0003_create_indexes.sql
CREATE INDEX idx_problems_board ON problems(board);
CREATE INDEX idx_problems_year ON problems(source_year);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_board_year ON problems(board, source_year);
CREATE INDEX idx_problems_status ON problems(content_status);

CREATE INDEX idx_submissions_user ON submissions(user_id, submitted_at DESC);
CREATE INDEX idx_submissions_problem ON submissions(problem_id, status);
CREATE INDEX idx_submissions_contest ON submissions(contest_id, user_id);
CREATE INDEX idx_submissions_status ON submissions(status);

CREATE INDEX idx_results_submission ON submission_results(submission_id);
CREATE INDEX idx_results_subtask ON submission_results(subtask_id);

CREATE INDEX idx_participants_score ON contest_participants(contest_id, total_score DESC, total_penalty ASC);

CREATE INDEX idx_sessions_user ON study_sessions(user_id, started_at DESC);

CREATE INDEX idx_topics_slug ON topics(slug);
CREATE INDEX idx_topics_parent ON topics(parent_topic_id);
```

---

## 4. SEED DATA MẪU

### 4.1. Topics (Chủ đề thuật toán)

```sql
INSERT INTO topics (name, slug, display_order) VALUES
-- Cơ bản
('Cú pháp & Cơ bản', 'cu-phap-co-ban', 1),
('Mảng & Xâu', 'mang-xau', 2),
('Hàm & Đệ quy', 'ham-de-quy', 3),
-- Thuật toán
('Sắp xếp', 'sap-xep', 10),
('Tìm kiếm', 'tim-kiem', 11),
('Tìm kiếm nhị phân', 'tim-kiem-nhi-phan', 12),
('Tham lam', 'tham-lam', 13),
('Quay lui', 'quay-lui', 14),
('Quy hoạch động', 'quy-hoach-dong', 15),
('Quy hoạch động nâng cao', 'qhd-nang-cao', 16),
-- Đồ thị
('BFS/DFS', 'bfs-dfs', 20),
('Đường đi ngắn nhất', 'duong-di-ngan-nhat', 21),
('Cây khung', 'cay-khung', 22),
-- Cấu trúc dữ liệu
('Stack & Queue', 'stack-queue', 30),
('Segment Tree', 'segment-tree', 31),
('Fenwick Tree', 'fenwick-tree', 32),
-- Toán
('Số học', 'so-hoc', 40),
('Tổ hợp', 'to-hop', 41),
('Hình học', 'hinh-hoc', 42),
-- Scratch
('Scratch cơ bản', 'scratch-co-ban', 50),
('Scratch vẽ hình', 'scratch-ve-hinh', 51),
('Scratch thuật toán', 'scratch-thuat-toan', 52);
```

### 4.2. Content Sources

```sql
INSERT INTO content_sources (name, provider, url, source_type, year_range, boards, verification_status) VALUES
('Cổng Tin học trẻ', 'Trung ương Đoàn', 'https://tinhoctre.vn', 'official', '2015-2026', '["A","B","C1","C2"]', 'verified'),
('Hanoi Online Judge', 'Tổ chuyên môn THT Hà Nội', 'https://hnoj.edu.vn', 'community', '2020-2026', '["B","C1","C2"]', 'verified'),
('VNOI Online Judge', 'CLB Olympic Tin học VN', 'https://oj.vnoi.info', 'community', '2010-2026', '["B","C1","C2"]', 'verified'),
('LQDOJ', 'CLB Tin Lê Quý Đôn ĐN', 'https://lqdoj.edu.vn', 'community', '2020-2026', '["B","C1","C2"]', 'verified'),
('Google Drive cộng đồng', 'Cộng đồng GV Tin học', NULL, 'community', '2018-2024', '["A","B"]', 'unverified');
```

---

## 5. QUERY PATTERNS THƯỜNG DÙNG

### 5.1. Lấy danh sách bài có filter

```typescript
// lib/db/queries/problems.ts
export async function getProblems(filters: ProblemFilters) {
  const query = db
    .select({
      id: problems.id,
      code: problems.code,
      title: problems.title,
      difficulty: problems.difficulty,
      board: problems.board,
      sourceYear: problems.sourceYear,
      totalSubmissions: problems.totalSubmissions,
      acceptedSubmissions: problems.acceptedSubmissions,
      acRate: sql<number>`
        CASE WHEN ${problems.totalSubmissions} > 0 
        THEN ROUND(${problems.acceptedSubmissions}::numeric / ${problems.totalSubmissions} * 100, 1)
        ELSE 0 END
      `.as('ac_rate'),
    })
    .from(problems)
    .where(
      and(
        filters.board ? eq(problems.board, filters.board) : undefined,
        filters.difficulty ? eq(problems.difficulty, filters.difficulty) : undefined,
        filters.year ? eq(problems.sourceYear, filters.year) : undefined,
        filters.search ? ilike(problems.title, `%${filters.search}%`) : undefined,
      )
    )
    .orderBy(desc(problems.createdAt))
    .limit(filters.limit ?? 20)
    .offset(filters.offset ?? 0);

  return query;
}
```

### 5.2. Tính scoreboard contest

```typescript
// lib/db/queries/scoreboard.ts
export async function getScoreboard(contestId: string) {
  return db
    .select({
      userId: contestParticipants.userId,
      displayName: users.displayName,
      totalScore: contestParticipants.totalScore,
      totalPenalty: contestParticipants.totalPenalty,
      rank: contestParticipants.rank,
    })
    .from(contestParticipants)
    .innerJoin(users, eq(contestParticipants.userId, users.id))
    .where(eq(contestParticipants.contestId, contestId))
    .orderBy(
      desc(contestParticipants.totalScore),
      asc(contestParticipants.totalPenalty)
    );
}
```
