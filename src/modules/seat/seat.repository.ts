import { db } from "../../db/connection";
import { seats } from "../../db/schema/seats";
import { eq } from "drizzle-orm";
import { SeatData } from "./seat.types";

export const bulkCreate = async (seatData: SeatData[]) => {
  return await db.insert(seats).values(seatData).returning();
};

export const findByScreenId = async (screenId: string) => {
  return await db.select().from(seats).where(eq(seats.screenId, screenId));
};
