# Stage 00-inspect — Brownfield assessment (existing codebase)

Run this BEFORE planning when the project ALREADY EXISTS. Goal: an honest current-state map so
planning starts from reality, not a blank page. Fill every section from EVIDENCE (read the code),
then check the gate. `/flow assess` seeds the auto-scan and validates this gate.

## Gate — check ALL before planning
- [x] I detected the stack / build / test / run commands (from real files; listed below)
- [x] I mapped the main components/modules and entry points
- [x] I assessed current functionality state (works / partial / broken) with file evidence
- [x] I assessed UI/UX state vs the product's stated goals (or noted "no UI")
- [x] I listed the top risks / tech-debt / known issues
- [x] I noted the test + quality baseline (what is covered vs not)
- [x] A human reviewed this assessment (confirmed by operator on 2026-07-13)
- [x] No placeholder remains in this file

## Detected (auto-scan)

- Runtime: Node.js >= 22.13, TypeScript, React 19 and Next.js 16 through Vinext/Vite (`package.json:5-14`, `package.json:16-39`).
- Data: Cloudflare D1 accessed through Drizzle ORM (`db/index.ts`, `db/schema.ts`).
- Hosting: Sites/Cloudflare Worker with logical D1 binding `DB` (`.openai/hosting.json:1-5`, `worker/index.ts`).
- UI: one client-side application surface in `app/page.tsx`; global styling in `app/globals.css`; Vietnamese metadata in `app/layout.tsx:16-27`.
- API: `GET /api/library`; `GET|POST /api/learning`.
- Commands: `npm run dev`, `npm run build`, `npm run lint`, `npm test`, `npm run db:generate` (`package.json:8-14`).
- CI: no checked-in GitHub Actions or equivalent pipeline was detected.
- Product specification: `/Volumes/sdd anh/studyLAB/tin_hoc_tre_implementation_plan_ai.md` (source outside this repository, supplied by the operator).

## Ranked surfaces (auto-scan — read these first)
The auto-scan ranks source files by how widely their symbols are referenced (highest-leverage
code first). The following ranked surfaces were inspected:

1. `db/schema.ts`: eight normalized tables exist for sources, exams, problems, learners, sessions, attempts, reflections and saved problems. Indexes cover common source/exam/problem/session queries (`db/schema.ts:13-123`).
2. `app/api/learning/route.ts`: start, pause/resume/complete, attempt and reflection operations exist, but all requests are assigned to the hard-coded learner `1` (`app/api/learning/route.ts:5-11`, `app/api/learning/route.ts:29-130`).
3. `app/page.tsx`: dashboard, roadmap, practice, contest, library and study-workspace UI are implemented in a single large client component; several buttons remain presentation-only.
4. `app/api/library/route.ts`: query, year and division filters exist, but library results and recent sessions are also tied to learner `1` (`app/api/library/route.ts:13-70`).
5. `app/chatgpt-auth.ts`: helper code can read a ChatGPT user identity, but the learning API does not use it.
6. `tests/rendered-html.test.mjs`: tests still assert the removed starter skeleton rather than the current application (`tests/rendered-html.test.mjs:31-86`).

## What this product is (from docs/specs/code, not guesses)

Tin học trẻ LAB is a Vietnamese learning and exam-practice web application for primary, lower-secondary and upper-secondary students preparing for Tin học trẻ competitions. Its core job is to organize verified learning sources and official exam metadata, let a learner run timed study sessions, record attempts and reflections, and eventually support an automated judge and mock contests. The current implementation is a functional learning-library prototype, not yet a complete Online Judge.

## Current functionality state (evidence)

| Surface | State | Evidence |
| --- | --- | --- |
| Dashboard, roadmap and static practice UI | Works as interactive prototype | `app/page.tsx` renders all primary views and modal interactions. |
| Verified-source library | Partial | DB schema and `GET /api/library` exist; five year cards are partly static in `app/page.tsx`. |
| Study session lifecycle | Works locally | Start, pause/resume, complete, attempts and reflections are implemented in `app/api/learning/route.ts:43-130`; the modal is in `app/page.tsx`. |
| Persistent D1 schema | Works locally | Eight tables plus seed data are defined in `db/schema.ts` and `drizzle/0000_thin_triathlon.sql`. |
| Per-user ownership | Broken/insecure | `const learnerId = 1` in `app/api/learning/route.ts:11`; recent sessions use learner `1` in `app/api/library/route.ts:55`. |
| Automated judge | Missing | No submission, test case, judge queue, sandbox or result tables/routes exist. |
| Mock contest backend | Missing | Contest screen is static; no contest or scoreboard schema/API exists. |
| Source import pipeline | Missing | Seed data is manual; there is no verified ingestion or admin workflow. |
| OpenAPI contract and health endpoint | Missing | No `/openapi.json` or `/healthz` route exists. |
| Production verification | Partial | A Sites project and D1 binding exist, but the current code lacks automated live contract/e2e verification. |

