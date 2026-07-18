import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowLeft, Home } from 'lucide-react';
import { getProductById } from '../../api/productApi';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { PATHS } from '../../routes/paths';

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const ProductDetails = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error('Failed to load product', error);
        setErrorMsg('Unable to load this product right now.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return <Loader message="Loading product details..." />;
  }

  if (errorMsg) {
    return <Alert severity="error">{errorMsg}</Alert>;
  }

  if (!product) {
    return <Alert severity="warning">Product not found.</Alert>;
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            component={RouterLink}
            to={PATHS.DASHBOARD}
            color="inherit"
            underline="hover"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}
          >
            <Home size={16} />
            Dashboard
          </Link>
          <Link component={RouterLink} to={PATHS.PRODUCTS} color="inherit" underline="hover">
            Products
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate(PATHS.PRODUCTS)}
        >
          Back to catalog
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              component="img"
              src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'}
              alt={product.name}
              sx={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 420 }}
            />
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                <Chip label={product.categoryName} color="primary" variant="outlined" />
                <Chip label={product.isActive ? 'Active' : 'Inactive'} color={product.isActive ? 'success' : 'default'} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                {product.name}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>
                {money.format(product.price)}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {product.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Product Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {product.categoryName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Stock Quantity
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {product.stockQuantity}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Availability
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {product.isActive ? 'Available for rental workflows' : 'Currently inactive'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {new Date(product.updatedAt).toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetails;