# Stage 03 — PRD

1-2 pages max. Test: could a stranger build v1 from this without asking you anything?

## Gate — check ALL before `/flow next`
- [x] Every section below is filled from MY scope decision (stage 02), not re-expanded
- [x] Success metric is a NUMBER, not vibes ("save time" fails; "first response < 2h" passes)
- [x] Each feature names the user action and the observable result, tagged with a stable `FRn:` id
- [x] Pain & gain is a MAPPING TABLE: every pain cites evidence (a stage-01 quote or a named observation), and names the v1 feature that kills it; every v1 feature kills at least one pain
- [x] A stranger could build v1 from this without asking me anything
- [x] No FILL placeholders remain in this file

## Context

Đề Tin học trẻ chính thức đang tồn tại trên cổng tinhoctre.vn, PDF, VNOJ/HNOJ và nhiều kho cộng đồng, nhưng metadata và lịch sử học không đi cùng nhau. Các Online Judge làm tốt việc chấm và thi đấu, trong khi người học vẫn phải tự chọn đề, ghi lỗi và quyết định bài tiếp theo. Codebase hiện có giao diện kho đề, phiên học và D1 nhưng còn hard-code learner, trộn dữ liệu demo/thật, thiếu runtime contract và có test starter đã lỗi thời. v1 biến nền tảng này thành lớp học tập an toàn quanh nguồn/judge chính thức thay vì tự xây máy chấm.

## Target users

- **Chính:** học sinh THCS/THPT Bảng B, C1, C2 đã biết cú pháp C++/Python/Pascal, đang tự luyện đề và dùng Online Judge nhưng chưa có lộ trình/nhật ký thống nhất.
- **Phụ:** học sinh/giáo viên Bảng A cần tra cứu đề có nguồn gốc; v1 chỉ hỗ trợ metadata/liên kết, chưa chấm Scratch/Logo.
- **Pilot:** 10 học sinh hoặc giáo viên bồi dưỡng được mời minh bạch từ group Facebook “VNOI — Diễn đàn Olympic Tin Học Việt Nam”, dùng một đề trong 30 phút và gửi phản hồi tối thiểu.

## Pain & gain (mapping table — the traceability spine of the PRD)

Every row: a concrete pain, the evidence it's real, what people do about it today, the
ONE v1 feature that kills it, and the observable gain. If a feature kills no pain, cut
it; if a pain has no feature, it goes to the "not addressed" list — honestly.

| # | Persona | Pain (concrete) | Evidence (stage-01 quote/source or named observation) | Today's workaround | V1 feature that kills it | Observable gain |
|---|---|---|---|---|---|---|
| P1 | Học sinh B/C | Đề, PDF và judge nằm rải rác, khó biết nguồn nào chính thức | Nhóm 102 người thi Vòng sơ khảo Bảng B 2022 và ba hệ thống riêng được quan sát ở stage 00/01 | Tự tìm web/Drive rồi lưu bookmark | FR2 | Tìm được bản ghi có năm, bảng, vòng, độ tin cậy và URL gốc trong một kho |
| P2 | Học sinh mới luyện CP | Không biết học chủ đề nào tiếp theo hoặc theo thứ tự nào | “I’m not sure what topics I should learn next or in what order.” — stage 01 | Hỏi cộng đồng, dùng spreadsheet/checklist rời | FR5 | Thấy chủ đề yếu, lý do và lịch ôn kế tiếp từ lịch sử của chính mình |
| P3 | Học sinh dùng judge | Verdict ngắn không giúp hiểu nguyên nhân và dễ mắc lại lỗi | “the only feedback i get ... is ‘runtime error’” và “90% I just blank out...” — stage 01 | Thử lại ngẫu nhiên, hỏi nhóm chat, tự ghi sổ | FR4 | Hoàn thành một chu trình đề–judge–kết quả–phản tư–việc tiếp theo có lưu vết |
| P4 | Mọi người học | Dữ liệu học hiện gắn learner `1`, có nguy cơ trộn giữa người dùng | Brownfield assessment: `ERR-003`, query hard-code learner | Dùng bản demo như một tài khoản chung | FR1 | Hai identity chỉ đọc/ghi đúng phiên và phản tư của mình |
| P5 | Học sinh/giáo viên | Danh sách đề thiếu một mô hình lọc nhất quán giữa dữ liệu D1 và demo | Brownfield assessment: UI trộn dữ liệu tĩnh với D1 (`ERR-005`) | Cuộn trang, mở nhiều nguồn và tự đối chiếu | FR3 | Lọc/tìm và mở chi tiết đề từ cùng một nguồn dữ liệu, có empty/error state rõ ràng |
| P6 | Người vận hành | API/UI và test có thể lệch mà không bị phát hiện trước deploy | Baseline: build PASS nhưng test FAIL 0/2; chưa có `/openapi.json` (`ERR-001/002/004`) | Kiểm tra thủ công sau mỗi thay đổi | FR6 | Contract được phục vụ ở runtime, test sản phẩm xanh và lỗi có health/error evidence |
| P7 | Chủ dự án | Chưa có bằng chứng người học hoàn thành chu trình và muốn quay lại | Stage 01 xác định đúng một kênh pilot nhưng chưa có lượt dùng đo được | Suy luận từ tính năng và lượng truy cập | FR7 | Có 10 consented pilot records và tỷ lệ hoàn thành/hữu ích định lượng |

