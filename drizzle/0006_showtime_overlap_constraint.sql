-- Migration: Add showtime overlap prevention constraint with 15-minute buffer
-- Purpose: Prevent double-booking of screens and enforce cleanup time between shows

-- Enable btree_gist extension for exclusion constraints
-- This extension allows GiST indexes on scalar types (like UUID, timestamp)
CREATE EXTENSION IF NOT EXISTS btree_gist;
--> statement-breakpoint
-- Create composite index for query performance
-- This index optimizes queries filtering by screen and time range
CREATE INDEX IF NOT EXISTS idx_showtimes_screen_time 
ON showtimes (screen_id, start_time);
--> statement-breakpoint
-- Add exclusion constraint to prevent overlapping showtimes
-- This constraint ensures:
-- 1. Two showtimes on the same screen (screen_id WITH =)
-- 2. Cannot have overlapping time ranges (WITH &&)
-- 3. Includes 15-minute buffer after end_time for cleanup
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'showtime_no_overlap'
  ) THEN
    ALTER TABLE showtimes 
    ADD CONSTRAINT showtime_no_overlap 
    EXCLUDE USING gist (
      screen_id WITH =,
      tstzrange(start_time, end_time + interval '15 minutes') WITH &&
    );
  END IF;
END $$;
