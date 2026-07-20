import React from 'react';
import ProductCard from './ProductCard';

export const ProductGrid = ({ products = [] }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
        <p className="text-lg font-semibold text-muted-foreground">No products match your filters.</p>
        <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or sidebar filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
