# 📡 API CONTRACT - TINHOCTRE PLATFORM

> Tài liệu mô tả chi tiết tất cả API endpoints, request/response schemas, error codes.
> Mọi API sử dụng JSON format. Base URL: `https://tinhoctre.vn/api`

---

## 1. AUTHENTICATION

### POST /api/auth/register

Đăng ký tài khoản mới.

**Request:**
```json
{
  "email": "hocsinh@email.com",
  "password": "MatKhau123!",
  "displayName": "Nguyễn Văn A",
  "gradeLevel": "thcs",
  "competitionBoard": "B",
  "school": "THCS Nguyễn Trãi",
  "province": "Hà Nội"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "hocsinh@email.com",
      "displayName": "Nguyễn Văn A",
      "role": "student",
      "gradeLevel": "thcs",
      "competitionBoard": "B"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error 400:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email đã tồn tại",
    "details": [
      { "field": "email", "message": "Email này đã được đăng ký" }
    ]
  }
}
```

### POST /api/auth/login

**Request:**
```json
{
  "email": "hocsinh@email.com",
  "password": "MatKhau123!"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "displayName": "...", "role": "student" },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2026-07-14T15:30:00Z"
  }
}
```

### GET /api/auth/me

Lấy thông tin user hiện tại. **Requires: Authentication**

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "hocsinh@email.com",
    "displayName": "Nguyễn Văn A",
    "role": "student",
    "gradeLevel": "thcs",
    "competitionBoard": "B",
    "school": "THCS Nguyễn Trãi",
    "province": "Hà Nội",
    "stats": {
      "totalSubmissions": 42,
      "acceptedCount": 28,
      "acRate": 66.7,
      "solvedProblems": 15,
      "totalStudyTime": 1240
    }
  }
}
```

---

## 2. PROBLEMS

### GET /api/problems

Danh sách bài toán có phân trang và filter.

**Query Parameters:**

| Param | Type | Required | Default | Mô tả |
|:---|:---|:---|:---|:---|
| `page` | number | No | 1 | Trang hiện tại |
| `limit` | number | No | 20 | Số bài/trang (max 50) |
| `board` | string | No | - | Filter: A, B, C1, C2 |
| `difficulty` | string | No | - | Filter: easy, medium, hard, expert |
| `year` | number | No | - | Filter: năm đề thi |
| `topic` | string | No | - | Filter: slug chủ đề |
| `search` | string | No | - | Tìm kiếm theo tên bài |
| `status` | string | No | - | Filter: solved, unsolved, attempted |
| `sort` | string | No | newest | Sắp xếp: newest, oldest, ac_rate, difficulty |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "prob-001",
        "code": "THT2024-B-01",
        "title": "Xếp que diêm",
        "difficulty": "easy",
        "board": "B",
        "sourceYear": 2024,
        "sourceExam": "Chung kết Quốc gia",
        "sourceRound": "Bảng B",
        "totalSubmissions": 342,
        "acceptedSubmissions": 256,
        "acRate": 74.9,
        "topics": ["so-hoc", "tham-lam"],
        "userStatus": "solved"
      },
      {
        "id": "prob-002",
        "code": "THT2024-B-02",
        "title": "Tô màu bảng",
        "difficulty": "medium",
        "board": "B",
        "sourceYear": 2024,
        "topics": ["quy-hoach-dong", "to-hop"],
        "totalSubmissions": 189,
        "acceptedSubmissions": 67,
        "acRate": 35.4,
        "userStatus": "attempted"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

### GET /api/problems/:id

Chi tiết bài toán.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "prob-001",
    "code": "THT2024-B-01",
    "title": "Xếp que diêm",
    "descriptionMd": "# Xếp que diêm\n\nCho N que diêm, hãy xếp thành số lớn nhất...",
    "inputFormat": "Dòng đầu tiên chứa số nguyên N (1 ≤ N ≤ 10^18)",
    "outputFormat": "In ra số lớn nhất có thể xếp được",
    "sampleInput": "7",
    "sampleOutput": "711",
    "constraints": "1 ≤ N ≤ 10^18\nTime limit: 1000ms\nMemory limit: 256MB",
    "timeLimitMs": 1000,
    "memoryLimitKb": 262144,
    "allowedLanguages": ["cpp17", "cpp14", "python3", "pascal"],
    "difficulty": "easy",
    "board": "B",
    "sourceYear": 2024,
    "sourceExam": "Chung kết Quốc gia Tin học trẻ",
    "sourceRound": "Bảng B",
    "sourceUrl": "https://tinhoctre.vn/de-thi/2024",
    "subtasks": [
      { "number": 1, "maxScore": 30, "constraints": "N ≤ 20" },
      { "number": 2, "maxScore": 30, "constraints": "N ≤ 10^6" },
      { "number": 3, "maxScore": 40, "constraints": "N ≤ 10^18" }
    ],
    "topics": [
      { "name": "Số học", "slug": "so-hoc" },
      { "name": "Tham lam", "slug": "tham-lam" }
    ],
    "stats": {
      "totalSubmissions": 342,
      "acceptedSubmissions": 256,
      "acRate": 74.9
    },
    "userStats": {
      "status": "solved",
      "bestScore": 100,
      "submissionCount": 3,
      "lastSubmittedAt": "2026-07-10T08:30:00Z"
    }
  }
}
```

