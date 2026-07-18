import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
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
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Receipt,
  Phone,
  Mail,
  QrCode,
  Compass,
  Printer,
  ShieldAlert,
  RefreshCw,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { keyframes } from '@mui/system';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { customerMockOrders } from '../../data/customerMocks';
import { products as localMockProducts } from '../../data/products';
import { getCart } from '../../api/cartApi';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const trackingSteps = [
  'Booking Confirmed',
  'Payment Successful',
  'Vendor Approved',
  'Preparing Item',
  'Ready for Pickup',
  'Picked Up',
  'Currently Renting',
  'Return Requested',
  'Return Approved',
  'Item Returned',
  'Refund Processed',
  'Completed'
];

const getActiveStep = (status) => {
  switch (status) {
    case 'Booking Confirmed': return 0;
    case 'Confirmed':
    case 'Payment Completed':
    case 'Payment Successful': return 1;
    case 'Vendor Approved': return 2;
    case 'Preparing Item': return 3;
    case 'Ready for Pickup': return 4;
    case 'Picked Up': return 5;
    case 'Currently Renting':
    case 'Active': return 6;
    case 'Return Requested': return 7;
    case 'Return Approved': return 8;
    case 'Item Returned': return 9;
    case 'Refund Processed': return 10;
    case 'Completed': return 11;
    default: return 1;
  }
};

