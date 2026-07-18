import api from './axios';

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data || [];
};

export const getProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

export const createProduct = async (payload) => {
  const response = await api.post('/products', payload);
  return response.data;
};

export const updateProduct = async (productId, payload) => {
  const response = await api.put(`/products/${productId}`, payload);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};