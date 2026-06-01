import { open } from '@tauri-apps/plugin-dialog';
import { readFile } from '@tauri-apps/plugin-fs';
import { bulkImportCustomers, getAllCustomers } from './api';
import {
  parseCustomerCsv,
  dedupeImportNames,
} from './customerCsvImport';
import {
  buildExistingCustomerMatchIndex,
  customerRowAlreadyExists,
} from './customerDedupUtils';

function isTauri() {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

async function readCsvTextFromPath(filePath) {
  const bytes = await readFile(filePath);
  return new TextDecoder('utf-8').decode(bytes);
}

export async function readCustomerCsvFromDialog() {
  if (!isTauri()) {
    throw new Error('CSV import is available in the desktop app only.');
  }

  const selected = await open({
    multiple: false,
    filters: [{ name: 'CSV', extensions: ['csv'] }],
    title: 'Select customer CSV file',
  });

  if (!selected || Array.isArray(selected)) {
    return { cancelled: true };
  }

  const text = await readCsvTextFromPath(selected);
  return { cancelled: false, text, path: selected };
}

/** Preview how many rows would import vs skip (no DB writes). */
export async function previewCustomerCsvImport(csvText) {
  const parsed = parseCustomerCsv(csvText);
  if (parsed.length === 0) {
    throw new Error('No customer rows found in the file.');
  }

  const existing = await getAllCustomers();
  const matchIndex = buildExistingCustomerMatchIndex(existing);
  const existingKeys = new Set(
    existing.map((c) => String(c.name || '').trim().toLowerCase())
  );
  const prepared = dedupeImportNames(parsed, existingKeys);

  let wouldImport = 0;
  let wouldSkip = 0;

  for (const row of prepared) {
    if (customerRowAlreadyExists(row, matchIndex)) {
      wouldSkip += 1;
    } else {
      wouldImport += 1;
    }
  }

  return {
    parsed: parsed.length,
    prepared: prepared.length,
    wouldImport,
    wouldSkip,
    existingCount: existing.length,
  };
}

export async function runCustomerCsvImport(csvText) {
  const parsed = parseCustomerCsv(csvText);
  if (parsed.length === 0) {
    throw new Error('No customer rows found in the file.');
  }

  const existing = await getAllCustomers();
  const existingKeys = new Set(
    existing.map((c) => String(c.name || '').trim().toLowerCase())
  );
  const rows = dedupeImportNames(parsed, existingKeys);
  const result = await bulkImportCustomers(rows);

  return {
    ...result,
    parsed: parsed.length,
    prepared: rows.length,
  };
}
