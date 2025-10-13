import { useState, useEffect } from 'react';
import { Property } from '../types';
import { supabase } from '../lib/supabase';

interface UsePropertiesOptions {
  listingType?: string;
  type?: string;
  city?: string;
  district?: string;
  minPrice?: string;
  maxPrice?: string;
}

export function useProperties(options: UsePropertiesOptions = {}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (options.listingType) {
          query = query.eq('listingType', options.listingType);
        }
        
        if (options.type) {
          query = query.eq('type', options.type);
        }

        if (options.city) {
          query = query.eq('city', options.city);
        }

        if (options.district) {
          query = query.eq('location', options.district);
        }

        if (options.minPrice) {
          query = query.gte('price', parseFloat(options.minPrice));
        }

        if (options.maxPrice) {
          query = query.lte('price', parseFloat(options.maxPrice));
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        setProperties(data || []);
        
      } catch (err) {
        console.error('Error loading properties:', err);
        setError('Une erreur est survenue lors du chargement des biens');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    // Subscribe to changes
    const subscription = supabase
      .channel('properties_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'properties'
      }, () => {
        fetchProperties();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [
    options.listingType,
    options.type,
    options.city,
    options.district,
    options.minPrice,
    options.maxPrice
  ]);

  return { properties, loading, error };
}