import React from 'react';
import { FilterProps } from '../../types';

const propertyTypesByListingType = {
  sale: [
    { value: 'apartment', label: 'Appartement' },
    { value: 'villa', label: 'Villa' },
    { value: 'house', label: 'Maison' },
    { value: 'land', label: 'Terrain' },
    { value: 'office', label: 'Bureau' },
    { value: 'commercial', label: 'Local commercial' },
    { value: 'business', label: 'Fonds de commerce' },
    { value: 'factory', label: 'Usine' },
    { value: 'farm', label: 'Ferme' }
  ],
  long_term_rental: [
    { value: 'apartment', label: 'Appartement' },
    { value: 'villa', label: 'Villa' },
    { value: 'house', label: 'Maison' },
    { value: 'office', label: 'Bureau' },
    { value: 'commercial', label: 'Local commercial' },
    { value: 'factory', label: 'Usine' },
    { value: 'farm', label: 'Ferme' }
  ],
  vacation_rental: [
    { value: 'apartment', label: 'Appartement' },
    { value: 'villa', label: 'Villa' },
    { value: 'house', label: 'Maison' },
    { value: 'farm', label: 'Ferme' }
  ]
};

export default function PropertyFilter({ onFilter }: { onFilter: (filters: FilterProps) => void }) {
  const [filters, setFilters] = React.useState<FilterProps>({
    type: '',
    location: '',
    priceRange: '',
    listingType: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };

    // Reset property type when listing type changes
    if (name === 'listingType') {
      newFilters.type = '';
    }

    setFilters(newFilters);
    onFilter(newFilters);
  };

  const availablePropertyTypes = filters.listingType 
    ? propertyTypesByListingType[filters.listingType as keyof typeof propertyTypesByListingType] 
    : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="grid md:grid-cols-4 gap-4">
        <select
          name="listingType"
          value={filters.listingType}
          onChange={handleChange}
          className="w-full p-3 rounded border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">Type d'annonce</option>
          <option value="sale">À vendre</option>
          <option value="long_term_rental">Location longue durée</option>
          <option value="vacation_rental">Location saisonnière</option>
        </select>

        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          disabled={!filters.listingType}
          className="w-full p-3 rounded border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Type de bien</option>
          {availablePropertyTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <select
          name="location"
          value={filters.location}
          onChange={handleChange}
          className="w-full p-3 rounded border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">Quartier</option>
          <option value="medina">Médina</option>
          <option value="malabata">Malabata</option>
          <option value="centre">Centre-ville</option>
        </select>

        <select
          name="priceRange"
          value={filters.priceRange}
          onChange={handleChange}
          className="w-full p-3 rounded border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">Prix</option>
          <option value="0-100">0-100€</option>
          <option value="100-200">100-200€</option>
          <option value="200+">200€+</option>
        </select>
      </div>
    </div>
  );
}