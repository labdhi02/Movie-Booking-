import { z } from 'zod';

const seatPositionSchema = z.object({
  row: z.string().min(1, 'Row is required').max(10, 'Row must not exceed 10 characters'),
  column: z.number().int('Column must be an integer').min(1, 'Column must be at least 1'),
});

export const bulkCreateSeatsSchema = z.object({
  rows: z
    .array(z.string().min(1, 'Row label is required').max(10, 'Row label must not exceed 10 characters'))
    .min(1, 'At least one row is required')
    .max(50, 'Cannot exceed 50 rows'),
  columnsPerRow: z
    .number()
    .int('Columns per row must be an integer')
    .min(1, 'At least 1 column required')
    .max(100, 'Cannot exceed 100 columns per row'),
  premiumSeats: z.array(seatPositionSchema).optional(),
  reclinerSeats: z.array(seatPositionSchema).optional(),
});
