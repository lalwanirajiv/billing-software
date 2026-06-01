import { describe, it, expect } from 'vitest';
import { buildSupplyMixFromMetrics } from './supplyMixUtils';

describe('buildSupplyMixFromMetrics', () => {
  it('builds shares from metrics', () => {
    const mix = buildSupplyMixFromMetrics({
      state_count: 3,
      interstate_count: 1,
      state_amount: 3000,
      interstate_amount: 1000,
      total_invoices: 4,
      total_amount: 4000,
    });
    expect(mix.intra.count).toBe(3);
    expect(mix.inter.count).toBe(1);
    expect(mix.intra.amountShare).toBe(75);
    expect(mix.inter.amountShare).toBe(25);
    expect(mix.isEmpty).toBe(false);
  });

  it('marks empty when no activity', () => {
    const mix = buildSupplyMixFromMetrics({});
    expect(mix.isEmpty).toBe(true);
  });
});
