import React, { useEffect, useState } from 'react';
import { Box, Container, Card, CardContent, Typography, Button, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { getCart } from '../../api/cartApi';

const TermsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await getCart();
        setCartCount(items.length);
      } catch (err) {
        console.warn('Could not fetch cart count:', err);
      }
    };
    fetchCart();
  }, []);

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error(err); } finally { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login', { replace: true }); }
  };

  const terms = [
    { title: "1. Rental Period & Extensions", detail: "The rental period begins when the item is delivered and ends on the specified return date. Extensions are subject to availability and must be requested at least 24 hours in advance." },
    { title: "2. Security Deposit Policy", detail: "A fully refundable security deposit of 10% of the item's subtotal is collected upfront. This deposit is returned within 3-5 business days after the returned item passes quality inspection." },
    { title: "3. Damaged or Lost Items", detail: "Customers are responsible for returning items in the same condition as received. Normal wear and tear is acceptable. Severe damage or loss will incur repair or replacement costs up to the full market value." },
    { title: "4. Late Returns", detail: "Late returns without prior extension approval are subject to a fee of 1.5x the daily rental rate for each day past the return deadline." },
    { title: "5. Cancellation & Refunds", detail: "Cancellations made 48 hours before the scheduled delivery are eligible for a full refund. Cancellations within 48 hours will incur a 20% cancellation fee." }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Navbar onSearchChange={() => {}} cartCount={cartCount} onLogout={handleLogout} />
      <Container maxWidth="lg" sx={{ pt: '94px', pb: 8 }}>
        <Button variant="outlined" startIcon={<ArrowLeft size={16} />} onClick={() => navigate(-1)} sx={{ mb: 3, borderRadius: 999, px: 2.25, py: 0.9 }}>
          Go Back
        </Button>

        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>Terms & Conditions</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>Please read our rental rules, policies, and guidelines carefully before renting items.</Typography>

        <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Standard Rental Agreement</Typography>
            <Stack spacing={2}>
              {terms.map((term, index) => (
                <Accordion key={index} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px !important', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                    <Typography sx={{ fontWeight: 700 }}>{term.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{term.detail}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default TermsPage;
