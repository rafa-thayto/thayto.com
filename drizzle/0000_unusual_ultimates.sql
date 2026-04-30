CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`english_title` text NOT NULL,
	`author` text NOT NULL,
	`cover_url` text DEFAULT '' NOT NULL,
	`amazon_url` text,
	`status` text DEFAULT 'WILL_READ' NOT NULL,
	`stars` integer,
	`love` integer,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `books_status_idx` ON `books` (`status`);--> statement-breakpoint
CREATE INDEX `books_created_at_idx` ON `books` (`created_at`);--> statement-breakpoint
CREATE INDEX `books_love_idx` ON `books` (`love`);