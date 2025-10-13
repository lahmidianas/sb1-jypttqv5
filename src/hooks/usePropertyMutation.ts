import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PropertyFormData } from '../types/property';

export function usePropertyMutation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProperty = async (data: PropertyFormData, id?: string) => {
    try {
      setLoading(true);
      setError(null);

      const propertyData = {
        ...data,
        price: parseFloat(data.price),
        available: data.status === 'available'
      };

      const { error: saveError } = id
        ? await supabase
            .from('properties')
            .update(propertyData)
            .eq('id', id)
        : await supabase
            .from('properties')
            .insert([propertyData]);

      if (saveError) throw saveError;
      
      navigate('/admin/properties');
    } catch (err) {
      console.error('Error saving property:', err);
      setError('Failed to save property');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { saveProperty, loading, error };
}