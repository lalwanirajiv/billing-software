import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  getSalesReport,
  getTaxReport,
  getCustomerDetailedReport,
  getRevenueChartData,
  getInvoiceStatusReport,
} from "../../lib/api";

// Subcomponents
import ReportHeader from "./subcomponents/ReportHeader";
import ReportFilters from "./subcomponents/ReportFilters";
import ReportStats from "./subcomponents/ReportStats";
import VisualInsights from "./subcomponents/VisualInsights";
import FinancialLedger from "./subcomponents/FinancialLedger";
import PrintView from "./subcomponents/PrintView";
import { BackButton } from "../Reusables/BackButton";

export default function Reports() {
  const isFetching = useRef(false);

  // Logic for Indian Financial Year (April to March)
  const fy = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth(); 
    const currentYear = today.getFullYear();
    let FYStartYear = currentMonth >= 3 ? currentYear : currentYear - 1;
    return {
      start: `${FYStartYear}-04-01`,
      end: today.toISOString().split("T")[0]
    };
  }, []);

  const [reportType, setReportType] = useState("salesSummary");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Pagination State
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Single state object
  const [reportState, setReportState] = useState({
    sales: [],
    taxMetrics: { taxable_value: 0, total_tax: 0, total_invoices: 0, total_amount: 0 },
    customers: [],
    chart: [],
    statusBreakdown: [],
    loading: false,
    error: null
  });

  const fetchReportData = useCallback(async () => {
    if (isFetching.current) return;
    
    isFetching.current = true;
    setReportState(prev => ({ ...prev, loading: true, error: null }));
    setCurrentPage(1);

    try {
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        throw new Error("'From Date' cannot be later than 'To Date'");
      }

      let newState = {
        sales: [],
        taxMetrics: { taxable_value: 0, total_tax: 0, total_invoices: 0, total_amount: 0 },
        customers: [],
        chart: [],
        statusBreakdown: []
      };

      // 1. Fetch Sales (Standard)
      const sales = await getSalesReport(startDate, endDate);
      newState.sales = sales.data || [];
      
      // 2. Fetch Status Breakdown (Comparisons)
      const statusRes = await getInvoiceStatusReport(startDate, endDate);
      newState.statusBreakdown = statusRes.data || [];

      if (reportType === "salesSummary") {
        const chartRes = await getRevenueChartData(startDate, endDate);
        const rawData = chartRes.data || [];
        
        let processedChartData = [];
        const dataMap = new Map(rawData.map(d => [d.name, d.sales]));
        
        let sDate = startDate ? new Date(startDate) : (rawData.length > 0 ? new Date(rawData[0].name + "-01") : new Date(new Date().getFullYear(), 0, 1));
        let eDate = endDate ? new Date(endDate) : new Date();

        if (isNaN(sDate.getTime())) sDate = new Date();
        if (isNaN(eDate.getTime())) eDate = new Date();
        
        let curr = new Date(sDate.getFullYear(), sDate.getMonth(), 1);
        const finish = new Date(eDate.getFullYear(), eDate.getMonth(), 1);
        
        let safety = 0;
        const maxMonths = 36;
        while (curr <= finish && safety < maxMonths) {
          const key = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}`;
          processedChartData.push({
            name: new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(curr),
            sales: Number(dataMap.get(key)) || 0
          });
          curr.setMonth(curr.getMonth() + 1);
          safety++;
        }
        newState.chart = processedChartData;

        const totalAmount = newState.sales.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const totalTax = newState.sales.reduce((sum, item) => sum + (Number(item.tax) || 0), 0);
        newState.taxMetrics = {
          total_amount: totalAmount,
          taxable_value: totalAmount - totalTax,
          total_tax: totalTax,
          total_invoices: newState.sales.length
        };
      } 
      else if (reportType === "taxReport") {
        const tax = await getTaxReport(startDate, endDate);
        const tData = tax?.data || {};
        newState.taxMetrics = {
           ...tData,
           total_amount: (Number(tData.taxable_value) || 0) + (Number(tData.total_tax) || 0),
           total_invoices: newState.sales.length
        };
        
        newState.chart = [
          { name: 'CGST', value: Number(tData.total_cgst) || 0 },
          { name: 'SGST', value: Number(tData.total_sgst) || 0 },
          { name: 'IGST', value: Number(tData.total_igst) || 0 },
        ].filter(d => d.value > 0);
      } 
      else if (reportType === "customerReport") {
        const customers = await getCustomerDetailedReport(startDate, endDate);
        newState.customers = customers?.data || [];
        
        newState.chart = newState.customers.slice(0, 10).map(c => ({
          name: c.customer,
          sales: Number(c.total_revenue) || 0,
          count: Number(c.total_invoices) || 0
        }));

        newState.taxMetrics.total_amount = newState.customers.reduce((sum, c) => sum + (Number(c.total_revenue) || 0), 0);
        newState.taxMetrics.total_invoices = newState.sales.length;
      }

      setReportState(prev => ({ ...prev, ...newState, loading: false, error: null }));
    } catch (err) {
      setReportState(prev => ({ ...prev, loading: false, error: err.message }));
    } finally {
      isFetching.current = false;
    }
  }, [reportType, startDate, endDate]);

  // Auto-fetch on mount
  React.useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleExport = () => {
    let csvContent = "";
    const timestamp = new Date().toISOString().slice(0, 10);
    if (reportType === "salesSummary") {
      csvContent = "Date,Invoice Number,Customer Name,Amount (INR),Tax (INR),Status\n";
      reportState.sales.forEach(row => {
        csvContent += `${row.date},${row.invoice},"${row.customer}",${row.amount},${row.tax},${row.invoice_status}\n`;
      });
    } else if (reportType === "customerReport") {
      csvContent = "Customer Name,Total Invoices,Life-time Revenue (INR)\n";
      reportState.customers.forEach(row => {
        csvContent += `"${row.customer}",${row.total_invoices},${row.total_revenue}\n`;
      });
    } else if (reportType === "taxReport") {
      const tm = reportState.taxMetrics;
      csvContent = "Metric,Accounting Value (INR)\n";
      csvContent += `Total Invoices Generated,${tm.total_invoices || 0}\nCentral Tax (CGST),${tm.total_cgst || 0}\nState Tax (SGST),${tm.total_sgst || 0}\nIntegrated Tax (IGST),${tm.total_igst || 0}\nGross Tax Liability,${tm.total_tax || 0}\nNet Taxable Value,${tm.taxable_value || 0}\n`;
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Report_${reportType}_${timestamp}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => { window.print(); };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto no-print">
        <BackButton />
        <ReportHeader 
          onExport={handleExport} 
          onPrint={handlePrint} 
        />

        <ReportFilters 
          reportType={reportType}
          setReportType={setReportType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onRunAnalysis={fetchReportData}
          loading={reportState.loading}
        />

        <ReportStats 
          taxMetrics={reportState.taxMetrics}
          customers={reportState.customers}
          reportType={reportType}
          sales={reportState.sales}
        />

        <VisualInsights 
          reportType={reportType}
          chart={reportState.chart}
          statusBreakdown={reportState.statusBreakdown}
          loading={reportState.loading}
        />

        <FinancialLedger 
          reportType={reportType}
          sales={reportState.sales}
          customers={reportState.customers}
          taxMetrics={reportState.taxMetrics}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          loading={reportState.loading}
        />
      </div>

      <style>{`
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-block { display: block !important; padding: 30px; }
          table { width: 100%; border: 2px solid #000; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 10px; font-size: 10px; }
          th { background: #f8fafc !important; }
        }
      `}</style>

      <PrintView 
        reportType={reportType}
        sales={reportState.sales}
        customers={reportState.customers}
        taxMetrics={reportState.taxMetrics}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
