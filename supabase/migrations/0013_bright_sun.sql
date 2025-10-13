/*
  # Update Booking RLS Policies

  1. Changes
    - Drop existing booking policies
    - Add new policies for proper access control
    - Add date overlap check for bookings
    - Add indexes for performance

  2. Security
    - Users can view their own bookings and property bookings
    - Users can only create bookings for available properties
    - Users can only update their own bookings
    - Prevents double bookings through date overlap check
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;

-- Create new RLS policies with proper checks
CREATE POLICY "Allow booking read access"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
    )
  );

CREATE POLICY "Allow booking creation"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id 
      AND p.available = true
      AND NOT EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.property_id = p.id
        AND b.status != 'cancelled'
        AND b.check_in <= check_out 
        AND b.check_out >= check_in
      )
    )
  );

CREATE POLICY "Allow booking updates"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_dates 
  ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status 
  ON bookings(status);