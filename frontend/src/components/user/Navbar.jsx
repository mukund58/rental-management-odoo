import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Typography, InputBase, IconButton, Badge, Button, Avatar } from '@mui/material';
import { Heart, ShoppingCart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { PATHS } from '../../routes/paths';

export const Navbar = ({ onSearchChange, user, onLogout }) => {
  const navigate = useNavigate();
  const [profileAnchor, setProfileAnchor] = useState(null);

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleLogoutClick = () => {
    handleProfileClose();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, px: { xs: 2, sm: 3 } }}>
        {/* Left Side: Logo & Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 } }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: 'primary.main',
              letterSpacing: '-0.025em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
            onClick={() => navigate('/')}
          >
            Your Logo
          </Typography>

          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
              Products
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
              Terms & Conditions
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
              About Us
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
              Contact Us
            </Typography>
          </Box>
        </Box>

        {/* Center: Search Bar */}
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: 500,
            display: 'flex',
            alignItems: 'center',
            bgcolor: (theme) => theme.palette.mode === 'light' ? '#f1f5f9' : '#1e293b',
            px: 2,
            py: 0.75,
            borderRadius: '24px',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Search size={18} style={{ marginRight: 8, color: '#94a3b8' }} />
          <InputBase
            placeholder="Search products..."
            fullWidth
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ fontSize: '0.9rem', color: 'text.primary' }}
          />
        </Box>

        {/* Right Side: Wishlist, Cart, Avatar / Login */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <IconButton color="inherit" size="small" sx={{ p: 1 }}>
            <Heart size={22} />
          </IconButton>

          <IconButton color="inherit" size="small" sx={{ p: 1 }}>
            <Badge badgeContent={0} color="error">
              <ShoppingCart size={22} />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <IconButton onClick={handleProfileClick} size="small" sx={{ p: 0.25, border: '2px solid', borderColor: 'primary.main' }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
              <ProfileDropdown
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={handleProfileClose}
                onLogout={handleLogoutClick}
              />
            </>
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(PATHS.LOGIN || '/login')}
              sx={{ px: 2.5, borderRadius: '8px', fontWeight: 600 }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
