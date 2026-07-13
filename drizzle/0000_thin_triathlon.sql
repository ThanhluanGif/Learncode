CREATE TABLE `content_sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`provider` text NOT NULL,
	`source_type` text NOT NULL,
	`url` text NOT NULL,
	`is_official` integer DEFAULT false NOT NULL,
	`year_from` integer,
	`year_to` integer,
	`usage_policy` text DEFAULT 'link_only' NOT NULL,
	`verified_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_sources_slug_unique` ON `content_sources` (`slug`);--> statement-breakpoint
CREATE INDEX `content_sources_official_idx` ON `content_sources` (`is_official`);--> statement-breakpoint
CREATE TABLE `exam_papers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_id` integer NOT NULL,
	`external_id` text NOT NULL,
	`year` integer NOT NULL,
	`title` text NOT NULL,
	`round` text NOT NULL,
	`division` text NOT NULL,
	`duration_minutes` integer,
	`total_points` integer,
	`official_url` text NOT NULL,
	`source_status` text DEFAULT 'verified' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `content_sources`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exam_papers_source_external_unique` ON `exam_papers` (`source_id`,`external_id`);--> statement-breakpoint
CREATE INDEX `exam_papers_year_division_idx` ON `exam_papers` (`year`,`division`);--> statement-breakpoint
CREATE TABLE `learners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`display_name` text NOT NULL,
	`division` text DEFAULT 'B' NOT NULL,
	`school_level` text DEFAULT 'THCS' NOT NULL,
	`xp` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `learning_reflections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`learner_id` integer NOT NULL,
	`study_session_id` integer,
	`problem_id` integer,
	`success_note` text DEFAULT '' NOT NULL,
	`error_note` text DEFAULT '' NOT NULL,
	`next_action` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`study_session_id`) REFERENCES `study_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `learning_reflections_learner_idx` ON `learning_reflections` (`learner_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `learning_reflections_session_idx` ON `learning_reflections` (`study_session_id`);--> statement-breakpoint
CREATE TABLE `problem_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`learner_id` integer NOT NULL,
	`study_session_id` integer,
	`problem_id` integer NOT NULL,
	`status` text DEFAULT 'attempted' NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`language` text DEFAULT 'C++' NOT NULL,
	`confidence` integer DEFAULT 3 NOT NULL,
	`time_spent_seconds` integer DEFAULT 0 NOT NULL,
	`submitted_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`study_session_id`) REFERENCES `study_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `problem_attempts_learner_problem_idx` ON `problem_attempts` (`learner_id`,`problem_id`);--> statement-breakpoint
CREATE INDEX `problem_attempts_session_idx` ON `problem_attempts` (`study_session_id`);--> statement-breakpoint
CREATE TABLE `problems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_id` integer NOT NULL,
	`exam_paper_id` integer,
	`external_id` text NOT NULL,
	`title` text NOT NULL,
	`division` text NOT NULL,
	`topics_json` text DEFAULT '[]' NOT NULL,
	`difficulty` text DEFAULT 'Chưa phân loại' NOT NULL,
	`points` integer DEFAULT 100 NOT NULL,
	`time_limit_ms` integer,
	`official_url` text NOT NULL,
	`short_description` text DEFAULT '' NOT NULL,
	`source_metadata_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `content_sources`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`exam_paper_id`) REFERENCES `exam_papers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `problems_source_external_unique` ON `problems` (`source_id`,`external_id`);--> statement-breakpoint
CREATE INDEX `problems_exam_idx` ON `problems` (`exam_paper_id`);--> statement-breakpoint
CREATE INDEX `problems_division_idx` ON `problems` (`division`);--> statement-breakpoint
CREATE TABLE `saved_problems` (
	`learner_id` integer NOT NULL,
	`problem_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `saved_problems_learner_problem_unique` ON `saved_problems` (`learner_id`,`problem_id`);--> statement-breakpoint
CREATE TABLE `study_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`learner_id` integer NOT NULL,
	`exam_paper_id` integer,
	`mode` text DEFAULT 'exam' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`target_minutes` integer DEFAULT 150 NOT NULL,
	`score` integer,
	`started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`paused_at` text,
	`completed_at` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exam_paper_id`) REFERENCES `exam_papers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `study_sessions_learner_status_idx` ON `study_sessions` (`learner_id`,`status`);--> statement-breakpoint
CREATE INDEX `study_sessions_exam_idx` ON `study_sessions` (`exam_paper_id`);
--> statement-breakpoint
INSERT OR IGNORE INTO `learners` (`id`, `display_name`, `division`, `school_level`, `xp`) VALUES
  (1, 'Minh Nhật', 'B', 'THCS', 1280);
--> statement-breakpoint
INSERT OR IGNORE INTO `content_sources` (`id`, `slug`, `title`, `provider`, `source_type`, `url`, `is_official`, `year_from`, `year_to`, `usage_policy`, `verified_at`) VALUES
  (1, 'tinhoctre-official-problems', 'Kho bài chính thức Tin học trẻ', 'Trung tâm Phát triển Khoa học, Công nghệ và Tài năng trẻ', 'online_judge', 'https://tinhoctre.vn/problems/', 1, 2016, 2025, 'metadata_and_deep_link', '2026-07-13'),
  (2, 'tht-2025-qualifier-round-3-b', 'Vòng loại Quốc gia đợt 3 – Thi thử – Bảng B', 'Ban Tổ chức Hội thi Tin học trẻ toàn quốc', 'contest', 'https://tinhoctre.vn/contest/tht2025_vongloaiqgdot3_thithu_b', 1, 2025, 2025, 'metadata_and_deep_link', '2026-07-13'),
  (3, 'tht-2022-national-qualifier-a-pdf', 'Đề vòng sơ khảo Quốc gia 2022 – Bảng A', 'Ban Tổ chức Hội thi Tin học trẻ toàn quốc', 'official_pdf', 'https://tinhoctre.vn/pdf/1ac89a8d-7f75-4c96-b6ef-3c51214fe345.pdf', 1, 2022, 2022, 'link_only', '2026-07-13');
