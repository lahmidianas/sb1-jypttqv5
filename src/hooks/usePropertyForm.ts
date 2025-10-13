import { useState } from 'react';
import { PropertyFormData } from '../types/property';
import { Property } from '../types';
import { validateYouTubeUrl } from '../utils/youtube';

const initialFormData: PropertyFormData = {
  title: '',
  type: '',
  description: '',
  city: '',
  location: '',
  customCity: '',
  customLocation: '',
  adress: '',
  features: [],
  images: [],
  price: '',
  status: 'available',
  listingType: '',
  videoUrl: ''
};

export function usePropertyForm(property?: Property) {
  const [formData, setFormData] = useState<PropertyFormData>(
    property ? {
      title: property.title,
      type: property.type,
      description: property.description,
      city: property.city || '',
      location: property.location,
      customCity: '',
      customLocation: '',
      adress: property.address || '',
      price: property.price.toString(),
      images: property.images,
      features: property.features,
      status: property.status || 'available',
      listingType: property.listingType || '',
      videoUrl: property.videoUrl || ''
    } : initialFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.type) {
      newErrors.type = 'Property type is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    if (!formData.price || isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Valid price is required';
    }

    if (formData.videoUrl && !validateYouTubeUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Invalid YouTube URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return {
    formData,
    errors,
    setErrors,
    handleChange,
    validateForm
  };
}