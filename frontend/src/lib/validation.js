/** Shared field validators — empty optional fields pass. */

const GSTIN_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeName(value) {
  return String(value ?? "").trim();
}

export function validateGstin(gstin) {
  const value = normalizeName(gstin).toUpperCase();
  if (!value) return null;
  if (value.length !== 15 || !GSTIN_REGEX.test(value)) {
    return "GSTIN must be 15 characters in valid format (e.g. 22AAAAA0000A1Z5).";
  }
  return null;
}

export function validatePhone(phone) {
  const value = normalizeName(phone);
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return "Phone must contain 10–15 digits.";
  }
  return null;
}

export function validateEmail(email) {
  const value = normalizeName(email);
  if (!value) return null;
  if (!EMAIL_REGEX.test(value)) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validateIfsc(ifsc) {
  const value = normalizeName(ifsc).toUpperCase();
  if (!value) return null;
  if (value.length !== 11 || !IFSC_REGEX.test(value)) {
    return "IFSC must be 11 characters (e.g. KKBK0002580).";
  }
  return null;
}

export function validateCustomerData(data) {
  const errors = {};
  const name = normalizeName(data.name);

  if (!name) {
    errors.name = "Customer name is required.";
  }

  const gstinError = validateGstin(data.gstin);
  if (gstinError) errors.gstin = gstinError;

  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;

  return errors;
}

export function validateCompanySettingsData(data) {
  const errors = {};

  if (!normalizeName(data.company_name)) {
    errors.company_name = "Company name is required.";
  }

  const gstinError = validateGstin(data.gstin);
  if (gstinError) errors.gstin = gstinError;

  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const ifscError = validateIfsc(data.bank_ifsc);
  if (ifscError) errors.bank_ifsc = ifscError;

  const cgst = Number(data.cgst_rate);
  const sgst = Number(data.sgst_rate);
  const igst = Number(data.igst_rate);

  if ([cgst, sgst, igst].some((rate) => Number.isNaN(rate) || rate < 0)) {
    errors.tax = "Tax rates must be valid non-negative numbers.";
  }

  return errors;
}

export function assertValidCustomerData(data) {
  const errors = validateCustomerData(data);
  const first = Object.values(errors)[0];
  if (first) throw new Error(first);
}

export function assertValidCompanySettingsData(data) {
  const errors = validateCompanySettingsData(data);
  const first = Object.values(errors)[0];
  if (first) throw new Error(first);
}
