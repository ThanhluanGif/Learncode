# Stage 02 — Scope (go/no-go)

Scope = features chosen by IMPACT × COST, inside your time budget.
KILL here is cheap and smart. Killing a weak idea at this gate is a SUCCESS outcome.

## Impact rubric (business value — score BEFORE looking at cost)

| Impact | Meaning |
|---|---|
| H | moves money or the core promise: gets users in (acquisition), gets them paying (revenue), or delivers the one job they came for |
| M | keeps users / saves real time weekly (retention, operations) |
| L | nice-to-have; nobody would pay for or switch over it |

Decision matrix: **H-impact features justify B/C cost** (via the C-paths below).
**L-impact features must be grade A or they're cut** — and even grade-A L-features are
cut when the budget is tight. The classic failure is a v1 full of A-grade L-impact
features: cheap to build, worthless to sell.

## AI coding grade rubric

| Grade | Meaning | Examples |
|---|---|---|
| A | cheap for AI | CRUD, forms, dashboards, content sites, API wrappers |
| B | moderate | file processing, 3rd-party integrations, auth via library, single LLM call, HITL AI drafts |
| C | expensive | realtime, payments from scratch, custom auth, autonomous agentic AI pipelines, heavy concurrency |

**Grade is a COST estimate, not a permission.** The gate is fit(grades, budget), not "no C allowed."
When a C feature is the real need, three honest paths:
1. **The C feature IS the product** → invert the cut: C goes FIRST (riskiest assumption first),
   everything else is minimized to serve it, and the budget is renegotiated against reality.
   But: one C proves the value prop — its siblings are v2 cards, not v1 scope.
2. **Re-architect C down to B** (highest-leverage move): multi-step agent → single LLM call;
   auto-send → human-approves-draft; custom pipeline → managed service / library.
   Same user value, one grade cheaper.
3. **Irreducible C that doesn't fit the budget** → KILL or re-budget. Both are honest.

## Gate — check ALL before `/flow next`
- [x] Every feature below has an IMPACT (H/M/L with the business reason) AND a grade (A/B/C)
- [x] No L-impact feature above grade A survives in v1
- [x] The suggested-features section was actually considered (each suggestion has an in/out decision)
- [x] fit(grades, budget) holds — every C in scope is justified as path 1, 2, or 3 above (written next to the feature)
- [x] If the product IS a C feature: it is FIRST in build order, and its sibling C features are on the cut list
- [x] The cut list is written (what I am NOT building in v1)
- [x] GO / KILL decision is written below
- [x] No FILL placeholders remain in this file

## Time budget

Một chu kỳ brownfield gồm tối đa 6 build cards, ước tính 24–36 giờ agent bao gồm migration, kiểm thử, QA trình duyệt, deploy và live verification. Mỗi card phải được commit và qua red→green/Flow gate riêng; nếu một card vượt hai vòng debug mà vẫn đỏ thì thu hẹp hoặc tách card thay vì tăng phạm vi ngầm.

## Features in v1 (each with impact AND grade)

- **F1. Danh tính và quyền sở hữu dữ liệu học tập** — impact **H** vì không thể cho người thật dùng nếu phiên học của họ bị trộn; grade **B** vì dùng identity/auth được nền tảng quản lý và ép ownership trong D1, không xây custom auth.
- **F2. Kho đề chính thức 10 năm có provenance** — impact **H** vì đây là lý do người học đến sản phẩm; grade **B** do phải chuẩn hóa, khử trùng lặp, migration và seed/import metadata từ nguồn được xác minh. v1 lưu metadata, quyền sử dụng và deep-link; chỉ lưu nguyên văn khi quyền cho phép.
- **F3. Tìm kiếm/lọc và trang chi tiết đề theo năm, vòng, bảng, chủ đề, trạng thái nguồn** — impact **H** vì rút ngắn việc tìm đúng bài để học; grade **A** vì là query/CRUD/UI trên schema đã có.
- **F4. Chu trình học một đề: mục tiêu thời gian → mở nguồn/judge ngoài → tự ghi kết quả → phản tư → lịch ôn tiếp** — impact **H** vì trực tiếp giải quyết công việc cốt lõi và ba phàn nàn trong Research; grade **B**. Tính năng chấm mã cấp **C** được tái kiến trúc theo path 2 thành deep-link tới VNOJ/HNOJ/LQDOJ và lưu kết quả học do người dùng xác nhận.
- **F5. Lịch sử và lộ trình năng lực có giải thích** — impact **H** vì giữ người học quay lại và cho biết chủ đề tiếp theo; grade **B** do cần tổng hợp theo chủ đề, độ tự tin, lỗi và lịch ôn nhưng chưa dùng agent/ML tự trị.
- **F6. Contract runtime, QA sản phẩm và khả năng quan sát tối thiểu** — impact **M** vì giảm lỗi dữ liệu/API và thời gian vận hành hàng tuần; grade **A** gồm OpenAPI phục vụ thật, test sản phẩm, health/error states và nhãn demo rõ ràng.

