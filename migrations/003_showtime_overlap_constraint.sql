CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE INDEX IF NOT EXISTS idx_showtimes_screen_time 
ON showtimes (screen_id, start_time);

CREATE OR REPLACE FUNCTION showtime_effective_range(start_time timestamptz, end_time timestamptz)
RETURNS tstzrange
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT tstzrange(start_time, end_time + interval '15 minutes');
$$;

ALTER TABLE showtimes 
ADD CONSTRAINT showtime_no_overlap 
EXCLUDE USING gist (
  screen_id WITH =,
  showtime_effective_range(start_time, end_time) WITH &&
);