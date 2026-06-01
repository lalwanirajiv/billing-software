import { describe, expect, it } from "vitest";
import { buildFinalBillNo } from "./api";

describe("buildFinalBillNo", () => {
  it("returns empty string for blank bill numbers", () => {
    expect(buildFinalBillNo("")).toBe("");
    expect(buildFinalBillNo("   ")).toBe("");
  });

  it("prefixes numeric bill numbers with financial year from invoice date", () => {
    const billNo = buildFinalBillNo("42", "2025-06-01");

    expect(billNo).toBe("2025-2026_42");
  });

  it("uses previous financial year for dates before April", () => {
    const billNo = buildFinalBillNo("7", "2026-02-15");

    expect(billNo).toBe("2025-2026_7");
  });

  it("preserves already formatted bill numbers", () => {
    expect(buildFinalBillNo("2024-2025_99", "2025-06-01")).toBe("2024-2025_99");
  });

  it("strips leading zeros from numeric sequences", () => {
    expect(buildFinalBillNo("007", "2025-08-01")).toBe("2025-2026_7");
  });
});
