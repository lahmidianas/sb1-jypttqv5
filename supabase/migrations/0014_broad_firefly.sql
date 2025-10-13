-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow booking read access" ON bookings;
DROP POLICY IF EXISTS "Allow booking creation" ON bookings;
DROP POLICY IF EXISTS "Allow booking updates" ON bookings;

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
        WHERE b.property_id = property_id
        AND b.status != 'cancelled'
        AND b.check_in <= check_out 
        AND b.check_out >= check_in
      )
    )
  );

CREATE POLICY "Allow booking deletion"
  ON bookings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow booking updates"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);