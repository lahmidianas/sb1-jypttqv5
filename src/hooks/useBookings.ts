import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Booking } from '../types/booking';

export function useBookings(propertyId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase
          .from('bookings')
          .select(`
            *,
            property:properties(*)
          `)
          .order('check_in', { ascending: true });

        if (propertyId) {
          query = query.eq('property_id', propertyId);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setBookings(data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Subscribe to changes
    const subscription = supabase
      .channel('bookings_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: propertyId ? `property_id=eq.${propertyId}` : undefined
      }, fetchBookings)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [propertyId]);

  return { bookings, loading, error };
}