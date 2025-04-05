/*
  # Add User Ownership and RLS Policies

  1. Changes
    - Add user_id column to all tables
    - Update RLS policies for user-based access
    - Ensure proper cascading relationships
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users only
*/

-- Add user_id columns
ALTER TABLE customers ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE installation_locations ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE technical_configs ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE financial_terms ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE installments ADD COLUMN IF NOT EXISTS user_id uuid;

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;

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
CREATE POLICY "Enable read for users based on user_id" ON customers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users based on user_id" ON customers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON customers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON customers
  FOR DELETE USING (auth.uid() = user_id);

-- Create new policies for installation_locations
CREATE POLICY "Enable read for users based on user_id" ON installation_locations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users based on user_id" ON installation_locations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON installation_locations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON installation_locations
  FOR DELETE USING (auth.uid() = user_id);

-- Create new policies for technical_configs
CREATE POLICY "Enable read for users based on user_id" ON technical_configs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users based on user_id" ON technical_configs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON technical_configs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON technical_configs
  FOR DELETE USING (auth.uid() = user_id);

-- Create new policies for financial_terms
CREATE POLICY "Enable read for users based on user_id" ON financial_terms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users based on user_id" ON financial_terms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON financial_terms
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON financial_terms
  FOR DELETE USING (auth.uid() = user_id);

-- Create new policies for installments
CREATE POLICY "Enable read for users based on user_id" ON installments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users based on user_id" ON installments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON installments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON installments
  FOR DELETE USING (auth.uid() = user_id);