import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PropertyCard from '../PropertyCard';
import { Property } from '../../types';
import { formatPrice, formatLocation } from '../../utils/format';

describe('PropertyCard', () => {
  const mockProperty: Property = {
    id: '1',
    title: 'Test Property',
    description: 'A test property description',
    type: 'apartment',
    listingType: 'vacation_rental',
    city: 'tanger',
    location: 'Test Location',
    price: 100,
    images: ['https://example.com/image.jpg'],
    features: ['WiFi', 'Parking'],
    available: true
  };

  const renderPropertyCard = (property: Property) => {
    render(
      <BrowserRouter>
        <PropertyCard property={property} />
      </BrowserRouter>
    );
  };

  it('renders property details correctly', () => {
    renderPropertyCard(mockProperty);

    expect(screen.getByText(mockProperty.title)).toBeInTheDocument();
    // Expect formatted location (City - District)
    expect(screen.getByText(formatLocation(mockProperty.city, mockProperty.location))).toBeInTheDocument();
    const expectedPrice = formatPrice(mockProperty.price, mockProperty.listingType);
    const normalize = (s: string) => s.replace(/\u00A0/g, ' ');
    expect(
      screen.getByText((text) => normalize(text) === normalize(expectedPrice))
    ).toBeInTheDocument();
    expect(screen.getByText(mockProperty.type)).toBeInTheDocument();
  });

  it('renders property image', () => {
    renderPropertyCard(mockProperty);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockProperty.images[0]);
    expect(image).toHaveAttribute('alt', `${mockProperty.title} - photo 1`);
  });

  it('links to property details page', () => {
    renderPropertyCard(mockProperty);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/properties/${mockProperty.id}`);
  });
});
