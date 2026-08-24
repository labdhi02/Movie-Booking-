import { z } from "zod";

export const createShowtimeSchema = z
  .object({
    movieId: z.string().uuid("Movie ID must be a valid UUID"),
    screenId: z.string().uuid("Screen ID must be a valid UUID"),
    startTime: z
      .string()
      .datetime("Start time must be a valid ISO 8601 datetime"),
    endTime: z.string().datetime("End time must be a valid ISO 8601 datetime"),
    status: z
      .enum(["scheduled", "ongoing", "completed", "cancelled"])
      .optional(),
  })
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: "Start time must be before end time",
    path: ["startTime"],
  });

export const updateShowtimeSchema = z
  .object({
    movieId: z.string().uuid("Movie ID must be a valid UUID").optional(),
    screenId: z.string().uuid("Screen ID must be a valid UUID").optional(),
    startTime: z
      .string()
      .datetime("Start time must be a valid ISO 8601 datetime")
      .optional(),
    endTime: z
      .string()
      .datetime("End time must be a valid ISO 8601 datetime")
      .optional(),
    status: z
      .enum(["scheduled", "ongoing", "completed", "cancelled"])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return new Date(data.startTime) < new Date(data.endTime);
      }
      return true;
    },
    {
      message: "Start time must be before end time",
      path: ["startTime"],
    },
  );

export const getShowtimesQuerySchema = z.object({
  movieId: z.string().uuid().optional(),
  theaterId: z.string().uuid().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});
