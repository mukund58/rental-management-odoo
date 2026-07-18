import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, TextField, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Stack } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, updateOrderStatus } from '../../api/checkoutApi';
import OrderStatusBar from '../../components/admin/orders/OrderStatusBar';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await getOrder(orderId);
      setOrder(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrder(); // refresh
    } catch (error) {
      console.error('Update status failed', error);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (!order) return <Typography>Order not found</Typography>;

  return (
    <Box sx={{ width: '100%', pb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Rental Order</Typography>
        {/* Placeholder save/discard icons as shown in wireframe */}
        <Button variant="contained" color="success" size="small" sx={{ minWidth: 0, px: 1 }}>✓</Button>
        <Button variant="contained" color="error" size="small" sx={{ minWidth: 0, px: 1 }}>✗</Button>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <OrderStatusBar status={order.status} onUpdateStatus={handleUpdateStatus} />
        
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>{order.orderNumber}</Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 140, fontWeight: 600 }}>Customer</Typography>
                <TextField size="small" fullWidth value={order.customer} disabled />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 140, fontWeight: 600 }}>Invoice Address</Typography>
                <TextField size="small" fullWidth value="-" disabled />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 140, fontWeight: 600 }}>Delivery Address</Typography>
                <TextField size="small" fullWidth value="-" disabled />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 140, fontWeight: 600 }}>Rental Period</Typography>
                <Box sx={{ display: 'flex', gap: 2, flex: 1, alignItems: 'center' }}>
                  <TextField size="small" fullWidth value={order.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : ''} disabled />
                  <Typography>→</Typography>
                  <TextField size="small" fullWidth value={order.returnDate ? new Date(order.returnDate).toLocaleDateString() : ''} disabled />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 140, fontWeight: 600 }}>Price List</Typography>
                <TextField size="small" fullWidth value="Default" disabled />
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Order Lines */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, borderBottom: '2px solid', borderColor: 'primary.main', display: 'inline-block' }}>
          Order Line
        </Typography>

        <TableContainer sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Unit Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Taxes</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items?.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    {item.name}
                    <Typography variant="caption" display="block" color="text.secondary">
                      [{new Date(order.pickupDate).toLocaleDateString()} -&gt; {new Date(order.returnDate).toLocaleDateString()}]
                    </Typography>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>Units</TableCell>
                  <TableCell>{money.format(item.unitPrice)}</TableCell>
                  <TableCell>10%</TableCell>
                  <TableCell align="right">{money.format(item.totalPrice)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography color="primary" sx={{ cursor: 'pointer', fontWeight: 600 }}>Add a Product</Typography>
            <Typography color="primary" sx={{ cursor: 'pointer', fontWeight: 600 }}>Add a note</Typography>
          </Box>
          <Box sx={{ width: 300 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Untaxed Amount:</Typography>
              <Typography>{money.format(order.totalAmount * 0.9)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Taxes :</Typography>
              <Typography>{money.format(order.totalAmount * 0.1)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Total:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{money.format(order.totalAmount)}</Typography>
            </Box>
          </Box>
        </Box>

      </Paper>
    </Box>
  );
};

export default OrderDetailPage;
