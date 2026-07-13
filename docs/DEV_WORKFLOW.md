# 🚀 TinHocTre Platform — Quy Trình Làm Việc Cho Developer

> **Phiên bản:** 1.0.0 | **Cập nhật:** 13/07/2026
> **Dự án:** Nền tảng ôn luyện Tin học trẻ — THT Platform
> **Tech Lead:** [Tên Tech Lead] | **PM:** [Tên PM]

---

## 📑 Mục Lục

1. [Quy Tắc Git Flow](#-1-quy-tắc-git-flow)
2. [Cấu Trúc Thư Mục Dự Án](#-2-cấu-trúc-thư-mục-dự-án)
3. [Coding Standards](#-3-coding-standards)
4. [Development Setup](#-4-development-setup)
5. [Sprint Workflow](#-5-sprint-workflow-cho-dev)
6. [Tech Stack Reference](#-6-tech-stack-reference-table)

---

## 🌿 1. Quy Tắc Git Flow

### 1.1. Mô Hình Branching

```mermaid
gitgraph
    commit id: "init"
    branch develop
    checkout develop
    commit id: "setup project"
    branch feature/THT-001-auth
    checkout feature/THT-001-auth
    commit id: "feat: login page"
    commit id: "feat: OAuth Google"
    checkout develop
    merge feature/THT-001-auth id: "PR #1 merged"
    branch release/v1.0.0
    checkout release/v1.0.0
    commit id: "chore: bump version"
    checkout main
    merge release/v1.0.0 id: "v1.0.0" tag: "v1.0.0"
    checkout develop
    merge release/v1.0.0
    branch hotfix/THT-010-fix-login
    checkout hotfix/THT-010-fix-login
    commit id: "fix: login crash"
    checkout main
    merge hotfix/THT-010-fix-login id: "v1.0.1" tag: "v1.0.1"
    checkout develop
    merge hotfix/THT-010-fix-login
```

| Branch | Mục đích | Tạo từ | Merge vào |
|--------|----------|--------|-----------|
| `main` | Production-ready code | — | — |
| `develop` | Branch tích hợp, luôn chạy được | — | — |
| `feature/*` | Phát triển tính năng mới | `develop` | `develop` |
| `bugfix/*` | Sửa bug trên develop | `develop` | `develop` |
| `hotfix/*` | Sửa bug khẩn cấp trên production | `main` | `main` + `develop` |
| `refactor/*` | Tái cấu trúc code | `develop` | `develop` |
| `release/*` | Chuẩn bị release | `develop` | `main` + `develop` |

### 1.2. Branch Naming Convention

**Format:** `<type>/THT-<ticket_number>-<short-description>`

```bash
# ✅ Đúng
feature/THT-042-contest-realtime-leaderboard
bugfix/THT-105-fix-code-submission-timeout
hotfix/THT-200-critical-auth-bypass
refactor/THT-088-extract-judge-service
release/v1.2.0

# ❌ Sai
feature/login                    # Thiếu ticket number
Feature/THT-042-leaderboard      # Sai case
feature/THT-042                  # Thiếu description
fix/THT-105-timeout              # Sai prefix (dùng bugfix/)
```

### 1.3. Commit Message Convention

**Format:** `<type>(<scope>): <mô tả ngắn gọn>`

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Các loại type:**

| Type | Ý nghĩa | Ví dụ |
|------|----------|-------|
| `feat` | Tính năng mới | `feat(contest): thêm chế độ thi realtime` |
| `fix` | Sửa bug | `fix(judge): xử lý timeout khi chấm bài C++` |
| `docs` | Thay đổi tài liệu | `docs(api): cập nhật swagger cho endpoint submit` |
| `test` | Thêm/sửa test | `test(auth): thêm unit test cho JWT refresh` |
| `chore` | Công việc maintain | `chore(deps): cập nhật drizzle-orm lên 0.35` |
| `refactor` | Tái cấu trúc code | `refactor(editor): tách MonacoEditor thành module` |
| `style` | Format code, không thay đổi logic | `style(global): chạy prettier toàn bộ` |
| `perf` | Cải thiện hiệu suất | `perf(query): thêm index cho bảng submissions` |
| `ci` | Thay đổi CI/CD config | `ci(github): thêm workflow chạy e2e test` |
| `build` | Thay đổi build system | `build(docker): tối ưu multi-stage Dockerfile` |

**Ví dụ commit message đầy đủ:**

```
feat(contest): thêm bảng xếp hạng realtime cho cuộc thi

- Sử dụng Socket.io để push cập nhật ranking
- Hiển thị top 50 thí sinh với animation
- Tự động refresh mỗi 5 giây khi mất kết nối WebSocket

Closes THT-042
```

```
fix(judge): xử lý race condition khi chấm nhiều bài đồng thời

Nguyên nhân: BullMQ worker không lock đúng khi 2 submission
cùng vào queue trong cùng 1ms.

Giải pháp: Thêm unique jobId dựa trên submissionId + timestamp
để tránh duplicate processing.

Fixes THT-105
```

### 1.4. Pull Request Template

Tạo file `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## 📋 Mô Tả

<!-- Mô tả ngắn gọn thay đổi trong PR này -->

**Ticket:** [THT-XXX](link-to-ticket)
**Loại:** feat | fix | refactor | docs | test | chore

## 🔄 Thay Đổi Chính

- [ ] Thay đổi 1
- [ ] Thay đổi 2
- [ ] Thay đổi 3

## 📸 Screenshots / Demo

<!-- Đính kèm screenshot hoặc video demo nếu có thay đổi UI -->

| Trước | Sau |
|-------|-----|
| screenshot | screenshot |

## 🧪 Testing

- [ ] Unit tests đã pass
- [ ] Integration tests đã pass
- [ ] Đã test manual trên local
- [ ] Đã test trên các trình duyệt: Chrome, Firefox, Safari (nếu có UI)

## ✅ Checklist Trước Khi Request Review

- [ ] Code tuân thủ coding standards của dự án
- [ ] Không có `console.log` debug còn sót
- [ ] Đã chạy `pnpm lint` và `pnpm typecheck` không có lỗi
- [ ] Đã viết/cập nhật tests cho thay đổi
- [ ] Đã cập nhật documentation nếu cần
- [ ] Đã kiểm tra performance (không có N+1 query, memory leak)
- [ ] Đã xử lý error cases và edge cases
- [ ] Migration file (nếu có) đã được review kỹ
- [ ] Không có breaking changes, hoặc đã ghi chú rõ
- [ ] PR size hợp lý (< 400 LOC thay đổi)

## 📝 Ghi Chú Cho Reviewer

<!-- Những điểm cần reviewer chú ý đặc biệt -->
```

### 1.5. Code Review Checklist (Dành Cho Reviewer)

> ⚠️ **Mỗi PR phải được ít nhất 1 reviewer approve trước khi merge.**

#### 🔍 Checklist Review (15 items)

| # | Hạng mục | Kiểm tra |
|---|----------|----------|
| 1 | **Correctness** | Logic có đúng không? Có cover đủ edge cases? |
| 2 | **TypeScript** | Có dùng `any` không? Types có chính xác? |
| 3 | **Security** | Có SQL injection, XSS, IDOR? Input đã validate bằng Zod? |
| 4 | **Performance** | Có N+1 query? Có query không dùng index? Có memory leak? |
| 5 | **Error Handling** | Có try-catch đầy đủ? Error messages có rõ ràng? |
| 6 | **Testing** | Test có đủ? Coverage có chấp nhận được? Test có ý nghĩa? |
| 7 | **Naming** | Tên biến, hàm, component có rõ nghĩa? Đúng convention? |
| 8 | **DRY** | Có code duplicate? Có thể extract thành util/hook/component? |
| 9 | **API Design** | Response format nhất quán? Status codes đúng? Có validate input? |
| 10 | **Database** | Migration có safe? Có backwards compatible? Index đã tối ưu? |
| 11 | **Accessibility** | Có aria labels? Keyboard navigation hoạt động? Color contrast đạt? |
| 12 | **Responsive** | UI hoạt động tốt trên mobile, tablet, desktop? |
| 13 | **i18n** | Strings có hardcode không? Có hỗ trợ đa ngôn ngữ nếu cần? |
| 14 | **Dependencies** | Package mới có cần thiết? License có phù hợp? Bundle size ảnh hưởng? |
| 15 | **Documentation** | JSDoc cho public APIs? README cập nhật? Có comment giải thích logic phức tạp? |

#### Review Comment Prefixes

```
[must-fix]    → Phải sửa trước khi merge
[should-fix]  → Nên sửa, có thể tạo follow-up ticket
[nit]         → Góp ý nhỏ, không bắt buộc
[question]    → Câu hỏi để hiểu rõ hơn
[praise]      → Khen ngợi code tốt 👏
```

---

## 📂 2. Cấu Trúc Thư Mục Dự Án

### Next.js 15 App Router — Monorepo Structure

```
tin-hoc-tre-app/
├── 📄 .env.local                  # Biến môi trường local
├── 📄 .env.example                # Template biến môi trường
├── 📄 .eslintrc.cjs               # ESLint configuration
├── 📄 .prettierrc                 # Prettier configuration
├── 📄 drizzle.config.ts           # Drizzle ORM config
├── 📄 next.config.ts              # Next.js configuration
├── 📄 tailwind.config.ts          # Tailwind CSS config
├── 📄 tsconfig.json               # TypeScript config
├── 📄 vitest.config.ts            # Vitest config
├── 📄 playwright.config.ts        # Playwright E2E config
├── 📄 docker-compose.yml          # Docker services (PostgreSQL, Redis)
├── 📄 Dockerfile                  # Production Docker image
├── 📄 package.json
├── 📄 pnpm-lock.yaml
│
├── 📁 app/                        # ✨ Next.js App Router
│   ├── 📄 layout.tsx              # Root layout (providers, fonts, metadata)
│   ├── 📄 page.tsx                # Landing page
│   ├── 📄 globals.css             # Global styles + Tailwind directives
│   ├── 📄 not-found.tsx           # Custom 404 page
│   ├── 📄 error.tsx               # Global error boundary
│   │
│   ├── 📁 (auth)/                 # 🔐 Auth route group (không ảnh hưởng URL)
│   │   ├── 📁 login/
│   │   │   └── 📄 page.tsx        # Trang đăng nhập
│   │   ├── 📁 register/
│   │   │   └── 📄 page.tsx        # Trang đăng ký
│   │   ├── 📁 forgot-password/
│   │   │   └── 📄 page.tsx        # Quên mật khẩu
│   │   └── 📄 layout.tsx          # Layout chung cho auth pages
│   │
│   ├── 📁 (dashboard)/            # 📊 Dashboard cho học sinh
│   │   ├── 📄 layout.tsx          # Dashboard layout (sidebar, header)
│   │   ├── 📁 overview/
│   │   │   └── 📄 page.tsx        # Tổng quan: tiến độ, thống kê
│   │   ├── 📁 problems/
│   │   │   ├── 📄 page.tsx        # Danh sách bài tập
│   │   │   └── 📁 [slug]/
│   │   │       └── 📄 page.tsx    # Chi tiết bài tập + Code Editor
│   │   ├── 📁 contests/
│   │   │   ├── 📄 page.tsx        # Danh sách cuộc thi
│   │   │   └── 📁 [id]/
│   │   │       ├── 📄 page.tsx    # Phòng thi (realtime)
│   │   │       └── 📁 leaderboard/
│   │   │           └── 📄 page.tsx # Bảng xếp hạng
│   │   ├── 📁 submissions/
│   │   │   └── 📄 page.tsx        # Lịch sử nộp bài
│   │   └── 📁 profile/
│   │       └── 📄 page.tsx        # Hồ sơ cá nhân
│   │
│   ├── 📁 (admin)/                # 🛡️ Admin panel
│   │   ├── 📄 layout.tsx          # Admin layout (sidebar admin)
│   │   ├── 📁 users/
│   │   │   └── 📄 page.tsx        # Quản lý người dùng
│   │   ├── 📁 problems/
│   │   │   ├── 📄 page.tsx        # Quản lý bài tập
│   │   │   └── 📁 create/
│   │   │       └── 📄 page.tsx    # Tạo bài tập mới
│   │   ├── 📁 contests/
│   │   │   ├── 📄 page.tsx        # Quản lý cuộc thi
│   │   │   └── 📁 create/
│   │   │       └── 📄 page.tsx    # Tạo cuộc thi mới
│   │   └── 📁 analytics/
│   │       └── 📄 page.tsx        # Dashboard phân tích
│   │
│   └── 📁 api/                    # 🔌 API Routes (Route Handlers)
│       ├── 📁 auth/
│       │   ├── 📁 login/
│       │   │   └── 📄 route.ts    # POST /api/auth/login
│       │   ├── 📁 register/
│       │   │   └── 📄 route.ts    # POST /api/auth/register
│       │   ├── 📁 refresh/
│       │   │   └── 📄 route.ts    # POST /api/auth/refresh
│       │   └── 📁 [...nextauth]/
│       │       └── 📄 route.ts    # NextAuth.js catch-all
│       ├── 📁 problems/
│       │   ├── 📄 route.ts        # GET, POST /api/problems
│       │   └── 📁 [id]/
│       │       ├── 📄 route.ts    # GET, PUT, DELETE /api/problems/:id
│       │       └── 📁 submit/
│       │           └── 📄 route.ts # POST /api/problems/:id/submit
│       ├── 📁 contests/
│       │   ├── 📄 route.ts        # GET, POST /api/contests
│       │   └── 📁 [id]/
│       │       └── 📄 route.ts    # GET, PUT /api/contests/:id
│       ├── 📁 submissions/
│       │   └── 📄 route.ts        # GET /api/submissions
│       ├── 📁 judge/
│       │   └── 📁 webhook/
│       │       └── 📄 route.ts    # POST /api/judge/webhook (callback từ judge)
│       └── 📁 analytics/
│           └── 📄 route.ts        # GET /api/analytics
│
├── 📁 components/                 # 🧩 React Components
│   ├── 📁 ui/                     # Primitive UI components (Button, Input, Modal...)
│   │   ├── 📄 button.tsx
│   │   ├── 📄 input.tsx
│   │   ├── 📄 modal.tsx
│   │   ├── 📄 badge.tsx
│   │   ├── 📄 card.tsx
│   │   ├── 📄 data-table.tsx      # Table component with sorting/filtering
│   │   ├── 📄 dropdown-menu.tsx
│   │   ├── 📄 skeleton.tsx        # Loading skeleton
│   │   ├── 📄 toast.tsx           # Toast notification
│   │   └── 📄 index.ts            # Barrel export
│   │
│   ├── 📁 editor/                 # Code Editor components
│   │   ├── 📄 code-editor.tsx     # Monaco Editor wrapper chính
│   │   ├── 📄 editor-toolbar.tsx  # Toolbar: ngôn ngữ, theme, font size
│   │   ├── 📄 editor-output.tsx   # Panel hiển thị output/kết quả
│   │   ├── 📄 test-case-panel.tsx # Panel nhập/chọn test case
│   │   └── 📄 split-pane.tsx      # Resizable split layout
│   │
│   ├── 📁 contest/                # Contest-specific components
│   │   ├── 📄 contest-card.tsx    # Card hiển thị cuộc thi
│   │   ├── 📄 contest-timer.tsx   # Đồng hồ đếm ngược
│   │   ├── 📄 leaderboard.tsx     # Bảng xếp hạng realtime
│   │   ├── 📄 problem-tabs.tsx    # Tabs chuyển bài trong cuộc thi
│   │   └── 📄 submission-status.tsx # Trạng thái bài nộp (AC, WA, TLE...)
│   │
│   ├── 📁 analytics/              # Analytics & Charts
│   │   ├── 📄 progress-chart.tsx  # Biểu đồ tiến độ học tập
│   │   ├── 📄 heatmap.tsx         # Heatmap hoạt động (giống GitHub)
│   │   ├── 📄 stats-card.tsx      # Card thống kê
│   │   └── 📄 difficulty-radar.tsx # Radar chart theo độ khó
│   │
│   ├── 📁 layout/                 # Layout components
│   │   ├── 📄 header.tsx          # Header chính
│   │   ├── 📄 sidebar.tsx         # Sidebar navigation
│   │   ├── 📄 footer.tsx          # Footer
│   │   └── 📄 mobile-nav.tsx      # Mobile navigation
│   │
│   └── 📁 shared/                 # Shared components
│       ├── 📄 avatar.tsx          # Avatar người dùng
│       ├── 📄 search-command.tsx  # Command palette (Ctrl+K)
│       ├── 📄 theme-toggle.tsx    # Chuyển đổi dark/light mode
│       └── 📄 markdown-render.tsx # Render markdown (đề bài)
│
├── 📁 lib/                        # 📚 Core Libraries & Utilities
│   ├── 📁 db/                     # Database layer (Drizzle ORM)
│   │   ├── 📄 index.ts            # Database connection & client
│   │   ├── 📄 schema.ts           # Drizzle schema definitions (tất cả tables)
│   │   ├── 📄 relations.ts        # Drizzle relations
│   │   ├── 📁 migrations/         # SQL migration files (auto-generated)
│   │   └── 📁 queries/            # Prepared queries
│   │       ├── 📄 problems.ts     # Queries liên quan bài tập
│   │       ├── 📄 users.ts        # Queries liên quan users
│   │       ├── 📄 contests.ts     # Queries liên quan cuộc thi
│   │       └── 📄 submissions.ts  # Queries liên quan submissions
│   │
│   ├── 📁 auth/                   # Authentication & Authorization
│   │   ├── 📄 config.ts           # NextAuth.js configuration
│   │   ├── 📄 providers.ts        # OAuth providers (Google, GitHub)
│   │   ├── 📄 session.ts          # Session helpers
│   │   ├── 📄 permissions.ts      # RBAC permission system
│   │   └── 📄 middleware.ts       # Auth middleware cho API routes
│   │
│   ├── 📁 judge/                  # Judge System Integration
│   │   ├── 📄 queue.ts            # BullMQ queue configuration
│   │   ├── 📄 languages.ts        # Supported languages & configs
│   │   ├── 📄 verdict.ts          # Verdict types (AC, WA, TLE, MLE, RE, CE)
│   │   └── 📄 sandbox-config.ts   # Sandbox resource limits
│   │
│   ├── 📁 ai/                     # AI-powered features
│   │   ├── 📄 hint-generator.ts   # Tạo gợi ý cho học sinh
│   │   ├── 📄 code-analyzer.ts    # Phân tích code & gợi ý cải thiện
│   │   └── 📄 difficulty-predictor.ts # Dự đoán độ khó bài tập
│   │
│   ├── 📁 validators/             # Zod schemas cho validation
│   │   ├── 📄 auth.ts             # Auth input schemas
│   │   ├── 📄 problem.ts          # Problem input schemas
│   │   ├── 📄 contest.ts          # Contest input schemas
│   │   └── 📄 submission.ts       # Submission input schemas
│   │
│   ├── 📁 hooks/                  # Custom React hooks
│   │   ├── 📄 use-auth.ts         # Hook xử lý authentication
│   │   ├── 📄 use-socket.ts       # Hook WebSocket connection
│   │   ├── 📄 use-countdown.ts    # Hook đếm ngược
│   │   └── 📄 use-debounce.ts     # Hook debounce input
│   │
│   ├── 📁 stores/                 # Zustand state stores
│   │   ├── 📄 editor-store.ts     # State cho code editor
│   │   ├── 📄 contest-store.ts    # State cho cuộc thi
│   │   └── 📄 ui-store.ts         # State cho UI (sidebar, theme...)
│   │
│   └── 📁 utils/                  # Utility functions
│       ├── 📄 cn.ts               # clsx + tailwind-merge helper
│       ├── 📄 format.ts           # Date, number formatting
│       ├── 📄 api-response.ts     # Standardized API response builder
│       └── 📄 constants.ts        # App-wide constants
│
├── 📁 worker/                     # ⚙️ Background Workers (chạy riêng biệt)
│   ├── 📁 judge-worker/           # Judge Worker — chấm bài
│   │   ├── 📄 index.ts            # Worker entry point
│   │   ├── 📄 processor.ts        # BullMQ job processor
│   │   ├── 📄 compiler.ts         # Compile source code
│   │   ├── 📄 runner.ts           # Chạy code trong sandbox
│   │   └── 📄 comparator.ts       # So sánh output với expected
│   │
│   └── 📁 sandbox/                # Sandbox execution environment
│       ├── 📄 docker-sandbox.ts   # Docker-based sandbox
│       ├── 📄 resource-limiter.ts # CPU, memory, time limits
│       └── 📁 policies/           # seccomp/AppArmor policies
│           ├── 📄 cpp.json        # Policy cho C/C++
│           └── 📄 python.json     # Policy cho Python
│
├── 📁 tests/                      # 🧪 Tests
│   ├── 📁 unit/                   # Unit tests (Vitest)
│   │   ├── 📁 lib/
│   │   │   ├── 📄 verdict.test.ts
│   │   │   ├── 📄 permissions.test.ts
│   │   │   └── 📄 format.test.ts
│   │   └── 📁 components/
│   │       ├── 📄 button.test.tsx
│   │       └── 📄 contest-timer.test.tsx
│   │
│   ├── 📁 integration/            # Integration tests
│   │   ├── 📄 auth-flow.test.ts   # Test luồng đăng nhập/đăng ký
│   │   ├── 📄 submit-problem.test.ts # Test nộp bài & chấm
│   │   └── 📄 contest-flow.test.ts # Test luồng cuộc thi
│   │
│   └── 📁 e2e/                    # End-to-end tests (Playwright)
│       ├── 📄 login.spec.ts       # E2E: Đăng nhập
│       ├── 📄 solve-problem.spec.ts # E2E: Giải bài tập
│       ├── 📄 join-contest.spec.ts # E2E: Tham gia cuộc thi
│       └── 📁 fixtures/
│           └── 📄 test-users.ts   # Test data fixtures
│
├── 📁 public/                     # Static assets
│   ├── 📁 images/
│   ├── 📁 icons/
│   └── 📄 favicon.ico
│
└── 📁 docs/                       # 📖 Documentation
    ├── 📄 DEV_WORKFLOW.md          # ← Bạn đang đọc file này
    ├── 📄 API_DESIGN.md            # API documentation
    ├── 📄 DATABASE_SCHEMA.md       # Database schema docs
    └── 📄 DEPLOYMENT.md            # Hướng dẫn deploy
```

### Giải Thích Chi Tiết Các Thư Mục

| Thư mục | Mô tả |
|---------|--------|
| `app/` | **Next.js App Router** — Chứa tất cả routes, layouts, API handlers. Sử dụng route groups `(auth)`, `(dashboard)`, `(admin)` để tổ chức mà không ảnh hưởng URL path. |
| `app/(auth)/` | Các trang xác thực: đăng nhập, đăng ký, quên mật khẩu. Dùng layout riêng không có sidebar. |
| `app/(dashboard)/` | Khu vực chính của học sinh: xem bài tập, làm bài, thi đấu, xem thống kê. |
| `app/(admin)/` | Panel quản trị: quản lý users, bài tập, cuộc thi, analytics. Chỉ admin/teacher truy cập được. |
| `app/api/` | REST API Route Handlers. Mỗi file `route.ts` export các HTTP methods (GET, POST, PUT, DELETE). |
| `components/ui/` | **Primitive UI** — Các component cơ bản, tái sử dụng cao (Button, Input, Modal...). Không chứa business logic. |
| `components/editor/` | **Code Editor** — Các component liên quan Monaco Editor: toolbar, output panel, test cases. |
| `components/contest/` | **Contest** — Components đặc thù cho cuộc thi: timer, leaderboard, submission status. |
| `components/analytics/` | **Analytics** — Charts và visualizations: progress, heatmap, stats. |
| `lib/db/` | **Database Layer** — Drizzle ORM schema, migrations, prepared queries. Single source of truth cho database. |
| `lib/auth/` | **Authentication** — NextAuth.js config, OAuth providers, RBAC permissions, middleware. |
| `lib/judge/` | **Judge System** — BullMQ queue config, supported languages, verdict types, sandbox limits. |
| `lib/ai/` | **AI Features** — Hint generator, code analyzer, difficulty predictor. Tích hợp LLM APIs. |
| `lib/validators/` | **Zod Schemas** — Validation schemas cho tất cả API inputs. Shared giữa client & server. |
| `lib/hooks/` | **Custom Hooks** — React hooks tái sử dụng: auth, socket, countdown, debounce. |
| `lib/stores/` | **Zustand Stores** — Client-side state management: editor state, contest state, UI state. |
| `worker/judge-worker/` | **Judge Worker** — Process riêng chạy BullMQ worker, compile và chạy code trong sandbox. |
| `worker/sandbox/` | **Sandbox** — Docker-based isolated execution environment với resource limits và security policies. |
| `tests/unit/` | **Unit Tests** — Test từng function/component độc lập bằng Vitest. |
| `tests/integration/` | **Integration Tests** — Test các luồng liên kết nhiều module (auth flow, submit flow). |
| `tests/e2e/` | **E2E Tests** — Test toàn bộ luồng trên browser thật bằng Playwright. |

---

## 📏 3. Coding Standards

### 3.1. TypeScript Strict Mode

**`tsconfig.json`:**

```jsonc
{
  "compilerOptions": {
    // ✅ Strict mode — BẮT BUỘC
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": false, // tắt vì conflict với nhiều lib

    // Module & Resolution
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,

    // Paths
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/app/*": ["./app/*"]
    },

    // Output
    "jsx": "preserve",
    "incremental": true,
    "noEmit": true,
    "esModuleInterop": true,
    "allowJs": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "worker/"]
}
```

> **Quy tắc:** KHÔNG BAO GIỜ dùng `any`. Nếu thực sự cần, dùng `unknown` + type guard. Ngoại lệ duy nhất: khi wrap 3rd-party lib không có types — phải comment giải thích.

### 3.2. ESLint Configuration

**`.eslintrc.cjs`:**

```javascript
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'next/typescript',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'prettier', // Phải để cuối cùng
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // ❌ Cấm any
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',

    // ✅ Naming conventions
    '@typescript-eslint/naming-convention': [
      'error',
      // Interfaces không dùng prefix "I"
      { selector: 'interface', format: ['PascalCase'] },
      // Types dùng PascalCase
      { selector: 'typeAlias', format: ['PascalCase'] },
      // Enums dùng PascalCase
      { selector: 'enum', format: ['PascalCase'] },
      // Enum members dùng UPPER_CASE
      { selector: 'enumMember', format: ['UPPER_CASE'] },
      // Boolean variables prefix "is", "has", "should", "can"
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['camelCase'],
        prefix: ['is', 'has', 'should', 'can', 'will'],
      },
    ],

    // 📦 Import ordering
    'import/order': [
      'error',
      {
        groups: [
          'builtin',      // node:fs, node:path
          'external',     // react, next
          'internal',     // @/lib, @/components
          'parent',       // ../
          'sibling',      // ./
          'index',        // ./index
          'type',         // type imports
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],

    // 🚫 Cấm console.log (dùng logger thay thế)
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // Unused variables
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],

    // Prefer const
    'prefer-const': 'error',

    // No floating promises
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',

    // React
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
  },
  overrides: [
    {
      // Relaxed rules cho test files
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        'no-console': 'off',
      },
    },
  ],
};
```

### 3.3. Prettier Configuration

**`.prettierrc`:**

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindFunctions": ["cn", "cva"]
}
```

### 3.4. Naming Conventions

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| **Components** | PascalCase | `ContestTimer.tsx`, `CodeEditor.tsx` |
| **Files (non-component)** | kebab-case | `api-response.ts`, `use-countdown.ts` |
| **Directories** | kebab-case | `judge-worker/`, `test-case-panel/` |
| **Functions** | camelCase | `calculateScore()`, `formatDate()` |
| **Constants** | SCREAMING_SNAKE_CASE | `MAX_EXECUTION_TIME`, `API_BASE_URL` |
| **Types/Interfaces** | PascalCase | `UserProfile`, `ContestConfig` |
| **Enums** | PascalCase (name), UPPER_CASE (members) | `Verdict.ACCEPTED` |
| **Database tables** | snake_case | `user_profiles`, `contest_problems` |
| **API Routes** | kebab-case | `/api/contest-results`, `/api/user-stats` |
| **CSS classes** | kebab-case (BEM nếu custom) | `contest-card`, `editor-toolbar__btn` |
| **Env variables** | SCREAMING_SNAKE_CASE | `DATABASE_URL`, `REDIS_URL` |

### 3.5. API Route Conventions

**Chuẩn API Response Format:**

```typescript
// lib/utils/api-response.ts

import { NextResponse } from 'next/server';

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

/**
 * Tạo response thành công
 */
export function successResponse<T>(
  data: T,
  meta?: ApiResponse['meta'],
  status = 200,
) {
  return NextResponse.json(
    { success: true, data, meta } satisfies ApiResponse<T>,
    { status },
  );
}

/**
 * Tạo response lỗi
 */
export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: Record<string, string[]>,
) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details },
    } satisfies ApiResponse,
    { status },
  );
}
```

**Ví dụ API Route:**

```typescript
// app/api/problems/route.ts

