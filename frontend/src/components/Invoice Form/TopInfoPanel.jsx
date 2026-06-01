import React from 'react';
import { Link } from 'react-router-dom';
import { User, FileText, Calculator, UserPlus } from 'lucide-react';
import {
  formLabelClass,
  formInputClass,
  formSectionClass,
  formHintClass,
} from '../Reusables/formStyles';
import FieldError from '../Reusables/FieldError';
import { formatINR } from '../Dashboard/dashboardUtils';

const SectionTitle = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 pb-1">
    <Icon size={18} className="text-brand-primary shrink-0" />
    <h2 className="text-base font-semibold text-slate-900">{children}</h2>
  </div>
);

const TopInfoPanel = ({
  formData,
  handleChange,
  totals,
  handleSuggestionClick,
  isSuggestionsVisible,
  setIsSuggestionsVisible,
  isLoadingCustomers,
  filteredCustomers,
  intraStateLabel = 'State',
  cgstRate = 2.5,
  sgstRate = 2.5,
  igstRate = 5,
  errors = {},
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    {/* Customer */}
    <section className={formSectionClass}>
      <SectionTitle icon={User}>Customer</SectionTitle>

      <div>
        <label htmlFor="customer-search" className={formLabelClass}>
          Customer name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="customer-search"
            type="text"
            name="shipTo"
            value={formData.shipTo}
            onChange={handleChange}
            onFocus={() => setIsSuggestionsVisible(true)}
            onBlur={() => setTimeout(() => setIsSuggestionsVisible(false), 150)}
            className={formInputClass(Boolean(errors.shipTo))}
            disabled={isLoadingCustomers}
            autoComplete="off"
            placeholder={isLoadingCustomers ? 'Loading…' : 'Search existing customers'}
          />
          {isSuggestionsVisible && (
            <ul className="absolute z-20 w-full bg-white border border-slate-200 rounded-xl mt-1 max-h-56 overflow-y-auto shadow-lg">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <li key={customer.customer_id}>
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2.5 text-sm text-slate-800 hover:bg-brand-primary hover:text-white transition-colors"
                      onMouseDown={() => handleSuggestionClick(customer)}
                    >
                      {customer.name}
                      {customer.gstin && (
                        <span className="block text-xs opacity-70 font-mono">{customer.gstin}</span>
                      )}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-slate-500">No customers found</li>
              )}
              <li className="border-t border-slate-100">
                <Link
                  to="/create-customer"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-brand-primary hover:bg-slate-50"
                >
                  <UserPlus size={16} />
                  Add new customer
                </Link>
              </li>
            </ul>
          )}
        </div>
        <FieldError message={errors.shipTo} />
      </div>

      <div>
        <label htmlFor="address_line1" className={formLabelClass}>
          Address
        </label>
        <input
          id="address_line1"
          type="text"
          name="address_line1"
          value={formData.address_line1}
          readOnly
          className={formInputClass(false, true)}
          placeholder="Filled from customer"
        />
        {formData.address_line2 && (
          <input
            type="text"
            name="address_line2"
            value={formData.address_line2}
            readOnly
            className={`${formInputClass(false, true)} mt-2`}
          />
        )}
      </div>

      <div>
        <label htmlFor="gstin" className={formLabelClass}>
          Customer GSTIN
        </label>
        <input
          id="gstin"
          type="text"
          name="gstin"
          value={formData.gstin || ''}
          readOnly
          className={`${formInputClass(false, true)} font-mono uppercase`}
          placeholder="—"
        />
      </div>
    </section>

    {/* Invoice meta */}
    <section className={formSectionClass}>
      <SectionTitle icon={FileText}>Invoice details</SectionTitle>

      <div>
        <label htmlFor="billNo" className={formLabelClass}>
          Bill number <span className="text-red-500">*</span>
        </label>
        <input
          id="billNo"
          type="text"
          name="billNo"
          value={formData.billNo}
          onChange={handleChange}
          className={formInputClass(Boolean(errors.billNo))}
          placeholder="Auto-generated"
        />
        <FieldError message={errors.billNo} />
      </div>

      <div>
        <label htmlFor="date" className={formLabelClass}>
          Invoice date <span className="text-red-500">*</span>
        </label>
        <input
          id="date"
          type="date"
          name="date"
          value={formData.date || ''}
          onChange={handleChange}
          className={formInputClass(Boolean(errors.date))}
        />
        <FieldError message={errors.date} />
      </div>

      <div>
        <label htmlFor="terms" className={formLabelClass}>
          Payment terms
        </label>
        <input
          id="terms"
          type="text"
          name="terms"
          value={formData.terms || '30 Days'}
          onChange={handleChange}
          className={formInputClass(false)}
          placeholder="e.g. 30 Days"
        />
      </div>

      <div>
        <label htmlFor="state" className={formLabelClass}>
          Sale type
        </label>
        <select
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className={formInputClass(false)}
        >
          <option value={intraStateLabel}>{intraStateLabel} (CGST + SGST)</option>
          <option value="Interstate">Interstate (IGST)</option>
        </select>
        <p className={formHintClass}>Determines which GST columns apply.</p>
      </div>
    </section>

    {/* Totals */}
    <section className={`${formSectionClass} flex flex-col`}>
      <SectionTitle icon={Calculator}>Totals</SectionTitle>

      <div className="flex-1 space-y-2.5 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-medium text-slate-900 tabular-nums">
            {formatINR(totals.sub_total)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>CGST @{cgstRate}%</span>
          <span className="tabular-nums">{formatINR(totals.cgst)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>SGST @{sgstRate}%</span>
          <span className="tabular-nums">{formatINR(totals.sgst)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>IGST @{igstRate}%</span>
          <span className="tabular-nums">{formatINR(totals.igst)}</span>
        </div>
        {totals.adjustment !== 0 && (
          <div className="flex justify-between text-slate-500 text-xs">
            <span>Rounding</span>
            <span className="tabular-nums">{formatINR(totals.adjustment)}</span>
          </div>
        )}

        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 mt-2">
          <label htmlFor="discount" className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
            Discount (₹)
          </label>
          <input
            id="discount"
            type="number"
            name="discount"
            min="0"
            step="0.01"
            value={formData.discount}
            onChange={handleChange}
            className="mt-1.5 w-full px-3 py-2 rounded-lg border border-emerald-200 bg-white text-right font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="0"
          />
          <FieldError message={errors.discount} />
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-200">
        <span className="text-base font-semibold text-slate-900">Grand total</span>
        <span className="text-2xl font-bold text-brand-primary tabular-nums">
          {formatINR(totals.grand_total)}
        </span>
      </div>
      <p className="text-xs text-slate-400">
        Qty total: {totals.totalQty || 0} units
      </p>
    </section>
  </div>
);

export default TopInfoPanel;
