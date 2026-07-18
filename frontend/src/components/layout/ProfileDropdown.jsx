import React from 'react';
import { Menu, MenuItem, Divider, Typography } from '@mui/material';
import { User, FileText, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Profile dropdown menu displayed when clicking the user profile avatar.
 * @param {Object} props
 * @param {HTMLElement} props.anchorEl - The element anchoring the menu dropdown
 * @param {boolean} props.open - Whether the menu is open
 * @param {Function} props.onClose - Function to close the dropdown
 * @param {Function} props.onLogout - Function to trigger the logout operation
 */
export const ProfileDropdown = ({ anchorEl, open, onClose, onLogout }) => {
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    onClose();
    navigate(path);
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
        sx: {
          mt: 1.5,
          minWidth: 190,
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'divider',
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1.2,
            gap: 1.5,
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: '6px',
            mx: 1,
            my: 0.5,
            transition: 'all 0.15s ease',
            '&:hover': {
              backgroundColor: 'action.hover',
              color: 'primary.main',
              '& svg': {
                color: 'primary.main',
              },
            },
          },
        },
      }}
    >
      <MenuItem onClick={() => handleItemClick('/profile')}>
        <User size={18} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>My Profile</Typography>
      </MenuItem>

      <MenuItem onClick={() => handleItemClick('/orders')}>
        <FileText size={18} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>My Orders</Typography>
      </MenuItem>

      <MenuItem onClick={() => handleItemClick('/profile')}>
        <Settings size={18} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>Settings</Typography>
      </MenuItem>

      <Divider sx={{ my: '4px !important' }} />

      <MenuItem onClick={onLogout} sx={{ color: 'error.main', '&:hover': { backgroundColor: 'error.lighter', color: 'error.dark' } }}>
        <LogOut size={18} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>Logout</Typography>
      </MenuItem>
    </Menu>
  );
};

export default ProfileDropdown;
