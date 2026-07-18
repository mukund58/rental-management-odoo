import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, Badge, Avatar } from '@mui/material';
import { Heart, ShoppingCart } from 'lucide-react';
import Logo from '../common/Logo';
import SearchBar from './SearchBar';
import ProfileDropdown from './ProfileDropdown';

/**
 * RentX 70px fixed Navbar layout component
 * @param {Object} props
 * @param {Function} props.onSearchChange - Event handler when search query changes
 * @param {number} props.cartCount - Dynamic cart item count to display on the badge
 * @param {Function} props.onLogout - Callback to handle user logout
 */
export const Navbar = ({ onSearchChange, cartCount, onLogout }) => {
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
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: 70,
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          height: 70,
          minHeight: '70px !important',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 4 },
          gap: 2,
        }}
      >
        {/* Left Section: Logo & Center Left Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, lg: 4 } }}>
          <Logo />

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
            {['Products', 'Terms & Conditions', 'About Us', 'Contact Us'].map((item) => (
              <Typography
                key={item}
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Center Section: Rounded Search Bar */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <SearchBar onSearch={onSearchChange} />
        </Box>

        {/* Right Section: Actions & Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <IconButton
            color="inherit"
            sx={{
              p: 1,
              borderRadius: '10px',
              transition: 'all 0.2s',
              '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
            }}
          >
            <Heart size={20} />
          </IconButton>

          <IconButton
            color="inherit"
            sx={{
              p: 1,
              borderRadius: '10px',
              transition: 'all 0.2s',
              '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
            }}
          >
            <Badge
              badgeContent={cartCount}
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 18,
                  minWidth: 18,
                },
              }}
            >
              <ShoppingCart size={20} />
            </Badge>
          </IconButton>

          {/* User Profile Avatar */}
          <IconButton
            onClick={handleProfileClick}
            size="small"
            sx={{
              p: 0.25,
              border: '2px solid',
              borderColor: 'primary.main',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
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
              A
            </Avatar>
          </IconButton>
          
          <ProfileDropdown
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={handleProfileClose}
            onLogout={handleLogoutClick}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
