/*
  # Add Listing Type to Properties
  
  1. Changes
    - Add listing_type enum
    - Add listing_type column to properties table
    - Update existing properties with default value
*/

-- Create listing type enum
CREATE TYPE listing_type AS ENUM ('sale', 'long_term_rental', 'vacation_rental');

-- Add listing_type column to properties
ALTER TABLE properties 
ADD COLUMN listing_type listing_type NOT NULL DEFAULT 'vacation_rental';

-- Update existing properties
UPDATE properties SET listing_type = 'vacation_rental';