CREATE TABLE `pilot_feedback` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`learner_id` integer NOT NULL,
	`role` text NOT NULL,
	`rating` integer NOT NULL,
	`completed_cycle` integer NOT NULL,
	`minutes_spent` integer NOT NULL,
	`comment` text DEFAULT '' NOT NULL,
	`submitted_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pilot_feedback_learner_idx` ON `pilot_feedback` (`learner_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `pilot_feedback_learner_unique` ON `pilot_feedback` (`learner_id`);--> statement-breakpoint
ALTER TABLE `learning_reflections` ADD `cause_note` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `learning_reflections` ADD `solution_note` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `learning_reflections` ADD `review_at` text;