-- Drop existing policies
DROP POLICY IF EXISTS "bookings_access_policy" ON bookings;
DROP POLICY IF EXISTS "properties_access_policy" ON properties;
DROP POLICY IF EXISTS "clients_access_policy" ON clients;

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

-- Create simplified property policies
CREATE POLICY "property_access_policy"
  ON properties FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create simplified client policies
CREATE POLICY "client_access_policy"
  ON clients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to check booking availability
CREATE OR REPLACE FUNCTION check_booking_availability(
  p_property_id uuid,
  p_check_in date,
  p_check_out date,
  p_booking_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.property_id = p_property_id
    AND b.status = 'confirmed'
    AND b.check_in < p_check_out
    AND b.check_out > p_check_in
    AND (p_booking_id IS NULL OR b.id != p_booking_id)
  );
END;
$$;

-- Create trigger to validate booking
CREATE OR REPLACE FUNCTION validate_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT check_booking_availability(NEW.property_id, NEW.check_in, NEW.check_out, NEW.id) THEN
    RAISE EXCEPTION 'Booking dates conflict with existing booking';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER booking_validation_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking();

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;