--> statement-breakpoint
INSERT OR IGNORE INTO `exam_papers` (`id`, `source_id`, `external_id`, `year`, `title`, `round`, `division`, `duration_minutes`, `total_points`, `official_url`, `source_status`) VALUES
  (1, 2, 'tht2025_vongloaiqgdot3_thithu_b', 2025, 'Tin học trẻ 2025 – Vòng loại Quốc gia đợt 3 – Thi thử', 'Vòng loại Quốc gia đợt 3', 'B', 120, NULL, 'https://tinhoctre.vn/contest/tht2025_vongloaiqgdot3_thithu_b', 'verified'),
  (2, 3, 'tht2022_sokhao_a', 2022, 'Đề thi vòng sơ khảo Quốc gia 2022 – Bảng A', 'Vòng sơ khảo Quốc gia', 'A', 90, 400, 'https://tinhoctre.vn/pdf/1ac89a8d-7f75-4c96-b6ef-3c51214fe345.pdf', 'verified');
--> statement-breakpoint
INSERT OR IGNORE INTO `problems` (`id`, `source_id`, `exam_paper_id`, `external_id`, `title`, `division`, `topics_json`, `difficulty`, `points`, `time_limit_ms`, `official_url`, `short_description`, `source_metadata_json`) VALUES
  (1, 1, 2, 'tht2022a_vebanhsinhnhat', 'Vẽ bánh sinh nhật', 'A', '["Scratch","Hình học","Mô phỏng"]', 'Vừa', 100, NULL, 'https://tinhoctre.vn/problem/tht2022a_vebanhsinhnhat', 'Vẽ bánh sinh nhật cấp N từ các hình vuông cơ sở theo quy luật của đề chính thức.', '{"source":"official_pdf","order":1,"judging":"manual"}'),
  (2, 1, 2, 'tht2022a_phansonhonhat', 'Phân số nhỏ nhất', 'A', '["Số học","Phân số","ƯCLN"]', 'Dễ', 100, 1000, 'https://tinhoctre.vn/problem/tht2022a_phansonhonhat', 'Tạo phân số nhỏ nhất từ ba số tự nhiên và đưa kết quả về dạng tối giản.', '{"source":"official_pdf","order":2,"acceptance_rate":35.7}'),
  (3, 1, 2, 'tht2022a_tinhtongdayso', 'Tính tổng dãy số', 'A', '["Dãy số","Vòng lặp","Số học"]', 'Dễ', 100, 1000, 'https://tinhoctre.vn/problem/tht2022a_tinhtongdayso', 'Tính tổng một dãy số theo quy luật của đề sơ khảo Quốc gia.', '{"source":"official_pdf","order":3,"acceptance_rate":22.2}'),
  (4, 1, 2, 'tht2022a_thaydoichuso', 'Thay đổi chữ số', 'A', '["Chữ số","Xử lý số","Tham lam"]', 'Vừa', 100, 1000, 'https://tinhoctre.vn/problem/tht2022a_thaydoichuso', 'Biến đổi các chữ số của một số theo ràng buộc của đề thi chính thức.', '{"source":"official_pdf","order":4,"acceptance_rate":19.7}'),
  (5, 1, NULL, 'tht2022_biendoixau', 'Biến đổi xâu', 'B/C', '["Xâu ký tự","Mô phỏng"]', 'Khó', 100, NULL, 'https://tinhoctre.vn/problem/tht2022_biendoixau', 'Bài toán xử lý và biến đổi xâu được lưu trong kho bài chính thức.', '{"source_group":"Sơ khảo","acceptance_rate":1.8}'),
  (6, 1, NULL, 'tht2022_matran', 'Ma trận', 'B/C', '["Ma trận","Mảng hai chiều"]', 'Khó', 100, NULL, 'https://tinhoctre.vn/problem/tht2022_matran', 'Bài toán ma trận từ nhóm đề sơ khảo trên hệ thống chính thức.', '{"source_group":"Sơ khảo","acceptance_rate":5.2}'),
  (7, 1, NULL, 'tht2022_bangkitu', 'Bảng kí tự', 'B/C', '["Xâu ký tự","Ma trận"]', 'Khó', 100, NULL, 'https://tinhoctre.vn/problem/tht2022_bangkitu', 'Bài toán bảng kí tự từ nhóm đề sơ khảo trên hệ thống chính thức.', '{"source_group":"Sơ khảo","acceptance_rate":4.7}'),
  (8, 1, NULL, 'tht2022_daycapsonhan', 'Dãy cấp số nhân', 'B/C', '["Dãy số","Số học"]', 'Khó', 100, NULL, 'https://tinhoctre.vn/problem/tht2022_daycapsonhan', 'Bài toán dãy cấp số nhân từ nhóm đề sơ khảo trên hệ thống chính thức.', '{"source_group":"Sơ khảo","acceptance_rate":6.1}'),
  (9, 1, NULL, 'tht2022_catghepxau', 'Cắt ghép xâu', 'B/C', '["Xâu ký tự","Tham lam"]', 'Rất khó', 100, NULL, 'https://tinhoctre.vn/problem/tht2022_catghepxau', 'Bài toán cắt ghép xâu từ nhóm đề sơ khảo trên hệ thống chính thức.', '{"source_group":"Sơ khảo","acceptance_rate":0.0}');