import { NextRequest } from 'next/server';

import { getServerSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { problems } from '@/lib/db/schema';
import { errorResponse, successResponse } from '@/lib/utils/api-response';
import { createProblemSchema } from '@/lib/validators/problem';

/**
 * GET /api/problems — Lấy danh sách bài tập
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') ?? '1');
    const limit = Math.min(Number(searchParams.get('limit') ?? '20'), 100);
    const difficulty = searchParams.get('difficulty');

    const offset = (page - 1) * limit;

    const [data, countResult] = await Promise.all([
      db.query.problems.findMany({
        limit,
        offset,
        where: difficulty
          ? (fields, { eq }) => eq(fields.difficulty, difficulty)
          : undefined,
        orderBy: (fields, { desc }) => [desc(fields.createdAt)],
      }),
      db.select({ count: sql<number>`count(*)` }).from(problems),
    ]);

    const total = countResult[0]?.count ?? 0;

    return successResponse(data, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[GET /api/problems]', error);
    return errorResponse(
      'INTERNAL_ERROR',
      'Không thể tải danh sách bài tập',
      500,
    );
  }
}

/**
 * POST /api/problems — Tạo bài tập mới (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return errorResponse('UNAUTHORIZED', 'Vui lòng đăng nhập', 401);
    }
    if (session.user.role !== 'admin' && session.user.role !== 'teacher') {
      return errorResponse('FORBIDDEN', 'Không có quyền truy cập', 403);
    }

    const body: unknown = await request.json();
    const parsed = createProblemSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Dữ liệu không hợp lệ',
        422,
        parsed.error.flatten().fieldErrors as Record<string, string[]>,
      );
    }

    const newProblem = await db
      .insert(problems)
      .values({
        ...parsed.data,
        authorId: session.user.id,
      })
      .returning();

    return successResponse(newProblem[0], undefined, 201);
  } catch (error) {
    console.error('[POST /api/problems]', error);
    return errorResponse('INTERNAL_ERROR', 'Không thể tạo bài tập', 500);
  }
}
```

### 3.6. Error Handling Patterns

```typescript
// lib/errors/app-error.ts

/**
 * Custom Error class cho toàn bộ ứng dụng
 */
export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest(message: string, code = 'BAD_REQUEST') {
    return new AppError(code, message, 400);
  }

  static unauthorized(message = 'Vui lòng đăng nhập') {
    return new AppError('UNAUTHORIZED', message, 401);
  }

  static forbidden(message = 'Không có quyền truy cập') {
    return new AppError('FORBIDDEN', message, 403);
  }

  static notFound(resource = 'Resource') {
    return new AppError('NOT_FOUND', `${resource} không tồn tại`, 404);
  }

  static conflict(message: string) {
    return new AppError('CONFLICT', message, 409);
  }

  static internal(message = 'Lỗi hệ thống, vui lòng thử lại') {
    return new AppError('INTERNAL_ERROR', message, 500);
  }
}

