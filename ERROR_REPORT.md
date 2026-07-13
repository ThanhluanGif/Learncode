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
| ERR-015 | P2 | DONE | Lệnh retest migration dùng sai database selector nên không đọc migrations config |
| ERR-016 | P1 | OPEN | Bộ tài liệu kiến trúc mới mâu thuẫn với Flow v1 và code đang chạy |
| ERR-017 | P1 | DONE | Code provisional C-002–C-004 làm lint FAIL 5 errors/3 warnings |
| ERR-018 | P0 | OPEN | C-001–C-004 bị đánh done bằng local evidence thay cho world-state live |
| ERR-019 | P0 | OPEN | Catalog 2022+B trả zero exams và chưa có đủ mười mùa hoàn chỉnh |
| ERR-020 | P3 | DONE | Truy vấn đếm QA dùng nhầm bảng `sources` thay vì `content_sources` |
| ERR-021 | P0 | DONE | Contract BA công bố WebSocket production không mã hóa cho dữ liệu submission |
| ERR-022 | P3 | DONE | Skill-installer tải ZIP lỗi do Python thiếu CA issuer |

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
- Kiểm tra liên tục lúc `2026-07-13 22:04 +07`: version 6 vẫn hiện hành, access vẫn `custom`, năm live route tiếp tục trả cùng platform HTML 500 dù incident chung đã `Resolved`.
- Metadata probe lúc `2026-07-13 22:07 +07`: site active, auth client/token đầy đủ, policy custom hợp lệ với một user và không group; request bypass, request ẩn danh và `/signin-with-chatgpt?return_to=%2F` đều platform 500 tại Cloudflare edge.
- Goal-loop lần ba lúc `2026-07-13 22:09 +07`: sáu route tiếp tục platform 500, đáp ứng ngưỡng blocker ba lượt liên tiếp. Bước chẩn đoán còn lại cần quyền chủ dự án để tạm chuyển access `custom` -> `public` -> kiểm tra -> khôi phục `custom`.
- Resumed audit lần 1 lúc `2026-07-13 22:19 +07`: sau khi người dùng yêu cầu tiếp tục, cả sáu route vẫn platform 500 với bypass token hiện hành. Site được giữ ở `custom`; chưa có quyền rõ ràng để thực hiện phép thử `public` tạm thời.
- Resumed audit lần 2 lúc `2026-07-13 22:25 +07`: metadata vẫn active/custom với auth client và token đầy đủ; probe ẩn danh trên cả sáu route cùng trả `500 text/html`, 2.563 byte. Blocker auth/dispatch tiếp tục tái hiện, chưa có bằng chứng code hoặc artifact thay đổi.
- Resumed audit lần 3 lúc `2026-07-13 22:26 +07`: cùng metadata hợp lệ và cùng sáu phản hồi platform HTML 500 kích thước 2.563 byte. Blocker đạt ngưỡng ba lượt liên tiếp sau resume; cần quyền kiểm thử access hoặc external-state recovery để tiến thêm.
- Xử lý hiện tại: giữ version 6 làm bản production dự kiến; không thay đổi access policy, không mở site công khai và không hạ chuẩn live gate.
- Tiêu chí đóng: incident được khắc phục và production URL trả health `200`, OpenAPI/docs `200`, missing auth `401`, authenticated `/api/me` `200`.

### ERR-015 - Sai database selector trong lệnh retest migration

- Phát hiện: 2026-07-13 khi kiểm thử lại toàn bộ C-001 theo tài liệu.
- Trước sửa: gọi `wrangler d1 migrations list tin-hoc-tre-db` trong khi config khai báo binding `DB`/database `site-creator-d1`; Wrangler tìm thư mục `migrations/` mặc định và thoát lỗi.
- Nguyên nhân: lệnh QA dùng tên database không thuộc `wrangler.local.jsonc`, không phải lỗi migration hoặc dữ liệu ứng dụng.
- Sửa: đặt `--config wrangler.local.jsonc` trước subcommand, dùng binding `DB` và một `--persist-to` fresh.
- Sau sửa: Wrangler áp dụng thành công `0000` + `0001`; migration ledger có đủ hai bản ghi và `PRAGMA table_info(learners)` xác nhận cột `email`.

### ERR-016 - Kiến trúc tài liệu mới lệch Flow v1

- Phát hiện: 2026-07-13 khi đọc lại cấu trúc doc theo yêu cầu.
- Tài liệu mới: `PROJECT_PLAN.md` và `docs/*.md` mô tả Next.js 15, PostgreSQL, Redis, BullMQ, NextAuth, Vercel, Docker judge, WebSocket và Gemini.
- World-state repository: Next.js 16.2.6, Drizzle+D1 binding `DB`, Sites identity, Cloudflare Workers; không có dependency PostgreSQL/Redis/BullMQ/Socket.io/NextAuth/Gemini hay Docker Compose.
- Xung đột phạm vi: ADR v1 chọn D1/Sites và PRD v1 dùng Online Judge ngoài, chủ động hoãn sandbox/judge/contest sang v2; API contract mới cũng khác `flow/05-contract.md` đã gate.
- Xử lý hiện tại: bộ doc đã được merge ở commit `5d6ca41` nhưng được phân loại là target architecture chưa qua gate; tiếp tục code theo Flow artifacts v1 đã duyệt và ghi drift vào ba báo cáo.
- Tiêu chí đóng: chủ dự án xác nhận bộ doc mới là roadmap v2 hoặc phê duyệt một ADR/scope/card migration riêng; sau đó đồng bộ stack, API và workflow về một nguồn chuẩn.

