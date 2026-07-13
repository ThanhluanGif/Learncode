# Stage 01 — Research (inspect first)

Rule: INSPECT what already exists. Evidence required — links, quotes, screenshots.
"I think there's nothing like this" without searching = gate fail.

> Project type (`/flow project-type`, default `web`): items 2 and 4 below are written for a
> **web / market-facing product**. For an **internal tool / cli / library / skill** (no public
> market), use the non-web framing in each item — it is still real evidence (first-party
> friction, who-benefits), NOT an excuse to skip. The semantic gate refuses a market product
> that hides behind the soft framing.

## Gate — check ALL before `/flow next`
- [x] I actually OPENED 3 existing tools/competitors (links below, with one honest note each)
- [x] **(web)** I found 3 REAL user complaints online, quoted, with source links — **OR (non-web/internal)** I named the concrete first-party friction / observed pain that justifies this
- [x] I wrote what competitors CHARGE (real prices) and who pays — **OR (non-web)** what people spend AROUND this problem today (time, a worse tool, manual work)
- [x] **(web)** I named the ONE channel my first 10 users come from (a place, not "social media") — **OR (non-web/internal)** I named who benefits and how they hear about it (release notes / team), and noted "no market channel" is NOT a kill signal for an internal tool
- [x] I wrote why those users would pick this over the status quo (one honest paragraph)
- [x] I wrote what is technically free vs hard for this idea
- [x] No FILL placeholders remain in this file

## What exists already (3 — open them, don't guess)

1. [VNOJ — VNOI Online Judge](https://oj.vnoi.info/) làm tốt chấm bài tự động, thi đấu và duy trì kho đề lớn từ VOJ/VNOI; trang chính thức cũng xác nhận đây là hệ thống mã nguồn mở dựa trên DMOJ. Điểm còn thiếu so với nhu cầu dự án là một hành trình riêng cho Tin học trẻ theo bảng/năm, nhật ký phản tư và gợi ý lần ôn tiếp theo.
2. [HNOJ — Hanoi Online Judge](https://hnoj.edu.vn/about/) làm tốt bài tự luyện, chuyên đề, đề HSG chính thức và contest cho học sinh; đây là đối thủ gần nhất về ngữ cảnh giáo dục Việt Nam. HNOJ vẫn chủ yếu là giao diện Online Judge: kết quả nộp bài và bảng xếp hạng mạnh, nhưng chưa thể hiện một hồ sơ học tập cá nhân nối đề gốc, lỗi sai, năng lực và lịch ôn.
3. [LQDOJ — Le Quy Don Online Judge](https://lqdoj.edu.vn/) làm tốt hệ sinh thái cộng đồng gồm bài tập, contest, khóa học và nhóm. Phần công khai tập trung vào hoạt động thi đấu/cộng đồng; chưa có trải nghiệm chuyên biệt cho kho đề Tin học trẻ chính thức trong 10 năm và quy trình học trước–trong–sau mỗi đề.

## What users say (web: 3 real complaints quoted+linked · non-web: real first-party friction)

1. > “the only feedback i get from the submission is ‘runtime error’” — một học viên mô tả đã mất khoảng bốn giờ với Online Judge; [nguồn](https://www.reddit.com/r/learnprogramming/comments/1anrjix/online_judge_support_requested/).
2. > “I’m not sure what topics I should learn next or in what order.” — người mới còn hỏi thêm một checklist có thể theo dõi tiến bộ; [nguồn](https://www.reddit.com/r/codeforces/comments/1rjixdj/where_do_i_even_start_with_competitive_programming/).
3. > “90% I just blank out and have NO IDEA what to do.” — người học biết lý thuyết nhưng không nối được kỹ thuật với đề; [nguồn](https://www.reddit.com/r/learnprogramming/comments/1ohf57r/how_do_i_approach_a_competitive_programming/).

## GTM & business reality

Building is the cheap part now. Distribution and willingness-to-pay are where ideas die —
research them BEFORE planning, not after shipping.

### Who pays today, and how much (pricing reference points)

- VNOJ: giá truy cập công khai cho người học là `0 đồng`; trang chủ mời người mới [đăng ký và làm bài](https://oj.vnoi.info/) mà không công bố gói trả phí. Chi phí vận hành nằm ở hạ tầng và thời gian của cộng đồng VNOI; người học vẫn trả “chi phí chuyển ngữ cảnh” khi tự ghép đề, judge và ghi chú.
- HNOJ: giá truy cập công khai là `0 đồng`; HNOJ công bố các kỳ thi online [“hoàn toàn miễn phí”](https://hnoj.edu.vn/), còn trường/ban tổ chức và đội quản trị gánh công ra đề, test và vận hành. Người học/giáo viên tự duy trì thêm bảng tính, sổ lỗi hoặc nhóm Zalo để theo dõi ngoài hệ thống.
- LeetCode Premium là mốc tham chiếu cho nội dung có cấu trúc và phân tích tiến bộ: [35 USD/tháng hoặc 159 USD/năm](https://leetcode.com/subscribe/), do cá nhân luyện phỏng vấn trả. Mức này không phù hợp để coi là mặc định cho học sinh Tin học trẻ; v1 nên kiểm chứng giá trị học tập trước khi thiết kế thu phí.

### The first-10-users channel (web) · who-benefits (non-web/internal)

Kênh duy nhất để tuyển nhóm thử nghiệm đầu tiên là **group Facebook “VNOI — Diễn đàn Olympic Tin Học Việt Nam”** được [trang tài nguyên VNOI](https://oj.vnoi.info/post/192-dquynh_2811) liên kết và mô tả có gần 22 nghìn thành viên. Sau khi có bản demo riêng tư và biểu mẫu đồng ý thử nghiệm, đăng một lời mời minh bạch xin 10 học sinh/giáo viên đang ôn Tin học trẻ dùng một đề trong 30 phút; không thu thập trẻ vị thành niên ngoài dữ liệu tối thiểu và không đăng nếu chưa được quản trị viên nhóm cho phép.

### Why switch (vs the status quo)

Người dùng không cần bỏ VNOJ/HNOJ/LQDOJ; Tin học trẻ LAB thắng nếu nó trở thành lớp học tập nằm trước và sau Online Judge. Họ chọn LAB để tìm đúng đề chính thức theo năm/bảng, bắt đầu một phiên có mục tiêu, nộp ở judge phù hợp qua deep-link, rồi ghi lại lỗi và nhận gợi ý ôn tiếp trong cùng một lịch sử. Nếu phiên bản thử nghiệm không giúp 7/10 người hoàn thành chu trình này mà không cần bảng tính/sổ phụ, dự án không có lý do để mở rộng.

## Technically free vs hard

- Free (solved by libraries/platforms): giao diện React/Vinext, timer phía client, truy vấn/tìm kiếm D1, biểu đồ tiến bộ cơ bản, lưu Markdown/metadata, liên kết PDF và deep-link sang judge có thể dùng stack hiện tại cùng thư viện mã nguồn mở.
- Hard (custom work, real risk): xác minh nguồn và quyền sử dụng cho kho 10 năm; chuẩn hóa/trùng lặp metadata; ánh xạ đề sang chủ đề/độ khó có chất lượng học thuật; cô lập danh tính người học; đo “học được” thay vì chỉ đếm lượt làm. Tự chạy mã không tin cậy là rủi ro an toàn cấp cao, nên v1 dùng judge ngoài và chỉ xem xét sandbox riêng sau khi luồng học được kiểm chứng.
