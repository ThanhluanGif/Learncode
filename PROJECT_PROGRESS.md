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
| Contract | IN_PROGRESS | Stage 05 đã mở |
| Build cards | TODO | Chưa tạo |
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
