import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingsTable from './BookingsTable';
import { useBookings } from '../../../hooks/useBookings';

export default function BookingsList() {
  const { bookings, loading, error } = useBookings();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Bookings</h1>
          <p className="text-gray-600">Manage your property bookings</p>
        </div>
        <Link
          to="/admin/bookings/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Booking
        </Link>
      </div>
      
      <BookingsTable 
        bookings={bookings} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
}