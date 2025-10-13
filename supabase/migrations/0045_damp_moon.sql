-- Drop existing triggers
DROP TRIGGER IF EXISTS tr_set_booking_total_price ON bookings;
DROP FUNCTION IF EXISTS set_booking_total_price();

-- Update bookings table structure
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS client_email TEXT,
ADD COLUMN IF NOT EXISTS client_phone TEXT;

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
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_client_email ON bookings(client_email);