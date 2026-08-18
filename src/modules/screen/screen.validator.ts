import { z } from 'zod';

export const createScreenSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must not exceed 255 characters'),
  screenNumber: z
    .number()
    .int('Screen number must be an integer')
    .min(1, 'Screen number must be at least 1')
    .max(50, 'Screen number must not exceed 50'),
  totalSeats: z
    .number()
    .int('Total seats must be an integer')
    .min(1, 'Total seats must be at least 1')
    .max(1000, 'Total seats must not exceed 1000'),
});

export const updateScreenSchema = z.object({
  name: z
    .string()
    .min(1, 'Name must not be empty')
    .max(255, 'Name must not exceed 255 characters')
    .optional(),
  screenNumber: z
    .number()
    .int('Screen number must be an integer')
    .min(1, 'Screen number must be at least 1')
    .max(50, 'Screen number must not exceed 50')
    .optional(),
  totalSeats: z
    .number()
    .int('Total seats must be an integer')
    .min(1, 'Total seats must be at least 1')
    .max(1000, 'Total seats must not exceed 1000')
    .optional(),
});
