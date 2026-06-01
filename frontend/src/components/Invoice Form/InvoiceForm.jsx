import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { BackButton } from '../Reusables/BackButton';
import TopInfoPanel from './TopInfoPanel';
import ItemsList from './ItemsList';
import FormHeader from './FormHeader';
import InvoiceFormSkeleton from './InvoiceFormSkeleton';
import ConfirmSaveModal from '../Reusables/ConfirmSaveModal';
import { useToast } from '../../context/ToastContext';
import {
  getAllCustomers,
  getCustomerByExactName,
  createInvoice,
  updateInvoice,
  getInvoiceById,
  getCustomerById,
  getNextBillNo,
  buildFinalBillNo,
} from '../../lib/api';
import { calculateInvoiceTax } from '../../lib/companySettings';
import { useCompanySettings } from '../../context/CompanySettingsContext';
import { normalizeName } from '../../lib/validation';
import FieldError from '../Reusables/FieldError';
import { FileText, List } from 'lucide-react';

const initialFormData = {
  shipTo: '',
  gstin: '',
  address_line1: '',
  address_line2: '',
  billNo: '',
  date: '',
  terms: '',
  state: 'State',
  discount: 0,
  items: [{ name: '', hsn: '', qty: 0, rate: 0, amount: 0 }],
};

