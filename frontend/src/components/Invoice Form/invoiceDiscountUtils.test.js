import { describe, it, expect } from 'vitest';
import {
  resolveDiscountAmount,
  validateDiscount,
  convertDiscountValue,
  DISCOUNT_TYPES,
} from './invoiceDiscountUtils';

describe('resolveDiscountAmount', () => {
  it('computes percent of subtotal', () => {
    expect(resolveDiscountAmount(1000, DISCOUNT_TYPES.PERCENT, 10)).toBe(100);
  });

  it('caps amount at subtotal', () => {
    expect(resolveDiscountAmount(500, DISCOUNT_TYPES.AMOUNT, 800)).toBe(500);
  });
});

describe('validateDiscount', () => {
  it('rejects percent over 100', () => {
    expect(validateDiscount(DISCOUNT_TYPES.PERCENT, 101, 1000)).toMatch(/100/);
  });
});

describe('convertDiscountValue', () => {
  it('converts amount to percent', () => {
    expect(convertDiscountValue(1000, DISCOUNT_TYPES.AMOUNT, DISCOUNT_TYPES.PERCENT, 100)).toBe(10);
  });
});
