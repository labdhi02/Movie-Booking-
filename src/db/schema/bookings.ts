import { pgTable, uuid, varchar, numeric, timestamp, unique } from 'drizzle-orm/pg-core';
import { showtimes } from './showtimes';
import { paymentStatusEnum } from './enums';

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  showtimeId: uuid('showtime_id')
    .notNull()
    .references(() => showtimes.id, { onDelete: 'restrict' }),
  
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(), 
  paymentStatus: paymentStatusEnum('payment_status').notNull().default('pending'),
  paymentGatewayId: varchar('payment_gateway_id', { length: 255 }),
  
  bookingReference: varchar('booking_reference', { length: 50 }),
  completedAt: timestamp('completed_at'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueBookingReference: unique('bookings_reference_unique').on(table.bookingReference),
}));
