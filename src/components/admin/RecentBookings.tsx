import React from 'react';

const bookings = [
  {
    id: 1,
    property: 'No bookings yet',
    client: '-',
    checkIn: '-',
    checkOut: '-',
    status: 'pending'
  }
];

export default function RecentBookings() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium text-gray-500">{booking.property}</h3>
              <p className="text-sm text-gray-400">{booking.client}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">
                {booking.checkIn} - {booking.checkOut}
              </p>
              <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                No status
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}