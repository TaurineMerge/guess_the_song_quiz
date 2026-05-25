import { pgTable, varchar, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  userId: uuid('user_id').primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
});
