/*
  # Fix Dashboard Stats and Property Availability
  
  1. Changes
    - Drop and recreate dashboard stats view with proper permissions
    - Add property availability trigger
    - Fix refresh mechanism
    
  2. Security
    - Set proper permissions
    - Use security definer for functions
*/

-- Drop existing objects
DROP TRIGGER IF EXISTS refresh_dashboard_stats_trigger ON bookings;
DROP TRIGGER IF EXISTS update_property_availability_trigger ON bookings;
DROP FUNCTION IF EXISTS refresh_dashboard_stats();
DROP FUNCTION IF EXISTS update_property_availability();
DROP MATERIALIZED VIEW IF EXISTS dashboard_stats;

-- Recreate materialized view
CREATE MATERIALIZED VIEW dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM properties) as total_properties,
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END) as confirmed_bookings,
    COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_price END), 0) as total_revenue
FROM bookings b;

-- Create function to refresh stats
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats;
    RETURN NULL;
END;
$$;

-- Create function to update property availability
CREATE OR REPLACE FUNCTION update_property_availability()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
    -- Update property availability based on confirmed bookings
    UPDATE properties
    SET available = NOT EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.property_id = NEW.property_id
        AND b.status = 'confirmed'
        AND b.check_in <= CURRENT_DATE
        AND b.check_out > CURRENT_DATE
    )
    WHERE id = NEW.property_id;
    
    RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER refresh_dashboard_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON bookings
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_dashboard_stats();

CREATE TRIGGER update_property_availability_trigger
    AFTER INSERT OR UPDATE OF status ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_property_availability();

-- Grant permissions
GRANT SELECT ON dashboard_stats TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION update_property_availability() TO authenticated;