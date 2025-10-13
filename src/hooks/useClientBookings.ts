import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Booking } from '../types/booking';

export function useClientBookings(clientId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!clientId) return;

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('bookings')
          .select(`
            *,
            property:properties(*)
          `)
          .eq('client_id', clientId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setBookings(data || []);
      } catch (err) {
        console.error('Error loading client bookings:', err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Subscribe to changes
    const subscription = supabase
      .channel('client_bookings')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `client_id=eq.${clientId}`
      }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [clientId]);

  return { bookings, loading, error };
}