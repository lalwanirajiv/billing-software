import { normalizeName, validatePhone } from './validation';

const GSTIN_REGEX =
  /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/;

/** Parse one CSV line respecting double quotes. */
export function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (c === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }
    current += c;
  }
  result.push(current.trim());
  return result;
}

export function extractGstin(raw) {
  const value = normalizeName(raw);
  if (!value || value === '-' || value === '_') return null;
  const upper = value.toUpperCase().replace(/PAN\s*[:-\s]*/gi, '');
  const match = upper.match(GSTIN_REGEX);
  return match ? match[0] : null;
}

function sanitizePhone(raw) {
  const value = normalizeName(raw);
  if (!value || value === '-') return null;
  if (extractGstin(value)) return null;
  return validatePhone(value) ? null : value;
}

/**
 * Map parsed CSV columns to customer fields.
 * Expected columns: Sr No, Name, ADDRESS, FULL ADDRESS, GST NUMBER, [phone]
 */
export function mapCsvFieldsToCustomer(fields) {
  if (!fields?.length || fields.length < 2) return null;

  const name = normalizeName(fields[1]);
  if (!name) return null;

  let gstinIndex = -1;
  let gstin = null;
  for (let i = 2; i < fields.length; i += 1) {
    const found = extractGstin(fields[i]);
    if (found) {
      gstin = found;
      gstinIndex = i;
      break;
    }
  }

  let phone = null;
  const lastIndex = fields.length - 1;
  if (gstinIndex >= 0 && lastIndex > gstinIndex) {
    phone = sanitizePhone(fields[lastIndex]);
  }

  const addressEnd = gstinIndex >= 0 ? gstinIndex : (phone ? lastIndex : fields.length);
  const addressParts = fields
    .slice(2, addressEnd)
    .map((p) => normalizeName(p))
    .filter((p) => p && p !== '-');

  const address_line1 = addressParts[0] || null;
  const address_line2 =
    addressParts.length > 1 ? addressParts.slice(1).join(', ') : null;

  return {
    name,
    address_line1,
    address_line2,
    gstin,
    phone,
  };
}

export function parseCustomerCsv(text) {
  const lines = String(text ?? '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const rows = [];
  const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i += 1) {
    const fields = parseCsvLine(lines[i]);
    if (!fields[0] || !/^\d+$/.test(fields[0].trim())) continue;
    const customer = mapCsvFieldsToCustomer(fields);
    if (customer) rows.push(customer);
  }

  return rows;
}

/**
 * Ensure unique customer names when importing (CSV duplicates / same name, different city).
 */
export function dedupeImportNames(rows, existingNamesLower = new Set()) {
  const used = new Set(existingNamesLower);
  const result = [];

  for (const row of rows) {
    let name = row.name;
    const baseKey = name.toLowerCase();

    if (used.has(baseKey)) {
      const city = row.address_line1;
      if (city) {
        const withCity = `${name} (${city})`;
        if (!used.has(withCity.toLowerCase())) {
          name = withCity;
        } else {
          let n = 2;
          while (used.has(`${name} (${n})`.toLowerCase())) n += 1;
          name = `${name} (${n})`;
        }
      } else {
        let n = 2;
        while (used.has(`${name} (${n})`.toLowerCase())) n += 1;
        name = `${name} (${n})`;
      }
    }

    used.add(name.toLowerCase());
    if (row.gstin) {
      used.add(`gst:${row.gstin.toUpperCase()}`);
    }
    result.push({ ...row, name });
  }

  return result;
}
