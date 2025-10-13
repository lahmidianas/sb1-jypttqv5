/*
  # Dashboard Statistics View
  
  1. Changes
    - Create real-time dashboard statistics view
    - Add proper indexes for performance
    - Grant necessary permissions
  
  2. Security
    - Restrict access to authenticated users
    - Ensure data consistency
*/

-- Drop existing view if exists
DROP VIEW IF EXISTS dashboard_stats CASCADE;

-- Create function to calculate dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
  total_properties bigint,
  available_properties bigint,
  total_bookings bigint,
  confirmed_bookings bigint,
  total_revenue numeric
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
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
      COUNT(CASE WHEN available = true THEN 1 END) as available_properties
    FROM properties
  )
  SELECT 
    p.total_properties,
    p.available_properties,
    COALESCE(b.total_bookings, 0),
    COALESCE(b.confirmed_bookings, 0),
    COALESCE(b.total_revenue, 0)
  FROM property_metrics p
  CROSS JOIN booking_metrics b;
END;
$$;

-- Create view using the function
CREATE VIEW dashboard_stats AS
  SELECT * FROM get_dashboard_stats();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_status_metrics 
  ON bookings(status, total_price)
  WHERE status IN ('waiting', 'confirmed');

CREATE INDEX IF NOT EXISTS idx_properties_availability 
  ON properties(available);

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;
GRANT SELECT ON dashboard_stats TO authenticated;