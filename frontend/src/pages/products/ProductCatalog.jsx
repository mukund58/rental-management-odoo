import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants/env';
import { Search, SlidersHorizontal, ArrowRight, AlertCircle, Tag, Package, Sparkles, X } from 'lucide-react';
import { getCategories } from '../../api/authApi';
import { getProducts } from '../../api/productApi';
import { PATHS } from '../../routes/paths';

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm animate-pulse">
      <div className="h-52 w-full bg-muted" />
      <div className="flex flex-grow flex-col gap-3 p-5">
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full bg-muted" />
          <div className="h-5 w-14 rounded-full bg-muted" />
        </div>
        <div className="h-6 w-3/4 rounded-lg bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="mt-auto flex items-center justify-between">
          <div className="h-7 w-24 rounded bg-muted" />
          <div className="h-5 w-16 rounded bg-muted" />
        </div>
      </div>
      <div className="border-t p-4">
        <div className="h-10 w-full rounded-xl bg-muted" />
      </div>
    </div>
  );
}

export const ProductCatalog = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productData);
        setCategories(categoryData);
      } catch (error) {
        console.error('Failed to load products', error);
        setErrorMsg('Unable to load products right now.');
      } finally {
        setLoading(false);
      }
    };
    loadCatalog();
  }, []);

  const filteredProducts = [...products]
    .filter((product) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.categoryName.toLowerCase().includes(query);
      const matchesCategory = categoryId === 'all' || product.categoryId === categoryId;
      return matchesSearch && matchesCategory;
    })
    .sort((left, right) => {
      if (sortBy === 'price-asc') return left.price - right.price;
      if (sortBy === 'price-desc') return right.price - left.price;
      if (sortBy === 'stock-desc') return right.stockQuantity - left.stockQuantity;
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });

  const hasActiveFilters = searchTerm || categoryId !== 'all';

  function getProductImage(product) {
    const src = product.imageUrl;
    if (!src) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80';
    if (src.startsWith('/')) return `${API_URL.replace('/api', '')}${src}`;
    return src;
  }

  return (
    <div className="w-full space-y-8">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 text-white shadow-2xl md:p-12">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            Rental Catalog
          </div>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight md:text-5xl">
            Rent anything, anywhere
          </h1>
          <p className="max-w-xl text-base text-indigo-100 md:text-lg">
            Browse our curated catalog of premium rental products. Filter by category, price, or availability.
          </p>

          {/* Stats row */}
          <div className="mt-6 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-indigo-200" />
              <span className="text-sm font-semibold">{products.length} Products</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-indigo-200" />
              <span className="text-sm font-semibold">{categories.length} Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {errorMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow"
            placeholder="Search products, categories…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category */}
        <select
          className="h-11 rounded-xl border border-input bg-background px-4 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:w-52 transition-shadow"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="h-11 rounded-xl border border-input bg-background px-4 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:w-48 transition-shadow"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="stock-desc">Best Stocked</option>
        </select>
      </div>

      {/* ── Results Toolbar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">
            {loading ? '…' : `${filteredProducts.length}`}
            <span className="font-normal text-muted-foreground"> products found</span>
          </span>
          {hasActiveFilters && (
            <button
              onClick={() => { setSearchTerm(''); setCategoryId('all'); }}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters update live
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              image={getProductImage(product)}
              onViewDetails={() => navigate(PATHS.PRODUCT_DETAILS.replace(':productId', product.id))}
            />
          ))}
      </div>

      {/* ── Empty State ── */}
      {!loading && !filteredProducts.length && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-8 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-bold tracking-tight">No products found</h3>
          <p className="mb-6 max-w-xs text-sm text-muted-foreground">
            Try adjusting your search or clearing the category filter to see more results.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setCategoryId('all'); }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

/* ────────────────────────── Product Card ────────────────────────── */
function ProductCard({ product, image, onViewDetails }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={product.name}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Stock badge */}
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur-sm ${
            product.isActive
              ? 'bg-emerald-500/90 text-white'
              : 'bg-slate-800/80 text-slate-200'
          }`}
        >
          {product.isActive ? '● Active' : '○ Inactive'}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-grow flex-col p-5 gap-3">
        {/* Category badge */}
        <span className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {product.categoryName}
        </span>

        {/* Name */}
        <h3 className="text-base font-bold leading-snug tracking-tight line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price + Stock */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-xl font-extrabold text-foreground">
              {money.format(product.price)}
            </p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
          <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            {product.stockQuantity} in stock
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t p-4">
        <button
          onClick={onViewDetails}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          View Details
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

export default ProductCatalog;