### Pains NOT addressed in v1 (deliberate — tie to the scope cut list)

- Verdict tự động chi tiết theo test → cần Online Judge/sandbox cấp C; v1 lưu verdict tự báo và phản tư, v2 mới tích hợp judge khi có mô hình an toàn.
- Thi thử cùng giờ, scoreboard/penalty/freeze → cần concurrency và contest engine cấp C; v2 sau khi chu trình học cá nhân đạt metric.
- Giáo viên giao bài, quản lý lớp và chấm Scratch/Logo → cần tenancy/rubric/phân quyền riêng; v1 chỉ hỗ trợ tra cứu nguồn Bảng A.

## Problem statement

Người học Tin học trẻ thiếu một nơi đáng tin để đi từ đề chính thức đến phiên luyện có phản tư và quyết định ôn tiếp. Sản phẩm phải hợp nhất metadata, ownership và tiến trình học trong khi tiếp tục dùng judge ngoài cho việc thực thi mã.

## Features (user-centric — action → observable result)

Tag each v1 feature with a stable id `FRn:` (functional requirement) — the traceability
anchor. Every `FRn` must later be claimed by a card (`implements: FRn`) and served by an
interface in the contract (`FRn →`); `/flow consistency` checks this mechanically.

- **FR1:** Là người học đã có identity nền tảng, tôi tạo/xem phiên học và chỉ thấy dữ liệu thuộc identity của mình; identity khác nhận dữ liệu riêng hoặc `403/404`, không có fallback learner dùng chung.
- **FR2:** Là người học, tôi duyệt kho đề 10 năm đã seed vào D1 và thấy mỗi bản ghi có năm, vòng, bảng, nguồn gốc, URL chính thức, trạng thái xác minh và chính sách sử dụng; nội dung chưa rõ quyền chỉ được liên kết.
- **FR3:** Là người học, tôi tìm/lọc kho theo từ khóa, năm, bảng, vòng, chủ đề và trạng thái nguồn, mở chi tiết một đề và thấy kết quả/empty/error state nhất quán từ API.
- **FR4:** Là người học, tôi bắt đầu phiên có thời lượng, mở đề/judge ngoài, ghi verdict/điểm/độ tự tin, hoàn thành phản tư và thấy phiên cùng việc cần làm tiếp theo được lưu.
- **FR5:** Là người học, tôi mở trang tiến độ và thấy tổng thời gian, số phiên, chủ đề mạnh/yếu, lỗi thường gặp và lịch ôn kế tiếp, kèm dữ liệu nào tạo nên mỗi gợi ý.
- **FR6:** Là người vận hành, tôi mở `/openapi.json` và `/api/health`, chạy bộ test sản phẩm trong runtime tương thích và thấy contract/API/DB đồng bộ; UI phân biệt demo với dữ liệu tài khoản.
- **FR7:** Là người tham gia pilot có đồng ý, tôi gửi đánh giá 1–5 sau một phiên; chủ dự án thấy số người tham gia, hoàn thành và điểm hữu ích tổng hợp, không thấy PII không cần thiết.

## Non-functional requirements

- Ownership được cưỡng chế phía server cho mọi query/mutation; không nhận learner id từ client làm nguồn tin cậy.
- Không thực thi mã nguồn người dùng và không sao chép toàn văn tài liệu chưa rõ quyền sử dụng.
- API JSON có schema ổn định, lỗi `4xx/5xx` có mã/mô tả; `/openapi.json` là runtime artifact của `flow/05-contract.md`.
- D1 migration phải idempotent đối với seed provenance và có index cho năm/bảng/vòng/topic/status.
- Giao diện responsive từ 360 px, điều khiển bàn phím được, semantic HTML, contrast đọc được và trạng thái loading/empty/error rõ ràng.
- QA bắt buộc: lint, build, test sản phẩm, migration local, kiểm tra hai identity và live smoke sau deploy.

## Tech stack

- Frontend/runtime: React 19 + Next.js App Router API surface chạy qua Vinext/Vite.
- Backend: Route Handlers TypeScript, Zod cho validation và OpenAPI JSON tĩnh được kiểm tra với contract.
- Database: Cloudflare D1/SQLite với Drizzle ORM và migrations versioned.
- Identity: identity header/session do môi trường Sites quản lý, ánh xạ vào bảng learner; không tự lưu mật khẩu.
- Deploy: OpenAI Sites private deployment trên Cloudflare Workers, binding D1 `DB` từ `.openai/hosting.json`.

## Success metric (numbers only)

Trong tuần pilot đầu tiên: **10** người có consent tạo phiên; ít nhất **7/10** hoàn thành đủ đề → kết quả → phản tư trong **30 phút**; ít nhất **7/10** chấm mức hữu ích **≥4/5**; kiểm thử hai identity ghi nhận **0** lần đọc/ghi chéo dữ liệu.
