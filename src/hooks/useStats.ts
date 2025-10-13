import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  total_properties: number;
  available_properties: number;
  total_bookings: number;
  confirmed_bookings: number;
  total_revenue: number;
}

export function useStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch properties count
        const { count: totalProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true });

        const { count: availableProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('available', true);

        // Fetch bookings stats
        const { data: bookings } = await supabase
          .from('bookings')
          .select('status, total_price');

        const totalBookings = bookings?.length || 0;
        const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
        const totalRevenue = bookings
          ?.filter(b => b.status === 'confirmed')
          .reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

        setStats({
          total_properties: totalProperties || 0,
          available_properties: availableProperties || 0,
          total_bookings: totalBookings,
          confirmed_bookings: confirmedBookings,
          total_revenue: totalRevenue
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('dashboard_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'bookings'
      }, () => {
        fetchStats();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'properties'
      }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { stats, loading, error };
}