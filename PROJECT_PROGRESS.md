# Tiến trình hoàn thành dự án

## Quy ước trạng thái

- `DONE`: đã có bằng chứng và commit.
- `IN_PROGRESS`: đang thực hiện.
- `BLOCKED`: đang chờ gate hoặc quyết định bắt buộc.
- `TODO`: chưa bắt đầu.

## Tổng quan

| Chặng | Trạng thái | Bằng chứng gần nhất |
| --- | --- | --- |
| Khởi tạo Flow | DONE | Flow mode `work`, project type `web` |
| Đánh giá codebase hiện tại | DONE | Mechanical gate PASS sau xác nhận của chủ dự án |
| Idea | DONE | Mechanical + semantic gate PASS |
| Research | DONE | Mechanical + semantic gate PASS; có 3 đối thủ, 3 phản hồi thật và GTM cụ thể |
| Scope | DONE | Chủ dự án xác nhận GO; mechanical + semantic gate PASS |
| PRD | DONE | FR1–FR7, pain mapping và numeric success metric PASS |
| ADR | DONE | Mechanical + semantic gate PASS; 7 quyết định đã lưu vào harness |
| Contract | DONE | Stage 05 mechanical + semantic PASS; path-resolution PASS |
| Build cards | BLOCKED | C-001–C-004 bị hạ về `todo` sau khi audit phát hiện local evidence được dùng thay live evidence; C-005 dừng |
| Review | TODO | Chưa bắt đầu |
| Deploy | BLOCKED | Version 6 là deployment cũ; source C-002–C-004 chưa có deployment hợp lệ |
| Verify live | BLOCKED | Production private vẫn trả platform HTML `500` cho anonymous và bypass-owner |
| Retro | TODO | Chưa bắt đầu |

## Nhật ký

### 2026-07-13 - Baseline

- Đã đọc đặc tả AI tại `/Volumes/sdd anh/studyLAB/tin_hoc_tre_implementation_plan_ai.md`.
- Đã kích hoạt quy trình Flow ở mode `work` cho dự án web brownfield.
- Đã lập bản đồ stack, module, chức năng hiện có, rủi ro và khoảng trống sản phẩm.
- QA baseline: lint PASS, build PASS, test FAIL 0/2.
- Mechanical assessment gate đã chạy và dừng đúng tại yêu cầu xác nhận của con người (`flow/00-inspect.md:14`).
- Chủ dự án đã xác nhận assessment; mechanical gate PASS.
- Idea đã định vị sản phẩm là lớp học tập quanh kho đề chính thức và Online Judge ngoài.
- Research đã mở trực tiếp VNOJ, HNOJ, LQDOJ; ghi nhận ba phản hồi người học, giá tham chiếu và kênh thử nghiệm VNOI.
- Stage 01 qua mechanical gate và semantic challenge; Scope được mở để chốt v1/cut list.
- Scope đề xuất sáu build cards trong 24–36 giờ agent, tái kiến trúc judge nội bộ cấp C thành deep-link judge ngoài cấp B.
- `flow status` báo gate Scope `PASS` ở mức cơ học; semantic challenge không phát hiện grade laundering hoặc feature L-impact quá đắt.
- Bước tiếp theo: chủ dự án duyệt quyết định GO và cut list; chỉ sau xác nhận mới chạy `flow next` để mở PRD.

### 2026-07-13 - Scope và PRD

- Chủ dự án xác nhận tiếp tục theo Flow, được ghi nhận là sign-off quyết định GO.
- Scope gate PASS và mở PRD; không có grade laundering, mọi tính năng cấp C nằm trong cut list hoặc được tái kiến trúc.
- PRD chốt FR1–FR7, trace từ pain đến feature và metric pilot định lượng.
- Stage 03 mechanical + semantic gate PASS; ADR được mở.
- ADR quyết định D1/Drizzle, identity Sites phía server, deploy private, judge ngoài, provenance/bản quyền, contract seam và roadmap có giải thích.
- Stage 04 mechanical + semantic gate PASS; 7/7 decision records lưu bền; Contract được mở.
- Contract chốt 10 interface, shared shapes, error/auth semantics và map đầy đủ FR1–FR7.
- Stage 05 mechanical + semantic gate PASS; `flow contract` không phát hiện prefix drift.
- `flow constitution` được bỏ qua đúng quy định vì dự án chưa có constitution tùy chọn.

### 2026-07-13 - Card set

