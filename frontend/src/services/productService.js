import api from './api';

/**
 * Fetch all products from the backend API
 * @returns {Promise<Array>} List of product objects
 */
export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export default {
  getProducts,
};
