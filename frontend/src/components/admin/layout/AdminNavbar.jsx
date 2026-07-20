import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Avatar,
  Divider
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../ui/Logo';
import useAuth from '../../../hooks/useAuth';
import { PATHS } from '../../../routes/paths';

export const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [productsAnchor, setProductsAnchor] = useState(null);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const handleLogout = async () => {
    setProfileAnchor(null);
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate(PATHS.LOGIN, { replace: true });
    }
  };

  const navButtonStyles = (isActive) => ({
    color: isActive ? 'primary.main' : 'text.primary',
    fontWeight: isActive ? 800 : 600,
    textTransform: 'none',
    fontSize: '0.95rem',
    px: 2,
    '&:hover': {
      backgroundColor: 'action.hover',
      color: 'primary.main',
    }
  });

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>

        {/* Left Section: Logo & Main Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Logo />

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>

            {/* Orders */}
            <Button
              sx={navButtonStyles(location.pathname.includes('/orders') || location.pathname === PATHS.ADMIN_DASHBOARD)}
              onClick={() => navigate(PATHS.ADMIN_DASHBOARD)}
            >
              Orders
            </Button>

            {/* Schedule */}
            <Button
              sx={navButtonStyles(location.pathname.includes('/schedule'))}
              onClick={() => navigate(PATHS.ADMIN_SCHEDULE)}
            >
              Schedule
            </Button>

            {/* Products (Dropdown) */}
            <Button
              sx={navButtonStyles(location.pathname.includes('/products'))}
              onClick={(e) => setProductsAnchor(e.currentTarget)}
            >
              Products
            </Button>
            <Menu
              anchorEl={productsAnchor}
              open={Boolean(productsAnchor)}
              onClose={() => setProductsAnchor(null)}
              MenuListProps={{ sx: { minWidth: 150 } }}
              elevation={2}
            >
              <MenuItem onClick={() => { setProductsAnchor(null); navigate(PATHS.ADMIN_PRODUCT_CREATE); }}>Product</MenuItem>
              {/* <MenuItem onClick={() => setProductsAnchor(null)}>Price list</MenuItem>
              <MenuItem onClick={() => setProductsAnchor(null)}>Attribute</MenuItem>
              <MenuItem onClick={() => setProductsAnchor(null)}>Rental Period</MenuItem> */}
            </Menu>

            {/* Reports */}
            <Button
              sx={navButtonStyles(location.pathname.includes('/reports'))}
              onClick={() => navigate(PATHS.ADMIN_REPORTS)}
            >
              Reports
            </Button>

            {/* Settings (Dropdown) */}
            <Button
              sx={navButtonStyles(location.pathname.includes('/settings'))}
              onClick={(e) => setSettingsAnchor(e.currentTarget)}
            >
              Settings
            </Button>
            <Menu
              anchorEl={settingsAnchor}
              open={Boolean(settingsAnchor)}
              onClose={() => setSettingsAnchor(null)}
              MenuListProps={{ sx: { minWidth: 150 } }}
              elevation={2}
            >
              <MenuItem onClick={() => { setSettingsAnchor(null); navigate(PATHS.ADMIN_USERS); }}>User</MenuItem>
              <MenuItem onClick={() => { setSettingsAnchor(null); navigate(PATHS.ADMIN_QUOTATIONS); }}>Quotation Template</MenuItem>
              {/* <MenuItem onClick={() => setSettingsAnchor(null)}>Header/Footer</MenuItem> */}
            </Menu>

          </Box>
        </Box>

        {/* Right Section: Profile & Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {user?.role}
            </Typography>
          </Box>
          <IconButton
            onClick={(e) => setProfileAnchor(e.currentTarget)}
            sx={{ p: 0, border: '2px solid', borderColor: 'primary.main' }}
          >
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '1rem', fontWeight: 700 }}>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={() => setProfileAnchor(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            elevation={3}
            sx={{ mt: 1 }}
          >
            <Box sx={{ px: 2, py: 1.5, minWidth: 180 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { setProfileAnchor(null); navigate(PATHS.PROFILE); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 600 }}>
              Logout
            </MenuItem>
          </Menu>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
