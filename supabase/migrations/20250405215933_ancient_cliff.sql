/*
  # Implement strict Row Level Security policies

  1. Changes
    - Update RLS policies for all tables to ensure users can only access their own data
    - Drop existing policies and recreate them with proper user_id checks
    - Add user_id foreign key constraints where missing
    
  2. Security
    - Ensures data isolation between users
    - Prevents unauthorized access to other users' records
    - Maintains data integrity through proper foreign key relationships
*/

-- Drop existing policies
DO $$ 
BEGIN
  -- Customers table policies
  DROP POLICY IF EXISTS "Users can read own customers" ON customers;
  DROP POLICY IF EXISTS "Users can insert own customers" ON customers;
  DROP POLICY IF EXISTS "Users can update own customers" ON customers;
  DROP POLICY IF EXISTS "Users can delete own customers" ON customers;

  -- Installation locations table policies
  DROP POLICY IF EXISTS "Enable read access for users" ON installation_locations;
  DROP POLICY IF EXISTS "Enable insert for users" ON installation_locations;
  DROP POLICY IF EXISTS "Enable update for users" ON installation_locations;
  DROP POLICY IF EXISTS "Enable delete for users" ON installation_locations;

  -- Technical configs table policies
  DROP POLICY IF EXISTS "Enable read access for users" ON technical_configs;
  DROP POLICY IF EXISTS "Enable insert for users" ON technical_configs;
  DROP POLICY IF EXISTS "Enable update for users" ON technical_configs;
  DROP POLICY IF EXISTS "Enable delete for users" ON technical_configs;

  -- Financial terms table policies
  DROP POLICY IF EXISTS "Enable read access for users" ON financial_terms;
  DROP POLICY IF EXISTS "Enable insert for users" ON financial_terms;
  DROP POLICY IF EXISTS "Enable update for users" ON financial_terms;
  DROP POLICY IF EXISTS "Enable delete for users" ON financial_terms;

  -- Installments table policies
  DROP POLICY IF EXISTS "Enable read access for users" ON installments;
  DROP POLICY IF EXISTS "Enable insert for users" ON installments;
  DROP POLICY IF EXISTS "Enable update for users" ON installments;
  DROP POLICY IF EXISTS "Enable delete for users" ON installments;
END $$;

-- Add user_id column to tables that don't have it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'installation_locations' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE installation_locations ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'technical_configs' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE technical_configs ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'financial_terms' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE financial_terms ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'installments' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE installments ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Create new policies for customers table
CREATE POLICY "Users can read own customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers"
  ON customers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create new policies for installation_locations table
CREATE POLICY "Users can read own installation_locations"
  ON installation_locations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own installation_locations"
  ON installation_locations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own installation_locations"
  ON installation_locations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own installation_locations"
  ON installation_locations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create new policies for technical_configs table
CREATE POLICY "Users can read own technical_configs"
  ON technical_configs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own technical_configs"
  ON technical_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own technical_configs"
  ON technical_configs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own technical_configs"
  ON technical_configs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create new policies for financial_terms table
CREATE POLICY "Users can read own financial_terms"
  ON financial_terms
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial_terms"
  ON financial_terms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial_terms"
  ON financial_terms
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial_terms"
  ON financial_terms
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create new policies for installments table
CREATE POLICY "Users can read own installments"
  ON installments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own installments"
  ON installments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own installments"
  ON installments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own installments"
  ON installments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update existing records to set user_id
DO $$
BEGIN
  -- Update installation_locations
  UPDATE installation_locations il
  SET user_id = c.user_id
  FROM customers c
  WHERE il.customer_id = c.id AND il.user_id IS NULL;

  -- Update technical_configs
  UPDATE technical_configs tc
  SET user_id = c.user_id
  FROM customers c
  WHERE tc.customer_id = c.id AND tc.user_id IS NULL;

  -- Update financial_terms
  UPDATE financial_terms ft
  SET user_id = c.user_id
  FROM customers c
  WHERE ft.customer_id = c.id AND ft.user_id IS NULL;

  -- Update installments
  UPDATE installments i
  SET user_id = ft.user_id
  FROM financial_terms ft
  WHERE i.financial_terms_id = ft.id AND i.user_id IS NULL;
END $$;