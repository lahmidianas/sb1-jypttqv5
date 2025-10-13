/*
  # Fix booking policies and permissions
  
  1. Changes
    - Drop existing booking policies
    - Create new simplified booking policies
    - Add proper checks for booking creation
    
  2. Security
    - Allow authenticated users to create bookings
    - Ensure proper date validation
    - Prevent double bookings
*/

-- Drop existing policies
DROP POLICY IF EXISTS "admin_booking_access" ON bookings;

-- Create new booking policies
CREATE POLICY "allow_booking_select"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_booking_insert"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Basic validation
    check_out > check_in AND
    -- Property must exist and be available
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id 
      AND p.available = true
    ) AND
    -- No overlapping confirmed bookings
    NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.property_id = property_id
      AND b.status = 'confirmed'
      AND b.check_in < check_out
      AND b.check_out > check_in
    )
  );

CREATE POLICY "allow_booking_update"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "allow_booking_delete"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);

-- Refresh permissions
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;