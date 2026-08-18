import { z } from 'zod';

export const createMovieSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(500, 'Title must not exceed 500 characters'),
  durationMinutes: z
    .number()
    .int('Duration must be an integer')
    .min(1, 'Duration must be at least 1 minute')
    .max(600, 'Duration must not exceed 600 minutes'),
  genres: z
    .array(z.string().max(255, 'Genre must not exceed 255 characters'))
    .max(50, 'Cannot exceed 50 genres')
    .optional(),
  actors: z
    .array(z.string().max(255, 'Actor name must not exceed 255 characters'))
    .max(50, 'Cannot exceed 50 actors')
    .optional(),
  rating: z
    .string()
    .max(10, 'Rating must not exceed 10 characters')
    .optional(),
  description: z
    .string()
    .optional(),
  releaseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Release date must be in YYYY-MM-DD format')
    .optional(),
});

export const updateMovieSchema = z.object({
  title: z
    .string()
    .min(1, 'Title must not be empty')
    .max(500, 'Title must not exceed 500 characters')
    .optional(),
  durationMinutes: z
    .number()
    .int('Duration must be an integer')
    .min(1, 'Duration must be at least 1 minute')
    .max(600, 'Duration must not exceed 600 minutes')
    .optional(),
  genres: z
    .array(z.string().max(255, 'Genre must not exceed 255 characters'))
    .max(50, 'Cannot exceed 50 genres')
    .optional(),
  actors: z
    .array(z.string().max(255, 'Actor name must not exceed 255 characters'))
    .max(50, 'Cannot exceed 50 actors')
    .optional(),
  rating: z
    .string()
    .max(10, 'Rating must not exceed 10 characters')
    .optional(),
  description: z
    .string()
    .optional(),
  releaseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Release date must be in YYYY-MM-DD format')
    .optional(),
});
