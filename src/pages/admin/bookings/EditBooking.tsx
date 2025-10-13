import React from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from '../../../components/admin/bookings/BookingForm';
import { useProperties } from '../../../hooks/useProperties';
import { useBooking } from '../../../hooks/useBooking';
import { Loader } from 'lucide-react';

export default function EditBooking() {
  const { id } = useParams();
  const { properties } = useProperties();
  const { booking, loading, error } = useBooking(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center text-red-500 py-8">
        {error || 'Booking not found'}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Booking</h1>
      <div className="max-w-4xl mx-auto">
        <BookingForm
          properties={properties}
          initialData={booking}
          mode="edit"
        />
      </div>
    </div>
  );
}