/*
  # Fix Dashboard Statistics View
  
  1. Changes
    - Drop existing view
    - Create new optimized view with proper joins
    - Add performance indexes
  
  2. Security
    - Grant SELECT permission to authenticated users
*/

-- Drop existing view
DROP VIEW IF EXISTS dashboard_stats;

-- Create optimized view for real-time dashboard stats
CREATE VIEW dashboard_stats AS
WITH RECURSIVE current_stats AS (
  SELECT
    (SELECT COUNT(*) FROM properties) as total_properties,
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
    COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END), 0) as total_revenue
  FROM bookings
)
SELECT 
  total_properties,
  total_bookings,
  confirmed_bookings,
  total_revenue
FROM current_stats;

-- Grant permissions
GRANT SELECT ON dashboard_stats TO authenticated;

-- Create optimized indexes
DROP INDEX IF EXISTS idx_bookings_status;
DROP INDEX IF EXISTS idx_bookings_confirmed_price;

CREATE INDEX idx_bookings_status_tracking 
  ON bookings(status, total_price)
  INCLUDE (created_at, updated_at);

CREATE INDEX idx_bookings_confirmed_revenue 
  ON bookings(total_price) 
  WHERE status = 'confirmed';