---

## 3. SUBMISSIONS

### POST /api/submissions

Nộp bài giải. **Requires: Authentication**

**Request:**
```json
{
  "problemId": "prob-001",
  "language": "cpp17",
  "sourceCode": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    long long n;\n    cin >> n;\n    // solution here\n    return 0;\n}",
  "contestId": null
}
```

**Validation Rules:**
- `sourceCode` max size: 64 KB
- `language` phải nằm trong `allowedLanguages` của bài
- Rate limit: 1 submission / 10 giây / user
- Contest: chỉ nhận trong thời gian `start_time` → `end_time`

**Response 202 (Accepted - Queued for judging):**
```json
{
  "success": true,
  "data": {
    "submissionId": "sub-12345",
    "status": "PENDING",
    "queuePosition": 3,
    "estimatedTime": 5,
    "websocketChannel": "submission:sub-12345"
  }
}
```

**Error 429 (Rate Limited):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Vui lòng đợi 10 giây trước khi nộp lại",
    "retryAfter": 8
  }
}
```

### GET /api/submissions/:id

Chi tiết submission.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "sub-12345",
    "problemId": "prob-001",
    "problemTitle": "Xếp que diêm",
    "language": "cpp17",
    "sourceCode": "#include <bits/stdc++.h>...",
    "status": "AC",
    "score": 100,
    "maxScore": 100,
    "timeMs": 15,
    "memoryKb": 2048,
    "submittedAt": "2026-07-13T10:30:00Z",
    "subtaskResults": [
      {
        "subtaskNumber": 1,
        "score": 30,
        "maxScore": 30,
        "tests": [
          { "testNumber": 1, "verdict": "AC", "timeMs": 5, "memoryKb": 1024 },
          { "testNumber": 2, "verdict": "AC", "timeMs": 8, "memoryKb": 1536 }
        ]
      },
      {
        "subtaskNumber": 2,
        "score": 30,
        "maxScore": 30,
        "tests": [
          { "testNumber": 3, "verdict": "AC", "timeMs": 12, "memoryKb": 2048 },
          { "testNumber": 4, "verdict": "AC", "timeMs": 10, "memoryKb": 1800 }
        ]
      },
      {
        "subtaskNumber": 3,
        "score": 40,
        "maxScore": 40,
        "tests": [
          { "testNumber": 5, "verdict": "AC", "timeMs": 15, "memoryKb": 2048 }
        ]
      }
    ],
    "aiFeedback": {
      "status": "completed",
      "analysis": "Code của bạn đã giải quyết tốt bài toán...",
      "complexity": "O(1)",
      "suggestions": ["Code rất tối ưu, không cần cải thiện thêm"]
    }
  }
}
```

### GET /api/submissions

Lịch sử nộp bài của user. **Requires: Authentication**

**Query Parameters:**
| Param | Type | Default | Mô tả |
|:---|:---|:---|:---|
| `problemId` | string | - | Filter theo bài |
| `contestId` | string | - | Filter theo contest |
| `status` | string | - | Filter: AC, WA, TLE, etc. |
| `page` | number | 1 | Trang |
| `limit` | number | 20 | Số kết quả |

---

## 4. CONTESTS

### GET /api/contests

