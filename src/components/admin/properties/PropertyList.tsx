import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PropertiesTable from './PropertiesTable';
import { useProperties } from '../../../hooks/useProperties';

export default function PropertyList() {
  const navigate = useNavigate();
  const { properties, loading, error } = useProperties();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Properties</h1>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <button
          onClick={() => navigate('/admin/properties/new')}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Property
        </button>
      </div>
      <PropertiesTable properties={properties} loading={loading} error={error} />
    </div>
  );
}