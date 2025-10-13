/*
  # Fix dashboard refresh mechanism
  
  1. Changes
    - Drop existing materialized view and related objects
    - Create new dashboard stats view with proper refresh mechanism
    - Add proper permissions
    
  2. Security
    - Grant necessary permissions to authenticated users
    - Ensure proper refresh functionality
*/

-- Drop existing objects
DROP TRIGGER IF EXISTS refresh_dashboard_stats_trigger ON bookings;
DROP FUNCTION IF EXISTS refresh_dashboard_stats();
DROP MATERIALIZED VIEW IF EXISTS dashboard_stats;

-- Create regular view instead of materialized view for real-time stats
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM properties) as total_properties,
    (SELECT COUNT(*) FROM bookings) as total_bookings,
    (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') as confirmed_bookings,
    COALESCE((SELECT SUM(total_price) FROM bookings WHERE status = 'confirmed'), 0) as total_revenue;

-- Grant permissions
GRANT SELECT ON dashboard_stats TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_total_price ON bookings(total_price) WHERE status = 'confirmed';