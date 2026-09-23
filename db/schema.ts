import { sql } from 'drizzle-orm';
import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
}, (table) => [uniqueIndex('idx_categories_slug').on(table.slug)]);

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description').notNull().default(''),
  grade: text('grade').notNull(),
  scale: text('scale').notNull(),
  price: real('price').notNull(),
  stock: integer('stock').notNull().default(0),
  imageUrl: text('image_url').notNull().default('/mecha-hero.png'),
  imagePosition: text('image_position').notNull().default('center'),
  categoryId: integer('category_id').references(() => categories.id),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => [uniqueIndex('idx_products_slug').on(table.slug), index('idx_products_active_grade').on(table.active, table.grade), index('idx_products_category_id').on(table.categoryId)]);

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderNumber: text('order_number').notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  status: text('status', { enum: ['pending', 'paid', 'packing', 'shipped', 'complete', 'cancelled'] }).notNull().default('pending'),
  total: real('total').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => [uniqueIndex('idx_orders_order_number').on(table.orderNumber), index('idx_orders_status').on(table.status), index('idx_orders_customer_email').on(table.customerEmail)]);

export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull().references(() => products.id),
  productName: text('product_name').notNull(),
  price: real('price').notNull(),
  quantity: integer('quantity').notNull(),
}, (table) => [index('idx_order_items_order_id').on(table.orderId)]);
