import api from './axios';

const normalizeProduct = (product) => {
  const imageCandidates = [product?.imageUrl, product?.image, product?.images?.[0]].filter(Boolean);
  const imageUrl = imageCandidates[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80';
  const images = Array.isArray(product?.images) && product.images.length > 0
    ? product.images.filter(Boolean)
    : [imageUrl];

  return {
    id: product?.id,
    name: product?.name || 'Untitled Product',
    description: product?.description || 'No description available.',
    price: Number(product?.price ?? 0),
    imageUrl,
    images,
    categoryName: product?.categoryName || product?.category || 'General',
    category: product?.categoryName || product?.category || 'General',
    stockQuantity: Number(product?.stockQuantity ?? 1),
    isActive: product?.isActive ?? product?.available ?? true,
    available: product?.available ?? product?.isActive ?? true,
    variantColors: Array.isArray(product?.variantColors) ? product.variantColors : [],
    brand: product?.brand || 'Premium Brand',
    duration: product?.duration || '1 Day',
    specifications: product?.specifications || [],
  };
};

export const getProducts = async () => {
  const response = await api.get('/api/products');
  return (response.data || []).map(normalizeProduct);
};

export const getProductById = async (productId) => {
  const response = await api.get(`/api/products/${productId}`);
  return normalizeProduct(response.data);
};

export const createProduct = async (payload) => {
  const response = await api.post('/api/products', payload);
  return response.data;
};

export const updateProduct = async (productId, payload) => {
  const response = await api.put(`/api/products/${productId}`, payload);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/api/products/${productId}`);
  return response.data;
};