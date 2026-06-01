import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import {
  getInvoicesByDateRange,
  deleteInvoice,
  deleteInvoicesBulk,
  getDetailedInvoicesByDate,
} from '../../lib/api';
import { useFinancialYear } from '../../context/FinancialYearContext';
import FinancialYearSelector from '../Reusables/FinancialYearSelector';
import { InvoiceListHeader } from './subcomponents/InvoiceListHeader';
import { InvoiceTable } from './subcomponents/InvoiceTable';
import { ExportModal } from './subcomponents/ExportModal';
import { DeleteInvoiceModal } from './subcomponents/DeleteInvoiceModal';
import { InvoiceAuditReport } from './subcomponents/InvoiceAuditReport';
import { BackButton } from '../Reusables/BackButton';
import InvoiceListPageHeader from './InvoiceListPageHeader';
import InvoiceListSkeleton from './InvoiceListSkeleton';
import InvoiceListStats from './InvoiceListStats';
import { normalizeStatusParam, computeInvoiceStats } from './invoiceListUtils';
import { saveCsvFile } from '../../lib/csvExport';

export default function InvoiceList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { startDate, endDate, label: fyLabel } = useFinancialYear();

  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = normalizeStatusParam(params.get('status'));
    if (status) setStatusFilter(status);
  }, [location.search]);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const invoicesData = await getInvoicesByDateRange(startDate, endDate);
      setInvoices(invoicesData);
    } catch (err) {
      setError(err.message);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return invoices.filter((invoice) => {
      const searchMatch =
        !q ||
        invoice.ship_to?.toLowerCase().includes(q) ||
        String(invoice.bill_no ?? '').includes(q) ||
        String(invoice.grand_total ?? '').includes(q);
      const dateMatch = dateFilter ? invoice.date?.startsWith(dateFilter) : true;
      const statusMatch =
        statusFilter === 'All' ||
        invoice.invoice_status?.toLowerCase() === statusFilter.toLowerCase();
      return searchMatch && dateMatch && statusMatch;
    });
  }, [invoices, searchTerm, dateFilter, statusFilter]);

  const globalStatusCounts = useMemo(() => {
    const c = computeInvoiceStats(invoices);
    return { Paid: c.Paid, Due: c.Due, Overdue: c.Overdue };
  }, [invoices]);

  const filteredStats = useMemo(() => computeInvoiceStats(filteredInvoices), [filteredInvoices]);
  const allStats = useMemo(() => computeInvoiceStats(invoices), [invoices]);

  const hasActiveFilters = Boolean(
    searchTerm.trim() || dateFilter || statusFilter !== 'All'
  );

  const handleRowClick = (invoiceId) => navigate(`/invoice/${invoiceId}`);

  const handleDeleteClick = (e, invoice) => {
    e.stopPropagation();
    setInvoiceToDelete(invoice);
    setIsBulkDelete(false);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (e, invoiceId) => {
    e.stopPropagation();
    navigate(`/invoice-form/${invoiceId}`);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setInvoiceToDelete(null);
    setIsBulkDelete(false);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDelete) {
      if (selectedInvoices.length === 0) return;
      try {
        await deleteInvoicesBulk(selectedInvoices);
        setInvoices((prev) => prev.filter((i) => !selectedInvoices.includes(i.invoice_id)));
        showToast(`${selectedInvoices.length} invoices deleted.`, 'success');
        setSelectedInvoices([]);
      } catch {
        showToast('Failed to delete invoices.', 'error');
      } finally {
        handleCloseModal();
      }
      return;
    }

    if (!invoiceToDelete) return;
    try {
      await deleteInvoice(invoiceToDelete.invoice_id);
      setInvoices((prev) => prev.filter((i) => i.invoice_id !== invoiceToDelete.invoice_id));
      setSelectedInvoices((prev) => prev.filter((id) => id !== invoiceToDelete.invoice_id));
      showToast(`Invoice #${invoiceToDelete.bill_no} deleted.`, 'success');
    } catch {
      showToast('Failed to delete invoice.', 'error');
    } finally {
      handleCloseModal();
    }
  };

  const handleToggleSelect = (invoiceId) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId) ? prev.filter((id) => id !== invoiceId) : [...prev, invoiceId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map((i) => i.invoice_id));
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedInvoices.length > 0) {
      setIsBulkDelete(true);
      setIsDeleteModalOpen(true);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setStatusFilter('All');
    navigate('/invoices', { replace: true });
  };

  const handleExportCSV = async (start, end) => {
    try {
      showToast('Preparing CSV export…', 'info');
      const { data } = await getDetailedInvoicesByDate(start, end);
      if (data.length === 0) {
        showToast('No invoices in selected range.', 'error');
        return;
      }

      data.sort((a, b) => (parseFloat(a.bill_no) || 0) - (parseFloat(b.bill_no) || 0));

      const headers = [
        'Bill No',
        'Date',
        'Customer',
        'GSTIN',
        'Terms',
        'Subtotal',
        'CGST',
        'SGST',
        'IGST',
        'Grand Total',
        'Status',
      ];
      const csvRows = [headers.join(',')];
      data.forEach((inv) => {
        csvRows.push(
          [
            inv.bill_no,
            inv.date || '',
            `"${inv.customer_name || inv.ship_to}"`,
            inv.customer_gstin || '',
            `"${inv.terms_of_payment || ''}"`,
            inv.sub_total || 0,
            inv.cgst || 0,
            inv.sgst || 0,
            inv.igst || 0,
            inv.grand_total || 0,
            inv.invoice_status || 'Due',
          ].join(',')
        );
      });

      const result = await saveCsvFile(
        csvRows.join('\n'),
        `invoices_${start || 'all'}_${end || 'export'}.csv`,
        { title: 'Save invoices CSV' }
      );
      if (result.cancelled) {
        showToast('Export cancelled.', 'info');
        return;
      }
      showToast('CSV saved successfully.', 'success');
      setIsExportModalOpen(false);
    } catch {
      showToast('Failed to export CSV.', 'error');
    }
  };

  const handleExportPDF = async (start, end) => {
    try {
      showToast('Preparing print view…', 'info');
      const { data } = await getDetailedInvoicesByDate(start, end);
      if (data.length === 0) {
        showToast('No invoices in selected range.', 'error');
        return;
      }
      setExportData(
        data.sort((a, b) => (parseFloat(a.bill_no) || 0) - (parseFloat(b.bill_no) || 0))
      );
      setIsExportModalOpen(false);
      setTimeout(() => {
        window.print();
        setExportData([]);
      }, 400);
    } catch {
      showToast('Failed to generate PDF.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <BackButton className="!mb-4" />
          <InvoiceListSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl border border-red-100 p-8 max-w-md text-center shadow-sm">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-slate-900 font-semibold mb-1">Could not load invoices</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button type="button" onClick={fetchInvoices} className="btn-cta-primary">
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

        <InvoiceListPageHeader
          totalCount={invoices.length}
          filteredCount={filteredInvoices.length}
          filteredAmount={filteredStats.totalAmount}
          statusFilter={statusFilter}
          fyLabel={fyLabel}
          onExportClick={() => setIsExportModalOpen(true)}
        />

        <InvoiceListStats
          totalCount={invoices.length}
          totalAmount={allStats.totalAmount}
          statusCounts={globalStatusCounts}
          selectedCount={selectedInvoices.length}
          statusFilter={statusFilter}
          onStatusFilter={setStatusFilter}
        />

        <InvoiceListHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          statusFilter={statusFilter}
          selectedCount={selectedInvoices.length}
          onBulkDelete={handleBulkDeleteClick}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <InvoiceTable
          filteredInvoices={filteredInvoices}
          onRowClick={handleRowClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          searchTerm={searchTerm}
          dateFilter={dateFilter}
          statusFilter={statusFilter}
          selectedInvoices={selectedInvoices}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onRefresh={fetchInvoices}
        />
      </div>

      <DeleteInvoiceModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        billNo={isBulkDelete ? selectedInvoices.length : invoiceToDelete?.bill_no}
        isBulk={isBulkDelete}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
      />

      <InvoiceAuditReport exportData={exportData} />

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
