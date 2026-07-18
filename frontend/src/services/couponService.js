import api from '../api/axios';

/**
 * Fetch welcome coupon details from the backend
 */
export const getWelcomeCoupon = async () => {
  const response = await api.get('/coupon/welcome');
  return response.data;
};
