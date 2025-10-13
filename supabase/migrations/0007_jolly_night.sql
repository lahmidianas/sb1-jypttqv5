/*
  # Update Booking System
  
  1. Changes
    - Add pre_reserved status to booking_status enum
    - Add contract_url and status tracking
    - Update RLS policies
    - Add status change tracking
  
  2. Security
    - Enable RLS
    - Add policies for status changes and contract management
*/

-- Update booking status enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'pre_reserved');
    ELSE
        ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'pre_reserved';
    END IF;
END $$;

-- Add contract_url column
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS contract_url TEXT,
ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ DEFAULT now();

-- Create trigger for status_updated_at
CREATE OR REPLACE FUNCTION update_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.status_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_booking_status_timestamp ON bookings;
CREATE TRIGGER update_booking_status_timestamp
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_status_timestamp();

-- Update RLS policies
DROP POLICY IF EXISTS "Allow read access to own bookings" ON bookings;
DROP POLICY IF EXISTS "Allow status updates to own bookings" ON bookings;

CREATE POLICY "Allow read access to own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow status updates to own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    CASE 
      WHEN status = 'confirmed' THEN 
        contract_url IS NOT NULL
      ELSE true
    END
  );