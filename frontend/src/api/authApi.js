import api from './axios';

/**
 * Register a new user
 * @param {Object} payload
 * @param {string} payload.fullName
 * @param {string} payload.email
 * @param {string} payload.password
 * @param {string} payload.confirmPassword
 * @param {string} payload.role
 */
export const register = async ({ firstName, lastName, email, password, confirmPassword }) => {
  const response = await api.post('/api/auth/register', {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  });
  return response.data;
};

/**
 * Log in a user
 * @param {string} email 
 * @param {string} password 
 */
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

/**
 * Fetch currently authenticated user profiles
 */
export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

/**
 * Terminate the user session
 */
export const logout = async () => {
  const response = await api.post('/api/auth/logout');
  return response.data;
};

/**
 * Register a new vendor
 * @param {Object} payload
 */
export const registerVendor = async (payload) => {
  const response = await api.post('/api/auth/register/vendor', payload);
  return response.data;
};

/**
 * Fetch available product categories
 */
export const getCategories = async () => {
  const response = await api.get('/api/auth/categories');
  return (response.data || []).map((category) => ({
    id: category.id ?? category.Id,
    name: category.name ?? category.Name,
  }));
};

/**
 * Request password reset link
 * @param {string} email
 */
export const forgotPassword = async (email) => {
  const response = await api.post('/api/auth/forgot-password', { email });
  return response.data;
};