## Suggested features (impact-first — proposed, not decided)

Up to 3 features NOT in the original idea, each chosen for business impact (how does this
get users in / get money in / keep users?). Grounded in the stage-01 GTM findings — e.g.
the first-10-users channel often implies a share/invite/referral surface; the pricing
research often implies an upsell or a paid tier. Default is OUT; each needs an explicit
decision.

- **Lời mời pilot + phản hồi sau một phiên học** — impact **H** vì biến group VNOI thành 10 lượt thử có đo lường; grade **A** — **IN**, chỉ thu thập đồng ý, vai trò, mức hoàn thành và phản hồi tối thiểu; không thu PII thừa của trẻ vị thành niên.
- **Chia sẻ “thẻ tiến bộ” công khai** — impact **M** vì có thể tạo referral trong cộng đồng; grade **A** — **OUT**, chưa có bằng chứng người học muốn công khai kết quả và có rủi ro riêng tư.
- **Gói giáo viên/trả phí** — impact **H** nếu chứng minh được willingness-to-pay; grade **B** cho entitlement nhưng payments là **C** — **OUT**, chỉ nghiên cứu sau khi ít nhất 7/10 pilot hoàn thành chu trình học.

## Cut list (NOT in v1 — deferred, not deleted)

- **Online Judge nội bộ chạy C++/Python/Pascal, bộ test và sandbox** — grade **C**, rủi ro thực thi mã không tin cậy và vận hành máy chấm; v1 dùng judge ngoài để giữ giá trị học tập ở grade B.
- **Thi thử realtime, hàng đợi chấm, scoreboard ẩn/đóng băng và penalty đầy đủ** — grade **C** vì concurrency/trạng thái thời gian thực; chỉ làm sau khi chu trình học cá nhân được kiểm chứng.
- **Nộp/chấm tệp Scratch, Logo và sản phẩm thủ công Bảng A** — grade **C** do định dạng đa dạng và cần rubric/người chấm; v1 vẫn lưu metadata/liên kết đề Bảng A.
- **Portal giáo viên quản lý lớp, giao bài và phân quyền quản trị nội dung** — grade **B**, impact M; hoãn để sáu card tập trung vào người học và tránh mở rộng tenancy/admin trước khi ownership cá nhân an toàn.
- **AI tự sinh gợi ý, lời giải hoặc phân loại đề tự động** — grade **B/C** và có rủi ro sai học thuật; v1 dùng taxonomy/rule có nguồn và phản tư do người học nhập.
- **Thanh toán, thông báo đa kênh, bảng xếp hạng xã hội, huy hiệu/gamification** — chưa chứng minh tác động đến chu trình học cốt lõi và tăng rủi ro riêng tư/phạm vi.
- **Sao chép toàn văn PDF/đề từ nguồn chưa rõ giấy phép** — không thực hiện; chỉ metadata và liên kết nguồn cho đến khi quyền sử dụng được xác minh.

## Decision

**GO** — codebase brownfield đã có phần lớn khung UI/D1, Research xác nhận nỗi đau về phản hồi và lộ trình, còn v1 đã loại hoặc tái kiến trúc mọi tính năng cấp C để có thể kiểm chứng giá trị học tập trong sáu card.
