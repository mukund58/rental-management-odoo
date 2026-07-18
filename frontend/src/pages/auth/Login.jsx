import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { PATHS } from '../../routes/paths';

export const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (response) => {
    // Expected user structure contains role
    const user = response?.data?.user;
    const role = user?.role;

    const roleStr = String(role).toLowerCase();
    
    if (
      roleStr === 'admin' || 
      roleStr === 'vendor' ||
      role === 1 || 
      role === 2 // Assuming 1=Admin, 2=Vendor
    ) {
      navigate(PATHS.DASHBOARD, { replace: true });
    } else {
      navigate(PATHS.ROOT, { replace: true });
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
