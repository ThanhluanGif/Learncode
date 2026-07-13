CREATE TABLE IF NOT EXISTS `content_sources` (
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
CREATE UNIQUE INDEX IF NOT EXISTS `content_sources_slug_unique` ON `content_sources` (`slug`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `content_sources_official_idx` ON `content_sources` (`is_official`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `exam_papers` (
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
CREATE UNIQUE INDEX IF NOT EXISTS `exam_papers_source_external_unique` ON `exam_papers` (`source_id`,`external_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `exam_papers_year_division_idx` ON `exam_papers` (`year`,`division`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `learners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`display_name` text NOT NULL,
	`division` text DEFAULT 'B' NOT NULL,
	`school_level` text DEFAULT 'THCS' NOT NULL,
	`xp` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `learning_reflections` (
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
CREATE INDEX IF NOT EXISTS `learning_reflections_learner_idx` ON `learning_reflections` (`learner_id`,`created_at`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `learning_reflections_session_idx` ON `learning_reflections` (`study_session_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `problem_attempts` (
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
CREATE INDEX IF NOT EXISTS `problem_attempts_learner_problem_idx` ON `problem_attempts` (`learner_id`,`problem_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `problem_attempts_session_idx` ON `problem_attempts` (`study_session_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `problems` (
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
CREATE UNIQUE INDEX IF NOT EXISTS `problems_source_external_unique` ON `problems` (`source_id`,`external_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `problems_exam_idx` ON `problems` (`exam_paper_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `problems_division_idx` ON `problems` (`division`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `saved_problems` (
	`learner_id` integer NOT NULL,
	`problem_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `saved_problems_learner_problem_unique` ON `saved_problems` (`learner_id`,`problem_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `study_sessions` (
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
CREATE INDEX IF NOT EXISTS `study_sessions_learner_status_idx` ON `study_sessions` (`learner_id`,`status`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `study_sessions_exam_idx` ON `study_sessions` (`exam_paper_id`);
