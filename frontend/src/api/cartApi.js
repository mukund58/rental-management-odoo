import api from './axios';

const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80';

const normalizeCartItem = (item) => {
  const quantity = Number(item?.quantity ?? 1);
  const pricePerUnit = Number(item?.pricePerUnit ?? item?.price ?? 0);
  const productId = item?.productId ?? item?.product?.id ?? item?.id;

  return {
    id: item?.id,
    productId,
    quantity,
    rentalStart: item?.rentalStart ?? item?.rentalStartDate ?? null,
    rentalEnd: item?.rentalEnd ?? item?.rentalEndDate ?? null,
    pricePerUnit,
    rentalDurationDays: item?.rentalDurationDays ?? item?.durationDays ?? null,
    name: item?.name || item?.productName || item?.product?.name || `Rental Item ${String(productId ?? '01').slice(0, 4)}`,
    imageUrl: item?.imageUrl || item?.image || item?.product?.imageUrl || item?.product?.image || fallbackImage,
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

export default { getCart, addToCart, removeCartItem };
