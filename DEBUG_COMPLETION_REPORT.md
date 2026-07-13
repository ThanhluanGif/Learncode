# Báo cáo tiến độ debug đã hoàn thành

## Trạng thái hiện tại

Các lỗi local và artifact đã sửa có bằng chứng đỏ -> xanh. Live gate vẫn bị chặn ở Sites và catalog semantic gate vẫn đỏ; không được tính là hoàn thành.

## Vòng debug

| Vòng | Lỗi | Trước sửa | Sau sửa | Trạng thái |
| --- | --- | --- | --- | --- |
| DBG-000 | ERR-001/002 baseline QA | Test FAIL 0/2 | Product test PASS 4/4 + exact bundle chạy bằng Wrangler | DONE |
| DBG-001 | ERR-006 Flow runner | `no such file or directory` | `flow recall` PASS, exit `0` | DONE |
| DBG-002 | ERR-007 Flow harness ADR | CLI thiếu `--title` | 7/7 `decision add` PASS | DONE |
| DBG-003 | ERR-008 migration config | `--migrations-dir` không tồn tại | Wrangler đọc `migrations_dir` và áp dụng 2/2 migration | DONE |
| DBG-004 | ERR-009 brownfield migration | `table content_sources already exists` | Fresh + brownfield D1 đều 2/2 migration PASS | DONE |
| DBG-005 | ERR-010 Drizzle meta | thiếu `_journal.json` | Sinh lại 2 migration + snapshots PASS | DONE |
| DBG-006 | ERR-011 runtime flags | `nodejs_compat` lặp | Vượt config merge | DONE |
| DBG-007 | ERR-012 runtime date | date không được hỗ trợ | Dev server + 4 local HTTP checks PASS | DONE |
| DBG-008 | ERR-013 deployment artifact | Hai binding DB + thiếu migration `0001` | Một binding DB + đủ `0000`/`0001`; exact bundle QA PASS | DONE |
| DBG-009 | ERR-014 Sites auth/dispatch | v4/v2/v1/v5/v6 đều platform `500` | Chờ auth/dispatch project phục hồi và live QA lại | BLOCKED |
| DBG-010 | ERR-015 retest migration command | Sai selector, Wrangler tìm `migrations/` mặc định | Binding `DB` + fresh persist áp dụng 2/2 | DONE |
| DBG-011 | ERR-016 architecture-doc drift | Doc mới mô tả stack khác code/ADR v1 | Đã cô lập thành target chưa gate; chờ quyết định scope | OPEN |
| DBG-012 | ERR-017 lint regression | 5 errors/3 warnings | lint/build PASS; tests 12/12 | DONE |
| DBG-013 | ERR-018 hollow done-evidence | Localhost/local tests được ghi thành live proof | C-001–C-004 trả về todo; report invalidated | OPEN |
| DBG-014 | ERR-019 catalog coverage | 2022+B trả zero exams; chỉ hai seasons | Strict verifier đã đỏ đúng; chờ catalog fix | OPEN |
| DBG-015 | ERR-020 QA count query | `no such table: sources` | Đổi sang `content_sources`; counts 3/2/9 | DONE |
| DBG-016 | ERR-021 insecure WebSocket contract | Security test FAIL tại BA workflow | Hai endpoint dùng `wss`; focused test PASS | DONE |
| DBG-017 | ERR-022 taste-skill install | Python ZIP download lỗi CA | Git sparse installer cài 2 skill project-local | DONE |
| DBG-018 | ERR-023 mobile profile + C-005 accessibility | Nút profile rỗng; tabs/modal thiếu keyboard focus contract | Avatar/label đúng; arrow tabs, inert background, focus loop, Escape/restore PASS | DONE |
| DBG-019 | ERR-024 production design-token drift | `/flow tokens` mismatch DESIGN mới với CSS production cũ | Chờ owner approval + C-006; mock inline CSS đã qua `/flow design` | OPEN |

## Quy tắc ghi nhận

Một lỗi chỉ được chuyển sang `DONE` khi có đủ:

1. bằng chứng lỗi trước khi sửa;
2. commit chứa thay đổi;
3. lệnh QA chạy lại;
4. bằng chứng xanh gắn đúng với lỗi;
5. kiểm tra hồi quy liên quan;
6. nếu là web, bằng chứng trên URL đã triển khai khi phù hợp.

