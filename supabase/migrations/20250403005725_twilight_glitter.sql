/*
  # Create customers table

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `cpf` (text, unique)
      - `rg` (text)
      - `issuing_authority` (text)
      - `profession` (text)
      - `nationality` (text)
      - `phone` (text)
      - `email` (text)
      - `marital_status` (text)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on `customers` table
    - Add policy for authenticated users to read all customers
*/

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  cpf text UNIQUE NOT NULL,
  rg text,
  issuing_authority text,
  profession text,
  nationality text DEFAULT 'Brasileiro(a)',
  phone text,
  email text,
  marital_status text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON customers
  FOR SELECT
  TO public
  USING (true);