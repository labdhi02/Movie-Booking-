import { findById as findScreenById } from "../screen/screen.repository";
import { bulkCreate, findByScreenId } from "./seat.repository";
import { NotFoundError, ConflictError } from "../../errors/custom-errors";
import { BulkCreateSeatsData, SeatData, SeatPosition } from "./seat.types";

const generateSeatGrid = (
  screenId: string,
  rows: string[],
  columnsPerRow: number,
  premiumSeats: SeatPosition[] = [],
  reclinerSeats: SeatPosition[] = [],
): SeatData[] => {
  const seatGrid: SeatData[] = [];

  for (const row of rows) {
    for (let column = 1; column <= columnsPerRow; column++) {
      const seatType = determineSeatType(
        row,
        column,
        premiumSeats,
        reclinerSeats,
      );

      seatGrid.push({
        screenId,
        row,
        column,
        seatType,
      });
    }
  }

  return seatGrid;
};

const determineSeatType = (
  row: string,
  column: number,
  premiumSeats: SeatPosition[],
  reclinerSeats: SeatPosition[],
): "regular" | "premium" | "recliner" => {
  if (reclinerSeats.some((pos) => pos.row === row && pos.column === column)) {
    return "recliner";
  }

  if (premiumSeats.some((pos) => pos.row === row && pos.column === column)) {
    return "premium";
  }

  return "regular";
};

export const bulkCreateSeats = async (
  screenId: string,
  data: BulkCreateSeatsData,
) => {
  const screen = await findScreenById(screenId);
  if (!screen) {
    throw new NotFoundError("Screen not found");
  }

  const existingSeats = await findByScreenId(screenId);
  if (existingSeats.length > 0) {
    throw new ConflictError("Seats already exist for this screen");
  }
  const seatGrid = generateSeatGrid(
    screenId,
    data.rows,
    data.columnsPerRow,
    data.premiumSeats,
    data.reclinerSeats,
  );
  return await bulkCreate(seatGrid);
};
