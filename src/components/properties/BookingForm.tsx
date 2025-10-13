import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_BOOKING } from '../../graphql/mutations/bookings';
import DatePicker from '../common/DatePicker';
import { calculateTotalPrice } from '../../utils/bookings';
import { useAuthContext } from '../../contexts/AuthContext';

interface BookingFormProps {
  propertyId: string;
  price: number;
}

export default function BookingForm({ propertyId, price }: BookingFormProps) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [dates, setDates] = useState({
    checkIn: null as Date | null,
    checkOut: null as Date | null
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [createBooking, { loading }] = useMutation(CREATE_BOOKING);

  const handleDateChange = (type: 'checkIn' | 'checkOut', date: Date | null) => {
    setDates(prev => ({ ...prev, [type]: date }));
    
    if (date && dates[type === 'checkIn' ? 'checkOut' : 'checkIn']) {
      const start = type === 'checkIn' ? date : dates.checkIn!;
      const end = type === 'checkOut' ? date : dates.checkOut!;
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setTotalPrice(price * nights);
    } else {
      setTotalPrice(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!dates.checkIn || !dates.checkOut) return;

    try {
      await createBooking({
        variables: {
          input: {
            propertyId,
            checkIn: dates.checkIn.toISOString().split('T')[0],
            checkOut: dates.checkOut.toISOString().split('T')[0]
          }
        }
      });

      navigate('/bookings');
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">
          Date d'arrivée
        </label>
        <DatePicker
          id="check-in"
          selected={dates.checkIn}
          onChange={(date) => handleDateChange('checkIn', date)}
          minDate={new Date()}
          className="w-full p-3 rounded border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">
          Date de départ
        </label>
        <DatePicker
          id="check-out"
          selected={dates.checkOut}
          onChange={(date) => handleDateChange('checkOut', date)}
          minDate={dates.checkIn || new Date()}
          className="w-full p-3 rounded border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {totalPrice > 0 && (
        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm mb-2">
            <span>Prix total</span>
            <span className="font-semibold">{totalPrice}€</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !dates.checkIn || !dates.checkOut}
        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Réservation en cours...' : 'Réserver'}
      </button>
    </form>
  );
}