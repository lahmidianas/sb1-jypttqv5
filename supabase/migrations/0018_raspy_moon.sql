/*
  # Fix booking policies

  1. Changes
    - Drop existing policies
    - Create new simplified policies with proper permissions
    - Add policy for property owners to view bookings
  
  2. Security
    - Users can view their own bookings
    - Users can create bookings if property is available
    - Users can update their own bookings
    - Property owners can view bookings for their properties
*/

-- Drop existing policies
DROP POLICY IF EXISTS "booking_read_policy" ON bookings;
DROP POLICY IF EXISTS "booking_insert_policy" ON bookings;
DROP POLICY IF EXISTS "booking_update_policy" ON bookings;
DROP POLICY IF EXISTS "booking_delete_policy" ON bookings;

-- Create new policies
CREATE POLICY "users_read_own_bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    -- Users can see their own bookings
    auth.uid() = user_id OR
    -- Property owners can see bookings for their properties
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
    )
  );

CREATE POLICY "users_create_bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User must be authenticated
    auth.uid() = user_id AND
    -- Check-out must be after check-in
    check_out > check_in AND
    -- Property must exist and be available
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id AND p.available = true
    ) AND
    -- No overlapping confirmed bookings
    NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.property_id = property_id
        AND b.status = 'confirmed'
        AND b.id != id
        AND (
          (check_in <= b.check_out AND check_out >= b.check_in) OR
          (b.check_in <= check_out AND b.check_out >= check_in)
        )
    )
  );

CREATE POLICY "users_update_own_bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_delete_own_bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);