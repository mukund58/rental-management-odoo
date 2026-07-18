import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

export const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (response) => {
    // Expected user structure contains role
    const user = response?.data?.user;
    const role = user?.role;

    if (
      role === 'Admin' ||
      role === 'admin' ||
      role === 1 ||
      String(role).toLowerCase() === 'admin'
    ) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
        Sign In to Your Account
      </Typography>
      <LoginForm onSuccess={handleLoginSuccess} />
    </Box>
  );
};

export default Login;
