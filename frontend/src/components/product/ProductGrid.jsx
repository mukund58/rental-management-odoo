import React from 'react';
import { Grid, Box } from '@mui/material';
import ProductCard from './ProductCard';

/**
 * Responsive ProductGrid component
 * @param {Object} props
 * @param {Array<Object>} props.products - List of products to display
 * @param {Function} props.onAddToCartSuccess - Callback triggered when item is added to cart
 */
export const ProductGrid = ({ products, onAddToCartSuccess }) => {
  return (
    <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'stretch' }}>
      {products.map((product) => (
        <Grid
          size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          key={product.id}
          sx={{ display: 'flex' }}
        >
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <ProductCard product={product} onAddToCartSuccess={onAddToCartSuccess} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
