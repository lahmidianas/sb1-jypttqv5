import React from 'react';
import { Building, Calendar, TrendingUp, Users } from 'lucide-react';
import { useStats } from '../../hooks/useStats';

export default function DashboardStats() {
  const { stats, loading } = useStats();

  const statItems = [
    {
      icon: Building,
      label: 'Propriétés',
      value: loading ? '...' : `${stats?.total_properties || 0}`,
      change: `${stats?.available_properties || 0} disponibles`,
      trend: 'neutral'
    },
    {
      icon: Calendar,
      label: 'Réservations',
      value: loading ? '...' : `${stats?.total_bookings || 0}`,
      change: `${stats?.confirmed_bookings || 0} confirmées`,
      trend: 'neutral'
    },
    {
      icon: Users,
      label: 'Taux d\'occupation',
      value: loading ? '...' : `${stats?.total_properties ? 
        Math.round((stats.confirmed_bookings / stats.total_properties) * 100) : 0}%`,
      change: 'des propriétés',
      trend: 'neutral'
    },
    {
      icon: TrendingUp,
      label: 'Revenus',
      value: loading ? '...' : `${stats?.total_revenue || 0}€`,
      change: 'total',
      trend: 'neutral'
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <h3 className="text-2xl font-semibold mt-1">{stat.value}</h3>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <stat.icon className="h-6 w-6 text-gray-400" />
            </div>
          </div>
          <p className="text-sm mt-2 text-gray-500">{stat.change}</p>
        </div>
      ))}
    </div>
  );
}