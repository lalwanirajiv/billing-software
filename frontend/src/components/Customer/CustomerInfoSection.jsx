import React from 'react';
import { User } from 'lucide-react';
import {
  formLabelClass,
  formInputClass,
  formSectionClass,
  formHintClass,
} from './customerFormStyles';
import FieldError from './FieldError';

const CustomerInfoSection = ({ customerData, handleChange, errors = {} }) => (
  <section className={formSectionClass}>
    <div className="flex items-center gap-2">
      <User size={18} className="text-brand-primary" />
      <h2 className="text-base font-semibold text-slate-900">Customer details</h2>
    </div>

    <div>
      <label htmlFor="name" className={formLabelClass}>
        Customer name <span className="text-red-500">*</span>
      </label>
      <input
        id="name"
        type="text"
        name="name"
        placeholder="e.g. Acme Corporation"
        value={customerData.name}
        onChange={handleChange}
        autoComplete="organization"
        className={formInputClass(Boolean(errors.name))}
      />
      <FieldError message={errors.name} />
    </div>

    <div>
      <label htmlFor="phone" className={formLabelClass}>
        Phone number
      </label>
      <input
        id="phone"
        type="tel"
        name="phone"
        placeholder="e.g. 9876543210"
        value={customerData.phone}
        onChange={handleChange}
        autoComplete="tel"
        className={formInputClass(Boolean(errors.phone))}
      />
      <FieldError message={errors.phone} />
      <p className={formHintClass}>Used on invoices and customer directory exports.</p>
    </div>

    <div>
      <label htmlFor="gstin" className={formLabelClass}>
        GSTIN
      </label>
      <input
        id="gstin"
        type="text"
        name="gstin"
        placeholder="e.g. 22AAAAA0000A1Z5"
        value={customerData.gstin}
        onChange={handleChange}
        maxLength={15}
        className={`${formInputClass(Boolean(errors.gstin))} font-mono uppercase`}
      />
      <FieldError message={errors.gstin} />
      <p className={formHintClass}>15-character GST identification (optional).</p>
    </div>
  </section>
);

export default CustomerInfoSection;
