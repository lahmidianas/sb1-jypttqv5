import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DatePicker from '../common/DatePicker';

export default function HeroSearch() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    checkIn: '',
    checkOut: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="w-full p-3 rounded border border-gray-200 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6]"
          >
            <option value="">Type de bien</option>
            <option value="apartment">Appartement</option>
            <option value="villa">Villa</option>
            <option value="traditional">Maison traditionnelle</option>
          </select>
        </div>

        <div>
          <select
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="w-full p-3 rounded border border-gray-200 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6]"
          >
            <option value="">Quartier</option>
            <option value="medina">Médina</option>
            <option value="malabata">Malabata</option>
            <option value="centre">Centre-ville</option>
          </select>
        </div>

        <DatePicker
          selected={filters.checkIn ? new Date(filters.checkIn) : null}
          onChange={(date) => setFilters(prev => ({ 
            ...prev, 
            checkIn: date ? date.toISOString().split('T')[0] : '' 
          }))}
          placeholderText="Date d'arrivée"
          minDate={new Date()}
          className="w-full p-3 rounded border border-gray-200 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6]"
        />

        <DatePicker
          selected={filters.checkOut ? new Date(filters.checkOut) : null}
          onChange={(date) => setFilters(prev => ({ 
            ...prev, 
            checkOut: date ? date.toISOString().split('T')[0] : '' 
          }))}
          placeholderText="Date de départ"
          minDate={filters.checkIn ? new Date(filters.checkIn) : new Date()}
          className="w-full p-3 rounded border border-gray-200 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6]"
        />
      </div>

      <div className="mt-4 flex justify-center">
        <button 
          type="submit"
          className="bg-[#0077B6] text-white px-8 py-3 rounded-lg hover:bg-[#005d8f] transition-colors flex items-center justify-center gap-2"
        >
          <Search className="h-5 w-5" />
          <span>Rechercher</span>
        </button>
      </div>
    </form>
  );
}