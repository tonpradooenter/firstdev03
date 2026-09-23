import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

let client: Client | undefined;

export function getDb() {
  const url = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL ?? 'file:local.db';
  if (process.env.VERCEL && url.startsWith('file:')) {
    throw new Error('Production database is not configured. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.');
  }
  client ??= createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  return drizzle(client, { schema });
}
