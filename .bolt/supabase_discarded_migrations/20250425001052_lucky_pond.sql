-- 1. Add columns if they don't exist
ALTER TABLE properties ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS location TEXT;

-- 2. Set default values where NULL (you can customize these)
UPDATE properties
SET city = 'tanger'
WHERE city IS NULL;

UPDATE properties
SET location = 'centre_ville'
WHERE location IS NULL;

-- 3. Fix invalid city-location combos (optional: adjust as needed)
UPDATE properties
SET city = 'tanger'
WHERE city NOT IN (
  'tanger', 'tetouan', 'casablanca', 'rabat', 'marrakech', 'fes', 'agadir'
);

UPDATE properties
SET location = 'centre_ville'
WHERE (
  (city = 'tanger' AND location NOT IN ('medina', 'malabata', 'centre_ville', 'california', 'iberia', 'boukhalef', 'achakar', 'cap_spartel', 'branes', 'moujahidine')) OR
  (city = 'tetouan' AND location NOT IN ('medina', 'centre_ville', 'martil', 'fnideq', 'mdiq')) OR
  (city = 'casablanca' AND location NOT IN ('anfa', 'maarif', 'ain_diab', 'californie', 'gauthier', 'racine', 'bourgogne')) OR
  (city = 'rabat' AND location NOT IN ('agdal', 'hay_riad', 'medina', 'souissi', 'hassan')) OR
  (city = 'marrakech' AND location NOT IN ('medina', 'gueliz', 'hivernage', 'palmeraie', 'amelkis')) OR
  (city = 'fes' AND location NOT IN ('medina', 'ville_nouvelle', 'atlas', 'saiss')) OR
  (city = 'agadir' AND location NOT IN ('centre_ville', 'founty', 'sonaba', 'talborjt'))
);

-- 4. Make columns required
ALTER TABLE properties ALTER COLUMN city SET NOT NULL;
ALTER TABLE properties ALTER COLUMN location SET NOT NULL;

-- 5. Create index for performance
CREATE INDEX IF NOT EXISTS idx_properties_city_location ON properties(city, location);

-- 6. Add final constraint
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