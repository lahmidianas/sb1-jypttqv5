import React from 'react';
import { useParams } from 'react-router-dom';
import ClientForm from '../../../components/admin/clients/ClientForm';
import { useClient } from '../../../hooks/useClient';
import { Loader } from 'lucide-react';

export default function EditClient() {
  const { id } = useParams();
  const { client, loading, error } = useClient(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center text-red-500 py-8">
        {error || 'Client not found'}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Modifier le Client</h1>
      <div className="max-w-2xl mx-auto">
        <ClientForm initialData={client} mode="edit" />
      </div>
    </div>
  );
}