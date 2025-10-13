/*
  # Dashboard Stats Setup
  
  1. Changes
    - Create materialized view for dashboard statistics
    - Set up proper permissions and security
    - Add refresh triggers
    
  2. Security
    - Grant necessary permissions to authenticated users
    - Secure refresh mechanism
*/

-- Create materialized view for dashboard stats
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_stats AS
WITH booking_stats AS (
  SELECT
    COUNT(DISTINCT id) as total_bookings,
    COUNT(DISTINCT CASE WHEN status = 'confirmed' THEN id END) as confirmed_bookings,
    COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_price END), 0) as total_revenue
  FROM bookings
),
property_stats AS (
  SELECT COUNT(*) as total_properties
  FROM properties
)
SELECT 
  p.total_properties,
  COALESCE(b.total_bookings, 0) as total_bookings,
  COALESCE(b.confirmed_bookings, 0) as confirmed_bookings,
  COALESCE(b.total_revenue, 0) as total_revenue
FROM property_stats p
CROSS JOIN booking_stats b;

-- Create refresh function
CREATE OR REPLACE FUNCTION public.refresh_dashboard_stats()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  REFRESH MATERIALIZED VIEW dashboard_stats;
  RETURN NULL;
END;
$$;

-- Create trigger for stats refresh
DROP TRIGGER IF EXISTS refresh_dashboard_stats_trigger ON bookings;
CREATE TRIGGER refresh_dashboard_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.refresh_dashboard_stats();

-- Grant permissions
GRANT SELECT ON dashboard_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_dashboard_stats() TO authenticated;