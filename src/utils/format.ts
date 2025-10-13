import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatPrice(price: number, listingType?: string): string {
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);

  switch (listingType) {
    case 'vacation_rental':
      return `${formattedPrice} /nuit`;
    case 'long_term_rental':
      return `${formattedPrice} /mois`;
    default:
      return formattedPrice;
  }
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: fr });
}

export function formatLocation(city?: string, district?: string): string {
  const cityMap: { [key: string]: string } = {
    'tanger': 'Tanger',
    'tetouan': 'Tétouan',
    'casablanca': 'Casablanca',
    'rabat': 'Rabat',
    'marrakech': 'Marrakech',
    'fes': 'Fès',
    'agadir': 'Agadir'
  };

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

  // Si la ville n'est pas dans le mapping, l'afficher telle quelle (saisie manuelle)
  const formattedCity = city ? (cityMap[city] || city) : '';
  
  // Si le quartier n'est pas dans le mapping, l'afficher tel quel (saisie manuelle)
  const formattedDistrict = district ? (
    city && districtMap[city]?.[district] ? districtMap[city][district] : district
  ) : '';

  if (formattedCity && formattedDistrict) {
    return `${formattedCity} - ${formattedDistrict}`;
  }
  return formattedCity || formattedDistrict || '';
}