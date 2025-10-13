import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useClientForm } from '../../../hooks/useClientForm';
import { Client } from '../../../types/client';

interface ClientFormProps {
  initialData?: Client;
  mode?: 'create' | 'edit';
  inline?: boolean;
  onClientCreated?: (clientId: string) => void;
}

export default function ClientForm({ 
  initialData, 
  mode = 'create',
  inline = false,
  onClientCreated 
}: ClientFormProps) {
  const navigate = useNavigate();
  const { formData, errors, loading, handleChange, handleSubmit } = useClientForm(initialData);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleSubmit();
    if (result.success) {
      if (onClientCreated && result.clientId) {
        onClientCreated(result.clientId);
      } else {
        navigate('/admin/clients');
      }
    }
  };

  const formFields = (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom complet
        </label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {errors.full_name && (
          <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Téléphone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="+212 XXX-XXXXXX"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      {errors.submit && (
        <p className="text-red-500 text-sm">{errors.submit}</p>
      )}

      <div className="flex justify-end space-x-4">
        {!inline && (
          <button
            type="button"
            onClick={() => navigate('/admin/clients')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader className="animate-spin h-4 w-4" />}
          {mode === 'create' ? 'Créer le client' : 'Mettre à jour'}
        </button>
      </div>
    </>
  );

  if (inline) {
    return (
      <div className="space-y-4">
        {formFields}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {formFields}
    </form>
  );
}