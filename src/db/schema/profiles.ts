import { pgTable, uuid, text, timestamp, pgSchema } from 'drizzle-orm/pg-core';
import { userRoleEnum } from './enums';

const authSchema = pgSchema('auth');

export const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id')
    .primaryKey()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: userRoleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