/**
 * Error handler wrapper cho API routes
 */
export function withErrorHandler(
  handler: (request: NextRequest) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      if (error instanceof AppError) {
        return errorResponse(
          error.code,
          error.message,
          error.statusCode,
          error.details as Record<string, string[]> | undefined,
        );
      }

      // Zod validation error
      if (error instanceof z.ZodError) {
        return errorResponse(
          'VALIDATION_ERROR',
          'Dữ liệu không hợp lệ',
          422,
          error.flatten().fieldErrors as Record<string, string[]>,
        );
      }

      console.error('[API Error]', error);
      return errorResponse(
        'INTERNAL_ERROR',
        'Lỗi hệ thống, vui lòng thử lại',
        500,
      );
    }
  };
}

// ✅ Sử dụng:
// app/api/problems/[id]/route.ts
export const GET = withErrorHandler(async (request) => {
  const id = request.nextUrl.pathname.split('/').pop();
  if (!id) throw AppError.badRequest('Thiếu problem ID');

  const problem = await db.query.problems.findFirst({
    where: (fields, { eq }) => eq(fields.id, id),
  });

  if (!problem) throw AppError.notFound('Bài tập');

  return successResponse(problem);
});
```

### 3.7. Drizzle ORM Usage Patterns

**Schema Definition:**

```typescript
// lib/db/schema.ts

