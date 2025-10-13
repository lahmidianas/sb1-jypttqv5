import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClient } from '../../../hooks/useClient';
import { useClientBookings } from '../../../hooks/useClientBookings';
import { Edit, ArrowLeft, Phone, Mail, MapPin, Loader, Calendar } from 'lucide-react';
import { formatDate, formatPrice } from '../../../utils/format';
import StatusBadge from '../../../components/admin/bookings/StatusBadge';

export default function ClientDetails() {
  const { id } = useParams();
  const { client, loading: loadingClient, error: clientError } = useClient(id);
  const { bookings, loading: loadingBookings, error: bookingsError } = useClientBookings(id);

  if (loadingClient || loadingBookings) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (clientError || !client) {
    return (
      <div className="text-center text-red-500 py-8">
        {clientError || 'Client not found'}
      </div>
    );
  }

  // Calculate statistics
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalSpent = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/clients"
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">{client.full_name}</h1>
            <p className="text-sm text-gray-500">
              Client depuis {formatDate(client.created_at)}
            </p>
          </div>
        </div>
        <Link
          to={`/admin/clients/edit/${client.id}`}
          className="flex items-center gap-2 text-primary hover:text-primary/80"
        >
          <Edit className="h-5 w-5" />
          Modifier
        </Link>
      </div>

      <div className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Coordonnées</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-5 w-5 flex-shrink-0" />
              <a href={`mailto:${client.email}`} className="hover:text-primary truncate">
                {client.email}
              </a>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-5 w-5 flex-shrink-0" />
              <a href={`tel:${client.phone}`} className="hover:text-primary">
                {client.phone}
              </a>
            </div>
            
            {client.address && (
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <p className="truncate">{client.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Statistiques</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Total des réservations</p>
              <p className="text-2xl font-semibold">{totalBookings}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Réservations confirmées</p>
              <p className="text-2xl font-semibold">{confirmedBookings}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total dépensé</p>
              <p className="text-2xl font-semibold text-primary">{formatPrice(totalSpent)}</p>
            </div>
          </div>
        </div>

        {/* Bookings History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Historique des Réservations</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          {bookingsError ? (
            <p className="text-red-500">{bookingsError}</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500">Aucune réservation trouvée</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Link 
                  key={booking.id}
                  to={`/admin/bookings/${booking.id}`}
                  className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {booking.property?.title || 'Propriété inconnue'}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-600">
                          {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                        </p>
                        <StatusBadge status={booking.status} />
                      </div>
                    </div>
                    <p className="text-lg font-medium text-primary">
                      {formatPrice(booking.total_price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}