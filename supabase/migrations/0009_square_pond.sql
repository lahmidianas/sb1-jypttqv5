/*
  # Fix Booking System Migration

  1. Changes
    - Drop existing triggers and functions safely
    - Update bookings table structure
    - Add new RLS policies
    - Create triggers for timestamp updates

  2. Security
    - Enable RLS on bookings table
    - Add policies for authenticated users
*/

-- Drop existing triggers first
DROP TRIGGER IF EXISTS update_booking_status_timestamp ON bookings;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Allow read access to own bookings" ON bookings;
DROP POLICY IF EXISTS "Allow status updates to own bookings" ON bookings;

-- Create timestamp update function if it doesn't exist
CREATE OR REPLACE FUNCTION update_timestamp_columns()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.status_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update bookings table structure
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS contract_url TEXT,
ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Create trigger for timestamp updates
CREATE TRIGGER update_booking_timestamps
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp_columns();

-- Create new RLS policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);