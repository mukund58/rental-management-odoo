import React, { useMemo, useState, useEffect } from 'react';
import { Alert, Box, Button, Card, CardContent, Container, Divider, Grid, Stack, TextField, Typography, Radio, FormControlLabel, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { getCart } from '../../api/cartApi';
import Loader from '../../components/ui/Loader';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [deliveryAddress, setDeliveryAddress] = useState({ fullName: '', phone: '', addressLine1: '', city: '', state: '', postalCode: '', country: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCart = async () => {
      try {
        const cartItems = await getCart();
        if (isMounted) {
          if (cartItems && cartItems.length > 0) {
            setItems(cartItems);
          } else {
            setItems([]);
          }
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        if (isMounted) {
          setItems([]);
          setErrorMsg('Failed to fetch cart. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchCart();
    return () => { isMounted = false; };
  }, []);

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error(err); } finally { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login', { replace: true }); }
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);
  }, [items]);

  const taxes = subtotal * 0.08;
  const grandTotal = subtotal + taxes;

  const handleContinueToPayment = () => {
    if (!deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.addressLine1 || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.postalCode) {
      setErrorMsg('Please fill all required delivery address fields.');
      return;
    }
    if (items.length === 0) {
      setErrorMsg('Your cart is empty. Please add items to proceed.');
      return;
    }
    navigate(PATHS.PAYMENT, {
      state: {
        deliveryAddress,
        items,
        subtotal,
        taxes,
        grandTotal
      }
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Navbar onSearchChange={() => {}} cartCount={items.length} onLogout={handleLogout} />
      <Container maxWidth="xl" sx={{ pt: '94px', pb: 8 }}>
        <Button variant="outlined" startIcon={<ArrowLeft size={16} />} onClick={() => navigate(PATHS.CART)} sx={{ mb: 3, borderRadius: 999, px: 2.25, py: 0.9 }}>
          Back to cart
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Checkout</Typography>

        {errorMsg && <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>{errorMsg}</Alert>}

        {loading ? (
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', p: 4 }}>
            <Loader message="Loading checkout details..." />
          </Card>
        ) : (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 3 }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Delivery Address</Typography>
                  <Box sx={{ mt: 2.5, p: 2.25, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                    <Stack spacing={1.5}>
                      <TextField label="Full name" fullWidth size="small" value={deliveryAddress.fullName} onChange={(e) => setDeliveryAddress((current) => ({ ...current, fullName: e.target.value }))} />
                      <TextField label="Phone" fullWidth size="small" value={deliveryAddress.phone} onChange={(e) => setDeliveryAddress((current) => ({ ...current, phone: e.target.value }))} />
                      <TextField label="Street address" fullWidth size="small" value={deliveryAddress.addressLine1} onChange={(e) => setDeliveryAddress((current) => ({ ...current, addressLine1: e.target.value }))} />
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        <TextField label="City" fullWidth size="small" value={deliveryAddress.city} onChange={(e) => setDeliveryAddress((current) => ({ ...current, city: e.target.value }))} />
                        <TextField label="State" fullWidth size="small" value={deliveryAddress.state} onChange={(e) => setDeliveryAddress((current) => ({ ...current, state: e.target.value }))} />
                      </Stack>
                      <TextField label="Postal Code" fullWidth size="small" value={deliveryAddress.postalCode} onChange={(e) => setDeliveryAddress((current) => ({ ...current, postalCode: e.target.value }))} />
                      <TextField label="Country" fullWidth size="small" value={deliveryAddress.country} onChange={(e) => setDeliveryAddress((current) => ({ ...current, country: e.target.value }))} />
                    </Stack>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Billing Address</Typography>
                  <Typography variant="body2" color="text.secondary">Same as delivery address</Typography>
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
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography sx={{ fontWeight: 800 }}>Grand total</Typography><Typography sx={{ fontWeight: 800 }}>{money.format(grandTotal)}</Typography></Box>
                  </Stack>
                  <Button variant="contained" fullWidth sx={{ mt: 3, borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }} onClick={handleContinueToPayment} disabled={items.length === 0}>Continue to payment</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CheckoutPage;
