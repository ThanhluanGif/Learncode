# Stage 04 — ADR (architecture decisions)

Short. The most valuable section is what you are NOT doing and why.

## Gate — check ALL before `/flow next`
- [x] Each decision has a one-line "why" and a one-line "what I rejected"
- [x] The NOT-doing list is written
- [x] Decisions cover: data storage, auth approach, deploy target
- [x] No FILL placeholders remain in this file

## Decisions

| # | Decision | Why | Rejected alternative |
|---|---|---|---|
| 1 | Cloudflare D1/SQLite là nguồn dữ liệu chuẩn, schema Drizzle + migrations versioned; D1 lưu cả provenance và dữ liệu học có ownership | Stack hiện tại đã có D1 binding `DB`, quan hệ/filter/index phù hợp và Sites quản lý resource | Postgres/Neon mới (tăng vận hành và migration không cần thiết); localStorage (không bền, không kiểm soát ownership) |
| 2 | Dùng `oai-authenticated-user-email` ở server, ánh xạ email chuẩn hóa sang `learners`; API từ chối request thiếu identity | Site private trong OpenAI workspace đã có identity header do nền tảng cung cấp; không cần lưu mật khẩu và không tin learner id từ client | Hard-code learner `1`; custom email/password/OAuth; identity chỉ kiểm tra ở client |
| 3 | Deploy private bằng OpenAI Sites/Vinext trên Cloudflare Workers; giữ `.openai/hosting.json` với `project_id` và D1 `DB` | Đây là target hiện tại, có managed access policy, identity forwarding và D1 wiring | Chuyển Vercel/VM riêng hoặc deploy public (mở rộng hạ tầng và privacy ngoài phạm vi) |
| 4 | Dùng Online Judge ngoài qua URL có provenance; người học tự ghi verdict/score rồi phản tư | Giữ giá trị học tập và kho đề trong grade B mà không chạy mã không tin cậy | Xây sandbox/worker queue/máy chấm nội bộ trong v1 |
| 5 | Chỉ lưu toàn văn khi `usagePolicy` cho phép; nguồn chưa rõ quyền chỉ lưu metadata và deep-link | Bảo toàn truy xuất nguồn chính thức mà không biến việc tổng hợp thành sao chép trái phép | Crawl/sao chép hàng loạt PDF/statement hoặc bỏ trường license/provenance |
| 6 | `flow/05-contract.md` là seam; `/openapi.json` là runtime artifact cùng shape, Zod kiểm tra input | Ngăn UI/API lệch field và biến lỗi contract hiện tại thành test được | TypeScript types rời ở client/server hoặc tài liệu API không được phục vụ |
| 7 | Lộ trình v1 dùng rule có giải thích từ phiên, attempt, reflection và topic; không dùng AI sinh lời giải | Người học cần biết “vì sao” được gợi ý và dữ liệu pilot còn ít | Agent tự trị/LLM tạo lời giải, phân loại và gửi gợi ý tự động |

## NOT doing in v1 (and why it's safe to skip)

- Không tự chạy/biên dịch mã, không lưu test bí mật và không vận hành judge.
- Không có contest realtime, scoreboard, penalty/freeze hoặc concurrency queue.
- Không có app-owned auth, mật khẩu, public OAuth hoặc phân quyền lớp/giáo viên/admin.
- Không chấm Scratch/Logo/tệp thủ công và không upload blob; R2 giữ `null`.
- Không sao chép tài liệu chưa rõ quyền và không tự động crawl nguồn ngoài.
- Không thanh toán, notification đa kênh, social ranking hoặc gamification.
- Không dùng AI để sinh lời giải, verdict hay quyết định lộ trình trong v1.
