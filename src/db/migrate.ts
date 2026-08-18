import { readdirSync, readFileSync } from 'fs';
import { Client } from 'pg';
import 'dotenv/config';
import logger from '../utils/logger';

const client = new Client({
  connectionString: process.env.DATABASE_URL!,
  ssl: process.env.DATABASE_URL?.includes('supabase.co') ? { rejectUnauthorized: false } : undefined,
});

async function runMigrations() {
  await client.connect();
  logger.info('⏳ Applying migrations...');

  const files = readdirSync('migrations')
    .filter(f => f.endsWith('.sql'))
    .sort(); 

  for (const f of files) {
    logger.info(`Running migration: ${f}`);
    const sql = readFileSync(`migrations/${f}`, 'utf8');
    await client.query(sql); 
  }

  logger.info('✅ Done!');
}

runMigrations()
  .catch((err) => {
    logger.error('❌ Migration failed', { error: err.message ?? err, detail: err });
    process.exit(1);
  })
  .finally(() => client.end());