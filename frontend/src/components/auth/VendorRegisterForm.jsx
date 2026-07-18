import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Alert, CircularProgress, Link as MuiLink, Typography, MenuItem, TextField } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerVendor, getCategories } from '../../api/authApi';
import { PATHS } from '../../routes/paths';
import Button from '../ui/Button';
import Input from '../ui/Input';
import PasswordInput from '../ui/PasswordInput';

export const VendorRegisterForm = ({ onSuccess, onError }) => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
        toast.error('Failed to load product categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      companyName: '',
      categoryId: '',
      gstNumber: '',
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
      const response = await registerVendor({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        companyName: data.companyName.trim(),
        categoryId: data.categoryId,
        gstNumber: data.gstNumber.trim(),
        email: data.email.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast.success('Vendor registration successful! Welcome aboard.');
      if (onSuccess) {
        onSuccess(response);
      } else {
        navigate(PATHS.DASHBOARD, { state: { newSignup: true } });
      }
    } catch (err) {
      const backendError = err.response?.data?.message || err.response?.data || 'Vendor registration failed. Please try again.';
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

      {/* Row 1: First Name & Last Name */}
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

      {/* Row 2: Company Name & GST Number */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Controller
            name="companyName"
            control={control}
            rules={{ required: 'Company Name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                label="Company Name"
                errorMessage={errors.companyName?.message}
              />
            )}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Controller
            name="gstNumber"
            control={control}
            rules={{ 
              required: 'GST number is required',
              pattern: {
                value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                message: 'Invalid GST format (e.g. 22AAAAA0000A1Z5)'
              }
            }}
            render={({ field }) => (
              <Input
                {...field}
                label="GST Number"
                placeholder="e.g. 22AAAAA0000A1Z5"
                errorMessage={errors.gstNumber?.message}
              />
            )}
          />
        </Box>
      </Box>

      {/* Row 3: Product Category Dropdown & Email Address */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: 'Product Category is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Product Category"
                error={!!errors.categoryId}
                helperText={errors.categoryId?.message || (loadingCategories ? 'Loading categories...' : '')}
                slotProps={{
                  select: {
                    displayEmpty: false,
                  }
                }}
              >
                {loadingCategories ? (
                  <MenuItem disabled value="">
                    <CircularProgress size={16} sx={{ mr: 1 }} /> Loading categories...
                  </MenuItem>
                ) : (
                  categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            )}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
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
      </Box>

      {/* Row 4: Password & Confirm Password */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
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
        <Box sx={{ flex: 1 }}>
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
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 1, mb: 2, py: 1.2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register as Vendor'}
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
          to={PATHS.REGISTER}
          sx={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'indigo.600',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
            mt: 0.5
          }}
        >
          Register as Customer
        </MuiLink>
      </Box>
    </Box>
  );
};

export default VendorRegisterForm;
