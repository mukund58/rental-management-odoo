import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, CreditCard, Clock, Compass, RefreshCw, ShieldAlert,
  DollarSign, ShieldCheck, TrendingUp, Eye, Edit2, Search,
  X, ChevronDown, AlertTriangle, CheckCircle2, Loader2,
  Package, Users, Calendar, ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { getCart } from '../../api/cartApi';
import { getDashboardStats, getRevenueChart } from '../../api/dashboardApi';
import { getOrders, updateOrderStatus } from '../../api/checkoutApi';
import { cn } from '../../lib/utils';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const STATUS_LABELS = { 1: 'Draft', 2: 'Quotation Sent', 3: 'Reserved', 4: 'PickedUp', 5: 'Returned', 6: 'Cancelled', 7: 'Late', 8: 'Active' };
const STATUS_CLASSES = {
  3: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  4: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  5: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  6: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  7: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  8: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  1: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  2: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const getStatusLabel = (s) => STATUS_LABELS[s] ?? String(s);
const getStatusClass = (s) => STATUS_CLASSES[s] ?? 'bg-slate-100 text-slate-600';

/* ── Stat Card ── */
function StatCard({ icon: Icon, iconBg, title, value, loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
        <div className="mb-4 h-10 w-10 rounded-xl bg-muted" />
        <div className="h-4 w-24 rounded bg-muted mb-2" />
        <div className="h-7 w-16 rounded bg-muted" />
      </div>
    );
  }
  return (
    <div className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30">
      <div className={cn('mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl', iconBg)}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-muted-foreground">{title}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">{value ?? '—'}</p>
    </div>
  );
}

/* ── Status Badge ── */
function StatusBadge({ status }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold', getStatusClass(status))}>
      {getStatusLabel(status)}
    </span>
  );
}

/* ── Modal ── */
function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-accent transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-border px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

