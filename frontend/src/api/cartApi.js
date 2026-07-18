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
  try {
    const response = await api.get('/api/cart');
    return (response.data || []).map(normalizeCartItem);
  } catch (err) {
    console.warn('Backend cart API offline, loading cart from localStorage fallback.');
    const local = JSON.parse(localStorage.getItem('cart_items') || '[]');
    return local.map(normalizeCartItem);
  }
};

export const addToCart = async (payload) => {
  try {
    const cartPayload = {
      productId: payload?.productId,
      quantity: Number(payload?.quantity ?? 1),
      rentalStart: payload?.rentalStart ?? new Date().toISOString(),
      rentalEnd: payload?.rentalEnd ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      pricePerUnit: Number(payload?.pricePerUnit ?? 0),
    };
    const response = await api.post('/api/cart/add', cartPayload);
    window.dispatchEvent(new Event('cart-updated'));
    return normalizeCartItem(response.data);
  } catch (err) {
    console.warn('Backend cart API offline, adding item to localStorage fallback.');
    const local = JSON.parse(localStorage.getItem('cart_items') || '[]');
    const existingIdx = local.findIndex(i => String(i.productId) === String(payload.productId));
    let newItem;
    if (existingIdx > -1) {
      local[existingIdx].quantity += Number(payload.quantity ?? 1);
      newItem = local[existingIdx];
    } else {
      newItem = {
        id: `cart-${Math.floor(100000 + Math.random() * 900000)}`,
        productId: payload.productId,
        quantity: Number(payload.quantity ?? 1),
        rentalStart: payload.rentalStart || new Date().toISOString(),
        rentalEnd: payload.rentalEnd || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        pricePerUnit: Number(payload.pricePerUnit ?? 0),
        name: payload.name || `Rental Item ${payload.productId}`,
        imageUrl: payload.imageUrl || fallbackImage,
        variant: payload.variant || 'Standard',
      };
      local.push(newItem);
    }
    localStorage.setItem('cart_items', JSON.stringify(local));
    window.dispatchEvent(new Event('cart-updated'));
    return normalizeCartItem(newItem);
  }
};

export const removeCartItem = async (id) => {
  try {
    const response = await api.delete(`/api/cart/${id}`);
    window.dispatchEvent(new Event('cart-updated'));
    return response.data;
  } catch (err) {
    console.warn('Backend cart API offline, removing item from localStorage fallback.');
    const local = JSON.parse(localStorage.getItem('cart_items') || '[]');
    const filtered = local.filter(i => String(i.id) !== String(id));
    localStorage.setItem('cart_items', JSON.stringify(filtered));
    window.dispatchEvent(new Event('cart-updated'));
    return { success: true };
  }
};

export default { getCart, addToCart, removeCartItem };
