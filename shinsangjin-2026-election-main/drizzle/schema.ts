import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 시민의 목소리 - 정책 제안 / 시민 제보
 */
export const proposals = mysqlTable("proposals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  authorName: varchar("authorName", { length: 100 }).notNull(),
  district: mysqlEnum("district", ["sujeong", "jungwon", "bundang", "etc"]).default("etc").notNull(),
  category: mysqlEnum("category", ["welfare", "transport", "redev", "education", "economy", "etc"]).default("etc").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["pending", "reviewing", "answered"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = typeof proposals.$inferInsert;

/**
 * 뉴스룸 - 보도자료 및 언론 기사
 */
export const newsItems = mysqlTable("news_items", {
  id: int("id").autoincrement().primaryKey(),
  category: mysqlEnum("category", ["press", "interview", "media", "video"]).default("press").notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  summary: text("summary").notNull(),
  source: varchar("source", { length: 100 }).notNull(),
  publishedAt: timestamp("publishedAt").notNull(),
  link: varchar("link", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NewsItem = typeof newsItems.$inferSelect;
export type InsertNewsItem = typeof newsItems.$inferInsert;
