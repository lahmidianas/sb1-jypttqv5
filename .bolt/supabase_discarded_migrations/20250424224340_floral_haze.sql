/*
  # Update Property Types
  
  1. Changes
    - Drop existing property_type enum
    - Create new property_type enum with extended options
    - Add listing_type enum
    - Update properties table structure
*/

-- Drop existing type
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

-- Add temporary column
ALTER TABLE properties 
ADD COLUMN new_type property_type;

-- Migrate data
UPDATE properties 
SET new_type = CASE 
  WHEN type::text = 'apartment' THEN 'apartment'::property_type
  WHEN type::text = 'villa' THEN 'villa'::property_type
  WHEN type::text = 'traditional' THEN 'house'::property_type
END;

-- Drop old column
ALTER TABLE properties 
DROP COLUMN type;

-- Rename new column
ALTER TABLE properties 
ALTER COLUMN new_type SET NOT NULL,
ALTER COLUMN new_type TYPE property_type,
ALTER COLUMN new_type SET DEFAULT 'apartment'::property_type;

-- Rename the column
ALTER TABLE properties 
RENAME COLUMN new_type TO type;

-- Create listing type enum if not exists
DROP TYPE IF EXISTS listing_type CASCADE;
CREATE TYPE listing_type AS ENUM (
  'sale',
  'long_term_rental',
  'vacation_rental'
);

-- Add listing type column with default value
ALTER TABLE properties
ADD COLUMN listing_type listing_type NOT NULL DEFAULT 'vacation_rental'::listing_type;