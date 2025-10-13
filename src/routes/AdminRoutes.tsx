import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/layout/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import PropertyList from '../components/admin/properties/PropertyList';
import NewProperty from '../pages/admin/properties/NewProperty';
import EditProperty from '../pages/admin/properties/EditProperty';
import BookingsList from '../pages/admin/bookings/BookingsList';
import NewBooking from '../pages/admin/bookings/NewBooking';
import EditBooking from '../pages/admin/bookings/EditBooking';
import ClientsList from '../pages/admin/clients/ClientsList';
import NewClient from '../pages/admin/clients/NewClient';
import EditClient from '../pages/admin/clients/EditClient';
import ClientDetails from '../pages/admin/clients/ClientDetails';
import Settings from '../pages/admin/Settings';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="properties">
          <Route index element={<PropertyList />} />
          <Route path="new" element={<NewProperty />} />
          <Route path="edit/:id" element={<EditProperty />} />
        </Route>
        <Route path="bookings">
          <Route index element={<BookingsList />} />
          <Route path="new" element={<NewBooking />} />
          <Route path="edit/:id" element={<EditBooking />} />
        </Route>
        <Route path="clients">
          <Route index element={<ClientsList />} />
          <Route path="new" element={<NewClient />} />
          <Route path=":id" element={<ClientDetails />} />
          <Route path="edit/:id" element={<EditClient />} />
        </Route>
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}