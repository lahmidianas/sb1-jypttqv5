import React from 'react';
import { MapPin, Euro, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '../types';
import { formatLocation, formatPrice } from '../utils/format';

interface PropertyCardProps {
  property: Property;
}

const listingTypeLabels = {
  'sale': 'À vendre',
  'long_term_rental': 'Location longue durée',
  'vacation_rental': 'Location saisonnière'
};

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link 
      to={`/properties/${property.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1"
    >
      <div className="relative h-64">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary">
          {property.type}
        </div>
        <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
          <Tag className="h-4 w-4" />
          {listingTypeLabels[property.listingType]}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-primary">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{formatLocation(property.city, property.location)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-primary font-semibold">
            <Euro className="h-4 w-4 mr-1" />
            <span>{formatPrice(property.price, property.listingType)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}