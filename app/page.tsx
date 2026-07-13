"use client";

import {
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CirclePlay,
  Clock3,
  Code2,
  Compass,
  Flame,
  FolderCode,
  GraduationCap,
  HelpCircle,
  Home,
  Library,
  Lightbulb,
  ListChecks,
  LockKeyhole,
  Menu,
  Play,
  Search,
  Settings,
  Sparkles,
  Target,
  TimerReset,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type NavKey = "home" | "roadmap" | "practice" | "contest" | "library";
type Level = "A" | "B" | "C";

const navItems = [
  { id: "home" as NavKey, label: "Tổng quan", icon: Home },
  { id: "roadmap" as NavKey, label: "Lộ trình", icon: Compass },
  { id: "practice" as NavKey, label: "Luyện tập", icon: Code2 },
  { id: "contest" as NavKey, label: "Phòng thi", icon: Trophy },
  { id: "library" as NavKey, label: "Học liệu", icon: Library },
];

const skillBars = [
  { label: "Cú pháp C++", value: 82, tone: "blue" },
  { label: "Tư duy thuật toán", value: 68, tone: "green" },
  { label: "Cấu trúc dữ liệu", value: 54, tone: "orange" },
  { label: "Kỹ năng phòng thi", value: 71, tone: "violet" },
];

const roadmapData: Record<Level, { title: string; subtitle: string; stages: Array<{ title: string; detail: string; lessons: string; status: "done" | "current" | "locked" }> }> = {
  A: {
    title: "Bảng A · Tiểu học",
    subtitle: "Tư duy trực quan, Scratch và sáng tạo sản phẩm",
    stages: [
      { title: "Làm quen Scratch", detail: "Tọa độ, chuyển động, sự kiện", lessons: "8 bài", status: "done" },
      { title: "Điều khiển & biến", detail: "Vòng lặp, rẽ nhánh, biến số", lessons: "12 bài", status: "current" },
      { title: "Vẽ hình nâng cao", detail: "Bút vẽ, đối xứng, khối tự tạo", lessons: "10 bài", status: "locked" },
      { title: "Luyện đề Bảng A", detail: "Vẽ hình, toán số, sản phẩm", lessons: "6 đề", status: "locked" },
    ],
  },
  B: {
    title: "Bảng B · THCS",
    subtitle: "C++ nền tảng, thuật toán và kỹ năng Online Judge",
    stages: [
      { title: "Nền tảng C++", detail: "Biến, vòng lặp, mảng và hàm", lessons: "14 bài", status: "done" },
      { title: "Thuật toán cơ bản", detail: "Sắp xếp, tìm kiếm, số học", lessons: "18 bài", status: "current" },
      { title: "Tư duy tối ưu", detail: "Prefix sum, greedy, backtracking", lessons: "16 bài", status: "locked" },
      { title: "Cấu trúc dữ liệu", detail: "Stack, queue, set/map, graph", lessons: "20 bài", status: "locked" },
      { title: "Chinh phục Quốc gia", detail: "DP, segment tree, chiến thuật", lessons: "12 đề", status: "locked" },
    ],
  },
  C: {
    title: "Bảng C · THPT",
    subtitle: "Lập trình thi đấu và thuật toán nâng cao",
    stages: [
      { title: "Củng cố nền tảng", detail: "STL, complexity, number theory", lessons: "12 bài", status: "done" },
      { title: "Dynamic Programming", detail: "Knapsack, LIS, LCS, bitmask", lessons: "18 bài", status: "current" },
      { title: "Đồ thị chuyên sâu", detail: "Shortest paths, MST, DSU", lessons: "20 bài", status: "locked" },
      { title: "Data Structures", detail: "Fenwick, segment tree, sparse table", lessons: "18 bài", status: "locked" },
      { title: "Contest mastery", detail: "Stress test, subtasks, tối ưu", lessons: "15 đề", status: "locked" },
    ],
  },
};

const problemSet = [
  { title: "Phần tử nhỏ nhất", topic: "Tìm kiếm", difficulty: "Dễ", points: 100, solved: true, time: "10 phút" },
  { title: "Dãy con có tổng lớn nhất", topic: "Prefix Sum", difficulty: "Vừa", points: 150, solved: false, time: "25 phút" },
  { title: "Chia dãy", topic: "Binary Search", difficulty: "Khó", points: 250, solved: false, time: "40 phút" },
  { title: "Mê cung robot", topic: "BFS", difficulty: "Vừa", points: 200, solved: false, time: "30 phút" },
  { title: "Dãy ngoặc đúng", topic: "Stack", difficulty: "Khó", points: 300, solved: false, time: "45 phút" },
  { title: "Xếp que diêm", topic: "Greedy", difficulty: "Dễ", points: 100, solved: true, time: "15 phút" },
];

const resources = [
  { name: "VNOI Wiki", type: "Thư viện thuật toán", note: "Chuẩn mực · Có code C++", rating: "5.0", icon: BrainCircuit, color: "blue" },
  { name: "Hanoi Online Judge", type: "Hệ thống chấm bài", note: "Kho đề Tin học trẻ", rating: "4.9", icon: Code2, color: "green" },
  { name: "Giải thuật và Lập trình", type: "Giáo trình nền tảng", note: "Lê Minh Hoàng", rating: "5.0", icon: BookOpen, color: "orange" },
  { name: "LQDOJ", type: "Thi thử & luyện tập", note: "Cộng đồng năng động", rating: "4.8", icon: Trophy, color: "violet" },
  { name: "Chuyên đề Scratch", type: "Giáo trình Bảng A", note: "Bám sát đề thi", rating: "4.8", icon: Sparkles, color: "pink" },
  { name: "Kho đề cộng đồng", type: "Đề thi 40+ tỉnh", note: "2018–2024 · Có đáp án", rating: "4.9", icon: FolderCode, color: "cyan" },
];

function ProgressRing({ value, size = 86 }: { value: number; size?: number }) {
  return (
    <div className="progress-ring" style={{ "--progress": `${value * 3.6}deg`, width: size, height: size } as React.CSSProperties}>
      <div className="progress-ring-inner">
        <strong>{value}%</strong>
        <span>hoàn thành</span>
      </div>
    </div>
  );
}

function Sidebar({ active, onChange, open, onClose }: { active: NavKey; onChange: (key: NavKey) => void; open: boolean; onClose: () => void }) {
  return (
    <>
      <div className={`sidebar-backdrop ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><span>&lt;</span><b>/</b><span>&gt;</span></div>
          <div><strong>Tin học trẻ</strong><small>Học để bứt phá</small></div>
          <button className="mobile-close" onClick={onClose} aria-label="Đóng menu"><X size={20} /></button>
        </div>
        <div className="level-chip"><GraduationCap size={17} /><span>Bảng B · THCS</span><ChevronDown size={15} /></div>
        <nav className="main-nav" aria-label="Điều hướng chính">
          <p>KHÔNG GIAN HỌC</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => { onChange(item.id); onClose(); }}><Icon size={19} /><span>{item.label}</span>{item.id === "practice" && <em>12</em>}</button>;
          })}
        </nav>
        <div className="sidebar-streak">
          <div className="streak-icon"><Flame size={20} fill="currentColor" /></div>
          <div><span>Chuỗi học tập</span><strong>12 ngày liên tiếp</strong></div>
          <b>12</b>
        </div>
        <div className="sidebar-bottom">
          <button><HelpCircle size={19} /><span>Trung tâm trợ giúp</span></button>
          <button><Settings size={19} /><span>Cài đặt</span></button>
          <div className="user-mini">
            <div className="avatar">MN</div><div><strong>Minh Nhật</strong><span>Hạng Bạc · #128</span></div><ChevronRight size={17} />
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onMenu, title }: { onMenu: () => void; title: string }) {
  return (
    <header className="topbar">
      <button className="menu-button" onClick={onMenu} aria-label="Mở menu"><Menu size={21} /></button>
      <div className="mobile-title">{title}</div>
      <label className="search-box"><Search size={18} /><input aria-label="Tìm kiếm" placeholder="Tìm bài học, chủ đề, đề thi..." /><kbd>⌘ K</kbd></label>
      <div className="top-actions">
        <button className="icon-button" aria-label="Thông báo"><Bell size={19} /><span className="notification-dot" /></button>
        <div className="xp-chip"><Zap size={16} fill="currentColor" /><span>1.280 XP</span></div>
        <button className="profile-button"><span className="avatar small">MN</span><ChevronDown size={15} /></button>
      </div>
    </header>
  );
}

function Dashboard({ onNavigate, onLesson }: { onNavigate: (key: NavKey) => void; onLesson: () => void }) {
  return (
    <div className="view dashboard-view">
      <section className="welcome-row">
        <div><p className="eyebrow"><Sparkles size={15} /> LỘ TRÌNH CÁ NHÂN HÓA</p><h1>Chào Minh Nhật, sẵn sàng<br />mở khóa tư duy hôm nay?</h1><p>Tiếp tục giữ nhịp — bạn đang nằm trong <strong>top 18%</strong> học viên Bảng B tuần này.</p></div>
        <div className="week-target"><div><Target size={19} /><span>Mục tiêu tuần</span></div><strong>4<span>/5</span></strong><small>buổi hoàn thành</small></div>
      </section>

      <section className="next-lesson card">
        <div className="lesson-copy">
          <div className="lesson-meta"><span className="tag primary">BÀI HỌC TIẾP THEO</span><span><Clock3 size={14} /> 25 phút</span><span><BarChart3 size={14} /> Trung bình</span></div>
          <h2>Tìm kiếm nhị phân trên kết quả</h2>
          <p>Học cách biến một bài toán tối ưu thành chuỗi câu hỏi đúng/sai — kỹ thuật “vũ khí bí mật” của bài Chia dãy.</p>
          <div className="lesson-objectives">
            <span><Check size={15} /> Nhận diện tính đơn điệu</span><span><Check size={15} /> Xây dựng hàm kiểm tra</span><span><Check size={15} /> Tối ưu O(N log S)</span>
          </div>
          <button className="primary-button" onClick={onLesson}><Play size={17} fill="currentColor" /> Tiếp tục học <ArrowRight size={17} /></button>
          <button className="text-button" onClick={() => onNavigate("roadmap")}>Xem lộ trình <ChevronRight size={16} /></button>
        </div>
        <div className="lesson-visual" aria-hidden="true">
          <div className="code-window">
            <div className="window-dots"><i /><i /><i /><span>binary_search.cpp</span></div>
            <code><span className="code-pink">while</span> (left &lt;= right) {'{'}</code>
            <code>&nbsp; mid = (left + right) / <span className="code-orange">2</span>;</code>
            <code>&nbsp; <span className="code-pink">if</span> (<span className="code-green">check</span>(mid))</code>
            <code>&nbsp;&nbsp;&nbsp; answer = mid;</code>
            <code>{'}'}</code>
            <div className="accepted-pill"><CheckCircle2 size={15} /> ACCEPTED · 42ms</div>
          </div>
          <div className="lesson-progress"><ProgressRing value={68} /><div><strong>8/12</strong><span>bài đã học</span></div></div>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="card today-plan">
          <div className="section-heading"><div><span className="mini-icon blue"><ListChecks size={18} /></span><div><h3>Kế hoạch hôm nay</h3><p>Thứ Hai, 13 tháng 7</p></div></div><span className="completion-label">2/4 hoàn thành</span></div>
          <div className="task-list">
            <button className="task done"><span className="task-check"><Check size={15} /></span><span className="task-icon theory"><BookOpen size={18} /></span><span className="task-copy"><strong>Ôn lý thuyết tìm kiếm</strong><small>Đã hoàn thành · +20 XP</small></span><span className="task-time">12 phút</span></button>
            <button className="task done"><span className="task-check"><Check size={15} /></span><span className="task-icon code"><Code2 size={18} /></span><span className="task-copy"><strong>Giải 2 bài Binary Search</strong><small>2/2 Accepted · +60 XP</small></span><span className="task-time">28 phút</span></button>
            <button className="task current" onClick={onLesson}><span className="task-check"><CirclePlay size={18} /></span><span className="task-icon video"><CirclePlay size={18} /></span><span className="task-copy"><strong>Học: Tìm kiếm trên kết quả</strong><small>Đang học · 68%</small></span><span className="task-time">25 phút</span><ChevronRight size={17} /></button>
            <button className="task"><span className="task-check empty" /><span className="task-icon test"><TimerReset size={18} /></span><span className="task-copy"><strong>Mini test cuối ngày</strong><small>5 câu · mở sau bài học</small></span><span className="task-time">15 phút</span><LockKeyhole size={16} /></button>
          </div>
        </section>

        <section className="card skill-card">
          <div className="section-heading"><div><span className="mini-icon green"><BrainCircuit size={18} /></span><div><h3>Bản đồ năng lực</h3><p>Cập nhật từ 42 bài gần nhất</p></div></div><button className="more-link" onClick={() => onNavigate("roadmap")}>Chi tiết <ChevronRight size={15} /></button></div>
          <div className="skill-score-row"><div className="overall-score"><span>NĂNG LỰC</span><strong>6.8</strong><small>/ 10</small></div><div className="rank-change"><ArrowRight size={16} /><span>Tăng <b>0.6</b> tháng này</span></div></div>
          <div className="skill-bars">{skillBars.map((skill) => <div className="skill-row" key={skill.label}><div><span>{skill.label}</span><b>{skill.value}%</b></div><div className="bar"><i className={skill.tone} style={{ width: `${skill.value}%` }} /></div></div>)}</div>
          <div className="skill-tip"><Lightbulb size={18} /><p><strong>Gợi ý tập trung</strong><span>Luyện thêm Stack & Queue để cân bằng năng lực.</span></p><button onClick={() => onNavigate("practice")}><ArrowRight size={16} /></button></div>
        </section>
      </div>

      <div className="bottom-grid">
        <section className="card activity-card">
          <div className="section-heading"><div><span className="mini-icon orange"><Flame size={18} /></span><div><h3>Nhịp học 7 ngày</h3><p>Ổn định hơn 24% so với tuần trước</p></div></div><strong className="streak-total">12 ngày 🔥</strong></div>
          <div className="week-chart">{[
            ["T2", 52, "42'"], ["T3", 70, "56'"], ["T4", 38, "30'"], ["T5", 82, "65'"], ["T6", 61, "49'"], ["T7", 90, "72'"], ["CN", 48, "38'"]
          ].map(([day, height, time], index) => <div className={`day-column ${index === 6 ? "today" : ""}`} key={day}><span>{time}</span><div><i style={{ height: `${height}%` }} /></div><b>{day}</b></div>)}</div>
        </section>

        <section className="card contest-card-mini">
          <div className="contest-top"><span className="mini-icon violet"><Trophy size={18} /></span><div><span>THI THỬ TIẾP THEO</span><strong>Bảng B · Sprint #08</strong></div><span className="live-tag">MỞ ĐĂNG KÝ</span></div>
          <div className="contest-date"><div><CalendarDays size={19} /><span>Chủ nhật, 19/07</span></div><div><Clock3 size={19} /><span>08:00 · 150 phút</span></div></div>
          <div className="contest-people"><div className="avatar-stack"><i>AN</i><i>LT</i><i>QN</i><i>+96</i></div><span>99 học viên đã tham gia</span></div>
          <button className="secondary-button" onClick={() => onNavigate("contest")}>Xem phòng thi <ArrowRight size={16} /></button>
        </section>
      </div>
    </div>
  );
}

function RoadmapView({ level, setLevel }: { level: Level; setLevel: (level: Level) => void }) {
  const data = roadmapData[level];
  return <div className="view inner-view"><div className="page-intro"><p className="eyebrow"><Compass size={15} /> LỘ TRÌNH NĂNG LỰC</p><h1>Đi đúng đường, tiến đúng nhịp.</h1><p>Mỗi chặng kết hợp lý thuyết, bài tập và kiểm tra để biến kiến thức thành kỹ năng thi thật.</p></div>
    <div className="level-tabs">{(["A", "B", "C"] as Level[]).map((item) => <button key={item} className={level === item ? "active" : ""} onClick={() => setLevel(item)}><b>Bảng {item}</b><span>{item === "A" ? "Tiểu học" : item === "B" ? "THCS" : "THPT"}</span></button>)}</div>
    <section className="roadmap-header card"><div><span className="tag primary">LỘ TRÌNH ĐỀ XUẤT</span><h2>{data.title}</h2><p>{data.subtitle}</p></div><div className="roadmap-summary"><ProgressRing value={level === "A" ? 38 : level === "B" ? 32 : 24} size={92} /><div><strong>{level === "B" ? "14/44" : "9/38"}</strong><span>bài hoàn thành</span><small>≈ 7 tháng đến mục tiêu</small></div></div></section>
    <section className="roadmap-list">{data.stages.map((stage, index) => <article className={`roadmap-stage card ${stage.status}`} key={stage.title}><div className="stage-number">{stage.status === "done" ? <Check size={20} /> : index + 1}</div><div className="stage-copy"><div><span>CHẶNG {index + 1}</span>{stage.status === "current" && <em>ĐANG HỌC</em>}</div><h3>{stage.title}</h3><p>{stage.detail}</p></div><div className="stage-lessons"><BookOpen size={17} /><span>{stage.lessons}</span></div>{stage.status === "locked" ? <LockKeyhole className="stage-action" size={19} /> : <button className="stage-action"><ChevronRight size={19} /></button>}</article>)}</section>
  </div>;
}

function PracticeView({ onLesson }: { onLesson: () => void }) {
  const [filter, setFilter] = useState("Tất cả");
  const topics = ["Tất cả", "Tìm kiếm", "Prefix Sum", "BFS", "Stack", "Greedy"];
  const visible = filter === "Tất cả" ? problemSet : problemSet.filter((p) => p.topic === filter);
  return <div className="view inner-view"><div className="page-intro with-action"><div><p className="eyebrow"><Code2 size={15} /> PHÒNG LUYỆN TẬP</p><h1>Giải từng bài. Mạnh từng ngày.</h1><p>Bài tập được đề xuất theo đúng lỗ hổng năng lực và mục tiêu Bảng B của bạn.</p></div><button className="primary-button" onClick={onLesson}><Zap size={17} fill="currentColor" /> Luyện nhanh 15 phút</button></div>
    <section className="practice-overview"><div className="practice-stat card"><span className="mini-icon blue"><CheckCircle2 size={20} /></span><div><strong>42</strong><span>Bài đã giải</span></div><small>+8 tuần này</small></div><div className="practice-stat card"><span className="mini-icon orange"><Flame size={20} /></span><div><strong>74%</strong><span>Tỉ lệ Accepted</span></div><small>+6% tháng này</small></div><div className="practice-stat card"><span className="mini-icon violet"><Award size={20} /></span><div><strong>1.280</strong><span>Tổng XP</span></div><small>Hạng Bạc</small></div></section>
    <div className="filter-row">{topics.map((topic) => <button key={topic} className={filter === topic ? "active" : ""} onClick={() => setFilter(topic)}>{topic}</button>)}</div>
    <section className="problem-table card"><div className="table-header"><span>BÀI TẬP</span><span>CHỦ ĐỀ</span><span>ĐỘ KHÓ</span><span>ĐIỂM</span><span /></div>{visible.map((problem) => <button className="problem-row" key={problem.title} onClick={onLesson}><span className={`problem-status ${problem.solved ? "solved" : ""}`}>{problem.solved ? <Check size={16} /> : <Code2 size={16} />}</span><span className="problem-title"><strong>{problem.title}</strong><small><Clock3 size={13} /> {problem.time}</small></span><span><em className="topic-chip">{problem.topic}</em></span><span><em className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</em></span><span><b>{problem.points}</b> XP</span><ChevronRight size={17} /></button>)}</section>
  </div>;
}

function ContestView({ onStart }: { onStart: () => void }) {
  return <div className="view inner-view"><div className="page-intro"><p className="eyebrow"><Trophy size={15} /> MÔ PHỎNG PHÒNG THI</p><h1>Thi như thật. Tiến bộ thật.</h1><p>Luyện chiến thuật 150 phút, tự động chấm theo subtasks và phân tích hiệu suất sau mỗi lượt.</p></div>
    <section className="featured-contest card"><div className="featured-contest-copy"><span className="tag live">SẮP DIỄN RA · 19/07</span><h2>Tin học trẻ Bảng B<br />Sprint #08</h2><p>5 bài · 500 điểm · Bám cấu trúc Chung kết Quốc gia</p><div className="contest-features"><span><TimerReset size={18} /> 150 phút</span><span><ListChecks size={18} /> Chấm theo subtask</span><span><BarChart3 size={18} /> Phân tích sau thi</span></div><button className="light-button" onClick={onStart}><Play size={17} fill="currentColor" /> Vào phòng chờ</button></div><div className="contest-board"><div className="board-title"><span>ĐỀ THI MÔ PHỎNG</span><b>500</b><small>điểm tối đa</small></div>{[["A", "Xếp que diêm", "Dễ", 100], ["B", "Tô màu bảng", "Vừa", 100], ["C", "Đa giác đều", "Vừa", 100], ["D", "Chia dãy", "Khó", 100], ["E", "Dãy ngoặc đúng", "Rất khó", 100]].map(([code, name, diff, point]) => <div className="board-row" key={String(code)}><i>{code}</i><span><strong>{name}</strong><small>{diff}</small></span><b>{point}</b></div>)}</div></section>
    <div className="contest-history-grid"><section className="card history-card"><div className="section-heading"><div><span className="mini-icon blue"><BarChart3 size={18} /></span><div><h3>Lịch sử thi thử</h3><p>3 lượt gần nhất</p></div></div></div>{[["Sprint #07", "12/07", 320, "+40"], ["Đề Quốc gia 2024", "05/07", 280, "+20"], ["Sprint #06", "28/06", 260, "—"]].map(([name, date, score, change]) => <div className="history-row" key={String(name)}><span><strong>{name}</strong><small>{date}</small></span><div className="history-score"><b>{score}</b><small>/500</small></div><em>{change}</em></div>)}</section><section className="card strategy-card"><span className="mini-icon orange"><Lightbulb size={20} /></span><h3>Chiến thuật đề xuất</h3><p>Đọc toàn bộ đề trong 10 phút đầu. Chốt bài A trước phút 25, sau đó lấy trọn subtask nhỏ ở D và E.</p><div><span>Tốc độ cài đặt</span><strong>7.4/10</strong></div><div><span>Khả năng debug</span><strong>6.2/10</strong></div><button>Tìm hiểu chiến thuật <ArrowRight size={16} /></button></section></div>
  </div>;
}

function LibraryView() {
  return <div className="view inner-view"><div className="page-intro"><p className="eyebrow"><Library size={15} /> HỌC LIỆU TUYỂN CHỌN</p><h1>Một kho học liệu, đúng thứ bạn cần.</h1><p>Tài liệu được đánh giá theo độ tin cậy, độ bám đề và mức độ phù hợp với từng giai đoạn.</p></div>
    <label className="library-search"><Search size={20} /><input placeholder="Tìm giáo trình, chuyên đề, hệ thống chấm..." /></label>
    <div className="resource-grid">{resources.map((resource) => { const Icon = resource.icon; return <article className="resource-card card" key={resource.name}><div className={`resource-icon ${resource.color}`}><Icon size={24} /></div><div className="resource-rating"><span>★</span> {resource.rating}</div><h3>{resource.name}</h3><p>{resource.type}</p><small>{resource.note}</small><button>Mở học liệu <ArrowRight size={16} /></button></article>; })}</div>
    <section className="learning-note card"><div className="note-illustration"><BookOpen size={30} /></div><div><span>NGUYÊN TẮC TỰ HỌC</span><h3>Đọc lời giải không đồng nghĩa với đã hiểu.</h3><p>Hãy tự cài đặt lại, nộp bài và sửa cho đến khi hệ thống báo <b>Accepted</b>. Mỗi lỗi sai là một phần của bài học.</p></div><CheckCircle2 size={34} /></section>
  </div>;
}

function LessonModal({ open, onClose, onComplete }: { open: boolean; onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [answer, setAnswer] = useState<string | null>(null);
  useEffect(() => { if (open) { setStep(1); setAnswer(null); } }, [open]);
  if (!open) return null;
  return <div className="modal-shell" role="dialog" aria-modal="true" aria-label="Bài học tìm kiếm nhị phân"><div className="lesson-modal">
    <header><div><span className="tag primary">BÀI 9 · TÌM KIẾM</span><h2>Binary Search trên kết quả</h2></div><div className="lesson-modal-progress"><span>{step}/3</span><div><i style={{ width: `${step * 33.33}%` }} /></div></div><button onClick={onClose} aria-label="Đóng bài học"><X size={21} /></button></header>
    <div className="lesson-step-tabs"><span className={step >= 1 ? "active" : ""}><i>{step > 1 ? <Check size={13} /> : 1}</i> Khám phá</span><b /><span className={step >= 2 ? "active" : ""}><i>{step > 2 ? <Check size={13} /> : 2}</i> Thử sức</span><b /><span className={step >= 3 ? "active" : ""}><i>3</i> Ghi nhớ</span></div>
    <main>
      {step === 1 && <div className="lesson-content"><p className="lesson-kicker">Ý TƯỞNG CỐT LÕI</p><h3>Đừng tìm đáp án. Hãy hỏi đáp án có khả thi không.</h3><p>Với bài toán chia dãy thành <b>K</b> đoạn sao cho tổng lớn nhất là nhỏ nhất, đáp án nằm trong khoảng:</p><div className="formula-box"><span>max(A)</span><i>≤</i><strong>ĐÁP ÁN</strong><i>≤</i><span>sum(A)</span></div><div className="concept-callout"><Lightbulb size={20} /><p>Nếu chia được với giới hạn <b>X</b>, ta luôn chia được với mọi giới hạn lớn hơn X. Đây chính là <b>tính đơn điệu</b>.</p></div><div className="binary-demo"><div className="number-line">{[8, 12, 16, 20, 24, 28, 32].map((n, i) => <span className={i < 3 ? "no" : i === 3 ? "mid" : "yes"} key={n}>{n}<small>{i < 3 ? "Không" : "Có"}</small></span>)}</div><p>Ranh giới đầu tiên có thể là đáp án nhỏ nhất.</p></div></div>}
      {step === 2 && <div className="lesson-content quiz-content"><p className="lesson-kicker">KIỂM TRA NHANH</p><h3>Với dãy [7, 2, 5, 10, 8] và K = 2, cận tìm kiếm ban đầu nào đúng?</h3><p>Chọn một đáp án để kiểm tra tư duy thiết lập khoảng.</p><div className="answer-grid">{[
        ["A", "left = 0, right = 32"], ["B", "left = 10, right = 32"], ["C", "left = 7, right = 10"], ["D", "left = 2, right = 10"]
      ].map(([key, text]) => <button key={key} className={`${answer === key ? "selected" : ""} ${answer && key === "B" ? "correct" : ""}`} onClick={() => setAnswer(key)}><i>{key}</i><span>{text}</span>{answer && key === "B" && <CheckCircle2 size={19} />}</button>)}</div>{answer && <div className={`answer-feedback ${answer === "B" ? "right" : "wrong"}`}><strong>{answer === "B" ? "Chính xác!" : "Chưa đúng — thử nhìn lại cận dưới."}</strong><span>Cận dưới là phần tử lớn nhất (10), cận trên là tổng dãy (32).</span></div>}</div>}
      {step === 3 && <div className="lesson-content summary-content"><div className="success-orbit"><CheckCircle2 size={44} /></div><p className="lesson-kicker">HOÀN THÀNH BÀI HỌC</p><h3>Bạn đã mở khóa một kỹ thuật quan trọng!</h3><p>Ghi nhớ công thức tư duy 3 bước trước khi chuyển sang bài luyện.</p><div className="summary-steps"><div><i>1</i><span><strong>Tìm khoảng đáp án</strong><small>[min khả thi, max khả thi]</small></span></div><div><i>2</i><span><strong>Viết hàm check(mid)</strong><small>Trả lời Có hoặc Không</small></span></div><div><i>3</i><span><strong>Thu hẹp về ranh giới</strong><small>Đến đáp án tối ưu</small></span></div></div><div className="xp-earned"><Zap size={22} fill="currentColor" /><span>+40 XP</span><small>Kiến thức mới</small></div></div>}
    </main>
    <footer><button className="ghost-button" onClick={step === 1 ? onClose : () => setStep(step - 1)}>{step === 1 ? "Học sau" : "Quay lại"}</button><button className="primary-button" disabled={step === 2 && !answer} onClick={() => { if (step < 3) setStep(step + 1); else { onComplete(); onClose(); } }}>{step === 3 ? "Luyện bài đầu tiên" : "Tiếp tục"}<ArrowRight size={17} /></button></footer>
  </div></div>;
}

function ContestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return <div className="modal-shell" role="dialog" aria-modal="true"><div className="contest-modal"><button className="modal-x" onClick={onClose}><X size={21} /></button><div className="contest-modal-icon"><Trophy size={34} /></div><span className="tag live">PHÒNG CHỜ</span><h2>Sprint #08 mở sau 5 ngày</h2><p>Bạn có thể đăng ký nhắc lịch và làm bài warm-up ngay bây giờ.</p><div className="countdown"><div><strong>05</strong><span>NGÀY</span></div><i>:</i><div><strong>14</strong><span>GIỜ</span></div><i>:</i><div><strong>26</strong><span>PHÚT</span></div></div><button className="primary-button" onClick={onClose}><Bell size={17} /> Đã bật nhắc lịch</button><small>Thông báo trước giờ thi 30 phút</small></div></div>;
}

export default function HomePage() {
  const [active, setActive] = useState<NavKey>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lessonOpen, setLessonOpen] = useState(false);
  const [contestOpen, setContestOpen] = useState(false);
  const [level, setLevel] = useState<Level>("B");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem("tht-active-view") as NavKey | null;
    if (stored && navItems.some((item) => item.id === stored)) setActive(stored);
  }, []);

  const navigate = (key: NavKey) => {
    setActive(key);
    window.localStorage.setItem("tht-active-view", key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const title = useMemo(() => navItems.find((item) => item.id === active)?.label ?? "Tổng quan", [active]);
  const completeLesson = () => { setToast("Tuyệt vời! Bạn đã nhận 40 XP và mở khóa bài luyện mới."); window.setTimeout(() => setToast(""), 4000); navigate("practice"); };

  return <div className="app-shell">
    <Sidebar active={active} onChange={navigate} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    <div className="main-shell"><Topbar onMenu={() => setMobileOpen(true)} title={title} /><main className="main-content">
      {active === "home" && <Dashboard onNavigate={navigate} onLesson={() => setLessonOpen(true)} />}
      {active === "roadmap" && <RoadmapView level={level} setLevel={setLevel} />}
      {active === "practice" && <PracticeView onLesson={() => setLessonOpen(true)} />}
      {active === "contest" && <ContestView onStart={() => setContestOpen(true)} />}
      {active === "library" && <LibraryView />}
    </main></div>
    <nav className="mobile-nav">{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => navigate(item.id)}><Icon size={20} /><span>{item.label.split(" ")[0]}</span></button>; })}</nav>
    <LessonModal open={lessonOpen} onClose={() => setLessonOpen(false)} onComplete={completeLesson} />
    <ContestModal open={contestOpen} onClose={() => setContestOpen(false)} />
    {toast && <div className="toast"><CheckCircle2 size={19} /><span>{toast}</span><button onClick={() => setToast("")}><X size={16} /></button></div>}
  </div>;
}
