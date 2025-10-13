import { Property } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Villa Vue sur Mer',
    description: 'Magnifique villa avec vue panoramique sur la mer',
    type: 'villa',
    location: 'Malabata',
    price: 250,
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80'],
    features: ['Piscine', 'Jardin', 'Parking'],
    available: true
  },
  {
    id: '2',
    title: 'Appartement Médina',
    description: 'Charmant appartement au cœur de la médina',
    type: 'apartment',
    location: 'Médina',
    price: 80,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80'],
    features: ['Wifi', 'Climatisation', 'Terrasse'],
    available: true
  },
  {
    id: '3',
    title: 'Maison Traditionnelle',
    description: 'Authentique maison marocaine rénovée',
    type: 'traditional',
    location: 'Médina',
    price: 150,
    images: ['https://images.unsplash.com/photo-1527359443443-84a48aec73d2?auto=format&fit=crop&q=80'],
    features: ['Patio', 'Fontaine', 'Salon Marocain'],
    available: true
  }
];