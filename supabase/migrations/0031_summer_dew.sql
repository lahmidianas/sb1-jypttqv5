/*
  # Fix Dashboard Statistics Auto-Update
  
  1. Changes
    - Add trigger for booking status changes
    - Add function to update property status
    - Optimize dashboard view performance
  
  2. Security
    - Grant appropriate permissions
*/

-- Drop existing view
DROP VIEW IF EXISTS dashboard_stats;

-- Create optimized view for real-time dashboard stats
CREATE VIEW dashboard_stats AS
WITH booking_metrics AS (
  SELECT
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
    COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END), 0) as total_revenue
  FROM bookings
  WHERE status IN ('waiting', 'confirmed')
),
property_metrics AS (
  SELECT 
    COUNT(*) as total_properties,
    COUNT(CASE WHEN status = 'available' THEN 1 END) as available_properties
  FROM properties
)
SELECT 
  p.total_properties,
  p.available_properties,
  COALESCE(b.total_bookings, 0) as total_bookings,
  COALESCE(b.confirmed_bookings, 0) as confirmed_bookings,
  COALESCE(b.total_revenue, 0) as total_revenue
FROM property_metrics p
CROSS JOIN booking_metrics b;

-- Create function to update property status
CREATE OR REPLACE FUNCTION update_property_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If booking is confirmed, update property status
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    UPDATE properties
    SET status = 'occupied'
    WHERE id = NEW.property_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking status changes
DROP TRIGGER IF EXISTS booking_status_change ON bookings;
CREATE TRIGGER booking_status_change
  AFTER UPDATE OF status ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_property_status();

-- Create optimized indexes
DROP INDEX IF EXISTS idx_bookings_status_metrics;
CREATE INDEX idx_bookings_status_metrics 
  ON bookings(status, total_price)
  WHERE status IN ('waiting', 'confirmed');

-- Grant permissions
GRANT SELECT ON dashboard_stats TO authenticated;
GRANT EXECUTE ON FUNCTION update_property_status() TO authenticated;