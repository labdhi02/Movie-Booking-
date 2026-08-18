import { readdirSync, readFileSync } from 'fs';
import { Client } from 'pg';
import 'dotenv/config';
import logger from '../utils/logger';

const client = new Client({
  connectionString: process.env.DATABASE_URL!,
  ssl: process.env.DATABASE_URL?.includes('supabase.co') ? { rejectUnauthorized: false } : undefined,
});

client
  .connect()
  .then(() => logger.info('⏳ Applying migrations...'))
  .then(() =>
    Promise.all(
      readdirSync('migrations')
        .filter(f => f.endsWith('.sql'))
        .map(async f => {
          return client.query(readFileSync(`migrations/${f}`, 'utf8'));
        })
    )
  )
  .then(() => logger.info('✅ Done!'))
  .catch((err) => {
    logger.error('❌ Migration failed', { error: err });
    process.exit(1);
  })
  .finally(() => client.end());
