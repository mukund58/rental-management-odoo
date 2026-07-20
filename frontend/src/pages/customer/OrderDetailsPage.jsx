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
} from 'lucide-react';
import toast from 'react-hot-toast';
import { keyframes } from '@mui/system';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { getCart } from '../../api/cartApi';
import { getOrder, cancelOrder } from '../../api/checkoutApi';
import { API_URL } from '../../constants/env';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const getImageUrl = (src) => {
  if (!src) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80';
  if (src.startsWith('http')) return src;
  return `${API_URL.replace('/api', '')}${src}`;
};

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const steps = [
  'Booking Created',
  'Payment Completed',
  'Vendor Approved',
  'Ready for Pickup',
  'Picked Up',
  'Currently Renting',
  'Return Requested',
  'Returned',
  'Completed'
];

const getActiveStep = (status) => {
  switch (status) {
    case 'Booking Created': return 0;
    case 'Confirmed':
    case 'Payment Completed': return 1;
    case 'Vendor Approved': return 2;
    case 'Ready for Pickup': return 3;
    case 'Picked Up': return 4;
    case 'Currently Renting':
    case 'Active': return 5;
    case 'Return Requested': return 6;
    case 'Returned': return 7;
    case 'Completed': return 8;
    default: return 1; // Default to Confirmed/Payment Completed if confirmed
  }
};


