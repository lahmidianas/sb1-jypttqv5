export interface PropertyFormData {
  title: string;
  type: string;
  description: string;
  city: string;
  location: string;
  customCity: string;
  customLocation: string;
  address: string;
  features: string[];
  images: string[];
  price: string;
  status: 'available' | 'occupied' | 'maintenance';
  listingType: 'sale' | 'long_term_rental' | 'vacation_rental';
  videoUrl?: string;
}

export interface PropertyFormErrors {
  title?: string;
  type?: string;
  description?: string;
  city?: string;
  location?: string;
  customCity?: string;
  customLocation?: string;
  address?: string;
  features?: string;
  images?: string;
  price?: string;
  listingType?: string;
  videoUrl?: string;
}

export interface PropertyFormProps {
  formData: PropertyFormData;
  errors: PropertyFormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export type PropertyType = 
  | 'apartment'
  | 'villa' 
  | 'house'
  | 'land'
  | 'office'
  | 'commercial'
  | 'business'
  | 'factory'
  | 'farm';