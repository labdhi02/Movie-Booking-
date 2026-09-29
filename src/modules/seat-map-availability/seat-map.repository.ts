import { db } from '../../db/connection';
import { showtimes } from '../../db/schema/showtimes';
import { seats } from '../../db/schema/seats';
import { seatReservations } from '../../db/schema/seat-reservations';
import { eq, and, inArray, asc } from 'drizzle-orm';
import { Showtime, SeatWithReservationData } from './seat-map.types';


export const findShowtimeById = async (
  showtimeId: string
): Promise<Showtime | null> => {
  const [showtime] = await db
    .select({
      id: showtimes.id,
      screenId: showtimes.screenId,
      startTime: showtimes.startTime,
      endTime: showtimes.endTime,
    })
    .from(showtimes)
    .where(eq(showtimes.id, showtimeId));

  return showtime || null;
};

export const getSeatsWithReservations = async (
  showtimeId: string,
  screenId: string
): Promise<SeatWithReservationData[]> => {
  const results = await db
    .select({
      id: seats.id,
      row: seats.row,
      column: seats.column,
      seatType: seats.seatType,
      reservationStatus: seatReservations.status,
      reservationExpiresAt: seatReservations.expiresAt,
    })
    .from(seats)
    .leftJoin(
      seatReservations,
      and(
        eq(seats.id, seatReservations.seatId),
        eq(seatReservations.showtimeId, showtimeId),
        inArray(seatReservations.status, ['held', 'confirmed'])
      )
    )
    .where(eq(seats.screenId, screenId))
    .orderBy(asc(seats.row), asc(seats.column));

  return results.map((row) => ({
    id: row.id,
    row: row.row,
    column: row.column,
    seatType: row.seatType as 'regular' | 'premium' | 'recliner',
    reservation: row.reservationStatus
      ? {
          status: row.reservationStatus as 'held' | 'confirmed',
          expiresAt: row.reservationExpiresAt,
        }
      : null,
  }));
};
