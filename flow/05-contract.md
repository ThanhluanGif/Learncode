# Stage 05 — Interface Contract (the seam)

The contract is whatever sits between your core and its consumer. For a web app that's
API endpoints (the table below). For a CLI it's commands + flags + output shapes; for a
plugin it's hooks + filters; for a pipeline it's input/output file schemas. Keep the
table's SPIRIT — every feature maps to an interface, every interface has its shapes
written before code — and adapt the columns to your project's shape.

Written BEFORE any code. Backend cards build TO this table; UI cards consume FROM it.
The #1 AI-build failure is producer/consumer drift — backend ships one shape, UI assumes
another, both look green. This file is the cheap fix.

## Gate — check ALL before `/flow next`
- [x] Every PRD feature maps to at least one INTERFACE below (web: endpoint · cli: command · library: public function · skill: command/file)
- [x] Every interface has its INPUT and OUTPUT shapes written (web: request+response · cli: flags+output/exit code · library: args+return)
- [x] Access/effects column filled for every interface (web: public/token/admin · non-web: writes/side-effects, or "none")
- [x] No FILL placeholders remain in this file

## OpenAPI / Swagger rule  (web only — N/A for cli/library/skill)

For non-web types there is no served spec; the equivalent "no producer/consumer drift" check
is the per-type done-evidence (the command runs / the API imports / the skill installs+runs).
For `web`:

This table is the PLANNING source of truth. If the framework serves a spec (FastAPI →
`/openapi.json` + `/docs`), the served spec is the RUNTIME artifact of this same contract:
- Path/method/shapes here and in the served spec must agree — the contract-test card
  asserts every endpoint in this table exists in the live `/openapi.json` with matching
  request/response shapes.
- Change flows ONE way: amend this file first, then the code, then the spec follows.
- **Docs land with the API, not after**: the served spec is live from the vertical-slice
  card onward, and every backend card's verify checks its endpoints appear in the live
  `/docs` with correct schemas. The contract-test card later asserts full agreement —
  but by then the docs have been growing card by card, never a catch-up task.
- Keep `/docs` enabled at least until v1 ships — it's the free human-readable contract.

## Interfaces  (web: endpoints · cli: commands · library: functions · skill: commands)

Adapt the columns to your project type. Web: Method/Path/Access(=auth: public/token/admin)/
Request/Response. CLI: Command/Flags/Access(=side-effects)/Input/Output+exit. Library:
Function/—/Access(=none)/Args/Return. The shared column below is "Access/Effects".

| Method/Interface | Path/Name | Access/Effects | Input shape | Output shape |
|---|---|---|---|---|
| GET | `/api/me` | `token`; đọc/tạo learner cho email hiện tại | Header `oai-authenticated-user-email: string`; body none | `200 { learner: Learner }`; `401 ApiError` |
| GET | `/api/library` | `token`; read-only catalog + dữ liệu phiên gần đây của chính user | Query `{ q?: string<=100, year?: int, division?: A\|B\|C1\|C2, round?: string<=60, topic?: string<=60, sourceStatus?: official\|community\|legacy\|unverified, examId?: int }`; identity header | `200 LibraryResponse`; `400/401/500 ApiError` |
| GET | `/api/learning` | `token`; chỉ đọc records thuộc learner hiện tại | Query `{ limit?: int 1..100 }`; identity header | `200 LearningOverview`; `400/401/500 ApiError` |
| POST | `/api/learning` | `token`; ghi session/attempt/reflection chỉ cho learner hiện tại | Body `LearningCommand` discriminated by `action`; identity header | `200/201 LearningCommandResult`; `400/401/404/500 ApiError` |
| GET | `/api/progress` | `token`; aggregate records của learner hiện tại, không ghi | Query none; identity header | `200 ProgressResponse`; `401/500 ApiError` |
| POST | `/api/pilot-feedback` | `token`; upsert một feedback tối thiểu cho learner hiện tại | Body `PilotFeedbackInput`; identity header | `201 { feedback: PilotFeedbackReceipt }`; `400/401/500 ApiError` |
| GET | `/api/pilot-feedback` | `token`; chỉ trả aggregate ẩn danh, không trả email/comment từng người | Query none; identity header | `200 { summary: PilotFeedbackSummary }`; `401/500 ApiError` |
| GET | `/api/health` | `public`; read-only, không lộ secret/PII | Query none; body none | `200 { status: "ok", database: "ok", version: "v1" }` hoặc `503 { status: "degraded", database: "error", version: "v1" }` |
| GET | `/openapi.json` | `public`; read-only runtime contract | Query none; body none | `200 OpenAPI 3.1 JSON` có đủ mọi endpoint trong bảng này, kể cả response `text/html` của `/docs` |
| GET | `/docs` | `public`; read-only human-readable API reference | Query none; body none | `200 text/html` hiển thị link `/openapi.json`, endpoint, access và schema chính |

## Shared shapes (objects used by multiple interfaces)

