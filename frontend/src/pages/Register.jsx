import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/authService';
import { PATHS } from '../routes/paths';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await authService.register(name, email, password);
      alert(`Account created successfully! Welcome ${data.name}`);
      navigate(PATHS.DASHBOARD, { replace: true });
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Try a different email.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Create Account</h2>
      
      {error && <div className="mb-4 text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-2 rounded">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
        <input 
          type="text" 
          required
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-indigo-500 focus:border-indigo-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
        <input 
          type="email" 
          required
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-indigo-500 focus:border-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input 
          type="password" 
          required
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-indigo-500 focus:border-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded font-medium transition-colors">
        Register
      </button>

      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to={PATHS.LOGIN} className="text-indigo-600 hover:underline dark:text-indigo-400">
          Sign In
        </Link>
      </div>
    </form>
  );
};

export default Register;
