import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyGrid from '../components/properties/PropertyGrid';
import { useProperties } from '../hooks/useProperties';
import SEO from '../components/seo/SEO';
import HeroFilter from '../components/properties/HeroFilter';

export default function Properties() {
  const [searchParams] = useSearchParams();
  const listingType = searchParams.get('listingType');
  const propertyType = searchParams.get('type');
  const city = searchParams.get('city');
  const district = searchParams.get('district');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const { properties, loading, error } = useProperties({
    listingType: listingType || undefined,
    type: propertyType || undefined,
    city: city || undefined,
    district: district || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined
  });

  return (
    <>
      <SEO 
        title="Nos Biens"
        description="Découvrez notre sélection de propriétés d'exception au Maroc"
      />
      <div className="pt-24 min-h-screen bg-gray-50">
        {/* Hero Section with Filter */}
        <div className="relative bg-gray-900 py-12 mb-12">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1557696859-ebd88b12be5e?auto=format&fit=crop&q=80")',
            }}
          />
          <div className="relative container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold font-display text-white mb-4">
                Trouvez votre bien idéal
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Des propriétés d'exception sélectionnées pour vous dans les plus belles villes du Maroc
              </p>
            </div>
            <HeroFilter />
          </div>
        </div>

        {/* Properties Grid */}
        <div className="container mx-auto px-4 py-8">
          <PropertyGrid properties={properties} loading={loading} error={error} />
        </div>
      </div>
    </>
  );
}