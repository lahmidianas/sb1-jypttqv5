import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ClientFormData, ClientFormErrors, Client } from '../types/client';

const initialFormData: ClientFormData = {
  full_name: '',
  email: '',
  phone: '',
  address: ''
};

export function useClientForm(initialData?: Client) {
  const [formData, setFormData] = useState<ClientFormData>(
    initialData || initialFormData
  );
  const [errors, setErrors] = useState<ClientFormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ClientFormErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return { success: false };
      }

      setLoading(true);
      setErrors({});

      const { data, error } = initialData?.id
        ? await supabase
            .from('clients')
            .update({
              full_name: formData.full_name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address
            })
            .eq('id', initialData.id)
            .select()
            .single()
        : await supabase
            .from('clients')
            .insert([{
              full_name: formData.full_name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address
            }])
            .select()
            .single();

      if (error) throw error;

      return { 
        success: true,
        clientId: data?.id
      };
    } catch (error) {
      console.error('Error saving client:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save client'
      }));
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof ClientFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit
  };
}