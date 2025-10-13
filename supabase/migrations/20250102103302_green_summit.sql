-- Drop existing property policies
DROP POLICY IF EXISTS "property_access_policy" ON properties;
DROP POLICY IF EXISTS "properties_all_access" ON properties;
DROP POLICY IF EXISTS "admin_property_select" ON properties;

-- Create new policies for properties
CREATE POLICY "allow_public_read_properties"
  ON properties FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "allow_admin_write_properties"
  ON properties FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_properties_available 
  ON properties(available);