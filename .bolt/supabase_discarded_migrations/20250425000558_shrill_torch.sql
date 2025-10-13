-- Add city column to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS city text;

-- Update existing properties to have Tanger as default city
UPDATE properties
SET city = 'tanger'
WHERE city IS NULL;

-- Make city column required
ALTER TABLE properties
ALTER COLUMN city SET NOT NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_city_location 
ON properties(city, location);

-- Add constraint to ensure valid city-location pairs
ALTER TABLE properties
ADD CONSTRAINT valid_city_location CHECK (
  (city = 'tanger' AND location IN ('medina', 'malabata', 'centre_ville', 'california', 'iberia', 'boukhalef', 'achakar', 'cap_spartel', 'branes', 'moujahidine')) OR
  (city = 'tetouan' AND location IN ('medina', 'centre_ville', 'martil', 'fnideq', 'mdiq')) OR
  (city = 'casablanca' AND location IN ('anfa', 'maarif', 'ain_diab', 'californie', 'gauthier', 'racine', 'bourgogne')) OR
  (city = 'rabat' AND location IN ('agdal', 'hay_riad', 'medina', 'souissi', 'hassan')) OR
  (city = 'marrakech' AND location IN ('medina', 'gueliz', 'hivernage', 'palmeraie', 'amelkis')) OR
  (city = 'fes' AND location IN ('medina', 'ville_nouvelle', 'atlas', 'saiss')) OR
  (city = 'agadir' AND location IN ('centre_ville', 'founty', 'sonaba', 'talborjt'))
);