import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// ============================
// Enums
// ============================

export const userRoleEnum = pgEnum('user_role', [
  'student',
  'teacher',
  'admin',
]);

export const difficultyEnum = pgEnum('difficulty', [
  'easy',
  'medium',
  'hard',
  'expert',
]);

export const verdictEnum = pgEnum('verdict', [
  'pending',
  'accepted',
  'wrong_answer',
  'time_limit',
  'memory_limit',
  'runtime_error',
  'compile_error',
]);

export const contestStatusEnum = pgEnum('contest_status', [
  'draft',
  'upcoming',
  'running',
  'finished',
  'archived',
]);

// ============================
// Tables
// ============================

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').default('student').notNull(),
  school: varchar('school', { length: 200 }),
  grade: integer('grade'), // Lớp (3-12)
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const problems = pgTable('problems', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  description: text('description').notNull(), // Markdown
  difficulty: difficultyEnum('difficulty').notNull(),
  timeLimit: integer('time_limit').default(1000).notNull(), // ms
  memoryLimit: integer('memory_limit').default(256).notNull(), // MB
  inputFormat: text('input_format').notNull(),
  outputFormat: text('output_format').notNull(),
  sampleInput: text('sample_input').notNull(),
  sampleOutput: text('sample_output').notNull(),
  testCases: jsonb('test_cases').$type<TestCase[]>().notNull(),
  tags: text('tags').array().default([]).notNull(),
  authorId: uuid('author_id')
    .references(() => users.id)
    .notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  solvedCount: integer('solved_count').default(0).notNull(),
  totalSubmissions: integer('total_submissions').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  problemId: uuid('problem_id')
    .references(() => problems.id)
    .notNull(),
  contestId: uuid('contest_id').references(() => contests.id),
  language: varchar('language', { length: 20 }).notNull(),
  sourceCode: text('source_code').notNull(),
  verdict: verdictEnum('verdict').default('pending').notNull(),
  executionTime: integer('execution_time'), // ms
  memoryUsed: integer('memory_used'), // KB
  score: integer('score').default(0).notNull(), // 0-100
  testResults: jsonb('test_results').$type<TestResult[]>(),
  compileError: text('compile_error'),
  submittedAt: timestamp('submitted_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const contests = pgTable('contests', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  status: contestStatusEnum('status').default('draft').notNull(),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  createdBy: uuid('created_by')
    .references(() => users.id)
    .notNull(),
  isPublic: boolean('is_public').default(true).notNull(),
  maxParticipants: integer('max_participants'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================
// Relations
// ============================

export const usersRelations = relations(users, ({ many }) => ({
  submissions: many(submissions),
  createdProblems: many(problems),
}));

export const problemsRelations = relations(problems, ({ one, many }) => ({
  author: one(users, {
    fields: [problems.authorId],
    references: [users.id],
  }),
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [submissions.problemId],
    references: [problems.id],
  }),
  contest: one(contests, {
    fields: [submissions.contestId],
    references: [contests.id],
  }),
}));

// ============================
// Types
// ============================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Problem = typeof problems.$inferSelect;
export type NewProblem = typeof problems.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type Contest = typeof contests.$inferSelect;

type TestCase = {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  points: number;
};

type TestResult = {
  testCaseIndex: number;
  passed: boolean;
  actualOutput: string;
  executionTime: number;
  memoryUsed: number;
};
```

**Database Connection:**

```typescript
// lib/db/index.ts

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                // Max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool, {
  schema,
  logger: process.env.NODE_ENV === 'development',
});

