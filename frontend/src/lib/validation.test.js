import { describe, expect, it } from "vitest";
import {
  assertValidCustomerData,
  normalizeName,
  validateCompanySettingsData,
  validateCustomerData,
  validateEmail,
  validateGstin,
  validateIfsc,
  validatePhone,
} from "./validation";

describe("normalizeName", () => {
  it("trims whitespace", () => {
    expect(normalizeName("  Acme  ")).toBe("Acme");
  });

  it("handles nullish values", () => {
    expect(normalizeName(null)).toBe("");
  });
});

describe("validateGstin", () => {
  it("accepts empty GSTIN", () => {
    expect(validateGstin("")).toBeNull();
  });

  it("accepts valid GSTIN", () => {
    expect(validateGstin("24AAFPL5557N1ZA")).toBeNull();
  });

  it("rejects invalid GSTIN", () => {
    expect(validateGstin("INVALID")).toMatch(/15 characters/);
  });
});

describe("validatePhone", () => {
  it("accepts empty phone", () => {
    expect(validatePhone("")).toBeNull();
  });

  it("accepts 10 digit phone", () => {
    expect(validatePhone("9876543210")).toBeNull();
  });

  it("accepts formatted phone numbers", () => {
    expect(validatePhone("079 2217 4580")).toBeNull();
  });

  it("rejects too few digits", () => {
    expect(validatePhone("12345")).toMatch(/10–15 digits/);
  });

  it("accepts multiple comma-separated numbers when allowMultiple", () => {
    expect(
      validatePhone("079 22174580, 9374159220, 9426029197", { allowMultiple: true })
    ).toBeNull();
  });

  it("rejects invalid segment in multiple mode", () => {
    expect(validatePhone("9876543210, 12345", { allowMultiple: true })).toMatch(
      /Each phone number/
    );
  });
});

describe("validateEmail", () => {
  it("accepts empty email", () => {
    expect(validateEmail("")).toBeNull();
  });

  it("accepts valid email", () => {
    expect(validateEmail("user@example.com")).toBeNull();
  });

  it("rejects invalid email", () => {
    expect(validateEmail("not-an-email")).toMatch(/valid email/);
  });
});

describe("validateIfsc", () => {
  it("accepts valid IFSC", () => {
    expect(validateIfsc("KKBK0002580")).toBeNull();
  });

  it("rejects invalid IFSC", () => {
    expect(validateIfsc("BAD")).toMatch(/11 characters/);
  });
});

describe("validateCustomerData", () => {
  it("requires customer name", () => {
    expect(validateCustomerData({ name: "  " })).toEqual({
      name: "Customer name is required.",
    });
  });

  it("returns no errors for valid customer", () => {
    expect(
      validateCustomerData({
        name: "Acme Corp",
        gstin: "24AAFPL5557N1ZA",
        phone: "9876543210",
      })
    ).toEqual({});
  });
});

describe("validateCompanySettingsData", () => {
  it("requires company name and valid tax rates", () => {
    const errors = validateCompanySettingsData({
      company_name: "",
      cgst_rate: -1,
      sgst_rate: 2.5,
      igst_rate: 5,
    });

    expect(errors.company_name).toBeTruthy();
    expect(errors.tax).toBeTruthy();
  });

  it("passes for valid company settings with multiple phones", () => {
    expect(
      validateCompanySettingsData({
        company_name: "KAMAL READYMADE STORES",
        gstin: "24AAFPL5557N1ZA",
        phone: "079 22174580, 9374159220, 9426029197",
        email: "suresh@example.com",
        bank_ifsc: "KKBK0002580",
        cgst_rate: 2.5,
        sgst_rate: 2.5,
        igst_rate: 5,
      })
    ).toEqual({});
  });
});

describe("assertValidCustomerData", () => {
  it("throws with first validation error", () => {
    expect(() => assertValidCustomerData({ name: "" })).toThrow(
      "Customer name is required."
    );
  });
});
