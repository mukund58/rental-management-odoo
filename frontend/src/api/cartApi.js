import api from './axios';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80';

const resolveImageUrl = (url) => {
  if (!url) return fallbackImage;
  if (url.startsWith('/')) return `${BACKEND_URL}${url}`;
  return url;
};

const normalizeCartItem = (item) => {
  const quantity = Number(item?.quantity ?? 1);
  const pricePerUnit = Number(item?.pricePerUnit ?? item?.price ?? 0);
  const productId = item?.productId ?? item?.product?.id ?? item?.id;
  const rentalDurationDays = item?.rentalDurationDays
    ?? (item?.rentalStart && item?.rentalEnd
      ? Math.max(1, Math.ceil((new Date(item.rentalEnd) - new Date(item.rentalStart)) / (1000 * 60 * 60 * 24)))
      : 1);

  return {
    id: item?.id,
    productId,
    quantity,
    rentalStart: item?.rentalStart ?? item?.rentalStartDate ?? null,
    rentalEnd: item?.rentalEnd ?? item?.rentalEndDate ?? null,
    pricePerUnit,
    rentalDurationDays,
    name: item?.name || item?.productName || item?.product?.name || `Rental Item`,
    imageUrl: resolveImageUrl(item?.imageUrl || item?.image || item?.product?.imageUrl || item?.product?.image),
    variant: item?.variant || item?.product?.variant || 'Standard',
  };
};

export const getCart = async () => {
  const response = await api.get('/cart');
  return (response.data || []).map(normalizeCartItem);
};

export const addToCart = async (payload) => {
  const cartPayload = {
    productId: payload?.productId,
    quantity: Number(payload?.quantity ?? 1),
    rentalStart: payload?.rentalStart ?? new Date().toISOString(),
    rentalEnd: payload?.rentalEnd ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    pricePerUnit: Number(payload?.pricePerUnit ?? 0),
  };

  const response = await api.post('/cart/add', cartPayload);
  return normalizeCartItem(response.data);
};

export const removeCartItem = async (id) => {
  const response = await api.delete(`/cart/${id}`);
  return response.data;
};

export const clearCart = async () => {
  await api.delete('/cart');
};

export default { getCart, addToCart, removeCartItem, clearCart };
