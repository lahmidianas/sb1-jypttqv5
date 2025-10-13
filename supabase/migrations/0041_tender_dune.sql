-- Drop existing policies
DROP POLICY IF EXISTS "booking_select_policy" ON bookings;
DROP POLICY IF EXISTS "booking_insert_policy" ON bookings;
DROP POLICY IF EXISTS "booking_update_policy" ON bookings;
DROP POLICY IF EXISTS "booking_delete_policy" ON bookings;

-- Create simplified booking policies
CREATE POLICY "booking_select_policy"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "booking_insert_policy"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    check_out > check_in AND
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
      AND p.available = true
    )
  );

CREATE POLICY "booking_update_policy"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (check_out > check_in);

CREATE POLICY "booking_delete_policy"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);

-- Create function to validate booking dates
CREATE OR REPLACE FUNCTION validate_booking_dates()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.property_id = NEW.property_id
    AND b.status = 'confirmed'
    AND b.id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND b.check_in < NEW.check_out
    AND b.check_out > NEW.check_in
  ) THEN
    RAISE EXCEPTION 'Booking dates conflict with existing booking';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking validation
DROP TRIGGER IF EXISTS validate_booking_dates_trigger ON bookings;
CREATE TRIGGER validate_booking_dates_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking_dates();