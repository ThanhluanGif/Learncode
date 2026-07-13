# 📋 BA Workflow — TinHocTre Platform

> **Phiên bản:** 1.0  
> **Cập nhật:** 2026-07-13  
> **Tác giả:** BA Team — TinHocTre  
> **Trạng thái:** ✅ Active

---

## Mục lục

1. [Vai trò BA trong dự án](#1-vai-trò-ba-trong-dự-án)
2. [Thu thập yêu cầu](#2-thu-thập-yêu-cầu)
3. [User Stories mẫu](#3-user-stories-mẫu)
4. [API Contract Template](#4-api-contract-template)
5. [Wireframe Checklist](#5-wireframe-checklist)
6. [Sprint Ceremonies](#6-sprint-ceremonies)
7. [Nghiệm thu & Sign-off](#7-nghiệm-thu--sign-off)
8. [Đặc thù Tin Học Trẻ (THT)](#8-đặc-thù-tin-học-trẻ-tht)

---

## 1. Vai trò BA trong dự án

### 1.1 Tổng quan quy trình BA

```mermaid
graph LR
    A["🔍 Thu thập\nyêu cầu"] --> B["📝 Viết Spec\n& User Stories"]
    B --> C["🤝 Handoff\ncho Dev Team"]
    C --> D["🏗️ Theo dõi\nSprint"]
    D --> E["✅ Nghiệm thu\n& Sign-off"]
    E -->|"Feedback loop"| A

    style A fill:#4F46E5,stroke:#3730A3,color:#fff
    style B fill:#7C3AED,stroke:#6D28D9,color:#fff
    style C fill:#2563EB,stroke:#1D4ED8,color:#fff
    style D fill:#0891B2,stroke:#0E7490,color:#fff
    style E fill:#059669,stroke:#047857,color:#fff
```

### 1.2 Chi tiết từng giai đoạn

```mermaid
flowchart TD
    subgraph PHASE1["📊 Phase 1 — Thu thập"]
        A1["Phỏng vấn\nStakeholders"] --> A2["Khảo sát\nGiáo viên"]
        A2 --> A3["Phân tích\nđối thủ"]
        A3 --> A4["Tổng hợp\nPain Points"]
    end

    subgraph PHASE2["📝 Phase 2 — Spec"]
        B1["Viết User Stories\n(INVEST)"] --> B2["Định nghĩa\nAcceptance Criteria"]
        B2 --> B3["Thiết kế\nAPI Contract"]
        B3 --> B4["Review\nWireframes"]
    end

    subgraph PHASE3["🤝 Phase 3 — Handoff"]
        C1["Sprint Planning\nPresentation"] --> C2["Grooming\nBacklog"]
        C2 --> C3["Clarify\nQ&A Session"]
    end

    subgraph PHASE4["✅ Phase 4 — Nghiệm thu"]
        D1["Test theo\nAC"] --> D2["UAT với\nGiáo viên"]
        D2 --> D3["Sign-off\nDocument"]
    end

    PHASE1 --> PHASE2 --> PHASE3 --> PHASE4
    PHASE4 -->|"Iteration"| PHASE1
```

### 1.3 Trách nhiệm BA (RACI Matrix)

| Hoạt động | BA | PO | Dev Lead | QA | Designer |
|---|:---:|:---:|:---:|:---:|:---:|
| Thu thập yêu cầu | **R** | A | C | I | I |
| Viết User Stories | **R** | A | C | C | I |
| Định nghĩa AC | **R** | A | C | **R** | I |
| API Contract | C | I | **R** | C | I |
| Wireframe Review | **R** | A | I | I | **R** |
| Sprint Planning | **R** | A | **R** | C | I |
| UAT Coordination | **R** | A | C | **R** | I |
| Sign-off | C | **R** | I | C | I |

> **R** = Responsible · **A** = Accountable · **C** = Consulted · **I** = Informed

---

## 2. Thu thập yêu cầu

### 2.1 Cách phỏng vấn giáo viên Tin học

#### Nguyên tắc phỏng vấn

| # | Nguyên tắc | Mô tả | Ví dụ |
|---|---|---|---|
| 1 | **Mở đầu bằng bối cảnh** | Hỏi về workflow hiện tại trước khi đề xuất giải pháp | "Thầy/cô hiện đang tổ chức luyện tập code cho học sinh như thế nào?" |
| 2 | **Dùng câu hỏi mở** | Tránh câu hỏi Yes/No, khuyến khích mô tả chi tiết | "Khó khăn lớn nhất khi chấm bài online là gì?" |
| 3 | **Follow the pain** | Đào sâu vào pain points thay vì feature wishes | "Điều gì khiến thầy/cô mất nhiều thời gian nhất?" |
| 4 | **Quan sát thực tế** | Xin phép ngồi dự 1 buổi luyện tập để hiểu context | Ghi chép hành vi thực tế của GV và HS |
| 5 | **Validate bằng prototype** | Show wireframe/mockup để xác nhận hiểu đúng | "Em hiểu đúng ý thầy/cô chưa ạ?" |

#### Phân loại đối tượng phỏng vấn

```mermaid
mindmap
  root((Stakeholders))
    Giáo viên
      GV Tin THCS
      GV Tin THPT
      GV CLB Tin học
      Coach đội tuyển
    Học sinh
      HS lớp 6-9
      HS lớp 10-12
      HS đội tuyển
    Phụ huynh
      PH quan tâm STEM
      PH có con thi THT
    Ban tổ chức
      Sở GD&ĐT
      Phòng CNTT trường
```

#### Kịch bản phỏng vấn mẫu (60 phút)

| Thời gian | Hoạt động | Nội dung |
|---|---|---|
| 0–5 phút | **Warm-up** | Giới thiệu bản thân, mục đích buổi nói chuyện, xin phép ghi âm |
| 5–15 phút | **Bối cảnh** | Tìm hiểu vai trò, kinh nghiệm dạy Tin, số lượng HS |
| 15–35 phút | **Pain points** | Đào sâu vấn đề hiện tại, workflow dạy-luyện-thi |
| 35–50 phút | **Feature validation** | Show mockup, thu thập phản hồi về giải pháp đề xuất |
| 50–55 phút | **Prioritization** | Cho GV xếp hạng 5 tính năng quan trọng nhất |
| 55–60 phút | **Wrap-up** | Tóm tắt, hỏi thêm contact để follow-up |

### 2.2 Phân tích đối thủ

| Tiêu chí | HNOJ | VNOJ | uCode | LQDOJ | **TinHocTre** (Target) |
|---|---|---|---|---|---|
| **Đối tượng chính** | HS chuyên Tin | Cộng đồng CP | Học sinh phổ thông | HS chuyên Lê Quý Đôn | HS luyện thi THT |
| **Ngôn ngữ** | C/C++, Pascal | C/C++, Python, Java | Blockly, Python | C/C++, Python | C/C++, Python, Pascal |
| **Hệ thống bài** | Phân loại theo chủ đề | Tag + Difficulty | Theo chương trình | Theo contest | **Bảng A/B/C1/C2** |
| **Chấm bài** | Online Judge | DMOJ-based | Auto-grade | DMOJ-based | **Realtime + AI hints** |
| **Contest** | Có (IOI-style) | Có (đa dạng format) | Không | Có (ICPC/IOI) | **Mô phỏng THT chính thức** |
| **Analytics** | Cơ bản | Trung bình | Gamification | Cơ bản | **AI-powered insights** |
| **Mobile** | Responsive | Responsive | App mobile | Responsive | **PWA + Responsive** |
| **Tích hợp GV** | Không | Không | Có | Không | **Dashboard GV đầy đủ** |
| **Subtask scoring** | Có | Có | Không | Có | **Có + Visual breakdown** |

#### Competitive Gap Analysis

```mermaid
quadrantChart
    title Bản đồ cạnh tranh — OJ Việt Nam
    x-axis "Ít tính năng" --> "Nhiều tính năng"
    y-axis "Khó tiếp cận" --> "Dễ tiếp cận"
    quadrant-1 "Dẫn đầu"
    quadrant-2 "Dễ dùng"
    quadrant-3 "Cơ bản"
    quadrant-4 "Chuyên sâu"
    VNOJ: [0.75, 0.35]
    HNOJ: [0.55, 0.30]
    LQDOJ: [0.50, 0.40]
    uCode: [0.35, 0.75]
    TinHocTre: [0.85, 0.80]
```

> [!IMPORTANT]
> **USP (Unique Selling Point) của TinHocTre:**
> - Duy nhất mô phỏng đúng format thi THT chính thức (Bảng A/B/C1/C2)
> - AI-powered hints & analytics cho từng học sinh
> - Dashboard quản lý lớp dành riêng cho giáo viên

### 2.3 Template 10 câu hỏi phỏng vấn

> [!TIP]
> Sử dụng template này cho **mọi buổi phỏng vấn** giáo viên. Điều chỉnh câu hỏi follow-up theo ngữ cảnh.

| # | Câu hỏi | Mục đích | Ghi chú |
|:---:|---|---|---|
| 1 | "Thầy/cô hiện đang sử dụng **công cụ nào** để cho học sinh luyện code? Điểm mạnh/yếu của nó?" | Hiểu status quo & pain points | Liệt kê cụ thể tên tool |
| 2 | "Quy trình **ra đề → giao bài → chấm bài → trả kết quả** hiện tại diễn ra như thế nào?" | Map workflow hiện tại | Vẽ sơ đồ ngay tại chỗ |
| 3 | "Thầy/cô **mất bao lâu** để chuẩn bị 1 bộ đề luyện tập (5-10 bài)? Phần nào tốn thời gian nhất?" | Quantify pain, tìm automation opportunity | Ghi số liệu cụ thể |
| 4 | "Học sinh thường gặp **khó khăn gì nhất** khi luyện code online? Thầy/cô hỗ trợ như thế nào?" | Hiểu HS perspective qua lăng kính GV | Đào sâu: debug, logic, syntax? |
| 5 | "Nếu có 1 hệ thống **tự động gợi ý lỗi sai** cho học sinh, thầy/cô nghĩ nó nên hoạt động thế nào?" | Validate AI hints feature | Không gợi ý giải pháp trước |
| 6 | "Thầy/cô có tổ chức **contest/thi thử** không? Format nào? Khó khăn khi tổ chức?" | Thu thập requirement Contest module | Hỏi về timing, scoring, ranking |
| 7 | "Thầy/cô muốn **theo dõi tiến độ** học sinh như thế nào? Hiện tại có report nào không?" | Requirement cho Analytics dashboard | Hỏi về metrics quan trọng nhất |
| 8 | "Khi luyện thi THT, thầy/cô **phân loại bài tập** theo tiêu chí nào? (Bảng, chủ đề, độ khó?)" | Hiểu cách categorize phù hợp THT | Map với Bảng A/B/C1/C2 |
| 9 | "Nếu hệ thống có **1 tính năng duy nhất**, thầy/cô muốn tính năng đó là gì? Tại sao?" | Force-rank priority, tìm MVP feature | Tính năng = Must-have |
| 10 | "Thầy/cô có **lo ngại gì** về việc chuyển sang hệ thống mới không? (Bảo mật, chi phí, learning curve?)" | Identify adoption barriers sớm | Lên kế hoạch mitigate |

#### Mẫu tổng hợp kết quả phỏng vấn

```markdown
## Báo cáo phỏng vấn #[số]

- **Ngày:** DD/MM/YYYY
- **Người phỏng vấn:** [Tên BA]
- **Đối tượng:** [Tên GV] — [Trường] — [Số năm dạy Tin]
- **Thời lượng:** [X] phút

### Phát hiện chính (Key Findings)
1. [Finding 1 — Pain point]
2. [Finding 2 — Insight]
3. [Finding 3 — Feature request]

### Trích dẫn đáng chú ý (Quotes)
> "[Nguyên văn quote từ GV]"

### Action Items
- [ ] [Hành động cần thực hiện]
- [ ] [Hành động cần thực hiện]

### Phân loại pain points
| Pain Point | Mức độ (1-5) | Tần suất | Module liên quan |
|---|:---:|---|---|
| [Mô tả] | [X] | [Hàng ngày/tuần/tháng] | [Auth/Problems/...] |
```

---

## 3. User Stories mẫu

> [!NOTE]
> Tất cả User Stories tuân theo nguyên tắc **INVEST**: Independent, Negotiable, Valuable, Estimable, Small, Testable.

### 3.1 US-001 — Đăng ký tài khoản học sinh (Module: Auth)

| Field | Value |
|---|---|
| **ID** | US-001 |
| **Module** | 🔐 Auth |
| **Epic** | Quản lý tài khoản |
| **Sprint** | Sprint 1 |
| **Priority** | 🔴 Critical |
| **Story Points** | 5 |
| **Assignee** | Frontend + Backend |

**User Story:**
> *Là **học sinh**, tôi muốn **đăng ký tài khoản bằng email hoặc Google**, để **bắt đầu luyện code trên TinHocTre mà không cần thủ tục phức tạp**.*

**Acceptance Criteria:**

```gherkin
Feature: Đăng ký tài khoản học sinh

  Scenario: Đăng ký thành công bằng email
    Given người dùng ở trang đăng ký
    And người dùng chưa có tài khoản trên hệ thống
    When người dùng nhập email hợp lệ, mật khẩu (≥8 ký tự, có chữ + số), họ tên, và lớp
    And người dùng nhấn nút "Đăng ký"
    Then hệ thống gửi email xác nhận đến địa chỉ đã nhập
    And hiển thị thông báo "Vui lòng kiểm tra email để xác nhận tài khoản"
    And tài khoản ở trạng thái "Chờ xác nhận"

  Scenario: Đăng ký thành công bằng Google OAuth
    Given người dùng ở trang đăng ký
    When người dùng nhấn nút "Đăng ký bằng Google"
    And người dùng chọn tài khoản Google và cấp quyền
    Then hệ thống tạo tài khoản mới với thông tin từ Google profile
    And chuyển hướng đến trang "Hoàn tất hồ sơ" để nhập lớp và trường
    And tài khoản ở trạng thái "Đã xác nhận"

  Scenario: Đăng ký thất bại — email đã tồn tại
    Given người dùng ở trang đăng ký
    When người dùng nhập email đã được đăng ký trước đó
    And nhấn nút "Đăng ký"
    Then hệ thống hiển thị lỗi "Email này đã được sử dụng. Bạn muốn đăng nhập?"
    And hiển thị link đến trang đăng nhập

  Scenario: Đăng ký thất bại — mật khẩu yếu
    Given người dùng ở trang đăng ký
    When người dùng nhập mật khẩu ít hơn 8 ký tự hoặc không chứa cả chữ và số
    Then hệ thống hiển thị realtime validation "Mật khẩu phải ≥8 ký tự, bao gồm chữ và số"
    And nút "Đăng ký" bị disable
```

**Definition of Done:**
- [ ] Unit tests cover ≥ 90% logic đăng ký
- [ ] E2E test cho cả 2 flow (email + Google)
- [ ] Rate limit: max 5 đăng ký / IP / giờ
- [ ] Responsive trên mobile (375px+)
- [ ] Accessibility: WCAG 2.1 AA

---

### 3.2 US-002 — Duyệt danh sách bài tập theo Bảng THT (Module: Problems)

| Field | Value |
|---|---|
| **ID** | US-002 |
| **Module** | 📚 Problems |
| **Epic** | Ngân hàng bài tập |
| **Sprint** | Sprint 2 |
| **Priority** | 🔴 Critical |
| **Story Points** | 8 |
| **Assignee** | Frontend + Backend |

**User Story:**
> *Là **học sinh luyện thi THT**, tôi muốn **duyệt và lọc bài tập theo Bảng A/B/C1/C2**, để **luyện đúng dạng bài phù hợp trình độ và bảng thi của mình**.*

**Acceptance Criteria:**

```gherkin
Feature: Duyệt danh sách bài tập theo Bảng THT

  Scenario: Xem danh sách bài tập có phân loại Bảng
    Given học sinh đã đăng nhập
    When học sinh truy cập trang "Bài tập"
    Then hệ thống hiển thị danh sách bài tập với các cột:
      | Cột           | Mô tả                              |
      | Tên bài       | Tên bài tập                        |
      | Bảng          | A / B / C1 / C2 (có badge màu)     |
      | Chủ đề        | Tag: Mảng, Đệ quy, DP, Graph...   |
      | Độ khó        | Dễ / Trung bình / Khó              |
      | Trạng thái    | ✅ Đã giải / ⏳ Đang làm / ⬜ Chưa |
      | Tỉ lệ AC     | Phần trăm submission AC            |
    And mặc định sắp xếp theo Bảng → Độ khó tăng dần

  Scenario: Lọc bài theo Bảng cụ thể
    Given học sinh ở trang "Bài tập"
    When học sinh chọn filter Bảng = "C1"
    Then chỉ hiển thị các bài thuộc Bảng C1
    And hiển thị badge "Đang lọc: Bảng C1" có nút xóa filter
    And URL cập nhật query param: ?bang=C1

  Scenario: Lọc kết hợp nhiều tiêu chí
    Given học sinh ở trang "Bài tập"
    When học sinh chọn Bảng = "B" AND Chủ đề = "Đệ quy" AND Độ khó = "Trung bình"
    Then chỉ hiển thị bài thỏa mãn tất cả điều kiện
    And hiển thị số lượng kết quả: "Tìm thấy X bài"

  Scenario: Không có kết quả
    Given học sinh ở trang "Bài tập" với filter đang active
    When không có bài nào thỏa điều kiện filter
    Then hiển thị empty state: "Không tìm thấy bài tập. Thử điều chỉnh bộ lọc nhé!"
    And hiển thị nút "Xóa tất cả filter"
```

**Definition of Done:**
- [ ] Pagination: 20 bài / trang, infinite scroll hoặc numbered pages
- [ ] Search: tìm kiếm theo tên bài (debounce 300ms)
- [ ] Performance: load ≤ 500ms với 1000+ bài
- [ ] Cache: client-side cache 5 phút

---

### 3.3 US-003 — Nộp bài và xem kết quả realtime (Module: Submissions)

| Field | Value |
|---|---|
| **ID** | US-003 |
| **Module** | 📤 Submissions |
| **Epic** | Chấm bài tự động |
| **Sprint** | Sprint 3 |
| **Priority** | 🔴 Critical |
| **Story Points** | 13 |
| **Assignee** | Full-stack + DevOps |

**User Story:**
> *Là **học sinh**, tôi muốn **nộp code và xem kết quả chấm từng test case realtime**, để **biết ngay bài mình đúng/sai ở đâu mà không phải đợi lâu**.*

**Acceptance Criteria:**

```gherkin
Feature: Nộp bài và xem kết quả realtime

  Scenario: Nộp bài thành công từ Code Editor
    Given học sinh đang ở trang bài tập với Code Editor mở
    And học sinh đã viết code hợp lệ (C++/Python/Pascal)
    When học sinh chọn ngôn ngữ và nhấn nút "Nộp bài"
    Then hệ thống hiển thị trạng thái "Đang chấm..." với animation
    And kết quả từng test case hiển thị realtime qua WebSocket:
      | Test | Trạng thái | Thời gian | Bộ nhớ  |
      | #1   | ✅ AC      | 0.02s     | 3.2 MB  |
      | #2   | ✅ AC      | 0.05s     | 3.4 MB  |
      | #3   | ❌ WA      | 0.03s     | 3.1 MB  |
    And hiển thị verdict tổng: "Wrong Answer — 2/3 test cases passed"
    And hiển thị điểm subtask (nếu bài có subtask)

  Scenario: Nộp bài có subtasks
    Given bài tập có 3 subtasks (30 + 30 + 40 điểm)
    When học sinh nộp code và chấm xong
    Then hiển thị breakdown điểm theo subtask:
      | Subtask | Tests    | Kết quả | Điểm     |
      | #1      | 1-3      | ✅ Pass | 30/30    |
      | #2      | 4-6      | ✅ Pass | 30/30    |
      | #3      | 7-10     | ❌ Fail | 0/40     |
      | **Tổng**|          |         | **60/100**|

  Scenario: Nộp bài bị Rate Limit
    Given học sinh đã nộp 10 bài trong 5 phút gần nhất
    When học sinh nhấn "Nộp bài" lần nữa
    Then hệ thống hiển thị "Bạn đã nộp quá nhiều. Vui lòng đợi X phút"
    And nút "Nộp bài" bị disable kèm countdown timer

  Scenario: Xem lịch sử submission
    Given học sinh đã nộp nhiều lần cho 1 bài
    When học sinh mở tab "Lịch sử nộp bài"
    Then hiển thị danh sách submissions mới nhất trước:
      | # | Thời gian        | Ngôn ngữ | Verdict | Điểm | Runtime |
      | 3 | 13/07 22:30      | C++17    | AC      | 100  | 0.12s   |
      | 2 | 13/07 22:15      | C++17    | WA      | 60   | 0.08s   |
      | 1 | 13/07 22:00      | Python3  | TLE     | 30   | 2.05s   |
    And mỗi submission có thể click để xem code + chi tiết kết quả
```

**Definition of Done:**
- [ ] WebSocket connection stable, auto-reconnect khi mất kết nối
- [ ] Hỗ trợ ngôn ngữ: C++17, Python 3.10+, Pascal (Free Pascal)
- [ ] Max code size: 64 KB
- [ ] Timeout hiển thị: nếu chấm > 30s → thông báo "Đang xử lý, sẽ gửi thông báo khi xong"
- [ ] Source code highlight syntax đúng ngôn ngữ

---

### 3.4 US-004 — Tạo và tham gia Contest mô phỏng THT (Module: Contest)

| Field | Value |
|---|---|
| **ID** | US-004 |
| **Module** | 🏆 Contest |
| **Epic** | Thi thử trực tuyến |
| **Sprint** | Sprint 4 |
| **Priority** | 🟠 High |
| **Story Points** | 13 |
| **Assignee** | Full-stack |

**User Story:**
> *Là **giáo viên**, tôi muốn **tạo contest mô phỏng đúng format thi THT (thời gian, số bài, cách tính điểm)**, để **học sinh được trải nghiệm áp lực thi thật và quen với quy trình**.*

**Acceptance Criteria:**

```gherkin
Feature: Tạo và quản lý Contest mô phỏng THT

  Scenario: Giáo viên tạo contest mới
    Given giáo viên đã đăng nhập với role TEACHER
    When giáo viên truy cập "Tạo Contest" và điền thông tin:
      | Field              | Value                          |
      | Tên contest        | THT Tỉnh 2026 — Đề thử #1    |
      | Bảng thi           | C1                             |
      | Thời gian bắt đầu  | 14/07/2026 08:00               |
      | Thời gian làm bài  | 150 phút                       |
      | Bài tập            | [Chọn 4 bài từ ngân hàng]     |
      | Cách tính điểm     | THT Standard (subtask-based)   |
      | Penalty            | Không trừ điểm nộp sai        |
      | Hiển thị bảng xếp hạng | Ẩn trong contest, hiện sau |
      | Mật khẩu tham gia  | [Tùy chọn]                    |
    And nhấn "Tạo Contest"
    Then hệ thống tạo contest và hiển thị link mời HS
    And gửi notification đến HS trong lớp (nếu có)

  Scenario: Học sinh tham gia contest
    Given contest đang trong thời gian diễn ra
    And học sinh đã đăng nhập
    When học sinh truy cập link contest và nhập mật khẩu (nếu có)
    Then hệ thống hiển thị:
      - Countdown timer (đếm ngược thời gian còn lại)
      - Danh sách bài tập (chỉ thấy tên + điểm tối đa)
      - Code Editor tích hợp
    And học sinh có thể nộp bài nhiều lần cho mỗi bài

  Scenario: Contest kết thúc
    Given thời gian làm bài đã hết
    When hệ thống đóng contest
    Then tất cả submission đang chờ được chấm xong
    And bảng xếp hạng được công khai (nếu GV cho phép)
    And mỗi HS nhận email kết quả chi tiết
    And GV nhận báo cáo tổng hợp (thống kê lớp)
```

**Definition of Done:**
- [ ] Hỗ trợ ≥ 200 thí sinh đồng thời / contest
- [ ] Anti-cheat: mỗi HS chỉ nộp từ 1 session
- [ ] Freeze scoreboard: 30 phút cuối (tùy chọn)
- [ ] Export kết quả: CSV, PDF

---

### 3.5 US-005 — Nhận gợi ý AI khi bị stuck (Module: AI)

| Field | Value |
|---|---|
| **ID** | US-005 |
| **Module** | 🤖 AI |
| **Epic** | Trợ lý AI cho học sinh |
| **Sprint** | Sprint 5 |
| **Priority** | 🟡 Medium |
| **Story Points** | 8 |
| **Assignee** | Backend (AI/ML) + Frontend |

**User Story:**
> *Là **học sinh**, tôi muốn **nhận gợi ý thông minh từ AI khi bị stuck ở 1 bài tập**, để **tự tìm ra hướng giải quyết thay vì bỏ cuộc hoặc xem đáp án**.*

**Acceptance Criteria:**

```gherkin
Feature: Gợi ý AI khi bị stuck

  Scenario: HS yêu cầu gợi ý lần đầu
    Given học sinh đã nộp bài ≥ 2 lần mà chưa AC
    And nút "Gợi ý AI 💡" hiển thị active
    When học sinh nhấn "Gợi ý AI"
    Then hệ thống phân tích code + verdict gần nhất
    And hiển thị gợi ý Level 1 (Hướng tiếp cận):
      - "Bài này có thể giải bằng kỹ thuật [tên kỹ thuật]"
      - "Hãy thử nghĩ về [hint trừu tượng]"
    And KHÔNG hiển thị code mẫu hoặc lời giải cụ thể
    And giảm 1 "AI credit" của HS (mỗi ngày có 10 credits)

  Scenario: HS yêu cầu gợi ý sâu hơn (Level 2)
    Given HS đã xem gợi ý Level 1 nhưng vẫn chưa AC sau 2 lần nộp tiếp
    When HS nhấn "Gợi ý chi tiết hơn"
    Then hiển thị gợi ý Level 2 (Phân tích lỗi cụ thể):
      - "Code của bạn bị [loại lỗi] ở [vị trí gợi ý]"
      - "Test case thất bại có đặc điểm: [mô tả pattern]"
    And giảm 2 AI credits

  Scenario: HS hết AI credits
    Given HS đã dùng hết 10 credits/ngày
    When HS nhấn "Gợi ý AI"
    Then hiển thị "Bạn đã dùng hết gợi ý hôm nay. Credits reset lúc 00:00"
    And hiển thị alternative: "Hãy thử đọc lại đề, kiểm tra edge cases, hoặc hỏi bạn bè!"

  Scenario: Giáo viên xem lịch sử AI hints của HS
    Given giáo viên truy cập hồ sơ HS
    When giáo viên xem tab "Lịch sử gợi ý AI"
    Then hiển thị danh sách bài HS đã dùng AI hint
    And thống kê: "HS dùng trung bình X hints/bài, AC rate sau hint: Y%"
```

**Definition of Done:**
- [ ] AI response time ≤ 3 giây
- [ ] Hints KHÔNG bao giờ chứa full solution
- [ ] Hỗ trợ tiếng Việt 100%
- [ ] GV có thể tắt AI hints cho contest cụ thể
- [ ] Logging: lưu tất cả AI interactions để improve model

---

### 📊 Tổng hợp User Stories Backlog

| ID | Module | Story | Points | Sprint | Priority | Status |
|---|---|---|:---:|:---:|---|---|
| US-001 | 🔐 Auth | Đăng ký tài khoản HS | 5 | S1 | 🔴 Critical | 📋 Backlog |
| US-002 | 📚 Problems | Duyệt bài theo Bảng THT | 8 | S2 | 🔴 Critical | 📋 Backlog |
| US-003 | 📤 Submissions | Nộp bài & kết quả realtime | 13 | S3 | 🔴 Critical | 📋 Backlog |
| US-004 | 🏆 Contest | Tạo Contest mô phỏng THT | 13 | S4 | 🟠 High | 📋 Backlog |
| US-005 | 🤖 AI | Gợi ý AI khi bị stuck | 8 | S5 | 🟡 Medium | 📋 Backlog |

**Velocity ước tính:** ~20 Story Points / Sprint (2 tuần)

---

## 4. API Contract Template

### 4.1 Template tổng quát

```yaml
# API Contract Template
# =====================

Endpoint:      [METHOD] /api/v1/[resource]
Version:       v1
Module:        [Module name]
Owner:         [Backend dev name]
Last Updated:  [Date]
Status:        [Draft / Review / Approved]

# Authentication
Auth:          Bearer JWT
Roles:         [STUDENT | TEACHER | ADMIN]

# Request
Headers:
  Content-Type:    application/json
  Authorization:   Bearer <token>
  X-Request-ID:    <uuid>          # Traceability

Path Params:       [nếu có]
Query Params:      [nếu có]
Request Body:      [JSON schema]

# Response
Success Response:  [status code + body]
Error Responses:   [list of error codes]

# Constraints
Rate Limit:        [requests/interval]
Max Payload:       [size]
Timeout:           [seconds]
```

### 4.2 Ví dụ: POST /api/v1/submissions

#### Request

```
POST /api/v1/submissions
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
```

**Request Body Schema:**

```json
{
  "problem_id": "prob_c1_001",
  "language": "cpp17",
  "source_code": "#include <iostream>\nint main() { ... }",
  "contest_id": "contest_tht_2026_01"   // optional — null nếu nộp luyện tập
}
```

| Field | Type | Required | Validation | Mô tả |
|---|---|:---:|---|---|
| `problem_id` | `string` | ✅ | Pattern: `^prob_[a-z0-9_]+$` | ID bài tập |
| `language` | `enum` | ✅ | `cpp17` \| `python3` \| `pascal` | Ngôn ngữ lập trình |
| `source_code` | `string` | ✅ | Max: 64 KB, Min: 10 chars | Mã nguồn |
| `contest_id` | `string` | ❌ | Pattern: `^contest_[a-z0-9_]+$` | ID contest (nếu nộp trong contest) |

#### Response — Success (201 Created)

```json
{
  "status": "success",
  "data": {
    "submission_id": "sub_20260713_223045_abc123",
    "problem_id": "prob_c1_001",
    "language": "cpp17",
    "status": "QUEUED",
    "created_at": "2026-07-13T22:30:45+07:00",
    "estimated_wait": 5,
    "websocket_channel": "wss://api.tinhoctre.edu.vn/ws/submissions/sub_20260713_223045_abc123"
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "remaining_submissions": 8,
    "rate_limit_reset": "2026-07-13T22:35:00+07:00"
  }
}
```

#### WebSocket — Realtime Judging Updates

```
Channel: wss://api.tinhoctre.edu.vn/ws/submissions/{submission_id}
```

**Yêu cầu bảo mật:** API production chỉ được phát hành endpoint `wss`. Client phải từ
chối endpoint WebSocket không mã hóa thay vì tự động hạ cấp kết nối; token xác thực và
thông tin bài nộp không được truyền qua kênh plaintext.

**Message format:**

```json
// Từng test case
{
  "type": "TEST_RESULT",
  "data": {
    "test_number": 1,
    "subtask": 1,
    "verdict": "AC",
    "time_ms": 23,
    "memory_kb": 3276,
    "score": 10
  }
}

// Kết quả cuối
{
  "type": "FINAL_RESULT",
  "data": {
    "verdict": "PARTIAL",
    "total_score": 60,
    "max_score": 100,
    "total_time_ms": 156,
    "max_memory_kb": 4520,
    "subtasks": [
      { "id": 1, "score": 30, "max_score": 30, "verdict": "AC" },
      { "id": 2, "score": 30, "max_score": 30, "verdict": "AC" },
      { "id": 3, "score": 0,  "max_score": 40, "verdict": "WA" }
    ],
    "test_results": [
      { "test": 1, "verdict": "AC", "time_ms": 12, "memory_kb": 3200 },
      { "test": 2, "verdict": "AC", "time_ms": 15, "memory_kb": 3250 },
      { "test": 3, "verdict": "AC", "time_ms": 23, "memory_kb": 3276 },
      { "test": 4, "verdict": "AC", "time_ms": 18, "memory_kb": 3300 },
      { "test": 5, "verdict": "AC", "time_ms": 20, "memory_kb": 3350 },
      { "test": 6, "verdict": "AC", "time_ms": 25, "memory_kb": 3400 },
      { "test": 7, "verdict": "WA", "time_ms": 15, "memory_kb": 3100 },
      { "test": 8, "verdict": "WA", "time_ms": 18, "memory_kb": 3150 },
      { "test": 9, "verdict": "TLE", "time_ms": 2000, "memory_kb": 4520 },
      { "test": 10, "verdict": "WA", "time_ms": 10, "memory_kb": 3050 }
    ]
  }
}
```

#### Error Responses

| HTTP Code | Error Code | Message | Mô tả | Xử lý phía Client |
|:---:|---|---|---|---|
| `400` | `INVALID_LANGUAGE` | "Ngôn ngữ không được hỗ trợ" | Language không nằm trong enum | Hiển thị dropdown chỉ có 3 options |
| `400` | `CODE_TOO_LARGE` | "Mã nguồn vượt quá 64KB" | Source code > 64 KB | Hiển thị counter byte realtime |
| `400` | `CODE_TOO_SHORT` | "Mã nguồn quá ngắn" | Source code < 10 chars | Validation trước khi gửi |
| `401` | `UNAUTHORIZED` | "Vui lòng đăng nhập" | Token missing hoặc expired | Redirect login page |
| `403` | `CONTEST_NOT_STARTED` | "Contest chưa bắt đầu" | Nộp trước giờ thi | Hiển thị countdown |
| `403` | `CONTEST_ENDED` | "Contest đã kết thúc" | Nộp sau giờ thi | Disable nút nộp |
| `404` | `PROBLEM_NOT_FOUND` | "Không tìm thấy bài tập" | Problem ID không tồn tại | Redirect problems list |
| `429` | `RATE_LIMITED` | "Nộp quá nhanh. Đợi {wait}s" | Vượt rate limit | Hiển thị countdown timer |
| `500` | `JUDGE_ERROR` | "Lỗi hệ thống chấm" | Judge server down | Hiển thị retry + status page |
| `503` | `JUDGE_OVERLOADED` | "Hệ thống đang bận" | Queue quá tải | Hiển thị estimated wait time |

#### Rate Limits

| Ngữ cảnh | Limit | Window | Header |
|---|---|---|---|
| Luyện tập (mỗi user) | 10 submissions | 5 phút | `X-RateLimit-Remaining` |
| Trong contest (mỗi user) | 50 submissions | Toàn contest | `X-Contest-Submissions-Remaining` |
| Toàn hệ thống | 1000 submissions | 1 phút | — |

#### Ví dụ cURL

```bash
curl -X POST https://api.tinhoctre.edu.vn/api/v1/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..." \
  -H "X-Request-ID: $(uuidgen)" \
  -d '{
    "problem_id": "prob_c1_001",
    "language": "cpp17",
    "source_code": "#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    cout << n * 2;\n    return 0;\n}"
  }'
```

---

## 5. Wireframe Checklist

> [!TIP]
> Mỗi wireframe cần được review bởi **BA + Designer + 1 Dev** trước khi chuyển sang high-fidelity design.

### 5.1 Tổng quan 7 trang chính

```mermaid
graph TD
    L["🏠 Landing Page"] --> PL["📚 Problems List"]
    L --> CA["🏆 Contest Arena"]
    L --> AD["⚙️ Admin Dashboard"]
    PL --> CE["💻 Code Editor"]
    CE --> SB["📊 Scoreboard"]
    CA --> SB
    AD --> AN["📈 Analytics"]

    style L fill:#4F46E5,stroke:#3730A3,color:#fff
    style PL fill:#7C3AED,stroke:#6D28D9,color:#fff
    style CE fill:#2563EB,stroke:#1D4ED8,color:#fff
    style CA fill:#DC2626,stroke:#B91C1C,color:#fff
    style SB fill:#059669,stroke:#047857,color:#fff
    style AN fill:#D97706,stroke:#B45309,color:#fff
    style AD fill:#4B5563,stroke:#374151,color:#fff
```

### 5.2 Checklist chi tiết từng trang

#### 🏠 Trang 1: Landing Page

| # | Element | Trạng thái | Notes |
|:---:|---|:---:|---|
| 1 | Hero section với tagline + CTA "Bắt đầu luyện code" | ⬜ | Animation subtle |
| 2 | Stats section: Số bài tập, HS, contest | ⬜ | Realtime counter |
| 3 | Feature highlights (3-4 cards) | ⬜ | Icon + mô tả ngắn |
| 4 | Testimonials từ GV/HS | ⬜ | Carousel |
| 5 | Bảng so sánh THT levels (A/B/C1/C2) | ⬜ | Interactive tabs |
| 6 | Footer: links, contact, social media | ⬜ | |
| 7 | Responsive breakpoints: 375/768/1024/1440px | ⬜ | Mobile-first |
| 8 | Loading state / skeleton screen | ⬜ | |
| 9 | SEO meta tags + Open Graph | ⬜ | |

#### 📚 Trang 2: Problems List

| # | Element | Trạng thái | Notes |
|:---:|---|:---:|---|
| 1 | Sidebar filter: Bảng, Chủ đề, Độ khó, Trạng thái | ⬜ | Collapsible trên mobile |
| 2 | Search bar với autocomplete | ⬜ | Debounce 300ms |
| 3 | Problems table/cards | ⬜ | Toggle view: table/card |
| 4 | Pagination hoặc infinite scroll | ⬜ | 20 items/page |
| 5 | Sort options: Mới nhất, AC rate, Độ khó | ⬜ | |
| 6 | Quick stats: Tổng bài, Đã giải, Streak | ⬜ | Sticky top bar |
| 7 | Badge hệ thống cho Bảng (A=🟢, B=🔵, C1=🟡, C2=🔴) | ⬜ | Consistent across app |
| 8 | Empty state khi không có kết quả | ⬜ | Illustration + CTA |
| 9 | Bookmark/Save bài tập | ⬜ | |

#### 💻 Trang 3: Code Editor

| # | Element | Trạng thái | Notes |
|:---:|---|:---:|---|
| 1 | Problem description panel (left) | ⬜ | Markdown render, resizable |
| 2 | Code editor panel (right) | ⬜ | Monaco Editor |
| 3 | Language selector: C++17, Python3, Pascal | ⬜ | Dropdown |
| 4 | Theme selector: Dark/Light | ⬜ | Default: Dark |
| 5 | Font size control | ⬜ | 12-20px |
| 6 | Nút "Chạy thử" (test với sample) | ⬜ | Custom input support |
| 7 | Nút "Nộp bài" (submit) | ⬜ | Confirm dialog |
| 8 | Test results panel (bottom) | ⬜ | Expandable |
| 9 | Subtask breakdown visualization | ⬜ | Progress bars |
| 10 | AI Hint button + hint display | ⬜ | Slide-in panel |
| 11 | Submission history tab | ⬜ | Table with diff view |
| 12 | Keyboard shortcuts overlay (Ctrl+Enter = Submit) | ⬜ | Help modal |
| 13 | Auto-save draft (localStorage) | ⬜ | Every 30s |
| 14 | Split view resizer (drag handle) | ⬜ | Min 300px each side |

#### 🏆 Trang 4: Contest Arena

| # | Element | Trạng thái | Notes |
|:---:|---|:---:|---|
| 1 | Contest list: Upcoming, Running, Past | ⬜ | Tab navigation |
| 2 | Contest card: Tên, Bảng, Thời gian, Số HS, Trạng thái | ⬜ | Color-coded status |
| 3 | Countdown timer (running contest) | ⬜ | Persistent, sticky |
| 4 | Problem list trong contest | ⬜ | AC status per problem |
| 5 | Submit flow (tích hợp Code Editor) | ⬜ | Same as Trang 3 |
| 6 | Mini scoreboard (collapsible) | ⬜ | Real-time update |
| 7 | Contest rules / instructions modal | ⬜ | Show once on enter |
| 8 | Nút "Kết thúc sớm" cho HS | ⬜ | Confirm dialog |
| 9 | GV panel: tạo, edit, monitor contest | ⬜ | Role-based access |

#### 📊 Trang 5: Scoreboard

| # | Element | Trạng thái | Notes |
|:---:|---|:---:|---|
| 1 | Ranking table: Hạng, Tên, Trường, Tổng điểm, Penalty | ⬜ | Sortable columns |
| 2 | Điểm từng bài (columns) | ⬜ | Color: AC=green, Partial=yellow, None=gray |
| 3 | First-solve highlight (🥇) | ⬜ | Bold + badge |
| 4 | Freeze indicator (nếu có) | ⬜ | "Frozen 30 phút cuối" |
| 5 | Search participant | ⬜ | Filter by name/school |
| 6 | Export: CSV, PDF | ⬜ | GV only |
| 7 | Live update indicator | ⬜ | Pulse dot animation |
| 8 | Pagination (nếu > 100 HS) | ⬜ | |
| 9 | "My rank" quick jump | ⬜ | Highlight row |

#### 📈 Trang 6: Analytics Dashboard

| # | Element | Trạng thái | Notes |
|:---:|---|:---:|---|
| 1 | Overview cards: Bài đã giải, Streak, Ranking | ⬜ | Animated counters |
| 2 | Heatmap luyện tập (kiểu GitHub contributions) | ⬜ | Tooltips per day |
| 3 | Biểu đồ tiến độ theo thời gian (line chart) | ⬜ | Filter by Bảng |
| 4 | Phân bố kết quả: AC/WA/TLE/MLE/RE (pie chart) | ⬜ | Interactive |
| 5 | Mạnh/yếu theo chủ đề (radar chart) | ⬜ | So sánh với TB |
| 6 | Đề xuất bài tập tiếp theo (AI) | ⬜ | "Bạn nên luyện thêm: ..." |
| 7 | So sánh với bạn bè / lớp | ⬜ | Anonymized option |
| 8 | GV view: thống kê toàn lớp | ⬜ | Aggregate metrics |
| 9 | Export report (PDF) | ⬜ | Cho phụ huynh |

#### ⚙️ Trang 7: Admin Dashboard

| # | Element | Trạng thái | Notes |
|:---:|---|:---:|---|
| 1 | System overview: Users, Submissions, Uptime | ⬜ | Realtime metrics |
| 2 | User management: CRUD, Role assignment | ⬜ | Search + filter |
| 3 | Problem management: CRUD, test cases | ⬜ | Bulk import |
| 4 | Contest management | ⬜ | Clone contest feature |
| 5 | Judge status monitor | ⬜ | Queue size, avg time |
| 6 | Announcements / Notifications | ⬜ | Rich text editor |
| 7 | System logs viewer | ⬜ | Filter by severity |
| 8 | Settings: rate limits, AI credits, languages | ⬜ | |
| 9 | Audit trail | ⬜ | Who changed what when |

---

## 6. Sprint Ceremonies

### 6.1 Tổng quan Sprint (2 tuần)

```mermaid
gantt
    title Sprint Timeline — 2 tuần
    dateFormat  YYYY-MM-DD
    axisFormat  %a %d/%m

    section Ceremonies
    Sprint Planning       :crit, plan, 2026-07-14, 1d
    Daily Standup (D1-D9) :active, daily, 2026-07-15, 9d
    Sprint Review         :crit, review, 2026-07-25, 1d
    Retrospective         :retro, 2026-07-25, 1d

    section Development
    Development           :dev, 2026-07-15, 8d
    QA & Testing          :qa, 2026-07-23, 2d
    Bug fixes             :fix, 2026-07-24, 1d
```

### 6.2 Sequence Diagram — Sprint Ceremonies

```mermaid
sequenceDiagram
    actor PO as Product Owner
    actor BA as Business Analyst
    actor DEV as Dev Team
    actor QA as QA Engineer

    rect rgb(79, 70, 229, 0.1)
    Note over PO, QA: 📋 SPRINT PLANNING (Thứ 2, 2-3h)
    PO->>BA: Chia sẻ Sprint Goal & priorities
    BA->>DEV: Present User Stories + AC chi tiết
    DEV->>BA: Hỏi clarification questions
    BA->>DEV: Trả lời + cập nhật spec nếu cần
    DEV->>DEV: Estimate Story Points (Planning Poker)
    DEV->>PO: Commit Sprint Backlog (~20 SP)
    PO->>DEV: Confirm Sprint Goal
    end

    rect rgb(5, 150, 105, 0.1)
    Note over PO, QA: 🔄 DAILY STANDUP (Hàng ngày, 15 phút)
    loop Mỗi ngày 9:00 AM
        DEV->>DEV: Hôm qua làm gì?
        DEV->>DEV: Hôm nay sẽ làm gì?
        DEV->>BA: Có blocker nào không?
        BA->>DEV: Giải quyết blocker / clarify requirement
    end
    end

    rect rgb(37, 99, 235, 0.1)
    Note over PO, QA: 🎯 SPRINT REVIEW (Thứ 6 tuần 2, 1-2h)
    DEV->>PO: Demo các feature hoàn thành
    BA->>PO: Map demo với User Stories & AC
    QA->>PO: Báo cáo test results
    PO->>DEV: Feedback & chấp nhận/từ chối stories
    PO->>BA: Cập nhật backlog priorities cho sprint sau
    end

    rect rgb(220, 38, 38, 0.1)
    Note over PO, QA: 🔍 RETROSPECTIVE (Thứ 6 tuần 2, 1h)
    BA->>DEV: Facilitator: "Điều gì tốt?"
    DEV->>BA: Chia sẻ positives
    BA->>DEV: "Điều gì cần cải thiện?"
    DEV->>BA: Chia sẻ improvements
    QA->>BA: QA perspective
    BA->>DEV: Tổng hợp → 2-3 action items cho sprint sau
    end
```

### 6.3 Chi tiết từng Ceremony

#### 📋 Sprint Planning

| Aspect | Chi tiết |
|---|---|
| **Thời gian** | Thứ 2 đầu sprint, 09:00 – 12:00 (max 3h) |
| **Người tham gia** | PO, BA, Dev Team, QA |
| **Input** | Product Backlog (prioritized), Velocity (trung bình 20 SP) |
| **Output** | Sprint Backlog, Sprint Goal, Task breakdown |
| **BA chuẩn bị** | User Stories + AC đã groomed, Wireframes, API contracts |

**Agenda:**
1. PO trình bày Sprint Goal (10 phút)
2. BA present từng User Story + AC (60 phút)
3. Team hỏi-đáp, clarify requirements (30 phút)
4. Planning Poker — estimate SP (45 phút)
5. Commit Sprint Backlog (15 phút)
6. Task breakdown — Ai làm gì (30 phút)

#### 🔄 Daily Standup

| Aspect | Chi tiết |
|---|---|
| **Thời gian** | Hàng ngày 09:00, max 15 phút |
| **Format** | Đứng (hoặc virtual call ngắn) |
| **3 câu hỏi** | ① Hôm qua xong gì? ② Hôm nay làm gì? ③ Có blocker? |
| **BA role** | Ghi nhận blockers, clarify requirement on-the-fly |

> [!WARNING]
> Daily KHÔNG phải buổi báo cáo. Nếu cần thảo luận sâu → "Parking lot" → Setup meeting riêng sau standup.

#### 🎯 Sprint Review

| Aspect | Chi tiết |
|---|---|
| **Thời gian** | Thứ 6 cuối sprint, 14:00 – 16:00 (max 2h) |
| **Người tham gia** | PO, BA, Dev Team, QA, Stakeholders (GV mời) |
| **Format** | Demo trực tiếp trên staging environment |
| **BA role** | Map demo → User Story → AC, ghi nhận feedback |

**Demo Script Template:**

```markdown
## Sprint [X] Review — Demo Script

### Story: US-[XXX] — [Tên story]
- **Demo bởi:** [Dev name]
- **AC check:**
  - [x] Scenario 1: [mô tả] → PASS
  - [x] Scenario 2: [mô tả] → PASS
  - [ ] Scenario 3: [mô tả] → FAIL (bug #123)
- **PO decision:** ✅ Accepted / ❌ Rejected
- **Feedback:** [Ghi chú từ PO/stakeholder]
```

#### 🔍 Retrospective

| Aspect | Chi tiết |
|---|---|
| **Thời gian** | Ngay sau Sprint Review, 16:00 – 17:00 (max 1h) |
| **Format** | Start-Stop-Continue hoặc Sailboat |
| **BA role** | Facilitator, ghi chép, theo dõi action items |

**Template Retro — Sailboat:**

```
🌬️ GIÓ (Điều giúp team tiến nhanh):
- [Positive 1]
- [Positive 2]

⚓ NEO (Điều kéo team chậm lại):
- [Negative 1]
- [Negative 2]

🪨 ĐÁ NGẦM (Rủi ro tiềm ẩn):
- [Risk 1]
- [Risk 2]

🏝️ ĐẢO (Mục tiêu muốn đạt được):
- [Goal 1]
- [Goal 2]

📌 ACTION ITEMS (Sprint sau):
1. [Action] → Owner: [Tên] → Deadline: [Date]
2. [Action] → Owner: [Tên] → Deadline: [Date]
```

---

## 7. Nghiệm thu & Sign-off

### 7.1 Quy trình nghiệm thu

```mermaid
flowchart LR
    A["Dev hoàn thành\nStory"] --> B["QA test\ntheo AC"]
    B -->|Pass| C["BA review\n& verify"]
    B -->|Fail| A
    C -->|Pass| D["UAT với\nGV/HS"]
    C -->|Fail| A
    D -->|Pass| E["PO\nSign-off"]
    D -->|Fail| A
    E --> F["Deploy\nProduction"]

    style A fill:#6B7280,stroke:#4B5563,color:#fff
    style B fill:#2563EB,stroke:#1D4ED8,color:#fff
    style C fill:#7C3AED,stroke:#6D28D9,color:#fff
    style D fill:#D97706,stroke:#B45309,color:#fff
    style E fill:#059669,stroke:#047857,color:#fff
    style F fill:#4F46E5,stroke:#3730A3,color:#fff
```

### 7.2 Sign-off Template

```markdown
# ✅ Biên bản nghiệm thu — Sprint [X]

## Thông tin chung

| Field | Value |
|---|---|
| Sprint | Sprint [X] |
| Ngày nghiệm thu | DD/MM/YYYY |
| Người nghiệm thu | [Tên PO], [Tên BA], [Tên QA] |
| Môi trường test | Staging — https://staging.tinhoctre.edu.vn |
| Version | v[X.Y.Z] — Build #[XXX] |

## Kết quả nghiệm thu

### User Stories

| ID | Story | AC Tests | Pass | Fail | Kết quả | Ghi chú |
|---|---|:---:|:---:|:---:|:---:|---|
| US-001 | Đăng ký tài khoản | 4 | 4 | 0 | ✅ Accept | |
| US-002 | Duyệt bài theo Bảng | 4 | 3 | 1 | ⚠️ Accept có điều kiện | Bug #45: filter reset |
| US-003 | Nộp bài realtime | 4 | 4 | 0 | ✅ Accept | |

### Tổng hợp

| Metric | Giá trị |
|---|---|
| Tổng Stories | [X] |
| Accepted | [X] ✅ |
| Accepted có điều kiện | [X] ⚠️ |
| Rejected | [X] ❌ |
| Story Points hoàn thành | [X] / [Y] SP |
| Velocity | [X] SP |
| Bug phát hiện | [X] (Critical: [X], Major: [X], Minor: [X]) |

### Bugs mở (Accept có điều kiện)

| Bug ID | Severity | Mô tả | Deadline fix | Owner |
|---|---|---|---|---|
| #45 | Major | Filter reset khi chuyển trang | Sprint [X+1] Day 3 | [Dev name] |

## UAT Feedback

### Từ Giáo viên
> "[Quote feedback từ GV]"
> — [Tên GV], [Trường]

### Từ Học sinh
> "[Quote feedback từ HS]"
> — [Tên HS], [Lớp]

## Chữ ký

| Vai trò | Họ tên | Chữ ký | Ngày |
|---|---|---|---|
| Product Owner | _________________ | ________ | ___/___/2026 |
| Business Analyst | _________________ | ________ | ___/___/2026 |
| QA Lead | _________________ | ________ | ___/___/2026 |
| Dev Lead | _________________ | ________ | ___/___/2026 |

## Quyết định

- [ ] ✅ **CHẤP NHẬN** — Đủ điều kiện deploy production
- [ ] ⚠️ **CHẤP NHẬN CÓ ĐIỀU KIỆN** — Deploy nhưng fix bugs trước ngày [DD/MM]
- [ ] ❌ **TỪ CHỐI** — Cần rework, nghiệm thu lại ngày [DD/MM]

---
_Biên bản này có hiệu lực kể từ ngày ký._
```

---

## 8. Đặc thù Tin Học Trẻ (THT)

### 8.1 Hệ thống Bảng thi THT

```mermaid
graph TD
    THT["🏆 Cuộc thi Tin Học Trẻ"] --> A["🟢 Bảng A\nTiểu học"]
    THT --> B["🔵 Bảng B\nTHCS"]
    THT --> C1["🟡 Bảng C1\nTHPT — Lập trình"]
    THT --> C2["🔴 Bảng C2\nTHPT — CNTT ứng dụng"]

    A --> A1["Scratch / Blockly\nTư duy logic cơ bản"]
    B --> B1["Pascal / C++\nThuat toán cơ bản"]
    C1 --> C11["C++ / Python\nThuật toán nâng cao"]
    C2 --> C21["Ứng dụng CNTT\nWeb, App, AI project"]

    style THT fill:#1F2937,stroke:#111827,color:#fff
    style A fill:#10B981,stroke:#059669,color:#fff
    style B fill:#3B82F6,stroke:#2563EB,color:#fff
    style C1 fill:#F59E0B,stroke:#D97706,color:#fff
    style C2 fill:#EF4444,stroke:#DC2626,color:#fff
```

#### Chi tiết từng Bảng

| Tiêu chí | 🟢 Bảng A | 🔵 Bảng B | 🟡 Bảng C1 | 🔴 Bảng C2 |
|---|---|---|---|---|
| **Đối tượng** | HS Tiểu học (lớp 3-5) | HS THCS (lớp 6-9) | HS THPT (lớp 10-12) | HS THPT (lớp 10-12) |
| **Nội dung** | Tư duy logic, lập trình kéo thả | Lập trình cơ bản, thuật toán | Lập trình nâng cao, CTDL & GT | Ứng dụng CNTT thực tiễn |
| **Ngôn ngữ** | Scratch, Blockly | Pascal, C/C++ | C/C++, Python | Tự chọn (Web, App...) |
| **Thời gian thi** | 60-90 phút | 120-150 phút | 150-180 phút | Nhiều ngày (project) |
| **Số bài** | 3-5 bài | 4-5 bài | 4-5 bài | 1 dự án |
| **Hình thức** | Trực tiếp | Trực tiếp + Online | Trực tiếp + Online | Nộp sản phẩm |
| **Cấp thi** | Quận → Thành phố → Quốc gia | Quận → TP → QG | Tỉnh → QG | Tỉnh → QG |

### 8.2 Subtask Scoring

Hệ thống chấm bài THT sử dụng **subtask scoring** — chia bài thành nhiều phần con, mỗi phần có điểm riêng.

#### Nguyên tắc subtask

```mermaid
flowchart TD
    P["Bài tập\n(100 điểm)"] --> S1["Subtask 1\n(20 điểm)\nN ≤ 100"]
    P --> S2["Subtask 2\n(30 điểm)\nN ≤ 1,000"]
    P --> S3["Subtask 3\n(50 điểm)\nN ≤ 100,000"]

    S1 --> T1["Test 1"] & T2["Test 2"] & T3["Test 3"]
    S2 --> T4["Test 4"] & T5["Test 5"] & T6["Test 6"] & T7["Test 7"]
    S3 --> T8["Test 8"] & T9["Test 9"] & T10["Test 10"]

    style P fill:#4F46E5,stroke:#3730A3,color:#fff
    style S1 fill:#10B981,stroke:#059669,color:#fff
    style S2 fill:#F59E0B,stroke:#D97706,color:#fff
    style S3 fill:#EF4444,stroke:#DC2626,color:#fff
```

#### Cách tính điểm subtask

| Phương pháp | Mô tả | Ví dụ |
|---|---|---|
| **All-or-Nothing** | Phải AC tất cả test trong subtask mới được điểm | Subtask 1 (3 tests): AC+AC+WA → 0 điểm |
| **Partial (min)** | Điểm = (số test AC / tổng test) × điểm subtask | Subtask 1 (3 tests): AC+AC+WA → 2/3 × 20 = 13.3 điểm |
| **THT Standard** | **All-or-Nothing per subtask** | Phổ biến nhất trong THT chính thức |

> [!IMPORTANT]
> TinHocTre Platform hỗ trợ **cả 2 phương pháp**. Giáo viên chọn khi tạo bài/contest.  
> Mặc định: **THT Standard (All-or-Nothing per subtask)**.

### 8.3 Verdict Codes

| Code | Tên đầy đủ | Biểu tượng | Mô tả | Màu hiển thị |
|---|---|:---:|---|---|
| `AC` | Accepted | ✅ | Kết quả đúng, thời gian & bộ nhớ trong giới hạn | `#10B981` (Green) |
| `WA` | Wrong Answer | ❌ | Kết quả sai | `#EF4444` (Red) |
| `TLE` | Time Limit Exceeded | ⏱️ | Chạy quá thời gian cho phép | `#F59E0B` (Yellow) |
| `MLE` | Memory Limit Exceeded | 💾 | Dùng quá bộ nhớ cho phép | `#8B5CF6` (Purple) |
| `RE` | Runtime Error | 💥 | Lỗi khi chạy (segfault, division by zero...) | `#F97316` (Orange) |
| `CE` | Compilation Error | 🔧 | Lỗi biên dịch | `#6B7280` (Gray) |
| `PE` | Presentation Error | 📝 | Đúng nhưng format output sai (thừa space, newline) | `#06B6D4` (Cyan) |
| `SK` | Skipped | ⏭️ | Test bị bỏ qua (do subtask trước fail — dependency) | `#9CA3AF` (Light Gray) |
| `QU` | Queued | 🔄 | Đang chờ trong hàng đợi chấm | `#3B82F6` (Blue) |
| `JG` | Judging | ⚡ | Đang được chấm | `#3B82F6` (Blue, pulse) |
| `IE` | Internal Error | ⚠️ | Lỗi hệ thống judge (không phải lỗi HS) | `#DC2626` (Dark Red) |

#### Verdict Priority (khi 1 subtask có nhiều verdict)

```
CE > IE > RE > MLE > TLE > WA > PE > AC
```

> Ví dụ: Nếu subtask 1 có test AC, AC, TLE → verdict subtask = **TLE**

### 8.4 Penalty Rules

| Rule | Áp dụng | Mô tả |
|---|---|---|
| **Không penalty** | THT Standard | Chỉ lấy **submission có điểm cao nhất** cho mỗi bài |
| **ICPC-style penalty** | Contest tùy chỉnh | Mỗi submission WA trước AC → +20 phút penalty |
| **IOI-style** | Contest nâng cao | Lấy điểm cao nhất, không penalty |
| **Decay penalty** | Gamification mode | Điểm giảm 5% cho mỗi lần submit sai (min 50% điểm gốc) |

#### Bảng tính điểm mẫu (THT Standard — Không penalty)

| Submission # | Thời điểm nộp | Bài 1 (100đ) | Bài 2 (100đ) | Bài 3 (100đ) | Bài 4 (100đ) | Tổng |
|:---:|---|:---:|:---:|:---:|:---:|:---:|
| Sub 1 | 08:15 | 60 | — | — | — | 60 |
| Sub 2 | 08:30 | **100** | — | — | — | **100** |
| Sub 3 | 09:00 | — | 70 | — | — | 170 |
| Sub 4 | 09:30 | — | — | 30 | — | 200 |
| Sub 5 | 10:00 | — | **100** | — | — | **230** |
| Sub 6 | 10:30 | — | — | **80** | — | **280** |
| Sub 7 | 11:00 | — | — | — | 50 | 330 |
| **Điểm cuối** | | **100** | **100** | **80** | **50** | **330/400** |

> **Ghi chú:** Lấy điểm **cao nhất** cho mỗi bài qua tất cả submissions. Không trừ penalty.

#### Xếp hạng khi hòa điểm

| Tiêu chí | Thứ tự ưu tiên |
|:---:|---|
| 1️⃣ | **Tổng điểm** cao hơn → xếp trên |
| 2️⃣ | **Số bài AC** (100 điểm) nhiều hơn → xếp trên |
| 3️⃣ | **Thời gian nộp bài AC cuối** sớm hơn → xếp trên |
| 4️⃣ | **Tổng thời gian nộp tất cả AC** ít hơn → xếp trên |
| 5️⃣ | Vẫn hòa → **xếp cùng hạng** |

### 8.5 Giới hạn kỹ thuật theo Bảng

| Tham số | 🟢 Bảng A | 🔵 Bảng B | 🟡 Bảng C1 | 🔴 Bảng C2 |
|---|:---:|:---:|:---:|:---:|
| **Time limit** | 1-2s | 1-3s | 1-5s | N/A |
| **Memory limit** | 256 MB | 256 MB | 512 MB | N/A |
| **Max test cases** | 10 | 15 | 20 | N/A |
| **Max subtasks** | 2-3 | 3-4 | 4-5 | N/A |
| **Ngôn ngữ** | Scratch | Pascal, C++ | C++, Python | Tự chọn |
| **Source limit** | 32 KB | 64 KB | 64 KB | N/A |
| **Contest duration** | 60-90 min | 120-150 min | 150-180 min | Multi-day |

---

## Phụ lục

### A. Glossary

| Thuật ngữ | Viết tắt | Nghĩa |
|---|---|---|
| Acceptance Criteria | AC | Tiêu chí nghiệm thu — điều kiện để story được coi là hoàn thành |
| Business Analyst | BA | Phân tích nghiệp vụ |
| Definition of Done | DoD | Định nghĩa "hoàn thành" |
| Online Judge | OJ | Hệ thống chấm bài tự động |
| Product Owner | PO | Chủ sản phẩm |
| Story Point | SP | Đơn vị ước lượng độ phức tạp |
| Tin Học Trẻ | THT | Cuộc thi Tin Học Trẻ toàn quốc |
| User Acceptance Testing | UAT | Kiểm thử chấp nhận người dùng |
| Unique Selling Proposition | USP | Điểm bán hàng độc đáo |

### B. Tài liệu liên quan

| Tài liệu | Đường dẫn | Mô tả |
|---|---|---|
| Product Backlog | `/docs/BACKLOG.md` | Toàn bộ backlog sản phẩm |
| Architecture Decision Records | `/docs/ADR/` | Các quyết định kiến trúc |
| API Documentation | `/docs/API.md` | Swagger/OpenAPI specs |
| Database Schema | `/docs/DATABASE.md` | ERD và schema migrations |
| Deployment Guide | `/docs/DEPLOYMENT.md` | Hướng dẫn deploy |

### C. Revision History

| Version | Ngày | Tác giả | Thay đổi |
|---|---|---|---|
| 1.0 | 13/07/2026 | BA Team | Tạo mới tài liệu |

---

> [!NOTE]
> Tài liệu này là **living document** — được cập nhật liên tục theo tiến độ dự án.  
> Mọi thay đổi phải được review bởi BA Lead trước khi merge.
