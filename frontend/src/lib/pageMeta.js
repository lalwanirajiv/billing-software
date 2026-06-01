/**
 * Single source of truth for nav section, page <h1> titles, and document.title.
 * Order matters: more specific paths must come before broader patterns.
 */

const ROUTES = [
  { match: (p) => p === '/', meta: { navKey: 'dashboard', title: 'Dashboard', eyebrow: 'Business overview' } },

  { match: (p) => p === '/invoice-form', meta: { navKey: 'invoices', title: 'Create new invoice', eyebrow: 'New invoice' } },
  {
    match: (p) => /^\/invoice-form\/.+/.test(p),
    meta: { navKey: 'invoices', title: 'Edit invoice', eyebrow: 'Update invoice' },
  },
  { match: (p) => p === '/invoices', meta: { navKey: 'invoices', title: 'Invoices', eyebrow: 'Invoice directory' } },
  {
    match: (p) => /^\/invoice\/.+/.test(p),
    meta: { navKey: 'invoices', title: 'View invoice', eyebrow: 'Tax invoice' },
  },
  { match: (p) => p === '/invoice', meta: { navKey: 'invoices', title: 'View invoice', eyebrow: 'Tax invoice' } },

  { match: (p) => p === '/create-customer', meta: { navKey: 'customers', title: 'Add new customer', eyebrow: 'New customer' } },
  {
    match: (p) => /^\/edit-customer\/.+/.test(p),
    meta: { navKey: 'customers', title: 'Edit customer', eyebrow: 'Update customer' },
  },
  { match: (p) => p === '/customers', meta: { navKey: 'customers', title: 'Customers', eyebrow: 'Customer directory' } },
  {
    match: (p) => /^\/customer\/.+/.test(p),
    meta: { navKey: 'customers', title: 'Customer account', eyebrow: 'Customer details' },
  },

  { match: (p) => p === '/reports', meta: { navKey: 'reports', title: 'Reports', eyebrow: 'Analytics & exports' } },
  { match: (p) => p === '/settings', meta: { navKey: 'settings', title: 'Settings', eyebrow: 'Company & backup' } },
];

const FALLBACK = { navKey: null, title: 'Billing Software', eyebrow: '' };

export function getPageMeta(pathname) {
  const path = (pathname || '/').split('?')[0].replace(/\/$/, '') || '/';
  for (const { match, meta } of ROUTES) {
    if (match(path)) return { ...meta };
  }
  return { ...FALLBACK };
}

export function buildDocumentTitle(pageTitle, companyName) {
  const company = (companyName || '').trim();
  if (pageTitle && company) return `${pageTitle} · ${company}`;
  return pageTitle || company || 'Billing Software';
}
