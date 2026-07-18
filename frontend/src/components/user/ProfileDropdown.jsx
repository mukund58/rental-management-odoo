import React from 'react';
import { Menu, MenuItem, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, FileText } from 'lucide-react';

export const ProfileDropdown = ({ anchorEl, open, onClose, onLogout }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    onClose();
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    onClose();
    navigate('/profile');
  };

  const handleOrdersClick = () => {
    onClose();
    navigate('/orders');
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        elevation: 4,
        sx: { mt: 1, minWidth: 200, borderRadius: '12px' },
      }}
    >
      <MenuItem onClick={handleProfileClick} sx={{ gap: 1.5, py: 1.2 }}>
        <User size={18} /> My Account / My Profile
      </MenuItem>
      <MenuItem onClick={handleOrdersClick} sx={{ gap: 1.5, py: 1.2 }}>
        <FileText size={18} /> My Orders
      </MenuItem>
      <MenuItem onClick={handleSettingsClick} sx={{ gap: 1.5, py: 1.2 }}>
        <Settings size={18} /> Settings
      </MenuItem>
      <Divider />
      <MenuItem onClick={onLogout} sx={{ gap: 1.5, py: 1.2, color: 'error.main' }}>
        <LogOut size={18} /> Logout
      </MenuItem>
    </Menu>
  );
};

export default ProfileDropdown;
