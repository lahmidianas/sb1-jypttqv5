/*
  # Fix client table structure

  1. Changes
    - Rename column to use snake_case
    - Add email and phone validation constraints
*/

-- Rename column using ALTER TABLE
ALTER TABLE clients 
  RENAME COLUMN fullName TO full_name;

-- Add email validation constraint
ALTER TABLE clients 
  ADD CONSTRAINT clients_email_check 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add phone validation constraint
ALTER TABLE clients 
  ADD CONSTRAINT clients_phone_check 
  CHECK (phone ~* '^\+?[0-9\s-]{8,}$');