import { useState } from 'react';
import { sendBookingRequest } from '../services/email';
import { formatDate } from '../utils/format';

interface UseBookingRequestFormProps {
  propertyId: string;
  propertyTitle: string;
  selectedDates: [Date | null, Date | null];
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

export function useBookingRequestForm({
  propertyId,
  propertyTitle,
  selectedDates
}: UseBookingRequestFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startDate, endDate] = selectedDates;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      setError('Veuillez sélectionner vos dates de séjour');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const success = await sendBookingRequest({
        propertyId,
        propertyTitle,
        checkIn: formatDate(startDate),
        checkOut: formatDate(endDate),
        ...formData
      });

      if (success) {
        setSuccess(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        throw new Error('Échec de l\'envoi de la demande');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
      console.error('Error sending booking request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return {
    formData,
    loading,
    success,
    error,
    handleSubmit,
    handleChange
  };
}