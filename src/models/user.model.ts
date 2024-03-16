import { pgTable, uuid, boolean, char, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email').notNull().unique(),
  password: char('password', { length: 32 }).notNull(),
  p1Name: varchar('u1Name').notNull(),
  p2Name: varchar('u2Name'),
  isAdmin: boolean('is_admin').notNull().default(false),
});
