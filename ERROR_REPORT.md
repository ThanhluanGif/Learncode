# Báo cáo lỗi dự án

## Tổng hợp

| ID | Mức độ | Trạng thái | Lỗi |
| --- | --- | --- | --- |
| ERR-001 | P0 | DONE | Bộ test vẫn kiểm tra starter skeleton đã bị xóa |
| ERR-002 | P0 | DONE | Test Node không tải được module `cloudflare:workers` |
| ERR-003 | P0 | OPEN | API gắn cứng mọi dữ liệu học tập vào learner `1` |
| ERR-004 | P1 | OPEN | Chưa có hợp đồng API được phục vụ tại runtime |
| ERR-005 | P1 | OPEN | UI trộn dữ liệu tĩnh với dữ liệu D1 |
| ERR-006 | P2 | DONE | Gọi sai đường dẫn Flow runner khi bắt đầu Research |
| ERR-007 | P2 | DONE | Dùng sai tên cờ khi lưu ADR vào Flow harness |
| ERR-008 | P2 | DONE | Wrangler không hỗ trợ cờ CLI `--migrations-dir` |
| ERR-009 | P0 | DONE | Baseline migration đụng các bảng brownfield đã tồn tại |
| ERR-010 | P2 | DONE | Drizzle không tái tạo migration khi còn thư mục meta rỗng |
| ERR-011 | P1 | DONE | Cờ `nodejs_compat` bị khai báo trùng ở Vite và Wrangler |
| ERR-012 | P1 | DONE | Compatibility date mới hơn runtime local hỗ trợ |
| ERR-013 | P0 | DONE | Artifact v3 có binding D1 trùng và đóng gói migration cũ |
| ERR-014 | P0 | BLOCKED | Sites auth/dispatch của project vẫn trả platform `500` sau incident chung |

## Chi tiết

### ERR-001 - Test starter đã lỗi thời

- Phát hiện: 2026-07-13.
- Lệnh: `npm test`.
- Kết quả: `ENOENT` với `app/_sites-preview/SkeletonPreview.tsx`.
- Nguyên nhân: sản phẩm đã thay starter nhưng `tests/rendered-html.test.mjs` chưa được viết lại.
- Hướng xử lý: thay bằng test sản phẩm và API thật.
- Tiêu chí đóng: test không còn tham chiếu `_sites-preview` và kiểm tra đúng nội dung Tin học trẻ LAB.
- Sửa: xóa test starter, thay bằng `tests/foundation.test.mjs` kiểm tra identity, contract và migration.
- Bằng chứng đóng: commit `70bcedb`; `npm test` build thành công và PASS 4/4, không còn tham chiếu `_sites-preview`.

### ERR-002 - Môi trường test sai runtime

- Phát hiện: 2026-07-13.
- Lệnh: `npm test`.
- Kết quả: `ERR_UNSUPPORTED_ESM_URL_SCHEME` cho protocol `cloudflare:`.
- Nguyên nhân: test import worker trực tiếp bằng Node trong khi worker cần Cloudflare-compatible runtime.
- Hướng xử lý: kiểm thử route qua môi trường Vinext/Miniflare hoặc tách logic thuần để unit test.
- Tiêu chí đóng: test route chạy trong runtime tương thích và đạt xanh.
- Sửa: tách identity resolver thuần để unit test, đồng thời bắt buộc `npm test` chạy production build trước test.
- Bằng chứng đóng: production bundle chạy trực tiếp bằng Wrangler; `/openapi.json` và `/docs` trả `200`, `/api/me` thiếu identity trả `401`; test PASS 4/4.

### ERR-003 - Không có ranh giới người dùng

- Phát hiện: kiểm tra code 2026-07-13.
- Vị trí: `app/api/learning/route.ts:11`, `app/api/library/route.ts:55`.
- Tác động: dữ liệu của nhiều người có thể bị trộn hoặc đọc sai chủ sở hữu.
- Hướng xử lý: lấy identity từ cơ chế đăng nhập hiện có, ánh xạ sang learner và bắt buộc ownership trong mọi query.
- Tiêu chí đóng: kiểm thử hai identity chứng minh không đọc/ghi chéo dữ liệu.

### ERR-004 - Thiếu runtime contract

