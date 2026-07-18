import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { getCategories } from '../../api/authApi';
import { getProducts } from '../../api/productApi';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { PATHS } from '../../routes/paths';

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const ProductCatalog = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

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

  if (loading) {
    return <Loader message="Loading product catalog..." />;
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.96) 100%)',
          color: '#fff',
          border: '1px solid rgba(148,163,184,0.2)',
          boxShadow: '0 24px 80px rgba(15,23,42,0.25)',
        }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.75 }}>
          Product Module
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 1, letterSpacing: '-0.04em' }}>
          Browse, search, and filter the catalog
        </Typography>
        <Typography sx={{ maxWidth: 720, color: 'rgba(226,232,240,0.82)' }}>
          A seeded catalog with categories, product cards, and detail views for the rental product phase.
        </Typography>
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products, categories, descriptions"
            label="Search"
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8, color: '#64748b' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            select
            label="Category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <MenuItem value="all">All categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            select
            label="Sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="price-asc">Price: low to high</MenuItem>
            <MenuItem value="price-desc">Price: high to low</MenuItem>
            <MenuItem value="stock-desc">Highest stock</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {filteredProducts.length} products found
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
          <SlidersHorizontal size={16} />
          <Typography variant="body2">Filters update instantly</Typography>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} lg={4} key={product.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 12px 40px rgba(15, 23, 42, 0.06)',
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap' }}>
                  <Chip label={product.categoryName} size="small" color="primary" variant="outlined" />
                  <Chip
                    label={product.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={product.isActive ? 'success' : 'default'}
                  />
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.75, lineHeight: 1.25 }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 48 }}>
                  {product.description}
                </Typography>
                <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {money.format(product.price)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock: {product.stockQuantity}
                  </Typography>
                </Stack>
              </CardContent>
              <Divider />
              <CardActions sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowRight size={16} />}
                  onClick={() => navigate(PATHS.PRODUCT_DETAILS.replace(':productId', product.id))}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!filteredProducts.length && (
        <Box
          sx={{
            mt: 4,
            py: 8,
            px: 3,
            borderRadius: 4,
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No products match your filters
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try a broader search or clear the category filter.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductCatalog;