/*
  # Fix Dashboard Statistics View
  
  1. Changes
    - Drop existing view
    - Create new optimized view with proper joins and aggregations
    - Add performance indexes
  
  2. Security
    - Grant SELECT permission to authenticated users
*/

-- Drop existing view if exists
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
property_count AS (
  SELECT COUNT(*) as total_properties
  FROM properties
  WHERE id IS NOT NULL
)
SELECT 
  p.total_properties,
  COALESCE(b.total_bookings, 0) as total_bookings,
  COALESCE(b.confirmed_bookings, 0) as confirmed_bookings,
  COALESCE(b.total_revenue, 0) as total_revenue
FROM property_count p
CROSS JOIN booking_metrics b;

-- Grant permissions
GRANT SELECT ON dashboard_stats TO authenticated;

-- Create optimized indexes
DROP INDEX IF EXISTS idx_bookings_status_stats;
DROP INDEX IF EXISTS idx_bookings_revenue_stats;

CREATE INDEX idx_bookings_status_stats 
  ON bookings(status)
  INCLUDE (total_price);

CREATE INDEX idx_bookings_revenue_stats 
  ON bookings(status, total_price)
  WHERE status = 'confirmed';