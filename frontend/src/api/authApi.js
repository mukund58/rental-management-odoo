import api from './axios';

/**
 * Register a new user
 * @param {Object} data - Register credentials (name, email, password, etc.)
 */
export const register = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

/**
 * Log in a user
 * @param {Object} data - Login credentials (email, password)
 */
export const login = async (data) => {
  const response = await api.post('/auth/login', data);
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
