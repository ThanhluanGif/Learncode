# Báo cáo tiến độ debug đã hoàn thành

## Trạng thái hiện tại

Chưa có lỗi nào được đóng trong chu kỳ Flow mới. Tệp này chỉ ghi các vòng debug đã có bằng chứng đỏ -> xanh.

## Vòng debug

| Vòng | Lỗi | Trước sửa | Sau sửa | Trạng thái |
| --- | --- | --- | --- | --- |
| DBG-000 | Baseline QA | Test FAIL 0/2 | Chưa sửa trong giai đoạn assessment | OPEN |

## Quy tắc ghi nhận

Một lỗi chỉ được chuyển sang `DONE` khi có đủ:

1. bằng chứng lỗi trước khi sửa;
2. commit chứa thay đổi;
3. lệnh QA chạy lại;
4. bằng chứng xanh gắn đúng với lỗi;
5. kiểm tra hồi quy liên quan;
6. nếu là web, bằng chứng trên URL đã triển khai khi phù hợp.

## Lịch sử hoàn thành

Chưa có mục hoàn thành trong chu kỳ hiện tại.
