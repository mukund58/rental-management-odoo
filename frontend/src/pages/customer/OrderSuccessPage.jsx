import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ShoppingBag, MapPin, Calendar, Clock, CreditCard, Receipt, Share2, Printer, Compass } from 'lucide-react';
import toast from 'react-hot-toast';
import { keyframes } from '@mui/system';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { getCart } from '../../api/cartApi';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const scaleUp = keyframes`
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const drawCheck = keyframes`
  0% { stroke-dashoffset: 48; }
  100% { stroke-dashoffset: 0; }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const passedOrder = location.state?.order;
  const [order, setOrder] = useState(passedOrder || null);

  useEffect(() => {
    if (!passedOrder) {
      const saved = JSON.parse(localStorage.getItem('rental_orders') || '[]');
      if (saved.length > 0) {
        setOrder(saved[0]);
      }
    }
  }, [passedOrder]);

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

  const handleShareBooking = () => {
    if (!order) return;
    const shareText = `Booking Confirmation!\nRental ID: ${order.id}\nOrder Number: ${order.orderNumber}\nRental: ${order.itemName}\nPickup Date: ${new Date(order.rentalStart).toLocaleDateString()}\nReturn Date: ${new Date(order.rentalEnd).toLocaleDateString()}\nGrand Total: ${money.format(order.totalAmount)}`;
    navigator.clipboard.writeText(shareText);
    toast.success('Booking details copied to clipboard!');
  };

  const handleTrackRental = () => {
    navigate(`/track/${order.id}`);
  };

  const handleDownloadInvoice = () => {
    window.open(`/invoice/${order.id}`, '_blank');
  };

  if (!order) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        <Navbar onSearchChange={() => {}} cartCount={cartCount} onLogout={handleLogout} />
        <Container maxWidth="md" sx={{ pt: '120px', pb: 8, textAlign: 'center' }}>
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>No active booking details found</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                If you have recently placed an order, please check the My Orders section, or return to the products catalog page.
              </Typography>
              <Button variant="contained" onClick={() => navigate(PATHS.ROOT)} sx={{ borderRadius: 999, px: 3, py: 1.1, textTransform: 'none', fontWeight: 700 }}>
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // Fallbacks for missing values
  const rentalId = order.id;
  const orderNo = order.orderNumber || order.id;
  const transactionId = order.transactionId || 'TXN-OFFLINE99';
  const paymentMethod = order.paymentMethod || 'Credit Card';
  const rentalDuration = order.rentalDuration || '7 day(s)';
  const pickupDate = order.rentalStart ? new Date(order.rentalStart).toLocaleDateString() : 'N/A';
  const returnDate = order.rentalEnd ? new Date(order.rentalEnd).toLocaleDateString() : 'N/A';
  const pickupLocation = 'RentX Central Hub, Mumbai';
  const bookingTime = order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString();

  // If order items don't exist (legacy), build one
  const orderItems = order.items || [
    {
      id: 'legacy-1',
      name: order.itemName || 'Rental Item',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      pricePerUnit: order.totalAmount ? Math.round(order.totalAmount * 0.8) : 5400,
      quantity: 1,
      rentalDurationDays: 7,
      rentalStart: pickupDate,
      rentalEnd: returnDate,
      deposit: order.securityDeposit || Math.round((order.totalAmount || 5400) * 0.1),
      rentalCharges: order.subtotal || Math.round((order.totalAmount || 5400) * 0.8),
      category: 'General',
    }
  ];

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
          
          {/* Header Card */}
          <Card sx={{
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
            mb: 4,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: { xs: 4, md: 5 }
          }}>
            <Box sx={{
              animation: `${scaleUp} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 90,
              height: 90,
              borderRadius: '50%',
              bgcolor: 'success.50',
              color: 'success.main',
              mb: 3
            }}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" style={{
                  strokeDasharray: 48,
                  strokeDashoffset: 48,
                  animation: `${drawCheck} 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.2s forwards`
                }} />
              </svg>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em' }}>
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
              Thank you for renting with RentX! Your booking is confirmed. Your rental items are reserved and will be ready for pickup.
            </Typography>

            <Stack direction="row" spacing={1.5} className="no-print" sx={{ flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
              <Button variant="contained" onClick={() => navigate(PATHS.ROOT)} sx={{ borderRadius: 999, px: 3, py: 1, textTransform: 'none', fontWeight: 700 }}>
                Continue Shopping
              </Button>
              <Button variant="outlined" onClick={() => navigate('/orders')} sx={{ borderRadius: 999, px: 3, py: 1, textTransform: 'none', fontWeight: 700 }}>
                View My Orders
              </Button>
            </Stack>
          </Card>

          <Grid container spacing={4}>
            
            {/* Left Column: Transaction Details & Booking Summary */}
            <Grid size={{ xs: 12, md: 8 }}>
              
              {/* Transaction Details */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 4 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Receipt size={22} color="#4f46e5" />
                    Transaction Details
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Rental ID</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{rentalId}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Order Number</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{orderNo}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Transaction ID</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{transactionId}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Payment Method</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CreditCard size={16} />
                            {paymentMethod}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Rental Duration</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Clock size={16} />
                            {rentalDuration}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Rental Window</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Calendar size={16} />
                            {pickupDate} to {returnDate}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Pickup Location</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MapPin size={16} />
                            {pickupLocation}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Booking Timestamp</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{bookingTime}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Booking Summary */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ShoppingBag size={22} color="#4f46e5" />
                    Booking Summary
                  </Typography>

                  <Stack spacing={3}>
                    {orderItems.map((item, idx) => (
                      <Box key={idx}>
                        {idx > 0 && <Divider sx={{ mb: 3 }} />}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5 }}>
                          <Box
                            component="img"
                            src={item.imageUrl}
                            alt={item.name}
                            sx={{ width: { xs: '100%', sm: 110 }, height: 90, objectFit: 'cover', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{item.name}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>Category: {item.category}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Rental Window: {item.rentalStart} to {item.rentalEnd} ({item.rentalDurationDays} days)</Typography>

                            <Grid container spacing={2} sx={{ mt: 1.5 }}>
                              <Grid size={{ xs: 6, sm: 3 }}>
                                <Typography variant="caption" color="text.secondary">Quantity</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.quantity}</Typography>
                              </Grid>
                              <Grid size={{ xs: 6, sm: 3 }}>
                                <Typography variant="caption" color="text.secondary">Daily Rate</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(item.pricePerUnit)}</Typography>
                              </Grid>
                              <Grid size={{ xs: 6, sm: 3 }}>
                                <Typography variant="caption" color="text.secondary">Deposit</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(item.deposit)}</Typography>
                              </Grid>
                              <Grid size={{ xs: 6, sm: 3 }}>
                                <Typography variant="caption" color="text.secondary">Charges</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(item.rentalCharges)}</Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column: Pricing & Quick Actions */}
            <Grid size={{ xs: 12, md: 4 }}>
              
              {/* Payment Summary */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 4 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>Payment Summary</Typography>
                  <Stack spacing={1.75}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Total Rental Charges</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{money.format(order.subtotal || order.totalAmount * 0.8)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Refundable Deposit</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{money.format(order.securityDeposit || order.totalAmount * 0.1)}</Typography>
                    </Box>
                    {order.platformFee > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Platform Fee</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{money.format(order.platformFee)}</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Taxes & Fees</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{money.format(order.taxes || order.totalAmount * 0.08)}</Typography>
                    </Box>
                    <Divider sx={{ my: 0.5 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 800 }}>Grand Total Paid</Typography>
                      <Typography sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.1rem' }}>{money.format(order.totalAmount)}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="no-print" sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', position: 'sticky', top: '94px' }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>Next Actions</Typography>
                  <Stack spacing={1.5}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Compass size={18} />}
                      onClick={handleTrackRental}
                      sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                    >
                      Track Rental
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Printer size={18} />}
                      onClick={handleDownloadInvoice}
                      sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                    >
                      Download Invoice
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Share2 size={18} />}
                      onClick={handleShareBooking}
                      sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                    >
                      Share Booking
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default OrderSuccessPage;
