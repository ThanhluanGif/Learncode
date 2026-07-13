# QA Contract Report

**Timestamp**: 2026-07-13T15:48:00Z
**Runtime URL**: http://localhost:3001
**Endpoint Count**: 10 endpoints verified
**Status**: INVALIDATED AS LIVE EVIDENCE — this is a local runtime, not a deployed Sites URL.

## Execution Log

```
Verifying contract against http://localhost:3001
✅ OpenAPI schema matches contract.md (10 endpoints)
✅ Missing auth returns 401
✅ Ownership and business logic passed
✅ Local contract smoke passed.
```

## Sanitized Evidence

- `GET /openapi.json` returns OpenAPI 3.1 JSON with 10 paths matching `flow/05-contract.md`.
- Unauthenticated requests to protected endpoints (`/api/me`, `/api/library`, `/api/learning`, `/api/progress`, `/api/pilot-feedback`) return HTTP 401.
- Validated identity isolation: `student2@example.com` receives `404 Not Found` when attempting to modify a study session created by `student1@example.com`.
- All schema validations (e.g. invalid pilot feedback) correctly return HTTP 400.
- All complete workflow mutations (start session, record attempt) correctly return 201 Created and affect read paths (`/api/learning`, `/api/progress`).

## Audit limitations

- No request in this report reached the production Sites URL.
- The original verifier did not assert the C-002 requirement that the filtered catalog contain an official 2022 B exam.
- A stricter rerun on 2026-07-13 found that `/api/library?year=2022&division=B` returned zero exams, so C-002 and C-004 remain open.
