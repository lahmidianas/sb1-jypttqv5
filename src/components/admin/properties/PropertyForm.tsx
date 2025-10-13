import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertyForm } from '../../../hooks/usePropertyForm';
import { supabase } from '../../../lib/supabase';
import { Loader, Plus, X } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { Property } from '../../../types';
import { validateYouTubeUrl } from '../../../utils/youtube';
import { formatPrice } from '../../../utils/format';

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

const cities = {
  'tanger': {
    label: 'Tanger',
    districts: [
      { value: 'medina', label: 'Médina' },
      { value: 'malabata', label: 'Malabata' },
      { value: 'centre_ville', label: 'Centre-ville' },
      { value: 'california', label: 'California' },
      { value: 'iberia', label: 'Iberia' },
      { value: 'boukhalef', label: 'Boukhalef' },
      { value: 'achakar', label: 'Achakar' },
      { value: 'cap_spartel', label: 'Cap Spartel' },
      { value: 'branes', label: 'Branes' },
      { value: 'moujahidine', label: 'Moujahidine' }
    ]
  },
  'tetouan': {
    label: 'Tétouan',
    districts: [
      { value: 'medina', label: 'Médina' },
      { value: 'centre_ville', label: 'Centre-ville' },
      { value: 'martil', label: 'Martil' },
      { value: 'fnideq', label: 'Fnideq' },
      { value: 'mdiq', label: "M'diq" }
    ]
  },
  'casablanca': {
    label: 'Casablanca',
    districts: [
      { value: 'anfa', label: 'Anfa' },
      { value: 'maarif', label: 'Maârif' },
      { value: 'ain_diab', label: 'Aïn Diab' },
      { value: 'californie', label: 'Californie' },
      { value: 'gauthier', label: 'Gauthier' },
      { value: 'racine', label: 'Racine' },
      { value: 'bourgogne', label: 'Bourgogne' }
    ]
  },
  'rabat': {
    label: 'Rabat',
    districts: [
      { value: 'agdal', label: 'Agdal' },
      { value: 'hay_riad', label: 'Hay Riad' },
      { value: 'medina', label: 'Médina' },
      { value: 'souissi', label: 'Souissi' },
      { value: 'hassan', label: 'Hassan' }
    ]
  },
  'marrakech': {
    label: 'Marrakech',
    districts: [
      { value: 'medina', label: 'Médina' },
      { value: 'gueliz', label: 'Guéliz' },
      { value: 'hivernage', label: 'Hivernage' },
      { value: 'palmeraie', label: 'Palmeraie' },
      { value: 'amelkis', label: 'Amelkis' }
    ]
  },
  'fes': {
    label: 'Fès',
    districts: [
      { value: 'medina', label: 'Médina' },
      { value: 'ville_nouvelle', label: 'Ville Nouvelle' },
      { value: 'atlas', label: 'Atlas' },
      { value: 'saiss', label: 'Saïss' }
    ]
  },
  'agadir': {
    label: 'Agadir',
    districts: [
      { value: 'centre_ville', label: 'Centre-ville' },
      { value: 'founty', label: 'Founty' },
      { value: 'sonaba', label: 'Sonaba' },
      { value: 'talborjt', label: 'Talborjt' }
    ]
  }
};

const defaultFeatures = [
  'Wifi',
  'Air Conditioning',
  'Pool',
  'Parking',
  'Terrace',
  'Sea View',
  'Garden',
  '24/7 Security'
];

interface PropertyFormProps {
  property?: Property;
  mode?: 'create' | 'edit';
}

