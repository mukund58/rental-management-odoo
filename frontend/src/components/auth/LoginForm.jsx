import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-2 w-full space-y-5">
      {errorMsg && (
        <div className="rounded-lg bg-destructive/15 p-4 text-sm text-destructive border border-destructive/20">
          {errorMsg}
        </div>
      )}

      <div>
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
      </div>

      <div>
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
        <div className="mt-2 flex justify-end">
          <Link
            to={PATHS.FORGOT_PASSWORD}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        disabled={loading}
        className="mt-2 py-5"
      >
        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
        Sign In
      </Button>

      <div className="mt-4 flex justify-center">
        <Link
          to={PATHS.REGISTER}
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Register as a new member
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
