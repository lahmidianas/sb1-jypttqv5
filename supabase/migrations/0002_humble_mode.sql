/*
  # Configuration de l'authentification

  1. Configuration
    - Active l'authentification par email
    - Désactive la confirmation par email
    - Configure les politiques de sécurité
*/

-- Configurer auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion de nouveaux utilisateurs
CREATE POLICY "Users can insert their own record." 
  ON auth.users 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de lire leur propre enregistrement
CREATE POLICY "Users can view their own record." 
  ON auth.users 
  FOR SELECT 
  USING (auth.uid() = id);

-- Créer un utilisateur administrateur par défaut
DO $$
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@medimmosecret.com',
    crypt('Admin123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) ON CONFLICT DO NOTHING;
END $$;