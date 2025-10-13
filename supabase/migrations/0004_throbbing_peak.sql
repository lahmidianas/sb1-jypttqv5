/*
  # Ajout des propriétés initiales

  1. Nouvelles données
    - Ajout de plusieurs propriétés avec des détails complets
    
  2. Modifications
    - Suppression des réservations existantes
    - Mise à jour du statut de disponibilité
*/

-- Supprimer les réservations existantes
DELETE FROM bookings;

-- Insérer les nouvelles propriétés
INSERT INTO properties (title, description, type, location, price, images, features, available) VALUES
(
  'Villa Panorama',
  'Magnifique villa moderne avec vue panoramique sur la mer. Cette propriété d''exception offre 4 chambres luxueuses, une piscine à débordement et un jardin méditerranéen. Parfaite pour des vacances de rêve en famille ou entre amis.',
  'villa',
  'malabata',
  450,
  ARRAY[
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227',
    'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4'
  ],
  ARRAY['Piscine', 'Vue mer', 'Jardin', 'Parking', 'Wifi', 'Climatisation', 'Terrasse', 'Sécurité 24/7'],
  true
),
(
  'Riad Authentique',
  'Au cœur de la médina, ce riad traditionnel rénové allie charme ancestral et confort moderne. Avec son patio central, sa fontaine traditionnelle et ses 3 chambres décorées avec goût.',
  'traditional',
  'medina',
  280,
  ARRAY[
    'https://images.unsplash.com/photo-1527359443443-84a48aec73d2',
    'https://images.unsplash.com/photo-1527359443443-84a48aec73d3',
    'https://images.unsplash.com/photo-1527359443443-84a48aec73d4'
  ],
  ARRAY['Patio', 'Fontaine', 'Wifi', 'Climatisation', 'Terrasse sur le toit', 'Service de ménage'],
  true
),
(
  'Appartement Marina Bay',
  'Superbe appartement moderne situé dans la prestigieuse Marina Bay. Profitez d''une vue imprenable sur le port depuis votre balcon privé. 2 chambres, cuisine équipée et design contemporain.',
  'apartment',
  'centre',
  180,
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0268',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0269'
  ],
  ARRAY['Vue port', 'Balcon', 'Wifi', 'Climatisation', 'Parking', 'Ascenseur', 'Sécurité'],
  true
);