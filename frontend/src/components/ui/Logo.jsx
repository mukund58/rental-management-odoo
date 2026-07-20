import React from 'react';
import { Box, Typography } from '@mui/material';

export const Logo = ({ size = 32, showText = true, ...props }) => {
  return (
    <Box sx={{ display: 'flex', alignitems: 'center', gap: 1.5 }} {...props}>
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          display: 'flex',
          alignitems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: `${size * 0.5}px`,
        }}
      >
        R
      </Box>
      {showText && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'text.primary',
          }}
        >
          RentalSystem
        </Typography>
      )}
    </Box>
  );
};

export default Logo;
