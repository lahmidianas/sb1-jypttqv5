import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Booking } from '../types/booking';

export function useBooking(id?: string) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('bookings')
          .select(`
            *,
            property:properties(*)
          `)
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setBooking(data);
      } catch (err) {
        setError('Error loading booking');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  return { booking, loading, error };
}