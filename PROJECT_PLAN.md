# 📘 DỰ ÁN TINHOCTRE PLATFORM - TỔNG HỢP TÀI LIỆU

> **Nền tảng ôn luyện & thi thử Tin học trẻ toàn quốc tích hợp AI**  
> Phiên bản: v1.0 | Ngày: 13/07/2026

---

## 🗂️ DANH MỤC TÀI LIỆU DỰ ÁN

Tất cả tài liệu nằm trong thư mục `docs/`. Mỗi vai trò đọc tài liệu tương ứng:

### Cho tất cả team members
| # | Tài liệu | Đường dẫn | Mô tả |
|:---|:---|:---|:---|
| 1 | **Kiến trúc hệ thống** | [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | System design, data flow, deployment, monitoring |
| 2 | **Database Schema** | [`docs/DATABASE_SCHEMA.md`](./docs/DATABASE_SCHEMA.md) | ERD, Drizzle ORM schema, migrations, seed data |
| 3 | **API Contract** | [`docs/API_CONTRACT.md`](./docs/API_CONTRACT.md) | Tất cả endpoints, request/response, error codes, WebSocket |

### Theo vai trò
| Vai trò | Tài liệu | Đường dẫn |
|:---|:---|:---|
| 👨‍💻 **Developer** | Quy trình Dev | [`docs/DEV_WORKFLOW.md`](./docs/DEV_WORKFLOW.md) |
| 🧑‍💼 **BA** | Quy trình BA | [`docs/BA_WORKFLOW.md`](./docs/BA_WORKFLOW.md) |
| 🧪 **QA / Tester** | Quy trình QA | [`docs/QA_WORKFLOW.md`](./docs/QA_WORKFLOW.md) |

### Tài liệu nghiệp vụ
| # | Tài liệu | Đường dẫn | Mô tả |
|:---|:---|:---|:---|
| 1 | **Đặc tả sản phẩm** | [`../tin_hoc_tre_implementation_plan_ai.md`](../tin_hoc_tre_implementation_plan_ai.md) | PRD đầy đủ: mục tiêu, FR, NFR, tiêu chí nghiệm thu |
| 2 | **Tài liệu & Lộ trình ôn luyện** | [`../tin_hoc_tre_resources.md`](../tin_hoc_tre_resources.md) | Nguồn học liệu, đề thi, lộ trình 5 giai đoạn |

---

## 🚀 BẮT ĐẦU NHANH (QUICKSTART)

### Bước 1: Clone & Install
```bash
git clone https://github.com/your-org/tin-hoc-tre-app.git
cd tin-hoc-tre-app
npm install
```

### Bước 2: Setup Environment
```bash
cp .env.example .env.local
# Chỉnh sửa các biến trong .env.local
```

### Bước 3: Setup Database
```bash
# Start PostgreSQL & Redis (Docker)
docker compose up -d postgres redis

# Run migrations
npx drizzle-kit push
```

### Bước 4: Start Development
```bash
# Start web app
npm run dev

# Start judge worker (terminal riêng)
npm run judge:worker
```

### Bước 5: Truy cập
- **Web App**: http://localhost:3000
- **API Docs**: http://localhost:3000/api-docs

---

## 📊 TỔNG QUAN DỰ ÁN

### Mục tiêu
Xây dựng nền tảng **ôn luyện và thi thử Tin học trẻ** với:
- 📚 Kho đề thi 10+ năm (Bảng A, B, C1, C2)
- 💻 Code Editor trực tuyến (C++, Python, Pascal, Scratch)
- ⚡ Chấm bài tự động trong Docker sandbox
- 🤖 AI phân tích lỗi và gợi ý cải thiện (Gemini)
- 🏆 Hệ thống thi thử mô phỏng thực tế
- 📊 Theo dõi tiến độ và lộ trình cá nhân hóa

### Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                    TINHOCTRE PLATFORM                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Next.js  │  │  Monaco  │  │ Scratch  │  │ Socket.io│   │
│  │ Frontend │  │  Editor  │  │  Editor  │  │ Realtime │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │              │              │         │
│  ┌────┴──────────────┴──────────────┴──────────────┴─────┐  │
│  │                 Next.js API Routes                      │  │
│  │           (Auth + CRUD + Submission + Contest)           │  │
│  └────┬──────────────┬──────────────┬────────────────────┘  │
│       │              │              │                        │
│  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐                 │
│  │PostgreSQL│  │  Redis   │  │  BullMQ  │                 │
│  │  (Data)  │  │ (Cache)  │  │ (Queue)  │                 │
│  └──────────┘  └──────────┘  └────┬─────┘                 │
│                                    │                        │
│  ┌─────────────────────────────────┴─────────────────────┐ │
│  │              JUDGE WORKERS (Docker Sandbox)             │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │ │
│  │  │  C++    │  │ Python  │  │ Pascal  │  │   AI    │  │ │
│  │  │ Worker  │  │ Worker  │  │ Worker  │  │ Worker  │  │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Công nghệ |
|:---|:---|
| **Frontend** | Next.js 15, React 19, TypeScript 5, Tailwind CSS 4 |
| **Editor** | Monaco Editor (C++/Python), Scratch VM |
| **Backend** | Next.js API Routes, Drizzle ORM, Zod |
| **Database** | PostgreSQL 16, Redis 7 |
| **Queue** | BullMQ |
| **Real-time** | Socket.io |
| **Judge** | Docker sandbox, isolate |
| **AI** | Google Gemini 2.0/2.5 |
| **Auth** | NextAuth.js v5, Google OAuth |
| **Testing** | Vitest, Playwright, k6 |
| **Deploy** | Vercel, Cloudflare, Docker |

### Roadmap

```
Tháng 1-2:  🟢 Foundation (Auth + Problems + Judge)
Tháng 3:    🟡 Contest System (Thi thử + Scoreboard)
Tháng 4:    🤖 AI Integration (Code Review + Learning Path)
Tháng 5:    📊 Experience (Study Sessions + Analytics)
Tháng 6:    🚀 Advanced (Classes + Scratch + Launch)
```

---

## 👥 TEAM STRUCTURE

| Vai trò | Số lượng | Trách nhiệm chính |
|:---|:---|:---|
| 🧑‍💼 BA / PM | 1 | Thu thập yêu cầu, viết specs, quản lý backlog |
| 👨‍💻 Frontend Dev | 1 | UI/UX, Monaco Editor, trang bài/contest/analytics |
| 👨‍💻 Backend Dev | 1-2 | API, database, business logic |
| 👨‍💻 Fullstack Dev | 1 | Judge system, AI integration, WebSocket |
| 🧪 QA Tester | 1 | Test cases, bug reports, performance testing |
| 🛠️ DevOps | 0.5 | CI/CD, Docker, monitoring, deployment |

---

## 📞 LIÊN HỆ & QUYẾT ĐỊNH

| Hạng mục | Người quyết định |
|:---|:---|
| Scope & Features | Product Owner |
| Kiến trúc kỹ thuật | Tech Lead |
| UI/UX Design | Frontend Lead |
| Database Schema | Backend Lead |
| AI Prompts & Models | AI Lead |
| Security Policies | DevOps + Tech Lead |
| Release Schedule | PM + Tech Lead |

---

> [!TIP]
> **Bắt đầu từ đâu?**  
> 1. Đọc [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md) để hiểu tổng quan hệ thống  
> 2. Đọc tài liệu theo vai trò của bạn (Dev/BA/QA)  
> 3. Xem [`API_CONTRACT.md`](./docs/API_CONTRACT.md) để hiểu API  
> 4. Xem [`DATABASE_SCHEMA.md`](./docs/DATABASE_SCHEMA.md) để hiểu data model