- Phát hiện: assessment 2026-07-13.
- Tác động: backend và UI có thể lệch tên trường hoặc trạng thái.
- Hướng xử lý: viết `flow/05-contract.md`, sinh `/openapi.json` và thêm contract tests.
- Tiêu chí đóng: toàn bộ endpoint trong contract xuất hiện trên live spec và shapes khớp.

### ERR-005 - Dữ liệu demo và thật chưa tách biệt

- Phát hiện: assessment UI 2026-07-13.
- Tác động: người học có thể hiểu nhầm thống kê hoặc đề tĩnh là dữ liệu tài khoản thật.
- Hướng xử lý: gắn nhãn demo rõ ràng hoặc chuyển các surface sang dữ liệu API.
- Tiêu chí đóng: mọi chỉ số người dùng lấy từ API hoặc được ghi rõ là minh họa.

### ERR-006 - Sai đường dẫn Flow runner

- Phát hiện: 2026-07-13 khi bắt đầu Research.
- Trước sửa: `zsh: no such file or directory: /Users/admin/.codex/skills/flow/scripts/flow.sh`.
- Nguyên nhân: dùng nhầm thư mục `scripts` thay cho `runner`.
- Sửa: xác định runner thực tại `/Users/admin/.codex/skills/flow/runner/flow.sh` và gọi bằng `bash`.
- Sau sửa: `flow recall` thoát mã `0`, entropy `0/100`, không có nợ mở.
- Trạng thái: đóng trong cùng vòng thao tác, không có thay đổi mã ứng dụng.

### ERR-007 - Sai tên cờ Flow harness

- Phát hiện: 2026-07-13 sau khi ADR qua gate.
- Trước sửa: `flow_harness.py decision add` từ chối `--summary` và yêu cầu `--title`.
- Nguyên nhân: dùng schema của lệnh trace cho lệnh decision.
- Sửa: thay bằng `decision add --id ... --title ... --doc flow/04-adr.md --status accepted`.
- Sau sửa: 7/7 quyết định ADR được harness trả `PASS` và lưu bền.
- Trạng thái: đóng trong cùng vòng, không ảnh hưởng mã ứng dụng.

### ERR-008 - Cờ migrations-dir không được hỗ trợ

- Phát hiện: 2026-07-13 khi QA migration C-001.
- Trước sửa: Wrangler 4.92.0 trả `Unknown arguments: migrations-dir, migrationsDir`.
- Nguyên nhân: phiên bản CLI đọc đường dẫn migration từ cấu hình D1, không nhận cờ lệnh.
- Sửa: thêm `migrations_dir: .openai/drizzle` vào binding D1 local trong `wrangler.jsonc`.
- Sau sửa: `wrangler d1 migrations apply DB --local` nhận đúng hai migration.

### ERR-009 - Baseline migration không tương thích brownfield

- Phát hiện: 2026-07-13 khi áp dụng lên D1 local hiện có.
- Trước sửa: `table content_sources already exists` và migration rollback.
- Nguyên nhân: schema trước chu kỳ không có migration ledger; migration mới coi database là rỗng.
- Sửa: tách `0000` thành baseline `IF NOT EXISTS`, `0001` chỉ thêm identity email/index.
- Sau sửa: cả D1 mới và D1 brownfield đều áp dụng `0000` + `0001` thành công; `PRAGMA table_info(learners)` có cột `email`.

### ERR-010 - Thư mục meta Drizzle rỗng

- Phát hiện: 2026-07-13 khi tái sinh baseline hai bước.
- Trước sửa: `ENOENT .openai/drizzle/meta/_journal.json`.
- Nguyên nhân: các file generated đã xóa nhưng thư mục meta rỗng còn tồn tại làm Drizzle hiểu là migration store hợp lệ.
- Sửa: bỏ thư mục generated rỗng rồi chạy lại `npm run db:generate`.
- Sau sửa: Drizzle sinh baseline và snapshot mới, sau đó sinh identity migration kế tiếp.

### ERR-011 - Trùng compatibility flag

