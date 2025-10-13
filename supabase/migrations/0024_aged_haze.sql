/*
  # Add admin role and permissions
  
  1. Changes
    - Create admin role
    - Grant necessary permissions to admin role
    - Create function to check if user is admin
    
  2. Security
    - Use security definer for admin check function
    - Set proper search path
*/

-- Create admin role if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
    CREATE ROLE admin;
  END IF;
END $$;

-- Grant permissions to admin role
GRANT ALL ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO admin;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO admin;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1
      FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );
END;
$$;

-- Grant execute permission on admin check function
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Update existing policies to use admin check
DROP POLICY IF EXISTS "booking_select" ON bookings;
DROP POLICY IF EXISTS "booking_insert" ON bookings;
DROP POLICY IF EXISTS "booking_update" ON bookings;
DROP POLICY IF EXISTS "booking_delete" ON bookings;

CREATE POLICY "admin_booking_access"
  ON bookings
  USING (is_admin())
  WITH CHECK (is_admin());

-- Grant dashboard stats permissions to admin
GRANT ALL ON dashboard_stats TO admin;
GRANT ALL ON FUNCTION refresh_dashboard_stats() TO admin;
GRANT ALL ON FUNCTION update_property_availability() TO admin;