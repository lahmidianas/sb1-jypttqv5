/*
  # Add example client

  1. New Data
    - Add an example client with realistic data
    - Ensure data is appropriate for testing
*/

-- Insert example client
INSERT INTO clients (
  fullName,
  email,
  phone,
  address,
  created_at,
  updated_at
) VALUES (
  'Mohammed El Amrani',
  'mohammed.elamrani@example.com',
  '+212 661-234567',
  '123 Avenue Mohammed VI, Tanger, Maroc',
  now(),
  now()
) ON CONFLICT DO NOTHING;