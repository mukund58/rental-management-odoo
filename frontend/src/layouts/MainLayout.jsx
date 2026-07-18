import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  useTheme,
  Container,
} from '@mui/material';
import {
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Moon,
  Sun,
  User,
  Bell,
  Settings,
} from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';
import { PATHS } from '../routes/paths';

const SIDEBAR_WIDTH = 260;

export const MainLayout = () => {
  const muiTheme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useAppTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchor(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    localStorage.removeItem('token');
    navigate(PATHS.LOGIN);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: PATHS.DASHBOARD },
    { text: 'Profile', icon: <User size={20} />, path: '#' },
    { text: 'Settings', icon: <Settings size={20} />, path: '#' },
  ];

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          R
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.025em' }}>
          RentalSystem
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ flexGrow: 1, px: 2, py: 3 }}>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => item.path !== '#' && navigate(item.path)}
                  sx={{
                    borderRadius: '8px',
                    py: 1.2,
                    px: 2,
                    backgroundColor: isActive 
                      ? (theme) => theme.palette.mode === 'light' ? '#e0e7ff' : '#1e1b4b'
                      : 'transparent',
                    color: isActive 
                      ? (theme) => theme.palette.primary.main 
                      : (theme) => theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: isActive
                        ? (theme) => theme.palette.mode === 'light' ? '#e0e7ff' : '#1e1b4b'
                        : (theme) => theme.palette.mode === 'light' ? '#f1f5f9' : '#1f2937',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive 
                        ? (theme) => theme.palette.primary.main 
                        : (theme) => theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.925rem',
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '8px',
            color: 'error.main',
            '&:hover': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? '#fef2f2' : 'rgba(239, 68, 68, 0.08)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
            <LogOut size={20} />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            primaryTypographyProps={{ fontSize: '0.925rem', fontWeight: 600 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar - Desktop */}
      <Box
        component="nav"
        sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: SIDEBAR_WIDTH,
              borderRight: `1px solid ${muiTheme.palette.divider}`,
              backgroundImage: 'none',
              bgcolor: 'background.paper',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: SIDEBAR_WIDTH,
              borderRight: `1px solid ${muiTheme.palette.divider}`,
              backgroundImage: 'none',
              bgcolor: 'background.paper',
            },
          }}
          open
        >
          {sidebarContent}
        </Drawer>
      </Box>

      {/* Main Workspace */}
      <Box
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header Appbar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            color: 'text.primary',
            borderBottom: `1px solid ${muiTheme.palette.divider}`,
          }}
        >
          <Toolbar sx={{ px: { xs: 2, sm: 3 }, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon size={20} />
              </IconButton>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Workspace
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Theme Toggle */}
              <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
                <IconButton onClick={toggleTheme} color="inherit" size="small" sx={{ p: 1 }}>
                  {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </IconButton>
              </Tooltip>

              <IconButton color="inherit" size="small" sx={{ p: 1 }}>
                <Bell size={20} />
              </IconButton>

              <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5, height: 24 }} />

              <Tooltip title="Account Settings">
                <IconButton onClick={handleProfileMenuOpen} size="small" sx={{ ml: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      bgcolor: 'primary.main',
                    }}
                  >
                    U
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={handleProfileMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 4,
                  sx: { mt: 1, minWidth: 180 },
                }}
              >
                <MenuItem onClick={handleProfileMenuClose} sx={{ gap: 1.5, py: 1 }}>
                  <User size={16} /> My Profile
                </MenuItem>
                <MenuItem onClick={handleProfileMenuClose} sx={{ gap: 1.5, py: 1 }}>
                  <Settings size={16} /> Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1, color: 'error.main' }}>
                  <LogOut size={16} /> Sign Out
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content Outlet */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: { xs: 3, sm: 4 },
            px: { xs: 2, sm: 3 },
            bgcolor: (theme) => theme.palette.mode === 'light' ? '#f8fafc' : '#0b0f19',
          }}
        >
          <Container maxWidth="lg" disableGutters>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
};
export default MainLayout;
