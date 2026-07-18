import React from 'react';
import { Box, Typography } from '@mui/material';
import VendorRegisterForm from '../../components/auth/VendorRegisterForm';

export const VendorRegister = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
        Vendor Sign-up Page
      </Typography>
      <VendorRegisterForm />
    </Box>
  );
};

export default VendorRegister;
