import React, { useEffect, useState } from 'react';
import { Box, Container, Card, CardContent, Typography, Button, TextField, Grid, Stack } from '@mui/material';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { getCart } from '../../api/cartApi';

const ContactPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const [form, setForm] = useState({ name: '', email: '', message: '' });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('All fields are required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you! Your message has been received.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onSearchChange={() => {}} cartCount={cartCount} onLogout={handleLogout} />
      <Container maxWidth="lg" sx={{ pt: '94px', pb: 8 }}>
        <Button variant="outlined" startIcon={<ArrowLeft size={16} />} onClick={() => navigate(-1)} sx={{ mb: 3, borderRadius: 999, px: 2.25, py: 0.9 }}>
          Go Back
        </Button>

        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>Contact Us</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>Have questions or need assistance? Reach out and we'll reply as soon as possible.</Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2.5}>
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.50', color: 'primary.main', display: 'flex' }}><Mail size={24} /></Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email Us</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>support@rentx.com</Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'success.50', color: 'success.main', display: 'flex' }}><Phone size={24} /></Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Call Us</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>+91 98765 43210</Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'warning.50', color: 'warning.main', display: 'flex' }}><MapPin size={24} /></Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">HQ Office</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>BKC, Mumbai, India</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Send a Message</Typography>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={2.5}>
                    <TextField label="Full Name" size="small" fullWidth value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} />
                    <TextField label="Email Address" size="small" fullWidth type="email" value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} />
                    <TextField label="Your Message" size="small" fullWidth multiline rows={4} value={form.message} onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))} />
                    <Button type="submit" variant="contained" fullWidth sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}>
                      Send Message
                    </Button>
                  </Stack>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactPage;
