import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DeleteConfirmationModal } from './DeleteConfirmationModel';
import { useToast } from '../../context/ToastContext';
import { EditIcon, TrashIcon } from '../Reusables/Icons';
import { getAllCustomers, deleteCustomer, deleteCustomersBulk, getInvoicesByDateRange } from '../../lib/api';
import { useFinancialYear } from '../../context/FinancialYearContext';
import FinancialYearSelector from '../Reusables/FinancialYearSelector';
import { Search, UserPlus, Trash2, AlertTriangle, RefreshCw, MapPin, Phone } from 'lucide-react';
import { BackButton } from '../Reusables/BackButton';
import CustomerListHeader from './CustomerListHeader';
import CustomerListSkeleton from './CustomerListSkeleton';
import CustomerListStats from './CustomerListStats';
import CustomerPrintView from './CustomerPrintView';
import { saveCsvFile } from '../../lib/csvExport';

export default function CustomerList() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { startDate, endDate, label: fyLabel } = useFinancialYear();
  const [customers, setCustomers] = useState([]);
  const [fyInvoiceCount, setFyInvoiceCount] = useState(0);
  const [activeCustomersInFy, setActiveCustomersInFy] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [data, fyInvoices] = await Promise.all([
        getAllCustomers(),
        getInvoicesByDateRange(startDate, endDate),
      ]);
      setCustomers(data);
      setFyInvoiceCount(fyInvoices.length);
      const activeIds = new Set(
        fyInvoices.map((i) => i.customer_id).filter((id) => id != null)
      );
      setActiveCustomersInFy(activeIds.size);
    } catch (err) {
      setError(err.message);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.phone_number?.toLowerCase().includes(q) ||
        c.gstin?.toLowerCase().includes(q) ||
        c.address_line1?.toLowerCase().includes(q) ||
        c.address_line2?.toLowerCase().includes(q)
    );
  }, [customers, searchTerm]);

  const withGstinCount = useMemo(
    () => customers.filter((c) => c.gstin?.trim()).length,
    [customers]
  );

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setIsBulkDelete(false);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setCustomerToDelete(null);
    setIsBulkDelete(false);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDelete) {
      if (selectedCustomers.length === 0) return;
      try {
        await deleteCustomersBulk(selectedCustomers);
        setCustomers((prev) => prev.filter((c) => !selectedCustomers.includes(c.customer_id)));
        showToast(`${selectedCustomers.length} customers deleted.`, 'success');
        setSelectedCustomers([]);
      } catch (err) {
        showToast('Failed to delete customers.', 'error');
      } finally {
        handleCloseModal();
      }
      return;
    }

    if (!customerToDelete) return;
    const customerId = customerToDelete.customer_id;

    try {
      await deleteCustomer(customerId);
      setCustomers((prev) => prev.filter((c) => c.customer_id !== customerId));
      setSelectedCustomers((prev) => prev.filter((id) => id !== customerId));
      showToast(`"${customerToDelete.name}" was deleted.`, 'success');
    } catch {
      showToast('Failed to delete customer.', 'error');
    } finally {
      handleCloseModal();
    }
  };

  const handleToggleSelect = (customerId, e) => {
    e?.stopPropagation();
    setSelectedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map((c) => c.customer_id));
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedCustomers.length > 0) {
      setIsBulkDelete(true);
      setIsDeleteModalOpen(true);
    }
  };

  const handleExportCSV = async () => {
    try {
      const headers = ['Customer Name', 'Address Line 1', 'Address Line 2', 'Phone', 'GSTIN'];
      const csvRows = [headers.join(',')];
      filteredCustomers.forEach((c) => {
        csvRows.push(
          [
            `"${c.name}"`,
            `"${c.address_line1 || ''}"`,
            `"${c.address_line2 || ''}"`,
            c.phone_number || '',
            c.gstin || '',
          ].join(',')
        );
      });
      const result = await saveCsvFile(
        csvRows.join('\n'),
        `customers_${new Date().toISOString().slice(0, 10)}.csv`,
        { title: 'Save customers CSV' }
      );
      if (result.cancelled) {
        showToast('Export cancelled.', 'info');
        return;
      }
      showToast('Customer directory saved.', 'success');
    } catch {
      showToast('Failed to export CSV.', 'error');
    }
  };

  const handleExportPDF = () => {
    setExportData(filteredCustomers);
    setTimeout(() => {
      window.print();
      setExportData([]);
    }, 400);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <BackButton className="!mb-4" />
          <CustomerListSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl border border-red-100 p-8 max-w-md text-center shadow-sm">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-slate-900 font-semibold mb-1">Could not load customers</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button type="button" onClick={fetchCustomers} className="btn-cta-primary">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="no-print max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <BackButton className="!mb-2" />

        <div className="mb-4 lg:hidden">
          <FinancialYearSelector />
        </div>

        <CustomerListHeader
          totalCount={customers.length}
          filteredCount={filteredCustomers.length}
          searchTerm={searchTerm.trim()}
          fyLabel={fyLabel}
          onExportCsv={handleExportCSV}
          onExportPdf={handleExportPDF}
          isExportOpen={isExportMenuOpen}
          setExportOpen={setIsExportMenuOpen}
        />

        <CustomerListStats
          totalCount={customers.length}
          filteredCount={filteredCustomers.length}
          withGstinCount={withGstinCount}
          activeInFy={activeCustomersInFy}
          invoicesInFy={fyInvoiceCount}
          isFiltering={Boolean(searchTerm.trim())}
        />

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="search"
              placeholder="Search by name, phone, GSTIN, or address…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary"
            />
          </div>
          {selectedCustomers.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDeleteClick}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shrink-0"
            >
              <Trash2 size={18} />
              Delete ({selectedCustomers.length})
            </button>
          )}
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm py-16 px-6 text-center">
            <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-slate-900">
              {searchTerm ? 'No customers found' : 'No customers yet'}
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
              {searchTerm
                ? `Nothing matches "${searchTerm}". Try a different search.`
                : 'Add your first customer to start creating invoices faster.'}
            </p>
            {!searchTerm && (
              <Link to="/create-customer" className="btn-cta-primary inline-flex mt-6 !text-sm">
                <UserPlus size={18} />
                Add customer
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide border-b border-slate-100">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                        onChange={handleToggleSelectAll}
                        checked={
                          filteredCustomers.length > 0 &&
                          selectedCustomers.length === filteredCustomers.length
                        }
                        aria-label="Select all"
                      />
                    </th>
                    <th className="px-4 py-3 w-12">#</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3 hidden md:table-cell">Contact</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Address</th>
                    <th className="px-4 py-3">GSTIN</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map((customer, index) => (
                    <tr
                      key={customer.customer_id}
                      onClick={() => navigate(`/customer/${customer.customer_id}`)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                          checked={selectedCustomers.includes(customer.customer_id)}
                          onChange={(e) => handleToggleSelect(customer.customer_id, e)}
                          aria-label={`Select ${customer.name}`}
                        />
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 tabular-nums">{index + 1}</td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-900 group-hover:text-brand-primary transition-colors">
                          {customer.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 md:hidden flex items-center gap-1">
                          <Phone size={12} />
                          {customer.phone_number || '—'}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-slate-600">
                        {customer.phone_number || (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell max-w-[220px]">
                        <p className="text-slate-600 truncate flex items-center gap-1">
                          <MapPin size={14} className="text-slate-400 shrink-0" />
                          <span className="truncate">
                            {[customer.address_line1, customer.address_line2]
                              .filter(Boolean)
                              .join(', ') || '—'}
                          </span>
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        {customer.gstin ? (
                          <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 text-xs font-mono font-medium text-slate-700">
                            {customer.gstin}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td
                        className="px-4 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => navigate(`/edit-customer/${customer.customer_id}`)}
                            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-primary hover:border-brand-primary/40 transition-colors"
                            title="Edit"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(customer)}
                            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                type="button"
                onClick={fetchCustomers}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-primary"
              >
                <RefreshCw size={14} />
                Refresh list
              </button>
              <span className="text-xs text-slate-400">
                Click a row to view customer account
              </span>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        customerName={isBulkDelete ? `${selectedCustomers.length} selected` : customerToDelete?.name}
        isBulk={isBulkDelete}
      />

      <CustomerPrintView customers={exportData} />

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>
    </div>
  );
}
