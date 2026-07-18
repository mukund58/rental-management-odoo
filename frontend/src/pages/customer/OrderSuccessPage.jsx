import React from 'react';
import { Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error(err); } finally { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login', { replace: true }); }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Navbar onSearchChange={() => {}} cartCount={0} onLogout={handleLogout} />
      <Container maxWidth="md" sx={{ pt: '94px', pb: 8 }}>
        <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', textAlign: 'center' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CheckCircle2 size={72} color="#16a34a" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Order placed successfully!</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>Your rental order has been confirmed. We will send the receipt and delivery details to your email shortly.</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
              <Button variant="contained" endIcon={<ArrowRight size={16} />} onClick={() => navigate('/orders')} sx={{ borderRadius: 999, px: 2.5, py: 1, textTransform: 'none', fontWeight: 700 }}>
                View my orders
              </Button>
              <Button variant="outlined" onClick={() => navigate('/products')} sx={{ borderRadius: 999, px: 2.5, py: 1, textTransform: 'none', fontWeight: 700 }}>
                Continue shopping
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default OrderSuccessPage;
