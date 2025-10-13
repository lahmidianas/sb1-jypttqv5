/*
  # Booking Confirmation Handling
  
  1. Changes
    - Add trigger to update property availability on booking confirmation
    - Add function to update dashboard stats
    - Add materialized view for dashboard stats
    
  2. Security
    - Only update availability for confirmed bookings
    - Maintain data consistency
*/

-- Create materialized view for dashboard stats
CREATE MATERIALIZED VIEW dashboard_stats AS
SELECT
  COUNT(DISTINCT p.id) as total_properties,
  COUNT(DISTINCT b.id) as total_bookings,
  COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END) as confirmed_bookings,
  COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_price END), 0) as total_revenue
FROM properties p
LEFT JOIN bookings b ON p.id = b.property_id;

-- Create index for faster refresh
CREATE UNIQUE INDEX ON dashboard_stats (total_properties);

-- Create function to refresh dashboard stats
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh stats on booking changes
CREATE TRIGGER refresh_dashboard_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON bookings
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_dashboard_stats();

-- Create function to update property availability
CREATE OR REPLACE FUNCTION update_property_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- If booking is confirmed, update property availability
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    -- Set property as unavailable for the booking period
    UPDATE properties
    SET available = false
    WHERE id = NEW.property_id
    AND EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.property_id = NEW.property_id
      AND b.status = 'confirmed'
      AND b.check_in <= CURRENT_DATE
      AND b.check_out > CURRENT_DATE
    );
  -- If booking is no longer confirmed, check if property can be available
  ELSIF OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
    -- Set property as available if no other confirmed bookings
    UPDATE properties
    SET available = true
    WHERE id = NEW.property_id
    AND NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.property_id = NEW.property_id
      AND b.status = 'confirmed'
      AND b.id != NEW.id
      AND b.check_in <= CURRENT_DATE
      AND b.check_out > CURRENT_DATE
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for property availability updates
CREATE TRIGGER update_property_availability_trigger
AFTER UPDATE OF status ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_property_availability();