/*
  # Fix Dashboard Statistics and Property Status
  
  1. Changes
    - Add status column to properties table
    - Update properties table structure
    - Create optimized dashboard view
    - Add proper indexes
  
  2. Security
    - Grant appropriate permissions
*/

-- Add status column to properties if it doesn't exist
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available' 
CHECK (status IN ('available', 'occupied', 'maintenance'));

-- Create or replace dashboard view
DROP VIEW IF EXISTS dashboard_stats;
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

-- Create optimized indexes
CREATE INDEX IF NOT EXISTS idx_properties_status 
  ON properties(status);

CREATE INDEX IF NOT EXISTS idx_bookings_status_metrics 
  ON bookings(status)
  INCLUDE (total_price)
  WHERE status IN ('waiting', 'confirmed');

-- Grant permissions
GRANT SELECT ON dashboard_stats TO authenticated;