const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gallery Active Image
  const [activeImage, setActiveImage] = useState('');

  // Dialog States
  const [extendOpen, setExtendOpen] = useState(false);
  const [extendDays, setExtendDays] = useState(1);

  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const [issueOpen, setIssueOpen] = useState(false);
  const [issueCategory, setIssueCategory] = useState('Damaged Item');
  const [issueMessage, setIssueMessage] = useState('');

  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const backendOrder = await getOrder(orderId);
        if (isMounted && backendOrder) {
          const pickup = backendOrder.pickupDate ? new Date(backendOrder.pickupDate) : new Date();
          const retDate = backendOrder.returnDate ? new Date(backendOrder.returnDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          const diffTime = Math.abs(retDate - pickup);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

          let statusString = backendOrder.status;
          if (typeof backendOrder.status === 'number') {
            const statuses = ['', 'Reserved', 'Picked Up', 'Returned', 'Cancelled', 'Late'];
            statusString = statuses[backendOrder.status] || 'Unknown';
          }
          const statusKey = String(statusString).toLowerCase();

          const total = backendOrder.totalAmount || 0;

          const formatted = {
            id: backendOrder.id,
            orderNumber: backendOrder.orderNumber || backendOrder.id,
            status: statusString,
            statusKey: statusKey,
            paymentStatus: backendOrder.paymentStatus || (statusKey === 'cancelled' ? 'Refunded' : 'Paid'),
            totalAmount: total,
            totalPaid: total,
            subtotal: total * 0.8,
            securityDeposit: total * 0.1,
            rentalCharges: total * 0.8,
            rentalStart: backendOrder.pickupDate || pickup.toISOString().split('T')[0],
            rentalEnd: backendOrder.returnDate || retDate.toISOString().split('T')[0],
            pickupDate: pickup.toLocaleDateString(),
            returnDate: retDate.toLocaleDateString(),
            rentalDurationDays: diffDays,
            createdAt: backendOrder.createdAt || new Date().toISOString(),
            items: backendOrder.items || [],
            productName: backendOrder.items?.map(i => i.name).join(', ') || 'Rental Item',
            productImage: backendOrder.items?.[0]?.imageUrl || '',
            category: backendOrder.items?.[0]?.category || 'General',
            vendorName: 'RentX Partner Vendor',
            transactionId: backendOrder.paymentId || `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`
          };
          setOrder(formatted);
          setActiveImage(getImageUrl(formatted.productImage));
        }
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOrder();
    return () => { isMounted = false; };
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

  const handleConfirmCancel = async () => {
    try {
      await cancelOrder(order.id);
      setOrder(prev => ({ ...prev, status: 'Cancelled', statusKey: 'cancelled' }));
      toast.success('Booking cancelled successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Could not cancel order.');
    } finally {
      setCancelConfirmOpen(false);
    }
  };

  const handleSendContact = () => {
    if (!contactMessage.trim()) {
      toast.error('Please type a message before sending.');
      return;
    }
    toast.success('Message sent successfully! Vendor partner will reply within 24 hours.');
    setContactOpen(false);
  };

  const handleSendIssue = () => {
    if (!issueMessage.trim()) {
      toast.error('Please write details about the issue.');
      return;
    }
    toast.success('Support ticket created. Support team will review the issue shortly.');
    setIssueOpen(false);
  };

  const handleTrackRental = (id) => {
    navigate(`/track/${id}`);
  };

  const handleDownloadInvoice = (orderItem) => {
    window.open(`/invoice/${orderItem.id}`, '_blank');
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar onSearchChange={() => { }} cartCount={cartCount} onLogout={handleLogout} />
        <Container maxWidth="lg" sx={{ pt: '120px', pb: 8, textAlign: 'center' }}>
          <Typography variant="body1">Loading booking details...</Typography>
        </Container>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar onSearchChange={() => { }} cartCount={cartCount} onLogout={handleLogout} />
        <Container maxWidth="md" sx={{ pt: '120px', pb: 8, textAlign: 'center' }}>
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: 'error.main' }}>Rental Booking Not Found</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                The requested order ID does not exist in your account. If you just placed an order, please wait a moment or go back to browsing.
              </Typography>
              <Stack direction="row" spacing={1.5} justifyContent="center">
                <Button variant="outlined" startIcon={<ArrowLeft size={16} />} onClick={() => navigate('/orders')} sx={{ borderRadius: 999, px: 3, py: 1.1, textTransform: 'none', fontWeight: 700 }}>
                  Go Back
                </Button>
                <Button variant="contained" onClick={() => navigate(PATHS.ROOT)} sx={{ borderRadius: 999, px: 3, py: 1.1, textTransform: 'none', fontWeight: 700 }}>
                  Browse Products
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  const brand = 'RentX Verified';
  const description = 'Premium quality rental equipment thoroughly inspected and sanitized before every dispatch. Comes with all standard accessories and protective casing.';
  const specs = [
    { label: 'Condition', value: 'Excellent - Like New' },
    { label: 'Quality Check', value: 'Passed 15-point inspection' },
    { label: 'Accessories', value: 'Standard kit included' },
    { label: 'Insurance', value: 'Basic damage protection' },
  ];

  const galleryImages = [
    activeImage,
    'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=60',
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      '@media print': {
        bgcolor: '#fff',
        '.no-print': { display: 'none' },
        '.print-container': { mt: 0, p: 0, border: 'none', boxShadow: 'none' }
      }
    }}>
      <Box className="no-print">
        <Navbar onSearchChange={() => { }} cartCount={cartCount} onLogout={handleLogout} />
      </Box>

      <Container className="print-container" maxWidth="lg" sx={{ pt: '94px', pb: 8 }}>
        <Box sx={{ animation: `${fadeInUp} 0.6s ease-out` }}>

          <Button className="no-print" variant="outlined" startIcon={<ArrowLeft size={16} />} onClick={() => navigate('/orders')} sx={{ mb: 3, borderRadius: 999, px: 2.25, py: 0.9 }}>
            Back to Orders
          </Button>

          {/* Stepper Card */}
          {order.status !== 'Cancelled' && (
            <Card className="no-print" sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 3 }}>Rental Lifecycle Status</Typography>
                <Stepper activeStep={getActiveStep(order.status)} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          )}

          {order.status === 'Cancelled' && (
            <Card className="no-print" sx={{ borderRadius: 4, border: '1px solid', borderColor: 'error.main', bgcolor: 'rgba(239, 68, 68, 0.1)', mb: 4 }}>
              <CardContent sx={{ display: 'flex', alignitems: 'center', gap: 2, p: 3 }}>
                <ShieldAlert color="#ef4444" size={28} />
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#ef4444', fontWeight: 800 }}>Booking Cancelled</Typography>
                  <Typography variant="body2" sx={{ color: '#ef4444' }}>This reservation was cancelled. Security deposits have been refunded to the payment method.</Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          <Grid container spacing={4}>

            {/* Left Column */}
            <Grid size={{ xs: 12, md: 8 }}>

              {/* Product Card */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 4 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Product Details</Typography>

                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <Box
                        component="img"
                        src={activeImage}
                        alt={order.productName}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          transition: 'transform 0.3s',
                          '&:hover': { transform: 'scale(1.02)' }
                        }}
                      />
                      <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: 'center' }}>
                        {galleryImages.map((img, idx) => (
                          <Box
                            key={idx}
                            component="img"
                            src={img}
                            onClick={() => setActiveImage(img)}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                              borderRadius: 2,
                              border: activeImage === img ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                              cursor: 'pointer',
                            }}
                          />
                        ))}
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 7 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>{order.productName}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Brand: {brand} • Category: {order.category}</Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 3 }}>{description}</Typography>

                      <Stack spacing={1} sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Specifications</Typography>
                        <Grid container spacing={1}>
                          {specs.map((spec, i) => (
                            <React.Fragment key={i}>
                              <Grid size={5}><Typography variant="body2" color="text.secondary">{spec.label}</Typography></Grid>
                              <Grid size={7}><Typography variant="body2" sx={{ fontWeight: 700 }}>{spec.value}</Typography></Grid>
                            </React.Fragment>
                          ))}
                        </Grid>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Booking Details */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 4 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignitems: 'center', gap: 1.5 }}>
                    <Receipt size={22} color="#4f46e5" />
                    Booking Details
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary">Rental ID</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.id}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary">Order Number</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.orderNumber}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary">Rental Window</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.pickupDate} to {order.returnDate}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary">Duration</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.rentalDurationDays} day(s)</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary">Pickup Method</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Self Pickup / Lockbox</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary">Handoff Address</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>RentX BKC Central Hub, Mumbai</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Pickup & Return Details */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Pickup & Return Schedules</Typography>
                  <Grid container spacing={4}>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>Pickup Information</Typography>
                      <Stack spacing={1.5}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Pickup Window</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.pickupDate} (10:00 AM - 06:00 PM)</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Pickup Instructions</Typography>
                          <Typography variant="body2" color="text.secondary">Please present the handoff QR Code scanner at the counter to verify identity.</Typography>
                        </Box>
                        <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 3, p: 2, display: 'flex', alignitems: 'center', gap: 2, bgcolor: 'action.hover' }}>
                          <QrCode size={40} />
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Handoff QR Code</Typography>
                            <Typography variant="caption" color="text.secondary">Scan at BKC counter</Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>Return Information</Typography>
                      <Stack spacing={1.5}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Return Date</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.returnDate} (before 07:00 PM)</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Late Return Fee</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>₹500 / day (if delay exceeds 2 hours)</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Expected Refund Amount</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>{money.format(order.securityDeposit)} (after quality checks)</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Return Status</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {order.statusKey === 'completed' ? 'Returned & Completed' : 'Pending Handoff'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                  </Grid>
                </CardContent>
              </Card>

            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, md: 4 }}>

              {/* Vendor Info */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 4 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>Vendor Partner</Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Store Partner</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.vendorName}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Contact Hotline</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignitems: 'center', gap: 1 }}>
                        <Phone size={15} />
                        +91 91234 56789
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Support Email</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignitems: 'center', gap: 1 }}>
                        <Mail size={15} />
                        vendor.support@rentx.com
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Store Address</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignitems: 'center', gap: 1 }}>
                        <MapPin size={15} />
                        BKC Business Hub, Mumbai, IN
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 4 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5, display: 'flex', alignitems: 'center', gap: 1 }}>
                    <Receipt size={20} color="#4f46e5" />
                    Invoice Summary
                  </Typography>

                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Rental Charges</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(order.rentalCharges)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Refundable Deposit</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(order.securityDeposit)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Taxes & Fees</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(order.taxes || Math.round(order.rentalCharges * 0.1))}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>Grand Total Paid</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>{money.format(order.totalPaid)}</Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={1.5}>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary">Payment Status</Typography>
                      <Chip label={order.paymentStatus} variant="outlined" size="small" sx={{ fontWeight: 700 }} />
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary">Method</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.paymentMethod || 'Credit Card'}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Action Buttons card */}
              <Card className="no-print" sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', position: 'sticky', top: '94px' }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2.5 }}>Next Actions</Typography>
                  <Stack spacing={1.5}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Compass size={18} />}
                      onClick={() => handleTrackRental(order.id)}
                      sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                    >
                      Track Rental
                    </Button>
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
                      startIcon={<Mail size={18} />}
                      onClick={() => {
                        setSelectedOrder && setContactSubject(`Inquiry regarding Booking ${order.id}`);
                        setContactMessage('');
                        setContactOpen(true);
                      }}
                      sx={{ display: 'none', borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                    >
                      Contact Vendor
                    </Button>
                    {order.statusKey === 'active' && order.status !== 'Return Requested' && (
                      <Button
                        variant="outlined"
                        fullWidth
                        color="success"
                        startIcon={<RefreshCw size={18} />}
                        onClick={handleRequestReturn}
                        sx={{ display: 'none', borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                      >
                        Request Return
                      </Button>
                    )}
                    {order.statusKey === 'active' && (
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Calendar size={18} />}
                        onClick={() => {
                          setExtendDays(1);
                          setExtendOpen(true);
                        }}
                        sx={{ display: 'none', borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                      >
                        Extend Rental
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      fullWidth
                      color="warning"
                      startIcon={<ShieldAlert size={18} />}
                      onClick={() => {
                        setIssueMessage('');
                        setIssueOpen(true);
                      }}
                      sx={{ display: 'none', borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                    >
                      Report Issue
                    </Button>
                    {order.statusKey === 'upcoming' && (
                      <Button
                        variant="outlined"
                        fullWidth
                        color="error"
                        onClick={() => setCancelConfirmOpen(true)}
                        sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                      >
                        Cancel Booking
                      </Button>
                    )}
                    {/* <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate(`/product/${order.productId}`)}
                      sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                    >
                      Rebook Product
                    </Button> */}
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
            <Box sx={{ border: '1px solid', borderColor: 'divider', p: 1.5, borderRadius: 3, bgcolor: 'action.hover' }}>
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

      {/* Report Issue Dialog */}
      <Dialog open={issueOpen} onClose={() => setIssueOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Report Booking Issue</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <Typography variant="body2" color="text.secondary">We are sorry to hear you're experiencing issues. Let us know and we'll resolve it.</Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Issue Category</InputLabel>
              <Select value={issueCategory} label="Issue Category" onChange={(e) => setIssueCategory(e.target.value)}>
                <MenuItem value="Damaged Item">Damaged Item received</MenuItem>
                <MenuItem value="Delay">Pickup/Delivery Delay</MenuItem>
                <MenuItem value="Missing Accessory">Missing accessories</MenuItem>
                <MenuItem value="Technical Issue">Technical / operational issues</MenuItem>
                <MenuItem value="Other">Other Issues</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Provide detailed description"
              multiline
              rows={4}
              fullWidth
              placeholder="Write what went wrong..."
              value={issueMessage}
              onChange={(e) => setIssueMessage(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setIssueOpen(false)} sx={{ borderRadius: 999, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button variant="contained" color="warning" onClick={handleSendIssue} sx={{ borderRadius: 999, textTransform: 'none' }}>
            Submit Issue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelConfirmOpen} onClose={() => setCancelConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to cancel booking {order.id}?
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

export default OrderDetailsPage;
