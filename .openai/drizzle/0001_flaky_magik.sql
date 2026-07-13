ALTER TABLE `learners` ADD `email` text;--> statement-breakpoint
CREATE UNIQUE INDEX `learners_email_unique` ON `learners` (`email`);