/*
  # Add listing type to properties table
  
  1. Changes
    - Add listing_type column to properties table
    - Set default value for existing records
    - Add constraint for valid values
*/

-- Create listing type enum if it doesn't exist
CREATE TYPE listing_type AS ENUM ('sale', 'long_term_rental', 'vacation_rental');

-- Add listing_type column
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS listing_type listing_type NOT NULL DEFAULT 'vacation_rental';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);