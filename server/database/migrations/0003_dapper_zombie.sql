CREATE TABLE `answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` integer,
	`user` text,
	`group` integer,
	`answer` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`question`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`group`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text DEFAULT '' NOT NULL,
	`answer` text DEFAULT '' NOT NULL
);
