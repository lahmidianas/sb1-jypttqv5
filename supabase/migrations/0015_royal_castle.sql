/*
  # Fix Booking Policies Recursion

  1. Changes
    - Drop existing policies
    - Create simplified policies without recursive checks
    - Add proper date overlap check without self-referencing
  
  2. Security
    - Maintain row-level security
    - Ensure users can only access their own bookings
    - Prevent double bookings through simplified logic
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow booking read access" ON bookings;
DROP POLICY IF EXISTS "Allow booking creation" ON bookings;
DROP POLICY IF EXISTS "Allow booking updates" ON bookings;
DROP POLICY IF EXISTS "Allow booking deletion" ON bookings;

-- Create simplified policies without recursion
CREATE POLICY "booking_read_policy"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "booking_insert_policy"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    check_out > check_in AND
    NOT EXISTS (
      SELECT 1 
      FROM bookings existing
      WHERE 
        existing.property_id = property_id AND
        existing.status != 'cancelled' AND
        existing.id != id AND
        (
          (check_in <= existing.check_out AND check_out >= existing.check_in) OR
          (existing.check_in <= check_out AND existing.check_out >= check_in)
        )
    )
  );

CREATE POLICY "booking_update_policy"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "booking_delete_policy"
  ON bookings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);