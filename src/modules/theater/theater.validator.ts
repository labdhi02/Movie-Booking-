import { z } from 'zod';

export const createTheaterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must not exceed 255 characters'),
  location: z.string().min(1, 'Location is required').max(255, 'Location must not exceed 255 characters'),
  address: z.string().min(1, 'Address is required').max(10000, 'Address must not exceed 10000 characters'),
});

export const updateTheaterSchema = z.object({
  name: z.string().min(1, 'Name must not be empty').max(255, 'Name must not exceed 255 characters').optional(),
  location: z.string().min(1, 'Location must not be empty').max(255, 'Location must not exceed 255 characters').optional(),
  address: z.string().min(1, 'Address must not be empty').max(10000, 'Address must not exceed 10000 characters').optional(),
});
