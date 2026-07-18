import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        },
      }}
    >
      {/* Product Image */}
      <Box sx={{ position: 'relative', pt: '75%', bgcolor: '#f8fafc' }}>
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Availability Badge */}
        <Chip
          label={product.available ? 'Available' : 'Out of Stock'}
          size="small"
          color={product.available ? 'success' : 'error'}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontWeight: 700,
            fontSize: '0.725rem',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        />
      </Box>

      <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Color circles below image if multiple exist */}
        {product.colors && product.colors.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {product.colors.map((colorHex, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: colorHex,
                  border: colorHex === '#ffffff' ? '1px solid #cbd5e1' : 'none',
                }}
              />
            ))}
          </Box>
        )}

        {/* Product Title */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            lineHeight: 1.3,
            height: 44,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.name}
        </Typography>

        {/* Rental Price */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
            ₹{product.rentalPrice}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            / {product.rentalUnit}
          </Typography>
        </Box>

        {/* View Details Button */}
        <Button
          variant="outlined"
          fullWidth
          onClick={handleDetailsClick}
          sx={{
            mt: 1,
            borderRadius: '8px',
            fontWeight: 600,
            textTransform: 'none',
            py: 0.8,
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            },
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
