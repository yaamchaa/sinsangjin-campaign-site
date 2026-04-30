CREATE TABLE `news_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` enum('press','interview','media','video') NOT NULL DEFAULT 'press',
	`title` varchar(300) NOT NULL,
	`summary` text NOT NULL,
	`source` varchar(100) NOT NULL,
	`publishedAt` timestamp NOT NULL,
	`link` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `news_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`authorName` varchar(100) NOT NULL,
	`district` enum('sujeong','jungwon','bundang','etc') NOT NULL DEFAULT 'etc',
	`category` enum('welfare','transport','redev','education','economy','etc') NOT NULL DEFAULT 'etc',
	`title` varchar(200) NOT NULL,
	`content` text NOT NULL,
	`status` enum('pending','reviewing','answered') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `proposals_id` PRIMARY KEY(`id`)
);
