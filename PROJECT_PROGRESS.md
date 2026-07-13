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
| Build cards | BLOCKED | C-001 local + production-bundle QA PASS; live gate bị chặn bởi sự cố ChatGPT Sites đang được OpenAI điều tra |
| Review | TODO | Chưa bắt đầu |
| Deploy | TODO | Chưa bắt đầu chu kỳ mới |
| Verify live | TODO | Chưa bắt đầu |
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
- Bước tiếp theo sau khi dịch vụ hồi phục: chạy lại năm live checks, đóng ERR-014/DBG-009, điền done-evidence và gọi `flow card done C-001`.

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
| `C-001-DIAG` | Cô lập lỗi live khỏi code và bundle | v4/v2/v1 đều deploy succeeded nhưng cùng platform 500; incident chính thức đang mở |
