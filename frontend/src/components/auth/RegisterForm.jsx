import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
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
      const response = await apiRegister({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-2 w-full space-y-4">
      {errorMsg && (
        <div className="rounded-lg bg-destructive/15 p-4 text-sm text-destructive border border-destructive/20">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
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
        </div>
        <div className="flex-1">
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
        </div>
      </div>

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
              autoComplete="new-password"
              errorMessage={errors.password?.message}
            />
          )}
        />
      </div>

      <div>
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
      </div>

      <Button
        type="submit"
        fullWidth
        disabled={loading}
        className="mt-2 py-5"
      >
        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
        Register
      </Button>

      <div className="mt-4 flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to={PATHS.LOGIN}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Login
          </Link>
        </p>

        <Link
          to={PATHS.REGISTER_VENDOR}
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Become a Vendor
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
