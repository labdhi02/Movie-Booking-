# Requirements Document

## Introduction

This document specifies requirements for Milestone 1 of a movie reservation system backend. This milestone focuses exclusively on data modeling: setting up Drizzle ORM with PostgreSQL, designing the core database schema with proper relationships and constraints, and creating seed data for verification. No business logic, API routes, or authentication are included in this milestone.

## Glossary

- **Database_System**: The PostgreSQL database instance that stores all movie reservation data
- **ORM_Layer**: The Drizzle ORM configuration and schema definitions that mediate between application code and the Database_System
- **Migration_Tool**: Drizzle Kit, used to generate and apply database migrations
- **Theater**: A physical cinema location containing multiple screens
- **Screen**: A viewing room within a Theater that shows movies and contains seats
- **Seat**: An individual seating position within a Screen, identified by row, column, and type
- **Movie**: A film that can be scheduled for showings, with metadata like title, genre, duration
- **Showtime**: A scheduled screening of a Movie in a specific Screen at a specific time
- **Booking_Seat**: A record linking a Seat to a Showtime, tracking reservation status
- **Seat_Hold**: A temporary reservation of a Seat for a Showtime with an expiration time
- **Seed_Script**: An executable script that populates the database with sample data for verification
- **Composite_Unique_Constraint**: A database constraint ensuring a combination of column values is unique across rows
- **Foreign_Key_Constraint**: A database constraint enforcing referential integrity between related tables
- **Cascade_Delete**: A foreign key behavior that automatically deletes dependent rows when a parent row is deleted
- **Restrict_Delete**: A foreign key behavior that prevents deletion of a parent row if dependent rows exist

## Requirements

### Requirement 1: ORM and Database Configuration

**User Story:** As a developer, I want Drizzle ORM configured with PostgreSQL and migration tooling, so that I can define schemas and evolve the database over time.

#### Acceptance Criteria

1. THE ORM_Layer SHALL include a connection configuration to the Database_System
2. THE Migration_Tool SHALL be configured to generate migration files from schema definitions
3. THE Migration_Tool SHALL be capable of applying migrations to the Database_System
4. THE ORM_Layer SHALL use TypeScript for type-safe schema definitions

### Requirement 2: Theater Schema

**User Story:** As a developer, I want to store theater information, so that I can represent physical cinema locations in the system.

#### Acceptance Criteria

1. THE Database_System SHALL store a theaters table with columns: id, name, location, address, created_at, updated_at
2. THE theaters table id column SHALL be a primary key
3. THE theaters table name column SHALL enforce NOT NULL
4. THE theaters table location column SHALL enforce NOT NULL
5. THE theaters table address column SHALL enforce NOT NULL
6. THE theaters table created_at and updated_at columns SHALL enforce NOT NULL

### Requirement 3: Screen Schema

**User Story:** As a developer, I want to store screen information with relationships to theaters, so that I can represent viewing rooms within cinema locations.

#### Acceptance Criteria

1. THE Database_System SHALL store a screens table with columns: id, theater_id, name, screen_number, total_seats, created_at, updated_at
2. THE screens table id column SHALL be a primary key
3. THE screens table theater_id column SHALL be a Foreign_Key_Constraint referencing theaters(id)
4. WHEN a Theater row is deleted, THE Database_System SHALL apply Cascade_Delete to related Screen rows
5. THE screens table name column SHALL enforce NOT NULL
6. THE screens table total_seats column SHALL enforce NOT NULL
7. THE screens table created_at and updated_at columns SHALL enforce NOT NULL

### Requirement 4: Seat Schema

**User Story:** As a developer, I want to store seat information with relationships to screens, so that I can represent individual seating positions.

#### Acceptance Criteria

1. THE Database_System SHALL store a seats table with columns: id, screen_id, row, column, seat_type, created_at, updated_at
2. THE seats table id column SHALL be a primary key
3. THE seats table screen_id column SHALL be a Foreign_Key_Constraint referencing screens(id)
4. WHEN a Screen row is deleted, THE Database_System SHALL apply Cascade_Delete to related Seat rows
5. THE seats table row column SHALL enforce NOT NULL
6. THE seats table column column SHALL enforce NOT NULL
7. THE seats table seat_type column SHALL enforce NOT NULL and accept values: 'regular', 'premium', 'recliner'
8. THE seats table created_at and updated_at columns SHALL enforce NOT NULL

### Requirement 5: Movie Schema

**User Story:** As a developer, I want to store movie information, so that I can represent films available for scheduling.

#### Acceptance Criteria

1. THE Database_System SHALL store a movies table with columns: id, title, genres, actors, duration_minutes, rating, description, release_date, created_at, updated_at
2. THE movies table id column SHALL be a primary key
3. THE movies table title column SHALL enforce NOT NULL
4. THE movies table duration_minutes column SHALL enforce NOT NULL
5. THE movies table genres column SHALL support storing multiple genre values
6. THE movies table actors column SHALL support storing multiple actor names
7. THE movies table created_at and updated_at columns SHALL enforce NOT NULL

### Requirement 6: Showtime Schema

**User Story:** As a developer, I want to store showtime information with relationships to movies and screens, so that I can represent scheduled screenings.

#### Acceptance Criteria

