import React from "react";
import { Building2, Landmark, Percent } from "lucide-react";

export const setupInputClass =
  "w-full p-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";

export const setupLabelClass =
  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <section className="bg-gray-50 dark:bg-gray-700/50 p-5 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex items-start gap-3">
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2.5 rounded-xl shrink-0">
          <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function CompanySetupForm({ formData, onChange }) {
  return (
    <div className="space-y-6">
      <SectionCard
        icon={Building2}
        title="Company Profile"
        description="Seller details that appear on every invoice."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="company_name" className={setupLabelClass}>
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              id="company_name"
              name="company_name"
              value={formData.company_name || ""}
              onChange={onChange}
              className={setupInputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="address_line1" className={setupLabelClass}>Address Line 1</label>
            <input
              id="address_line1"
              name="address_line1"
              value={formData.address_line1 || ""}
              onChange={onChange}
              className={setupInputClass}
            />
          </div>
          <div>
            <label htmlFor="address_line2" className={setupLabelClass}>Address Line 2</label>
            <input
              id="address_line2"
              name="address_line2"
              value={formData.address_line2 || ""}
              onChange={onChange}
              className={setupInputClass}
            />
          </div>
          <div>
            <label htmlFor="gstin" className={setupLabelClass}>GSTIN</label>
            <input
              id="gstin"
              name="gstin"
              value={formData.gstin || ""}
              onChange={onChange}
              className={setupInputClass}
              placeholder="e.g., 22AAAAA0000A1Z5"
            />
          </div>
          <div>
            <label htmlFor="phone" className={setupLabelClass}>Contact Numbers</label>
            <input
              id="phone"
              name="phone"
              value={formData.phone || ""}
              onChange={onChange}
              className={setupInputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className={setupLabelClass}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={onChange}
              className={setupInputClass}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={Landmark}
        title="Bank & Terms"
        description="Payment details and terms printed on invoices."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="bank_name" className={setupLabelClass}>Bank Name</label>
            <input
              id="bank_name"
              name="bank_name"
              value={formData.bank_name || ""}
              onChange={onChange}
              className={setupInputClass}
            />
          </div>
          <div>
            <label htmlFor="bank_account" className={setupLabelClass}>Account Number</label>
            <input
              id="bank_account"
              name="bank_account"
              value={formData.bank_account || ""}
              onChange={onChange}
              className={setupInputClass}
            />
          </div>
          <div>
            <label htmlFor="bank_ifsc" className={setupLabelClass}>IFSC Code</label>
            <input
              id="bank_ifsc"
              name="bank_ifsc"
              value={formData.bank_ifsc || ""}
              onChange={onChange}
              className={setupInputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="terms_line1" className={setupLabelClass}>Terms & Conditions — Line 1</label>
            <input
              id="terms_line1"
              name="terms_line1"
              value={formData.terms_line1 || ""}
              onChange={onChange}
              className={setupInputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="terms_line2" className={setupLabelClass}>Terms & Conditions — Line 2</label>
            <input
              id="terms_line2"
              name="terms_line2"
              value={formData.terms_line2 || ""}
              onChange={onChange}
              className={setupInputClass}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={Percent}
        title="Tax Configuration"
        description="Default GST rates for new invoices. Interstate uses IGST; intra-state uses CGST + SGST."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="default_state_label" className={setupLabelClass}>Intra-State Label</label>
            <input
              id="default_state_label"
              name="default_state_label"
              value={formData.default_state_label || "State"}
              onChange={onChange}
              className={setupInputClass}
              placeholder="State"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Shown in the invoice sale type dropdown.
            </p>
          </div>
          <div>
            <label htmlFor="cgst_rate" className={setupLabelClass}>CGST Rate (%)</label>
            <input
              id="cgst_rate"
              name="cgst_rate"
              type="number"
              min="0"
              step="0.01"
              value={formData.cgst_rate ?? ""}
              onChange={onChange}
              className={setupInputClass}
            />
          </div>
          <div>
            <label htmlFor="sgst_rate" className={setupLabelClass}>SGST Rate (%)</label>
            <input
              id="sgst_rate"
              name="sgst_rate"
              type="number"
              min="0"
              step="0.01"
              value={formData.sgst_rate ?? ""}
              onChange={onChange}
              className={setupInputClass}
            />
          </div>
          <div>
            <label htmlFor="igst_rate" className={setupLabelClass}>IGST Rate (%)</label>
            <input
              id="igst_rate"
              name="igst_rate"
              type="number"
              min="0"
              step="0.01"
              value={formData.igst_rate ?? ""}
              onChange={onChange}
              className={setupInputClass}
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
