import React from 'react';
import ClientForm from '../../../components/admin/clients/ClientForm';

export default function NewClient() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Nouveau Client</h1>
      <div className="max-w-2xl mx-auto">
        <ClientForm mode="create" />
      </div>
    </div>
  );
}