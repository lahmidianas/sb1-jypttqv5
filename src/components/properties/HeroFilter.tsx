import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const listingTypes = [
  { value: 'sale', label: 'À vendre' },
  { value: 'long_term_rental', label: 'Location' },
  { value: 'vacation_rental', label: 'Vacances' }
];

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

const priceRangesByListingType = {
  vacation_rental: {
    label: 'Budget par nuit',
    ranges: [
      { value: '200', label: '200 MAD' },
      { value: '400', label: '400 MAD' },
      { value: '600', label: '600 MAD' },
      { value: '800', label: '800 MAD' },
      { value: '1000', label: '1,000 MAD' },
      { value: '2000', label: '2,000 MAD' },
      { value: '3000', label: '3,000 MAD' },
      { value: '4000', label: '4,000 MAD' },
      { value: '5000', label: '5,000 MAD' },
      { value: '999999', label: '5,000 MAD ou plus' }
    ]
  },
  long_term_rental: {
    label: 'Budget par mois',
    ranges: [
      { value: '1000', label: '1,000 MAD' },
      { value: '2000', label: '2,000 MAD' },
      { value: '4000', label: '4,000 MAD' },
      { value: '6000', label: '6,000 MAD' },
      { value: '8000', label: '8,000 MAD' },
      { value: '10000', label: '10,000 MAD' },
      { value: '15000', label: '15,000 MAD' },
      { value: '20000', label: '20,000 MAD' },
      { value: '999999', label: '20,000 MAD ou plus' }
    ]
  },
  sale: {
    label: 'Budget total',
    ranges: [
      { value: '100000', label: '100,000 MAD' },
      { value: '200000', label: '200,000 MAD' },
      { value: '500000', label: '500,000 MAD' },
      { value: '1000000', label: '1,000,000 MAD' },
      { value: '2000000', label: '2,000,000 MAD' },
      { value: '3000000', label: '3,000,000 MAD' },
      { value: '4000000', label: '4,000,000 MAD' },
      { value: '5000000', label: '5,000,000 MAD' },
      { value: '999999999', label: '5,000,000 MAD ou plus' }
    ]
  }
};

interface Location {
  city: string;
  district: string;
  cityLabel: string;
  districtLabel: string;
}

export default function HeroFilter() {
  const navigate = useNavigate();
  const [activeListingType, setActiveListingType] = useState('vacation_rental');
  const [propertyType, setPropertyType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  useEffect(() => {
    const fetchLocations = async () => {
      if (!searchTerm.trim()) {
        setLocations([]);
        return;
      }

      const { data } = await supabase
        .from('properties')
        .select('city, location')
        .or(`city.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
        .limit(10);

      if (data) {
        const uniqueLocations = Array.from(new Set(data.map(item => `${item.city}-${item.location}`)))
          .map(combined => {
            const [city, district] = combined.split('-');
            return {
              city,
              district,
              cityLabel: getCityLabel(city),
              districtLabel: getDistrictLabel(city, district)
            };
          });
        setLocations(uniqueLocations);
      }
    };

    const timeoutId = setTimeout(fetchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getCityLabel = (cityCode: string): string => {
    const cityMap: { [key: string]: string } = {
      'tanger': 'Tanger',
      'tetouan': 'Tétouan',
      'casablanca': 'Casablanca',
      'rabat': 'Rabat',
      'marrakech': 'Marrakech',
      'fes': 'Fès',
      'agadir': 'Agadir'
    };
    return cityMap[cityCode] || cityCode;
  };

  const getDistrictLabel = (cityCode: string, districtCode: string): string => {
    const districtMap: { [key: string]: { [key: string]: string } } = {
      'tanger': {
        'medina': 'Médina',
        'malabata': 'Malabata',
        'centre_ville': 'Centre-ville',
        'california': 'California',
        'iberia': 'Iberia',
        'boukhalef': 'Boukhalef',
        'achakar': 'Achakar',
        'cap_spartel': 'Cap Spartel',
        'branes': 'Branes',
        'moujahidine': 'Moujahidine'
      }
    };
    return districtMap[cityCode]?.[districtCode] || districtCode;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeListingType) params.append('listingType', activeListingType);
    if (propertyType) params.append('type', propertyType);
    if (selectedLocation) {
      params.append('city', selectedLocation.city);
      params.append('district', selectedLocation.district);
    }
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice === '999999' || maxPrice === '999999999' ? '999999999' : maxPrice);
    navigate(`/properties?${params.toString()}`);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setSearchTerm(`${location.cityLabel} - ${location.districtLabel}`);
    setShowSuggestions(false);
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    setSearchTerm('');
  };

  const handleListingTypeChange = (type: string) => {
    setActiveListingType(type);
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
  };

  const currentPriceRanges = priceRangesByListingType[activeListingType as keyof typeof priceRangesByListingType];

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Listing Type Selector */}
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-100 p-1 rounded-xl">
            {listingTypes.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleListingTypeChange(type.value)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeListingType === type.value
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Property Type Dropdown */}
          <div className="relative">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary appearance-none bg-white"
            >
              <option value="">Type de logement</option>
              {propertyTypesByListingType[activeListingType as keyof typeof propertyTypesByListingType]
                .map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
            </select>
          </div>

          {/* Location Search with Suggestions */}
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Où cherchez-vous ?"
                className="w-full p-4 pl-10 pr-12 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearLocation}
                  className="absolute right-12 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Location Suggestions */}
            {showSuggestions && locations.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border max-h-60 overflow-y-auto">
                {locations.map((location, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      {location.cityLabel} - {location.districtLabel}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Budget Range */}
        <div className="flex justify-center mt-6">
          <div className="w-full max-w-2xl">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              {currentPriceRanges.label}
            </label>
            <div className="flex gap-4 items-center">
              <select
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  if (maxPrice && parseInt(e.target.value) > parseInt(maxPrice)) {
                    setMaxPrice('');
                  }
                }}
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">Prix minimum</option>
                {currentPriceRanges.ranges.slice(0, -1).map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <span className="text-gray-500">à</span>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">Prix maximum</option>
                {currentPriceRanges.ranges.filter(range => 
                  !minPrice || parseInt(range.value) >= parseInt(minPrice)
                ).map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}