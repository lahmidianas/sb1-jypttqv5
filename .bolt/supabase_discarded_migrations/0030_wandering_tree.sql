/*
  # Simplify booking policies
  
  1. Changes
    - Drop existing booking policies
    - Create new simplified policies for admin access
    - Maintain basic date validation and overlap checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "booking_select_policy" ON bookings;
DROP POLICY IF EXISTS "booking_insert_policy" ON bookings;
DROP POLICY IF EXISTS "booking_update_policy" ON bookings;
DROP POLICY IF EXISTS "booking_delete_policy" ON bookings;
DROP POLICY IF EXISTS "allow_read_bookings" ON bookings;
DROP POLICY IF EXISTS "allow_create_booking" ON bookings;
DROP POLICY IF EXISTS "allow_update_booking" ON bookings;
DROP POLICY IF EXISTS "allow_delete_booking" ON bookings;

-- Create simplified booking policies
CREATE POLICY "admin_booking_select"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "admin_booking_insert"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Ensure valid dates
    check_out > check_in AND
    -- Prevent overlapping confirmed bookings
    NOT EXISTS (
      SELECT 1 
      FROM bookings existing
      WHERE existing.property_id = property_id
        AND existing.status = 'confirmed'
        AND existing.check_in < check_out
        AND existing.check_out > check_in
    )
  );

CREATE POLICY "admin_booking_update"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "admin_booking_delete"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);