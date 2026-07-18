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
          item
          xs={12}      // Mobile (1 Column)
          sm={6}       // Tablet (2 Columns)
          md={4}       // Laptop (3 Columns)
          lg={3}       // Desktop (4 Columns)
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
