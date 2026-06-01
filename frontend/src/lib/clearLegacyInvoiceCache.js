/** One-time cleanup of deprecated invoice cache keys (Step 8). */
const LEGACY_INVOICE_CACHE_KEYS = ["invoice-data", "customer-data", "invoiceData"];

export function clearLegacyInvoiceCache() {
  for (const key of LEGACY_INVOICE_CACHE_KEYS) {
    localStorage.removeItem(key);
  }
}
