# Movie Reservation System - Backend

This is the backend server for the Movie Reservation System, implementing data modeling with Drizzle ORM and PostgreSQL.

## Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the Server directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual database credentials.

### Database Configuration

The project uses the following environment variables for database connection:

- `DATABASE_HOST` - Database server hostname (default: localhost)
- `DATABASE_PORT` - Database server port (default: 5432)
- `DATABASE_NAME` - Database name (default: movie_reservation)
- `DATABASE_USER` - Database username
- `DATABASE_PASSWORD` - Database password (required)

## Available Scripts

### Database Commands

- `npm run db:generate` - Generate migration files from schema definitions
- `npm run db:migrate` - Apply pending migrations to the database
- `npm run db:push` - Push schema changes directly to the database (development only)
- `npm run db:seed` - Populate the database with sample data
- `npm run db:studio` - Open Drizzle Studio for visual database management

## Project Structure

```
Server/
├── src/
│   └── db/
│       ├── schema/
│       │   ├── index.ts          # Schema aggregator
│       │   ├── theaters.ts       # Theater, Screen, Seat schemas
│       │   ├── movies.ts         # Movie schema
│       │   ├── showtimes.ts      # Showtime schema
│       │   └── bookings.ts       # BookingSeat, SeatHold schemas
│       ├── config.ts             # Database connection configuration
│       ├── index.ts              # Drizzle ORM client export
│       └── seed.ts               # Sample data population script
├── drizzle/                      # Generated migration files
├── drizzle.config.ts             # Drizzle Kit configuration
├── tsconfig.json                 # TypeScript configuration
├── .env                          # Environment variables (not in git)
└── .env.example                  # Environment template
```

## Development Workflow

1. Define or modify schemas in `src/db/schema/`
2. Generate migrations: `npm run db:generate`
3. Apply migrations: `npm run db:migrate`
4. (Optional) Seed sample data: `npm run db:seed`

## Milestone 1: Data Modeling

This milestone focuses on:
- Setting up Drizzle ORM with PostgreSQL
- Designing core database schema (theaters, screens, seats, movies, showtimes, bookings)
- Creating migrations and seed data
- Verifying relationships and constraints

**Out of Scope:**
- Business logic and API endpoints
- Authentication and authorization
- Payment processing
- Real-time updates

## Schema Design Highlights

### Foreign Key Behaviors

- **CASCADE DELETE**: Theater → Screens → Seats (infrastructure cleanup)
- **RESTRICT DELETE**: Movie ← Showtimes (preserve historical data)
- **CASCADE DELETE**: Showtime → Bookings (cleanup when showtime is removed)

### Unique Constraints

- `booking_seats(showtime_id, seat_id)` - Prevents double-booking
- `seat_holds(showtime_id, seat_id)` - One hold per seat per showtime

### Array Fields

- `movies.genres` and `movies.actors` use PostgreSQL array types for flexibility
- Appropriate for this milestone's scope (no complex filtering required)

## License

ISC