### ERR-017 - Lint regression trong code provisional

- Phát hiện: 2026-07-13 23:00 +07 khi chạy lại test trên HEAD `a2cc203`.
- Trước sửa: ESLint báo 5 errors/3 warnings, gồm explicit `any`, biến không đổi, import/biến không dùng trong learning, pilot, library và contract verifier.
- Sửa: validator nhận `unknown` rồi narrow, catch dùng `Error` guard, loại import/biến thừa.
- Sau sửa: lint PASS, build PASS, product tests PASS 12/12.

### ERR-018 - Done-evidence bị thay bằng local evidence

- Phát hiện: card C-001–C-004 đều `status: done` và check live boxes, nhưng evidence nói rõ dùng local tests hoặc `http://localhost:3001` vì Sites 500.
- Tác động: dependency chain mở C-005/C-006 dù không card nào có named world-state proof; `QA_CONTRACT_REPORT.md` gọi localhost là deployed URL.
- Xử lý: hạ C-001–C-004 về `todo`, uncheck live/coverage boxes chưa chứng minh, sửa report thành local/invalidated và dừng C-005.
- Tiêu chí đóng: mỗi card có đúng live deployed evidence đã định nghĩa; localhost không được dùng làm bằng chứng deploy.

### ERR-019 - Catalog không đáp ứng C-002

- Phát hiện: exact bundle query `/api/library?year=2022&division=B` trả `200` nhưng `exams: []`.
- Nguyên nhân hiện thấy: baseline và seed cùng dùng fixed IDs nhưng `ON CONFLICT` chỉ update một số trường; dữ liệu thực tế giữ exam 2025 B và 2022 A. Seed chỉ khai báo hai exams, không phải mười mùa 2016–2025.
- Khoảng trống test: unit tests chỉ kiểm tra `appliedFilters`, không kiểm tra rows thực trả về; contract verifier cũ gọi library không filter.
- Xử lý: thêm assertion 2022+B vào strict contract verifier; giữ C-002/C-004 `todo` cho đến khi seed/provenance đủ mười mùa và query thật xanh.
- Tái kiểm chứng 23:17 +07: fresh D1 có 3 sources/2 exams/9 problems; exact bundle qua OpenAPI/auth nhưng strict verifier tiếp tục dừng đúng tại metadata 2022 B.

### ERR-020 - Truy vấn đếm QA dùng sai tên bảng

- Phát hiện: 2026-07-13 23:16 +07 sau khi migrations 3/3 và seed đã chạy thành công, câu diagnostic `COUNT(*) FROM sources` trả `no such table`.
- Nguyên nhân: schema thật đặt tên `content_sources`; lỗi chỉ nằm trong lệnh kiểm tra ad-hoc, không nằm trong migration hay ứng dụng.
- Sửa và bằng chứng: chạy lại trên cùng fresh persist với `content_sources`, nhận 3 sources, 2 exams và 9 problems; truy vấn chi tiết hai exam rows thành công.

### ERR-021 - WebSocket contract không mã hóa

- Phát hiện: Semgrep báo source–sink không có sanitizer tại `websocket_channel` và channel realtime judging trong `docs/BA_WORKFLOW.md`.
- Rủi ro: một client triển khai đúng theo contract cũ có thể truyền token, submission id và kết quả chấm qua kênh plaintext, cho phép nghe lén hoặc sửa đổi trên đường truyền.
- Bằng chứng đỏ: `node --test tests/secure-websocket.test.mjs` FAIL 0/1 và chỉ ra `docs/BA_WORKFLOW.md`.
- Sửa: đổi cả response example và channel template sang `wss://`; thêm yêu cầu production chỉ phát hành endpoint mã hóa và client từ chối hạ cấp.
- Bằng chứng xanh: focused test PASS 1/1, full tests PASS 13/13, lint/build PASS và quét toàn repository không còn endpoint WebSocket plaintext.
- Phạm vi: hiện repository chưa có runtime WebSocket implementation; bản vá đóng lỗ hổng trong contract/source mẫu, không tuyên bố realtime judge đã deploy.

### ERR-022 - Skill-installer không tải được ZIP qua Python

- Phát hiện: 2026-07-14 01:47 +07 khi cài `Leonxlnx/taste-skill` project-local.
- Lỗi: `SSLCertVerificationError: unable to get local issuer certificate` từ `urllib`; git HTTPS trên cùng máy vẫn xác minh và clone repository thành công.
- Xử lý: không tắt TLS hoặc certificate verification; chạy lại helper chính thức với `--method git`.
- Bằng chứng đóng: cài thành công `design-taste-frontend` và `redesign-existing-projects` vào `.agents/skills`, mỗi thư mục có `SKILL.md` đúng frontmatter.
