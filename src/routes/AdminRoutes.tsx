import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const AdminLayout = lazy(() => import('../components/admin/layout/AdminLayout'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const PropertyList = lazy(() => import('../components/admin/properties/PropertyList'));
const NewProperty = lazy(() => import('../pages/admin/properties/NewProperty'));
const EditProperty = lazy(() => import('../pages/admin/properties/EditProperty'));
const BookingsList = lazy(() => import('../pages/admin/bookings/BookingsList'));
const NewBooking = lazy(() => import('../pages/admin/bookings/NewBooking'));
const EditBooking = lazy(() => import('../pages/admin/bookings/EditBooking'));
const ClientsList = lazy(() => import('../pages/admin/clients/ClientsList'));
const NewClient = lazy(() => import('../pages/admin/clients/NewClient'));
const EditClient = lazy(() => import('../pages/admin/clients/EditClient'));
const ClientDetails = lazy(() => import('../pages/admin/clients/ClientDetails'));
const Settings = lazy(() => import('../pages/admin/Settings'));

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
