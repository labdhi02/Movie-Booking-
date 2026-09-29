import { NotFoundError } from "../../errors/custom-errors";
import {
  findShowtimeById,
  getSeatsWithReservations,
} from "./seat-map.repository";
import { SeatWithStatus } from "./seat-map.types";

export const deriveSeatStatus = (
  reservation: { status: "held" | "confirmed"; expiresAt: Date | null } | null,
  currentTime: Date,
): "available" | "held" | "booked" => {
  if (!reservation) {
    return "available";
  }

  if (reservation.status === "confirmed") {
    return "booked";
  }

  if (reservation.status === "held") {
    if (!reservation.expiresAt || reservation.expiresAt > currentTime) {
      return "held";
    }
    return "available";
  }
  return "available";
};

export const getSeatsForShowtime = async (
  showtimeId: string,
): Promise<SeatWithStatus[]> => {
  const showtime = await findShowtimeById(showtimeId);

  if (!showtime) {
    throw new NotFoundError("Showtime not found");
  }
  const seatsWithReservations = await getSeatsWithReservations(
    showtimeId,
    showtime.screenId,
  );

  const currentTime = new Date();

  const seatsWithStatus: SeatWithStatus[] = seatsWithReservations.map(
    (seat) => ({
      id: seat.id,
      row: seat.row,
      column: seat.column,
      seatType: seat.seatType,
      status: deriveSeatStatus(seat.reservation, currentTime),
    }),
  );

  return seatsWithStatus;
};