export default function InvoiceForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { settings } = useCompanySettings();
  const { id: invoiceIdParam } = useParams();
  const isExistingInvoice = !!invoiceIdParam;
  const [formData, setFormData] = useState(initialFormData);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [totals, setTotals] = useState({
    sub_total: 0,
    totalQty: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    adjustment: 0,
    grand_total: 0,
  });
  const [customers, setCustomers] = useState([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(isExistingInvoice);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } catch {
        showToast('Failed to fetch customers', 'error');
      } finally {
        setIsLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, [showToast]);

  useEffect(() => {
    const loadInvoiceData = async () => {
      if (!isExistingInvoice) {
        setIsLoadingInvoice(false);
        try {
          const now = new Date();
          const nextBillNo = await getNextBillNo();
          setFormData({
            ...initialFormData,
            billNo: String(nextBillNo),
            date: now.toISOString().split('T')[0],
            state: settings.default_state_label || 'State',
          });
        } catch {
          setFormData({
            ...initialFormData,
            state: settings.default_state_label || 'State',
          });
        }
        return;
      }

      setIsLoadingInvoice(true);
      try {
        const apiInvoice = await getInvoiceById(invoiceIdParam);
        let parsedCustomer = null;

        if (apiInvoice.customer_id) {
          try {
            parsedCustomer = await getCustomerById(apiInvoice.customer_id);
          } catch (custErr) {
            console.warn('Could not fetch customer details:', custErr);
          }
        }

        setFormData({
          ...initialFormData,
          ...apiInvoice,
          invoice_id: apiInvoice.invoice_id || invoiceIdParam,
          shipTo: apiInvoice.ship_to || parsedCustomer?.name || '',
          gstin: parsedCustomer?.gstin || '',
          billNo:
            apiInvoice.bill_no && apiInvoice.bill_no.includes('_')
              ? apiInvoice.bill_no.split('_')[1]
              : apiInvoice.bill_no || '',
          address_line1: parsedCustomer?.address_line1 || '',
          address_line2: parsedCustomer?.address_line2 || '',
          terms: apiInvoice.terms_of_payment || '',
          state: apiInvoice.state || settings.default_state_label || 'State',
          date: apiInvoice.date
            ? new Date(apiInvoice.date).toISOString().split('T')[0]
            : '',
          discount: apiInvoice.discount || 0,
          items:
            apiInvoice.items && apiInvoice.items.length
              ? apiInvoice.items.map((item) => ({
                  name: item.item_name || '',
                  hsn: item.hsn || '',
                  qty: Number(item.quantity) || 0,
                  rate: Number(item.price) || 0,
                  amount: Number(item.total) || 0,
                }))
              : [{ name: '', hsn: '', qty: 0, rate: 0, amount: 0 }],
        });
      } catch (error) {
        console.error('Error loading invoice:', error);
        showToast('Failed to load invoice.', 'error');
        navigate('/invoices');
      } finally {
        setIsLoadingInvoice(false);
      }
    };

    loadInvoiceData();
  }, [isExistingInvoice, invoiceIdParam, showToast, navigate, settings.default_state_label]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'shipTo') setIsSuggestionsVisible(true);
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSuggestionClick = (customer) => {
    setFormData((prev) => ({
      ...prev,
      shipTo: customer.name,
      gstin: customer.gstin,
      address_line1: customer.address_line1 || '',
      address_line2: customer.address_line2 || '',
    }));
    setIsSuggestionsVisible(false);
    if (errors.shipTo) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.shipTo;
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    const shipTo = normalizeName(formData.shipTo);

    if (!shipTo) {
      newErrors.shipTo = 'Customer name is required.';
    } else {
      const matched = customers.some(
        (c) => normalizeName(c.name).toLowerCase() === shipTo.toLowerCase()
      );
      if (!matched) {
        newErrors.shipTo = 'Select an existing customer or add one first.';
      }
    }

    if (!formData.billNo || String(formData.billNo).trim() === '') {
      newErrors.billNo = 'Bill number is required.';
    }
    if (!formData.date) {
      newErrors.date = 'Invoice date is required.';
    }

    const validItems = formData.items.filter((item) => (item.name || '').trim() !== '');
    if (validItems.length === 0) {
      newErrors.items = 'Add at least one line item with a name.';
    } else {
      const itemErrors = [];
      formData.items.forEach((item, idx) => {
        const name = (item.name || '').trim();
        if (name) {
          if (!item.qty || Number(item.qty) <= 0) {
            itemErrors.push(`Line ${idx + 1}: quantity must be greater than 0.`);
          }
          if (!item.rate || Number(item.rate) <= 0) {
            itemErrors.push(`Line ${idx + 1}: rate must be greater than 0.`);
          }
        }
      });
      if (itemErrors.length > 0) {
        newErrors.items = itemErrors.join(' ');
      }
    }

    if (Number(formData.discount) < 0) {
      newErrors.discount = 'Discount cannot be negative.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the highlighted errors.', 'error');
      return;
    }
    setShowConfirmSave(true);
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] = name === 'name' || name === 'hsn' ? value : parseFloat(value) || 0;
    newItems[index].amount = (newItems[index].qty || 0) * (newItems[index].rate || 0);
    setFormData((prev) => ({ ...prev, items: newItems }));
    if (errors.items) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.items;
        return next;
      });
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: '', hsn: '', qty: 0, rate: 0, amount: 0 }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleClear = async () => {
    try {
      const nextBillNo = await getNextBillNo();
      setFormData({
        ...initialFormData,
        billNo: String(nextBillNo),
        date: new Date().toISOString().split('T')[0],
        state: settings.default_state_label || 'State',
      });
    } catch {
      setFormData({
        ...initialFormData,
        state: settings.default_state_label || 'State',
      });
    }
    setErrors({});
  };

  useEffect(() => {
    const sub_total = formData.items.reduce((acc, item) => acc + (item.amount || 0), 0);
    const totalQty = formData.items.reduce((acc, item) => acc + (item.qty || 0), 0);
    const tax = calculateInvoiceTax(sub_total, formData.state, settings);
    const discount = Number(formData.discount) || 0;
    const totalAmount = sub_total + tax.cgst + tax.sgst + tax.igst - discount;
    const grand_total = Math.round(totalAmount);
    const adjustment = grand_total - totalAmount;

    setTotals({
      sub_total,
      totalQty,
      cgst: tax.cgst,
      sgst: tax.sgst,
      igst: tax.igst,
      adjustment,
      grand_total,
    });
  }, [formData.items, formData.state, formData.discount, settings]);

  const saveInvoice = async () => {
    try {
      const customer = await getCustomerByExactName(formData.shipTo);
      const finalBillNo = buildFinalBillNo(formData.billNo, formData.date);

      const payload = {
        customer_id: customer.customer_id,
        ship_to: formData.shipTo,
        bill_no: finalBillNo,
        date: formData.date,
        terms_of_payment: formData.terms?.trim() !== '' ? formData.terms : '30 Days',
        state: formData.state,
        total_quantity: Number(totals.totalQty) || 0,
        sub_total: Number(totals.sub_total) || 0,
        cgst: Number(totals.cgst) || 0,
        sgst: Number(totals.sgst) || 0,
        igst: Number(totals.igst) || 0,
        grand_total: Number(totals.grand_total) || 0,
        discount: Number(formData.discount) || 0,
        items: formData.items
          .filter((item) => (item.name || '').trim())
          .map((item) => ({
            item_name: item.name,
            hsn: item.hsn,
            quantity: Number(item.qty) || 0,
            price: Number(item.rate) || 0,
            total: Number(item.amount) || 0,
          })),
      };

      let response;
      if (isExistingInvoice && formData.invoice_id) {
        response = await updateInvoice(formData.invoice_id, payload);
      } else {
        response = await createInvoice(payload);
      }

      const invoiceId = response.invoiceId || formData.invoice_id;
      if (invoiceId) {
        showToast(
          isExistingInvoice ? 'Invoice updated.' : 'Invoice saved.',
          'success'
        );
        navigate(`/invoice/${invoiceId}`);
      } else {
        showToast('Saved but invoice ID was missing.', 'warning');
      }
    } catch (error) {
      showToast(error.message || 'Failed to save invoice.', 'error');
    }
  };

  const filteredCustomers = formData.shipTo
    ? customers.filter((c) =>
        c.name.toLowerCase().includes(formData.shipTo.toLowerCase())
      )
    : customers;

  if (isLoadingInvoice) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <BackButton className="!mb-4" />
          <InvoiceFormSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <BackButton className="!mb-2" />

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
          <FormHeader
            isEditMode={isExistingInvoice}
            billNo={formData.billNo}
            grandTotal={totals.grand_total}
            onClear={handleClear}
          />

          <form onSubmit={handleSaveClick} className="space-y-6">
            <TopInfoPanel
              formData={formData}
              handleChange={handleChange}
              totals={totals}
              customers={customers}
              handleSuggestionClick={handleSuggestionClick}
              isSuggestionsVisible={isSuggestionsVisible}
              setIsSuggestionsVisible={setIsSuggestionsVisible}
              isLoadingCustomers={isLoadingCustomers}
              intraStateLabel={settings.default_state_label || 'State'}
              cgstRate={settings.cgst_rate}
              sgstRate={settings.sgst_rate}
              igstRate={settings.igst_rate}
              errors={errors}
              filteredCustomers={filteredCustomers}
            />

            <ItemsList
              items={formData.items}
              handleItemChange={handleItemChange}
              addItem={addItem}
              removeItem={removeItem}
            />
            <FieldError message={errors.items} />

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/invoices"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
                >
                  <List size={16} />
                  All invoices
                </Link>
                <Link
                  to="/create-customer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
                >
                  New customer
                </Link>
              </div>

              <button type="submit" className="btn-cta-primary !py-2.5 !px-6 !text-sm">
                <FileText size={18} />
                {isExistingInvoice ? 'Update invoice' : 'Save & preview'}
              </button>
            </div>

            <ConfirmSaveModal
              isOpen={showConfirmSave}
              onCancel={() => setShowConfirmSave(false)}
              onConfirm={async () => {
                setShowConfirmSave(false);
                await saveInvoice();
              }}
              isExistingInvoice={isExistingInvoice}
              grandTotal={totals.grand_total}
              customerName={formData.shipTo}
              billNo={formData.billNo}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
