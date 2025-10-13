import React from 'react';
import BookingForm from '../../../components/admin/bookings/BookingForm';
import { useProperties } from '../../../hooks/useProperties';
import { Loader } from 'lucide-react';

export default function NewBooking() {
  const { properties, loading, error } = useProperties();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Create New Booking</h1>
      <div className="max-w-4xl mx-auto">
        <BookingForm properties={properties} />
      </div>
    </div>
  );
}