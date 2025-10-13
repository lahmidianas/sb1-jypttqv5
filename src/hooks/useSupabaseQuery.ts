import { useState, useEffect } from 'react';
import { supabase, supabaseRequest } from '../lib/supabase';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

interface UseSupabaseQueryOptions<T> {
  query: () => PostgrestFilterBuilder<T>;
  dependencies?: any[];
}

export function useSupabaseQuery<T>({ query, dependencies = [] }: UseSupabaseQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await supabaseRequest(query());
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}