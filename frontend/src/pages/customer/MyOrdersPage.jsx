import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Chip, Container, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PackageOpen } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { customerMockOrders } from '../../data/customerMocks';

import { getOrders } from '../../api/checkoutApi';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const filterByTab = (orders, tab) => {
  if (tab === 'upcoming') return orders.filter((order) => order.status === 'Upcoming' || order.status === 0 || order.status === 'Reserved');
  if (tab === 'completed') return orders.filter((order) => order.status === 'Completed' || order.status === 3 || order.status === 'Returned');
  if (tab === 'cancelled') return orders.filter((order) => order.status === 'Cancelled' || order.status === 4);
  return orders;
};

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tab, setTab] = useState('all');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        const backendOrders = await getOrders();
        if (isMounted && backendOrders) {
          const formattedOrders = backendOrders.map((order) => {
            const rentalStart = order.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : '';
            const rentalEnd = order.returnDate ? new Date(order.returnDate).toLocaleDateString() : '';
            
            // Map numeric status back to string if needed, depending on enum serialization
            let statusString = order.status;
            if (typeof order.status === 'number') {
               const statuses = ['Reserved', 'Active', 'Overdue', 'Returned', 'Cancelled'];
               statusString = statuses[order.status] || 'Unknown';
            }

            return {
              id: order.id,
              orderNumber: order.orderNumber || order.id,
              status: statusString,
              statusKey: String(statusString).toLowerCase(),
              itemName: order.items?.map(i => i.name).join(', ') || 'Rental Items',
              rentalDuration: `${rentalStart} to ${rentalEnd}`,
              deliveryDate: rentalStart,
              total: order.totalAmount,
            };
          });
          setOrders(formattedOrders);
        }
      } catch (err) {
        console.error('Failed to fetch backend orders:', err);
      }
    };
    fetchOrders();
    return () => { isMounted = false; };
  }, []);

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error(err); } finally { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login', { replace: true }); }
  };

  const filteredOrders = filterByTab(orders, tab);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Navbar onSearchChange={() => {}} cartCount={0} onLogout={handleLogout} />
      <Container maxWidth="xl" sx={{ pt: '94px', pb: 8 }}>
        <Button variant="outlined" startIcon={<ArrowLeft size={16} />} onClick={() => navigate(PATHS.PRODUCTS)} sx={{ mb: 3, borderRadius: 999, px: 2.25, py: 0.9 }}>
          Back to products
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>My Orders</Typography>

        <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
              <Tab label="All" value="all" />
              <Tab label="Upcoming" value="upcoming" />
              <Tab label="Completed" value="completed" />
              <Tab label="Cancelled" value="cancelled" />
            </Tabs>
          </CardContent>
        </Card>

        <Grid container spacing={2.5}>
          {filteredOrders.map((order) => (
            <Grid size={{ xs: 12, md: 6 }} key={order.id}>
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{order.orderNumber}</Typography>
                    <Chip label={order.status} color={order.status === 'Completed' ? 'success' : order.status === 'Cancelled' ? 'error' : 'info'} size="small" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {order.itemName} • {order.rentalDuration}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Delivery: {order.deliveryDate}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: 800 }}>{money.format(order.total)}</Typography>
                    <Button variant="outlined" size="small" sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}>View details</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredOrders.length === 0 && (
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mt: 3 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
              <PackageOpen size={48} color="#64748b" />
              <Typography variant="h6" sx={{ fontWeight: 800, mt: 1.5 }}>No orders in this view</Typography>
              <Typography variant="body2" color="text.secondary">Try another tab or place your first order.</Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default MyOrdersPage;
