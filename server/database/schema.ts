import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull().default(''),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const groups = sqliteTable("groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  admin: text("admin").references(() => users.id),
});

export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  group: integer("group").references(() => groups.id).notNull(),
  user: text("user").references(() => users.id).notNull(),
  role: text("role").notNull().default('member'),
});

export const matches = sqliteTable("matches", {
  id: integer('id').primaryKey().notNull().unique(),
  date: text('date').notNull(),
  dateUTC: text('date_utc').notNull(),
  locationId: integer('location_id'),
  finished: integer('finished').notNull().default(0),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const invites = sqliteTable('invites', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  group: integer('group').references(() => groups.id).notNull(),
  by: text('by').notNull().references(() => users.id),
  user: text('user').notNull(),
  status: integer('status').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  respondedAt: text('responded_at'),
})

export const predictions = sqliteTable("predictions", {
  id: integer('id').primaryKey().notNull().unique(),
  match: integer('match').references(() => matches.id).notNull(),
  user: text('user').references(() => users.id).notNull(),
  group: integer('group').references(() => groups.id).notNull(),
  team1Id: integer('team1_id').notNull(),
  team1Name: text('team1_name').notNull(),
  team1Score: integer('team1_score').notNull(),
  team2Id: integer('team2_id').notNull(),
  team2Name: text('team2_name').notNull(),
  team2Score: integer('team2_score').notNull(),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const scores = sqliteTable("scores", {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user: text('user').references(() => users.id).notNull(),
  group: integer('groups').references(() => groups.id).notNull(),
  points: integer('points').notNull().default(0),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})
