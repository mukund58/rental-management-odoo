import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Alert, CircularProgress, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import Button from '../ui/Button';
import Input from '../ui/Input';
import PasswordInput from '../ui/PasswordInput';

export const LoginForm = ({ onSuccess, onError }) => {
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await login(data.email, data.password);
      if (onSuccess) {
        onSuccess(res);
      }
    } catch (err) {
      // Show backend error message
      const responseData = err.response?.data;
      const backendError = typeof responseData === 'string' 
        ? responseData 
        : responseData?.message || 'Login failed. Please check your credentials.';
      
      setErrorMsg(backendError);
      if (onError) {
        onError(backendError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
          {errorMsg}
        </Alert>
      )}

      <Box sx={{ mb: 2.5 }}>
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              label="Email Address"
              autoComplete="email"
              autoFocus
              errorMessage={errors.email?.message}
            />
          )}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Controller
          name="password"
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          render={({ field }) => (
            <PasswordInput
              {...field}
              label="Password"
              autoComplete="current-password"
              errorMessage={errors.password?.message}
            />
          )}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
          <MuiLink
            component={Link}
            to={PATHS.FORGOT_PASSWORD}
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'indigo.600',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Forgot Password?
          </MuiLink>
        </Box>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 1, mb: 1, py: 1.2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
        <MuiLink
          component={Link}
          to={PATHS.REGISTER}
          sx={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'indigo.600',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Register as a new member
        </MuiLink>
      </Box>
    </Box>
  );
};

export default LoginForm;