- Phát hiện: 2026-07-13 khi khởi động preview C-001.
- Trước sửa: Workers runtime báo `Compatibility flag specified multiple times: nodejs_compat`.
- Nguyên nhân: Vite local binding đã có flag, `wrangler.jsonc` khai báo lần hai.
- Sửa: bỏ flag khỏi Wrangler local config.
- Sau sửa: preview vượt qua bước hợp nhất config.

### ERR-012 - Compatibility date vượt runtime

- Phát hiện: 2026-07-13 khi khởi động lại preview C-001.
- Trước sửa: runtime hỗ trợ tối đa `2026-05-22` nhưng config dùng `2026-07-13`.
- Sửa: khóa compatibility date ở `2026-05-22`.
- Sau sửa: Vinext dev phục vụ thành công tại local; health, auth, OpenAPI và docs đều trả đúng contract.

### ERR-013 - Artifact deployment v3 sai binding và migration

- Phát hiện: 2026-07-13 khi live verification C-001.
- Trước sửa: `dist/server/wrangler.json` có hai binding cùng tên `DB`; archive chỉ có baseline cũ và thiếu identity migration.
- Nguyên nhân 1: `wrangler.jsonc` được Vite tự nạp cùng inline Cloudflare config, tạo hai binding tên `DB` trong `dist/server/wrangler.json`.
- Nguyên nhân 2: build plugin lấy migration từ `drizzle/`, trong khi Drizzle config tạm ghi vào `.openai/drizzle`; archive vì vậy chứa baseline cũ và thiếu identity migration.
- Sửa local: chuyển CLI-only config sang `wrangler.local.jsonc`, trả Drizzle output về `drizzle/`, sinh `0001` identity và kiểm tra artifact chỉ có một binding DB + đủ hai migration.
- Bằng chứng đóng: commit `0002eec`; artifact v4 còn đúng một binding `DB`, chứa `0000` + `0001`, chạy được bằng Wrangler và qua lint/build/test/fresh migration.
- Ghi chú phân loại: live `500` không còn được quy cho artifact này vì rollback sang cả version 2 và version 1 cũng tái hiện cùng lỗi trong lúc ChatGPT Sites có incident chính thức; live gate được theo dõi riêng ở ERR-014.

### ERR-014 - Sự cố runtime/dispatch của ChatGPT Sites

- Phát hiện: 2026-07-13 khi xác minh live C-001 sau deployment v4.
- Triệu chứng: mọi route trả trang HTML `500` do nền tảng phục vụ, trong khi Sites báo deployment `succeeded`.
- Phép cô lập:
  - version 4 (C-001, D1) -> deployment succeeded, platform 500;
  - version 2 (bản D1 trước C-001, từng hoạt động) -> deployment succeeded, cùng platform 500;
  - version 1 (không D1) -> deployment succeeded, cùng platform 500;
  - cùng bundle version 4 chạy qua Wrangler local -> Worker khởi tạo và các route không cần DB trả đúng contract.
- Bằng chứng ngoài: OpenAI Status đang điều tra [“Elevated errors when creating sites in ChatGPT”](https://status.openai.com/incidents/01KXDMD4T8TM58CSKBN7YFD2CK) đúng thời điểm kiểm thử.
- Kiểm tra hậu phục hồi:
  - OpenAI Status đánh dấu incident `Resolved` lúc 12:59 ngày 2026-07-13;
  - redeploy version 4 sau phục hồi vẫn platform 500;
  - version 5 được lưu mới từ commit đã push `b202b22`, archive được đóng gói mới và deployment `succeeded`, nhưng vẫn platform 500;
  - trình duyệt owner-only hiện “Continue with ChatGPT”, nhưng `/signin-with-chatgpt` của site trả cùng platform 500; bypass-token cũng 500.
- Kiểm tra lặp có giới hạn: rotate bypass token không thay đổi kết quả; version 6 được tạo từ commit đã push `b160ea6` sau lint/build/test/fresh-migration PASS, deployment `succeeded`, nhưng cả năm live route vẫn platform 500.
- Xử lý hiện tại: giữ version 6 làm bản production dự kiến; không thay đổi access policy, không mở site công khai và không hạ chuẩn live gate.
- Tiêu chí đóng: incident được khắc phục và production URL trả health `200`, OpenAPI/docs `200`, missing auth `401`, authenticated `/api/me` `200`.
