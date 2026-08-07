import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import logger from '../utils/logger';

config();

if (!process.env.DATABASE_URL) {
  logger.error('DATABASE_URL environment variable is required');
  throw new Error('DATABASE_URL environment variable is required');
}

const connectionString = process.env.DATABASE_URL;

const poolSize = parseInt(process.env.DB_POOL_SIZE || '10', 10);
const idleTimeout = parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10);
const connectionTimeout = parseInt(process.env.DB_CONN_TIMEOUT || '10000', 10);
const useSSL = process.env.DB_SSL === 'true';


const client = postgres(connectionString, {
  max: poolSize,                 
  idle_timeout: idleTimeout / 1000,  
  connect_timeout: connectionTimeout / 1000, 
  onnotice: () => {},                
  ssl: useSSL ? 'require' : false,
});

export const db = drizzle(client, { schema });

export async function verifyConnection(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    logger.info('Database connection verified successfully');
    return true;
  } catch (error) {
    logger.error('Database connection verification failed', { error });
    return false;
  }
}
