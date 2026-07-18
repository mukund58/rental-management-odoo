import React, { useMemo, useState, useEffect } from 'react';
import { Alert, Box, Button, Card, CardContent, Container, Divider, Grid, Stack, TextField, Typography, Radio, FormControlLabel, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { customerMockAddresses } from '../../data/customerMocks';
import { getCart } from '../../api/cartApi';
import Loader from '../../components/ui/Loader';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const fallbackCartItems = [
  {
    id: 'fallback-1',
    productId: 'p1',
    name: 'MacBook Pro 16" (M3 Max)',
    pricePerUnit: 450,
    quantity: 2,
    rentalStart: new Date().toISOString(),
    rentalEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    rentalDurationDays: 7,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60',
    variant: 'Gray',
  },
  {
    id: 'fallback-2',
    productId: 'p3',
    name: 'PlayStation 5 Console',
    pricePerUnit: 200,
    quantity: 1,
    rentalStart: new Date().toISOString(),
    rentalEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    rentalDurationDays: 5,
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80',
    variant: 'Standard',
  }
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [addresses, setAddresses] = useState(customerMockAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(customerMockAddresses.find((item) => item.isDefault)?.id || customerMockAddresses[0]?.id);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '', country: '' });
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
            setItems(fallbackCartItems);
          }
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        if (isMounted) {
          setItems(fallbackCartItems);
          setErrorMsg('Backend API not responding. Using offline fallback cart data.');
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

  const selectedAddress = useMemo(() => addresses.find((item) => item.id === selectedAddressId) || addresses[0], [addresses, selectedAddressId]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);
  }, [items]);

  const taxes = subtotal * 0.08;
  const grandTotal = subtotal + taxes;

  const handleContinueToPayment = () => {
    if (!selectedAddressId) {
      setErrorMsg('Please select a delivery address.');
      return;
    }
    if (items.length === 0) {
      setErrorMsg('Your cart is empty. Please add items to proceed.');
      return;
    }
    navigate(PATHS.PAYMENT, {
      state: {
        addressId: selectedAddressId,
        items,
        subtotal,
        taxes,
        grandTotal
      }
    });
  };

  const handleAddAddress = () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      setErrorMsg('Please fill all required address fields.');
      return;
    }

    const nextAddress = { id: `addr-${Date.now()}`, ...newAddress, isDefault: false };
    setAddresses((current) => [nextAddress, ...current]);
    setSelectedAddressId(nextAddress.id);
    setNewAddress({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '', country: '' });
    setShowNewAddress(false);
    setErrorMsg('');
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
                  <Stack spacing={1.5}>
                    {addresses.map((address) => (
                      <Box key={address.id} sx={{ border: '1px solid', borderColor: selectedAddressId === address.id ? 'primary.main' : 'divider', borderRadius: 3, p: 2.25, bgcolor: selectedAddressId === address.id ? 'primary.50' : 'background.paper' }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
                          <Box>
                            <FormControlLabel
                              value={address.id}
                              control={<Radio checked={selectedAddressId === address.id} onChange={() => setSelectedAddressId(address.id)} />}
                              label={<Typography sx={{ fontWeight: 700 }}>{address.label}</Typography>}
                            />
                            <Typography variant="body2" color="text.secondary">{address.fullName} • {address.phone}</Typography>
                            <Typography variant="body2" color="text.secondary">{address.street}, {address.city}, {address.state} - {address.pincode}</Typography>
                          </Box>
                          {address.isDefault && <Chip label="Default" color="success" size="small" />}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>

                  <Button startIcon={<Plus size={16} />} onClick={() => setShowNewAddress((current) => !current)} sx={{ mt: 2.5, borderRadius: 999, textTransform: 'none', fontWeight: 700 }}>
                    {showNewAddress ? 'Hide form' : 'Add new address'}
                  </Button>

                  {showNewAddress && (
                    <Box sx={{ mt: 2.5, p: 2.25, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                      <Stack spacing={1.5}>
                        <TextField label="Full name" fullWidth size="small" value={newAddress.fullName} onChange={(e) => setNewAddress((current) => ({ ...current, fullName: e.target.value }))} />
                        <TextField label="Phone" fullWidth size="small" value={newAddress.phone} onChange={(e) => setNewAddress((current) => ({ ...current, phone: e.target.value }))} />
                        <TextField label="Street address" fullWidth size="small" value={newAddress.street} onChange={(e) => setNewAddress((current) => ({ ...current, street: e.target.value }))} />
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                          <TextField label="City" fullWidth size="small" value={newAddress.city} onChange={(e) => setNewAddress((current) => ({ ...current, city: e.target.value }))} />
                          <TextField label="State" fullWidth size="small" value={newAddress.state} onChange={(e) => setNewAddress((current) => ({ ...current, state: e.target.value }))} />
                        </Stack>
                        <TextField label="Pincode" fullWidth size="small" value={newAddress.pincode} onChange={(e) => setNewAddress((current) => ({ ...current, pincode: e.target.value }))} />
                        <TextField label="Country" fullWidth size="small" value={newAddress.country} onChange={(e) => setNewAddress((current) => ({ ...current, country: e.target.value }))} />
                        <Button variant="contained" sx={{ borderRadius: 999, py: 1, textTransform: 'none', fontWeight: 700 }} onClick={handleAddAddress}>Save address</Button>
                      </Stack>
                    </Box>
                  )}
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
