import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '../types';
import { formatLocation, formatPrice } from '../utils/format';
import { normalizeSupabaseStorageUrls } from '../utils/supabaseStorage';

interface PropertyCardProps {
  property: Property;
}

const listingTypeLabels = {
  'sale': 'À vendre',
  'long_term_rental': 'Location longue durée',
  'vacation_rental': 'Location saisonnière'
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.images?.length
    ? normalizeSupabaseStorageUrls(property.images)
    : ['/placeholder.jpg'];
  const currentImage = images[currentImageIndex] || images[0];

  const showPreviousImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentImageIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  };

  const showNextImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentImageIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  };

  const jumpToImage = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <Link 
      to={`/properties/${property.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1"
    >
      <div className="relative h-64">
        <img
          src={currentImage}
          alt={`${property.title} - photo ${currentImageIndex + 1}`}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover bg-gray-100"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              aria-label="Image precedente"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-primary shadow transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={showNextImage}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-primary shadow transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/70 px-3 py-2 backdrop-blur-sm">
              {images.slice(0, 8).map((_, index) => (
                <button
                  key={`${property.id}-dot-${index}`}
                  type="button"
                  onClick={(event) => jumpToImage(event, index)}
                  aria-label={`Voir image ${index + 1}`}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    index === currentImageIndex ? 'bg-primary' : 'bg-primary/25'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        <div className="pointer-events-none absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full text-sm font-semibold text-primary">
          {property.type}
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
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
            <span>{formatPrice(property.price, property.listingType)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
