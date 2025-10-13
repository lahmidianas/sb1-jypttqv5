/*
  # Update Property Types and Add Listing Types
  
  1. Changes
    - Add listing_type column
    - Update property_type enum with new values
    - Add proper constraints and defaults
    
  2. Security
    - Maintain existing RLS policies
    - Ensure data consistency during migration
*/

-- Drop existing type if exists
DROP TYPE IF EXISTS property_type CASCADE;

-- Create new property type enum
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

-- Create listing type enum if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_type') THEN
    CREATE TYPE listing_type AS ENUM (
      'sale',
      'long_term_rental',
      'vacation_rental'
    );
  END IF;
END $$;

-- Add temporary column for new property type
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS new_type property_type;

-- Migrate existing data
UPDATE properties 
SET new_type = CASE 
  WHEN type::text = 'apartment' THEN 'apartment'::property_type
  WHEN type::text = 'villa' THEN 'villa'::property_type
  WHEN type::text = 'traditional' THEN 'house'::property_type
  ELSE 'apartment'::property_type
END;

-- Drop old type column and rename new one
ALTER TABLE properties 
DROP COLUMN IF EXISTS type CASCADE;

ALTER TABLE properties 
RENAME COLUMN new_type TO type;

-- Set not null constraint and default value
ALTER TABLE properties 
ALTER COLUMN type SET NOT NULL,
ALTER COLUMN type SET DEFAULT 'apartment'::property_type;

-- Add listing type with default value
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS listing_type listing_type 
DEFAULT 'vacation_rental'::listing_type NOT NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_type_listing 
ON properties(type, listing_type);

-- Update existing properties to have appropriate listing types
UPDATE properties 
SET listing_type = 'vacation_rental'::listing_type 
WHERE listing_type IS NULL;