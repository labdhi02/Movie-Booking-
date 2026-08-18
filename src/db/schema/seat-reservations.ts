import { pgTable, uuid, varchar, timestamp, uniqueIndex, check, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { showtimes } from './showtimes';
import { seats } from './seats';
import { bookings } from './bookings';
import { reservationStatusEnum } from './enums';

export const seatReservations = pgTable(
  'seat_reservations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    showtimeId: uuid('showtime_id')
      .notNull()
      .references(() => showtimes.id, { onDelete: 'cascade' }),
    seatId: uuid('seat_id')
      .notNull()
      .references(() => seats.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 255 }).notNull(),
    status: reservationStatusEnum('status').notNull(),
    bookingId: uuid('booking_id').references(() => bookings.id, { onDelete: 'set null' }),
    expiresAt: timestamp('expires_at'), 
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    uniqueActiveSeat: uniqueIndex('seat_reservations_active_seat_unique')
      .on(table.showtimeId, table.seatId)
      .where(sql`${table.status} IN ('held', 'confirmed')`),

    bookingIdIndex: index('seat_reservations_booking_id_idx').on(table.bookingId),
    
    heldStatusConsistency: check(
      'held_status_consistency',
      sql`(${table.status} = 'held' AND ${table.expiresAt} IS NOT NULL AND ${table.bookingId} IS NULL) OR ${table.status} != 'held'`
    ),
    
    confirmedStatusConsistency: check(
      'confirmed_status_consistency',
      sql`(${table.status} = 'confirmed' AND ${table.bookingId} IS NOT NULL) OR ${table.status} != 'confirmed'`
    ),
  })
);
