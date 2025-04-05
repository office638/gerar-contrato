/*
  # Add Authentication and Row Level Security

  1. Changes
    - Add user_id column to all tables
    - Update RLS policies to restrict access based on user_id
    - Add policies for authenticated users only
    
  2. Security
    - Enable RLS on all tables
    - Restrict access to authenticated users
    - Each user can only access their own data
*/

-- Add user_id columns
ALTER TABLE customers ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE installation_locations ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE technical_configs ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE financial_terms ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE installments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

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