export default function PropertyForm({ property, mode = 'create' }: PropertyFormProps) {
  const navigate = useNavigate();
  const { formData, errors, setErrors, handleChange, validateForm } = usePropertyForm(property);
  const [loading, setLoading] = React.useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [customFeatures, setCustomFeatures] = useState<string[]>(
    property?.features?.filter(f => !defaultFeatures.includes(f)) || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Utiliser les valeurs manuelles si elles existent, sinon les valeurs des menus déroulants
      const finalCity = formData.customCity?.trim() || formData.city;
      const finalLocation = formData.customLocation?.trim() || formData.location;

      // Validation des doublons pour la saisie manuelle
      if (formData.customCity?.trim()) {
        const cityExists = Object.entries(cities).some(([key, { label }]) => 
          key === formData.customCity?.trim() || label.toLowerCase() === formData.customCity?.trim().toLowerCase()
        );
        if (cityExists) {
          setErrors(prev => ({
            ...prev,
            customCity: 'Cette ville existe déjà dans la liste. Utilisez le menu déroulant.'
          }));
          return;
        }
      }

      if (formData.customLocation?.trim()) {
        const locationExists = Object.values(cities).some(city =>
          city.districts.some(district => 
            district.value === formData.customLocation?.trim() || 
            district.label.toLowerCase() === formData.customLocation?.trim().toLowerCase()
          )
        );
        if (locationExists) {
          setErrors(prev => ({
            ...prev,
            customLocation: 'Ce quartier existe déjà dans la liste. Utilisez le menu déroulant.'
          }));
          return;
        }
      }
      const propertyData = {
        ...formData,
        city: finalCity,
        location: finalLocation,
        price: parseFloat(formData.price),
        available: true
      };

      const { error } = property 
        ? await supabase
            .from('properties')
            .update(propertyData)
            .eq('id', property.id)
        : await supabase
            .from('properties')
            .insert([propertyData]);

      if (error) throw error;
      
      navigate('/admin/properties');
    } catch (err) {
      console.error('Error saving property:', err);
      setErrors(prev => ({
        ...prev,
        submit: 'Erreur lors de la sauvegarde. Veuillez réessayer.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleImagesChange = (images: string[]) => {
    handleChange({
      target: {
        name: 'images',
        value: images
      }
    } as any);
  };

  const handleFeatureChange = (feature: string) => {
    const features = formData.features || [];
    const newFeatures = features.includes(feature)
      ? features.filter(f => f !== feature)
      : [...features, feature];
    
    handleChange({
      target: {
        name: 'features',
        value: newFeatures
      }
    } as any);
  };

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFeature.trim()) {
      const newFeatures = [...customFeatures, newFeature.trim()];
      setCustomFeatures(newFeatures);
      handleChange({
        target: {
          name: 'features',
          value: [...(formData.features || []), newFeature.trim()]
        }
      } as any);
      setNewFeature('');
    }
  };

  const handleRemoveCustomFeature = (feature: string) => {
    setCustomFeatures(customFeatures.filter(f => f !== feature));
    handleChange({
      target: {
        name: 'features',
        value: (formData.features || []).filter(f => f !== feature)
      }
    } as any);
  };

  const availablePropertyTypes = formData.listingType 
    ? propertyTypesByListingType[formData.listingType as keyof typeof propertyTypesByListingType] 
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
        <ImageUploader
          images={formData.images || []}
          onChange={handleImagesChange}
          maxImages={10}
        />
        {errors.images && (
          <p className="text-red-500 text-sm mt-2">{errors.images}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lien vidéo YouTube (optionnel)
        </label>
        <input
          type="text"
          name="videoUrl"
          value={formData.videoUrl || ''}
          onChange={(e) => {
            const url = e.target.value;
            if (!url || validateYouTubeUrl(url)) {
              handleChange(e);
            }
          }}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {formData.videoUrl && !validateYouTubeUrl(formData.videoUrl) && (
          <p className="text-red-500 text-sm mt-1">Veuillez entrer une URL YouTube valide</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Formats acceptés : youtube.com/watch, youtu.be, youtube.com/embed
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type d'annonce
          </label>
          <select
            name="listingType"
            value={formData.listingType}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Sélectionner le type d'annonce</option>
            <option value="sale">À vendre</option>
            <option value="long_term_rental">Location longue durée</option>
            <option value="vacation_rental">Location saisonnière</option>
          </select>
          {errors.listingType && <p className="text-red-500 text-sm mt-1">{errors.listingType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de bien
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={!formData.listingType}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Sélectionner le type de bien</option>
            {availablePropertyTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix {formData.listingType === 'vacation_rental' ? '/ nuit' : 
                 formData.listingType === 'long_term_rental' ? '/ mois' : ''}
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          {formData.price && (
            <p className="text-sm text-gray-500 mt-1">
              Prix affiché: {formatPrice(parseFloat(formData.price), formData.listingType)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ville
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Sélectionner une ville</option>
            {Object.entries(cities).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <div className="mt-2">
            <input
              type="text"
              name="customCity"
              value={formData.customCity}
              onChange={handleChange}
              placeholder="Autre ville (saisie manuelle)"
              className="w-full p-2 text-sm rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si vous saisissez une ville ici, elle remplacera la sélection ci-dessus
            </p>
          </div>
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          {errors.customCity && <p className="text-red-500 text-sm mt-1">{errors.customCity}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quartier
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            disabled={!formData.city}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Sélectionner un quartier</option>
            {formData.city && cities[formData.city]?.districts.map(district => (
              <option key={district.value} value={district.value}>
                {district.label}
              </option>
            ))}
          </select>
          <div className="mt-2">
            <input
              type="text"
              name="customLocation"
              value={formData.customLocation}
              onChange={handleChange}
              placeholder="Autre quartier (saisie manuelle)"
              className="w-full p-2 text-sm rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si vous saisissez un quartier ici, il remplacera la sélection ci-dessus
            </p>
          </div>
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          {errors.customLocation && <p className="text-red-500 text-sm mt-1">{errors.customLocation}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Caractéristiques
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {defaultFeatures.map(feature => (
            <label key={feature} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.features?.includes(feature)}
                onChange={() => handleFeatureChange(feature)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{feature}</span>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Caractéristiques personnalisées</h4>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Ajouter une caractéristique"
              className="flex-1 p-2 border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleAddCustomFeature}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </button>
          </div>

          {customFeatures.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomFeature(feature)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/admin/properties')}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading || (formData.videoUrl && !validateYouTubeUrl(formData.videoUrl))}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader className="animate-spin h-4 w-4" />}
          {mode === 'create' ? 'Créer' : 'Mettre à jour'}
        </button>
      </div>
    </form>
  );
}