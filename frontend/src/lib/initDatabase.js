import { getDB } from "./database";

/**
 * Adds columns that may be missing on databases created before Tauri migrations
 * were the single source of truth. Does not create tables — that is handled by
 * src-tauri/migrations/*.sql via tauri-plugin-sql.
 */
async function ensureColumn(db, table, column, definition) {
  const cols = await db.select(`PRAGMA table_info(${table})`);
  const exists = cols.some((c) => c.name === column);
  if (!exists) {
    await db.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

export async function initDatabase() {
  const db = await getDB();
  await ensureColumn(db, "invoices", "discount", "REAL NOT NULL DEFAULT 0");
  await ensureColumn(db, "company_settings", "setup_completed", "INTEGER NOT NULL DEFAULT 0");
}
