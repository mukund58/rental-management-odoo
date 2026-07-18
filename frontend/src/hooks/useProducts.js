import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';

const BRANDS = ['Apple', 'Dell', 'HP', 'Sony', 'Canon', 'Lenovo']; // TODO Replace with backend API
const COLORS = [
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Black', hex: '#000000' },
  { name: 'Gray', hex: '#6b7280' }
]; // TODO Backend Color API
const DURATIONS = ['1 Month', '6 Months', '1 Year', '2 Years', '3 Years']; // TODO Backend Duration API

export const useProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');
  const [priceRange, setPriceRange] = useState([0, 100000]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await productService.getProducts();
      // Process raw backend response and assign temporary frontend values where needed
      const processed = (data || [])
        .filter((prod) => prod.isActive !== false)
        .map((prod, index) => {
          // TODO Replace brand assignment when brand backend API is available
          const brand = BRANDS[index % BRANDS.length];
          // TODO Backend Color API replacement
          const assignedColors = [
            COLORS[index % COLORS.length].name,
            COLORS[(index + 2) % COLORS.length].name,
          ];
          // TODO Backend Duration API replacement
          const duration = DURATIONS[index % DURATIONS.length];

          return {
            ...prod,
            brand,
            colors: assignedColors,
            duration,
          };
        });
      setAllProducts(processed);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Local Filtering Logic
  const filteredProducts = allProducts.filter((prod) => {
    // 1. Search Query Match (Name, CategoryName, Description)
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      const nameMatch = prod.name?.toLowerCase().includes(query);
      const categoryMatch = prod.categoryName?.toLowerCase().includes(query);
      const descMatch = prod.description?.toLowerCase().includes(query);

      if (!nameMatch && !categoryMatch && !descMatch) {
        return false;
      }
    }

    // 2. Brand Match
    if (selectedBrands.length > 0 && !selectedBrands.includes(prod.brand)) {
      return false;
    }

    // 3. Color Match
    if (selectedColor && !prod.colors.includes(selectedColor)) {
      return false;
    }

    // 4. Duration Match
    if (selectedDuration !== 'All Durations' && prod.duration !== selectedDuration) {
      return false;
    }

    // 5. Price Match
    if (prod.price < priceRange[0] || prod.price > priceRange[1]) {
      return false;
    }

    return true;
  });

  // Local Pagination Logic (9 products per page)
  const itemsPerPage = 9;
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Safe Page Adjustment
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Whenever filters change, reset pagination to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBrands, selectedColor, selectedDuration, priceRange]);

  return {
    products: paginatedProducts,
    allProducts,
    loading,
    error,
    fetchProducts,
    // Filter State & Setters
    searchQuery,
    setSearchQuery,
    selectedBrands,
    setSelectedBrands,
    selectedColor,
    setSelectedColor,
    selectedDuration,
    setSelectedDuration,
    priceRange,
    setPriceRange,
    // Pagination State & Setters
    currentPage: activePage,
    setCurrentPage,
    totalPages,
    totalItems,
  };
};

export default useProducts;
