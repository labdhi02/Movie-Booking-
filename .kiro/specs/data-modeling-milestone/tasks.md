# Implementation Plan: Data Modeling Milestone

## Overview

This implementation plan establishes the foundational data layer for a movie reservation system using Drizzle ORM with PostgreSQL. The focus is exclusively on database schema setup, relationships, constraints, and seed data creation. Implementation will proceed incrementally, starting with project setup, then building out schema files by domain, configuring migrations, and finally creating seed data for verification.

## Tasks

- [x] 1. Set up Drizzle ORM project structure and configuration
  - Install Drizzle ORM, Drizzle Kit, and PostgreSQL driver dependencies (drizzle-orm, drizzle-kit, pg or postgres.js)
  - Create `src/db/` directory structure for database code
  - Create `drizzle.config.ts` at project root with schema paths and migration output configuration
  - Create `.env` file with `DATABASE_URL` environment variable placeholder
  - Add database scripts to `package.json` (db:generate, db:migrate, db:push, db:seed, db:studio)
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Create database connection module
  - [x] 2.1 Implement PostgreSQL connection setup
    - Create `src/db/connection.ts` with connection pool configuration
    - Export configured Drizzle instance using `drizzle()` from chosen driver
    - Load `DATABASE_URL` from environment variables
    - _Requirements: 1.1_

- [ ] 3. Implement theater domain schema
  - [ ] 3.1 Create theater schema file with tables
    - Create `src/db/schema/theater.schema.ts`
    - Define `theaters` table with id (UUID, PK), name, location, address, created_at, updated_at
    - Define `screens` table with id (UUID, PK), theater_id (FK), name, screen_number, total_seats, created_at, updated_at
    - Define `seatTypeEnum` and `seats` table with id (UUID, PK), screen_id (FK), row, column, seat_type, created_at, updated_at
    - Add foreign key constraints: screens.theater_id → theaters.id (CASCADE), seats.screen_id → screens.id (CASCADE)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 11.1_

- [ ] 4. Implement movie domain schema
  - [ ] 4.1 Create movie schema file with table
    - Create `src/db/schema/movie.schema.ts`
    - Define `movies` table with id (UUID, PK), title, genres (TEXT[]), actors (TEXT[]), duration_minutes, rating, description, release_date, created_at, updated_at
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 11.2_

- [ ] 5. Implement showtime domain schema
  - [ ] 5.1 Create showtime schema file with table
    - Create `src/db/schema/showtime.schema.ts`
    - Import movies and screens tables from other schema files
    - Define `showtimes` table with id (UUID, PK), movie_id (FK), screen_id (FK), start_time, end_time, status, created_at, updated_at
    - Add foreign key constraints: showtimes.movie_id → movies.id (RESTRICT), showtimes.screen_id → screens.id (RESTRICT)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 11.3_

- [ ] 6. Implement booking domain schema
  - [ ] 6.1 Create booking schema file with tables
    - Create `src/db/schema/booking.schema.ts`
    - Import showtimes and seats tables from other schema files
    - Define `booking_seats` table with id (UUID, PK), showtime_id (FK), seat_id (FK), booking_id (nullable), status, created_at, updated_at
    - Add composite unique constraint on booking_seats(showtime_id, seat_id)
    - Add foreign key constraints: booking_seats.showtime_id → showtimes.id (CASCADE), booking_seats.seat_id → seats.id (CASCADE)
    - Define `seat_holds` table with id (UUID, PK), showtime_id (FK), seat_id (FK), user_id (TEXT), expires_at, created_at, updated_at
    - Add composite unique constraint on seat_holds(showtime_id, seat_id)
    - Add foreign key constraints: seat_holds.showtime_id → showtimes.id (CASCADE), seat_holds.seat_id → seats.id (CASCADE)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 11.4_

- [ ] 7. Create schema index file
  - [ ] 7.1 Export all schemas from single entry point
    - Create `src/db/schema/index.ts`
    - Export all table definitions from theater.schema.ts, movie.schema.ts, showtime.schema.ts, booking.schema.ts
    - _Requirements: 11.5_

- [ ] 8. Checkpoint - Generate and apply migrations
  - Generate migration files using `npm run db:generate` (or drizzle-kit generate)
  - Review generated SQL migration files in `drizzle/migrations/` directory
  - Apply migrations to database using `npm run db:migrate` (or drizzle-kit migrate)
  - Verify all tables exist in PostgreSQL database
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 9. Create seed script
  - [ ] 9.1 Implement seed data generation
    - Create `src/db/seed.ts` file
    - Import db connection and all table schemas
    - Insert at least 2 theaters with name, location, address
    - Insert at least 2 screens related to created theaters with theater_id, name, screen_number, total_seats
    - Insert at least 10 seats related to created screens with screen_id, row, column, seat_type
    - Insert at least 2 movies with title, genres, actors, duration_minutes, rating, description, release_date
    - Insert at least 2 showtimes linking movies to screens with movie_id, screen_id, start_time, end_time, status
    - Wrap inserts in transaction for idempotency (check if data exists before inserting)
    - Add script execution: if executed as main module, run seed function and log results
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

- [ ] 10. Checkpoint - Run seed script and verify data
  - Execute seed script using `npm run db:seed` (or `node src/db/seed.ts`)
  - Connect to PostgreSQL database and verify seeded data exists
  - Verify foreign key relationships are correctly established (JOIN queries)
  - Manually test constraint violations (attempt duplicate booking_seat, attempt delete restricted movie)
  - Ensure all tests pass, ask the user if questions arise

- [ ] 11. Create schema documentation
  - [ ] 11.1 Write documentation file
    - Create `docs/database-schema.md` or add to README.md
    - Document foreign key ON DELETE behavior rationale (CASCADE vs RESTRICT choices)
    - Document composite unique constraint rationale for booking_seats and seat_holds
    - Document nullable vs non-nullable field decisions
    - Document array field data type choices (TEXT[] for genres and actors)
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 12. Final checkpoint - Verify complete setup
  - Run migrations from scratch on clean database to verify reproducibility
  - Run seed script to verify data population works correctly
  - Review all schema files for consistency and best practices
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- No property-based tests are included because this milestone is Infrastructure as Code (schema definitions), not functional code with testable properties
- Unit tests and integration tests for schema validation, migration application, and constraint enforcement are appropriate but marked optional
- The design document explicitly states property-based testing does not apply to this milestone
- All code examples use TypeScript with Drizzle ORM as specified in the design
- Migration testing and constraint verification testing should be done manually or through integration tests after implementation

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["3.1", "4.1"] },
    { "id": 3, "tasks": ["5.1"] },
    { "id": 4, "tasks": ["6.1"] },
    { "id": 5, "tasks": ["7.1"] },
    { "id": 6, "tasks": ["8"] },
    { "id": 7, "tasks": ["9.1"] },
    { "id": 8, "tasks": ["10"] },
    { "id": 9, "tasks": ["11.1"] },
    { "id": 10, "tasks": ["12"] }
  ]
}
```
