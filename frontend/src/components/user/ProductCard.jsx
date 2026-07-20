import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, ShoppingBag } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    /* NOTE: `group` must be on the outermost element so group-hover: works */
    <div className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/30">

      {/* ── Image ── */}
      <div className="relative overflow-hidden bg-muted" style={{ paddingTop: '72%' }}>
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/25" />

        {/* Quick-action buttons (appear on hover) */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full flex-col items-center gap-2 p-3 transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={handleDetailsClick}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Eye className="h-4 w-4" />
            Quick View
          </button>
        </div>

        {/* Availability badge */}
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-md backdrop-blur-sm ${
            product.available
              ? 'bg-emerald-500 text-white'
              : 'bg-rose-500 text-white'
          }`}
        >
          {product.available ? 'Available' : 'Out of Stock'}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-grow flex-col gap-2 p-4">
        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5">
            {product.colors.map((colorHex, idx) => (
              <span
                key={idx}
                title={colorHex}
                className="h-3 w-3 rounded-full border border-black/10 shadow-sm"
                style={{ backgroundColor: colorHex }}
              />
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-card-foreground transition-colors duration-200 group-hover:text-primary">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-1 pt-2">
          <span className="text-xl font-extrabold text-primary">
            ₹{product.rentalPrice}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            /{product.rentalUnit}
          </span>
        </div>
      </div>

      {/* ── CTA Footer ── */}
      <div className="flex gap-2 border-t border-border p-3">
        <button
          onClick={handleDetailsClick}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-primary/20 bg-transparent py-2 text-sm font-semibold text-primary transition-all duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          View
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
        <button
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-95"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Add To
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
