# Báo cáo lỗi dự án

## Tổng hợp

| ID | Mức độ | Trạng thái | Lỗi |
| --- | --- | --- | --- |
| ERR-001 | P0 | OPEN | Bộ test vẫn kiểm tra starter skeleton đã bị xóa |
| ERR-002 | P0 | OPEN | Test Node không tải được module `cloudflare:workers` |
| ERR-003 | P0 | OPEN | API gắn cứng mọi dữ liệu học tập vào learner `1` |
| ERR-004 | P1 | OPEN | Chưa có hợp đồng API được phục vụ tại runtime |
| ERR-005 | P1 | OPEN | UI trộn dữ liệu tĩnh với dữ liệu D1 |

## Chi tiết

### ERR-001 - Test starter đã lỗi thời

- Phát hiện: 2026-07-13.
- Lệnh: `npm test`.
- Kết quả: `ENOENT` với `app/_sites-preview/SkeletonPreview.tsx`.
- Nguyên nhân: sản phẩm đã thay starter nhưng `tests/rendered-html.test.mjs` chưa được viết lại.
- Hướng xử lý: thay bằng test sản phẩm và API thật.
- Tiêu chí đóng: test không còn tham chiếu `_sites-preview` và kiểm tra đúng nội dung Tin học trẻ LAB.

### ERR-002 - Môi trường test sai runtime

- Phát hiện: 2026-07-13.
- Lệnh: `npm test`.
- Kết quả: `ERR_UNSUPPORTED_ESM_URL_SCHEME` cho protocol `cloudflare:`.
- Nguyên nhân: test import worker trực tiếp bằng Node trong khi worker cần Cloudflare-compatible runtime.
- Hướng xử lý: kiểm thử route qua môi trường Vinext/Miniflare hoặc tách logic thuần để unit test.
- Tiêu chí đóng: test route chạy trong runtime tương thích và đạt xanh.

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
