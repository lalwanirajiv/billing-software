import { MapPin } from 'lucide-react';
import {
  formLabelClass,
  formInputClass,
  formSectionClass,
  formHintClass,
} from './customerFormStyles';
import FieldError from './FieldError';

const AddressSection = ({ customerData, handleChange, errors = {} }) => (
  <section className={formSectionClass}>
    <div className="flex items-center gap-2">
      <MapPin size={18} className="text-brand-primary" />
      <h2 className="text-base font-semibold text-slate-900">Billing address</h2>
    </div>

    <div>
      <label htmlFor="address_line1" className={formLabelClass}>
        Address line 1 <span className="text-red-500">*</span>
      </label>
      <input
        id="address_line1"
        type="text"
        name="address_line1"
        placeholder="e.g. 123 Business Road"
        value={customerData.address_line1}
        onChange={handleChange}
        required
        autoComplete="address-line1"
        className={formInputClass(Boolean(errors.address_line1))}
      />
      <FieldError message={errors.address_line1} />
    </div>

    <div>
      <label htmlFor="address_line2" className={formLabelClass}>
        Address line 2
      </label>
      <input
        id="address_line2"
        type="text"
        name="address_line2"
        placeholder="e.g. Suite 456, Landmark"
        value={customerData.address_line2}
        onChange={handleChange}
        autoComplete="address-line2"
        className={formInputClass(false)}
      />
      <p className={formHintClass}>City, state, PIN, or additional details.</p>
    </div>
  </section>
);

export default AddressSection;