## Lịch sử hoàn thành

- `DBG-001` (2026-07-13): sửa đường dẫn runner từ `scripts/flow.sh` thành `runner/flow.sh`; QA bằng chính lệnh `flow recall`, kết quả entropy `0/100` và không có nợ mở.
- `DBG-002` (2026-07-13): đổi cờ ADR từ `--summary` sang `--title`; QA bằng bảy bản ghi decision được Flow harness xác nhận `PASS`.
- `DBG-003` (2026-07-13): chuyển đường dẫn migrations từ cờ CLI sang cấu hình binding D1; Wrangler tìm đúng hai file.
- `DBG-004` (2026-07-13): tách baseline idempotent và identity upgrade; kiểm thử cả database rỗng và database có tám bảng cũ.
- `DBG-005` (2026-07-13): tái tạo migration store từ thư mục trống thật; Drizzle sinh snapshots hợp lệ.
- `DBG-006` (2026-07-13): loại cờ runtime bị lặp khỏi Wrangler config.
- `DBG-007` (2026-07-13): khóa compatibility date theo runtime local; curl xác nhận health `200`, thiếu auth `401`, có auth `200`, OpenAPI 3.1 và docs HTML.
- `DBG-000` (2026-07-13): thay test skeleton bằng product tests, tách logic identity thuần và chạy build trước test; PASS 4/4. Exact production bundle khởi tạo được bằng Wrangler và trả đúng các route không phụ thuộc D1.
- `DBG-008` (2026-07-13): đóng phần lỗi artifact bằng commit `0002eec`; live gate được tách sang DBG-009 sau phép thử rollback chứng minh cùng lỗi xuất hiện ở version 1 không có D1.
- `DBG-009` (2026-07-13): các version độc lập đều deployment `succeeded` nhưng production hostname trả cùng trang platform `500`; OpenAI Status có incident Sites cùng thời điểm. Sau khi status chuyển `Resolved`, version 4 được redeploy, version 5 và version 6 được lưu/đóng gói/deploy mới nhưng vẫn 500. Token bypass mới không thay đổi kết quả; trình duyệt xác nhận `/signin-with-chatgpt` cũng 500. Vòng này giữ `BLOCKED` cho đến khi world-state live xanh.
- `DBG-009` recheck (`2026-07-13 22:04 +07`): version 6 và access `custom` không đổi; năm live checks vẫn platform 500. Không phát hành artifact trùng lặp khi không có code fix hoặc tín hiệu hạ tầng mới.
- `DBG-009` metadata probe (`2026-07-13 22:07 +07`): auth client, bypass token và custom allowlist đều tồn tại; bypass/anonymous/sign-in dispatch cùng trả platform 500. Root cause còn lại được cô lập khỏi code, artifact và metadata auth mà Sites công bố.
- `DBG-009` blocked audit (`2026-07-13 22:09 +07`): lần kiểm tra thứ ba tiếp tục platform 500 trên sáu route. Không thể tiến thêm nếu không có external-state recovery hoặc quyền tạm thay đổi access policy; trạng thái goal đủ điều kiện chuyển `blocked`.
- `DBG-009` resumed audit 1/3 (`2026-07-13 22:19 +07`): sáu route vẫn trả platform HTML 500 qua bypass token. Không thay đổi access `custom` và không redeploy artifact giống hệt; chu kỳ blocker sau resume hiện ở lần thứ nhất.
- `DBG-009` resumed audit 2/3 (`2026-07-13 22:25 +07`): Sites metadata vẫn active/custom và đầy đủ auth; probe ẩn danh trên sáu route cùng trả platform HTML 500 kích thước 2.563 byte. Chu kỳ blocker sau resume hiện ở lần thứ hai.
- `DBG-009` resumed audit 3/3 (`2026-07-13 22:26 +07`): cùng metadata hợp lệ và sáu route cùng platform HTML 500. Chu kỳ sau resume đã đạt ngưỡng blocker; chờ quyền tạm kiểm thử public hoặc thay đổi trạng thái nền tảng.
- `DBG-009` new resume cycle audit 1/3 (`2026-07-13 22:30 +07`): sáu route vẫn cùng platform HTML 500 trong khi metadata active/custom và auth đầy đủ. Không có code fix mới để QA hoặc artifact mới để deploy.
- `DBG-009` new resume cycle audit 2/3 (`2026-07-13 22:35 +07`): ma trận 12 request anonymous/bypass-owner trên sáu route đều platform HTML 500. Token bypass không vượt được lớp Sites dispatch; không có thay đổi thuộc code để sửa hoặc QA lại.
- `DBG-010` (`2026-07-13 22:40 +07`): sửa lệnh retest từ database selector không tồn tại sang binding `DB` với config đặt trước subcommand; fresh D1 áp dụng 2/2 và xác nhận `learners.email`.
- `DBG-009` full retest/audit 3/3 (`2026-07-13 22:42 +07`): đọc lại doc/card/contract; lint/build/test 4/4, fresh migrations và exact bundle HTTP đều xanh. Production anonymous/bypass vẫn 12/12 platform HTML 500, đạt lại ngưỡng blocker ba lượt.
- `DBG-011` (`2026-07-13 22:51 +07`): đối chiếu toàn bộ cấu trúc doc mới với package, hosting config, PRD và ADR. Xác nhận hai kiến trúc khác nhau; giữ Flow v1 làm nguồn triển khai, không trộn Postgres/Vercel/Judge vào C-001.
- `DBG-009` resume audit 1/3 (`2026-07-13 22:51 +07`): Sites metadata hợp lệ nhưng 12 request anonymous/bypass-owner vẫn platform HTML 500. Không có code regression mới; live gate tiếp tục chưa đạt.
- `DBG-012` (`2026-07-13 23:03 +07`): sửa type narrowing/catch/import trong code provisional; lint/build PASS, 12/12 product tests PASS, fresh D1 migrations 3/3.
- `DBG-013` (`2026-07-13 23:05 +07`): semantic audit bác bỏ done-evidence của C-001–C-004 vì chỉ dùng local runtime. Hạ trạng thái/checkbox về đúng evidence và dừng C-005.
- `DBG-014` (`2026-07-13 23:05 +07`): exact-bundle query 2022+B trả zero exams; strict contract verifier được bổ sung assertion để không còn pass giả. C-002/C-004 tiếp tục OPEN.
- `DBG-009` live recheck (`2026-07-13 23:05 +07`): Sites version 6 vẫn 12/12 platform HTML 500 ở anonymous/bypass-owner; access vẫn `custom`.
- `DBG-015` (`2026-07-13 23:16 +07`): lệnh đếm ad-hoc dùng nhầm `sources`; đối chiếu schema và chạy lại `content_sources` thành công, xác nhận counts 3/2/9 cùng hai exam rows drift.
- `DBG-014` retest (`2026-07-13 23:17 +07`): lint/build PASS, tests 12/12, Flow consistency 7/7 và C-001–C-004 check PASS ở `todo`; exact-bundle strict verifier vẫn RED đúng tại official 2022 B. Không deploy artifact chưa đạt gate.
- `DBG-016` (`2026-07-13 23:22 +07`): thêm regression scan trước khi sửa và tái hiện FAIL 0/1 tại `docs/BA_WORKFLOW.md`; đổi hai endpoint production sang `wss://`, thêm quy tắc chống hạ cấp; focused PASS 1/1, full tests 13/13, lint/build/Flow checks PASS và repository scan sạch.
- `DBG-017` (`2026-07-14 01:51 +07`): audit source commit `b177427`, chọn hai skill phù hợp existing UI; Python download lỗi CA nhưng helper `--method git` cài thành công vào `.agents/skills` mà không hạ TLS.
- `DBG-018` (`2026-07-14 02:04 +07`): render C-005 ở 1440x1000 và 360x800, sửa selector làm mất avatar mobile; bổ sung roving tabindex/ArrowLeft/ArrowRight/Home/End cho tab, inert background, focus loop và focus restore cho modal. Browser QA không overflow, min supporting type 12 px, console sạch; Flow design/lint/build/tests 13/13 PASS. Card vẫn `todo` đúng gate vì owner approval chưa có.
- `DBG-019` (`2026-07-14 02:07 +07`): `/flow tokens` trả RED vì CSS production vẫn dùng cluster cũ và runner không đọc CSS inline của mock. Ghi lỗi mở thay vì coi là pass; chỉ đóng trong C-006 sau dependency gates và owner approval.
