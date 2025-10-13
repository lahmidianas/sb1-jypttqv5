import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye, Loader } from 'lucide-react';
import { Client } from '../../../types/client';
import { formatDate } from '../../../utils/format';
import ConfirmDialog from '../common/ConfirmDialog';

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => Promise<void>;
}

export default function ClientsTable({ 
  clients, 
  loading, 
  error,
  onDelete 
}: ClientsTableProps) {
  const navigate = useNavigate();
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setClientToDelete(id);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      await onDelete(clientToDelete);
    } catch (err) {
      setDeleteError('Failed to delete client');
    } finally {
      setClientToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">{error}</div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {deleteError && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700">{deleteError}</p>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date d'ajout</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/admin/clients/${client.id}`)}
                      className="text-gray-600 hover:text-primary"
                      title="Voir les détails"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/clients/edit/${client.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Modifier"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(client.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {client.full_name}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {client.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {client.phone}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(client.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!clientToDelete}
        title="Supprimer le client"
        message="Êtes-vous sûr de vouloir supprimer ce client ? Cette action ne peut pas être annulée."
        onConfirm={handleConfirmDelete}
        onCancel={() => setClientToDelete(null)}
      />
    </>
  );
}