/*
  # Fix Booking Policies
  
  1. Changes
    - Update booking policies to allow admin operations
    - Add proper validation checks
    - Maintain security while allowing necessary operations
  
  2. Security
    - Ensure admin access
    - Validate booking data
    - Prevent double bookings
*/

-- Drop existing policies
DROP POLICY IF EXISTS "admin_booking_select" ON bookings;
DROP POLICY IF EXISTS "admin_booking_insert" ON bookings;
DROP POLICY IF EXISTS "admin_booking_update" ON bookings;
DROP POLICY IF EXISTS "admin_booking_delete" ON bookings;

-- Create new booking policies
CREATE POLICY "admin_booking_select"
  ON bookings FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "admin_booking_insert"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin() AND
    check_out > check_in AND
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
      AND p.available = true
    ) AND
    NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.property_id = property_id
      AND b.status = 'confirmed'
      AND b.check_in < check_out
      AND b.check_out > check_in
      AND b.id != COALESCE(id, '00000000-0000-0000-0000-000000000000')
    )
  );

CREATE POLICY "admin_booking_update"
  ON bookings FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (
    is_admin() AND
    check_out > check_in
  );

CREATE POLICY "admin_booking_delete"
  ON bookings FOR DELETE
  TO authenticated
  USING (is_admin());

-- Create function to calculate total price
CREATE OR REPLACE FUNCTION calculate_booking_price(
  p_property_id uuid,
  p_check_in date,
  p_check_out date
)
RETURNS numeric
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_price numeric;
  v_nights integer;
BEGIN
  -- Get property price
  SELECT price INTO v_price
  FROM properties
  WHERE id = p_property_id;

  -- Calculate number of nights
  v_nights := p_check_out - p_check_in;

  -- Return total price
  RETURN v_price * v_nights;
END;
$$;

-- Create trigger to set total price
CREATE OR REPLACE FUNCTION set_booking_total_price()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_price := calculate_booking_price(NEW.property_id, NEW.check_in, NEW.check_out);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_set_booking_total_price ON bookings;
CREATE TRIGGER tr_set_booking_total_price
  BEFORE INSERT OR UPDATE OF check_in, check_out, property_id ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_total_price();

-- Grant permissions
GRANT EXECUTE ON FUNCTION calculate_booking_price TO authenticated;
GRANT EXECUTE ON FUNCTION set_booking_total_price TO authenticated;