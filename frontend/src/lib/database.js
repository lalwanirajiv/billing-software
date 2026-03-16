import Database from "@tauri-apps/plugin-sql";

let db;

export async function getDB() {
  if (!db) {
    db = await Database.load("sqlite:billing.db");
  }
  return db;
}