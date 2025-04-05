/*
  # Add User Ownership and RLS Policies

  1. Changes
    - Add user_id column to all tables
    - Add RLS policies for user ownership
    - Update existing policies
    
  2. Security
    - Enable RLS on all tables
    - Add policies for user-based access control
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add user_id columns with proper foreign key constraints
DO $$ BEGIN
  -- Add user_id to customers if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE customers ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;

  -- Add user_id to installation_locations if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'installation_locations' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE installation_locations ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;

  -- Add user_id to technical_configs if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'technical_configs' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE technical_configs ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;

  -- Add user_id to financial_terms if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'financial_terms' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE financial_terms ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;

  -- Add user_id to installments if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'installments' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE installments ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$ BEGIN
  -- Drop customers policies
  DROP POLICY IF EXISTS "Allow public read access" ON customers;
  DROP POLICY IF EXISTS "Allow public insert" ON customers;
  DROP POLICY IF EXISTS "Allow public delete" ON customers;
  DROP POLICY IF EXISTS "Users can read own customers" ON customers;
  DROP POLICY IF EXISTS "Users can insert own customers" ON customers;
  DROP POLICY IF EXISTS "Users can update own customers" ON customers;
  DROP POLICY IF EXISTS "Users can delete own customers" ON customers;

  -- Drop installation_locations policies
  DROP POLICY IF EXISTS "Allow public read access" ON installation_locations;
  DROP POLICY IF EXISTS "Allow public insert" ON installation_locations;
  DROP POLICY IF EXISTS "Allow public delete" ON installation_locations;
  DROP POLICY IF EXISTS "Users can read own installation locations" ON installation_locations;
  DROP POLICY IF EXISTS "Users can insert own installation locations" ON installation_locations;
  DROP POLICY IF EXISTS "Users can update own installation locations" ON installation_locations;
  DROP POLICY IF EXISTS "Users can delete own installation locations" ON installation_locations;

  -- Drop technical_configs policies
  DROP POLICY IF EXISTS "Allow public read access" ON technical_configs;
  DROP POLICY IF EXISTS "Allow public insert" ON technical_configs;
  DROP POLICY IF EXISTS "Allow public delete" ON technical_configs;
  DROP POLICY IF EXISTS "Users can read own technical configs" ON technical_configs;
  DROP POLICY IF EXISTS "Users can insert own technical configs" ON technical_configs;
  DROP POLICY IF EXISTS "Users can update own technical configs" ON technical_configs;
  DROP POLICY IF EXISTS "Users can delete own technical configs" ON technical_configs;

  -- Drop financial_terms policies
  DROP POLICY IF EXISTS "Allow public read access" ON financial_terms;
  DROP POLICY IF EXISTS "Allow public insert" ON financial_terms;
  DROP POLICY IF EXISTS "Allow public delete" ON financial_terms;
  DROP POLICY IF EXISTS "Users can read own financial terms" ON financial_terms;
  DROP POLICY IF EXISTS "Users can insert own financial terms" ON financial_terms;
  DROP POLICY IF EXISTS "Users can update own financial terms" ON financial_terms;
  DROP POLICY IF EXISTS "Users can delete own financial terms" ON financial_terms;

  -- Drop installments policies
  DROP POLICY IF EXISTS "Allow public read access" ON installments;
  DROP POLICY IF EXISTS "Allow public insert" ON installments;
  DROP POLICY IF EXISTS "Allow public delete" ON installments;
  DROP POLICY IF EXISTS "Users can read own installments" ON installments;
  DROP POLICY IF EXISTS "Users can insert own installments" ON installments;
  DROP POLICY IF EXISTS "Users can update own installments" ON installments;
  DROP POLICY IF EXISTS "Users can delete own installments" ON installments;
END $$;

-- Create new policies for customers
CREATE POLICY "Users can read own customers"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers"
  ON customers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers"
  ON customers FOR DELETE
  USING (auth.uid() = user_id);

-- Create new policies for installation_locations
CREATE POLICY "Users can read own installation locations"
  ON installation_locations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own installation locations"
  ON installation_locations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own installation locations"
  ON installation_locations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own installation locations"
  ON installation_locations FOR DELETE
  USING (auth.uid() = user_id);

-- Create new policies for technical_configs
CREATE POLICY "Users can read own technical configs"
  ON technical_configs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own technical configs"
  ON technical_configs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own technical configs"
  ON technical_configs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own technical configs"
  ON technical_configs FOR DELETE
  USING (auth.uid() = user_id);

-- Create new policies for financial_terms
CREATE POLICY "Users can read own financial terms"
  ON financial_terms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial terms"
  ON financial_terms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial terms"
  ON financial_terms FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial terms"
  ON financial_terms FOR DELETE
  USING (auth.uid() = user_id);

-- Create new policies for installments
CREATE POLICY "Users can read own installments"
  ON installments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM financial_terms ft
    WHERE ft.id = financial_terms_id
    AND ft.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own installments"
  ON installments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM financial_terms ft
    WHERE ft.id = financial_terms_id
    AND ft.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own installments"
  ON installments FOR UPDATE
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
  ON installments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM financial_terms ft
    WHERE ft.id = financial_terms_id
    AND ft.user_id = auth.uid()
  ));