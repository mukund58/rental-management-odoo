import api from './axios';

export const checkout = async (payload) => {
  const response = await api.post('/checkout', payload);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/checkout/orders');
  return response.data;
};

export const getOrder = async (orderId) => {
  const response = await api.get(`/checkout/orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.patch(`/checkout/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to cancel order';
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(`/checkout/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to update order status';
  }
};
