import { z } from "zod";

export const getSeatsParamsSchema = z.object({
  id: z.string().uuid("Showtime ID must be a valid UUID"),
});

export type GetSeatsParams = z.infer<typeof getSeatsParamsSchema>;
