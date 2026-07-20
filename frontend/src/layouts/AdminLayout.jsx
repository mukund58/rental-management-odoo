import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import AdminNavbar from '../components/admin/layout/AdminNavbar';

export const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminNavbar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
