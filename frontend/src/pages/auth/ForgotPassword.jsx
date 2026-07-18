import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Typography, Link as MuiLink, Alert, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotPassword } from '../../api/authApi';
import { PATHS } from '../../routes/paths';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export const ForgotPassword = () => {
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await forgotPassword(data.email.trim());
      setSuccessMsg('The password reset link has been sent to your email.');
      toast.success('Reset link sent successfully!');
    } catch (err) {
      const backendError = err.response?.data?.message || err.response?.data || 'Failed to request password reset. Please try again.';
      setErrorMsg(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
        Reset Password
      </Typography>

      {successMsg ? (
        <Box sx={{ width: '100%', textAlign: 'center', my: 2 }}>
          <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>
            {successMsg}
          </Alert>
          <MuiLink
            component={Link}
            to={PATHS.LOGIN}
            sx={{
              fontWeight: 600,
              color: 'indigo.600',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Back to Login
          </MuiLink>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px' }}>
              {errorMsg}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
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
                  label="Enter Email ID"
                  autoComplete="email"
                  autoFocus
                  errorMessage={errors.email?.message}
                />
              )}
            />
          </Box>

          {/* Verification Warning Box as per Mockup */}
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: '8px',
              border: '2px dashed #f59e0b', // Amber/Orange dashed border
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? '#fffbeb' : '#2d1f05', // light amber bg
              color: (theme) =>
                theme.palette.mode === 'light' ? '#b45309' : '#fef3c7',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'center' }}>
              Note: The system should verify whether the entered email exists.
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 1,
              mb: 3,
              py: 1.2,
              backgroundColor: '#9333ea', // Purple button as per mockup
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#7e22ce'
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <MuiLink
              component={Link}
              to={PATHS.LOGIN}
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'indigo.600',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Back to Login
            </MuiLink>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ForgotPassword;
