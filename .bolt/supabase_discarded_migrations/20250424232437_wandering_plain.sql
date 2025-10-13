/*
  # Update Property Types and Listing Types
  
  1. Changes
    - Create property_type enum with all property types
    - Create listing_type enum for sale/rental types
    - Add new columns to properties table
    - Migrate existing data
    - Set proper constraints and defaults
  
  2. Security
    - Maintain data consistency during migration
    - Add proper indexes for performance
*/

-- Drop existing types if needed
DROP TYPE IF EXISTS property_type CASCADE;
DROP TYPE IF EXISTS listing_type CASCADE;

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

-- Create listing type enum
CREATE TYPE listing_type AS ENUM (
  'sale',
  'long_term_rental',
  'vacation_rental'
);

-- Add new columns to properties table
ALTER TABLE properties
ADD COLUMN property_type property_type,
ADD COLUMN listing_type listing_type;

-- Migrate existing data
UPDATE properties
SET property_type = CASE
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

-- Set default listing type
UPDATE properties
SET listing_type = 'vacation_rental'::listing_type
WHERE listing_type IS NULL;

-- Make columns required with defaults
ALTER TABLE properties
ALTER COLUMN property_type SET NOT NULL,
ALTER COLUMN property_type SET DEFAULT 'apartment'::property_type,
ALTER COLUMN listing_type SET NOT NULL,
ALTER COLUMN listing_type SET DEFAULT 'vacation_rental'::listing_type;

-- Drop old type column if it exists
ALTER TABLE properties
DROP COLUMN IF EXISTS type;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_types 
ON properties(property_type, listing_type);