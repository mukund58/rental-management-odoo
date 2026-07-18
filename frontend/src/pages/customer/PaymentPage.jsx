import React, { useMemo, useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  Radio,
  FormControlLabel,
  Chip,
  Backdrop,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { customerMockPaymentMethods, customerMockCoupons } from '../../data/customerMocks';
import { getCart, removeCartItem } from '../../api/cartApi';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const fallbackCartItems = [
  {
    id: 'fallback-1',
    productId: 'p1',
    name: 'MacBook Pro 16" (M3 Max)',
    pricePerUnit: 450,
    quantity: 2,
    rentalStart: new Date().toISOString(),
    rentalEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    rentalDurationDays: 7,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60',
    variant: 'Gray',
  },
  {
    id: 'fallback-2',
    productId: 'p3',
    name: 'PlayStation 5 Console',
    pricePerUnit: 200,
    quantity: 1,
    rentalStart: new Date().toISOString(),
    rentalEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    rentalDurationDays: 5,
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80',
    variant: 'Standard',
  }
];

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const checkoutState = location.state || {};
  const selectedAddressId = checkoutState.addressId;
  const initialItems = checkoutState.items || [];

  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    }
  };

  useEffect(() => {
    if (initialItems.length === 0) {
      let isMounted = true;
      const fetchCart = async () => {
        try {
          const cartItems = await getCart();
          if (isMounted) {
            if (cartItems && cartItems.length > 0) {
              setItems(cartItems);
            } else {
              setItems(fallbackCartItems);
            }
          }
        } catch (err) {
          console.error(err);
          if (isMounted) {
            setItems(fallbackCartItems);
            setErrorMsg('Backend API not responding. Using offline fallback order summary.');
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      fetchCart();
      return () => { isMounted = false; };
    }
  }, [initialItems]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);
  }, [items]);

  const securityDeposit = useMemo(() => {
    return Math.round(subtotal * 0.10); // 10% refundable security deposit
  }, [subtotal]);

  const platformFee = subtotal > 0 ? 99 : 0; // Flat ₹99 platform fee

  const taxes = useMemo(() => {
    return Math.round(subtotal * 0.08); // 8% tax
  }, [subtotal]);

  const baseTotal = subtotal + securityDeposit + platformFee + taxes;
  const grandTotal = useMemo(() => Math.max(0, baseTotal - discount), [baseTotal, discount]);

  const applyCoupon = () => {
    const coupon = customerMockCoupons.find((item) => item.code.toLowerCase() === couponCode.trim().toLowerCase());
    if (!coupon) {
      setErrorMsg('Coupon code not found.');
      setDiscount(0);
      toast.error('Invalid coupon code.');
      return;
    }
    setErrorMsg('');
    const calculatedDiscount = typeof coupon.discount === 'number' && coupon.discount < 1
      ? Math.round(subtotal * coupon.discount)
      : coupon.discount;
    setDiscount(calculatedDiscount);
    toast.success(`Coupon applied! Saved ${money.format(calculatedDiscount)}`);
  };

  // Form formatting helpers
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formattedValue.substring(0, 19));
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      setExpiryDate(value);
    } else {
      setExpiryDate(`${value.substring(0, 2)}/${value.substring(2, 4)}`);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value.substring(0, 3));
  };

  // Validations
  const validateForm = () => {
    if (selectedMethod === 'card' || selectedMethod === 'debit') {
      const rawCard = cardNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(rawCard)) {
        toast.error('Card number must be exactly 16 digits.');
        return false;
      }
      if (!cardName.trim()) {
        toast.error('Card holder name is required.');
        return false;
      }
      if (!/^[a-zA-Z\s]+$/.test(cardName)) {
        toast.error('Card holder name must contain only letters and spaces.');
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        toast.error('Expiry date must be MM/YY.');
        return false;
      }
      const [month, year] = expiryDate.split('/').map(Number);
      if (month < 1 || month > 12) {
        toast.error('Expiry month must be between 01 and 12.');
        return false;
      }
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        toast.error('Card is expired.');
        return false;
      }
      if (!/^\d{3}$/.test(cvv)) {
        toast.error('CVV must be 3 digits.');
        return false;
      }
    } else if (selectedMethod === 'upi') {
      const upiPattern = /^[\w.\-_]{2,256}@[\w]{2,64}$/;
      if (!upiPattern.test(upiId.trim())) {
        toast.error('Please enter a valid UPI ID (e.g. user@bank).');
        return false;
      }
    } else if (selectedMethod === 'netbanking') {
      if (!selectedBank) {
        toast.error('Please select a bank.');
        return false;
      }
    }
    return true;
  };

  const handlePay = async () => {
    if (!validateForm()) return;

    try {
      setProcessing(true);
      setErrorMsg('');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear the cart on the backend (ignore errors if API is offline or dummy items are used)
      try {
        await Promise.all(items.map((item) => removeCartItem(item.id)));
      } catch (apiErr) {
        console.warn('Could not clear backend cart (API might be offline or dummy data is active):', apiErr);
      }

      // Save order info to local storage
      const savedOrders = JSON.parse(localStorage.getItem('rental_orders') || '[]');
      const txnId = `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const readablePaymentMethod = 
        selectedMethod === 'card' ? 'Credit Card' :
        selectedMethod === 'debit' ? 'Debit Card' :
        selectedMethod === 'upi' ? 'UPI' : 'Net Banking';

      const newOrder = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        transactionId: txnId,
        status: 'Upcoming',
        statusKey: 'upcoming',
        rentalStart: items[0]?.rentalStart || new Date().toISOString().split('T')[0],
        rentalEnd: items[0]?.rentalEnd || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        rentalDuration: items[0]?.rentalDurationDays ? `${items[0].rentalDurationDays} day(s)` : '7 day(s)',
        itemName: items.map((item) => item.name).join(', '),
        productName: items.map((item) => item.name).join(', '),
        totalAmount: grandTotal,
        total: grandTotal,
        subtotal: subtotal,
        securityDeposit: securityDeposit,
        platformFee: platformFee,
        taxes: taxes,
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        addressId: selectedAddressId || 'default',
        paymentMethod: readablePaymentMethod,
        createdAt: new Date().toISOString(),
        items: items.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          imageUrl: item.imageUrl,
          pricePerUnit: item.pricePerUnit,
          quantity: item.quantity,
          rentalDurationDays: item.rentalDurationDays || 7,
          rentalStart: item.rentalStart || new Date().toISOString().split('T')[0],
          rentalEnd: item.rentalEnd || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          deposit: Math.round(item.pricePerUnit * item.quantity * 0.10),
          rentalCharges: item.pricePerUnit * item.quantity,
          category: item.category || 'General',
        }))
      };
      localStorage.setItem('rental_orders', JSON.stringify([newOrder, ...savedOrders]));

      toast.success('Payment successful!');
      navigate('/order-success', { state: { order: newOrder } });
    } catch (err) {
      console.error(err);
      toast.error('Payment processing failed. Please try again.');
      setErrorMsg('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Navbar onSearchChange={() => {}} cartCount={items.length} onLogout={handleLogout} />
      <Container maxWidth="xl" sx={{ pt: '94px', pb: 8 }}>
        <Button variant="outlined" startIcon={<ArrowLeft size={16} />} onClick={() => navigate(PATHS.CHECKOUT)} sx={{ mb: 3, borderRadius: 999, px: 2.25, py: 0.9 }}>
          Back to checkout
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Payment</Typography>

        {errorMsg && <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>{errorMsg}</Alert>}

        {loading ? (
          <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 3 }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Payment Method</Typography>
                  <Stack spacing={1.5}>
                    {customerMockPaymentMethods.map((method) => (
                      <Box key={method.id} sx={{ border: '1px solid', borderColor: selectedMethod === method.id ? 'primary.main' : 'divider', borderRadius: 3, p: 2.25, bgcolor: selectedMethod === method.id ? 'primary.50' : 'background.paper' }}>
                        <FormControlLabel
                          value={method.id}
                          control={<Radio checked={selectedMethod === method.id} onChange={() => setSelectedMethod(method.id)} />}
                          label={<Typography sx={{ fontWeight: 700 }}>{method.label}</Typography>}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>{method.description}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Dynamic Payment Details Forms */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', mb: 3 }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>Enter Payment Details</Typography>

                  {(selectedMethod === 'card' || selectedMethod === 'debit') && (
                    <Stack spacing={2.5}>
                      <TextField
                        label="Card Number"
                        placeholder="0000 0000 0000 0000"
                        fullWidth
                        size="small"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        inputProps={{ maxLength: 19 }}
                      />
                      <TextField
                        label="Card Holder Name"
                        placeholder="Aarav Sharma"
                        fullWidth
                        size="small"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="Expiry Date"
                          placeholder="MM/YY"
                          fullWidth
                          size="small"
                          value={expiryDate}
                          onChange={handleExpiryDateChange}
                          inputProps={{ maxLength: 5 }}
                        />
                        <TextField
                          label="CVV"
                          placeholder="123"
                          fullWidth
                          size="small"
                          value={cvv}
                          type="password"
                          onChange={handleCvvChange}
                          inputProps={{ maxLength: 3 }}
                        />
                      </Stack>
                    </Stack>
                  )}

                  {selectedMethod === 'upi' && (
                    <Stack spacing={2.5}>
                      <TextField
                        label="UPI ID (VPA)"
                        placeholder="username@bank"
                        fullWidth
                        size="small"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                      <Typography variant="caption" color="text.secondary">
                        A payment request will be sent to your UPI app.
                      </Typography>
                    </Stack>
                  )}

                  {selectedMethod === 'netbanking' && (
                    <Stack spacing={2.5}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="select-bank-label">Select Your Bank</InputLabel>
                        <Select
                          labelId="select-bank-label"
                          value={selectedBank}
                          label="Select Your Bank"
                          onChange={(e) => setSelectedBank(e.target.value)}
                        >
                          <MenuItem value="sbi">State Bank of India (SBI)</MenuItem>
                          <MenuItem value="hdfc">HDFC Bank</MenuItem>
                          <MenuItem value="icici">ICICI Bank</MenuItem>
                          <MenuItem value="axis">Axis Bank</MenuItem>
                          <MenuItem value="kotak">Kotak Mahindra Bank</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  )}
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Coupon / Offers</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <TextField label="Coupon code" fullWidth size="small" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                    <Button variant="outlined" onClick={applyCoupon} sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}>Apply</Button>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
                    {customerMockCoupons.map((coupon) => <Chip key={coupon.code} label={coupon.code} onClick={() => setCouponCode(coupon.code)} variant="outlined" />)}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', position: 'sticky', top: '94px' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Order Summary</Typography>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Rental Subtotal</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{money.format(subtotal)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Security Deposit</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{money.format(securityDeposit)}</Typography>
                    </Box>
                    {discount > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Coupon Discount</Typography>
                        <Typography sx={{ fontWeight: 700, color: 'success.main' }}>-{money.format(discount)}</Typography>
                      </Box>
                    )}
                    {platformFee > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Platform Fee</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{money.format(platformFee)}</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Tax</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{money.format(taxes)}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 800 }}>Grand total</Typography>
                      <Typography sx={{ fontWeight: 800, color: 'primary.main' }}>{money.format(grandTotal)}</Typography>
                    </Box>
                  </Stack>
                  <Button variant="contained" fullWidth sx={{ mt: 3, borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }} onClick={handlePay}>Pay now</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Backdrop loading state */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: 'column', gap: 2, bgcolor: 'rgba(15, 23, 42, 0.8)' }}
        open={processing}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Processing Payment...</Typography>
      </Backdrop>
    </Box>
  );
};

export default PaymentPage;
