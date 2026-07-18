import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Grid, Dialog, DialogContent } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { authService } from '../api/authService';
import Button from '../components/ui/Button';

export const Dashboard = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [showCouponModal, setShowCouponModal] = useState(false);

  useEffect(() => {
    authService.getMe()
      .then(data => setUser(data))
      .catch((err) => {
        console.error('Failed to fetch user profiles:', err);
        authService.logout().finally(() => {
          window.location.href = '/login';
        });
      });
  }, []);

  useEffect(() => {
    if (location.state?.newSignup) {
      setShowCouponModal(true);
      // Clear window history state so refreshing doesn't trigger the modal again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Dashboard Workspace
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Account Information
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography variant="body1" color="text.secondary">
                  <strong>Name:</strong> {user.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Role Level:</strong> {user.role}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Coupon Code Popup Modal for New Signups as per Mockup */}
      <Dialog
        open={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1.5,
            background: (theme) =>
              theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                : 'linear-gradient(135deg, #2d1f05 0%, #1e1300 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }
        }}
      >
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            gap: 2.5
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: '#b45309',
              textAlign: 'center',
              fontFamily: 'Outfit, Inter, sans-serif'
            }}
          >
            For new signup
          </Typography>

          <Box
            sx={{
              px: 3,
              py: 0.75,
              borderRadius: '8px',
              backgroundColor: '#60a5fa', // Blue badge
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}
          >
            Coupon Code
          </Box>

          <Box
            sx={{
              width: '100%',
              maxWidth: '260px',
              py: 2,
              borderRadius: '12px',
              backgroundColor: '#93c5fd', // Display box
              color: '#1e3a8a',
              fontWeight: 900,
              fontSize: '1.75rem',
              letterSpacing: '1.5px',
              textAlign: 'center',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.08), 0 10px 15px -3px rgba(0,0,0,0.1)'
            }}
          >
            xxxx10
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: '#92400e',
              textAlign: 'center',
              fontWeight: 500,
              mt: 1
            }}
          >
            Welcome! Use this coupon code to get 10% off your first rental order.
          </Typography>

          <Button
            onClick={() => setShowCouponModal(false)}
            variant="contained"
            sx={{
              mt: 2,
              px: 4,
              py: 1,
              borderRadius: '8px',
              backgroundColor: '#1e3a8a',
              color: '#ffffff',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#172554'
              }
            }}
          >
            Got it, thanks!
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
