-- Drop existing policies if they exist
DROP POLICY IF EXISTS "bookings_all_access" ON bookings;
DROP POLICY IF EXISTS "properties_all_access" ON properties;
DROP POLICY IF EXISTS "clients_all_access" ON clients;
DROP POLICY IF EXISTS "allow_all_bookings_select" ON bookings;
DROP POLICY IF EXISTS "allow_all_bookings_insert" ON bookings;
DROP POLICY IF EXISTS "allow_all_bookings_update" ON bookings;
DROP POLICY IF EXISTS "allow_all_bookings_delete" ON bookings;
DROP POLICY IF EXISTS "allow_all_properties_select" ON properties;
DROP POLICY IF EXISTS "allow_all_properties_insert" ON properties;
DROP POLICY IF EXISTS "allow_all_properties_update" ON properties;
DROP POLICY IF EXISTS "allow_all_properties_delete" ON properties;
DROP POLICY IF EXISTS "allow_all_clients_select" ON clients;
DROP POLICY IF EXISTS "allow_all_clients_insert" ON clients;
DROP POLICY IF EXISTS "allow_all_clients_update" ON clients;
DROP POLICY IF EXISTS "allow_all_clients_delete" ON clients;

-- Create unified policies for each table
CREATE POLICY "bookings_access_policy"
  ON bookings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (
    check_out > check_in AND
    NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.property_id = property_id
      AND b.status = 'confirmed'
      AND b.check_in < check_out
      AND b.check_out > check_in
      AND b.id != COALESCE(id, '00000000-0000-0000-0000-000000000000')
    )
  );

CREATE POLICY "properties_access_policy"
  ON properties FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "clients_access_policy"
  ON clients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;