import Database from "@tauri-apps/plugin-sql";

let rawDb = null;
let initPromise = null;
/** Ensures every SQL statement runs one-at-a-time against SQLite. */
let queue = Promise.resolve();

async function clearStaleTransactions(db) {
  for (let i = 0; i < 5; i += 1) {
    try {
      await db.execute("ROLLBACK;");
    } catch {
      // No open transaction on this connection.
    }
  }
}

async function initRawDb() {
  if (!initPromise) {
    initPromise = (async () => {
      const db = await Database.load("sqlite:billing.db");
      await clearStaleTransactions(db);
      await db.execute("PRAGMA journal_mode = WAL;");
      await db.execute("PRAGMA busy_timeout = 30000;");
      await db.execute("PRAGMA foreign_keys = ON;");
      rawDb = db;
      return db;
    })();
  }
  return initPromise;
}

function runExclusive(fn) {
  const task = queue.then(async () => {
    const db = await initRawDb();
    try {
      await db.execute("ROLLBACK;");
    } catch {
      // No open transaction on this connection.
    }
    return fn(db);
  });
  queue = task.catch(() => {});
  return task;
}

const queuedDb = {
  execute(query, bindValues) {
    return runExclusive((db) => db.execute(query, bindValues ?? []));
  },
  select(query, bindValues) {
    return runExclusive((db) => db.select(query, bindValues ?? []));
  },
};

export function mapDbError(error) {
  const message = String(error?.message ?? error);
  if (
    message.includes("UNIQUE constraint failed") ||
    message.includes("idx_invoices_bill_no_unique")
  ) {
    return new Error("An invoice with this bill number already exists.");
  }
  if (message.includes("database is locked") || message.includes("code: 5")) {
    return new Error(
      "Database is busy. Close any other copy of the app, then try again."
    );
  }
  return error instanceof Error ? error : new Error(message);
}

/** Returns a queued DB handle — every execute/select is serialized. */
export async function getDB() {
  await initRawDb();
  return queuedDb;
}

/**
 * Runs multiple statements on one connection within a single queued turn.
 * Used for invoice create/update/delete batches.
 */
export async function withTransaction(fn) {
  return runExclusive(async (db) => {
    try {
      return await fn(db);
    } catch (error) {
      throw mapDbError(error);
    }
  });
}

/** Flushes WAL changes into the main database file before backup. */
export async function checkpointDatabase() {
  return runExclusive((db) => db.execute("PRAGMA wal_checkpoint(FULL);"));
}

/** Closes the SQLite pool so the database file can be replaced. */
export async function closeDatabase() {
  await queue;
  if (rawDb) {
    try {
      await rawDb.close("sqlite:billing.db");
    } catch {
      // Pool may already be closed.
    }
    rawDb = null;
    initPromise = null;
  }
}
