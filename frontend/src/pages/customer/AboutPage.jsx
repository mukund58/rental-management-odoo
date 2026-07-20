import React, { useEffect, useState } from 'react';
import { Box, Container, Card, CardContent, Typography, Button, Grid, Stack } from '@mui/material';
import { ArrowLeft, ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { getCart } from '../../api/cartApi';

const AboutPage = () => {
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

  const values = [
    { icon: <ShieldCheck size={28} color="#4f46e5" />, title: "Quality Assurance", desc: "Every single item in our catalog undergoes rigorous quality checks before delivery." },
    { icon: <Heart size={28} color="#e11d48" />, title: "Customer Centric", desc: "Our 24/7 customer support and flexible options ensure your peace of mind." },
    { icon: <Sparkles size={28} color="#d97706" />, title: "Affordable Pricing", desc: "Rent premium items at a fraction of the cost, with zero hidden charges." },
    { icon: <Award size={28} color="#16a34a" />, title: "Sustainability First", desc: "By renting instead of buying, you reduce carbon footprints and product waste." }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onSearchChange={() => {}} cartCount={cartCount} onLogout={handleLogout} />
      <Container maxWidth="lg" sx={{ pt: '94px', pb: 8 }}>
        <Button variant="outlined" startIcon={<ArrowLeft size={16} />} onClick={() => navigate(-1)} sx={{ mb: 3, borderRadius: 999, px: 2.25, py: 0.9 }}>
          Go Back
        </Button>

        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>About Us</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>We make high-quality rentals affordable and accessible for everyone.</Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Our Story</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
                  Founded in 2026, RentX was built with a simple goal: to break down barriers to premium lifestyle products. We believe that ownership is old-school. Access is the future.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Whether you need a MacBook for a developer project, a camera kit for a weekend trip, or an espresso machine to host a party, RentX gives you flexible, hassle-free access.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              {values.map((val, idx) => (
                <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                  <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ mb: 1.5 }}>{val.icon}</Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>{val.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{val.desc}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutPage;
