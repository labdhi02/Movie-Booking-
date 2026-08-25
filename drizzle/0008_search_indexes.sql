-- Create index for case-insensitive title search (ILIKE pattern matching)
CREATE INDEX idx_movies_title_lower ON movies(LOWER(title));--> statement-breakpoint

-- Create GIN index for genres array containment queries
CREATE INDEX idx_movies_genres_gin ON movies USING GIN(genres);--> statement-breakpoint

-- Create GIN index for actors array operations
CREATE INDEX idx_movies_actors_gin ON movies USING GIN(actors);--> statement-breakpoint

-- Create index for showtime start_time date range queries
CREATE INDEX idx_showtimes_start_time ON showtimes(start_time);--> statement-breakpoint

-- Create composite index for movie date range filtering (optimizes join queries)
CREATE INDEX idx_showtimes_movie_start_time ON showtimes(movie_id, start_time);