Danh sách contest.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "upcoming": [
      {
        "id": "contest-001",
        "title": "Thi thử THT Bảng B - Vòng 5",
        "startTime": "2026-07-20T09:00:00Z",
        "endTime": "2026-07-20T11:30:00Z",
        "board": "B",
        "participantCount": 45,
        "status": "upcoming"
      }
    ],
    "running": [],
    "past": [
      {
        "id": "contest-002",
        "title": "Thi thử THT Bảng B - Vòng 4",
        "startTime": "2026-07-06T09:00:00Z",
        "endTime": "2026-07-06T11:30:00Z",
        "board": "B",
        "participantCount": 52,
        "status": "ended",
        "myRank": 12,
        "myScore": 250
      }
    ]
  }
}
```

### POST /api/contests/:id/join

Đăng ký tham gia contest. **Requires: Authentication**

**Response 200:**
```json
{
  "success": true,
  "data": {
    "contestId": "contest-001",
    "status": "registered",
    "message": "Đã đăng ký thành công. Contest bắt đầu lúc 09:00 ngày 20/07/2026."
  }
}
```

### GET /api/contests/:id/scoreboard

**Response 200:**
```json
{
  "success": true,
  "data": {
    "contestId": "contest-002",
    "title": "Thi thử THT Bảng B - Vòng 4",
    "status": "ended",
    "scoreboardStatus": "public",
    "problems": [
      { "label": "A", "title": "Xếp que diêm", "maxScore": 100 },
      { "label": "B", "title": "Tô màu bảng", "maxScore": 100 },
      { "label": "C", "title": "Đa giác đều", "maxScore": 100 }
    ],
    "standings": [
      {
        "rank": 1,
        "userId": "user-001",
        "displayName": "Trần Minh Đức",
        "totalScore": 300,
        "totalPenalty": 45,
        "problemScores": [
          { "label": "A", "score": 100, "attempts": 1, "penalty": 10 },
          { "label": "B", "score": 100, "attempts": 2, "penalty": 20 },
          { "label": "C", "score": 100, "attempts": 1, "penalty": 15 }
        ]
      },
      {
        "rank": 2,
        "userId": "user-002",
        "displayName": "Lê Thị Hoa",
        "totalScore": 260,
        "totalPenalty": 55,
        "problemScores": [
          { "label": "A", "score": 100, "attempts": 1, "penalty": 8 },
          { "label": "B", "score": 100, "attempts": 3, "penalty": 32 },
          { "label": "C", "score": 60, "attempts": 2, "penalty": 15 }
        ]
      }
    ]
  }
}
```

---

## 5. AI

### POST /api/ai/review

Yêu cầu AI review code. **Requires: Authentication**

**Request:**
```json
{
  "submissionId": "sub-12345"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "submissionId": "sub-12345",
    "status": "processing",
    "estimatedTime": 10,
    "websocketChannel": "ai-feedback:sub-12345"
  }
}
```

**WebSocket Event (khi AI hoàn thành):**
```json
{
  "event": "ai-feedback:complete",
  "data": {
    "submissionId": "sub-12345",
    "errorType": "logic_error",
    "explanation": "Code của bạn bị sai ở bước xử lý trường hợp N chẵn. Khi N chẵn, số que diêm tối ưu cho mỗi chữ số là 2 (tạo ra số 1), nhưng code hiện tại đang xử lý sai cho N = 2.",
    "hints": [
      "Xem lại điều kiện chia trường hợp N chẵn và N lẻ",
      "Thử chạy với N = 2, N = 4 để kiểm tra"
    ],
    "complexity": {
      "current": "O(N)",
      "optimal": "O(1)",
      "suggestion": "Bài này có thể giải trong O(1) bằng công thức toán học"
    },
    "relatedTopics": ["so-hoc", "tham-lam"]
  }
}
```

### GET /api/ai/learning-path

Lộ trình học cá nhân. **Requires: Authentication**

**Response 200:**
```json
{
  "success": true,
  "data": {
    "currentLevel": "Giai đoạn 3 - Thuật toán cơ bản",
    "board": "B",
    "strengths": [
      { "topic": "Sắp xếp", "mastery": 85 },
      { "topic": "Tìm kiếm", "mastery": 78 }
    ],
    "weaknesses": [
      { "topic": "Quy hoạch động", "mastery": 25 },
      { "topic": "Đồ thị BFS/DFS", "mastery": 30 }
    ],
    "nextProblems": [
      {
        "id": "prob-050",
        "title": "Dãy con tăng dài nhất",
        "reason": "Luyện QHĐ cơ bản - chủ đề yếu nhất",
        "difficulty": "medium"
      },
      {
        "id": "prob-051",
        "title": "Bài toán Balo",
        "reason": "QHĐ kinh điển, bám sát đề thi THT",
        "difficulty": "medium"
      }
    ],
    "weeklyGoal": {
      "targetProblems": 5,
      "completedProblems": 2,
      "targetStudyMinutes": 300,
      "completedStudyMinutes": 120
    }
  }
}
```

---

## 6. ANALYTICS

### GET /api/analytics/overview

Tổng quan tiến độ học tập. **Requires: Authentication**

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalSolved": 28,
    "totalAttempted": 42,
    "totalSubmissions": 156,
    "acRate": 66.7,
    "totalStudyMinutes": 1240,
    "currentStreak": 5,
    "longestStreak": 12,
    "byDifficulty": {
      "easy": { "solved": 15, "total": 20 },
      "medium": { "solved": 10, "total": 30 },
      "hard": { "solved": 3, "total": 25 },
      "expert": { "solved": 0, "total": 10 }
    },
    "byBoard": {
      "B": { "solved": 25, "total": 60 },
      "C1": { "solved": 3, "total": 25 }
    },
    "recentActivity": [
      { "date": "2026-07-13", "submissions": 5, "solved": 2 },
      { "date": "2026-07-12", "submissions": 8, "solved": 3 },
      { "date": "2026-07-11", "submissions": 3, "solved": 1 }
    ],
    "submissionHeatmap": {
      "2026-07": { "01": 3, "02": 5, "03": 0, "...": "..." }
    }
  }
}
```

