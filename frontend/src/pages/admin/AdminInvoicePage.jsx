import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, TextField, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Stack, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, ArrowLeft, Printer, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { getOrder } from '../../api/checkoutApi';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export const AdminInvoicePage = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  const [invoiceState, setInvoiceState] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        if (!invoiceId || invoiceId === 'new') {
          setInvoiceData({
            invoiceNumber: 'INV/2026/0001',
            customer: 'Sample Customer',
            invoiceAddress: 'Default Billing Address',
            deliveryAddress: 'Default Shipping Address',
            invoiceDate: new Date().toLocaleDateString(),
            items: [
              { name: 'Sample Rental Equipment', quantity: 1, unitPrice: 5000, taxes: 0.08, totalPrice: 5000 }
            ],
            subTotal: 5000,
            taxes: 400,
            totalAmount: 5400
          });
        } else {
          const order = await getOrder(invoiceId);
          if (isMounted && order) {
            const subtotal = order.subTotal || (order.totalAmount ? order.totalAmount * 0.8 : 0);
            const tax = Math.round(subtotal * 0.08);
            const total = order.totalAmount || (subtotal + tax);

            setInvoiceData({
              invoiceNumber: order.invoiceNumber || `INV-${order.orderNumber || order.id}`,
              orderNumber: order.orderNumber || order.id,
              customer: order.customer || 'Customer',
              invoiceAddress: 'Billing Address on File',
              deliveryAddress: 'Delivery Address on File',
              invoiceDate: order.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : new Date().toLocaleDateString(),
              pickupDate: order.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : '-',
              returnDate: order.returnDate ? new Date(order.returnDate).toLocaleDateString() : '-',
              items: order.items || [],
              subTotal: subtotal,
              taxes: tax,
              deposit: order.deposit || 0,
              totalAmount: total
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch invoice details', err);
        toast.error('Failed to load invoice details');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchInvoice();
    return () => { isMounted = false; };
  }, [invoiceId]);

  const handlePost = () => {
    setInvoiceState('posted');
    toast.success('Invoice Posted Successfully');
  };

  const handlePrint = () => {
    window.print();
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!invoiceData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Invoice not found.</Typography>
        <Button startIcon={<ArrowLeft size={16} />} sx={{ mt: 2 }} onClick={() => navigate('/dashboard/orders')}>
          Back to Orders
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', pb: 8, maxWidth: 1200, mx: 'auto', '@media print': { p: 0 } }}>

      {/* Top Header */}
      <Box sx={{ display: 'flex', alignitems: 'center', gap: 2, mb: 3, '@media print': { display: 'none' } }}>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate(-1)}
          sx={{ borderRadius: 2 }}
        >
          Back
        </Button>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Invoice Management</Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', overflow: 'hidden' }}>

        {/* Action Bar */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignitems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#1e293b', '@media print': { display: 'none' } }}>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {invoiceState === 'draft' ? (
              <>
                <Button variant="contained" startIcon={<Send size={16} />} sx={{ display: 'none', bgcolor: '#c084fc', '&:hover': { bgcolor: '#a855f7' } }} onClick={() => toast.success('Invoice Sent!')}>Send</Button>
                <Button variant="outlined" startIcon={<Printer size={16} />} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={handlePrint}>Print</Button>
                <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={handlePost}>Post</Button>
              </>
            ) : (
              <>
                <Button variant="contained" startIcon={<Send size={16} />} sx={{ display: 'none', bgcolor: '#c084fc', '&:hover': { bgcolor: '#a855f7' } }} onClick={() => toast.success('Invoice Sent!')}>Send</Button>
                <Button variant="outlined" startIcon={<Printer size={16} />} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={handlePrint}>Print</Button>
                <Button variant="outlined" sx={{ display: 'none', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => toast.success('Payment Received!')}>Register Payment</Button>
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex' }}>
            <StateArrow label="Draft" active={invoiceState === 'draft'} isFirst />
            <StateArrow label="Posted" active={invoiceState === 'posted'} isLast />
          </Box>

        </Box>

        <Box sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>{invoiceData.invoiceNumber}</Typography>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignitems: 'center' }}>
                  <Typography sx={{ width: 140, fontWeight: 600 }}>Customer</Typography>
                  <TextField size="small" fullWidth value={invoiceData.customer} disabled sx={{ bgcolor: 'background.default' }} />
                </Box>
                <Box sx={{ display: 'flex', alignitems: 'flex-start' }}>
                  <Typography sx={{ width: 140, fontWeight: 600, mt: 1 }}>Invoice Address</Typography>
                  <TextField size="small" fullWidth multiline rows={2} value={invoiceData.invoiceAddress} disabled sx={{ bgcolor: 'background.default' }} />
                </Box>
                <Box sx={{ display: 'flex', alignitems: 'flex-start' }}>
                  <Typography sx={{ width: 140, fontWeight: 600, mt: 1 }}>Delivery Address</Typography>
                  <TextField size="small" fullWidth multiline rows={2} value={invoiceData.deliveryAddress} disabled sx={{ bgcolor: 'background.default' }} />
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignitems: 'center' }}>
                  <Typography sx={{ width: 140, fontWeight: 600 }}>Invoice Date</Typography>
                  <TextField size="small" fullWidth value={invoiceData.invoiceDate} disabled sx={{ bgcolor: 'background.default' }} />
                </Box>
                {invoiceData.orderNumber && (
                  <Box sx={{ display: 'flex', alignitems: 'center' }}>
                    <Typography sx={{ width: 140, fontWeight: 600 }}>Order Ref</Typography>
                    <TextField size="small" fullWidth value={invoiceData.orderNumber} disabled sx={{ bgcolor: 'background.default' }} />
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>

          {/* Invoice Lines */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'inline-block', borderBottom: '2px solid', borderColor: 'primary.main', pb: 1, px: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Invoice Lines
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
                  <TableCell sx={{ fontWeight: 600 }}>Unit Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Taxes</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceData.items?.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>{item.name || item.productName || 'Rental Item'}</Typography>
                      {invoiceData.pickupDate && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          [{invoiceData.pickupDate} -&gt; {invoiceData.returnDate}]
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{item.quantity || 1}</TableCell>
                    <TableCell>{money.format(item.unitPrice || item.price || 0)}</TableCell>
                    <TableCell>8%</TableCell>
                    <TableCell align="right">{money.format(item.totalPrice || ((item.unitPrice || 0) * (item.quantity || 1)))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {/* Optional notes/terms */}
            </Box>
            <Box sx={{ width: 320 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Untaxed Subtotal:</Typography>
                <Typography sx={{ fontWeight: 500 }}>{money.format(invoiceData.subTotal || 0)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Taxes (8%):</Typography>
                <Typography sx={{ fontWeight: 500 }}>{money.format(invoiceData.taxes || 0)}</Typography>
              </Box>
              {invoiceData.deposit > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Security Deposit:</Typography>
                  <Typography sx={{ fontWeight: 500 }}>{money.format(invoiceData.deposit)}</Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total Amount:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>{money.format(invoiceData.totalAmount || 0)}</Typography>
              </Box>
            </Box>
          </Box>

        </Box>
      </Paper>
    </Box>
  );
};

export default AdminInvoicePage;
