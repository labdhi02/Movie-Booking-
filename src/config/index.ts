import dotenv from 'dotenv';
dotenv.config();

export interface Config {
  supabaseUrl: string;
  supabaseJwtSecret: string;
  databaseUrl: string;
  port: number;
}

function validateConfig(): Config {
  const { SUPABASE_URL, SUPABASE_JWT_SECRET, DATABASE_URL, PORT } = process.env;

  if (!SUPABASE_JWT_SECRET) {
    throw new Error('SUPABASE_JWT_SECRET environment variable is required');
  }

  if (!SUPABASE_URL) {
    throw new Error('SUPABASE_URL environment variable is required');
  }

  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  return {
    supabaseUrl: SUPABASE_URL,
    supabaseJwtSecret: SUPABASE_JWT_SECRET,
    databaseUrl: DATABASE_URL,
    port: parseInt(PORT || '3000', 10),
  };
}

export const config = validateConfig();