1. THE Database_System SHALL store a showtimes table with columns: id, movie_id, screen_id, start_time, end_time, status, created_at, updated_at
2. THE showtimes table id column SHALL be a primary key
3. THE showtimes table movie_id column SHALL be a Foreign_Key_Constraint referencing movies(id)
4. THE showtimes table screen_id column SHALL be a Foreign_Key_Constraint referencing screens(id)
5. WHEN a Movie row with related Showtime rows exists, THE Database_System SHALL apply Restrict_Delete to prevent Movie deletion
6. THE showtimes table start_time column SHALL enforce NOT NULL
7. THE showtimes table end_time column SHALL enforce NOT NULL
8. THE showtimes table status column SHALL enforce NOT NULL
9. THE showtimes table created_at and updated_at columns SHALL enforce NOT NULL

### Requirement 7: Booking Seat Schema

**User Story:** As a developer, I want to store booking seat information linking seats to showtimes, so that I can track which seats are reserved for which screenings.

#### Acceptance Criteria

1. THE Database_System SHALL store a booking_seats table with columns: id, showtime_id, seat_id, booking_id, status, created_at, updated_at
2. THE booking_seats table id column SHALL be a primary key
3. THE booking_seats table showtime_id column SHALL be a Foreign_Key_Constraint referencing showtimes(id)
4. THE booking_seats table seat_id column SHALL be a Foreign_Key_Constraint referencing seats(id)
5. THE booking_seats table booking_id column SHALL be nullable
6. THE booking_seats table SHALL enforce a Composite_Unique_Constraint on (showtime_id, seat_id)
7. THE booking_seats table status column SHALL enforce NOT NULL
8. THE booking_seats table created_at and updated_at columns SHALL enforce NOT NULL

### Requirement 8: Seat Hold Schema

**User Story:** As a developer, I want to store temporary seat holds with expiration times, so that I can prevent double-booking while users complete their reservations.

#### Acceptance Criteria

1. THE Database_System SHALL store a seat_holds table with columns: id, showtime_id, seat_id, user_id, expires_at, created_at, updated_at
2. THE seat_holds table id column SHALL be a primary key
3. THE seat_holds table showtime_id column SHALL be a Foreign_Key_Constraint referencing showtimes(id)
4. THE seat_holds table seat_id column SHALL be a Foreign_Key_Constraint referencing seats(id)
5. THE seat_holds table SHALL enforce a Composite_Unique_Constraint on (showtime_id, seat_id)
6. THE seat_holds table user_id column SHALL be a string placeholder field
7. THE seat_holds table expires_at column SHALL enforce NOT NULL
8. THE seat_holds table created_at and updated_at columns SHALL enforce NOT NULL

### Requirement 9: Schema Migration Generation and Application

**User Story:** As a developer, I want to generate and apply database migrations from schema definitions, so that the Database_System reflects the defined schema.

#### Acceptance Criteria

1. WHEN schema files are created, THE Migration_Tool SHALL generate migration files
2. WHEN migration files are generated, THE Migration_Tool SHALL apply them to the Database_System
3. FOR ALL defined tables, THE Database_System SHALL contain corresponding tables after migration
4. FOR ALL defined Foreign_Key_Constraint definitions, THE Database_System SHALL enforce referential integrity
5. FOR ALL defined Composite_Unique_Constraint definitions, THE Database_System SHALL prevent duplicate combinations

### Requirement 10: Sample Data Seeding

**User Story:** As a developer, I want sample data in the database, so that I can manually verify relationships and constraints work correctly.

#### Acceptance Criteria

1. THE Seed_Script SHALL create at least 1 Theater record
2. THE Seed_Script SHALL create at least 2 Theater records
3. THE Seed_Script SHALL create at least 2 Screen records related to created Theaters
4. THE Seed_Script SHALL create at least 10 Seat records related to created Screens
5. THE Seed_Script SHALL create at least 2 Movie records
6. THE Seed_Script SHALL create at least 2 Showtime records linking Movies to Screens
7. WHEN the Seed_Script is executed, THE Database_System SHALL contain all seeded records
8. FOR ALL seeded Foreign_Key_Constraint relationships, THE Database_System SHALL maintain referential integrity

### Requirement 11: Schema Organization

**User Story:** As a developer, I want schema definitions organized by domain, so that the codebase is maintainable and logically structured.

#### Acceptance Criteria

1. THE ORM_Layer SHALL include a schema file for theater-related tables (theaters, screens, seats)
2. THE ORM_Layer SHALL include a schema file for movie-related tables (movies)
3. THE ORM_Layer SHALL include a schema file for showtime-related tables (showtimes)
4. THE ORM_Layer SHALL include a schema file for booking-related tables (booking_seats, seat_holds)
5. WHERE multiple schema files exist, THE ORM_Layer SHALL provide a mechanism to export all schemas from a single entry point

### Requirement 12: Schema Documentation

**User Story:** As a developer, I want documentation of schema design decisions, so that I understand tradeoffs and reasoning behind implementation choices.

#### Acceptance Criteria

1. THE project SHALL include documentation explaining Foreign_Key_Constraint ON DELETE behavior choices
2. THE project SHALL include documentation explaining Composite_Unique_Constraint rationale for booking_seats and seat_holds
3. THE project SHALL include documentation explaining why certain fields are nullable or non-nullable
4. THE project SHALL include documentation explaining data type choices for array fields (genres, actors)
