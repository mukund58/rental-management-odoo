import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { PATHS } from '../../routes/paths';
import { parseJwt } from '../../utils/jwt';

export const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (res) => {
    // AuthContext.login() → apiLogin() → returns response.data directly
    // So res = { token, user: { id, role, ... } }
    const user = res?.user || res?.data?.user;
    const token = res?.token || res?.data?.token;
    let roleStr = '';

    // First try from user object
    if (user?.role !== undefined && user?.role !== null) {
      roleStr = String(user.role).toLowerCase();
    }

    // Fallback: decode from JWT token
    if (!roleStr && token) {
      const decoded = parseJwt(token);
      if (decoded) {
        const extractedRole =
          decoded.role ||
          decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if (extractedRole) roleStr = String(extractedRole).toLowerCase();
      }
    }

    if (
      roleStr === 'admin' ||
      roleStr === 'vendor' ||
      roleStr === '0' ||
      roleStr === '1' ||
      user?.role === 0 ||
      user?.role === 1
    ) {
      navigate(PATHS.ADMIN_DASHBOARD, { replace: true });
    } else {
      navigate(PATHS.ROOT, { replace: true });
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
};

export default Login;

