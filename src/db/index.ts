/**
 * Database module - Central export point
 * Re-exports database connection and utilities
 */
export { db, verifyConnection } from './connection';
export * as schema from './schema';

