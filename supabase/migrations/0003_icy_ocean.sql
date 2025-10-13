/*
  # Configuration des réservations

  1. Nouvelle Table
    - `bookings`
      - `id` (uuid, primary key)
      - `property_id` (référence vers properties)
      - `user_id` (référence vers auth.users)
      - `check_in` (date de début)
      - `check_out` (date de fin)
      - `status` (enum: pending, confirmed, cancelled)
      - `total_price` (prix total)
      - timestamps (created_at, updated_at)

  2. Sécurité
    - Enable RLS
    - Policies pour lecture/écriture
*/

-- Type enum pour le statut des réservations
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- Table des réservations
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in date NOT NULL,
  check_out date NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  total_price numeric NOT NULL CHECK (total_price >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Contrainte pour vérifier que check_out est après check_in
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- Activation RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger pour updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();