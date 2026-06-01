import { normalizeName } from './validation';

/** Keys used to detect the same customer across imports. */
export function customerMatchKeys(customerOrRow) {
  const keys = new Set();
  const name = normalizeName(customerOrRow.name);
  if (name) {
    keys.add(name.toLowerCase());
  }
  const gstin = normalizeName(customerOrRow.gstin).toUpperCase();
  if (gstin) {
    keys.add(`gst:${gstin}`);
  }
  return keys;
}

export function buildExistingCustomerMatchIndex(customers) {
  const index = new Set();
  for (const customer of customers) {
    for (const key of customerMatchKeys(customer)) {
      index.add(key);
    }
  }
  return index;
}

export function customerRowAlreadyExists(row, matchIndex) {
  for (const key of customerMatchKeys(row)) {
    if (matchIndex.has(key)) return true;
  }
  return false;
}

/**
 * Score which duplicate row to keep (higher is better).
 */
export function scoreCustomerRecord(customer, invoiceCount = 0) {
  let score = 0;
  score += invoiceCount * 1000;
  if (customer.gstin) score += 50;
  if (customer.phone_number) score += 20;
  if (customer.address_line1) score += 10;
  if (customer.address_line2) score += 5;
  // Prefer older record (first import)
  score -= Number(customer.customer_id) || 0;
  return score;
}
