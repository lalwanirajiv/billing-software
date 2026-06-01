import { describe, expect, it } from "vitest";
import { calculateInvoiceTax, DEFAULT_COMPANY_SETTINGS } from "./companySettings";

const settings = {
  cgst_rate: 2.5,
  sgst_rate: 2.5,
  igst_rate: 5,
};

describe("calculateInvoiceTax", () => {
  it("applies CGST and SGST for intra-state sales", () => {
    const result = calculateInvoiceTax(1000, "State", settings);

    expect(result.cgst).toBe(25);
    expect(result.sgst).toBe(25);
    expect(result.igst).toBe(0);
  });

  it("applies IGST for interstate sales", () => {
    const result = calculateInvoiceTax(1000, "Interstate", settings);

    expect(result.cgst).toBe(0);
    expect(result.sgst).toBe(0);
    expect(result.igst).toBe(50);
  });

  it("treats interstate case-insensitively", () => {
    const result = calculateInvoiceTax(200, "interstate", settings);

    expect(result.igst).toBe(10);
    expect(result.cgst).toBe(0);
  });

  it("uses default rates when settings are missing", () => {
    const result = calculateInvoiceTax(1000, "State", {});

    expect(result.cgst).toBe(1000 * (DEFAULT_COMPANY_SETTINGS.cgst_rate / 100));
    expect(result.sgst).toBe(1000 * (DEFAULT_COMPANY_SETTINGS.sgst_rate / 100));
  });

  it("handles zero subtotal", () => {
    const result = calculateInvoiceTax(0, "State", settings);

    expect(result).toEqual({ cgst: 0, sgst: 0, igst: 0 });
  });
});
