import api from './axios';

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data || [];
};

export const addToCart = async (payload) => {
  const response = await api.post('/cart/add', payload);
  return response.data;
};

export const removeCartItem = async (id) => {
  const response = await api.delete(`/cart/${id}`);
  return response.data;
};

export default { getCart, addToCart, removeCartItem };
