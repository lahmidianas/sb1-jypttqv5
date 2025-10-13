import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingForm } from '../../../hooks/useBookingForm';
import { Property } from '../../../types/property';
import { Client } from '../../../types/client';
import DatePicker from '../../common/DatePicker';
import { Loader, Search } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface BookingFormProps {
  properties: Property[];
  initialData?: any;
  mode?: 'create' | 'edit';
}

export default function BookingForm({ properties, initialData, mode = 'create' }: BookingFormProps) {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const { formData, errors, handleChange, handleSubmit } = useBookingForm({
    initialData,
    onSuccess: () => navigate('/admin/bookings')
  });

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .ilike('full_name', `%${searchTerm}%`)
        .limit(5);
      setClients(data || []);
    };

    if (searchTerm) {
      fetchClients();
    }
  }, [searchTerm]);

  const handlePropertySelect = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    setSelectedProperty(property || null);
    handleChange({
      target: { name: 'propertyId', value: propertyId }
    } as any);
  };

  const handleClientSelect = (client: Client) => {
    handleChange({
      target: { name: 'clientName', value: client.full_name }
    } as any);
    handleChange({
      target: { name: 'clientEmail', value: client.email }
    } as any);
    handleChange({
      target: { name: 'clientPhone', value: client.phone }
    } as any);
    setSearchTerm('');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Property Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Property Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Property
            </label>
            <select
              name="propertyId"
              value={formData.propertyId}
              onChange={(e) => handlePropertySelect(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Select a property</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </select>
            {errors.propertyId && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyId}</p>
            )}
          </div>

          {selectedProperty && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">{selectedProperty.title}</h4>
              <p className="text-sm text-gray-600">{selectedProperty.location}</p>
              <p className="text-sm text-gray-600 mt-1">
                Price per night: {selectedProperty.price}€
              </p>
              <div className="mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedProperty.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedProperty.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Client Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Client Information</h3>
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Client
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by client name..."
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {searchTerm && clients.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border">
                {clients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => handleClientSelect(client)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="font-medium">{client.full_name}</div>
                    <div className="text-sm text-gray-600">{client.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.clientName && (
                <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Email
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.clientEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.clientEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Phone
              </label>
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.clientPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.clientPhone}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Booking Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date
            </label>
            <DatePicker
              selected={formData.checkIn ? new Date(formData.checkIn) : null}
              onChange={(date) => handleChange({
                target: { name: 'checkIn', value: date?.toISOString().split('T')[0] || '' }
              } as any)}
              minDate={new Date()}
              placeholderText="Select check-in date"
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {errors.checkIn && (
              <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out Date
            </label>
            <DatePicker
              selected={formData.checkOut ? new Date(formData.checkOut) : null}
              onChange={(date) => handleChange({
                target: { name: 'checkOut', value: date?.toISOString().split('T')[0] || '' }
              } as any)}
              minDate={formData.checkIn ? new Date(formData.checkIn) : new Date()}
              placeholderText="Select check-out date"
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {errors.checkOut && (
              <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="waiting">Waiting</option>
            <option value="confirmed">Confirmed</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status}</p>
          )}
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{errors.submit}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/admin/bookings')}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader className="animate-spin h-4 w-4" />}
          {mode === 'create' ? 'Create Booking' : 'Update Booking'}
        </button>
      </div>
    </form>
  );
}