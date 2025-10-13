import React from 'react';
import { Building } from 'lucide-react';

const properties = [
  {
    id: 1,
    name: 'No properties yet',
    type: '-',
    status: 'available',
    bookings: 0
  }
];

const statusColors = {
  available: 'bg-gray-100 text-gray-800',
  occupied: 'bg-gray-100 text-gray-800',
  maintenance: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance'
};

export default function PropertyOverview() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Property Overview</h2>
      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <Building className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-500">{property.name}</h3>
                <p className="text-sm text-gray-400">{property.type}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-sm px-2 py-1 rounded-full ${statusColors[property.status]}`}>
                {statusLabels[property.status]}
              </span>
              <p className="text-sm text-gray-400 mt-1">{property.bookings} bookings</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}