```ts
type ApiError = {
  error: {
    code: "AUTH_REQUIRED" | "VALIDATION_ERROR" | "NOT_FOUND" | "DATABASE_ERROR";
    message: string;
    issues?: Array<{ path: string; message: string }>;
  };
};

type Learner = {
  id: number;
  displayName: string;
  division: "A" | "B" | "C1" | "C2";
  schoolLevel: "Tiểu học" | "THCS" | "THPT";
  xp: number;
  createdAt: string;
}; // email là khóa identity phía server, không trả về catalog/aggregate.

type ContentSource = {
  id: number; slug: string; title: string; provider: string;
  sourceType: "problem_bank" | "contest" | "pdf" | "community";
  url: string; isOfficial: boolean; yearFrom: number | null; yearTo: number | null;
  usagePolicy: "link_only" | "reuse_allowed" | "unknown";
  verifiedAt: string | null;
};

type ExamPaper = {
  id: number; year: number; title: string; round: string;
  division: "A" | "B" | "C1" | "C2";
  durationMinutes: number | null; totalPoints: number | null;
  officialUrl: string; sourceStatus: "official" | "community" | "legacy" | "unverified";
  sourceTitle: string; sourceId: number;
};

type Problem = {
  id: number; examPaperId: number | null; externalId: string; title: string;
  division: "A" | "B" | "C1" | "C2" | "B/C"; topics: string[];
  difficulty: string; points: number; timeLimitMs: number | null;
  officialUrl: string; shortDescription: string;
  sourceMetadata: { judgeUrl?: string; statementType?: "link" | "stored"; licenseNote?: string };
};

type StudySession = {
  id: number; examPaperId: number | null; mode: "exam" | "practice";
  status: "active" | "paused" | "completed"; targetMinutes: number;
  score: number | null; startedAt: string; pausedAt: string | null;
  completedAt: string | null; updatedAt: string;
};

type ProblemAttempt = {
  id: number; studySessionId: number | null; problemId: number;
  status: "AC" | "WA" | "TLE" | "MLE" | "RTE" | "CE" | "PE" | "attempted";
  score: number; language: string; confidence: 1 | 2 | 3 | 4 | 5;
  timeSpentSeconds: number; submittedAt: string;
};

type LearningReflection = {
  id: number; studySessionId: number | null; problemId: number | null;
  successNote: string; errorNote: string; causeNote: string; solutionNote: string;
  nextAction: string; reviewAt: string | null; createdAt: string;
};

type LearningCommand =
  | { action: "start_session"; examPaperId?: number; mode?: "exam" | "practice"; targetMinutes?: number }
  | { action: "set_status"; sessionId: number; status: "active" | "paused" | "completed"; score?: number }
  | { action: "record_attempt"; sessionId?: number; problemId: number; status: ProblemAttempt["status"]; score: number; language: string; confidence: 1|2|3|4|5; timeSpentSeconds: number }
  | { action: "save_reflection"; sessionId?: number; problemId?: number; successNote?: string; errorNote?: string; causeNote?: string; solutionNote?: string; nextAction?: string; reviewAt?: string };

type LearningCommandResult =
  | { action: "start_session"; session: StudySession; problems: Problem[] }
  | { action: "set_status"; session: StudySession }
  | { action: "record_attempt"; attempt: ProblemAttempt }
  | { action: "save_reflection"; reflection: LearningReflection };

type LearningOverview = {
  sessions: StudySession[]; attempts: ProblemAttempt[]; reflections: LearningReflection[];
};

type LibraryResponse = {
  sources: ContentSource[]; exams: ExamPaper[]; problems: Problem[];
  recentSessions: StudySession[];
  stats: { sources: number; exams: number; problems: number; attempts: number };
  appliedFilters: { q: string | null; year: number | null; division: string | null; round: string | null; topic: string | null; sourceStatus: string | null; examId: number | null };
};

type ProgressResponse = {
  totals: { sessions: number; completedSessions: number; attempts: number; accepted: number; studySeconds: number };
  topics: Array<{ topic: string; attempts: number; accepted: number; averageConfidence: number; strength: "strong" | "developing" | "review" }>;
  commonErrors: Array<{ status: string; count: number }>;
  nextReviews: Array<{ reflectionId: number; reviewAt: string; nextAction: string; reason: string }>;
};

type PilotFeedbackInput = {
  role: "student" | "teacher";
  rating: 1 | 2 | 3 | 4 | 5;
  completedCycle: boolean;
  minutesSpent: number; // 1..180
  comment?: string; // <=1000, không nhập tên/email/số điện thoại
};
type PilotFeedbackReceipt = { id: number; rating: number; completedCycle: boolean; submittedAt: string };
type PilotFeedbackSummary = { participants: number; completedCycles: number; usefulRatings: number; averageRating: number; medianMinutes: number };
```

## Feature → interface map

Reference each PRD feature by its `FRn` id so the mapping is machine-checkable
(`/flow consistency` flags any `FRn` with no interface here).

- FR1 → `GET /api/me`, `GET|POST /api/learning`, `GET /api/progress`, `GET|POST /api/pilot-feedback`
- FR2 → `GET /api/library`
- FR3 → `GET /api/library`
- FR4 → `GET|POST /api/learning`
- FR5 → `GET /api/progress`
- FR6 → `GET /api/health`, `GET /openapi.json`, `GET /docs`, và schema/error của mọi API trong bảng
- FR7 → `GET|POST /api/pilot-feedback`
