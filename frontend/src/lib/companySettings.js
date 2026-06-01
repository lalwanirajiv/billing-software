import { getDB, withTransaction } from "./database";
import {
  assertValidCompanySettingsData,
  normalizeName,
} from "./validation";

export const DEFAULT_COMPANY_SETTINGS = {
  company_name: "KAMAL READYMADE STORES",
  address_line1: "Shop No 7, 1st Floor Deluxe Chamber",
  address_line2: "Mirghawad Ahmedabad - 380001",
  gstin: "24AAFPL5557N1ZA",
  phone: "079 22174580, 9374159220, 9426029197",
  email: "sureshklalwani1@gmail.com",
  bank_name: "KOTAK MAHINDRA BANK",
  bank_account: "4413075389",
  bank_ifsc: "KKBK0002580",
  terms_line1: "Goods once sold will not be taken back.",
  terms_line2:
    "Interest @18% p.a. will be charged if payment is not made within the due date.",
  default_state_label: "State",
  cgst_rate: 2.5,
  sgst_rate: 2.5,
  igst_rate: 5.0,
  setup_completed: false,
};

function mapRow(row) {
  if (!row) return { ...DEFAULT_COMPANY_SETTINGS };
  return {
    company_name: row.company_name ?? DEFAULT_COMPANY_SETTINGS.company_name,
    address_line1: row.address_line1 ?? "",
    address_line2: row.address_line2 ?? "",
    gstin: row.gstin ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    bank_name: row.bank_name ?? "",
    bank_account: row.bank_account ?? "",
    bank_ifsc: row.bank_ifsc ?? "",
    terms_line1: row.terms_line1 ?? "",
    terms_line2: row.terms_line2 ?? "",
    default_state_label: row.default_state_label ?? "State",
    cgst_rate: Number(row.cgst_rate ?? DEFAULT_COMPANY_SETTINGS.cgst_rate),
    sgst_rate: Number(row.sgst_rate ?? DEFAULT_COMPANY_SETTINGS.sgst_rate),
    igst_rate: Number(row.igst_rate ?? DEFAULT_COMPANY_SETTINGS.igst_rate),
    setup_completed: Boolean(Number(row.setup_completed ?? 0)),
  };
}

function validateCompanySettings(data) {
  assertValidCompanySettingsData(data);

  const cgst = Number(data.cgst_rate);
  const sgst = Number(data.sgst_rate);
  const igst = Number(data.igst_rate);

  return { cgst, sgst, igst };
}

function companySettingsParams(data, { cgst, sgst, igst }) {
  const gstin = normalizeName(data.gstin).toUpperCase() || null;
  const bankIfsc = normalizeName(data.bank_ifsc).toUpperCase() || null;

  return [
    normalizeName(data.company_name),
    data.address_line1?.trim() || null,
    data.address_line2?.trim() || null,
    gstin,
    data.phone?.trim() || null,
    data.email?.trim() || null,
    data.bank_name?.trim() || null,
    data.bank_account?.trim() || null,
    bankIfsc,
    data.terms_line1?.trim() || null,
    data.terms_line2?.trim() || null,
    data.default_state_label?.trim() || "State",
    cgst,
    sgst,
    igst,
  ];
}

export function calculateInvoiceTax(subTotal, state, settings) {
  const taxable = Number(subTotal) || 0;
  const isInterstate = String(state || "").toLowerCase() === "interstate";
  const cgstRate = Number(settings?.cgst_rate ?? DEFAULT_COMPANY_SETTINGS.cgst_rate) / 100;
  const sgstRate = Number(settings?.sgst_rate ?? DEFAULT_COMPANY_SETTINGS.sgst_rate) / 100;
  const igstRate = Number(settings?.igst_rate ?? DEFAULT_COMPANY_SETTINGS.igst_rate) / 100;

  if (isInterstate) {
    return { cgst: 0, sgst: 0, igst: taxable * igstRate };
  }

  return {
    cgst: taxable * cgstRate,
    sgst: taxable * sgstRate,
    igst: 0,
  };
}

export async function getCompanySettings() {
  const db = await getDB();
  const rows = await db.select(`SELECT * FROM company_settings WHERE id = 1`);
  return mapRow(rows[0]);
}

export async function updateCompanySettings(data) {
  const rates = validateCompanySettings(data);

  return withTransaction(async (db) => {
    await db.execute(
      `UPDATE company_settings SET
        company_name = $1,
        address_line1 = $2,
        address_line2 = $3,
        gstin = $4,
        phone = $5,
        email = $6,
        bank_name = $7,
        bank_account = $8,
        bank_ifsc = $9,
        terms_line1 = $10,
        terms_line2 = $11,
        default_state_label = $12,
        cgst_rate = $13,
        sgst_rate = $14,
        igst_rate = $15,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1`,
      companySettingsParams(data, rates)
    );

    return { message: "Company settings updated successfully" };
  });
}

/** Saves company settings and marks first-time setup as complete. */
export async function completeInitialSetup(data) {
  const rates = validateCompanySettings(data);

  return withTransaction(async (db) => {
    await db.execute(
      `UPDATE company_settings SET
        company_name = $1,
        address_line1 = $2,
        address_line2 = $3,
        gstin = $4,
        phone = $5,
        email = $6,
        bank_name = $7,
        bank_account = $8,
        bank_ifsc = $9,
        terms_line1 = $10,
        terms_line2 = $11,
        default_state_label = $12,
        cgst_rate = $13,
        sgst_rate = $14,
        igst_rate = $15,
        setup_completed = 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1`,
      companySettingsParams(data, rates)
    );

    return { message: "Initial setup completed successfully" };
  });
}