const normalizeOrder = (o) => {
  const pickup = o.rentalStart ? new Date(o.rentalStart) : new Date();
  const retDate = o.rentalEnd ? new Date(o.rentalEnd) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const diffTime = Math.abs(retDate - pickup);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  // Deriving values
  const status = o.status || 'Confirmed';
  let statusKey = o.statusKey || 'upcoming';
  if (status === 'Active' || status === 'Currently Renting' || status === 'Picked Up') statusKey = 'active';
  else if (status === 'Completed') statusKey = 'completed';
  else if (status === 'Cancelled') statusKey = 'cancelled';
  else if (status === 'Upcoming' || status === 'Confirmed' || status === 'Vendor Approved') statusKey = 'upcoming';

  const total = o.totalAmount || o.total || 5400;
  const subtotal = o.subtotal || Math.round(total * 0.8);
  const deposit = o.securityDeposit || Math.round(total * 0.1);

  return {
    id: o.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    productId: o.productId || (o.id === 'ORD-1001' ? 'p4' : o.id === 'ORD-1002' ? 'p2' : o.id === 'ORD-1003' ? 'p3' : 'p5'),
    orderNumber: o.orderNumber || o.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    transactionId: o.transactionId || `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    productName: o.productName || o.itemName || 'Rental Item',
    productImage: o.productImage || o.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    category: o.category || 'General',
    vendorName: o.vendorName || 'RentX Partner Vendor',
    pickupDate: pickup.toLocaleDateString(),
    returnDate: retDate.toLocaleDateString(),
    rentalStart: o.rentalStart || pickup.toISOString().split('T')[0],
    rentalEnd: o.rentalEnd || retDate.toISOString().split('T')[0],
    rentalDurationDays: diffDays,
    rentalCharges: subtotal,
    securityDeposit: deposit,
    totalPaid: total,
    status: status,
    statusKey: statusKey,
    paymentStatus: o.paymentStatus || (status === 'Cancelled' ? 'Refunded' : 'Paid'),
    createdAt: o.createdAt || new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: o.items || []
  };
};

const TrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [extendOpen, setExtendOpen] = useState(false);
  const [extendDays, setExtendDays] = useState(1);

  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const loadData = () => {
    setLoading(true);
    const saved = JSON.parse(localStorage.getItem('rental_orders') || '[]');
    const allNormalized = [...saved, ...customerMockOrders].map(normalizeOrder);
    const matched = allNormalized.find((o) => String(o.id) === String(orderId));
    if (matched) {
      setOrder(matched);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [orderId]);

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

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error(err); } finally { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login', { replace: true }); }
  };

  // Helper: mutate order status in storage and state
  const mutateOrderStatus = (newStatus, newStatusKey) => {
    const saved = JSON.parse(localStorage.getItem('rental_orders') || '[]');
    let exists = false;
    const updatedSaved = saved.map((o) => {
      if (String(o.id) === String(order.id)) {
        exists = true;
        return { ...o, status: newStatus, statusKey: newStatusKey };
      }
      return o;
    });

    if (exists) {
      localStorage.setItem('rental_orders', JSON.stringify(updatedSaved));
    } else {
      const updatedMock = { ...order, status: newStatus, statusKey: newStatusKey };
      localStorage.setItem('rental_orders', JSON.stringify([updatedMock, ...saved]));
    }

    setOrder((prev) => ({ ...prev, status: newStatus, statusKey: newStatusKey }));
  };

  // Extension cost details
  const extensionPricePerDay = order ? Math.round(order.rentalCharges / order.rentalDurationDays) : 300;
  const extensionCost = extendDays * extensionPricePerDay;

  const handleConfirmExtension = () => {
    const currentEnd = new Date(order.rentalEnd);
    currentEnd.setDate(currentEnd.getDate() + Number(extendDays));
    const newEndStr = currentEnd.toISOString().split('T')[0];

    const saved = JSON.parse(localStorage.getItem('rental_orders') || '[]');
    let exists = false;

    const newTotal = order.totalPaid + extensionCost;
    const newCharges = order.rentalCharges + extensionCost;

    const updatedSaved = saved.map((o) => {
      if (String(o.id) === String(order.id)) {
        exists = true;
        return {
          ...o,
          rentalEnd: newEndStr,
          totalAmount: newTotal,
          total: newTotal,
          subtotal: newCharges
        };
      }
      return o;
    });

    if (exists) {
      localStorage.setItem('rental_orders', JSON.stringify(updatedSaved));
    } else {
      const updatedMock = {
        ...order,
        rentalEnd: newEndStr,
        totalAmount: newTotal,
        total: newTotal,
        subtotal: newCharges
      };
      localStorage.setItem('rental_orders', JSON.stringify([updatedMock, ...saved]));
    }

    setOrder((prev) => ({
      ...prev,
      rentalEnd: newEndStr,
      returnDate: currentEnd.toLocaleDateString(),
      rentalDurationDays: prev.rentalDurationDays + Number(extendDays),
      rentalCharges: newCharges,
      totalPaid: newTotal
    }));

    toast.success(`Rental extended successfully by ${extendDays} days!`);
    setExtendOpen(false);
  };

  const handleRequestReturn = () => {
    mutateOrderStatus('Return Requested', 'active');
    toast.success('Return request submitted. Vendor will approve inspection schedule.');
  };

  const handleSendContact = () => {
    if (!contactMessage.trim()) {
      toast.error('Please type a message before sending.');
      return;
    }
    toast.success('Message sent successfully! Vendor partner will reply within 24 hours.');
    setContactOpen(false);
  };

  const handleDownloadInvoice = (orderItem) => {
    window.open(`/invoice/${orderItem.id}`, '_blank');
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        <Navbar onSearchChange={() => {}} cartCount={cartCount} onLogout={handleLogout} />
        <Container maxWidth="lg" sx={{ pt: '120px', pb: 8, textAlign: 'center' }}>
          <Typography variant="body1">Loading tracking details...</Typography>
        </Container>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        <Navbar onSearchChange={() => {}} cartCount={cartCount} onLogout={handleLogout} />
        <Container maxWidth="md" sx={{ pt: '120px', pb: 8, textAlign: 'center' }}>
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: 'error.main' }}>Rental Tracking Unavailable</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                We could not find tracking details for the requested ID. Please try again or return to My Orders.
              </Typography>
              <Stack direction="row" spacing={1.5} justifyContent="center">
                <Button variant="outlined" startIcon={<RefreshCw size={16} />} onClick={loadData} sx={{ borderRadius: 999, px: 3, py: 1.1, textTransform: 'none', fontWeight: 700 }}>
                  Retry
                </Button>
                <Button variant="contained" onClick={() => navigate('/orders')} sx={{ borderRadius: 999, px: 3, py: 1.1, textTransform: 'none', fontWeight: 700 }}>
                  Back to Orders
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  const activeStep = getActiveStep(order.status);
  const remainingDays = Math.max(0, Math.ceil((new Date(order.rentalEnd) - new Date()) / (1000 * 60 * 60 * 24)));

  // Generate logs based on status
  const notificationLogs = [
    { title: 'Booking Confirmed', detail: 'RentX system accepted reservation and locked booking.', time: '4 days ago' },
    { title: 'Payment Successful', detail: 'Authorized transaction via payment partner.', time: '4 days ago' },
    { title: 'Vendor Approved', detail: 'Partner vendor verified stock availability.', time: '3 days ago' },
    { title: 'Preparing Item', detail: 'Completed diagnostic inspections and sanitization procedures.', time: '2 days ago' },
  ];

  if (activeStep >= 4) {
    notificationLogs.push({ title: 'Ready for Pickup', detail: 'Package placed inside RentX Hub locker box BKC-44.', time: '1 day ago' });
  }
  if (activeStep >= 5) {
    notificationLogs.push({ title: 'Picked Up', detail: 'Locker opened. Secure customer handoff completed.', time: '12 hours ago' });
  }
  if (activeStep >= 6) {
    notificationLogs.push({ title: 'Rental Started', detail: 'Rental cycle is officially active.', time: '12 hours ago' });
  }
  if (activeStep >= 7) {
    notificationLogs.push({ title: 'Return Requested', detail: 'Scheduled drop-off request received.', time: 'Just now' });
  }
  if (activeStep >= 11) {
    notificationLogs.push({ title: 'Completed', detail: 'Handoff back verified. Deposits refunded successfully.', time: 'Just now' });
  }

  // Next Action
  let nextAction = 'Wait for item preparation';
  if (activeStep < 4) nextAction = 'Proceed to hub once item is prepared';
  else if (activeStep === 4) nextAction = 'Pickup the package from Hub Locker BKC-44';
  else if (activeStep === 5 || activeStep === 6) nextAction = 'Return the equipment on or before deadline';
  else if (activeStep === 7) nextAction = 'Proceed to drop item back at counter';
  else if (activeStep >= 8) nextAction = 'Awaiting vendor quality validation checks';

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#f8fafc',
      '@media print': {
        bgcolor: '#fff',
        '.no-print': { display: 'none' },
        '.print-container': { mt: 0, p: 0, border: 'none', boxShadow: 'none' }
      }
    }}>
      <Box className="no-print">
        <Navbar onSearchChange={() => {}} cartCount={cartCount} onLogout={handleLogout} />
      </Box>

      <Container className="print-container" maxWidth="lg" sx={{ pt: '94px', pb: 8 }}>
        <Box sx={{ animation: `${fadeInUp} 0.6s ease-out` }}>
          
          <Button className="no-print" variant="outlined" startIcon={<ArrowLeft size={16} />} onClick={() => navigate('/orders')} sx={{ mb: 3, borderRadius: 999, px: 2.25, py: 0.9 }}>
            Back to Orders
          </Button>

          {/* Tracking Header */}
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 4 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, md: 7 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Track Rental Booking</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rental ID: <strong>{order.id}</strong> • Order Number: <strong>{order.orderNumber}</strong>
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Stack direction={{ xs: 'row', md: 'column' }} spacing={1} sx={{ alignItems: { xs: 'center', md: 'flex-end' }, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                    <Chip label={order.status} color="primary" sx={{ fontWeight: 700 }} />
                    <Typography variant="caption" color="text.secondary">
                      Est. Returns: {order.returnDate}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Stepper tracking timeline */}
              <Box sx={{ py: 2 }}>
                <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'} alternativeLabel={!isMobile}>
                  {trackingSteps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </Box>
            </CardContent>
          </Card>

          <Grid container spacing={4}>
            
            {/* Left Column: Live status cards & Notification updates */}
            <Grid size={{ xs: 12, md: 8 }}>
              
              {/* Live Status Card */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 4, bgcolor: '#eef2ff' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5, color: '#3730a3' }}>
                    <Compass size={22} />
                    Live Activity Status
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography variant="caption" color="text.secondary">Current status</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.status}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography variant="caption" color="text.secondary">Last update</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>15 mins ago</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary">Next Action</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{nextAction}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Notifications Activity History Feed */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 4 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Tracking Log Updates</Typography>
                  <Stack spacing={3}>
                    {notificationLogs.slice().reverse().map((log, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 2.5 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box sx={{ p: 0.5, borderRadius: '50%', bgcolor: 'success.50', color: 'success.main', display: 'flex' }}>
                            <CheckCircle2 size={18} />
                          </Box>
                          {index < notificationLogs.length - 1 && (
                            <Box sx={{ width: 2, bgcolor: 'success.100', flexGrow: 1, my: 0.5 }} />
                          )}
                        </Box>
                        <Box sx={{ pb: index < notificationLogs.length - 1 ? 2 : 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{log.title}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>{log.detail}</Typography>
                          <Typography variant="caption" color="grey.400" sx={{ display: 'block', mt: 0.5 }}>{log.time}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Tracking Product Details Card */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Rental Summary details</Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box
                        component="img"
                        src={order.productImage}
                        alt={order.productName}
                        sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>{order.productName}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Vendor: {order.vendorName}</Typography>
                      
                      <Grid container spacing={2}>
                        <Grid size={6}>
                          <Typography variant="caption" color="text.secondary">Start Handoff Date</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.pickupDate}</Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="caption" color="text.secondary">End Return Date</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.returnDate}</Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="caption" color="text.secondary">Remaining Days</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{remainingDays} day(s)</Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="caption" color="text.secondary">Pickup Locker Location</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>BKC Central Hub, Locker BKC-44</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

            </Grid>

            {/* Right Column: Action triggers */}
            <Grid size={{ xs: 12, md: 4 }} className="no-print">
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', position: 'sticky', top: '94px' }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2.5 }}>Tracking Actions</Typography>
                  <Stack spacing={1.5}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/orders/${order.id}`)}
                      sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                    >
                      View Order Details
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Mail size={18} />}
                      onClick={() => {
                        setContactSubject(`Inquiry regarding active tracking ${order.id}`);
                        setContactMessage('');
                        setContactOpen(true);
                      }}
                      sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                    >
                      Contact Vendor
                    </Button>
                    {order.statusKey === 'active' && (
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Calendar size={18} />}
                        onClick={() => {
                          setExtendDays(1);
                          setExtendOpen(true);
                        }}
                        sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                      >
                        Extend Rental
                      </Button>
                    )}
                    {order.statusKey === 'active' && order.status !== 'Return Requested' && (
                      <Button
                        variant="outlined"
                        fullWidth
                        color="success"
                        startIcon={<RefreshCw size={18} />}
                        onClick={handleRequestReturn}
                        sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                      >
                        Request Return
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Printer size={18} />}
                      onClick={() => handleDownloadInvoice(order)}
                      sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                    >
                      Download Invoice
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate('/orders')}
                      sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                    >
                      Back to My Orders
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Box>
      </Container>

      {/* Extension Dialog */}
      <Dialog open={extendOpen} onClose={() => setExtendOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Extend Rental Duration</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="body2" color="text.secondary">Product daily rate: {money.format(extensionPricePerDay)}</Typography>
              <Typography variant="body2" color="text.secondary">Current scheduled end date: {order.returnDate}</Typography>
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel>Extension Duration</InputLabel>
              <Select value={extendDays} label="Extension Duration" onChange={(e) => setExtendDays(e.target.value)}>
                <MenuItem value={1}>Extend by 1 Day</MenuItem>
                <MenuItem value={3}>Extend by 3 Days</MenuItem>
                <MenuItem value={5}>Extend by 5 Days</MenuItem>
                <MenuItem value={7}>Extend by 1 Week (7 Days)</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ border: '1px solid', borderColor: 'divider', p: 1.5, borderRadius: 3, bgcolor: 'grey.50' }}>
              <Typography variant="caption" color="text.secondary">Extension charges breakdown</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Extension Subtotal ({extendDays} days)</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{money.format(extensionCost)}</Typography>
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setExtendOpen(false)} sx={{ borderRadius: 999, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirmExtension} sx={{ borderRadius: 999, textTransform: 'none' }}>
            Pay & Extend
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contact Vendor Dialog */}
      <Dialog open={contactOpen} onClose={() => setContactOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Send Message to Vendor</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">To Vendor</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.vendorName}</Typography>
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
              placeholder="Write message details..."
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setContactOpen(false)} sx={{ borderRadius: 999, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSendContact} sx={{ borderRadius: 999, textTransform: 'none' }}>
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default TrackingPage;
