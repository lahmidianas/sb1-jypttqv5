import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Eye, Trash2, Loader } from 'lucide-react';
import { Booking } from '../../../types/booking';
import { formatDate, formatPrice } from '../../../utils/format';
import StatusBadge from './StatusBadge';
import { useDeleteBooking } from '../../../hooks/useDeleteBooking';
import ConfirmDialog from '../common/ConfirmDialog';

interface BookingsTableProps {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  onBookingDeleted?: () => void;
}

export default function BookingsTable({ 
  bookings, 
  loading, 
  error,
  onBookingDeleted 
}: BookingsTableProps) {
  const navigate = useNavigate();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  
  const { deleteBooking, isDeleting } = useDeleteBooking(() => {
    if (onBookingDeleted) {
      onBookingDeleted();
    }
  });

  const handleDeleteClick = (id: string) => {
    setBookingToDelete(id);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!bookingToDelete) return;

    const result = await deleteBooking(bookingToDelete);
    if (!result.success) {
      setDeleteError(result.error || 'Failed to delete booking');
    }
    setBookingToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">{error}</div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {deleteError && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700">{deleteError}</p>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.property?.title || 'Property Unavailable'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.property?.location || ''}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.client_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.client_email}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatPrice(booking.total_price)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/bookings/edit/${booking.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(booking.id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!bookingToDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setBookingToDelete(null)}
      />
    </>
  );
}