import { describe, it, expect } from 'vitest';
import { getPageMeta } from './pageMeta';

describe('getPageMeta', () => {
  it('returns Add new customer for create-customer route', () => {
    expect(getPageMeta('/create-customer').title).toBe('Add new customer');
  });

  it('returns Create new invoice for invoice-form route', () => {
    expect(getPageMeta('/invoice-form').title).toBe('Create new invoice');
  });

  it('does not treat invoice-form as view invoice', () => {
    expect(getPageMeta('/invoice-form').title).not.toBe('View invoice');
  });

  it('returns Customers for list route', () => {
    expect(getPageMeta('/customers').title).toBe('Customers');
  });
});
