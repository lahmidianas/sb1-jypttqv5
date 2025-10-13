-- Drop existing type if exists
DROP TYPE IF EXISTS property_type CASCADE;

-- Create new property type enum with all values
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

-- Add property_type column with new type
ALTER TABLE properties 
ALTER COLUMN type TYPE property_type USING type::property_type;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);