/*
  # Grant Full Permissions
  
  1. Changes
    - Grant full permissions on all tables to authenticated users
    - Remove restrictive RLS policies
    - Add new permissive policies
  
  2. Security
    - Maintain basic validation checks
    - Prevent double bookings
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "admin_booking_select" ON bookings;
DROP POLICY IF EXISTS "admin_booking_insert" ON bookings;
DROP POLICY IF EXISTS "admin_booking_update" ON bookings;
DROP POLICY IF EXISTS "admin_booking_delete" ON bookings;
DROP POLICY IF EXISTS "admin_property_select" ON properties;
DROP POLICY IF EXISTS "admin_property_insert" ON properties;
DROP POLICY IF EXISTS "admin_property_update" ON properties;
DROP POLICY IF EXISTS "admin_property_delete" ON properties;

-- Create permissive policies for bookings
CREATE POLICY "allow_all_bookings_select"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_all_bookings_insert"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Only maintain basic validation
    check_out > check_in AND
    -- Prevent double booking
    NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.property_id = property_id
      AND b.status = 'confirmed'
      AND b.check_in < check_out
      AND b.check_out > check_in
      AND b.id != COALESCE(id, '00000000-0000-0000-0000-000000000000')
    )
  );

CREATE POLICY "allow_all_bookings_update"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (check_out > check_in);

CREATE POLICY "allow_all_bookings_delete"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);

-- Create permissive policies for properties
CREATE POLICY "allow_all_properties_select"
  ON properties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_all_properties_insert"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "allow_all_properties_update"
  ON properties FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "allow_all_properties_delete"
  ON properties FOR DELETE
  TO authenticated
  USING (true);

-- Grant all permissions on all tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;