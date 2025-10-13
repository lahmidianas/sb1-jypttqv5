import React from 'react';
import PropertyForm from '../../../components/admin/properties/PropertyForm';

export default function NewProperty() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Add New Property</h1>
      <PropertyForm mode="create" />
    </div>
  );
}