/*
  # Add User Ownership RLS Policies

  1. Changes
    - Add user_id column to all tables
    - Add RLS policies to enforce user ownership
    - Update existing policies to check user_id
    
  2. Security
    - Only allow users to access their own records
    - Maintain data isolation between users
    - Preserve existing CASCADE DELETE functionality
*/

-- Add user_id column to all tables
ALTER TABLE customers ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE installation_locations ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE technical_configs ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE financial_terms ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE installments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

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
CREATE POLICY "Users can read own customers"
  ON customers
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers"
  ON customers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers"
  ON customers
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers"
  ON customers
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create new policies for installation_locations
CREATE POLICY "Users can read own installation locations"
  ON installation_locations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own installation locations"
  ON installation_locations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own installation locations"
  ON installation_locations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own installation locations"
  ON installation_locations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create new policies for technical_configs
CREATE POLICY "Users can read own technical configs"
  ON technical_configs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own technical configs"
  ON technical_configs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own technical configs"
  ON technical_configs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own technical configs"
  ON technical_configs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create new policies for financial_terms
CREATE POLICY "Users can read own financial terms"
  ON financial_terms
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial terms"
  ON financial_terms
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial terms"
  ON financial_terms
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial terms"
  ON financial_terms
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create new policies for installments
CREATE POLICY "Users can read own installments"
  ON installments
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM financial_terms ft
    WHERE ft.id = financial_terms_id
    AND ft.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own installments"
  ON installments
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM financial_terms ft
    WHERE ft.id = financial_terms_id
    AND ft.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own installments"
  ON installments
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM financial_terms ft
    WHERE ft.id = financial_terms_id
    AND ft.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM financial_terms ft
    WHERE ft.id = financial_terms_id
    AND ft.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own installments"
  ON installments
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM financial_terms ft
    WHERE ft.id = financial_terms_id
    AND ft.user_id = auth.uid()
  ));