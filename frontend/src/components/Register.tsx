import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await authService.register(name, email, password);
      alert(`Account created successfully! Welcome ${data.name}`);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data || 'Registration failed. Try a different email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        
        {error && <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            type="text" 
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input 
            type="email" 
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-medium">
          Register
        </button>
      </form>
    </div>
  );
};

