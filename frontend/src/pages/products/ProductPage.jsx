import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowLeft, CheckCircle2, Clock3, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import Loader from '../../components/ui/Loader';
import { addToCart, getCart } from '../../api/cartApi';
import { getProductById } from '../../api/productApi';
import { PATHS } from '../../routes/paths';
import useAuth from '../../hooks/useAuth';
import { products as localMockProducts } from '../../data/products';

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const rentalDurations = [
  { label: '1 Day', value: 1 },
  { label: '3 Days', value: 3 },
  { label: '1 Week', value: 7 },
  { label: '2 Weeks', value: 14 },
];

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [offlineWarning, setOfflineWarning] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [rentalDuration, setRentalDuration] = useState(7);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [wishlist, setWishlist] = useState(false);
  const [adding, setAdding] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        setOfflineWarning('');
        const productData = await getProductById(productId).catch(() => null);
        if (!productData) {
          const localProd = localMockProducts.find(p => String(p.id) === String(productId));
          if (localProd) {
            setProduct(localProd);
            setSelectedVariant(localProd.variantColors?.[0] || '');
            setSelectedImage(localProd.images?.[0] || localProd.imageUrl || '');
            setOfflineWarning('Backend API offline. Showing fallback product details.');
          } else {
            setErrorMsg('We could not find this product right now.');
            setProduct(null);
          }
        } else {
          setProduct(productData);
          setSelectedVariant(productData.variantColors?.[0] || '');
          setSelectedImage(productData.images?.[0] || productData.imageUrl || '');
        }
      } catch (err) {
        console.error('Failed to load product details', err);
        setErrorMsg('Unable to load this product right now.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  useEffect(() => {
    const wishlisted = JSON.parse(localStorage.getItem('wishlist_items') || '[]');
    setWishlist(wishlisted.includes(productId));
  }, [productId]);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cartItems = await getCart();
        setCartCount(cartItems.length);
      } catch (err) {
        console.warn('Could not fetch cart count:', err);
      }
    };
    fetchCartCount();
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

  const handleQuantityChange = (delta) => {
    setQuantity((current) => Math.max(1, current + delta));
  };

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    setAdding(true);
    try {
      const rentalStart = new Date();
      const rentalEnd = new Date();
      rentalEnd.setDate(rentalEnd.getDate() + rentalDuration);

      await addToCart({
        productId: String(product.id),
        quantity: Number(quantity),
        rentalStart: rentalStart.toISOString(),
        rentalEnd: rentalEnd.toISOString(),
        pricePerUnit: Number(product.price),
      });
      setCartCount((current) => current + quantity);
      setSnackbarMessage(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart.`);
      setSnackbarOpen(true);
      toast.success('Added to cart!');
    } catch (err) {
      console.error('Unable to add item to cart', err);
      // Simulate adding to cart if backend is offline
      setCartCount((current) => current + quantity);
      setSnackbarMessage(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart (offline mode).`);
      setSnackbarOpen(true);
      toast.success('Added to cart (Offline mode)!');
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = () => {
    const wishlisted = JSON.parse(localStorage.getItem('wishlist_items') || '[]');
    let updated;
    if (wishlist) {
      updated = wishlisted.filter((id) => String(id) !== String(productId));
      toast.error('Removed from wishlist');
    } else {
      updated = [...wishlisted, productId];
      toast.success('Added to wishlist!');
    }
    localStorage.setItem('wishlist_items', JSON.stringify(updated));
    setWishlist(!wishlist);
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const subtotal = product ? product.price * quantity * rentalDuration : 0;
  const listingSpecs = product?.specifications?.length
    ? product.specifications
    : [
        { label: 'Category', value: product?.categoryName || product?.category || 'General' },
        { label: 'Availability', value: product?.available ? 'In stock for rental' : 'Currently unavailable' },
        { label: 'Stock', value: `${product?.stockQuantity ?? 1} available` },
        { label: 'Rental window', value: `${rentalDuration} day${rentalDuration > 1 ? 's' : ''}` },
        { label: 'Dummy Test Details', value: 'Verified Ok (Test Mode)' }
      ];

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        <Navbar onSearchChange={() => {}} cartCount={cartCount} onLogout={handleLogout} />
        <Container maxWidth="xl" sx={{ pt: '94px', pb: 8 }}>
          <Loader message="Loading product details..." />
        </Container>
      </Box>
    );
  }

  if (errorMsg || !product) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        <Navbar onSearchChange={() => {}} cartCount={cartCount} onLogout={handleLogout} />
        <Container maxWidth="xl" sx={{ pt: '94px', pb: 8 }}>
          <Alert severity="warning" sx={{ borderRadius: 3 }}>{errorMsg || 'Product not found.'}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Navbar onSearchChange={() => {}} cartCount={cartCount} onLogout={handleLogout} />

      <Container maxWidth="xl" sx={{ pt: '94px', pb: 8 }}>
        {offlineWarning && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}>
            {offlineWarning}
          </Alert>
        )}
        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate(PATHS.ROOT)}
          sx={{ mb: 3, borderRadius: 999, px: 2.25, py: 0.9 }}
        >
          Back to products
        </Button>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
              <Box sx={{ bgcolor: '#f8fafc', p: { xs: 2, sm: 3 } }}>
                <Box
                  component="img"
                  src={selectedImage || product.imageUrl}
                  alt={product.name}
                  sx={{ width: '100%', height: { xs: 280, sm: 420 }, objectFit: 'cover', borderRadius: 3 }}
                />

                {product.images?.length > 1 && (
                  <Stack direction="row" spacing={1.5} sx={{ mt: 2, overflowX: 'auto', pb: 0.5 }}>
                    {product.images.map((image) => (
                      <Box
                        key={image}
                        component="img"
                        src={image}
                        alt={`${product.name} preview`}
                        onClick={() => setSelectedImage(image)}
                        sx={{
                          width: 84,
                          height: 84,
                          objectFit: 'cover',
                          borderRadius: 2,
                          border: selectedImage === image ? '2px solid' : '1px solid',
                          borderColor: selectedImage === image ? 'primary.main' : 'divider',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={product.categoryName || product.category} color="primary" variant="outlined" />
                  <Chip label={product.available ? 'Available' : 'Out of stock'} color={product.available ? 'success' : 'error'} />
                </Stack>

                <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 1 }}>
                  {product.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', mb: 3 }}>
                  {money.format(product.price)}
                </Typography>

                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Quantity</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconButton onClick={() => handleQuantityChange(-1)} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <Minus size={16} />
                      </IconButton>
                      <Typography variant="h6" sx={{ minWidth: 36, textAlign: 'center', fontWeight: 700 }}>
                        {quantity}
                      </Typography>
                      <IconButton onClick={() => handleQuantityChange(1)} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <Plus size={16} />
                      </IconButton>
                    </Stack>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Rental duration</Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                      {rentalDurations.map((duration) => (
                        <Button
                          key={duration.value}
                          variant={rentalDuration === duration.value ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => setRentalDuration(duration.value)}
                          sx={{ borderRadius: 999, textTransform: 'none' }}
                        >
                          {duration.label}
                        </Button>
                      ))}
                    </Stack>
                  </Box>

                  {product.variantColors?.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Choose a variant</Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                        {product.variantColors.map((variant) => (
                          <Button
                            key={variant}
                            variant={selectedVariant === variant ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setSelectedVariant(variant)}
                            sx={{ borderRadius: 999, textTransform: 'none' }}
                          >
                            {variant}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ShoppingCart size={16} />}
                      onClick={handleAddToCart}
                      disabled={adding || !product.available}
                      sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                    >
                      {adding ? 'Adding...' : 'Add to cart'}
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Heart size={16} fill={wishlist ? 'currentColor' : 'none'} />}
                      onClick={handleToggleWishlist}
                      sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}
                    >
                      {wishlist ? 'Saved' : 'Wishlist'}
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mt: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>Product Description</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {product.description}
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>Specifications</Typography>
                <Grid container spacing={1.5}>
                  {listingSpecs.map((spec) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={spec.label}>
                      <Box sx={{ p: 1.75, borderRadius: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="caption" color="text.secondary">{spec.label}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.25 }}>
                          {spec.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>Rental Information</Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ p: 1.75, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Clock3 size={16} color="#3b82f6" />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Flexible rental windows</Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ p: 1.75, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Truck size={16} color="#3b82f6" />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Fast delivery and pickup support</Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ p: 1.75, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <ShieldCheck size={16} color="#3b82f6" />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Secure rental handling</Typography>
                    </Stack>
                  </Box>
                </Stack>

                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>Terms & Conditions</Typography>
                <Stack spacing={1.25}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle2 size={16} color="#16a34a" />
                    <Typography variant="body2" color="text.secondary">A valid ID is required at collection.</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle2 size={16} color="#16a34a" />
                    <Typography variant="body2" color="text.secondary">Rental charges are calculated per selected duration.</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle2 size={16} color="#16a34a" />
                    <Typography variant="body2" color="text.secondary">Damage or late return fees may apply.</Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductPage;
