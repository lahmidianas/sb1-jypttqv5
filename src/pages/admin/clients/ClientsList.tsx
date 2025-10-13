import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ClientsTable from '../../../components/admin/clients/ClientsTable';
import { useClients } from '../../../hooks/useClients';

export default function ClientsList() {
  const navigate = useNavigate();
  const { clients, loading, error, deleteClient } = useClients();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-gray-600">Gérez votre base de clients</p>
        </div>
        <button
          onClick={() => navigate('/admin/clients/new')}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Ajouter un client
        </button>
      </div>
      
      <ClientsTable 
        clients={clients} 
        loading={loading} 
        error={error}
        onDelete={deleteClient}
      />
    </div>
  );
}