import React, { useState } from 'react';
import { useClients } from '../../../hooks/useClients';
import { Search, Loader, Plus } from 'lucide-react';
import ClientForm from './ClientForm';

interface ClientSelectorProps {
  onClientSelect: (clientId: string) => void;
  selectedClientId?: string;
}

export default function ClientSelector({ onClientSelect, selectedClientId }: ClientSelectorProps) {
  const { clients, loading } = useClients();
  const [search, setSearch] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  const filteredClients = clients.filter(client => 
    client.full_name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase()) ||
    client.phone.includes(search)
  );

  const handleClientCreated = (clientId: string) => {
    onClientSelect(clientId);
    setShowNewClientForm(false);
  };

  if (showNewClientForm) {
    return (
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Nouveau Client</h3>
          <button
            onClick={() => setShowNewClientForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Annuler
          </button>
        </div>
        <ClientForm 
          inline 
          onClientCreated={handleClientCreated}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          onClick={() => setShowNewClientForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          Nouveau
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
          {filteredClients.map((client) => (
            <button
              key={client.id}
              onClick={() => onClientSelect(client.id)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between ${
                selectedClientId === client.id ? 'bg-primary/5 border-l-4 border-primary' : ''
              }`}
            >
              <div>
                <p className="font-medium">{client.full_name}</p>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
              <span className="text-sm text-gray-500">{client.phone}</span>
            </button>
          ))}
          {filteredClients.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              Aucun client trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
}