export type Database = typeof db;
```

**Prepared Queries Pattern:**

```typescript
// lib/db/queries/problems.ts

import { and, desc, eq, ilike, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { problems, submissions } from '@/lib/db/schema';

/**
 * Lấy bài tập theo slug kèm thống kê
 */
export async function getProblemBySlug(slug: string) {
  return db.query.problems.findFirst({
    where: eq(problems.slug, slug),
    with: {
      author: {
        columns: { id: true, name: true, avatarUrl: true },
      },
    },
  });
}

/**
 * Lấy danh sách bài tập có phân trang và filter
 */
export async function getProblems(options: {
  page?: number;
  limit?: number;
  difficulty?: string;
  search?: string;
  tags?: string[];
}) {
  const { page = 1, limit = 20, difficulty, search, tags } = options;
  const offset = (page - 1) * limit;

  const conditions = [eq(problems.isPublished, true)];

  if (difficulty) {
    conditions.push(eq(problems.difficulty, difficulty));
  }

  if (search) {
    conditions.push(ilike(problems.title, `%${search}%`));
  }

  if (tags && tags.length > 0) {
    conditions.push(
      sql`${problems.tags} && ${sql.array(tags, 'text')}`,
    );
  }

  const [data, countResult] = await Promise.all([
    db.query.problems.findMany({
      where: and(...conditions),
      limit,
      offset,
      orderBy: [desc(problems.createdAt)],
      columns: {
        testCases: false, // Không trả về test cases trong list
      },
    }),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(problems)
      .where(and(...conditions)),
  ]);

  return {
    data,
    total: countResult[0]?.count ?? 0,
  };
}

/**
 * Lấy submission history của user cho 1 bài
 */
export async function getUserSubmissions(
  userId: string,
  problemId: string,
  limit = 10,
) {
  return db.query.submissions.findMany({
    where: and(
      eq(submissions.userId, userId),
      eq(submissions.problemId, problemId),
    ),
    orderBy: [desc(submissions.submittedAt)],
    limit,
    columns: {
      sourceCode: false, // Không trả về source code trong list
    },
  });
}

/**
 * Tăng solved count khi có user AC lần đầu
 */
export async function incrementSolvedCount(problemId: string) {
  await db
    .update(problems)
    .set({
      solvedCount: sql`${problems.solvedCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(problems.id, problemId));
}
```

---

## 🔧 4. Development Setup

### 4.1. Prerequisites

| Công cụ | Phiên bản tối thiểu | Cài đặt |
|---------|---------------------|---------|
| **Node.js** | 20.x LTS trở lên | [nodejs.org](https://nodejs.org) hoặc `nvm install 20` |
| **pnpm** | 9.x | `npm install -g pnpm` |
| **Docker** | 24.x | [docker.com](https://docker.com) |
| **Docker Compose** | 2.x | Đi kèm Docker Desktop |
| **PostgreSQL** | 16.x | Qua Docker (khuyến nghị) |
| **Redis** | 7.x | Qua Docker (khuyến nghị) |
| **Git** | 2.40+ | Xcode CLI tools hoặc [git-scm.com](https://git-scm.com) |

**Kiểm tra prerequisites:**

```bash
node -v       # v20.x.x trở lên
pnpm -v       # 9.x.x
docker -v     # Docker version 24.x
git -v        # git version 2.40+
```

### 4.2. Clone & Install

```bash
# 1. Clone repository
git clone git@github.com:your-org/tin-hoc-tre-app.git
cd tin-hoc-tre-app

# 2. Chuyển sang branch develop
git checkout develop

# 3. Cài đặt dependencies
pnpm install

# 4. Cài đặt Git hooks (husky + lint-staged)
pnpm prepare
```

### 4.3. Environment Variables

Tạo file `.env.local` từ template:

```bash
cp .env.example .env.local
```

**`.env.example` — Template đầy đủ:**

```bash
# ============================================================
# 🗄️ DATABASE
# ============================================================
DATABASE_URL="postgresql://tht_user:tht_secret@localhost:5432/tinhoctre_dev"
DATABASE_URL_POOL="postgresql://tht_user:tht_secret@localhost:5432/tinhoctre_dev?pgbouncer=true"

# ============================================================
# 🔴 REDIS
# ============================================================
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD=""

# ============================================================
# 🔐 AUTHENTICATION (NextAuth.js)
# ============================================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-generate-with-openssl-rand-base64-32"

# OAuth — Google
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OAuth — GitHub (optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# ============================================================
# ⚖️ JUDGE SYSTEM
# ============================================================
JUDGE_QUEUE_NAME="tht-judge-queue"
JUDGE_MAX_CONCURRENT_JOBS=4
JUDGE_DEFAULT_TIME_LIMIT=2000        # ms
JUDGE_DEFAULT_MEMORY_LIMIT=256       # MB
JUDGE_SANDBOX_IMAGE="tht-sandbox:latest"

# ============================================================
# 🤖 AI SERVICES
# ============================================================
OPENAI_API_KEY="sk-your-openai-api-key"
AI_MODEL="gpt-4o-mini"
AI_MAX_TOKENS=1024
AI_HINT_ENABLED=true

# ============================================================
# 📡 REALTIME (Socket.io)
# ============================================================
SOCKET_PORT=3001
SOCKET_CORS_ORIGIN="http://localhost:3000"

# ============================================================
# 📧 EMAIL (Resend / SMTP)
# ============================================================
RESEND_API_KEY="re_your-resend-api-key"
EMAIL_FROM="TinHocTre <noreply@tinhoctre.vn>"

# ============================================================
# 📦 FILE STORAGE (S3 Compatible)
# ============================================================
S3_BUCKET="tht-uploads"
S3_REGION="ap-southeast-1"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-key"
S3_ENDPOINT=""                        # Để trống nếu dùng AWS S3

# ============================================================
# 📊 MONITORING & LOGGING
# ============================================================
SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
LOG_LEVEL="debug"                     # debug | info | warn | error

# ============================================================
# 🌐 APP CONFIG
# ============================================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="TinHocTre"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
NODE_ENV="development"
```

### 4.4. Khởi Động Services

**Bước 1: Khởi động PostgreSQL & Redis qua Docker:**

```bash
# Tạo file docker-compose.yml (nếu chưa có)
# Khởi động services
docker compose up -d

# Kiểm tra services đang chạy
docker compose ps
```

**`docker-compose.yml`:**

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: tht-postgres
    restart: unless-stopped
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: tht_user
      POSTGRES_PASSWORD: tht_secret
      POSTGRES_DB: tinhoctre_dev
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U tht_user -d tinhoctre_dev']
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: tht-redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redisdata:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
  redisdata:
```

**Bước 2: Chạy Database Migrations:**

```bash
# Tạo migration từ schema thay đổi
pnpm drizzle-kit generate

# Xem SQL migration sẽ được chạy
pnpm drizzle-kit migrate --dry-run

# Chạy migration
pnpm drizzle-kit migrate

# Push schema trực tiếp (chỉ dùng khi dev local, KHÔNG dùng production)
pnpm drizzle-kit push

# Mở Drizzle Studio (GUI xem database)
pnpm drizzle-kit studio

# Seed data mẫu
pnpm db:seed
```

**Bước 3: Khởi động Dev Server:**

```bash
# Terminal 1 — Next.js dev server
pnpm dev
# → App chạy tại http://localhost:3000

# Terminal 2 — Judge Worker
pnpm worker:dev
# → Worker lắng nghe job từ BullMQ queue

# Terminal 3 — Socket.io server (nếu tách riêng)
pnpm socket:dev
# → WebSocket server chạy tại http://localhost:3001
```

**Script tắt nhanh trong `package.json`:**

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --max-warnings 0",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "worker:dev": "tsx watch worker/judge-worker/index.ts",
    "socket:dev": "tsx watch lib/socket/server.ts",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx scripts/seed.ts",
    "prepare": "husky",
    "precommit": "lint-staged"
  }
}
```

### 4.5. Kiểm Tra Setup Thành Công

```bash
# ✅ Checklist sau khi setup
pnpm typecheck           # Không có lỗi TypeScript
pnpm lint                # Không có lỗi ESLint
pnpm test                # Tất cả unit tests pass
curl http://localhost:3000/api/health  # → { "status": "ok" }
```

---

## 🔄 5. Sprint Workflow Cho Dev

### 5.1. Tổng Quan Sprint Cycle

```mermaid
flowchart TB
    subgraph SPRINT["🏃 Sprint 2 Tuần"]
        direction TB
        A["📋 Sprint Planning\n(Đầu sprint)"]
        B["📥 Nhận Card\ntừ Sprint Board"]
        C["🌿 Tạo Feature Branch\nfeature/THT-xxx-desc"]
        D["💻 Code & Commit\n(theo convention)"]
        E["🧪 Viết Unit Tests\n(coverage ≥ 80%)"]
        F["🔍 Self-Review\n(dùng checklist)"]
        G["📤 Tạo Pull Request\n(dùng PR template)"]
        H["👀 Code Review\n(≥ 1 approval)"]
        I{"✅ Approved?"}
        J["🔀 Merge vào develop"]
        K["🚀 Auto Deploy Staging"]
        L["📢 Thông báo QA\ntrên Slack/Discord"]
        M["🐛 QA Test"]
        N{"🎯 QA Pass?"}
        O["✅ Done!\nChuyển card sang Done"]

        A --> B --> C --> D --> E --> F --> G --> H --> I
        I -->|Yes| J --> K --> L --> M --> N
        I -->|No, cần sửa| D
        N -->|Yes| O
        N -->|No, có bug| D
    end

    style A fill:#4f46e5,stroke:#3730a3,color:#fff
    style O fill:#059669,stroke:#047857,color:#fff
    style I fill:#f59e0b,stroke:#d97706,color:#000
    style N fill:#f59e0b,stroke:#d97706,color:#000
```

### 5.2. Chi Tiết Từng Bước

#### 📥 Bước 1: Nhận Card

```
1. Vào Sprint Board (Linear/Jira/GitHub Projects)
2. Chọn card ở cột "Todo" được assign cho mình
3. Chuyển card sang "In Progress"
4. Đọc kỹ mô tả, acceptance criteria, Figma design (nếu có)
5. Nếu chưa rõ → hỏi PM/Tech Lead TRƯỚC khi code
```

#### 🌿 Bước 2: Tạo Branch

```bash
# Đảm bảo develop mới nhất
git checkout develop
git pull origin develop

# Tạo branch mới
git checkout -b feature/THT-042-contest-leaderboard

# Push branch lên remote
git push -u origin feature/THT-042-contest-leaderboard
```

#### 💻 Bước 3: Code & Commit

```bash
# Commit thường xuyên, mỗi commit là 1 logical change
git add .
git commit -m "feat(contest): tạo component LeaderboardTable"

git add .
git commit -m "feat(contest): kết nối Socket.io cho realtime update"

git add .
git commit -m "test(contest): thêm unit test cho LeaderboardTable"
```

#### 🔍 Bước 4: Self-Review Checklist

Trước khi tạo PR, tự review bằng checklist:

```bash
# Chạy tất cả checks
pnpm typecheck && pnpm lint && pnpm test

# Review diff của mình
git diff develop...HEAD --stat
git diff develop...HEAD
```

**Self-review mental checklist:**

- [ ] Đã xoá tất cả `console.log` debug?
- [ ] Có function nào quá dài (> 50 lines)?
- [ ] Types có chặt chẽ, không dùng `any`?
- [ ] Error cases đã xử lý hết?
- [ ] Có hardcoded values cần đưa vào constants?
- [ ] Performance có ổn? (no N+1, unnecessary re-renders)

#### 📤 Bước 5: Tạo Pull Request

```bash
# Rebase với develop mới nhất
git fetch origin
git rebase origin/develop

# Giải quyết conflicts nếu có
# ...

# Push (force nếu đã rebase)
git push --force-with-lease

# Tạo PR trên GitHub
# → Dùng PR Template
# → Assign reviewer
# → Link ticket
# → Add labels
```

#### 👀 Bước 6: Code Review

```
Reviewer flow:
1. Đọc mô tả PR, hiểu context
2. Checkout branch, chạy local nếu cần
3. Review code theo checklist (Section 1.5)
4. Comment với prefix: [must-fix], [should-fix], [nit], [question], [praise]
5. Approve hoặc Request Changes

Author flow khi nhận feedback:
1. Đọc tất cả comments
2. Reply hoặc resolve từng comment
3. Push fix commits
4. Request re-review
```

#### 🔀 Bước 7: Merge

```
Merge strategy: SQUASH AND MERGE
→ Tất cả commits gộp thành 1 commit trên develop
→ Commit message = PR title (phải đúng convention)
→ Xoá branch sau khi merge
```

### 5.3. Daily Standup Template

```
📅 Standup [Ngày/Tháng]

✅ Hôm qua:
- [THT-042] Hoàn thành component LeaderboardTable
- [THT-042] Code review cho PR #123

🎯 Hôm nay:
- [THT-042] Kết nối Socket.io cho realtime
- [THT-043] Bắt đầu research API design

🚧 Blockers:
- Chờ Figma design cho trang Profile
- Cần help: Docker sandbox config
```

### 5.4. Quy Trình Hotfix

```mermaid
flowchart LR
    A["🔥 Bug trên\nProduction"] --> B["Tạo branch\nhotfix/THT-xxx"]
    B --> C["Fix & Test"]
    C --> D["PR → main\n(expedited review)"]
    D --> E["Merge & Deploy\nProduction"]
    E --> F["Cherry-pick\nvào develop"]
    F --> G["✅ Đóng ticket"]

    style A fill:#dc2626,stroke:#991b1b,color:#fff
    style E fill:#059669,stroke:#047857,color:#fff
```

```bash
# Hotfix workflow
git checkout main
git pull origin main
git checkout -b hotfix/THT-200-critical-auth-bypass

# ... fix bug ...

git commit -m "fix(auth): vá lỗ hổng bypass authentication

Nguyên nhân: middleware không check JWT expiry đúng.
Ảnh hưởng: User có thể truy cập API với token hết hạn.

Fixes THT-200"

# Tạo PR → main (cần approve nhanh từ Tech Lead)
# Sau khi merge main → cherry-pick vào develop
git checkout develop
git cherry-pick <commit-hash>
git push origin develop
```

---

## 📊 6. Tech Stack Reference Table

### Core Technologies

| Công nghệ | Phiên bản | Vai trò | Tài liệu |
|-----------|-----------|---------|-----------|
| **Next.js** | 15.x | Framework React full-stack, App Router, SSR/SSG/ISR | [nextjs.org/docs](https://nextjs.org/docs) |
| **TypeScript** | 5.x | Type safety, strict mode | [typescriptlang.org](https://typescriptlang.org) |
| **React** | 19.x | UI library, Server Components | [react.dev](https://react.dev) |
| **Tailwind CSS** | 4.x | Utility-first CSS framework | [tailwindcss.com](https://tailwindcss.com) |

### Backend & Data

| Công nghệ | Phiên bản | Vai trò | Tài liệu |
|-----------|-----------|---------|-----------|
| **Drizzle ORM** | 0.35.x | Type-safe SQL ORM, migrations, schema | [orm.drizzle.team](https://orm.drizzle.team) |
| **PostgreSQL** | 16.x | Primary database | [postgresql.org](https://postgresql.org) |
| **Redis** | 7.x | Caching, session store, BullMQ backend | [redis.io](https://redis.io) |
| **BullMQ** | 5.x | Job queue cho judge system | [docs.bullmq.io](https://docs.bullmq.io) |
| **Zod** | 3.x | Runtime schema validation | [zod.dev](https://zod.dev) |

### Realtime & Editor

| Công nghệ | Phiên bản | Vai trò | Tài liệu |
|-----------|-----------|---------|-----------|
| **Socket.io** | 4.x | WebSocket cho realtime (contest, leaderboard) | [socket.io](https://socket.io) |
| **Monaco Editor** | latest | Code editor (VS Code engine) | [microsoft.github.io/monaco-editor](https://microsoft.github.io/monaco-editor) |

### State Management & Data Fetching

| Công nghệ | Phiên bản | Vai trò | Tài liệu |
|-----------|-----------|---------|-----------|
| **Zustand** | 5.x | Client-side state management (lightweight) | [zustand-demo.pmnd.rs](https://zustand-demo.pmnd.rs) |
| **TanStack Query** | 5.x | Server state, caching, optimistic updates | [tanstack.com/query](https://tanstack.com/query) |

### Testing

| Công nghệ | Phiên bản | Vai trò | Tài liệu |
|-----------|-----------|---------|-----------|
| **Vitest** | 2.x | Unit & integration testing (fast, Vite-native) | [vitest.dev](https://vitest.dev) |
| **Playwright** | 1.x | E2E testing, cross-browser | [playwright.dev](https://playwright.dev) |
| **Testing Library** | latest | Component testing utilities | [testing-library.com](https://testing-library.com) |

### DevOps & Tooling

| Công nghệ | Vai trò |
|-----------|---------|
| **Docker** | Containerization cho services + sandbox |
| **GitHub Actions** | CI/CD pipeline |
| **Husky** | Git hooks (pre-commit, pre-push) |
| **lint-staged** | Chỉ lint files đã staged |
| **Sentry** | Error monitoring & tracking |
| **Vercel** | Hosting & deployment |

### Tech Stack Diagram

```mermaid
graph TB
    subgraph CLIENT["🌐 Client (Browser)"]
        NEXT["Next.js 15\nApp Router"]
        REACT["React 19\nServer + Client Components"]
        TW["Tailwind CSS 4"]
        MONACO["Monaco Editor"]
        ZUSTAND["Zustand\n(Client State)"]
        TQ["TanStack Query\n(Server State)"]
        SOCKETC["Socket.io Client"]
    end

    subgraph SERVER["🖥️ Server"]
        API["Next.js API Routes"]
        AUTH["NextAuth.js\n(Auth)"]
        ZOD["Zod\n(Validation)"]
        DRIZZLE["Drizzle ORM"]
        BULLMQ["BullMQ\n(Job Queue)"]
        SOCKETS["Socket.io Server"]
        AI_SVC["AI Service\n(Hints, Analysis)"]
    end

    subgraph DATA["💾 Data Layer"]
        PG["PostgreSQL 16"]
        REDIS["Redis 7"]
    end

    subgraph WORKER["⚙️ Workers"]
        JUDGE["Judge Worker"]
        SANDBOX["Docker Sandbox\n(Compile & Run)"]
    end

    subgraph TEST["🧪 Testing"]
        VITEST["Vitest\n(Unit/Integration)"]
        PLAYWRIGHT["Playwright\n(E2E)"]
    end

    NEXT --> API
    REACT --> NEXT
    TW --> REACT
    ZUSTAND --> REACT
    TQ --> API
    SOCKETC --> SOCKETS
    MONACO --> REACT
    API --> AUTH
    API --> ZOD
    API --> DRIZZLE
    API --> BULLMQ
    API --> AI_SVC
    DRIZZLE --> PG
    BULLMQ --> REDIS
    SOCKETS --> REDIS
    AUTH --> PG
    BULLMQ --> JUDGE
    JUDGE --> SANDBOX

    style CLIENT fill:#1e1b4b,stroke:#4338ca,color:#e0e7ff
    style SERVER fill:#172554,stroke:#1d4ed8,color:#dbeafe
    style DATA fill:#1a2e05,stroke:#65a30d,color:#ecfccb
    style WORKER fill:#451a03,stroke:#d97706,color:#fef3c7
    style TEST fill:#3b0764,stroke:#a855f7,color:#f3e8ff
```

---

## 📎 Phụ Lục

### A. Lệnh Thường Dùng (Cheat Sheet)

```bash
# ===== GIT =====
git checkout -b feature/THT-xxx-desc    # Tạo branch mới
git rebase origin/develop               # Rebase với develop
git push --force-with-lease             # Push sau rebase
git log --oneline -10                   # Xem 10 commits gần nhất
git stash / git stash pop               # Lưu/phục hồi thay đổi tạm

# ===== DEV =====
pnpm dev                                # Start dev server
pnpm build                              # Build production
pnpm lint                               # Kiểm tra linting
pnpm lint:fix                           # Auto-fix lint errors
pnpm typecheck                          # Kiểm tra TypeScript
pnpm format                             # Format code với Prettier

# ===== DATABASE =====
pnpm db:generate                        # Generate migration
pnpm db:migrate                         # Run migrations
pnpm db:push                            # Push schema (dev only)
pnpm db:studio                          # Mở Drizzle Studio GUI
pnpm db:seed                            # Seed data mẫu

# ===== TESTING =====
pnpm test                               # Chạy unit tests
pnpm test:watch                         # Watch mode
pnpm test:coverage                      # Xem coverage report
pnpm test:e2e                           # Chạy E2E tests
pnpm test:e2e:ui                        # E2E với UI mode

# ===== DOCKER =====
docker compose up -d                    # Start PostgreSQL + Redis
docker compose down                     # Stop services
docker compose logs -f postgres         # Xem logs PostgreSQL
```

### B. IDE Setup Khuyến Nghị (VS Code)

**Extensions bắt buộc:**

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-playwright.playwright",
    "vitest.explorer",
    "GitHub.copilot",
    "eamodio.gitlens",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

**VS Code Settings (`.vscode/settings.json`):**

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "files.exclude": {
    "**/node_modules": true,
    "**/.next": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### C. Quy Ước Communication

| Kênh | Mục đích |
|------|----------|
| **#tht-dev** (Slack/Discord) | Thảo luận dev chung, hỏi đáp nhanh |
| **#tht-pr-reviews** | Thông báo PR cần review |
| **#tht-deployments** | Thông báo deploy staging/production |
| **#tht-incidents** | Báo cáo & xử lý sự cố |
| **Daily Standup** | 9:00 AM hàng ngày (15 phút) |
| **Sprint Planning** | Thứ 2 đầu sprint (2 giờ) |
| **Sprint Retro** | Thứ 6 cuối sprint (1 giờ) |

---

> 📝 **Ghi chú:** Tài liệu này là **living document**, được cập nhật liên tục. Nếu bạn thấy cần bổ sung hoặc thay đổi, hãy tạo PR vào `docs/DEV_WORKFLOW.md` và tag Tech Lead review.
>
> **Lần cập nhật cuối:** 13/07/2026 | **Bởi:** Tech Lead Team
