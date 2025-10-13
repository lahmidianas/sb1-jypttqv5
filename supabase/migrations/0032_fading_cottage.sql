/*
  # Admin Access Control
  
  1. Changes
    - Create admin role management
    - Set up admin-only policies
    - Add admin check function
  
  2. Security
    - Only admin users can access admin features
    - Regular users cannot access admin functionality
*/

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "allow_booking_select" ON bookings;
DROP POLICY IF EXISTS "allow_booking_insert" ON bookings;
DROP POLICY IF EXISTS "allow_booking_update" ON bookings;
DROP POLICY IF EXISTS "allow_booking_delete" ON bookings;

-- Create admin-only policies for bookings
CREATE POLICY "admin_booking_select"
  ON bookings FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "admin_booking_insert"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "admin_booking_update"
  ON bookings FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "admin_booking_delete"
  ON bookings FOR DELETE
  TO authenticated
  USING (is_admin());

-- Drop existing policies for properties
DROP POLICY IF EXISTS "Allow public read access" ON properties;
DROP POLICY IF EXISTS "Allow authenticated users to create properties" ON properties;
DROP POLICY IF EXISTS "Allow authenticated users to update their properties" ON properties;

-- Create admin-only policies for properties
CREATE POLICY "admin_property_select"
  ON properties FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "admin_property_insert"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "admin_property_update"
  ON properties FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "admin_property_delete"
  ON properties FOR DELETE
  TO authenticated
  USING (is_admin());

-- Grant permissions
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;