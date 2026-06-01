import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCustomerById, getInvoicesByCustomerId } from '../../lib/api';
import { useFinancialYear } from '../../context/FinancialYearContext';
import FinancialYearSelector from '../Reusables/FinancialYearSelector';
import {
  User,
  Phone,
  MapPin,
  FileText,
  Pencil,
  Plus,
  Search,
  ExternalLink,
  Calendar,
  BadgeIndianRupee,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { BackButton } from '../Reusables/BackButton';
import CustomerAccountSkeleton from './CustomerAccountSkeleton';
import CustomerAccountStats from './CustomerAccountStats';
import PageHeader from '../Reusables/PageHeader';
import { usePageTitle } from '../../context/PageTitleContext';
import {
  computeCustomerAccountStats,
  filterCustomerInvoices,
  formatINR,
  formatInvoiceDate,
  getCustomerInitials,
  STATUS_STYLES,
} from './customerAccountUtils';
import { STATUS_OPTIONS } from '../List of Invoices/invoiceListUtils';

function StatusBadge({ status }) {
  const key = status || 'Due';
  return (
    <span
      className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ring-1 ring-inset ${
        STATUS_STYLES[key] || STATUS_STYLES.Due
      }`}
    >
      {key}
    </span>
  );
}

function DetailRow({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 shrink-0 mt-0.5">
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p
          className={`text-sm text-slate-900 mt-0.5 break-words ${
            mono ? 'font-mono' : ''
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function CustomerAccount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { startDate, endDate, label: fyLabel } = useFinancialYear();
  const { title, eyebrow, setPageTitle } = usePageTitle();

  const [customer, setCustomer] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [customerData, invoicesData] = await Promise.all([
        getCustomerById(id),
        getInvoicesByCustomerId(id, startDate, endDate),
      ]);
      setCustomer(customerData);
      setInvoices(invoicesData);
    } catch (err) {
      console.error('Error fetching customer data:', err);
      showToast('Failed to load customer details', 'error');
      setCustomer(null);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, [id, showToast, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (customer?.name?.trim()) {
      setPageTitle(`${customer.name.trim()} · Customer account`);
    }
  }, [customer?.name, setPageTitle]);

  const stats = useMemo(
    () => computeCustomerAccountStats(invoices),
    [invoices]
  );

  const filteredInvoices = useMemo(
    () =>
      filterCustomerInvoices(invoices, {
        search: searchTerm,
        status: statusFilter,
      }),
    [invoices, searchTerm, statusFilter]
  );

  const formatMemberSince = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const addressText =
    [customer?.address_line1, customer?.address_line2].filter(Boolean).join(', ') ||
    '—';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <BackButton className="!mb-4" />
          <CustomerAccountSkeleton />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center text-center">
        <User className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-900">Customer not found</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-sm">
          This customer may have been removed or the link is invalid.
        </p>
        <button
          type="button"
          onClick={() => navigate('/customers')}
          className="btn-cta-primary mt-6 !text-sm"
        >
          Back to customers
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <BackButton className="!mb-2" />

        <div className="mb-4 lg:hidden">
          <FinancialYearSelector />
        </div>

        <PageHeader
          eyebrow={`${fyLabel} · ${eyebrow}`}
          title={title}
          description={
            <>
              {stats.invoiceCount} invoice{stats.invoiceCount !== 1 ? 's' : ''} in this
              financial year
              {stats.totalDue > 0 && (
                <span className="text-amber-700 font-medium">
                  {' '}
                  · {formatINR(stats.totalDue)} outstanding
                </span>
              )}
            </>
          }
          actions={
            <>
              <Link
                to={`/edit-customer/${customer.customer_id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:border-brand-primary hover:text-brand-primary transition-colors"
              >
                <Pencil size={18} />
                Edit customer
              </Link>
              <Link to="/invoice-form" className="btn-cta-primary !py-2.5 !px-4 !text-sm">
                <Plus size={18} />
                <span>New invoice</span>
              </Link>
            </>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Profile card */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-lg font-bold shrink-0">
                  {getCustomerInitials(customer.name)}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-slate-900 truncate">
                    {customer.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customer #{customer.customer_id}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-2">
              <DetailRow icon={MapPin} label="Address" value={addressText} />
              <DetailRow
                icon={Phone}
                label="Phone"
                value={customer.phone_number || '—'}
              />
              <DetailRow
                icon={BadgeIndianRupee}
                label="GSTIN"
                value={customer.gstin || '—'}
                mono
              />
              <DetailRow
                icon={Calendar}
                label="Customer since"
                value={formatMemberSince(customer.created_at)}
              />
            </div>

            <div className="px-5 sm:px-6 py-4 bg-slate-50/80 border-t border-slate-100">
              <Link
                to="/customers"
                className="text-xs font-medium text-slate-500 hover:text-brand-primary transition-colors"
              >
                ← All customers
              </Link>
            </div>
          </div>

          {/* FY stats */}
          <div className="lg:col-span-2">
            <CustomerAccountStats stats={stats} fyLabel={fyLabel} />
          </div>
        </div>

        {/* Invoice history */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <FileText size={20} className="text-brand-primary" />
                Invoice history
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Bills for {customer.name} in {fyLabel}
              </p>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="search"
                placeholder="Search by bill no. or amount…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary sm:w-40"
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'All' ? 'All statuses' : opt}
                </option>
              ))}
            </select>
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900">No invoices to show</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
                {invoices.length === 0
                  ? `No bills recorded for this customer in ${fyLabel}.`
                  : 'Try adjusting search or status filters.'}
              </p>
              {invoices.length === 0 && (
                <Link to="/invoice-form" className="btn-cta-primary inline-flex mt-6 !text-sm">
                  <Plus size={18} />
                  Create invoice
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide border-b border-slate-100">
                    <th className="px-4 sm:px-6 py-3">Bill no.</th>
                    <th className="px-4 sm:px-6 py-3">Date</th>
                    <th className="px-4 sm:px-6 py-3 text-right">Amount</th>
                    <th className="px-4 sm:px-6 py-3">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-right w-28"> </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => (
                    <tr
                      key={inv.invoice_id}
                      onClick={() => navigate(`/invoice/${inv.invoice_id}`)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 sm:px-6 py-3.5 font-semibold text-slate-900 group-hover:text-brand-primary transition-colors">
                        {inv.bill_no ?? '—'}
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 text-slate-600 tabular-nums">
                        {formatInvoiceDate(inv.date)}
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 text-right font-semibold text-slate-900 tabular-nums">
                        {formatINR(Number(inv.grand_total))}
                      </td>
                      <td className="px-4 sm:px-6 py-3.5">
                        <StatusBadge status={inv.invoice_status} />
                      </td>
                      <td
                        className="px-4 sm:px-6 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          to={`/invoice/${inv.invoice_id}`}
                          className="inline-flex items-center gap-1 p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-primary hover:border-brand-primary/40 transition-colors text-xs font-medium"
                          title="View invoice"
                        >
                          <ExternalLink size={14} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredInvoices.length > 0 && (
            <div className="px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
              Showing {filteredInvoices.length} of {invoices.length} invoice
              {invoices.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