/* ── Revenue Bar Chart ── */
function RevenueChart({ data }) {
  const max = data.reduce((m, d) => Math.max(m, d.revenue || 0), 1);
  if (!data.length) return <p className="text-sm text-muted-foreground">No revenue data yet.</p>;
  return (
    <div className="flex h-44 items-end gap-2">
      {data.map((d, i) => {
        const pct = Math.max(4, (d.revenue / max) * 100);
        return (
          <div key={i} className="group flex flex-1 flex-col items-center gap-1">
            <div className="relative w-full">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-primary to-violet-400 transition-all duration-700"
                style={{ height: `${(pct / 100) * 160}px` }}
              />
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 rounded-lg bg-foreground px-2 py-1 text-xs text-background group-hover:block whitespace-nowrap">
                ₹{(d.revenue / 1000).toFixed(1)}k
              </div>
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState(null);
  const [revenueChart, setRevenueChart] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editStatusValue, setEditStatusValue] = useState('');

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const [statsData, chartData, ordersData] = await Promise.all([
        getDashboardStats(), getRevenueChart(), getOrders(),
      ]);
      setStats(statsData);
      setRevenueChart(Array.isArray(chartData) ? chartData : []);
      const normalized = (Array.isArray(ordersData) ? ordersData : []).map(o => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customer,
        productName: o.items?.map(i => i.name).join(', ') || '—',
        rentalPeriod: `${o.pickupDate ? new Date(o.pickupDate).toLocaleDateString('en-IN') : '—'} → ${o.returnDate ? new Date(o.returnDate).toLocaleDateString('en-IN') : '—'}`,
        pickupDate: o.pickupDate,
        returnDate: o.returnDate,
        deposit: o.deposit,
        totalAmount: o.totalAmount,
        status: o.status,
      }));
      setRentals(normalized);
    } catch (err) {
      console.error('Dashboard load error:', err);
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, [refreshKey]);

  const handleRefresh = () => { loadData(true); toast.success('Dashboard refreshed!'); };

  const filteredRentals = useMemo(() =>
    rentals.filter(r => {
      const q = searchTerm.toLowerCase();
      const matchQ = !q || (r.orderNumber || '').toLowerCase().includes(q) ||
        (r.customerName || '').toLowerCase().includes(q) || (r.productName || '').toLowerCase().includes(q);
      const matchS = statusFilter === 'all' || getStatusLabel(r.status).toLowerCase() === statusFilter.toLowerCase();
      return matchQ && matchS;
    }), [rentals, searchTerm, statusFilter]);

  const statusOverview = useMemo(() => {
    const counts = {};
    rentals.forEach(r => {
      const l = getStatusLabel(r.status); counts[l] = (counts[l] || 0) + 1;
    });
    return Object.entries(counts).map(([label, count]) => ({ label, count }));
  }, [rentals]);

  const handleSaveStatus = async () => {
    try {
      await updateOrderStatus(selectedOrder.id, Number(editStatusValue));
      toast.success(`Status updated to ${getStatusLabel(Number(editStatusValue))}`);
      setEditDialogOpen(false);
      await loadData(true);
    } catch { toast.error('Failed to update status.'); }
  };

  const summaryCards = stats ? [
    { icon: Clock, iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400', title: 'Active Rentals', value: stats.activeRentals },
    { icon: Compass, iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', title: "Today's Pickups", value: stats.todayPickups },
    { icon: RefreshCw, iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', title: "Today's Returns", value: stats.todayReturns },
    { icon: ShieldAlert, iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400', title: 'Overdue Rentals', value: stats.lateRentals },
    { icon: DollarSign, iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', title: 'Total Revenue', value: money.format(stats.totalRevenue) },
    { icon: ShieldCheck, iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400', title: 'Security Deposits', value: money.format(stats.totalDeposit) },
    { icon: Package, iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', title: 'Total Products', value: stats.totalProducts },
    { icon: Users, iconBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', title: 'Customers', value: stats.totalCustomers },
  ] : Array(8).fill(null);

  const todayPickups = rentals.filter(r => r.pickupDate &&
    new Date(r.pickupDate).toDateString() === new Date().toDateString() && r.status === 3);
  const todayReturns = rentals.filter(r => r.returnDate &&
    new Date(r.returnDate).toDateString() === new Date().toDateString() && r.status === 4);
  const overdueRentals = rentals.filter(r => r.status === 7);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">RentX Operations Center</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, Admin 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor live rentals, orders and inventory metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-foreground">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <p className="font-mono text-xs text-muted-foreground">{currentTime}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm transition-colors hover:bg-accent"
              title="Refresh"
            >
              <RefreshCw className={cn('h-4 w-4 transition-transform', refreshing && 'animate-spin')} />
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
          {summaryCards.map((card, i) => (
            <StatCard key={i} loading={loading || !card} {...(card || {})} />
          ))}
        </div>

        {/* ── Status Filter Chips ── */}
        {statusOverview.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-2">Live Status:</span>
            {statusOverview.map(item => (
              <button
                key={item.label}
                onClick={() => setStatusFilter(sf => sf === item.label ? 'all' : item.label)}
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-all',
                  statusFilter === item.label
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {item.label} <span className="ml-1.5 rounded-full bg-black/10 px-1.5 py-0.5">{item.count}</span>
              </button>
            ))}
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground hover:bg-accent"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        )}

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ── Left 2/3: Table + Chart ── */}
          <div className="space-y-6 lg:col-span-2">

            {/* Orders Table */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center">
                <h2 className="text-lg font-bold">Recent Rental Orders</h2>
                <div className="relative sm:ml-auto">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search orders…"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="h-9 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-56"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredRentals.length === 0 ? (
                <div className="py-16 text-center">
                  <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm font-medium text-muted-foreground">No rental orders found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        {['Order #', 'Customer', 'Products', 'Period', 'Total', 'Status', ''].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredRentals.map(row => (
                        <tr key={row.id} className="transition-colors hover:bg-muted/30">
                          <td className="px-4 py-3 font-bold text-foreground">{row.orderNumber}</td>
                          <td className="px-4 py-3 text-foreground">{row.customerName}</td>
                          <td className="max-w-[140px] truncate px-4 py-3 text-muted-foreground">{row.productName}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{row.rentalPeriod}</td>
                          <td className="px-4 py-3 font-semibold text-foreground">{money.format(row.totalAmount)}</td>
                          <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button
                                onClick={() => { setSelectedOrder(row); setViewDialogOpen(true); }}
                                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => { setSelectedOrder(row); setEditStatusValue(row.status); setEditDialogOpen(true); }}
                                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Revenue Chart */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-5 text-base font-bold">Monthly Revenue Trend</h2>
              <RevenueChart data={revenueChart} />
            </div>
          </div>

          {/* ── Right 1/3: Alerts ── */}
          <div className="space-y-5">

            {/* Overdue */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/30">
                  <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="font-bold text-foreground">Overdue Rentals</h3>
                {overdueRentals.length > 0 && (
                  <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
                    {overdueRentals.length}
                  </span>
                )}
              </div>
              {overdueRentals.length === 0 ? (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-900/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">All clear — no overdue rentals!</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {overdueRentals.map(item => (
                    <div key={item.id} className="rounded-xl border border-rose-200 bg-rose-50 p-3 dark:border-rose-800/40 dark:bg-rose-900/20">
                      <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
                        {item.orderNumber} — {item.customerName}
                      </p>
                      <p className="text-xs text-rose-600/80 dark:text-rose-500">{item.productName}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Today Pickups */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                  <Compass className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-bold text-foreground">Today's Pickups</h3>
                {todayPickups.length > 0 && (
                  <span className="ml-auto rounded-full bg-indigo-500 px-2 py-0.5 text-xs font-bold text-white">
                    {todayPickups.length}
                  </span>
                )}
              </div>
              {todayPickups.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pickups scheduled today.</p>
              ) : (
                <div className="space-y-3">
                  {todayPickups.map(item => (
                    <div key={item.id} className="rounded-xl bg-muted/50 p-3">
                      <p className="text-sm font-bold text-foreground">{item.productName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.customerName} · {item.orderNumber}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Today Returns */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-foreground">Today's Returns</h3>
                {todayReturns.length > 0 && (
                  <span className="ml-auto rounded-full bg-blue-500 px-2 py-0.5 text-xs font-bold text-white">
                    {todayReturns.length}
                  </span>
                )}
              </div>
              {todayReturns.length === 0 ? (
                <p className="text-sm text-muted-foreground">No returns scheduled today.</p>
              ) : (
                <div className="space-y-3">
                  {todayReturns.map(item => (
                    <div key={item.id} className="rounded-xl bg-muted/50 p-3">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-bold text-foreground">{item.productName}</p>
                        <span className="text-xs font-bold text-amber-600">{money.format(item.deposit)}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.customerName}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── View Order Modal ── */}
      <Modal
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        title="Order Details"
        footer={
          <button
            onClick={() => setViewDialogOpen(false)}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Close
          </button>
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
            {[
              { label: 'Order Number', value: selectedOrder.orderNumber },
              { label: 'Customer', value: selectedOrder.customerName },
              { label: 'Products', value: selectedOrder.productName },
              { label: 'Rental Period', value: selectedOrder.rentalPeriod },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-0.5 font-semibold text-foreground">{value}</p>
              </div>
            ))}
            <div className="flex gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Deposit</p>
                <p className="mt-0.5 font-semibold">{money.format(selectedOrder.deposit)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</p>
                <p className="mt-0.5 font-semibold">{money.format(selectedOrder.totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
                <div className="mt-1"><StatusBadge status={selectedOrder.status} /></div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit Status Modal ── */}
      <Modal
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title="Update Order Status"
        footer={
          <>
            <button
              onClick={() => setEditDialogOpen(false)}
              className="rounded-xl border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-accent"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveStatus}
              className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Save Changes
            </button>
          </>
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Updating status for <strong className="text-foreground">{selectedOrder.orderNumber}</strong>
            </p>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">New Status</label>
              <select
                value={editStatusValue}
                onChange={e => setEditStatusValue(e.target.value)}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
