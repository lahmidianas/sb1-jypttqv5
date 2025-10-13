import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface BookingFormData {
  propertyId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  checkIn: string;
  checkOut: string;
  status: 'waiting' | 'confirmed';
}

interface BookingFormOptions {
  initialData?: any;
  onSuccess?: () => void;
}

export function useBookingForm({ initialData = {}, onSuccess }: BookingFormOptions) {
  const [formData, setFormData] = useState<BookingFormData>({
    propertyId: initialData.property_id || '',
    clientName: initialData.client_name || '',
    clientEmail: initialData.client_email || '',
    clientPhone: initialData.client_phone || '',
    checkIn: initialData.check_in || '',
    checkOut: initialData.check_out || '',
    status: initialData.status || 'waiting'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.propertyId) {
      newErrors.propertyId = 'Property is required';
    }

    if (!formData.clientName?.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.clientEmail?.trim()) {
      newErrors.clientEmail = 'Client email is required';
    }

    if (!formData.clientPhone?.trim()) {
      newErrors.clientPhone = 'Client phone is required';
    }

    if (!formData.checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    }

    if (!formData.checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return false;
    }

    try {
      const bookingData = {
        property_id: formData.propertyId,
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhone,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        status: formData.status
      };

      const { error } = initialData.id
        ? await supabase
            .from('bookings')
            .update(bookingData)
            .eq('id', initialData.id)
        : await supabase
            .from('bookings')
            .insert([bookingData]);

      if (error) throw error;
      
      if (onSuccess) {
        onSuccess();
      }
      return true;
    } catch (err) {
      console.error('Error saving booking:', err);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save booking'
      }));
      return false;
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit
  };
}