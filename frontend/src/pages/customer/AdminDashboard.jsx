import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Card, CardContent, Grid, Stack, Typography,
  Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Select, FormControl, InputLabel, Chip,
  IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Alert, CircularProgress, useTheme, useMediaQuery
} from '@mui/material';
import {
  User, MapPin, CreditCard, Shield, Bell, Trash2, Edit2, Plus,
  Calendar, Mail, Phone, CheckCircle, Clock, Compass, Printer,
  ShieldAlert, RefreshCw, MessageSquare, ShieldCheck, DollarSign,
  TrendingUp, TrendingDown, ArrowRight, Eye, Search, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { keyframes } from '@mui/system';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { getCart } from '../../api/cartApi';
import { getDashboardStats, getRevenueChart } from '../../api/dashboardApi';
import { getOrders, updateOrderStatus } from '../../api/checkoutApi';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Map backend RentalStatus enum integers to display strings
const STATUS_LABELS = {
  1: 'Draft',
  2: 'Quotation Sent',
  3: 'Reserved',
  4: 'PickedUp',
  5: 'Returned',
  6: 'Cancelled',
  7: 'Late',
  8: 'Active',
};

const STATUS_COLORS = {
  3: 'info',      // Reserved
  4: 'secondary', // PickedUp
  5: 'success',   // Returned
  6: 'error',     // Cancelled
  7: 'error',     // Late
  8: 'success',   // Active
  1: 'default',   // Draft
  2: 'warning',   // Quotation Sent
};

const getStatusLabel = (s) => STATUS_LABELS[s] ?? String(s);
const getStatusColor = (s) => STATUS_COLORS[s] ?? 'default';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Loading & data state
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Backend data
  const [stats, setStats] = useState(null);
  const [revenueChart, setRevenueChart] = useState([]);
  const [rentals, setRentals] = useState([]);

  // Search/filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dialogs
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editStatusValue, setEditStatusValue] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cart count
  useEffect(() => {
    getCart().then(items => setCartCount(items.length)).catch(() => {});
  }, []);

  // Load data from backend
  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, chartData, ordersData] = await Promise.all([
        getDashboardStats(),
        getRevenueChart(),
        getOrders(),
      ]);
      setStats(statsData);
      setRevenueChart(Array.isArray(chartData) ? chartData : []);
      // Normalize orders from backend
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
        email: '',
        rawStatus: o.status,
      }));
      setRentals(normalized);
    } catch (err) {
      console.error('Dashboard load error:', err);
      toast.error('Failed to load dashboard data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('Dashboard refreshed!');
  };

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error(err); } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    }
  };

  // Filtered Rentals
  const filteredRentals = useMemo(() => {
    return rentals.filter(r => {
      const matchesSearch =
        (r.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.productName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        getStatusLabel(r.status).toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [rentals, searchTerm, statusFilter]);

  // Status overview from real orders
  const statusOverview = useMemo(() => {
    const counts = {};
    rentals.forEach(r => {
      const label = getStatusLabel(r.status);
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([label, count]) => ({
      label, count,
      color: getStatusColor(
        Object.entries(STATUS_LABELS).find(([, v]) => v === label)?.[0]
      )
    }));
  }, [rentals]);

  // Actions
  const handleOpenView = (order) => { setSelectedOrder(order); setViewDialogOpen(true); };
  const handleOpenEdit = (order) => {
    setSelectedOrder(order);
    setEditStatusValue(order.status);
    setEditDialogOpen(true);
  };
  const handleSaveStatus = async () => {
    try {
      await updateOrderStatus(selectedOrder.id, Number(editStatusValue));
      toast.success(`Status updated to ${getStatusLabel(Number(editStatusValue))}`);
      setEditDialogOpen(false);
      await loadData();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  // Stat icon helper
  const getStatIcon = (key) => {
    const map = {
      activeRentals:   <Clock size={22} color="#4f46e5" />,
      todayPickups:    <Compass size={22} color="#059669" />,
      todayReturns:    <RefreshCw size={22} color="#2563eb" />,
      lateRentals:     <ShieldAlert size={22} color="#dc2626" />,
      totalRevenue:    <DollarSign size={22} color="#059669" />,
      totalDeposit:    <ShieldCheck size={22} color="#4f46e5" />,
      totalProducts:   <CreditCard size={22} color="#d97706" />,
      totalCustomers:  <User size={22} color="#64748b" />,
    };
    return map[key] || <CreditCard size={22} color="#64748b" />;
  };

  const summaryCards = stats ? [
    { key: 'activeRentals',  title: 'Active Rentals',         value: stats.activeRentals,         trend: null },
    { key: 'todayPickups',   title: "Today's Pickups",        value: stats.todayPickups,           trend: null },
    { key: 'todayReturns',   title: "Today's Returns",        value: stats.todayReturns,           trend: null },
    { key: 'lateRentals',    title: 'Overdue Rentals',        value: stats.lateRentals,            trend: null },
    { key: 'totalRevenue',   title: 'Total Revenue',          value: money.format(stats.totalRevenue),    trend: null },
    { key: 'totalDeposit',   title: 'Security Deposits Held', value: money.format(stats.totalDeposit),    trend: null },
    { key: 'totalProducts',  title: 'Total Products',         value: stats.totalProducts,          trend: null },
    { key: 'totalCustomers', title: 'Registered Customers',   value: stats.totalCustomers,         trend: null },
  ] : [];

  const maxRevenue = revenueChart.reduce((m, d) => Math.max(m, d.revenue || 0), 1);

  return (
    <Box>
      <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
        <Box sx={{ animation: `${fadeInUp} 0.5s ease-out` }}>

          {/* Header */}
          <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'uppercase', fontWeight: 800 }}>
                RentX Operations Center
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.02em', mt: 0.5 }}>
                Welcome back, Admin
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Monitor live rentals, orders and inventory metrics.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack direction="row" spacing={2} sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{currentTime}</Typography>
                </Box>
                <IconButton onClick={handleRefresh} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                  <RefreshCw size={18} style={{ animation: loading ? `${spin} 1s linear infinite` : 'none' }} />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>

          {/* Summary Cards */}
          {loading ? (
            <Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Box>
          ) : (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {summaryCards.map((stat) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.key}>
                  <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(79,70,229,0.08)', borderColor: 'primary.light' }, transition: 'all 0.3s' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                        <Box sx={{ p: 1, borderRadius: 2.5, bgcolor: '#f1f5f9' }}>
                          {getStatIcon(stat.key)}
                        </Box>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{stat.title}</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, my: 0.5 }}>{stat.value}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Status Breakdown */}
          {statusOverview.length > 0 && (
            <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 4, boxShadow: '0 10px 30px rgba(15,23,42,0.04)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 2, textTransform: 'uppercase' }}>
                  Live Status Breakdown
                </Typography>
                <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {statusOverview.map(item => (
                    <Chip
                      key={item.label}
                      label={`${item.label} (${item.count})`}
                      color={item.color || 'default'}
                      onClick={() => { setStatusFilter(item.label); }}
                      sx={{ fontWeight: 700 }}
                    />
                  ))}
                  {statusFilter !== 'all' && (
                    <Chip label="Clear Filter" onClick={() => setStatusFilter('all')} variant="outlined" />
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}

          <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* Orders Table */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15,23,42,0.06)', mb: 4 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Recent Rental Orders</Typography>
                    <Stack direction="row" spacing={1.5} sx={{ flexGrow: 1, justifyContent: 'flex-end' }}>
                      <TextField
                        size="small"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{ startAdornment: <Search size={16} style={{ marginRight: 8, color: '#64748b' }} /> }}
                        sx={{ maxWidth: 220 }}
                      />
                    </Stack>
                  </Box>

                  {loading ? (
                    <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress /></Box>
                  ) : filteredRentals.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                      <Typography variant="body1">No rental orders found.</Typography>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Products</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Rental Period</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredRentals.map((row) => (
                            <TableRow key={row.id} hover>
                              <TableCell sx={{ fontWeight: 700 }}>{row.orderNumber}</TableCell>
                              <TableCell>{row.customerName}</TableCell>
                              <TableCell>{row.productName}</TableCell>
                              <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}>{row.rentalPeriod}</TableCell>
                              <TableCell align="right">{money.format(row.totalAmount)}</TableCell>
                              <TableCell>
                                <Chip
                                  label={getStatusLabel(row.status)}
                                  size="small"
                                  color={getStatusColor(row.status)}
                                  sx={{ fontWeight: 700 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={0.5}>
                                  <IconButton size="small" onClick={() => handleOpenView(row)}><Eye size={14} /></IconButton>
                                  <IconButton size="small" onClick={() => handleOpenEdit(row)}><Edit2 size={14} /></IconButton>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>

              {/* Revenue Chart */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15,23,42,0.06)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 3 }}>Monthly Revenue Trend (₹)</Typography>
                  {revenueChart.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No revenue data yet.</Typography>
                  ) : (
                    <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', pt: 2, px: 1 }}>
                      {revenueChart.map((data, index) => {
                        const barHeight = (data.revenue / maxRevenue) * 150;
                        return (
                          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                            <Box sx={{
                              width: '70%', height: barHeight,
                              background: 'linear-gradient(180deg, #4f46e5 0%, #818cf8 100%)',
                              borderRadius: '4px 4px 0 0',
                              transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                            }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, mt: 1, color: 'text.secondary' }}>{data.month}</Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 800, color: 'primary.main' }}>
                              {Math.round(data.revenue / 1000)}k
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={4}>
                {/* Late Rentals Alert */}
                <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15,23,42,0.06)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShieldAlert size={18} color="#dc2626" /> Overdue Rentals
                    </Typography>
                    {rentals.filter(r => r.status === 7).length === 0 ? (
                      <Alert severity="success" sx={{ borderRadius: 2 }}>No overdue rentals — all clear!</Alert>
                    ) : (
                      <Stack spacing={1.5}>
                        {rentals.filter(r => r.status === 7).map((item) => (
                          <Alert severity="error" key={item.id} sx={{ borderRadius: 2.5, '& .MuiAlert-message': { fontSize: '0.78rem', fontWeight: 600 } }}>
                            {item.orderNumber} — {item.customerName} ({item.productName})
                          </Alert>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>

                {/* Today's Pickups */}
                <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15,23,42,0.06)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>Today's Pickups</Typography>
                    {rentals.filter(r => r.pickupDate && new Date(r.pickupDate).toDateString() === new Date().toDateString() && r.status === 3).length === 0 ? (
                      <Typography variant="body2" color="text.secondary">No pickups scheduled for today.</Typography>
                    ) : (
                      <Stack spacing={2}>
                        {rentals.filter(r => r.pickupDate && new Date(r.pickupDate).toDateString() === new Date().toDateString() && r.status === 3).map(item => (
                          <Box key={item.id}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.productName}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Client: {item.customerName} • Order: {item.orderNumber}
                            </Typography>
                            <Divider sx={{ mt: 1.5 }} />
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>

                {/* Today's Returns */}
                <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15,23,42,0.06)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>Today's Returns</Typography>
                    {rentals.filter(r => r.returnDate && new Date(r.returnDate).toDateString() === new Date().toDateString() && r.status === 4).length === 0 ? (
                      <Typography variant="body2" color="text.secondary">No returns scheduled for today.</Typography>
                    ) : (
                      <Stack spacing={2}>
                        {rentals.filter(r => r.returnDate && new Date(r.returnDate).toDateString() === new Date().toDateString() && r.status === 4).map(item => (
                          <Box key={item.id}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.productName}</Typography>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: 'warning.main' }}>
                                {money.format(item.deposit)}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Client: {item.customerName}
                            </Typography>
                            <Divider sx={{ mt: 1.5 }} />
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* View Order Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Order Details</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">Order Number</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrder.orderNumber}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Customer</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrder.customerName}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Products</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrder.productName}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Rental Period</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrder.rentalPeriod}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Deposit</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(selectedOrder.deposit)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(selectedOrder.totalAmount)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Chip label={getStatusLabel(selectedOrder.status)} size="small" color={getStatusColor(selectedOrder.status)} sx={{ fontWeight: 700 }} />
                </Box>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => setViewDialogOpen(false)} sx={{ borderRadius: 999, px: 3 }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Update Order Status</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Stack spacing={2.5}>
              <Typography variant="body2">
                Updating status for <strong>{selectedOrder.orderNumber}</strong>:
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select value={editStatusValue} label="Status" onChange={(e) => setEditStatusValue(e.target.value)}>
                  <MenuItem value={3}>Reserved</MenuItem>
                  <MenuItem value={4}>PickedUp</MenuItem>
                  <MenuItem value={5}>Returned</MenuItem>
                  <MenuItem value={6}>Cancelled</MenuItem>
                  <MenuItem value={7}>Late</MenuItem>
                  <MenuItem value={8}>Active</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setEditDialogOpen(false)} sx={{ borderRadius: 999 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveStatus} sx={{ borderRadius: 999 }}>Save Changes</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AdminDashboard;
