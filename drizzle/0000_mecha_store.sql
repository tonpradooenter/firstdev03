CREATE TABLE `categories` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_categories_slug` ON `categories` (`slug`);
--> statement-breakpoint
CREATE TABLE `products` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `description` text DEFAULT '' NOT NULL,
  `grade` text NOT NULL,
  `scale` text NOT NULL,
  `price` real NOT NULL,
  `stock` integer DEFAULT 0 NOT NULL,
  `image_url` text DEFAULT '/mecha-hero.png' NOT NULL,
  `image_position` text DEFAULT 'center' NOT NULL,
  `category_id` integer,
  `featured` integer DEFAULT false NOT NULL,
  `active` integer DEFAULT true NOT NULL,
  `created_at` integer DEFAULT (unixepoch()) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch()) NOT NULL,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_products_slug` ON `products` (`slug`);
--> statement-breakpoint
CREATE INDEX `idx_products_active_grade` ON `products` (`active`,`grade`);
--> statement-breakpoint
CREATE INDEX `idx_products_category_id` ON `products` (`category_id`);
--> statement-breakpoint
CREATE TABLE `orders` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `order_number` text NOT NULL,
  `customer_name` text NOT NULL,
  `customer_email` text NOT NULL,
  `customer_phone` text NOT NULL,
  `shipping_address` text NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `total` real NOT NULL,
  `created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_orders_order_number` ON `orders` (`order_number`);
--> statement-breakpoint
CREATE INDEX `idx_orders_status` ON `orders` (`status`);
--> statement-breakpoint
CREATE INDEX `idx_orders_customer_email` ON `orders` (`customer_email`);
--> statement-breakpoint
CREATE TABLE `order_items` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `order_id` integer NOT NULL,
  `product_id` integer NOT NULL,
  `product_name` text NOT NULL,
  `price` real NOT NULL,
  `quantity` integer NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_order_items_order_id` ON `order_items` (`order_id`);
--> statement-breakpoint
PRAGMA optimize;
