import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/user/Navbar';
import SidebarFilters from '../../components/user/SidebarFilters';
import ProductGrid from '../../components/user/ProductGrid';
import { products } from '../../data/products';

export const Home = () => {
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');
  const [priceRange, setPriceRange] = useState([0, 250000]);

  const filteredProducts = products.filter((prod) => {
    if (searchQuery && !prod.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(prod.brand)) return false;
    if (selectedColor && (!prod.colors || !prod.colors.includes(selectedColor))) return false;
    if (selectedDuration !== 'All Durations' && prod.duration !== selectedDuration) return false;
    if (prod.price < priceRange[0] || prod.price > priceRange[1]) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar onSearchChange={setSearchQuery} user={user} onLogout={logout} />

      <div className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <div className="flex gap-6">
          {/* ── Sidebar ── */}
          <aside className="hidden w-56 shrink-0 md:block lg:w-64">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <SidebarFilters
                selectedBrands={selectedBrands}
                onBrandChange={setSelectedBrands}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                selectedDuration={selectedDuration}
                onDurationChange={setSelectedDuration}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
              />
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                Explore Rental Products
              </h1>
              <span className="text-sm font-medium text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} items
              </span>
            </div>

            {/* Grid */}
            <ProductGrid products={filteredProducts} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
