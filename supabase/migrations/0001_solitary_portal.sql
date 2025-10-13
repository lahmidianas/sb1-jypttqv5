/*
  # Création des tables pour la gestion des propriétés

  1. Nouvelles Tables
    - `properties`
      - `id` (uuid, clé primaire)
      - `title` (text, titre de la propriété)
      - `description` (text, description détaillée)
      - `type` (enum, type de propriété)
      - `location` (text, emplacement)
      - `price` (numeric, prix par nuit)
      - `images` (text[], URLs des images)
      - `features` (text[], caractéristiques)
      - `available` (boolean, disponibilité)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Sécurité
    - Active RLS sur la table properties
    - Ajoute des politiques pour la lecture et l'écriture
*/

-- Création du type enum pour les types de propriétés
CREATE TYPE property_type AS ENUM ('apartment', 'villa', 'traditional');

-- Création de la table properties
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type property_type NOT NULL,
  location text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  images text[] NOT NULL DEFAULT '{}',
  features text[] NOT NULL DEFAULT '{}',
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Activation de RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Création des politiques RLS
CREATE POLICY "Allow public read access"
  ON properties
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow authenticated users to create properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update their properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();