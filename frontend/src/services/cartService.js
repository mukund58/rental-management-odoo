import api from './api';

/**
 * Fetch all cart items from the backend API
 * @returns {Promise<Array>} List of cart items
 */
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

/**
 * Add a product to the cart
 * @param {string} productId - ID of the product
 * @param {number} price - Rental price of the product
 * @returns {Promise<Object>} The added cart item details
 */
export const addToCart = async (productId, price) => {
  const payload = {
    productId,
    quantity: 1,
    rentalStart: new Date().toISOString(),
    rentalEnd: new Date().toISOString(),
    pricePerUnit: price,
  };
  const response = await api.post('/cart/add', payload);
  return response.data;
};

/**
 * Remove an item from the cart
 * @param {string} id - The ID of the cart item to delete
 * @returns {Promise<void>}
 */
export const removeCart = async (id) => {
  const response = await api.delete(`/cart/${id}`);
  return response.data;
};

export default {
  getCart,
  addToCart,
  removeCart,
};
