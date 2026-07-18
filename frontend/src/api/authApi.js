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
export const register = async ({ fullName, email, password, confirmPassword, role }) => {
  // TODO: Add "phone" parameter when it is included in the registration screen wireframe
  const response = await api.post('/auth/register', {
    fullName,
    email,
    password,
    confirmPassword,
    role,
    phone: '', // Defaulting to empty string for now to satisfy backend requirement
  });
  return response.data;
};

/**
 * Log in a user
 * @param {string} email 
 * @param {string} password 
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Fetch currently authenticated user profiles
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Terminate the user session
 */
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

/**
 * Register a new vendor
 * @param {Object} payload
 */
export const registerVendor = async (payload) => {
  const response = await api.post('/auth/register/vendor', payload);
  return response.data;
};

/**
 * Fetch available product categories
 */
export const getCategories = async () => {
  const response = await api.get('/auth/categories');
  return response.data;
};
