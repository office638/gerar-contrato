/*
  # Add Authentication and Default Admin User
  
  1. Changes
    - Create default admin user
    - Add RLS policies for authenticated users
    - Add user_id column to all tables
    
  2. Security
    - Enable RLS on all tables
    - Restrict access to authenticated users only
*/

-- Create default admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change_token_current,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'f8b46536-8c34-4d14-b7fa-f4943c7e6e1d',
  'authenticated',
  'authenticated',
  'admin@admin.com',
  -- Password: Admin@123
  '$2a$10$Q.VZfJCpJGt.u3H8saRh8.k0LwBrKndm3UPKvQWE1pUYUhomeVzxK',
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Add user_id column to all tables
ALTER TABLE customers 
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE installation_locations 
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE technical_configs 
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE financial_terms 
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE installments 
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON customers;
DROP POLICY IF EXISTS "Allow public insert" ON customers;
DROP POLICY IF EXISTS "Allow public delete" ON customers;

DROP POLICY IF EXISTS "Allow public read access" ON installation_locations;
DROP POLICY IF EXISTS "Allow public insert" ON installation_locations;
DROP POLICY IF EXISTS "Allow public delete" ON installation_locations;

DROP POLICY IF EXISTS "Allow public read access" ON technical_configs;
DROP POLICY IF EXISTS "Allow public insert" ON technical_configs;
DROP POLICY IF EXISTS "Allow public delete" ON technical_configs;

DROP POLICY IF EXISTS "Allow public read access" ON financial_terms;
DROP POLICY IF EXISTS "Allow public insert" ON financial_terms;
DROP POLICY IF EXISTS "Allow public delete" ON financial_terms;

DROP POLICY IF EXISTS "Allow public read access" ON installments;
DROP POLICY IF EXISTS "Allow public insert" ON installments;
DROP POLICY IF EXISTS "Allow public delete" ON installments;

-- Create new policies for customers
CREATE POLICY "Enable read access for authenticated users" ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for authenticated users" ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for authenticated users" ON customers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for authenticated users" ON customers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create new policies for installation_locations
CREATE POLICY "Enable read access for authenticated users" ON installation_locations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for authenticated users" ON installation_locations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for authenticated users" ON installation_locations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for authenticated users" ON installation_locations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create new policies for technical_configs
CREATE POLICY "Enable read access for authenticated users" ON technical_configs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for authenticated users" ON technical_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for authenticated users" ON technical_configs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for authenticated users" ON technical_configs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create new policies for financial_terms
CREATE POLICY "Enable read access for authenticated users" ON financial_terms
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for authenticated users" ON financial_terms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for authenticated users" ON financial_terms
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for authenticated users" ON financial_terms
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create new policies for installments
CREATE POLICY "Enable read access for authenticated users" ON installments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for authenticated users" ON installments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for authenticated users" ON installments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for authenticated users" ON installments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);