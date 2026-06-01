import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import FormHeader from './FormHeader';
import AddressSection from './AddressSection';
import CustomerInfoSection from './CustomerInfoSection';
import { createCustomer, getCustomerById, updateCustomer } from '../../lib/api';
import { BackButton } from '../Reusables/BackButton';
import { validateCustomerData } from '../../lib/validation';
import { useToast } from '../../context/ToastContext';
import { AlertTriangle, FileText, Users } from 'lucide-react';

const initialCustomerData = {
  name: '',
  address_line1: '',
  address_line2: '',
  phone: '',
  gstin: '',
};

function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-24 bg-slate-200/80 rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72 bg-slate-200/80 rounded-2xl" />
        <div className="h-72 bg-slate-200/80 rounded-2xl" />
      </div>
    </div>
  );
}

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [customerData, setCustomerData] = useState(initialCustomerData);
  const [saveStatus, setSaveStatus] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(isEditMode);
  const [loadError, setLoadError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isEditMode) return;

    const fetchCustomer = async () => {
      setIsLoadingCustomer(true);
      setLoadError(null);
      try {
        const data = await getCustomerById(id);
        setCustomerData({
          name: data.name,
          address_line1: data.address_line1 || '',
          address_line2: data.address_line2 || '',
          phone: data.phone_number || '',
          gstin: data.gstin || '',
        });
      } catch (error) {
        console.error('Failed to fetch customer:', error);
        setLoadError(error.message || 'Customer not found');
      } finally {
        setIsLoadingCustomer(false);
      }
    };

    fetchCustomer();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'gstin' ? value.toUpperCase() : value;
    setCustomerData((prev) => ({ ...prev, [name]: nextValue }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateCustomerData(customerData);
    if (!customerData.address_line1?.trim()) {
      validationErrors.address_line1 = 'Address line 1 is required.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }

    setFieldErrors({});
    setSaveStatus('saving');
    try {
      if (isEditMode) {
        await updateCustomer(id, customerData);
        setSaveStatus('success');
        showToast('Customer updated successfully.', 'success');
        setTimeout(() => navigate('/customers'), 1200);
      } else {
        await createCustomer(customerData);
        setSaveStatus('success');
        showToast('Customer saved successfully.', 'success');
        setCustomerData(initialCustomerData);
        setSaveStatus('');
      }
    } catch (error) {
      setSaveStatus('error');
      showToast(error.message || 'Failed to save customer.', 'error');
    }
  };

  const title = isEditMode ? 'Edit customer' : 'Add customer';
  const subtitle = isEditMode
    ? 'Update billing and contact details for this customer.'
    : 'Create a customer profile for faster invoicing and reports.';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <BackButton className="!mb-2" />

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
          <FormHeader title={title} subtitle={subtitle} isEditMode={isEditMode} />

          {loadError && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <p className="font-semibold text-sm text-red-800">Could not load customer</p>
                <p className="text-sm text-red-700 mt-0.5">{loadError}</p>
                <Link to="/customers" className="text-sm font-semibold text-brand-primary mt-2 inline-block hover:underline">
                  Back to customers
                </Link>
              </div>
            </div>
          )}

          {isLoadingCustomer ? (
            <FormSkeleton />
          ) : !loadError ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isEditMode && (
                <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-900">
                  Customers must exist before invoicing. After saving, you can create an invoice
                  with their details pre-filled.
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CustomerInfoSection
                  customerData={customerData}
                  handleChange={handleChange}
                  errors={fieldErrors}
                />
                <AddressSection
                  customerData={customerData}
                  handleChange={handleChange}
                  errors={fieldErrors}
                />
              </div>

              {!isEditMode && saveStatus === 'success' && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-800">
                  Customer saved. You can add another below or{' '}
                  <Link to="/invoice-form" className="font-semibold underline">
                    create an invoice
                  </Link>
                  .
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/customers"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
                  >
                    <Users size={16} />
                    All customers
                  </Link>
                  {!isEditMode && (
                    <Link
                      to="/invoice-form"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
                    >
                      <FileText size={16} />
                      New invoice
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {saveStatus === 'error' && (
                    <p className="text-sm text-red-600 font-medium">Save failed</p>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-cta-primary !py-2.5 !px-6 !text-sm disabled:opacity-50"
                    disabled={saveStatus === 'saving'}
                  >
                    {saveStatus === 'saving'
                      ? 'Saving…'
                      : isEditMode
                        ? 'Update customer'
                        : 'Save customer'}
                  </button>
                </div>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