---

## 7. ERROR CODES

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mô tả lỗi bằng tiếng Việt",
    "details": []
  }
}
```

### Error Code Table

| HTTP Status | Code | Mô tả |
|:---|:---|:---|
| 400 | `VALIDATION_ERROR` | Dữ liệu đầu vào không hợp lệ |
| 400 | `INVALID_LANGUAGE` | Ngôn ngữ lập trình không được phép |
| 400 | `CODE_TOO_LARGE` | Source code vượt quá 64KB |
| 401 | `UNAUTHORIZED` | Chưa đăng nhập |
| 401 | `TOKEN_EXPIRED` | Token hết hạn |
| 403 | `FORBIDDEN` | Không có quyền truy cập |
| 403 | `CONTEST_NOT_STARTED` | Contest chưa bắt đầu |
| 403 | `CONTEST_ENDED` | Contest đã kết thúc |
| 404 | `NOT_FOUND` | Không tìm thấy tài nguyên |
| 409 | `ALREADY_REGISTERED` | Đã đăng ký contest |
| 429 | `RATE_LIMITED` | Quá nhiều request |
| 429 | `SUBMISSION_RATE_LIMITED` | Nộp bài quá nhanh |
| 429 | `AI_RATE_LIMITED` | Hết lượt AI review trong ngày |
| 500 | `INTERNAL_ERROR` | Lỗi server |
| 503 | `JUDGE_UNAVAILABLE` | Hệ thống chấm bài đang bảo trì |

---

## 8. WEBSOCKET EVENTS

### Connection

```javascript
const socket = io('wss://tinhoctre.vn', {
  auth: { token: 'Bearer ...' }
});
```

### Events

| Event | Direction | Payload | Mô tả |
|:---|:---|:---|:---|
| `submission:status` | Server → Client | `{submissionId, status, testNumber?, verdict?}` | Cập nhật trạng thái chấm |
| `submission:result` | Server → Client | `{submissionId, verdict, score, timeMs, memoryKb}` | Kết quả cuối cùng |
| `ai-feedback:complete` | Server → Client | `{submissionId, analysis, hints[], complexity}` | AI feedback hoàn thành |
| `scoreboard:update` | Server → Client | `{contestId, standings[]}` | Scoreboard cập nhật |
| `contest:status` | Server → Client | `{contestId, status}` | Contest bắt đầu/kết thúc/freeze |

### Subscribe Pattern

```javascript
// Subscribe theo submission
socket.emit('subscribe', { channel: 'submission:sub-12345' });

// Subscribe scoreboard contest
socket.emit('subscribe', { channel: 'contest:contest-001:scoreboard' });

// Nhận kết quả
socket.on('submission:status', (data) => {
  console.log(`Test ${data.testNumber}: ${data.verdict}`);
});

socket.on('submission:result', (data) => {
  console.log(`Final: ${data.verdict} - Score: ${data.score}`);
});
```
