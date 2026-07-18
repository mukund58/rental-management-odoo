import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, Badge, Avatar, Drawer, List, ListItem, ListItemText, ListItemAvatar, Button, Divider } from '@mui/material';
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../common/Logo';
import SearchBar from './SearchBar';
import ProfileDropdown from './ProfileDropdown';
import { PATHS } from '../../routes/paths';
import { getProductById } from '../../api/productApi';

import { getCart } from '../../api/cartApi';


const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

/**
 * RentX 70px fixed Navbar layout component
 * @param {Object} props
 * @param {Function} props.onSearchChange - Event handler when search query changes
 * @param {number} props.cartCount - Dynamic cart item count to display on the badge
 * @param {Function} props.onLogout - Callback to handle user logout
 */
export const Navbar = ({ onSearchChange, cartCount, onLogout }) => {
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

  const [localCartCount, setLocalCartCount] = useState(cartCount || 0);

  const navigate = useNavigate();

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

  const loadWishlist = async () => {
    const wishlistedIds = JSON.parse(localStorage.getItem('wishlist_items') || '[]');
    const items = [];
    for (const id of wishlistedIds) {
      try {
        const prod = await getProductById(id);
        if (prod) items.push(prod);
      } catch (err) {
        console.warn(`Failed to fetch wishlisted item ${id}`);
      }
    }
    setWishlistItems(items);
  };


  const loadCartCount = async () => {
    try {
      const items = await getCart();
      const count = items.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
      setLocalCartCount(count);
    } catch (err) {
      console.warn('Could not load cart count:', err);
    }
  };

  useEffect(() => {
    loadWishlist();
    loadCartCount();
    window.addEventListener('wishlist-updated', loadWishlist);
    window.addEventListener('cart-updated', loadCartCount);
    return () => {
      window.removeEventListener('wishlist-updated', loadWishlist);
      window.removeEventListener('cart-updated', loadCartCount);
    };
  }, []);

  useEffect(() => {
    if (cartCount !== undefined) {
      setLocalCartCount(cartCount);
    }
  }, [cartCount]);

  useEffect(() => {
    loadWishlist();
    window.addEventListener('wishlist-updated', loadWishlist);
    return () => window.removeEventListener('wishlist-updated', loadWishlist);
  }, []);


  const handleRemoveFromWishlist = (id) => {
    const wishlisted = JSON.parse(localStorage.getItem('wishlist_items') || '[]');
    const updated = wishlisted.filter(itemId => String(itemId) !== String(id));
    localStorage.setItem('wishlist_items', JSON.stringify(updated));
    toast.error('Removed from wishlist');
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const handleNavigation = (item) => {
    if (item === 'Products') {
      navigate(PATHS.ROOT);
    } else if (item === 'Terms & Conditions') {
      navigate(PATHS.TERMS);
    } else if (item === 'About Us') {
      navigate(PATHS.ABOUT);
    } else if (item === 'Contact Us') {
      navigate(PATHS.CONTACT);
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
                onClick={() => handleNavigation(item)}
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
            onClick={() => setWishlistOpen(true)}
            sx={{
              p: 1,
              borderRadius: '10px',
              transition: 'all 0.2s',
              '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
            }}
          >
            <Badge badgeContent={wishlistItems.length} color="error">
              <Heart size={20} />
            </Badge>
          </IconButton>

          <IconButton
            color="inherit"

            onClick={() => navigate(PATHS.CART)}

            sx={{
              p: 1,
              borderRadius: '10px',
              transition: 'all 0.2s',
              '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
            }}
          >
            <Badge
              badgeContent={localCartCount}
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

      {/* Wishlist Drawer */}
      <Drawer
        anchor="right"
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        PaperProps={{
          sx: { width: { xs: 290, sm: 380 }, p: 3, boxSizing: 'border-box' }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Wishlist ({wishlistItems.length})</Typography>
          <IconButton onClick={() => setWishlistOpen(false)}><X size={20} /></IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {wishlistItems.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>Your wishlist is empty</Typography>
            <Typography variant="body2">Add items while exploring products.</Typography>
          </Box>
        ) : (
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {wishlistItems.map((item) => (
              <ListItem
                key={item.id}
                disablePadding
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  bgcolor: 'background.paper',
                }}
              >
                <ListItemAvatar sx={{ minWidth: 'auto' }}>
                  <Box
                    component="img"
                    src={item.image || item.imageUrl}
                    alt={item.name}
                    sx={{ width: 64, height: 64, borderRadius: 2, objectFit: 'cover' }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.name}</Typography>}
                  secondary={<Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', mt: 0.5 }}>{money.format(item.price)}/day</Typography>}
                  sx={{ m: 0 }}
                />
                <Stack spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ borderRadius: 999, textTransform: 'none', fontSize: '0.75rem', fontWeight: 700 }}
                    onClick={() => {
                      setWishlistOpen(false);
                      navigate(`/product/${item.id}`);
                    }}
                  >
                    View
                  </Button>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    sx={{ alignSelf: 'center' }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Stack>
              </ListItem>
            ))}
          </List>
        )}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
