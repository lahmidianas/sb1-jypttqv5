-- Drop existing triggers
DROP TRIGGER IF EXISTS tr_set_booking_total_price ON bookings;
DROP TRIGGER IF EXISTS validate_booking_dates_trigger ON bookings;

-- Drop existing functions
DROP FUNCTION IF EXISTS set_booking_total_price();
DROP FUNCTION IF EXISTS validate_booking_dates();
DROP FUNCTION IF EXISTS calculate_booking_price(uuid, date, date);

-- Drop existing type if exists
DROP TYPE IF EXISTS booking_status CASCADE;

-- Create booking status enum
CREATE TYPE booking_status AS ENUM ('waiting', 'confirmed');

-- Drop and recreate bookings table with correct structure
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  status booking_status NOT NULL DEFAULT 'waiting',
  total_price decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create booking policies
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

-- Create function to calculate booking price
CREATE OR REPLACE FUNCTION calculate_booking_price(
  p_property_id uuid,
  p_check_in date,
  p_check_out date
)
RETURNS decimal AS $$
DECLARE
  v_price decimal;
  v_nights integer;
BEGIN
  -- Get property price
  SELECT price INTO v_price
  FROM properties
  WHERE id = p_property_id;

  -- Calculate number of nights
  v_nights := p_check_out - p_check_in;

  RETURN v_price * v_nights;
END;
$$ LANGUAGE plpgsql;

-- Create function to set total price
CREATE OR REPLACE FUNCTION set_booking_total_price()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_price := calculate_booking_price(NEW.property_id, NEW.check_in, NEW.check_out);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for total price calculation
CREATE TRIGGER tr_set_booking_total_price
  BEFORE INSERT OR UPDATE OF check_in, check_out, property_id ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_total_price();

-- Create indexes for better performance
CREATE INDEX idx_bookings_property_dates ON bookings(property_id, check_in, check_out);
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_status ON bookings(status);