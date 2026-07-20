import React from 'react';
import { Box, Typography } from '@mui/material';
import RegisterForm from '../../components/auth/RegisterForm';

export const Register = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignitems: 'center', width: '100%' }}>
      <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
        Create Customer Account
      </Typography>
      <RegisterForm />
    </Box>
  );
};

export default Register;
