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

const uuidSchema = z.string().uuid();
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const showtimeFilterQuerySchema = z
  .object({
    movieId: uuidSchema.optional(),
    theaterId: uuidSchema.optional(),
    date: dateSchema.optional(),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),

    cursor: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .refine(
    (data) => {
      if (data.date && (data.startDate || data.endDate)) {
        return false;
      }
      return true;
    },
    {
      message:
        'Cannot use both "date" and date range parameters (startDate/endDate)',
    },
  )
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    { message: "startDate must be before or equal to endDate" },
  );

export type ShowtimeFilterQuery = z.infer<typeof showtimeFilterQuerySchema>;
