import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Snackbar,
  Alert
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import filtersData from '../../data/filters';
import { addToCart } from '../../api/cartApi';
import { PATHS } from '../../routes/paths';


/**
 * ProductCard component representing a single rental product
 * @param {Object} props
 * @param {Object} props.product - Product object details
 * @param {Function} props.onAddToCartSuccess - Callback triggered when item is added to cart successfully
 */
export const ProductCard = ({ product, onAddToCartSuccess }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState('Product Added To Cart');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();


  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  const handleAddToCart = async (e) => {
    e.stopPropagation();

    try {
      const rentalStart = new Date();
      const rentalEnd = new Date();
      rentalEnd.setDate(rentalEnd.getDate() + 7);

      await addToCart({
        productId: String(product.id),
        quantity: 1,
        rentalStart: rentalStart.toISOString(),
        rentalEnd: rentalEnd.toISOString(),
        pricePerUnit: Number(product.price),
      });

      setSnackbarMessage('Product added to cart');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      if (onAddToCartSuccess) {
        onAddToCartSuccess();
      }
    } catch (err) {
      console.error('Unable to add item to cart', err);
      setSnackbarMessage('Unable to add this item to the cart right now.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleViewDetails = (event) => {
    event.stopPropagation();
    navigate(PATHS.PRODUCT_PAGE.replace(':productId', product.id));
  };

  const isAvailable = product.available !== false;

  // Render variant color dots matching product colors
  const colorChips = (product.variantColors || []).map((colorName) => {
    const found = filtersData.colors.find((c) => c.name.toLowerCase() === colorName.toLowerCase());
    return {
      name: colorName,
      hex: found ? found.hex : '#94a3b8',
    };
  });

  // Decide if price is /day or /month depending on duration
  const priceSuffix = product.duration && (product.duration.includes('Month') || product.duration.includes('Year')) ? 'month' : 'day';

  return (
    <>
      <Card
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 12px 24px rgba(59, 130, 246, 0.12)',
            borderColor: 'primary.light',
          },
        }}
      >
        {/* Large Product Image */}
        <Box sx={{ position: 'relative', pt: '75%', bgcolor: '#f8fafc', overflow: 'hidden' }}>
          <CardMedia
            component="img"

            image={product.imageUrl || product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'}

            image={product.image}

            alt={product.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              '&:hover': {
                transform: 'scale(1.06)',
              },
            }}
          />
          {/* Availability Badge */}
          <Chip
            label={isAvailable ? 'Available' : 'Out Of Stock'}
            size="small"
            color={isAvailable ? 'success' : 'error'}
            sx={{
              position: 'absolute',
              top: 14,
              right: 14,
              fontWeight: 750,
              fontSize: '0.725rem',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          />
        </Box>

        {/* Product Details */}
        <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.35,
              height: 42,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              color: 'text.primary',
            }}
          >
            {product.name}
          </Typography>

          {/* Price Label */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.25, mt: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main' }}>
              ₹{product.price.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              /{priceSuffix}
            </Typography>
          </Box>

          {/* Variant Color Chips */}
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, mb: 1, flexWrap: 'wrap', height: 20 }}>
            {colorChips.map((color) => (
              <Box
                key={color.name}
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: color.hex,
                  border: color.hex === '#ffffff' ? '1px solid #cbd5e1' : 'none',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                }}
                title={color.name}
              />
            ))}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 1.5 }}>
            <Button
              variant="outlined"
              fullWidth

              onClick={handleViewDetails}

              startIcon={<Eye size={14} />}
              sx={{
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'none',
                py: 0.8,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  borderColor: 'primary.dark',
                },
              }}
            >
              View Details
            </Button>
            <Button
              variant="contained"
              fullWidth
              disabled={!isAvailable}
              onClick={handleAddToCart}
              startIcon={<ShoppingCart size={14} />}
              sx={{
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'none',
                py: 0.8,
                background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: 'none',
                '&:hover': {
                  opacity: 0.95,
                  boxShadow: 'none',
                },
              }}
            >
              Add To Cart
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Local success alert Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ borderRadius: '8px', fontWeight: 650 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCard;
