import React from 'react';
import DashboardStats from '../../components/admin/DashboardStats';
import RecentBookings from '../../components/admin/RecentBookings';
import PropertyOverview from '../../components/admin/PropertyOverview';

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <DashboardStats />
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <RecentBookings />
        <PropertyOverview />
      </div>
    </div>
  );
}