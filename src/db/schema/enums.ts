import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const seatTypeEnum = pgEnum('seat_type', ['regular', 'premium', 'recliner']);
export const showtimeStatusEnum = pgEnum('showtime_status', ['scheduled', 'ongoing', 'completed', 'cancelled']);
export const reservationStatusEnum = pgEnum('reservation_status', ['held', 'confirmed', 'cancelled', 'expired']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']);
