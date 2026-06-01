import Database from "@tauri-apps/plugin-sql";

let db;

export async function getDB() {
  if (!db) {
    db = await Database.load("sqlite:billing.db");
    // Enable Foreign Keys for CASCADE support
    await db.execute("PRAGMA foreign_keys = ON;");
  }
  return db;
}