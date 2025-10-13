import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar';
import AdminHeader from '../AdminHeader';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}