- Tạo sáu cards theo đúng ngân sách Scope: foundation, catalog, learning domain, contract proof, UI mock, production frontend.
- 6/6 `flow check` PASS ở trạng thái todo.
- Cross-artifact consistency PASS: 7/7 FR được card claim và contract phục vụ; không có scope/cut-list/terminology drift được phát hiện.
- `flow ready`: chỉ C-001 buildable; các card sau bị chặn đúng theo dependency chain.

### 2026-07-13 - C-001 local implementation

- Thêm identity resolver từ header Sites, unique learner email, `/api/me`, `/api/health`, `/openapi.json` và `/docs`.
- Thay test starter lỗi thời bằng 4 product tests: auth required, two-identity separation, 10 contract interfaces và migration identity.
- Migration tương thích cả D1 fresh lẫn brownfield; hai môi trường đều áp dụng `0000` + `0001` thành công.
- QA cuối local: lint PASS; build PASS; test PASS 4/4; Flow design mechanical + semantic PASS; local HTTP health/auth/OpenAPI/docs PASS.
- Bước tiếp theo: commit implementation, publish private, lấy live evidence rồi đóng C-001.
- Deployment v3 tạo thành công nhưng live QA đỏ `500`; C-001 không được làm tròn trạng thái.
- Artifact v3 có hai khuyết điểm thật: duplicate D1 binding và build lấy sai thư mục migration. Artifact v4 đã sửa, QA local + production-bundle PASS và deploy thành công.

### 2026-07-13 - C-001 live incident isolation

