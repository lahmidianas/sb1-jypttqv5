/*
  # Booking Policies and Indexes
  
  1. Changes
    - Drop existing booking policies
    - Create new simplified policies for CRUD operations
    - Add optimized indexes for common queries
    
  2. Security
    - Allow authenticated users to manage bookings
    - Prevent double bookings through policy checks
    - Ensure date validity
*/

-- Drop existing policies
DROP POLICY IF EXISTS "admin_read_bookings" ON bookings;
DROP POLICY IF EXISTS "admin_create_booking" ON bookings;
DROP POLICY IF EXISTS "admin_update_booking" ON bookings;
DROP POLICY IF EXISTS "admin_delete_booking" ON bookings;

-- Create new booking policies
CREATE POLICY "booking_select"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "booking_insert"
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
      AND b.id != COALESCE(id, '00000000-0000-0000-0000-000000000000')
      AND b.check_in < check_out
      AND b.check_out > check_in
    )
  );

CREATE POLICY "booking_update"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (check_out > check_in);

CREATE POLICY "booking_delete"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);

-- Create optimized indexes
DROP INDEX IF EXISTS idx_bookings_dates_status;
DROP INDEX IF EXISTS idx_bookings_property;
DROP INDEX IF EXISTS idx_bookings_status;

CREATE INDEX idx_bookings_property_dates
  ON bookings(property_id, status, check_in, check_out);

CREATE INDEX idx_bookings_status_dates
  ON bookings(status, check_in, check_out);