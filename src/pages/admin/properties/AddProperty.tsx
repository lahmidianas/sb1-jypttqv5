import React from 'react';
import PropertyForm from '../../../components/admin/properties/PropertyForm';
import AdminLayout from '../../../components/admin/layout/AdminLayout';

export default function AddProperty() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Ajouter une propriété</h1>
        <PropertyForm />
      </div>
    </AdminLayout>
  );
}