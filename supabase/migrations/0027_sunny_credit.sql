/*
  # Dashboard Statistics View
  
  1. Changes
    - Create real-time dashboard statistics view
    - Add performance indexes
    - Grant proper permissions
  
  2. Security
    - Grant SELECT permission to authenticated users
*/

-- Drop existing view if exists
DROP VIEW IF EXISTS dashboard_stats;

-- Create real-time view for dashboard stats
CREATE VIEW dashboard_stats AS
WITH booking_stats AS (
  SELECT
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
    COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END), 0) as total_revenue
  FROM bookings
),
property_stats AS (
  SELECT COUNT(*) as total_properties
  FROM properties
)
SELECT 
  p.total_properties,
  b.total_bookings,
  b.confirmed_bookings,
  b.total_revenue
FROM property_stats p
CROSS JOIN booking_stats b;

-- Grant permissions
GRANT SELECT ON dashboard_stats TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_confirmed_price ON bookings(total_price) 
  WHERE status = 'confirmed';