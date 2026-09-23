import { readFile } from 'node:fs/promises';
import { createClient } from '@libsql/client';

const url = process.env.DATABASE_URL ?? 'file:local.db';
const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
const seedOnly = process.argv.includes('--seed-only');

if (!seedOnly) {
  const migration = await readFile(new URL('../drizzle/0000_mecha_store.sql', import.meta.url), 'utf8');
  await client.executeMultiple(migration.replaceAll('--> statement-breakpoint', ''));
}

const seed = await readFile(new URL('../db/seed.sql', import.meta.url), 'utf8');
await client.executeMultiple(seed);
await client.close();
console.log(seedOnly ? 'Local seed complete.' : 'Local SQLite database ready.');
