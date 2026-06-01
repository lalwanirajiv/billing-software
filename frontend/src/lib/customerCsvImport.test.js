import { describe, it, expect } from 'vitest';
import {
  parseCsvLine,
  extractGstin,
  mapCsvFieldsToCustomer,
  parseCustomerCsv,
  dedupeImportNames,
} from './customerCsvImport';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

describe('extractGstin', () => {
  it('extracts from PAN-prefixed values', () => {
    expect(extractGstin('PAN : CSAPS7183J')).toBeNull();
    expect(extractGstin('24AADPH3346R1ZH')).toBe('24AADPH3346R1ZH');
  });
});

describe('mapCsvFieldsToCustomer', () => {
  it('parses a standard row', () => {
    const row = mapCsvFieldsToCustomer(
      parseCsvLine('1,ASHOK KUMAR,AHMEDABAD,-,24AADPH3346R1ZH,')
    );
    expect(row.name).toBe('ASHOK KUMAR');
    expect(row.address_line1).toBe('AHMEDABAD');
    expect(row.gstin).toBe('24AADPH3346R1ZH');
  });

  it('parses quoted address with commas', () => {
    const row = mapCsvFieldsToCustomer(
      parseCsvLine('100,CASH & CARRY,"36, MARWARI ROAD",BHOPAL-462001,23AGWPK4917A2ZG,')
    );
    expect(row.address_line1).toBe('36, MARWARI ROAD');
    expect(row.address_line2).toBe('BHOPAL-462001');
    expect(row.gstin).toBe('23AGWPK4917A2ZG');
  });
});

describe('bundled customer CSV', () => {
  it('parses all data rows from the project file', () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const csvPath = path.join(dir, '../../public/data/customers-bulk-import.csv');
    const text = readFileSync(csvPath, 'utf-8');
    const rows = parseCustomerCsv(text);
    expect(rows.length).toBe(101);
    const withGst = rows.filter((r) => r.gstin).length;
    expect(withGst).toBeGreaterThan(50);
  });

  it('dedupes duplicate names in CSV', () => {
    const rows = [
      { name: 'KUNAL TRADERS', address_line1: 'BARDOLI', address_line2: null, gstin: null, phone: null },
      { name: 'KUNAL TRADERS', address_line1: 'BARDOLI', address_line2: null, gstin: null, phone: null },
    ];
    const out = dedupeImportNames(rows, new Set());
    expect(out[0].name).toBe('KUNAL TRADERS');
    expect(out[1].name).toBe('KUNAL TRADERS (BARDOLI)');
  });
});
