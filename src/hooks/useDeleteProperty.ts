import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useDeleteProperty() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProperty = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting property:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteProperty, isDeleting };
}