/*
  # Update Property Types and Listing Types
  
  1. Changes
    - Drop and recreate property_type and listing_type enums
    - Add type column with proper checks
    - Add listing_type column with proper checks
    - Migrate existing data
  
  2. Security
    - Use DO blocks for conditional changes
    - Maintain data consistency
*/

-- 1. Drop old enum types if they exist
DROP TYPE IF EXISTS property_type CASCADE;
DROP TYPE IF EXISTS listing_type CASCADE;

-- 2. Create new enums
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

CREATE TYPE listing_type AS ENUM (
  'sale',
  'long_term_rental',
  'vacation_rental'
);

-- 3. Add `type` column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'type'
  ) THEN
    ALTER TABLE properties
    ADD COLUMN type property_type NOT NULL DEFAULT 'apartment';
  ELSE
    -- If it exists but not as ENUM, we handle migration
    ALTER TABLE properties
    ADD COLUMN new_type property_type;

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

    ALTER TABLE properties DROP COLUMN type;
    ALTER TABLE properties RENAME COLUMN new_type TO type;
    ALTER TABLE properties ALTER COLUMN type SET NOT NULL;
    ALTER TABLE properties ALTER COLUMN type SET DEFAULT 'apartment';
  END IF;
END $$;

-- 4. Add listing_type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'listing_type'
  ) THEN
    ALTER TABLE properties
    ADD COLUMN listing_type listing_type NOT NULL DEFAULT 'vacation_rental';
  END IF;
END $$;