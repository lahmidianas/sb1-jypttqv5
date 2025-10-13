import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface DeleteBookingResult {
  success: boolean;
  error?: string;
}

export function useDeleteBooking(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteBooking = async (id: string): Promise<DeleteBookingResult> => {
    try {
      setIsDeleting(true);

      // First check if the booking exists and can be deleted
      const { data: booking } = await supabase
        .from('bookings')
        .select('status')
        .eq('id', id)
        .single();

      if (!booking) {
        return { success: false, error: 'Booking not found' };
      }

      // Delete the booking
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting booking:', error);
      return { 
        success: false, 
        error: 'Failed to delete booking. Please try again.' 
      };
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteBooking, isDeleting };
}