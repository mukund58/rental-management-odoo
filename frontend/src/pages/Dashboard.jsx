import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { authService } from '../api/authService';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/jwt';
import { PATHS } from '../routes/paths';

export const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    authService.getMe()
      .then(data => {
        setUser(data);
        const roleStr = data ? String(data.role).toLowerCase() : '';
        if (roleStr === 'admin' || roleStr === 'vendor' || data?.role === 0 || data?.role === 1) {
          navigate(PATHS.ADMIN_DASHBOARD, { replace: true });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch user profiles:', err);
        authService.logout().finally(() => {
          window.location.href = '/login';
        });
      });
  }, [navigate]);

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
    </Box>
  );
};

export default Dashboard;
