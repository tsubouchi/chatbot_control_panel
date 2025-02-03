import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

export const personalities = pgTable("personalities", {
  id: serial("id").primaryKey(),
  empathy: integer("empathy").notNull(),
  creativity: integer("creativity").notNull(),
  logic: integer("logic").notNull(),
  curiosity: integer("curiosity").notNull(),
  confidence: integer("confidence").notNull(),
  traits: text("traits"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPersonalitySchema = createInsertSchema(personalities);
export const selectPersonalitySchema = createSelectSchema(personalities);
export type Personality = typeof personalities.$inferSelect;
export type InsertPersonality = typeof personalities.$inferInsert;
