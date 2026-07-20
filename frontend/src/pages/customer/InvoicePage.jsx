import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Stack,
  Divider,
} from '@mui/material';
import { Printer, ArrowLeft } from 'lucide-react';
import { getOrder } from '../../api/checkoutApi';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });



const InvoicePage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      try {
        const backendOrder = await getOrder(orderId);
        if (isMounted && backendOrder) {
          const pickup = backendOrder.pickupDate ? new Date(backendOrder.pickupDate) : new Date();
          const retDate = backendOrder.returnDate ? new Date(backendOrder.returnDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          const diffTime = Math.abs(retDate - pickup);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

          const total = backendOrder.totalAmount || 0;
          const subtotal = total * 0.8;

          const formatted = {
            id: backendOrder.id,
            orderNumber: backendOrder.orderNumber || backendOrder.id,
            transactionId: backendOrder.paymentId || 'TXN-998822',
            productName: backendOrder.items?.[0]?.name || 'Rental Item',
            category: backendOrder.items?.[0]?.category || 'General',
            vendorName: 'RentX Partner Vendor',
            pickupDate: pickup.toLocaleDateString(),
            returnDate: retDate.toLocaleDateString(),
            rentalDurationDays: diffDays,
            rentalCharges: subtotal,
            securityDeposit: total * 0.1,
            totalPaid: total,
            status: backendOrder.status || 'Confirmed',
            paymentStatus: backendOrder.paymentStatus || 'Paid',
            paymentMethod: 'Credit Card', // Mocked since backend doesn't return payment method string
            createdAt: backendOrder.createdAt || new Date().toISOString(),
            taxes: Math.round(subtotal * 0.08),
            platformFee: 99,
            items: backendOrder.items || []
          };
          setOrder(formatted);
        }
      } catch (err) {
        console.error('Failed to load invoice details', err);
      }
    };
    fetchOrder();
    return () => { isMounted = false; };
  }, [orderId]);

  if (!order) {
    return (
      <Container maxWidth="sm" sx={{ pt: 12, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Invoice details not found.</Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/')}>Return to Home</Button>
      </Container>
    );
  }

  const orderItems = order.items.length > 0 ? order.items : [
    {
      name: order.productName,
      category: order.category,
      pickupDate: order.pickupDate,
      returnDate: order.returnDate,
      rentalDurationDays: order.rentalDurationDays,
      quantity: 1,
      pricePerUnit: Math.round(order.rentalCharges / order.rentalDurationDays),
      deposit: order.securityDeposit,
      rentalCharges: order.rentalCharges,
    }
  ];

  return (
    <Box sx={{ bgcolor: '#f1f5f9', minHeight: '100vh', py: 4, '@media print': { p: 0, bgcolor: '#fff' } }}>
      <Container maxWidth="md">

        {/* Print controls floating header */}
        <Stack direction="row" spacing={2} className="no-print" sx={{ mb: 3, justifyContent: 'space-between' }}>
          <Button variant="outlined" startIcon={<ArrowLeft size={16} />} onClick={() => window.close()} sx={{ borderRadius: 999 }}>
            Close Window
          </Button>
          <Button variant="contained" startIcon={<Printer size={16} />} onClick={() => window.print()} sx={{ borderRadius: 999 }}>
            Print Invoice
          </Button>
        </Stack>

        <Paper elevation={0} sx={{ p: { xs: 4, sm: 6 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          {/* Brand Header */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={6}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: '-0.02em' }}>RentX</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>RentX Corporate India Pvt. Ltd.</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>BKC Business District, Mumbai, MH</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>GSTIN: 27AAAAA1111A1Z1</Typography>
            </Grid>
            <Grid size={6} sx={{ textAlign: 'right' }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>TAX INVOICE</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}><strong>Invoice #:</strong> {order.id}</Typography>
              <Typography variant="body2"><strong>Order ID:</strong> {order.orderNumber}</Typography>
              <Typography variant="body2"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</Typography>
              <Typography variant="body2"><strong>Payment Method:</strong> {order.paymentMethod}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Customer & Bill details */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'text.secondary' }}>Billed To:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>Sujal Shah</Typography>
              <Typography variant="body2" color="text.secondary">sujal@example.com</Typography>
              <Typography variant="body2" color="text.secondary">Phone: +91 98765 43210</Typography>
              <Typography variant="body2" color="text.secondary">Mumbai, MH, India</Typography>
            </Grid>
            <Grid size={6} sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'text.secondary' }}>Payment Summary:</Typography>
              <Typography variant="body2"><strong>Transaction ID:</strong> {order.transactionId}</Typography>
              <Typography variant="body2"><strong>Payment Status:</strong> {order.paymentStatus}</Typography>
              <Typography variant="body2"><strong>Fulfillment Type:</strong> Self-Pickup (BKC Center)</Typography>
            </Grid>
          </Grid>

          {/* Items Table */}
          <TableContainer component={Box} sx={{ mb: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Rental Item</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Duration</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Rate/Day</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Deposit</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Charges</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">Window: {item.pickupDate || order.pickupDate} to {item.returnDate || order.returnDate}</Typography>
                    </TableCell>
                    <TableCell>{item.category || order.category}</TableCell>
                    <TableCell align="center">{item.rentalDurationDays || order.rentalDurationDays} days</TableCell>
                    <TableCell align="right">{money.format(item.pricePerUnit)}</TableCell>
                    <TableCell align="right">{money.format(item.deposit)}</TableCell>
                    <TableCell align="right">{money.format(item.rentalCharges)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pricing Totals */}
          <Grid container spacing={3} sx={{ justifyContent: 'flex-end', mb: 6 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total Rental Cost</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(order.rentalCharges)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Refundable Security Deposit</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(order.securityDeposit)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">GST & Cess (8%)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(order.taxes)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Platform Booking Fee</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{money.format(order.platformFee)}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Grand Total Paid</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'primary.main' }}>{money.format(order.totalPaid)}</Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          {/* Signature & Disclaimer footer */}
          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid size={7}>
              <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 1, color: 'text.secondary' }}>Terms & Conditions:</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.4 }}>
                1. Security deposit is refundable within 3-5 business days of checkback subject to quality validation inspection.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.4 }}>
                2. Late returns are charged penalty rates of 1.5x daily rentals.
              </Typography>
            </Grid>
            <Grid size={5} sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignitems: 'flex-end' }}>
              <Box sx={{ width: 150, borderBottom: '1px solid', borderColor: 'grey.300', mb: 1 }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>Authorized Signatory</Typography>
              <Typography variant="caption" color="text.secondary">RentX Fulfillment Hub</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default InvoicePage;
