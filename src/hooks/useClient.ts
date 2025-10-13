import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Client } from '../types/client';

export function useClient(id?: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setClient(data);
      } catch (err) {
        console.error('Error loading client:', err);
        setError('Failed to load client');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  return { client, loading, error };
}