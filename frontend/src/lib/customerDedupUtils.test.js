import { describe, it, expect } from 'vitest';
import {
  customerMatchKeys,
  customerRowAlreadyExists,
  buildExistingCustomerMatchIndex,
} from './customerDedupUtils';

describe('customerRowAlreadyExists', () => {
  it('matches by GSTIN even when name differs slightly', () => {
    const index = buildExistingCustomerMatchIndex([
      { name: 'ASHOK KUMAR', gstin: '24AADPH3346R1ZH' },
    ]);
    expect(
      customerRowAlreadyExists(
        { name: 'ASHOK KUMAR PARSHOTAMDAS', gstin: '24AADPH3346R1ZH' },
        index
      )
    ).toBe(true);
  });

  it('matches exact name', () => {
    const index = buildExistingCustomerMatchIndex([
      { name: 'Test Shop', gstin: null },
    ]);
    expect(customerRowAlreadyExists({ name: 'Test Shop', gstin: null }, index)).toBe(
      true
    );
  });
});

describe('customerMatchKeys', () => {
  it('includes name and gst keys', () => {
    const keys = customerMatchKeys({ name: 'A', gstin: '24AADPH3346R1ZH' });
    expect(keys.has('a')).toBe(true);
    expect(keys.has('gst:24AADPH3346R1ZH')).toBe(true);
  });
});
