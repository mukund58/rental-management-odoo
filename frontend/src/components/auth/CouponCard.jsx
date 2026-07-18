import React from 'react';
import { Box, Typography } from '@mui/material';

export const CouponCard = ({ couponCode = 'XXXX10', discount = '10%' }) => {
  return (
    <Box
      sx={{
        width: '100%',
        p: { xs: 3, sm: 4 },
        borderRadius: '16px',
        backgroundColor: '#fef3c7', // Yellow background container matching wireframe
        border: '1.5px solid #fde68a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)',
        mb: 4,
      }}
    >
      {/* Title block */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: '#b45309', // Amber 700
          fontFamily: 'Outfit, Inter, sans-serif',
          textAlign: 'center',
        }}
      >
        For new signup
      </Typography>

      {/* Small Coupon Code badge */}
      <Box
        sx={{
          px: 3,
          py: 0.75,
          borderRadius: '6px',
          backgroundColor: '#93c5fd', // Light blue badge as in Excalidraw
          color: '#1e3a8a', // Dark blue text
          fontWeight: 700,
          fontSize: '0.9rem',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
        }}
      >
        Coupon Code
      </Box>

      {/* Large Coupon Code Display Box */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '280px',
          py: 2.5,
          borderRadius: '12px',
          backgroundColor: '#93c5fd', // Large light blue box as in Excalidraw
          color: '#1e3a8a',
          fontWeight: 800,
          fontSize: '2rem',
          letterSpacing: '2px',
          textAlign: 'center',
          border: '2px dashed #3b82f6', // Premium dashed line cut border
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06), 0 8px 16px -4px rgba(0,0,0,0.1)',
        }}
      >
        {couponCode}
      </Box>
    </Box>
  );
};

export default CouponCard;
