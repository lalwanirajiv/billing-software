import { save, open } from "@tauri-apps/plugin-dialog";
import {
  BaseDirectory,
  readFile,
  writeFile,
  mkdir,
  exists,
  remove,
} from "@tauri-apps/plugin-fs";
import { checkpointDatabase, closeDatabase, getDB } from "./database";

const DB_FILE = "billing.db";

function formatTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}`;
}

async function readDatabaseBytes() {
  await checkpointDatabase();
  return readFile(DB_FILE, { baseDir: BaseDirectory.AppConfig });
}

async function writeDatabaseBytes(bytes) {
  await writeFile(DB_FILE, bytes, { baseDir: BaseDirectory.AppConfig });
}

async function removeWalFiles() {
  for (const suffix of ["-wal", "-shm"]) {
    const walPath = `${DB_FILE}${suffix}`;
    if (await exists(walPath, { baseDir: BaseDirectory.AppConfig })) {
      await remove(walPath, { baseDir: BaseDirectory.AppConfig });
    }
  }
}

async function createSafetyBackup(label) {
  const bytes = await readDatabaseBytes();
  const backupName = `backups/billing-${label}-${formatTimestamp()}.db`;

  await mkdir("backups", {
    baseDir: BaseDirectory.AppConfig,
    recursive: true,
  });
  await writeFile(backupName, bytes, { baseDir: BaseDirectory.AppConfig });

  return backupName;
}

export async function backupDatabase() {
  const defaultPath = `billing-backup-${formatTimestamp()}.db`;
  const destination = await save({
    filters: [{ name: "SQLite Database", extensions: ["db"] }],
    defaultPath,
    title: "Save database backup",
  });

  if (!destination) {
    return { cancelled: true };
  }

  const bytes = await readDatabaseBytes();
  await writeFile(destination, bytes);

  localStorage.setItem("last-backup-at", new Date().toISOString());
  localStorage.setItem("last-backup-path", destination);

  return { success: true, path: destination };
}

export async function restoreDatabase() {
  const source = await open({
    filters: [{ name: "SQLite Database", extensions: ["db"] }],
    multiple: false,
    title: "Select a database backup to restore",
  });

  if (!source || (Array.isArray(source) && source.length === 0)) {
    return { cancelled: true };
  }

  const backupPath = Array.isArray(source) ? source[0] : source;
  const backupBytes = await readFile(backupPath);

  if (!backupBytes?.length) {
    throw new Error("The selected backup file is empty.");
  }

  await createSafetyBackup("pre-restore");
  await closeDatabase();
  await writeDatabaseBytes(backupBytes);
  await removeWalFiles();
  await getDB();

  localStorage.setItem("last-restore-at", new Date().toISOString());
  localStorage.setItem("last-restore-from", backupPath);

  return { success: true, path: backupPath };
}
