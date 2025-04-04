/*
  # Add installation locations and technical configurations tables

  1. New Tables
    - `installation_locations`
      - Links to customers table
      - Stores installation address and utility info
    - `technical_configs`
      - Links to customers table
      - Stores inverter and solar module details
    - `financial_terms`
      - Links to customers table
      - Stores payment information

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

CREATE TABLE installation_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  street text NOT NULL,
  number text NOT NULL,
  neighborhood text,
  city text,
  state text,
  zip_code text,
  utility_code text,
  utility_company text,
  installation_type text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE technical_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  inverter1_brand text,
  inverter1_power numeric,
  inverter1_quantity integer,
  inverter1_warranty_period integer,
  inverter2_brand text,
  inverter2_power numeric,
  inverter2_quantity integer,
  inverter2_warranty_period integer,
  solar_modules_brand text,
  solar_modules_power numeric,
  solar_modules_quantity integer,
  installation_type text,
  installation_days integer,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE financial_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  total_amount numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE installments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financial_terms_id uuid REFERENCES financial_terms(id),
  method text NOT NULL,
  amount numeric NOT NULL,
  due_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE installation_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON installation_locations FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access" ON technical_configs FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access" ON financial_terms FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access" ON installments FOR SELECT TO public USING (true);

-- Add policies for insert
CREATE POLICY "Allow public insert" ON customers FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public insert" ON installation_locations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public insert" ON technical_configs FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public insert" ON financial_terms FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public insert" ON installments FOR INSERT TO public WITH CHECK (true);