## UI / UX state vs product goals

Present:

- coherent Vietnamese dashboard and navigation;
- roadmap tabs for A/B/C;
- practice list, contest mock, verified-source library;
- timed study workspace with self-score, confidence and reflection fields;
- responsive rules for tablet and mobile.

Gaps:

- the UI mixes real persisted data with static/demo values, so users cannot tell what is authoritative;
- key learning buttons such as supplementary resources and skill-map actions are stubs;
- there is no submission editor, judge feedback, contest participation or progress-history screen;
- the sidebar shows a fixed learner identity and fixed statistics;
- the single `app/page.tsx` file makes feature isolation and QA difficult;
- accessibility and keyboard workflows have not been systematically tested.

## Risks / tech-debt / known issues

1. **P0 authorization/data ownership:** every request operates as learner `1`; this can mix data between users (`app/api/learning/route.ts:11`, `app/api/library/route.ts:55`).
2. **P0 tests are stale:** `npm test` runs two starter-skeleton tests that cannot represent the product and both fail (`tests/rendered-html.test.mjs:31-86`).
3. **P0 contract drift risk:** no written/served HTTP contract exists; UI and backend can silently diverge.
4. **P1 source integrity:** official/community/legacy metadata exists, but no repeatable importer, checksum, review status transition or duplicate handling exists.
5. **P1 judge security:** executing untrusted code is a security-class feature requiring sandboxing and an explicit architecture decision; it must not be approximated inside the web worker.
6. **P1 monolithic UI:** most product logic is concentrated in `app/page.tsx`, raising regression risk.
7. **P2 production evidence:** build/deploy status is not equivalent to live user-flow proof; no live contract or browser checks are in the repository.

## Test + quality baseline

Baseline executed on 2026-07-13:

- `npm run lint`: PASS.
- `npm run build`: PASS; routes `/`, `/api/library` and `/api/learning` are emitted.
- `npm test`: FAIL, 0/2 tests pass.
  - failure 1: Node cannot import the `cloudflare:` scheme used by the built worker;
  - failure 2: test expects deleted `app/_sites-preview/SkeletonPreview.tsx`;
  - both tests assert starter copy rather than current product behavior.
- Migration smoke: previously verified against SQLite with 3 sources, 2 exams, 9 problems and valid foreign keys.
- Local API workflow: previously verified from session creation through attempt, reflection and completion.
- Coverage: no coverage tool or threshold is configured.
- Missing: API contract tests, authorization tests, migration tests, deployed smoke tests, accessibility tests and browser E2E.

## Verdict

The codebase is healthy enough to build on because lint and production compilation pass and the D1-backed study workflow is already a useful vertical slice. The first build work must fix identity/authorization boundaries, replace stale tests with product tests, add a health endpoint and contract, and separate static demo data from persisted data. Automated judge execution is a later security-class project and requires an isolated runner architecture before implementation.

<!-- auto-scan -->
stack:
  - node (package.json)
context files present:
  - README.md
  - tests
ranked surfaces (most-referenced first - inspect these before planning):
  1. db/schema.ts  (score 116; problems, studySessions, examPapers)
  2. app/api/learning/route.ts  (score 96; sessionId, learnerId, problemId)
  3. app/page.tsx  (score 63; response, Icon, navigate)
  4. app/api/library/route.ts  (score 59; year, division, query)
  5. app/chatgpt-auth.ts  (score 37; user, email, safeReturnTo)
  6. examples/d1/app/api/notes/route.ts  (score 33; detail, content, combined)
  7. examples/d1/db/schema.ts  (score 9; notes)
  8. db/index.ts  (score 8; getDb)
  9. app/layout.tsx  (score 3; beVietnam, jetBrainsMono, metadata)
  10. vite.config.ts  (score 3; isCodexSeatbeltSandbox, SITE_CREATOR_PLACEHOLDER_DATABASE_ID, localBindingConfig)
