/*
  # Update Property Types and Listing Types
  
  1. Changes
    - Drop and recreate property_type enum with all property types
    - Add temporary column for migration
    - Migrate existing data
    - Update column configuration
    - Add listing_type support
  
  2. Security
    - Maintain data consistency during migration
    - Add proper constraints
*/

-- 1. Drop old enum type if exists
DROP TYPE IF EXISTS property_type CASCADE;

-- 2. Create new property_type enum
CREATE TYPE property_type AS ENUM (
  'apartment',
  'villa',
  'house',
  'land',
  'office',
  'commercial',
  'business',
  'factory',
  'farm'
);

-- 3. Add temporary column to hold new type values
ALTER TABLE properties 
ADD COLUMN new_type property_type;

-- 4. Migrate old data into new_type
UPDATE properties 
SET new_type = CASE 
  WHEN type = 'apartment' THEN 'apartment'::property_type
  WHEN type = 'villa' THEN 'villa'::property_type
  WHEN type = 'traditional' THEN 'house'::property_type
  WHEN type = 'land' THEN 'land'::property_type
  WHEN type = 'office' THEN 'office'::property_type
  WHEN type = 'commercial' THEN 'commercial'::property_type
  WHEN type = 'business' THEN 'business'::property_type
  WHEN type = 'factory' THEN 'factory'::property_type
  WHEN type = 'farm' THEN 'farm'::property_type
  ELSE 'apartment'::property_type
END;

-- 5. Drop old column
ALTER TABLE properties 
DROP COLUMN type;

-- 6. Rename and configure new_type column
ALTER TABLE properties 
RENAME COLUMN new_type TO type;

ALTER TABLE properties 
ALTER COLUMN type SET NOT NULL,
ALTER COLUMN type SET DEFAULT 'apartment'::property_type;

-- 7. Create listing_type enum
DROP TYPE IF EXISTS listing_type CASCADE;

CREATE TYPE listing_type AS ENUM (
  'sale',
  'long_term_rental',
  'vacation_rental'
);

-- 8. Add listing_type column
ALTER TABLE properties
ADD COLUMN listing_type listing_type NOT NULL DEFAULT 'vacation_rental';