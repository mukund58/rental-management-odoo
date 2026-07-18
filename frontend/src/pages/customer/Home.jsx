import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Drawer,
  Alert,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import SidebarFilters from '../../components/product/SidebarFilters';
import ProductGrid from '../../components/product/ProductGrid';
import Pagination from '../../components/common/Pagination';

import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { getProducts } from '../../api/productApi';


import { getCart } from '../../api/cartApi';


export const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');


  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');
  const [priceRange, setPriceRange] = useState([0, 100000]);

  // Mobile Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Cart Badge Counter (incremented upon Add To Cart click)
  const [cartCount, setCartCount] = useState(0);


  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        const productData = await getProducts();
        if (productData && (productData.items || productData.length > 0)) {
          setProducts(productData.items || productData);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to load products from backend', err);
        setProducts([]);
        setErrorMsg('Failed to fetch products from the server.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cartItems = await getCart();
        setCartCount(cartItems.length);
      } catch (err) {
        console.warn('Could not fetch cart count:', err);
      }
    };
    fetchCartCount();
  }, []);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      // Clear localStorage explicitly & redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    }
  };

  // Filter Logic (Instantly applied locally)

  const filteredProducts = products.filter((prod) => {

    // 1. Search filter (Product Name, Category, Description)
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = prod.name?.toLowerCase().includes(q);
      const categoryMatch = prod.category?.toLowerCase().includes(q);
      const descMatch = prod.description?.toLowerCase().includes(q);
      if (!nameMatch && !categoryMatch && !descMatch) {
        return false;
      }
    }

    // 2. Brand filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(prod.brand)) {
      return false;
    }

    // 3. Color filter
    if (selectedColor && !((prod.variantColors || []).map((c) => c.toLowerCase()).includes(selectedColor.toLowerCase()))) {
      return false;
    }

    // 4. Rental Duration filter
    if (selectedDuration !== 'All Durations' && prod.duration !== selectedDuration) {
      return false;
    }

    // 5. Price filter
    if (prod.price < priceRange[0] || prod.price > priceRange[1]) {
      return false;
    }

    return true;
  });

  // Local Pagination Logic (9 products per page)
  const itemsPerPage = 9;
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Safe page adjustment when results filter down
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Whenever filters change, reset back to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBrands, selectedColor, selectedDuration, priceRange]);

  useEffect(() => {
    if (location.search.includes('openFilters=1')) {
      setDrawerOpen(true);
    }
  }, [location.search]);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    if (location.search.includes('openFilters=1')) {
      navigate({ pathname: PATHS.ROOT, search: '' }, { replace: true });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      {/* Fixed Top Navigation Bar */}
      <Navbar
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        onLogout={handleLogout}
      />

      {/* Main Content Layout */}
      <Container
        maxWidth="xl"
        sx={{
          pt: '94px', // 70px navbar height + vertical padding
          pb: 6,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ flexGrow: 1, alignItems: 'flex-start' }}>
          {/* Permanent Left Sidebar (Width 260px desktop only) */}
          <Grid
            size={{ xs: 12, md: 4, lg: 3, xl: 3 }}
            sx={{
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                width: '100%',
                boxSizing: 'border-box',
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                position: 'sticky',
                top: '94px',
                maxHeight: 'calc(100vh - 110px)',
                overflow: 'auto',
              }}
            >
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
            </Paper>
          </Grid>

          {/* Scrollable Product Grid */}

          <Grid size={{ xs: 12, md: 8, lg: 9, xl: 9 }} sx={{ minWidth: 0 }}>

            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
              
              {/* Product Listing Header */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1.5, mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>
                  Explore Rental Products
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  Showing {paginatedProducts.length} of {totalItems} items
                </Typography>
              </Box>


              {errorMsg && (
                <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{errorMsg}</Typography>
                </Box>
              )}

              {loading ? (
                <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Loading live products...</Typography>
                </Box>
              ) : paginatedProducts.length === 0 ? (

                <Box
                  sx={{
                    py: 12,
                    textAlign: 'center',
                    bgcolor: '#f8fafc',
                    borderRadius: '16px',
                    border: '1px dashed',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                    No Products Match Your Filters
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', fontWeight: 500 }}>
                    Try resetting your checkboxes or price slider.
                  </Typography>
                </Box>
              ) : (
                <>
                  {/* Grid Listing */}
                  <ProductGrid
                    products={paginatedProducts}
                    onAddToCartSuccess={handleAddToCart}
                  />

                  {/* Pagination Footer (Bottom Center) */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', pt: 4 }}>
                    <Pagination
                      page={activePage}
                      count={totalPages}
                      onChange={(e, p) => setCurrentPage(p)}
                    />
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Drawer Filters for Mobile/Tablet viewports */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            p: 3,
            width: { xs: 290, sm: 320 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          },
        }}
      >
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
      </Drawer>
    </Box>
  );
};

export default Home;
