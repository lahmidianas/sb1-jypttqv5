import React from 'react';
import PropertyCard from '../PropertyCard';
import { Property } from '../../types';
import PropertySkeleton from './PropertySkeleton';

interface PropertyGridProps {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

export default function PropertyGrid({ properties, loading, error }: PropertyGridProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <PropertySkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Aucune annonce trouvée pour votre recherche
        </h3>
        <p className="text-gray-600">
          Essayez d'élargir votre périmètre ou de modifier vos filtres
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}