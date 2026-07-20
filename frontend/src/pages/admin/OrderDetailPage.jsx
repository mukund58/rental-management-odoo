import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, TextField, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, IconButton, Stack } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { PATHS } from '../../routes/paths';
import toast from 'react-hot-toast';
import { getOrder, updateOrderStatus } from '../../api/checkoutApi';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [orderState, setOrderState] = useState('quotation');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId === 'new') return;
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getOrder(orderId);
        setOrder(data);
        if (data.status >= 1) setOrderState('sale_order');
      } catch (error) {
        toast.error('Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [orderId]);

  const handleUpdateStatus = async (statusId, label) => {
    if (orderId === 'new') return;
    try {
      await updateOrderStatus(orderId, statusId);
      toast.success(label);
      setOrder(prev => ({ ...prev, status: statusId }));
      if (statusId === 1) setOrderState('sale_order');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleConfirm = () => handleUpdateStatus(1, 'Order Confirmed (Reserved)');
  const handlePickup = () => handleUpdateStatus(2, 'Items Picked Up!');
  const handleCancel = () => handleUpdateStatus(4, 'Order Cancelled');

  const handleSend = () => setOrderState('quotation_sent');

  const handleCreateInvoice = () => {
    navigate(PATHS.ADMIN_INVOICE.replace(':invoiceId', orderId));
  };

  // UI Helpers for State Bar
  const StateArrow = ({ label, active, isFirst, isLast }) => {
    return (
      <Box
        sx={{
          bgcolor: active ? 'primary.main' : 'transparent',
          color: active ? 'white' : 'text.secondary',
          px: 3,
          py: 0.75,
          border: '1px solid',
          borderColor: active ? 'primary.main' : 'divider',
          fontWeight: 600,
          position: 'relative',
          display: 'flex',
          alignitems: 'center',
          justifyContent: 'center',
          borderRadius: isFirst ? '20px 0 0 20px' : isLast ? '0 20px 20px 0' : 0,
          borderLeft: isFirst ? '' : 'none',
          cursor: 'default',
        }}
      >
        {label}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', pb: 8, maxWidth: 1200, mx: 'auto' }}>

      {/* Top Header */}
      <Box sx={{ display: 'flex', alignitems: 'center', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          sx={{ bgcolor: '#c084fc', '&:hover': { bgcolor: '#a855f7' }, borderRadius: 2 }}
          onClick={() => {
            navigate('/dashboard/orders/new');
            setOrderState('quotation');
          }}
        >
          New
        </Button>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Rental order</Typography>
        <IconButton size="small" color="success" sx={{ border: '1px solid', borderRadius: 1 }}><Check size={16} /></IconButton>
        <IconButton size="small" color="error" sx={{ border: '1px solid', borderRadius: 1 }}><X size={16} /></IconButton>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', overflow: 'hidden' }}>

        {/* Action Bar */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignitems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#1e293b' }}>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {orderState === 'quotation' || orderState === 'quotation_sent' ? (
              <>
                <Button variant="contained" sx={{ bgcolor: '#c084fc', '&:hover': { bgcolor: '#a855f7' } }} onClick={handleSend}>Send</Button>
                <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={handleConfirm}>Confirm</Button>
                <Button variant="outlined" sx={{ display: 'none', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => toast.success('Printing quotation...')}>Print</Button>
              </>
            ) : (
              <>
                <Button variant="contained" sx={{ bgcolor: '#c084fc', '&:hover': { bgcolor: '#a855f7' } }} onClick={handleCreateInvoice}>Create Invoice</Button>
                {order?.status === 1 && (
                  <Button variant="contained" sx={{ bgcolor: '#c084fc', '&:hover': { bgcolor: '#a855f7' } }} onClick={handlePickup}>Pickup</Button>
                )}
                <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => window.open(`/invoice/${orderId}`, '_blank')}>Print</Button>
                {order?.status !== 4 && order?.status !== 3 && (
                  <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={handleCancel}>Cancel</Button>
                )}
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex' }}>
            <StateArrow label="Quotation" active={orderState === 'quotation'} isFirst />
            <StateArrow label="Quotation Sent" active={orderState === 'quotation_sent'} />
            <StateArrow label="Sale Order" active={orderState === 'sale_order'} isLast />
          </Box>

        </Box>

        <Box sx={{ p: 4 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
          ) : !order && orderId !== 'new' ? (
            <Typography>Order not found</Typography>
          ) : (
            <>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>{order?.orderNumber || 'New Order'}</Typography>

              <Grid container spacing={4} sx={{ mb: 6 }}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignitems: 'center' }}>
                      <Typography sx={{ width: 140, fontWeight: 600 }}>Customer</Typography>
                      <TextField size="small" fullWidth value={order?.customer || ''} disabled sx={{ bgcolor: 'background.default' }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignitems: 'flex-start' }}>
                      <Typography sx={{ width: 140, fontWeight: 600, mt: 1 }}>Invoice Address</Typography>
                      <TextField size="small" fullWidth multiline rows={2} value={order?.invoiceAddress || 'N/A'} disabled sx={{ bgcolor: 'background.default' }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignitems: 'flex-start' }}>
                      <Typography sx={{ width: 140, fontWeight: 600, mt: 1 }}>Delivery Address</Typography>
                      <TextField size="small" fullWidth multiline rows={2} value={order?.deliveryAddress || 'N/A'} disabled sx={{ bgcolor: 'background.default' }} />
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignitems: 'center' }}>
                      <Typography sx={{ width: 140, fontWeight: 600 }}>Rental Period</Typography>
                      <Box sx={{ display: 'flex', gap: 2, flex: 1, alignitems: 'center' }}>
                        <TextField size="small" fullWidth value={order?.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : ''} disabled sx={{ bgcolor: 'background.default' }} />
                        <Typography>→</Typography>
                        <TextField size="small" fullWidth value={order?.returnDate ? new Date(order.returnDate).toLocaleDateString() : ''} disabled sx={{ bgcolor: 'background.default' }} />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignitems: 'center' }}>
                      <Typography sx={{ width: 140, fontWeight: 600 }}>Price List</Typography>
                      <TextField size="small" fullWidth value={'Default'} disabled sx={{ bgcolor: 'background.default' }} />
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              {/* Order Lines */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'inline-block', borderBottom: '2px solid', borderColor: 'primary.main', pb: 1, px: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Order Line
                  </Typography>
                </Box>
                <Divider />
              </Box>

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
                    {order?.items?.map((item, idx) => (
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
                        <TableCell>8%</TableCell>
                        <TableCell align="right">{money.format(item.totalPrice)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Typography sx={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>Add a Product</Typography>
                  <Typography sx={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>Add a note</Typography>
                </Box>
                <Box sx={{ width: 300 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Untaxed Amount:</Typography>
                    <Typography sx={{ fontWeight: 500 }}>{money.format(order?.subTotal || 0)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Deposit :</Typography>
                    <Typography sx={{ fontWeight: 500 }}>{money.format(order?.deposit || 0)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Total:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{money.format(order?.totalAmount || 0)}</Typography>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderDetailPage;
