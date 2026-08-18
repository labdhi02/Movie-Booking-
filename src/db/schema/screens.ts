import { pgTable, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { theaters } from './theaters';
import { seats } from './seats';

export const screens = pgTable('screens', {
  id: uuid('id').primaryKey().defaultRandom(),
  theaterId: uuid('theater_id')
    .notNull()
    .references(() => theaters.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  screenNumber: integer('screen_number').notNull(),
  totalSeats: integer('total_seats').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const screensRelations = relations(screens, ({ one, many }) => ({
  theater: one(theaters, {
    fields: [screens.theaterId],
    references: [theaters.id],
  }),
  seats: many(seats),
}));
