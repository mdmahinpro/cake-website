import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

let _pool: pg.Pool | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    const url = process.env["DATABASE_URL"];
    if (!url) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?",
      );
    }
    _pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
    _db = drizzle(_pool, { schema });
  }
  return _db;
}

/** Run once at server startup — creates the shops table if it doesn't exist yet. */
export async function ensureSchema(): Promise<void> {
  const url = process.env["DATABASE_URL"];
  if (!url) return;
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS shops (
        id          TEXT        PRIMARY KEY,
        data        JSONB       NOT NULL,
        admin_token TEXT        NOT NULL,
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  } finally {
    await pool.end();
  }
}

export * from "./schema";
