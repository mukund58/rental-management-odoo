import React, { useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Container, Divider, Grid, Stack, TextField, Typography, Radio, FormControlLabel, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { customerMockPaymentMethods, customerMockCoupons } from '../../data/customerMocks';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const PaymentPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error(err); } finally { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login', { replace: true }); }
  };

  const subtotal = 12999;
  const taxes = subtotal * 0.08;
  const baseTotal = subtotal + taxes;
  const grandTotal = useMemo(() => Math.max(0, baseTotal - discount), [baseTotal, discount]);

  const applyCoupon = () => {
    const coupon = customerMockCoupons.find((item) => item.code.toLowerCase() === couponCode.trim().toLowerCase());
    if (!coupon) {
      setErrorMsg('Coupon code not found.');
      setDiscount(0);
      return;
    }
    setErrorMsg('');
    setDiscount(typeof coupon.discount === 'number' && coupon.discount < 1 ? Math.round(baseTotal * coupon.discount) : coupon.discount);
  };

  const handlePay = () => {
    navigate('/order-success');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Navbar onSearchChange={() => {}} cartCount={2} onLogout={handleLogout} />
      <Container maxWidth="xl" sx={{ pt: '94px', pb: 8 }}>
        <Button variant="outlined" startIcon={<ArrowLeft size={16} />} onClick={() => navigate(PATHS.CHECKOUT)} sx={{ mb: 3, borderRadius: 999, px: 2.25, py: 0.9 }}>
          Back to checkout
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Payment</Typography>

        {errorMsg && <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>{errorMsg}</Alert>}

        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 3 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Payment Method</Typography>
                <Stack spacing={1.5}>
                  {customerMockPaymentMethods.map((method) => (
                    <Box key={method.id} sx={{ border: '1px solid', borderColor: selectedMethod === method.id ? 'primary.main' : 'divider', borderRadius: 3, p: 2.25, bgcolor: selectedMethod === method.id ? 'primary.50' : 'background.paper' }}>
                      <FormControlLabel
                        value={method.id}
                        control={<Radio checked={selectedMethod === method.id} onChange={() => setSelectedMethod(method.id)} />}
                        label={<Typography sx={{ fontWeight: 700 }}>{method.label}</Typography>}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>{method.description}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Coupon / Offers</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField label="Coupon code" fullWidth size="small" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                  <Button variant="outlined" onClick={applyCoupon} sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}>Apply</Button>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
                  {customerMockCoupons.map((coupon) => <Chip key={coupon.code} label={coupon.code} onClick={() => setCouponCode(coupon.code)} variant="outlined" />)}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', position: 'sticky', top: '94px' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Order Summary</Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Subtotal</Typography><Typography sx={{ fontWeight: 700 }}>{money.format(subtotal)}</Typography></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Taxes</Typography><Typography sx={{ fontWeight: 700 }}>{money.format(taxes)}</Typography></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Discount</Typography><Typography sx={{ fontWeight: 700 }}>{money.format(discount)}</Typography></Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography sx={{ fontWeight: 800 }}>Grand total</Typography><Typography sx={{ fontWeight: 800 }}>{money.format(grandTotal)}</Typography></Box>
                </Stack>
                <Button variant="contained" fullWidth sx={{ mt: 3, borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }} onClick={handlePay}>Pay now</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PaymentPage;
