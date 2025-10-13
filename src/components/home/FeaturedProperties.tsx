import React from 'react';
import { useProperties } from '../../hooks/useProperties';
import PropertyCard from '../PropertyCard';
import { ArrowRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeaturedProperties() {
  const { properties, loading, error } = useProperties();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return null;
  }

  const featuredProperties = properties.slice(0, 3);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Biens en Vedette</h2>
            <p className="text-gray-600">Découvrez notre sélection de propriétés exceptionnelles</p>
          </div>
          <Link 
            to="/properties"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            Voir tous les biens
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}