import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button as MUIButton, Card, CardContent, Grid, TextField, Typography, Divider } from '@mui/material';
import { getProductById } from '../../api/productApi';
import { addToCart } from '../../api/cartApi';
import Loader from '../../components/ui/Loader';

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rentalStart, setRentalStart] = useState('');
  const [rentalEnd, setRentalEnd] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const p = await getProductById(productId);
        setProduct(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  if (loading) return <Loader message="Loading product..." />;
  if (!product) return <Typography>Product not found</Typography>;

  const days = rentalStart && rentalEnd ? Math.max(1, Math.ceil((new Date(rentalEnd) - new Date(rentalStart)) / (1000 * 60 * 60 * 24))) : 1;
  const subtotal = product.price * quantity * days;

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart({
        productId: product.id,
        quantity,
        rentalStart: rentalStart ? new Date(rentalStart).toISOString() : new Date().toISOString(),
        rentalEnd: rentalEnd ? new Date(rentalEnd).toISOString() : new Date().toISOString(),
        pricePerUnit: product.price,
      });
      alert('Added to cart');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box component="img" src={product.imageUrl || ''} alt={product.name} sx={{ width: '100%', maxHeight: 420, objectFit: 'cover' }} />
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{product.name}</Typography>
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>{money.format(product.price)}</Typography>
              <Typography variant="body1" color="text.secondary">{product.description}</Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Rental Start"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={rentalStart}
                    onChange={(e) => setRentalStart(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Rental End"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={rentalEnd}
                    onChange={(e) => setRentalEnd(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Quantity"
                    type="number"
                    fullWidth
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <MUIButton variant="contained" onClick={handleAddToCart} disabled={adding} sx={{ height: '100%' }}>
                    {adding ? 'Adding...' : 'Add to cart'}
                  </MUIButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Order Summary</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2">Price: {money.format(product.price)}</Typography>
              <Typography variant="body2">Days: {days}</Typography>
              <Typography variant="body2">Quantity: {quantity}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{money.format(subtotal)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductPage;
