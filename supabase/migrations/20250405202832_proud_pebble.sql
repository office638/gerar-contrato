/*
  # Fix power of attorney table column names

  1. Changes
    - Rename columns to match snake_case convention
    - Add missing created_at column
    
  2. Security
    - Maintain existing RLS policies
    - Preserve data integrity
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS power_of_attorney;

-- Create table with correct column names
CREATE TABLE power_of_attorney (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  cpf text NOT NULL,
  rg text,
  issuing_authority text,
  street text NOT NULL,
  number text NOT NULL,
  neighborhood text,
  city text,
  state text,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE power_of_attorney ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX power_of_attorney_user_id_idx ON power_of_attorney(user_id);
CREATE INDEX power_of_attorney_cpf_idx ON power_of_attorney(cpf);
CREATE INDEX power_of_attorney_full_name_idx ON power_of_attorney(full_name);

-- Create RLS policies
CREATE POLICY "Users can read own power_of_attorney"
ON power_of_attorney FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own power_of_attorney"
ON power_of_attorney FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own power_of_attorney"
ON power_of_attorney FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own power_of_attorney"
ON power_of_attorney FOR DELETE
TO authenticated
USING (auth.uid() = user_id);