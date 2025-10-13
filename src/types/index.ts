export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'apartment' | 'villa' | 'house' | 'land' | 'office' | 'commercial' | 'business' | 'factory' | 'farm';
  listingType: 'sale' | 'long_term_rental' | 'vacation_rental';
  location: string;
  city: string;
  price: number;
  images: string[];
  features: string[];
  available: boolean;
  status?: string;
  address?: string;
  videoUrl?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface FilterProps {
  type: string;
  location: string;
  priceRange: string;
  listingType?: string;
  city?: string;
}

export type Language = 'fr' | 'en';