- Live v4 vẫn trả cùng HTML `500` của nền tảng trên `/`, `/api/health`, `/openapi.json`, `/docs` và `/api/me` dù deployment báo `succeeded`.
- Chạy chính `dist/server/wrangler.json` bằng Wrangler: Worker khởi tạo thành công; `/openapi.json` và `/docs` trả `200`, `/api/me` thiếu identity trả `401` đúng contract.
- Rollback kiểm soát sang version 2 từng hoạt động (D1) và version 1 (không D1): cả hai deployment đều `succeeded` nhưng production hostname vẫn trả đúng cùng HTML `500`.
- OpenAI Status đồng thời công bố sự cố đang điều tra: [Elevated errors when creating sites in ChatGPT](https://status.openai.com/incidents/01KXDMD4T8TM58CSKBN7YFD2CK).
- Đã restore version 4 làm deployment production hiện tại. C-001 giữ trạng thái chưa hoàn thành; chỉ live gate bị chặn, không có QA local nào còn đỏ.
- OpenAI Status chuyển incident sang `Resolved` lúc 12:59. Redeploy version 4 sau phục hồi vẫn 500.
- Đã push commit `b202b22`, đóng gói lại artifact và tạo version 5 hoàn toàn mới sau phục hồi; deployment `succeeded` nhưng hostname vẫn trả platform 500.
- QA bằng phiên trình duyệt đăng nhập thật: site hiện trang “Continue with ChatGPT”, nhưng `/signin-with-chatgpt` của chính site trả platform 500; bypass-token cũng 500.
- Vòng tiếp tục Flow: rotate bypass token vẫn 500; lint PASS, build PASS, test 4/4 và fresh D1 migration 2/2 tiếp tục xanh.
- Đã push commit `b160ea6`, đóng gói artifact sạch và tạo version 6; deployment private `succeeded` nhưng `/`, `/openapi.json`, `/docs`, `/api/health`, `/api/me` vẫn trả cùng platform HTML 500.
- Bước tiếp theo: kiểm tra lại auth/dispatch khi project Sites thực sự phục hồi; sau đó chạy năm live checks, đóng ERR-014/DBG-009, điền done-evidence và gọi `flow card done C-001`.

### 2026-07-13 22:04 +07 - Kích hoạt vòng thực thi liên tục

- Flow resume xác nhận C-001 vẫn in-flight; C-002 đến C-006 bị dependency chặn đúng thiết kế.
- OpenAI Status vẫn ghi incident chung đã `Resolved`, nhưng kiểm tra production mới nhất cho thấy version 6, access `custom`, và cả năm route vẫn trả platform HTML `500`.
- Chu trình tiếp tục được cố định: kiểm tra live -> sửa khi có nguyên nhân thuộc code -> lint/build/test/migration -> cập nhật card và ba báo cáo -> commit/push -> đóng gói/deploy private -> verify live.
- Không tạo version/deployment mới khi chỉ thay đổi báo cáo và artifact ứng dụng không đổi; việc lặp deployment giống hệt không tạo thêm bằng chứng và có thể che khuất root cause.
- C-001 chỉ được đóng khi world-state live xanh. Sau đó Flow mới mở C-002 và lặp cùng chu trình cho từng card.

### 2026-07-13 22:07 +07 - C-001 dispatch metadata probe

- Sites metadata hợp lệ: project `active`, auth client có mặt, bypass token có mặt, access `custom`, đúng một allowed user, không có allowed group, access revision `1`.
- Cả request có bypass và request ẩn danh đều nhận cùng platform HTML `500`; `/signin-with-chatgpt?return_to=%2F` cũng trả `500` tại Cloudflare edge.
- Kết luận vòng này: không thiếu cấu hình SIWC hoặc access policy trong metadata mà connector công bố; lỗi còn lại nằm ở dispatch/runtime bên ngoài artifact ứng dụng.
- Không sinh version mới vì source ứng dụng và build artifact không đổi. Tiếp tục giữ version 6 và live gate C-001 ở trạng thái chưa đạt.

### 2026-07-13 22:09 +07 - Goal blocked audit đạt ngưỡng

- Goal-loop lần thứ ba liên tiếp tái hiện cùng platform HTML `500` trên `/`, `/openapi.json`, `/docs`, `/api/health`, `/api/me` và `/signin-with-chatgpt?return_to=%2F`.
- Code, exact production bundle, D1 migrations, deployment artifact, auth client, bypass token và custom allowlist đã được kiểm tra; không còn thay đổi an toàn nào trong phạm vi hiện tại có thể cô lập sâu hơn.
- Goal được phép chuyển sang `blocked` theo ngưỡng ba lượt liên tiếp. C-001 giữ `todo`; C-002 đến C-006 vẫn bị dependency chặn.
- Quyền cần từ chủ dự án: cho phép tạm chuyển access policy từ `custom` sang `public`, kiểm tra các route khi bỏ SIWC dispatch, rồi lập tức khôi phục `custom`. Không thực hiện thay đổi quyền khi chưa có xác nhận rõ ràng.

### 2026-07-13 22:19 +07 - Resumed blocked audit 1/3

- Sau yêu cầu tiếp tục, Flow resume xác nhận C-001 vẫn là card duy nhất đang in-flight; chu kỳ blocker sau khi resume được tính lại từ đầu.
- Version 6 vẫn ở chế độ riêng tư `custom`. Sáu route `/`, `/openapi.json`, `/docs`, `/api/health`, `/api/me` và `/signin-with-chatgpt?return_to=%2F` tiếp tục trả platform HTML `500` dù dùng bypass token hiện hành.
- Đây là lần tái hiện thứ nhất trong chu kỳ audit mới. Không đổi access policy vì yêu cầu “tiếp tục” không phải xác nhận rõ ràng cho việc tạm công khai site; không tạo deployment trùng lặp khi artifact ứng dụng không đổi.

### 2026-07-13 22:25 +07 - Resumed blocked audit 2/3

- Sites metadata vẫn hợp lệ: project `active`, version 6, access `custom` revision `1`, một allowed user, không group, auth client và bypass token đều hiện diện.
- Probe ẩn danh trên sáu route trả cùng `500 text/html; charset=utf-8`, kích thước 2.563 byte và trang nền tảng “Something went wrong”.
- Đây là lần tái hiện thứ hai liên tiếp sau resume. Giữ C-001 `todo`, không mở C-002 và không thay đổi access khi chưa có quyền rõ ràng.

### 2026-07-13 22:26 +07 - Resumed blocked audit 3/3

- Metadata tiếp tục không đổi và hợp lệ; cả sáu route lại trả cùng `500 text/html`, 2.563 byte, từ lớp Sites trước khi Worker phục vụ contract.
- Đây là lần tái hiện thứ ba liên tiếp của chu kỳ sau resume. Ngưỡng blocker đã đạt; C-001 giữ `todo`, C-002 đến C-006 tiếp tục bị dependency chặn.
- Goal chuyển `blocked` sau khi commit/push bằng chứng. Đầu vào bắt buộc còn thiếu là quyền chủ dự án để tạm chuyển `custom` sang `public`, kiểm tra read-only rồi khôi phục `custom`, hoặc một thay đổi trạng thái từ nền tảng Sites.

### 2026-07-13 22:30 +07 - New resume cycle audit 1/3

- Người dùng tiếp tục lại toàn bộ mục tiêu C-001 đến C-006 nhưng chưa cấp quyền thay đổi access; chu kỳ blocker sau resume được bắt đầu lại từ lần thứ nhất.
- Sites vẫn `active`, version 6, access `custom` revision `1`, một allowed user, không group và có đủ auth client/bypass token. Sáu route tiếp tục trả cùng platform HTML `500`, 2.563 byte.
- Giữ site private, C-001 `todo` và các card sau chờ dependency. Không redeploy vì source ứng dụng và artifact không thay đổi.

### 2026-07-13 22:35 +07 - New resume cycle audit 2/3

- Chạy ma trận 12 live request: anonymous và bypass-owner trên `/`, `/openapi.json`, `/docs`, `/api/health`, `/api/me`, `/signin-with-chatgpt?return_to=%2F`.
- Cả 12 request cùng trả `500 text/html; charset=utf-8`, kích thước 2.563 byte và trang “Something went wrong”; token bypass không đi được tới Worker contract.
- Đây là lần tái hiện thứ hai của chu kỳ mới. Không có code/artifact thay đổi để triển khai lại; giữ access `custom`, version 6 và C-001 `todo`.

### 2026-07-13 22:42 +07 - Full doc/code retest và audit 3/3

- Đọc lại toàn bộ đặc tả triển khai 630 dòng, PRD, interface contract, C-001 đến C-006 và ba báo cáo. Chuỗi card vẫn khớp phạm vi v1: foundation -> catalog 10 năm -> learning domain -> contract QA -> mock approval -> production UI.
- QA code tại thời điểm đó: lint PASS, build PASS, test 4/4; fresh D1 áp dụng `0000` + `0001`, có cột `learners.email`. Exact production bundle với D1 trả health/OpenAPI/docs `200`, thiếu identity `/api/me` `401`, có identity `200`.
- Live QA private chạy 12 request anonymous/bypass-owner; cả 12 cùng trả platform HTML `500`, 2.563 byte. Đây là lần thứ ba của chu kỳ mới, nên blocker đạt ngưỡng trở lại.
- Không có thay đổi source ứng dụng để tạo version mới. C-001 giữ `todo`; bước bắt buộc vẫn là quyền tạm kiểm thử `public` hoặc Sites external-state recovery.

### 2026-07-13 22:51 +07 - Đối chiếu cấu trúc doc và resume audit 1/3

- Đọc cấu trúc `PROJECT_PLAN.md` và tài liệu trong `docs/`, đồng thời đối chiếu với đặc tả 630 dòng, PRD, ADR, contract, cards và repository hiện tại.
- Bộ doc mới mô tả kiến trúc mở rộng Next.js 15/PostgreSQL/Redis/BullMQ/NextAuth/Vercel/Judge/AI; code thực tế dùng Next.js 16.2.6, D1, Sites identity và Cloudflare Workers. ADR v1 chủ động loại judge/contest khỏi phạm vi và dùng Online Judge ngoài.
- Quyết định Flow hiện hành: `flow/03-prd.md`, `flow/04-adr.md`, `flow/05-contract.md` và C-001 đến C-006 vẫn là nguồn triển khai đã gate. Bộ doc mới được xem là target architecture chưa phê duyệt, không được dùng để đổi stack giữa C-001.
- Live resume audit 1/3 lúc 22:51 chạy 12 request anonymous/bypass-owner; cả 12 tiếp tục platform HTML `500`, 2.563 byte. Giữ C-001 `todo`, không deploy artifact trùng và không mở C-002.

### 2026-07-13 23:05 +07 - Full test trên workspace hiện hành

- Workspace hiện hành được phát hiện tại `/Volumes/sdd anh/studyLAB/Learncode`; history có các commit provisional C-002, C-003 và C-004 đã được push nhưng chưa có deployment hợp lệ.
- Lần chạy đầu: lint FAIL với 5 errors/3 warnings trong code C-002–C-004. Đã sửa type/catch/import trong phạm vi regression; rerun lint/build PASS và product tests PASS 12/12.
- Fresh D1 migrations PASS 3/3; catalog seed chạy hai lần không lỗi và giữ 3 sources, 2 exams, 9 problems. Exact bundle health/OpenAPI/docs trả `200`, missing auth `401`, authenticated identity/library trả `200`.
- Semantic QA phát hiện `/api/library?year=2022&division=B` trả zero exams; seed chỉ có hai exam rows, chưa đạt “latest ten completed seasons”. Contract verifier cũ cũng không kiểm tra điều kiện này.
- `QA_CONTRACT_REPORT.md` dùng `http://localhost:3001` nhưng ghi “Deployed URL”; C-001–C-004 đã bị đánh done bằng local evidence. Audit đã khôi phục cả bốn card về `todo`, uncheck các live/coverage gate chưa đạt và dừng C-005.
- Live Sites version 6 vẫn 12/12 platform HTML `500` ở anonymous/bypass-owner. Không coi local QA là live proof và không mở C-006.

### 2026-07-13 23:17 +07 - QA lại sau hợp nhất tài liệu

- Khôi phục đầy đủ các audit 22:30–22:51 vào card C-001 và ba báo cáo; phân loại bộ `PROJECT_PLAN.md`/`docs/` đã merge là target architecture chưa qua gate, còn Flow v1 là nguồn triển khai hiện hành.
- `npm run lint` PASS; `npm test` PASS 12/12; `npm run build` PASS. Cross-artifact consistency PASS 7/7 FR và `flow check` PASS cho C-001–C-004 ở trạng thái `todo`.
- Fresh D1 migrations PASS 3/3 và seed thành công. Truy vấn schema xác nhận 3 sources, 2 exams, 9 problems; hai exam rows vẫn bị drift: `2025/B` mang title 2022 và `2022/A` mang title 2023.
- Exact production bundle trả OpenAPI `200`, năm protected route thiếu auth đều `401`, authenticated `/api/me` và library đều `200`. Strict verifier dừng đúng tại assertion “Expected the official 2022 B exam metadata”.
- Không deploy code provisional vì C-002/C-004 đang đỏ và C-001 chưa có live proof; tránh tạo thêm version không thể qua gate.

### 2026-07-13 23:22 +07 - Security hotfix cho WebSocket contract

- Semgrep finding được tái hiện bằng regression test mới: test FAIL và định danh `docs/BA_WORKFLOW.md` là tài liệu duy nhất còn công bố WebSocket plaintext.
- Hai endpoint ví dụ submission/realtime đã đổi sang `wss://`; contract bổ sung yêu cầu production chỉ phát hành kết nối mã hóa và client phải từ chối hạ cấp.
- Focused security test PASS 1/1; quét repository không còn chuỗi endpoint WebSocket plaintext. Đây là hotfix tài liệu/security test, không phải bằng chứng runtime realtime-judge đã được triển khai.
- Full QA sau sửa: lint PASS, production build PASS, tests PASS 13/13; Flow consistency PASS 7/7 FR và C-001 mechanical check PASS ở trạng thái `todo`.
- C-001 vẫn in-flight và C-002/C-004 vẫn đỏ ở các gate độc lập; security hotfix không làm tròn trạng thái card.

## Commit theo chặng

| Commit | Nội dung | QA |
| --- | --- | --- |
| `FLOW-000` | Khởi tạo hồ sơ Flow và baseline | lint PASS; build PASS; test FAIL đã ghi nhận |
| `FLOW-001` | Đóng gate brownfield assessment | `flow assess` PASS |
| `FLOW-002` | Chốt ý tưởng sản phẩm | Stage 00 mechanical + semantic PASS |
| `FLOW-003` | Nghiên cứu thị trường và hành vi học | Stage 01 mechanical + semantic PASS |
| `FLOW-004` | Soạn phạm vi v1 để duyệt | Scope preflight PASS; dừng tại mandatory sign-off |
| `FLOW-005` | Chốt Scope và PRD | Stage 02/03 mechanical + semantic PASS |
| `FLOW-006` | Khóa kiến trúc v1 | Stage 04 PASS; 7/7 durable decisions PASS |
| `FLOW-007` | Khóa interface contract | Stage 05 + contract path-resolution PASS |
| `FLOW-008` | Chốt bộ sáu build cards | 6/6 card check + consistency PASS |
| `C-001` | Authenticated API foundation (local) | lint/build/test/migrations/design/local HTTP PASS |
| `C-001-DIAG` | Cô lập lỗi live khỏi code và bundle | v4/v2/v1/v5/v6 đều deploy succeeded nhưng cùng platform 500; token mới và sign-in dispatch cũng 500 |
| `C-001-RETEST` | Đọc lại doc và kiểm thử toàn bộ foundation | lint/build/test/migration/exact-bundle PASS; live anonymous/bypass 12/12 platform 500 |
| `C-002-PROVISIONAL` | Catalog API code | Local query 2022+B FAIL (0 exams); ten-season scope chưa đạt |
| `C-003-PROVISIONAL` | Learning domain code | Lint repaired; local tests 12/12, runtime/ownership/live coverage chưa đủ |
| `C-004-PROVISIONAL` | Contract smoke | Local-only report invalidated; strict catalog assertion đang đỏ |
| `C-005-HALTED` | UI mock chưa theo dõi | Không tiếp tục khi dependency C-004 chưa đạt |
| `QA-20260713-2317` | QA lại sau merge docs/report | lint/build PASS; tests 12/12; Flow consistency/check PASS; strict 2022+B RED đúng |
| `SEC-20260713-2322` | Loại WebSocket plaintext khỏi contract | focused RED -> PASS; lint/build PASS; tests 13/13; scan sạch |
