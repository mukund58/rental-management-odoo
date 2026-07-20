import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/admin/layout/AdminNavbar';

export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AdminNavbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
