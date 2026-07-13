# Báo cáo tiến độ debug đã hoàn thành

## Trạng thái hiện tại

Chưa có lỗi nào được đóng trong chu kỳ Flow mới. Tệp này chỉ ghi các vòng debug đã có bằng chứng đỏ -> xanh.

## Vòng debug

| Vòng | Lỗi | Trước sửa | Sau sửa | Trạng thái |
| --- | --- | --- | --- | --- |
| DBG-000 | Baseline QA | Test FAIL 0/2 | Chưa sửa trong giai đoạn assessment | OPEN |
| DBG-001 | ERR-006 Flow runner | `no such file or directory` | `flow recall` PASS, exit `0` | DONE |
| DBG-002 | ERR-007 Flow harness ADR | CLI thiếu `--title` | 7/7 `decision add` PASS | DONE |
| DBG-003 | ERR-008 migration config | `--migrations-dir` không tồn tại | Wrangler đọc `migrations_dir` và áp dụng 2/2 migration | DONE |
| DBG-004 | ERR-009 brownfield migration | `table content_sources already exists` | Fresh + brownfield D1 đều 2/2 migration PASS | DONE |
| DBG-005 | ERR-010 Drizzle meta | thiếu `_journal.json` | Sinh lại 2 migration + snapshots PASS | DONE |
| DBG-006 | ERR-011 runtime flags | `nodejs_compat` lặp | Vượt config merge | DONE |
| DBG-007 | ERR-012 runtime date | date không được hỗ trợ | Dev server + 4 local HTTP checks PASS | DONE |

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
