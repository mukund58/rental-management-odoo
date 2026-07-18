import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Loader from '../../components/ui/Loader';
import { getCart, removeCartItem } from '../../api/cartApi';
import { PATHS } from '../../routes/paths';
import useAuth from '../../hooks/useAuth';

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const CartPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const loadCart = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const cartItems = await getCart();
      setItems(Array.isArray(cartItems) ? cartItems : []);
    } catch (err) {
      console.error('Unable to load cart', err);
      setErrorMsg('We could not load your cart right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    }
  };

  const handleRemove = async (id) => {
    try {
      setRemovingId(id);
      await removeCartItem(id);
      await loadCart();
    } catch (err) {
      console.error('Unable to remove cart item', err);
      setErrorMsg('We could not remove that item from your cart.');
    } finally {
      setRemovingId(null);
    }
  };

  const summary = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const unitPrice = Number(item.pricePerUnit ?? 0);
      const quantity = Number(item.quantity ?? 1);
      return sum + unitPrice * quantity;
    }, 0);

    const taxes = subtotal * 0.08;
    const grandTotal = subtotal + taxes;

    return { subtotal, taxes, grandTotal };
  }, [items]);

  const renderEmptyState = () => (
    <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
      <CardContent sx={{ py: 8, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 88, height: 88, borderRadius: '50%', bgcolor: 'grey.100', mb: 3 }}>
          <ShoppingBag size={36} color="#64748b" />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Add some rental products to see them here.
        </Typography>
        <Button variant="contained" onClick={() => navigate(PATHS.ROOT)} sx={{ borderRadius: 999, px: 3, py: 1.1, textTransform: 'none', fontWeight: 700 }}>
          Continue shopping
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Navbar onSearchChange={() => {}} cartCount={items.length} onLogout={handleLogout} />

      <Container maxWidth="xl" sx={{ pt: '94px', pb: 8 }}>
        <Button variant="outlined" startIcon={<ArrowLeft size={16} />} onClick={() => navigate(PATHS.ROOT)} sx={{ mb: 3, borderRadius: 999, px: 2.25, py: 0.9 }}>
          Back to products
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
          Your Cart
        </Typography>

        {errorMsg && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
            {errorMsg}
          </Alert>
        )}

        {loading ? (
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Loader message="Loading your cart..." />
          </Card>
        ) : items.length === 0 ? (
          renderEmptyState()
        ) : (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={2.5}>
                {items.map((item) => (
                  <Card key={item.id} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5 }}>
                        <Box
                          component="img"
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'}
                          alt={item.name || 'Cart item'}
                          sx={{ width: { xs: '100%', sm: 140 }, height: 120, objectFit: 'cover', borderRadius: 3 }}
                        />

                        <Box sx={{ flexGrow: 1 }}>
                          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {item.name || 'Rental item'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {item.rentalDurationDays ? `Rental duration: ${item.rentalDurationDays} day(s)` : 'Flexible rental'}
                              </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                              {money.format((Number(item.pricePerUnit ?? 0) * Number(item.quantity ?? 1)))}
                            </Typography>
                          </Stack>

                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Rental start</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {item.rentalStart ? new Date(item.rentalStart).toLocaleDateString() : 'Today'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Rental end</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {item.rentalEnd ? new Date(item.rentalEnd).toLocaleDateString() : 'Flexible'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Quantity</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {item.quantity ?? 1}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>

                        <IconButton
                          onClick={() => handleRemove(item.id)}
                          disabled={removingId === item.id}
                          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', position: 'sticky', top: '94px' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                    Order Summary
                  </Typography>

                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Subtotal</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{money.format(summary.subtotal)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Taxes</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{money.format(summary.taxes)}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 800 }}>Grand total</Typography>
                      <Typography sx={{ fontWeight: 800 }}>{money.format(summary.grandTotal)}</Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={1.25} sx={{ mt: 3 }}>
                    <Button variant="contained" fullWidth onClick={() => navigate(PATHS.CHECKOUT)} sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}>
                      Proceed to checkout
                    </Button>
                    <Button variant="outlined" fullWidth onClick={() => navigate(PATHS.ROOT)} sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}>
                      Continue shopping
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CartPage;
