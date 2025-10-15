import React from 'react';
import { MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '../types';
import { formatLocation, formatPrice } from '../utils/format';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface PropertyCardProps {
  property: Property;
}

const listingTypeLabels = {
  'sale': 'À vendre',
  'long_term_rental': 'Location longue durée',
  'vacation_rental': 'Location saisonnière'
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const images = property.images?.length ? property.images : ['/placeholder.jpg'];

  return (
    <Link 
      to={`/properties/${property.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1"
    >
      <div className="relative h-64">
        <Swiper
          modules={[Pagination, Navigation, Autoplay, A11y]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={images.length > 1}
          a11y={{ enabled: true }}
          className="h-full"
        >
          {images.map((src, idx) => (
            <SwiperSlide key={idx} className="h-full">
              <img
                src={src}
                alt={`${property.title} - photo ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
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
