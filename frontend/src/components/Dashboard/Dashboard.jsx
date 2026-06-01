import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IndianRupee,
  Users,
  Wallet,
  FileStack,
  AlertTriangle,
} from 'lucide-react';
import StatCard from './StatCard';
import DashboardHeader from './DashboardHeader';
import DashboardSkeleton from './DashboardSkeleton';
import CollectionsOverview from './CollectionsOverview';
import InvoiceHealthStrip from './InvoiceHealthStrip';
import InvoiceStatusChart from './InvoiceStatusChart';
import RevenueChart from './RevenueChart';
import RecentInvoices from './RecentInvoices';
import TopCustomers from './TopCustomers';
import TopItemsChart from './TopItemsChart';
import TransactionsChart from './TransactionsChart';
import { getDashboardStats } from '../../lib/api';
import { useCompanySettings } from '../../context/CompanySettingsContext';
import { useFinancialYear } from '../../context/FinancialYearContext';
import FinancialYearSelector from '../Reusables/FinancialYearSelector';
import { formatINR } from './dashboardUtils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { settings } = useCompanySettings();
  const { startDate, endDate, label: fyLabel, isCurrentFy } = useFinancialYear();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await getDashboardStats(startDate, endDate);
      setStats(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl border border-red-100 p-8 max-w-md text-center shadow-sm">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-slate-900 font-semibold mb-1">Could not load dashboard</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button type="button" onClick={() => fetchDashboard()} className="btn-cta-primary">
            Try again
          </button>
        </div>
      </div>
    );
  }

  const outstanding = (stats.dueAmount || 0) + (stats.overdueAmount || 0);
  const totalInvoices =
    (stats.invoicesPaid || 0) + (stats.invoicesDue || 0) + (stats.invoicesOverdue || 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-6 lg:hidden">
          <FinancialYearSelector />
        </div>

        <DashboardHeader
          fyLabel={fyLabel}
          onRefresh={() => fetchDashboard(true)}
          refreshing={refreshing}
        />

        {/* Primary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Revenue this month"
            value={formatINR(stats.totalRevenueCurrentMonth)}
            subtitle={`${fyLabel} total ${formatINR(stats.totalRevenue)}`}
            icon={IndianRupee}
            change={stats.totalRevenueChange}
            changeType={stats.totalRevenueChange >= 0 ? 'positive' : 'negative'}
            variant="primary"
          />
          <StatCard
            title="Outstanding"
            value={formatINR(outstanding)}
            subtitle="Due + overdue invoice value"
            icon={Wallet}
            change={stats.overdueAmountChange}
            changeType={stats.overdueAmountChange <= 0 ? 'positive' : 'negative'}
            changeLabel="overdue vs last month"
            onClick={() => navigate('/invoices?status=Overdue')}
            variant="warning"
          />
          <StatCard
            title="Customers"
            value={stats.activeCustomersInFy ?? stats.totalCustomers}
            subtitle={
              isCurrentFy
                ? `${stats.activeCustomersInFy ?? 0} billed this FY · ${stats.totalCustomers} total`
                : `${stats.activeCustomersInFy ?? 0} with invoices in ${fyLabel}`
            }
            icon={Users}
            change={stats.totalCustomersChange}
            changeType={stats.totalCustomersChange >= 0 ? 'positive' : 'negative'}
            changeLabel="growth this month"
            onClick={() => navigate('/customers')}
            variant="neutral"
          />
          <StatCard
            title="Total invoices"
            value={totalInvoices}
            subtitle={`${stats.invoicesPaid} paid · ${stats.invoicesDue} due · ${stats.invoicesOverdue} overdue`}
            icon={FileStack}
            onClick={() => navigate('/invoices')}
            variant="success"
          />
        </div>

        {/* Collections + invoice health */}
        <div className="space-y-4 mb-6">
          <CollectionsOverview stats={stats} />
          <InvoiceHealthStrip stats={stats} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 min-h-[360px]">
            <RevenueChart />
          </div>
          <div className="min-h-[360px]">
            <InvoiceStatusChart />
          </div>
        </div>

        {/* Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RecentInvoices />
          <TopCustomers />
        </div>

        {/* Secondary charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopItemsChart />
          <TransactionsChart />
        </div>
      </div>
    </div>
  );
}
