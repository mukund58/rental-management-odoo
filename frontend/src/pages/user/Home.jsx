import React, { useState } from 'react';
import { Box, Grid, Container, Paper, Typography, Pagination, Stack } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/user/Navbar';
import SidebarFilters from '../../components/user/SidebarFilters';
import ProductGrid from '../../components/user/ProductGrid';
import { products } from '../../data/products';

export const Home = () => {
  const { user, logout } = useAuth();
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');
  const [priceRange, setPriceRange] = useState([0, 250000]);

  // Local Filtering Logic
  const filteredProducts = products.filter((prod) => {
    // Search match
    if (searchQuery && !prod.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Brand match
    if (selectedBrands.length > 0 && !selectedBrands.includes(prod.brand)) {
      return false;
    }
    // Color match
    if (selectedColor && (!prod.colors || !prod.colors.includes(selectedColor))) {
      return false;
    }
    // Duration match
    if (selectedDuration !== 'All Durations' && prod.duration !== selectedDuration) {
      return false;
    }
    // Price match
    if (prod.price < priceRange[0] || prod.price > priceRange[1]) {
      return false;
    }
    return true;
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Top Navbar */}
      <Navbar onSearchChange={setSearchQuery} user={user} onLogout={logout} />

      {/* Main Content Layout */}
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, flexGrow: 1 }}>
        <Grid container spacing={4}>
          {/* Left Sidebar Filter Section */}
          <Grid item xs={12} md={3} lg={2.5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                position: { md: 'sticky' },
                top: '90px',
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

          {/* Right Product Grid Section */}
          <Grid item xs={12} md={9} lg={9.5}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Product Listing Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Explore Rental Products
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Showing {filteredProducts.length} items
                </Typography>
              </Box>

              {/* Responsive Product Grid */}
              <ProductGrid products={filteredProducts} />

              {/* Bottom Pagination matching the Wireframe */}
              {filteredProducts.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Stack spacing={2}>
                    <Pagination
                      count={2}
                      variant="outlined"
                      shape="rounded"
                      color="primary"
                      size="large"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: 'divider',
                          fontWeight: 600,
                          backgroundColor: 'background.paper',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            border: 'none',
                          }
                        }
                      }}
                    />
                  </Stack>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
