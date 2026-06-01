import { describe, expect, it } from 'vitest';
import {
  getFyStartYearFromDate,
  getFyRangeFromStartYear,
  dateInRange,
  invoiceInFinancialYear,
  buildFyYearList,
} from './financialYear';

describe('financialYear', () => {
  it('uses April as FY start', () => {
    expect(getFyStartYearFromDate('2025-03-15')).toBe(2024);
    expect(getFyStartYearFromDate('2025-04-01')).toBe(2025);
  });

  it('builds FY range', () => {
    const fy = getFyRangeFromStartYear(2024);
    expect(fy.startDate).toBe('2024-04-01');
    expect(fy.endDate).toBe('2025-03-31');
    expect(fy.label).toBe('FY 2024–25');
  });

  it('filters invoices by date', () => {
    const fy = getFyRangeFromStartYear(2025);
    expect(
      invoiceInFinancialYear({ date: '2025-06-01' }, fy.startDate, fy.endDate)
    ).toBe(true);
    expect(
      invoiceInFinancialYear({ date: '2024-12-01' }, fy.startDate, fy.endDate)
    ).toBe(false);
  });

  it('lists unique FY years sorted newest first', () => {
    const list = buildFyYearList([2023, 2025, 2025]);
    expect(list[0].startYear).toBeGreaterThanOrEqual(list[list.length - 1].startYear);
    expect(list.some((f) => f.startYear === 2025)).toBe(true);
  });

  it('dateInRange handles ISO dates', () => {
    expect(dateInRange('2025-04-01', '2025-04-01', '2026-03-31')).toBe(true);
  });
});
