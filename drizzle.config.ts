import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load environment variables
config();

/**
 * Drizzle Kit Configuration
 * Used for migration generation and database push operations
 * 
 * Supports Supabase connection string format:
 * postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
 */
export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
