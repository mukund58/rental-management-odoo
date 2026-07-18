import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Logo = () => {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate('/')}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.2,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Premium custom SVG for RentX Logo */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0px 3px 6px rgba(59, 130, 246, 0.4))' }}
      >
        <rect width="100" height="100" rx="24" fill="url(#logo-grad)" />
        <path
          d="M30 70 L45 30 H55 L70 70 M38 52 H62"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 900,
          background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.03em',
          fontSize: '1.4rem',
        }}
      >
        RentX
      </Typography>
    </Box>
  );
};

export default Logo;
