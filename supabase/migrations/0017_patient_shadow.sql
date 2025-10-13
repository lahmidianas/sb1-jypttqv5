/*
  # Update booking status options
  
  1. Changes
    - Drop existing booking_status type
    - Create new simplified booking_status enum with 'waiting' and 'confirmed' values
    - Update bookings table to use new status type
  
  Note: All existing bookings have been deleted in previous migration
*/

-- Drop existing type and its dependencies
DROP TYPE IF EXISTS booking_status CASCADE;

-- Create new booking status enum
CREATE TYPE booking_status AS ENUM ('waiting', 'confirmed');

-- Drop and recreate bookings table with new status type
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  status booking_status NOT NULL DEFAULT 'waiting',
  contract_url TEXT,
  status_updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);