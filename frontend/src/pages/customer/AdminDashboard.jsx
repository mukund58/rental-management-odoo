import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  User,
  MapPin,
  CreditCard,
  Shield,
  Bell,
  Trash2,
  Edit2,
  Plus,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  Compass,
  Printer,
  ShieldAlert,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Eye,
  Search,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { keyframes } from '@mui/system';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { getCart } from '../../api/cartApi';
import {
  adminMockSummaryStats,
  adminMockStatusOverview,
  adminMockRentals,
  adminMockPickups,
  adminMockReturns,
  adminMockOverdues,
  adminMockAlerts,
  adminMockTimeline,
  adminMockRevenueChart,
  adminMockWeeklyRentals,
  adminMockTopProducts
} from '../../data/adminMocks';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Loading & Refresh State
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Time State
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Master Lists States
  const [rentals, setRentals] = useState([]);
  const [pickups, setPickups] = useState(adminMockPickups);
  const [returns, setReturns] = useState(adminMockReturns);
  const [overdues, setOverdues] = useState(adminMockOverdues);
  const [alerts, setAlerts] = useState(adminMockAlerts);
  const [timeline, setTimeline] = useState(adminMockTimeline);

  // Modal Action States
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editStatusValue, setEditStatusValue] = useState('');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ customerName: '', productName: '', start: '', end: '', deposit: '', subtotal: '' });

  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [productForm, setProductForm] = useState({ name: '', category: 'Electronics', stock: 5, rate: 300, deposit: 1000 });

  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);
  const [inspectionItem, setInspectionItem] = useState(null);
  const [inspectionNotes, setInspectionNotes] = useState('Quality inspection passed. Equipment returned in clean condition.');
  const [inspectionLateFee, setInspectionLateFee] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial cart count
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
  }, []);

  // Load / Refresh Data
  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      const localOrders = JSON.parse(localStorage.getItem('rental_orders') || '[]');
      const formattedLocal = localOrders.map(o => ({
        id: o.id,
        customerName: 'Sujal Shah',
        productName: o.productName || o.itemName || 'Rental Item',
        productId: o.productId || 'p5',
        rentalPeriod: `${o.rentalStart ? o.rentalStart.split('-').slice(1).reverse().join('/') : '07/19'} - ${o.rentalEnd ? o.rentalEnd.split('-').slice(1).reverse().join('/') : '07/26'}`,
        pickupDate: o.rentalStart || '19 Jul',
        returnDate: o.rentalEnd || '26 Jul',
        deposit: o.securityDeposit || 500,
        status: o.status || 'Confirmed',
        paymentStatus: o.paymentStatus || 'Paid',
        email: 'sujal@example.com'
      }));
      setRentals([...formattedLocal, ...adminMockRentals]);
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('Dashboard metrics refreshed!');
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
      const matchesSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            r.productName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [rentals, searchTerm, statusFilter]);

  // Actions: View Order
  const handleOpenView = (order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  // Actions: Edit status
  const handleOpenEdit = (order) => {
    setSelectedOrder(order);
    setEditStatusValue(order.status);
    setEditDialogOpen(true);
  };

  const handleSaveStatus = () => {
    const updated = rentals.map(r => {
      if (r.id === selectedOrder.id) {
        return { ...r, status: editStatusValue };
      }
      return r;
    });
    setRentals(updated);
    
    // If local order exists, update it in localStorage
    const saved = JSON.parse(localStorage.getItem('rental_orders') || '[]');
    const updatedSaved = saved.map(o => {
      if (o.id === selectedOrder.id) {
        return { ...o, status: editStatusValue };
      }
      return o;
    });
    localStorage.setItem('rental_orders', JSON.stringify(updatedSaved));

    toast.success(`Booking status updated to ${editStatusValue}.`);
    setEditDialogOpen(false);
  };

  // Actions: Quick Return Action
  const handleQuickReturn = (id) => {
    const updated = rentals.map(r => {
      if (r.id === id) {
        return { ...r, status: 'Completed' };
      }
      return r;
    });
    setRentals(updated);

    // Sync localStorage
    const saved = JSON.parse(localStorage.getItem('rental_orders') || '[]');
    const updatedSaved = saved.map(o => {
      if (o.id === id) {
        return { ...o, status: 'Completed', statusKey: 'completed' };
      }
      return o;
    });
    localStorage.setItem('rental_orders', JSON.stringify(updatedSaved));

    toast.success(`Item successfully returned for Order ${id}.`);
  };

  // Actions: Confirm Pickup (Schedule)
  const handleConfirmPickup = (id) => {
    setPickups(prev => prev.filter(p => p.id !== id));
    
    // Update main table if matched
    setRentals(prev => prev.map(r => r.id === id ? { ...r, status: 'Active' } : r));

    // timeline update log
    setTimeline(prev => [
      { time: 'Just Now', title: 'Pickup Confirmed', detail: `Handoff completed for booking ID ${id}.` },
      ...prev
    ]);

    toast.success(`Pickup confirmed for Order ${id}. Status changed to Active.`);
  };

  // Actions: Inspection return Dialog
  const handleOpenInspection = (item) => {
    setInspectionItem(item);
    setInspectionLateFee(item.lateFee || 0);
    setInspectionNotes('Quality inspection passed. Equipment returned in clean condition.');
    setInspectionDialogOpen(true);
  };

  const handleConfirmInspection = () => {
    setReturns(prev => prev.filter(r => r.id !== inspectionItem.id));
    setOverdues(prev => prev.filter(o => o.id !== inspectionItem.id));

    // Update main table
    setRentals(prev => prev.map(r => r.id === inspectionItem.id ? { ...r, status: 'Completed' } : r));

    // Timeline logs
    setTimeline(prev => [
      { time: 'Just Now', title: 'Product Returned & Inspected', detail: `Order ID ${inspectionItem.id} inspection approved. Refund released.` },
      ...prev
    ]);

    toast.success(`Inspection approved for Order ${inspectionItem.id}. Refund process initiated.`);
    setInspectionDialogOpen(false);
  };

  // Action: Contact customer
  const handleContactCustomer = (email) => {
    toast(`Alert email dispatched to ${email}`, {
      icon: '✉️',
    });
  };

  // Quick Action: Create Rental
  const handleCreateRental = () => {
    if (!createForm.customerName.trim() || !createForm.productName.trim() || !createForm.start || !createForm.end) {
      toast.error('Customer, Product, and Date details are required.');
      return;
    }

    const startVal = new Date(createForm.start);
    const endVal = new Date(createForm.end);
    const days = Math.max(1, Math.ceil((endVal - startVal) / (1000 * 60 * 60 * 24)));

    const newOrdId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRentObj = {
      id: newOrdId,
      customerName: createForm.customerName,
      productName: createForm.productName,
      productId: 'p4',
      rentalPeriod: `${createForm.start.split('-').slice(1).reverse().join('/')} - ${createForm.end.split('-').slice(1).reverse().join('/')}`,
      pickupDate: createForm.start,
      returnDate: createForm.end,
      deposit: Number(createForm.deposit || 500),
      status: 'Confirmed',
      paymentStatus: 'Paid',
      email: 'customer@example.com'
    };

    setRentals(prev => [newRentObj, ...prev]);

    // Save mock order to local storage
    const saved = JSON.parse(localStorage.getItem('rental_orders') || '[]');
    const newLocalOrd = {
      id: newOrdId,
      orderNumber: newOrdId,
      transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'Confirmed',
      statusKey: 'upcoming',
      rentalStart: createForm.start,
      rentalEnd: createForm.end,
      itemName: createForm.productName,
      productName: createForm.productName,
      totalAmount: Number(createForm.subtotal || 1500) + Number(createForm.deposit || 500),
      securityDeposit: Number(createForm.deposit || 500),
      createdAt: new Date().toISOString(),
      items: []
    };
    localStorage.setItem('rental_orders', JSON.stringify([newLocalOrd, ...saved]));

    setTimeline(prev => [
      { time: 'Just Now', title: 'Manual Booking Created', detail: `${createForm.customerName} rented ${createForm.productName} for ${days} day(s).` },
      ...prev
    ]);

    toast.success(`Booking ${newOrdId} successfully generated!`);
    setCreateDialogOpen(false);
  };

  // Quick Action: Add Product
  const handleAddProduct = () => {
    if (!productForm.name.trim() || !productForm.rate) {
      toast.error('Product Name and Rate details are required.');
      return;
    }

    setTimeline(prev => [
      { time: 'Just Now', title: 'Product Added to Catalog', detail: `${productForm.name} added with stock level ${productForm.stock}.` },
      ...prev
    ]);

    toast.success(`${productForm.name} successfully registered in inventory!`);
    setAddProductDialogOpen(false);
  };

  // Helper icons selector for Summary metrics
  const getStatIcon = (id) => {
    switch (id) {
      case 'active': return <Clock size={22} color="#4f46e5" />;
      case 'due-today': return <Calendar size={22} color="#d97706" />;
      case 'pickups': return <Compass size={22} color="#059669" />;
      case 'returns': return <RefreshCw size={22} color="#2563eb" />;
      case 'overdue': return <ShieldAlert size={22} color="#dc2626" />;
      case 'revenue': return <DollarSign size={22} color="#059669" />;
      case 'deposits': return <ShieldCheck size={22} color="#4f46e5" />;
      default: return <CreditCard size={22} color="#64748b" />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Navbar onSearchChange={() => {}} cartCount={cartCount} onLogout={handleLogout} />

      <Container maxWidth="xl" sx={{ pt: '94px', pb: 8 }}>
        <Box sx={{ animation: `${fadeInUp} 0.5s ease-out` }}>
          
          {/* Welcome Header */}
          <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'uppercase', tracking: '0.1em', fontWeight: 800 }}>
                RentX Corporate Administration
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.02em', mt: 0.5 }}>
                Welcome back, Admin
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Monitor system status, verify handoffs, manage refunds, and track inventory metrics.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack direction="row" spacing={2} sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                  <Typography variant="caption" color="text.secondary">{currentTime}</Typography>
                </Box>
                <IconButton onClick={handleRefresh} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <RefreshCw size={18} style={{ animation: loading ? `${spin} 1s linear infinite` : 'none' }} />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>

          {/* Quick Shortcuts Buttons */}
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 4, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 2, textTransform: 'uppercase' }}>Quick Action Shortcuts</Typography>
              <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => {
                  setCreateForm({ customerName: '', productName: '', start: '', end: '', deposit: '', subtotal: '' });
                  setCreateDialogOpen(true);
                }} sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}>
                  Create Rental
                </Button>
                <Button variant="outlined" startIcon={<Plus size={16} />} onClick={() => {
                  setProductForm({ name: '', category: 'Electronics', stock: 5, rate: 300, deposit: 1000 });
                  setAddProductDialogOpen(true);
                }} sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}>
                  Add Product
                </Button>
                <Button variant="outlined" onClick={() => navigate(PATHS.PRODUCTS)} sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}>
                  Manage Products
                </Button>
                <Button variant="outlined" onClick={() => toast.success('Fulfillment pickups report generated.')} sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}>
                  Pickup Management
                </Button>
                <Button variant="outlined" onClick={() => toast.success('Returned equipment validation schedule active.')} sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}>
                  Return Management
                </Button>
                <Button variant="outlined" onClick={() => toast.success('Loading client profile database.')} sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}>
                  Manage Customers
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Summary stats cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {adminMockSummaryStats.map((stat) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.id}>
                <Card sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(79, 70, 229, 0.08)',
                    borderColor: 'primary.light'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                      <Box sx={{ p: 1, borderRadius: 2.5, bgcolor: '#f1f5f9' }}>
                        {getStatIcon(stat.id)}
                      </Box>
                      <Chip
                        label={stat.trend}
                        size="small"
                        color={stat.trend.startsWith('+') ? 'success' : stat.trend === '0%' ? 'default' : 'error'}
                        sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{stat.title}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, my: 0.5 }}>{stat.value}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>{stat.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Status Breakdown overview chips */}
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 4, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 2, textTransform: 'uppercase' }}>Fulfillment Status Breakdown</Typography>
              <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {adminMockStatusOverview.map((item) => (
                  <Chip
                    key={item.label}
                    label={`${item.label} (${item.count})`}
                    color={item.color}
                    onClick={() => {
                      setStatusFilter(item.label);
                      toast.success(`Filtered table by status: ${item.label}`);
                    }}
                    sx={{ fontWeight: 700 }}
                  />
                ))}
                {statusFilter !== 'all' && (
                  <Chip label="Clear Filter" onClick={() => setStatusFilter('all')} variant="outlined" />
                )}
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={4} sx={{ mb: 4 }}>
            
            {/* Left Column: Recent Orders Table & Charts */}
            <Grid size={{ xs: 12, lg: 8 }}>
              
              {/* Recent Rentals Table */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 4 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyItems: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Recent Rental Orders</Typography>
                    
                    <Stack direction="row" spacing={1.5} sx={{ flexGrow: 1, justifyContent: 'flex-end', width: { xs: '100%', sm: 'auto' } }}>
                      <TextField
                        size="small"
                        placeholder="Search rentals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: <Search size={16} style={{ marginRight: 8, color: '#64748b' }} />
                        }}
                        sx={{ maxWidth: 220 }}
                      />
                    </Stack>
                  </Box>

                  {loading ? (
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                      <CircularProgress />
                    </Box>
                  ) : filteredRentals.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                      <Typography variant="body1">No rental orders match the parameters.</Typography>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Window</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Deposit</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredRentals.map((row) => (
                            <TableRow key={row.id} hover sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                              <TableCell sx={{ fontWeight: 700 }}>{row.id}</TableCell>
                              <TableCell>{row.customerName}</TableCell>
                              <TableCell>{row.productName}</TableCell>
                              <TableCell>{row.rentalPeriod}</TableCell>
                              <TableCell align="right">{money.format(row.deposit)}</TableCell>
                              <TableCell>
                                <Chip
                                  label={row.status}
                                  size="small"
                                  color={
                                    row.status === 'Active' || row.status === 'Completed' ? 'success' :
                                    row.status === 'Confirmed' ? 'primary' :
                                    row.status === 'Cancelled' ? 'error' : 'warning'
                                  }
                                  sx={{ fontWeight: 700 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={0.5}>
                                  <IconButton size="small" onClick={() => handleOpenView(row)}><Eye size={14} /></IconButton>
                                  <IconButton size="small" onClick={() => handleOpenEdit(row)}><Edit2 size={14} /></IconButton>
                                  <IconButton size="small" color="primary" onClick={() => navigate(`/track/${row.id}`)}><Compass size={14} /></IconButton>
                                  {row.status === 'Active' && (
                                    <IconButton size="small" color="success" onClick={() => handleQuickReturn(row.id)}>
                                      <CheckCircle size={14} />
                                    </IconButton>
                                  )}
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

              {/* Animated Custom SVG Charts Row */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 3 }}>Monthly Revenue Trend (₹)</Typography>
                      {/* Custom SVG Bar Chart */}
                      <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', pt: 2, px: 1 }}>
                        {adminMockRevenueChart.map((data, index) => {
                          const barHeight = (data.revenue / 160000) * 150;
                          return (
                            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '14%' }}>
                              <Box sx={{
                                width: '100%',
                                height: barHeight,
                                background: 'linear-gradient(180deg, #4f46e5 0%, #818cf8 100%)',
                                borderRadius: '4px 4px 0 0',
                                transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                  background: 'linear-gradient(180deg, #3730a3 0%, #4f46e5 100%)'
                                }
                              }} />
                              <Typography variant="caption" sx={{ fontWeight: 700, mt: 1, color: 'text.secondary' }}>{data.label}</Typography>
                              <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 800, color: 'primary.main' }}>
                                {Math.round(data.revenue / 1000)}k
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 3 }}>Weekly Handoffs Activity</Typography>
                      {/* SVG Line Sparkline Chart */}
                      <Box sx={{ position: 'relative', height: 160 }}>
                        <svg viewBox="0 0 700 160" width="100%" height="100%" style={{ overflow: 'visible' }}>
                          <defs>
                            <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Grid Lines */}
                          <line x1="0" y1="40" x2="700" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="0" y1="80" x2="700" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="0" y1="120" x2="700" y2="120" stroke="#f1f5f9" strokeWidth="1" />

                          {/* Sparkline curve */}
                          <path
                            d="M 10,120 Q 110,80 210,100 T 410,40 T 610,10 Q 650,5 690,70"
                            fill="none"
                            stroke="#4f46e5"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            style={{ strokeDasharray: 1000, strokeDashoffset: 0 }}
                          />
                          {/* Gradient fill */}
                          <path
                            d="M 10,120 Q 110,80 210,100 T 410,40 T 610,10 Q 650,5 690,70 L 690,160 L 10,160 Z"
                            fill="url(#sparkline-grad)"
                          />
                          {/* Anchor Dots */}
                          <circle cx="210" cy="100" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="1.5" />
                          <circle cx="410" cy="40" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="1.5" />
                          <circle cx="610" cy="10" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="1.5" />
                        </svg>
                      </Box>
                      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5, px: 1 }}>
                        {adminMockWeeklyRentals.map(dayObj => (
                          <Typography key={dayObj.day} variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                            {dayObj.day}
                          </Typography>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

            </Grid>

            {/* Right Column: Schedule Handoffs, Timeline logs & Alerts */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={4}>
                
                {/* Alerts Panel */}
                <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShieldAlert size={18} color="#dc2626" />
                      Critical Operational Alerts
                    </Typography>
                    <Stack spacing={1.5}>
                      {alerts.map((al) => (
                        <Alert severity={al.type} key={al.id} sx={{ borderRadius: 2.5, '& .MuiAlert-message': { fontSize: '0.78rem', fontWeight: 600 } }}>
                          {al.message}
                        </Alert>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

                {/* Upcoming Pickups */}
                <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>Today's Pickups Schedule</Typography>
                    {pickups.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">All scheduled pickups dispatched.</Typography>
                    ) : (
                      <Stack spacing={2.5}>
                        {pickups.map((item) => (
                          <Box key={item.id}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.productName}</Typography>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>{item.time}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Client: {item.customerName} • Loc: {item.location}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">Staff: {item.assignedStaff}</Typography>
                              <Button size="small" variant="outlined" onClick={() => handleConfirmPickup(item.id)} sx={{ py: 0.25, fontSize: '0.7rem', borderRadius: 999 }}>
                                Confirm
                              </Button>
                            </Box>
                            <Divider sx={{ mt: 2 }} />
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>

                {/* Upcoming Returns */}
                <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>Today's Returns Schedule</Typography>
                    {returns.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">All scheduled returns processed.</Typography>
                    ) : (
                      <Stack spacing={2.5}>
                        {returns.map((item) => (
                          <Box key={item.id}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.productName}</Typography>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: 'warning.main' }}>{item.time}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Client: {item.customerName} • Escrow Deposit: {money.format(item.deposit)}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                              <Typography variant="caption" color="error.main" sx={{ fontWeight: 700 }}>
                                {item.lateFee > 0 ? `Late Fee: ${money.format(item.lateFee)}` : 'No penalties'}
                              </Typography>
                              <Button size="small" variant="contained" onClick={() => handleOpenInspection(item)} sx={{ py: 0.25, fontSize: '0.7rem', borderRadius: 999 }}>
                                Inspect
                              </Button>
                            </Box>
                            <Divider sx={{ mt: 2 }} />
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>

                {/* Overdue Rentals List */}
                <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: 'error.main' }}>Overdue Equipment List</Typography>
                    {overdues.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">No overdue items.</Typography>
                    ) : (
                      <Stack spacing={2.5}>
                        {overdues.map((item) => (
                          <Box key={item.id} sx={{ bgcolor: 'error.50', p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'error.100' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 800 }}>{item.productName}</Typography>
                              <Chip label={`${item.daysLate}d Late`} color="error" size="small" sx={{ fontWeight: 800, height: 20, fontSize: '0.65rem' }} />
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                              Client: {item.customerName} • Escrow: {money.format(item.deposit)}
                            </Typography>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Button size="small" variant="outlined" color="error" onClick={() => handleContactCustomer(item.email)} sx={{ py: 0.2, fontSize: '0.65rem', borderRadius: 999 }}>
                                Contact
                              </Button>
                              <Button size="small" variant="contained" color="error" onClick={() => handleOpenInspection(item)} sx={{ py: 0.2, fontSize: '0.65rem', borderRadius: 999 }}>
                                Process
                              </Button>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>

                {/* Operations Activity Logs Timeline */}
                <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 3 }}>Recent Operations Log</Typography>
                    <Stack spacing={2.5}>
                      {timeline.map((log, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mt: 0.75 }} />
                            {index < timeline.length - 1 && <Box sx={{ width: 1.5, bgcolor: 'divider', flexGrow: 1, my: 0.5 }} />}
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{log.title}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>{log.detail}</Typography>
                            <Typography variant="caption" color="grey.400" sx={{ display: 'block', mt: 0.5 }}>{log.time}</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

              </Stack>
            </Grid>

          </Grid>
        </Box>
      </Container>

      {/* Action Dialog: View Order Details */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Fulfillment Details</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">Rental Booking ID</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrder.id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Customer Profile</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrder.customerName} ({selectedOrder.email})</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Equipment Item</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrder.productName}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Rental Window</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrder.rentalPeriod}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Refundable Deposit</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(selectedOrder.deposit)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Handoff Status</Typography>
                  <Chip label={selectedOrder.status} size="small" color="primary" sx={{ fontWeight: 700 }} />
                </Box>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => setViewDialogOpen(false)} sx={{ borderRadius: 999, px: 3 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog: Edit Status */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Handoff Status</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Stack spacing={2.5}>
              <Typography variant="body2">Update booking state for <strong>{selectedOrder.id}</strong> ({selectedOrder.productName}):</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select value={editStatusValue} label="Status" onChange={(e) => setEditStatusValue(e.target.value)}>
                  <MenuItem value="Reserved">Reserved</MenuItem>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Ready for Pickup">Ready for Pickup</MenuItem>
                  <MenuItem value="Active">Active Rental</MenuItem>
                  <MenuItem value="Return Due">Return Due</MenuItem>
                  <MenuItem value="Returned">Returned</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setEditDialogOpen(false)} sx={{ borderRadius: 999 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveStatus} sx={{ borderRadius: 999 }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog: Create Rental */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Generate Manual Booking</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <TextField label="Customer Name" size="small" fullWidth value={createForm.customerName} onChange={(e) => setCreateForm(prev => ({ ...prev, customerName: e.target.value }))} />
            <TextField label="Equipment / Product" size="small" fullWidth value={createForm.productName} onChange={(e) => setCreateForm(prev => ({ ...prev, productName: e.target.value }))} />
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField label="Pickup Date" size="small" type="date" InputLabelProps={{ shrink: true }} fullWidth value={createForm.start} onChange={(e) => setCreateForm(prev => ({ ...prev, start: e.target.value }))} />
              </Grid>
              <Grid size={6}>
                <TextField label="Return Date" size="small" type="date" InputLabelProps={{ shrink: true }} fullWidth value={createForm.end} onChange={(e) => setCreateForm(prev => ({ ...prev, end: e.target.value }))} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField label="Deposit (₹)" size="small" type="number" fullWidth value={createForm.deposit} onChange={(e) => setCreateForm(prev => ({ ...prev, deposit: e.target.value }))} />
              </Grid>
              <Grid size={6}>
                <TextField label="Subtotal (₹)" size="small" type="number" fullWidth value={createForm.subtotal} onChange={(e) => setCreateForm(prev => ({ ...prev, subtotal: e.target.value }))} />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setCreateDialogOpen(false)} sx={{ borderRadius: 999 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateRental} sx={{ borderRadius: 999 }}>
            Create Rental
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog: Add Product */}
      <Dialog open={addProductDialogOpen} onClose={() => setAddProductDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Product to Catalog</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <TextField label="Product Name" size="small" fullWidth value={productForm.name} onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))} />
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select value={productForm.category} label="Category" onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Adventure">Adventure Gear</MenuItem>
                <MenuItem value="Fitness">Fitness & Sports</MenuItem>
                <MenuItem value="Appliances">Appliances</MenuItem>
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid size={4}>
                <TextField label="Stock Level" size="small" type="number" fullWidth value={productForm.stock} onChange={(e) => setProductForm(prev => ({ ...prev, stock: Number(e.target.value) }))} />
              </Grid>
              <Grid size={4}>
                <TextField label="Rate/Day (₹)" size="small" type="number" fullWidth value={productForm.rate} onChange={(e) => setProductForm(prev => ({ ...prev, rate: Number(e.target.value) }))} />
              </Grid>
              <Grid size={4}>
                <TextField label="Deposit (₹)" size="small" type="number" fullWidth value={productForm.deposit} onChange={(e) => setProductForm(prev => ({ ...prev, deposit: Number(e.target.value) }))} />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setAddProductDialogOpen(false)} sx={{ borderRadius: 999 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddProduct} sx={{ borderRadius: 999 }}>
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog: Equipment Inspection */}
      <Dialog open={inspectionDialogOpen} onClose={() => setInspectionDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Fulfillment Inspection Check</DialogTitle>
        <DialogContent dividers>
          {inspectionItem && (
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" color="text.secondary">Item to inspect</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{inspectionItem.productName} ({inspectionItem.id})</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Client Profile</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{inspectionItem.customerName}</Typography>
              </Box>
              <TextField
                label="Diagnostic Checklist Notes"
                multiline
                rows={3}
                fullWidth
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
              />
              <TextField
                label="Calculate Late Penalties (₹)"
                type="number"
                size="small"
                fullWidth
                value={inspectionLateFee}
                onChange={(e) => setInspectionLateFee(e.target.value)}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setInspectionDialogOpen(false)} sx={{ borderRadius: 999 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirmInspection} sx={{ borderRadius: 999 }}>
            Approve Handoff Return
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AdminDashboard;
