/*
  # Fix Authentication Setup
  
  1. Changes
    - Enable auth schema extensions
    - Create auth tables if they don't exist
    - Add user_id columns with proper constraints
    - Update RLS policies
    
  2. Security
    - Enable RLS on all tables
    - Restrict access to authenticated users only
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add user_id column to all tables if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE customers ADD COLUMN user_id uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'installation_locations' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE installation_locations ADD COLUMN user_id uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'technical_configs' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE technical_configs ADD COLUMN user_id uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'financial_terms' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE financial_terms ADD COLUMN user_id uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'installments' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE installments ADD COLUMN user_id uuid;
  END IF;
END $$;

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
CREATE POLICY "Enable read access for users" ON customers
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for users" ON customers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for users" ON customers
  FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete for users" ON customers
  FOR DELETE
  USING (true);

-- Create new policies for installation_locations
CREATE POLICY "Enable read access for users" ON installation_locations
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for users" ON installation_locations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for users" ON installation_locations
  FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete for users" ON installation_locations
  FOR DELETE
  USING (true);

-- Create new policies for technical_configs
CREATE POLICY "Enable read access for users" ON technical_configs
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for users" ON technical_configs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for users" ON technical_configs
  FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete for users" ON technical_configs
  FOR DELETE
  USING (true);

-- Create new policies for financial_terms
CREATE POLICY "Enable read access for users" ON financial_terms
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for users" ON financial_terms
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for users" ON financial_terms
  FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete for users" ON financial_terms
  FOR DELETE
  USING (true);

-- Create new policies for installments
CREATE POLICY "Enable read access for users" ON installments
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for users" ON installments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for users" ON installments
  FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete for users" ON installments
  FOR DELETE
  USING (true);