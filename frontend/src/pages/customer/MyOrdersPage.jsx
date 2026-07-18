
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';

import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Chip, Container, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  PackageOpen,
  Calendar,
  DollarSign,
  Clock,
  User,
  ShoppingBag,
  Trash2,
  Mail,
  Compass,
  Printer,
  ChevronRight,
  RefreshCw,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { customerMockOrders } from '../../data/customerMocks';
import { getCart } from '../../api/cartApi';

import { getOrders } from '../../api/checkoutApi';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const filterByTab = (orders, tab) => {
  if (tab === 'upcoming') return orders.filter((order) => order.status === 'Upcoming' || order.status === 0 || order.status === 'Reserved');
  if (tab === 'completed') return orders.filter((order) => order.status === 'Completed' || order.status === 3 || order.status === 'Returned');
  if (tab === 'cancelled') return orders.filter((order) => order.status === 'Cancelled' || order.status === 4);
  return orders;
};

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // Tabs, Search & Filters State
  const [tab, setTab] = useState('all');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Interactive Modal Dialog States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem('rental_orders') || '[]');
      const allNormalized = [...saved, ...customerMockOrders].map(normalizeOrder);
      setOrders(allNormalized);
      setLoading(false);
    }, 1200); // 1.2s delay to show skeletons
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await getCart();
        setCartCount(items.length);
      } catch (err) {
        console.warn('Could not fetch cart count:', err);
      }
    };
    fetchCart();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        const backendOrders = await getOrders();
        if (isMounted && backendOrders) {
          const formattedOrders = backendOrders.map((order) => {
            const rentalStart = order.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : '';
            const rentalEnd = order.returnDate ? new Date(order.returnDate).toLocaleDateString() : '';
            
            // Map numeric status back to string if needed, depending on enum serialization
            let statusString = order.status;
            if (typeof order.status === 'number') {
               const statuses = ['Reserved', 'Active', 'Overdue', 'Returned', 'Cancelled'];
               statusString = statuses[order.status] || 'Unknown';
            }

            return {
              id: order.id,
              orderNumber: order.orderNumber || order.id,
              status: statusString,
              statusKey: String(statusString).toLowerCase(),
              itemName: order.items?.map(i => i.name).join(', ') || 'Rental Items',
              rentalDuration: `${rentalStart} to ${rentalEnd}`,
              deliveryDate: rentalStart,
              total: order.totalAmount,
            };
          });
          setOrders(formattedOrders);
        }
      } catch (err) {
        console.error('Failed to fetch backend orders:', err);
      }
    };
    fetchOrders();
    return () => { isMounted = false; };
  }, []);

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error(err); } finally { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login', { replace: true }); }
  };


  // Actions
  const handleTrackRental = (id) => {
    navigate(`/track/${id}`);
  };

  const handleDownloadInvoice = (orderItem) => {
    window.open(`/invoice/${orderItem.id}`, '_blank');
  };

  const handleOpenContact = (orderItem) => {
    setSelectedOrder(orderItem);
    setContactSubject(`Inquiry regarding Booking ${orderItem.id}`);
    setContactMessage('');
    setContactOpen(true);
  };

  const handleSendContact = () => {
    if (!contactMessage.trim()) {
      toast.error('Please type a message before sending.');
      return;
    }
    toast.success(`Message sent to vendor partner for order ${selectedOrder.orderNumber}!`);
    setContactOpen(false);
  };

  const handleOpenCancel = (orderItem) => {
    setOrderToCancel(orderItem);
    setCancelConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!orderToCancel) return;

    // Mutate in localStorage
    const saved = JSON.parse(localStorage.getItem('rental_orders') || '[]');
    const updatedSaved = saved.map((o) => {
      if (String(o.id) === String(orderToCancel.id)) {
        return { ...o, status: 'Cancelled', statusKey: 'cancelled' };
      }
      return o;
    });
    localStorage.setItem('rental_orders', JSON.stringify(updatedSaved));

    // Update state
    setOrders((current) =>
      current.map((o) => {
        if (String(o.id) === String(orderToCancel.id)) {
          return { ...o, status: 'Cancelled', statusKey: 'cancelled', paymentStatus: 'Refunded' };
        }
        return o;
      })
    );

    toast.success(`Booking ${orderToCancel.id} cancelled successfully.`);
    setCancelConfirmOpen(false);
    setOrderToCancel(null);
  };

  // Stats summaries
  const stats = useMemo(() => {
    const total = orders.length;
    const active = orders.filter((o) => o.statusKey === 'active').length;
    const upcoming = orders.filter((o) => o.statusKey === 'upcoming').length;
    const pendingReturns = orders.filter((o) => o.statusKey === 'active').length;
    const completed = orders.filter((o) => o.statusKey === 'completed').length;
    return { total, active, upcoming, pendingReturns, completed };
  }, [orders]);

  // Filtering & Sorting logic
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        // Tab filter
        if (tab !== 'all' && o.statusKey !== tab) return false;

        // Search filter
        if (searchTerm) {
          const q = searchTerm.toLowerCase().trim();
          const matchName = o.productName.toLowerCase().includes(q);
          const matchId = o.id.toLowerCase().includes(q);
          const matchOrder = o.orderNumber.toLowerCase().includes(q);
          if (!matchName && !matchId && !matchOrder) return false;
        }

        // Status select filter
        if (statusFilter !== 'all' && o.status.toLowerCase() !== statusFilter.toLowerCase()) return false;

        // Payment status filter
        if (paymentFilter !== 'all' && o.paymentStatus.toLowerCase() !== paymentFilter.toLowerCase()) return false;

        // Date range filter
        if (dateRangeFilter !== 'all') {
          const orderDate = new Date(o.createdAt);
          const now = new Date();
          const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
          if (dateRangeFilter === '30days' && diffDays > 30) return false;
          if (dateRangeFilter === '6months' && diffDays > 180) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'price-desc') return b.totalPaid - a.totalPaid;
        if (sortBy === 'price-asc') return a.totalPaid - b.totalPaid;
        if (sortBy === 'duration-desc') return b.rentalDurationDays - a.rentalDurationDays;
        if (sortBy === 'duration-asc') return a.rentalDurationDays - b.rentalDurationDays;
        return 0;
      });
  }, [orders, tab, searchTerm, statusFilter, paymentFilter, dateRangeFilter, sortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Currently Renting':
      case 'Active':
      case 'Picked Up':
        return 'info';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      case 'Pending Payment':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const renderStats = () => (
    <Grid container spacing={2} sx={{ mb: 4 }} className="no-print">
      {[
        { title: 'Total Rentals', value: stats.total, color: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
        { title: 'Active Rentals', value: stats.active, color: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' },
        { title: 'Upcoming Pickups', value: stats.upcoming, color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
        { title: 'Pending Returns', value: stats.pendingReturns, color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        { title: 'Completed Rentals', value: stats.completed, color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }
      ].map((stat, idx) => (
        <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={idx}>
          <Card sx={{
            borderRadius: 3.5,
            border: '1px solid',
            borderColor: 'divider',
            background: stat.color,
            color: '#fff',
            boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.85 }}>{stat.title}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5 }}>{stat.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderSkeletons = () => (
    <Stack spacing={3}>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 3 }}><Skeleton variant="rectangular" height={130} sx={{ borderRadius: 3 }} /></Grid>
              <Grid size={{ xs: 12, sm: 9 }}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" />
                <Grid container spacing={2} sx={{ mt: 2 }}><Grid size={3}><Skeleton variant="text" /></Grid><Grid size={3}><Skeleton variant="text" /></Grid><Grid size={3}><Skeleton variant="text" /></Grid></Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  const renderEmptyState = () => (
    <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mt: 3, textAlign: 'center' }}>
      <CardContent sx={{ py: 8 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', bgcolor: 'grey.100', mb: 3 }}>
          <PackageOpen size={36} color="#64748b" />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>No rentals yet</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>Explore our premium catalog to book products.</Typography>
        <Button variant="contained" onClick={() => navigate(PATHS.ROOT)} sx={{ borderRadius: 999, px: 3, py: 1.1, textTransform: 'none', fontWeight: 700 }}>
          Browse Products
        </Button>
      </CardContent>
    </Card>
  );

  const filteredOrders = filterByTab(orders, tab);


  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#f8fafc',
      '@media print': {
        bgcolor: '#fff',
        '.no-print': { display: 'none' }
      }
    }}>
      <Box className="no-print">
        <Navbar onSearchChange={() => {}} cartCount={cartCount} onLogout={handleLogout} />
      </Box>

      <Container maxWidth="xl" sx={{ pt: '94px', pb: 8 }}>
        <Button className="no-print" variant="outlined" startIcon={<ArrowLeft size={16} />} onClick={() => navigate(PATHS.ROOT)} sx={{ mb: 3, borderRadius: 999, px: 2.25, py: 0.9 }}>
          Back to products
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, letterSpacing: '-0.02em' }}>My Rentals Dashboard</Typography>

        {/* Dashboard stats cards */}
        {renderStats()}

        {/* Search, filters, sorting panel */}
        <Card className="no-print" sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 3 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by product, ID, or order number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search size={18} style={{ marginRight: 8, color: '#64748b' }} />,
                  }}
                />
              </Grid>

              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="upcoming">Upcoming</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Payment Status</InputLabel>
                  <Select value={paymentFilter} label="Payment Status" onChange={(e) => setPaymentFilter(e.target.value)}>
                    <MenuItem value="all">All Payment Status</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="refunded">Refunded</MenuItem>
                    <MenuItem value="pending payment">Pending Payment</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Rental Date</InputLabel>
                  <Select value={dateRangeFilter} label="Rental Date" onChange={(e) => setDateRangeFilter(e.target.value)}>
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="30days">Last 30 Days</MenuItem>
                    <MenuItem value="6months">Last 6 Months</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="price-desc">Price: High to Low</MenuItem>
                    <MenuItem value="price-asc">Price: Low to High</MenuItem>
                    <MenuItem value="duration-desc">Duration: Longest</MenuItem>
                    <MenuItem value="duration-asc">Duration: Shortest</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tab filters */}
        <Card className="no-print" sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 3 }}>
          <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
            <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
              <Tab label="All Rentals" value="all" sx={{ fontWeight: 700, textTransform: 'none' }} />
              <Tab label="Active" value="active" sx={{ fontWeight: 700, textTransform: 'none' }} />
              <Tab label="Upcoming" value="upcoming" sx={{ fontWeight: 700, textTransform: 'none' }} />
              <Tab label="Completed" value="completed" sx={{ fontWeight: 700, textTransform: 'none' }} />
              <Tab label="Cancelled" value="cancelled" sx={{ fontWeight: 700, textTransform: 'none' }} />
            </Tabs>
          </CardContent>
        </Card>

        {/* Render body */}
        {loading ? (
          renderSkeletons()
        ) : filteredOrders.length === 0 ? (
          renderEmptyState()
        ) : (
          <Grid container spacing={3}>
            {filteredOrders.map((orderItem) => (
              <Grid size={12} key={orderItem.id}>
                <Card sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-2px)' }
                }}>
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid size={{ xs: 12, sm: 3, md: 2.5 }}>
                        <Box
                          component="img"
                          src={orderItem.productImage}
                          alt={orderItem.productName}
                          sx={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 9, md: 9.5 }}>
                        <Stack spacing={1.5}>
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 800 }}>{orderItem.productName}</Typography>
                              <Typography variant="caption" color="text.secondary">Category: {orderItem.category} • Partner: {orderItem.vendorName}</Typography>
                            </Box>
                            <Stack direction="row" spacing={1} sx={{ mt: { xs: 1, sm: 0 } }}>
                              <Chip label={orderItem.status} color={getStatusColor(orderItem.status)} size="small" sx={{ fontWeight: 700 }} />
                              <Chip label={orderItem.paymentStatus} variant="outlined" size="small" sx={{ fontWeight: 700 }} />
                            </Stack>
                          </Box>

                          <Grid container spacing={1.5}>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Typography variant="caption" color="text.secondary">Rental ID / Order #</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{orderItem.id}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Typography variant="caption" color="text.secondary">Duration</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Clock size={14} />
                                {orderItem.rentalDurationDays} day(s)
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Typography variant="caption" color="text.secondary">Pickup / Return Dates</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Calendar size={14} />
                                {orderItem.pickupDate} - {orderItem.returnDate}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Typography variant="caption" color="text.secondary">Rental Cost / Deposit</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(orderItem.rentalCharges)} (+{money.format(orderItem.securityDeposit)} Deposit)</Typography>
                            </Grid>
                          </Grid>

                          <Divider />

                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Paid: <span style={{ color: '#4f46e5' }}>{money.format(orderItem.totalPaid)}</span></Typography>
                            <Stack direction="row" spacing={1.25} sx={{ flexWrap: 'wrap', gap: 1 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => navigate(`/orders/${orderItem.id}`)}
                                sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
                              >
                                View Details
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleTrackRental(orderItem.id)}
                                sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
                              >
                                Track Rental
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleDownloadInvoice(orderItem)}
                                sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
                              >
                                Invoice
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="info"
                                onClick={() => handleOpenContact(orderItem)}
                                sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
                              >
                                Contact Vendor
                              </Button>
                              {orderItem.statusKey === 'upcoming' && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleOpenCancel(orderItem)}
                                  sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
                                >
                                  Cancel Booking
                                </Button>
                              )}
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => navigate(`/product/${orderItem.productId}`)}
                                sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
                              >
                                Rebook
                              </Button>
                            </Stack>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Rental Booking Details</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box
                  component="img"
                  src={selectedOrder.productImage}
                  alt={selectedOrder.productName}
                  sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover', border: '1px solid', borderColor: 'divider' }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{selectedOrder.productName}</Typography>
                  <Typography variant="body2" color="text.secondary">Category: {selectedOrder.category}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Vendor Partner: {selectedOrder.vendorName}</Typography>
                </Box>
              </Box>

              <Divider />

              <Grid container spacing={2}>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Rental ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrder.id}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Order Number</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrder.orderNumber}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Pickup Window</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrder.pickupDate} onwards</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Return Schedule</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>On or before {selectedOrder.returnDate}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Duration</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrder.rentalDurationDays} day(s)</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Transaction ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrder.transactionId}</Typography>
                </Grid>
              </Grid>

              <Divider />

              <Stack spacing={1.25}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Financial Summary</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Rental Charges</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(selectedOrder.rentalCharges)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Refundable Security Deposit</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(selectedOrder.securityDeposit)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Taxes & Fees</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(selectedOrder.totalPaid - selectedOrder.rentalCharges - selectedOrder.securityDeposit)}</Typography>
                </Box>
                <Divider sx={{ my: 0.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>Grand Total</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>{money.format(selectedOrder.totalPaid)}</Typography>
                </Box>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" startIcon={<Printer size={16} />} onClick={() => handleDownloadInvoice(selectedOrder)} sx={{ borderRadius: 999, textTransform: 'none' }}>
            Print Invoice
          </Button>
          <Button onClick={() => setDetailsOpen(false)} variant="contained" sx={{ borderRadius: 999, textTransform: 'none' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contact Vendor Dialog */}
      <Dialog open={contactOpen} onClose={() => setContactOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Send Message to Vendor</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">To Vendor</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrder.vendorName}</Typography>
              </Box>
              <TextField
                label="Subject"
                size="small"
                fullWidth
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
              />
              <TextField
                label="Type your message"
                multiline
                rows={4}
                fullWidth
                placeholder="E.g., request pickup status update, delay notifications..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setContactOpen(false)} sx={{ borderRadius: 999, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button variant="contained" startIcon={<Mail size={16} />} onClick={handleSendContact} sx={{ borderRadius: 999, textTransform: 'none' }}>
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelConfirmOpen} onClose={() => setCancelConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to cancel booking {orderToCancel?.id}?
            This action will release the item reservation and initiate a full deposit refund.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setCancelConfirmOpen(false)} sx={{ borderRadius: 999, textTransform: 'none' }}>
            Keep Booking
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmCancel} sx={{ borderRadius: 999, textTransform: 'none' }}>
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyOrdersPage;
