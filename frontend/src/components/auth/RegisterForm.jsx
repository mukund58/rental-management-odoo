import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Alert, CircularProgress, Link as MuiLink, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as apiRegister } from '../../api/authApi';
import { PATHS } from '../../routes/paths';
import Button from '../ui/Button';
import Input from '../ui/Input';
import PasswordInput from '../ui/PasswordInput';

export const RegisterForm = ({ onSuccess, onError }) => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
      
      const response = await apiRegister({
        fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: 'Customer', // Explicitly registering as Customer
      });

      toast.success('Registration successful! Please sign in.');
      if (onSuccess) {
        onSuccess(response);
      } else {
        navigate(PATHS.LOGIN);
      }
    } catch (err) {
      const backendError = err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.';
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

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Controller
            name="firstName"
            control={control}
            rules={{ required: 'First Name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                label="First Name"
                autoComplete="given-name"
                errorMessage={errors.firstName?.message}
              />
            )}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Controller
            name="lastName"
            control={control}
            rules={{ required: 'Last Name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                label="Last Name"
                autoComplete="family-name"
                errorMessage={errors.lastName?.message}
              />
            )}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
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
              errorMessage={errors.email?.message}
            />
          )}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
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
              autoComplete="new-password"
              errorMessage={errors.password?.message}
            />
          )}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: 'Confirm Password is required',
            validate: (value) => value === password || 'Passwords do not match',
          }}
          render={({ field }) => (
            <PasswordInput
              {...field}
              label="Confirm Password"
              autoComplete="new-password"
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 1, mb: 2, py: 1.2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <MuiLink component={Link} to={PATHS.LOGIN} sx={{ fontWeight: 600, color: 'indigo.600', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Login
          </MuiLink>
        </Typography>

        <MuiLink
          component={Link}
          to={PATHS.REGISTER_VENDOR}
          sx={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'indigo.600',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
            mt: 0.5
          }}
        >
          Become a Vendor
        </MuiLink>
      </Box>
    </Box>
  );
};

export default RegisterForm;
