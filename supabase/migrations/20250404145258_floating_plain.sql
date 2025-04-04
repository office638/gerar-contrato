/*
  # Complete Solar Contract Database Schema

  1. Tables
    - customers: Customer personal information
    - installation_locations: Installation address and utility details
    - technical_configs: Inverter and solar module specifications
    - financial_terms: Payment information
    - installments: Individual payment installments

  2. Security
    - Enable RLS on all tables
    - Add policies for public read/write access
*/

-- Create tables if they don't exist
DO $$ BEGIN
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

  CREATE TABLE IF NOT EXISTS installation_locations (
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

  CREATE TABLE IF NOT EXISTS technical_configs (
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

  CREATE TABLE IF NOT EXISTS financial_terms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid REFERENCES customers(id),
    total_amount numeric NOT NULL,
    created_at timestamptz DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS installments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    financial_terms_id uuid REFERENCES financial_terms(id),
    method text NOT NULL,
    amount numeric NOT NULL,
    due_date date NOT NULL,
    created_at timestamptz DEFAULT now()
  );
END $$;

-- Enable Row Level Security
DO $$ BEGIN
  ALTER TABLE installation_locations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE technical_configs ENABLE ROW LEVEL SECURITY;
  ALTER TABLE financial_terms ENABLE ROW LEVEL SECURITY;
  ALTER TABLE installments ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create policies if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access' AND tablename = 'installation_locations') THEN
    CREATE POLICY "Allow public read access" ON installation_locations FOR SELECT TO public USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access' AND tablename = 'technical_configs') THEN
    CREATE POLICY "Allow public read access" ON technical_configs FOR SELECT TO public USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access' AND tablename = 'financial_terms') THEN
    CREATE POLICY "Allow public read access" ON financial_terms FOR SELECT TO public USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access' AND tablename = 'installments') THEN
    CREATE POLICY "Allow public read access" ON installments FOR SELECT TO public USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert' AND tablename = 'installation_locations') THEN
    CREATE POLICY "Allow public insert" ON installation_locations FOR INSERT TO public WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert' AND tablename = 'technical_configs') THEN
    CREATE POLICY "Allow public insert" ON technical_configs FOR INSERT TO public WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert' AND tablename = 'financial_terms') THEN
    CREATE POLICY "Allow public insert" ON financial_terms FOR INSERT TO public WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert' AND tablename = 'installments') THEN
    CREATE POLICY "Allow public insert" ON installments FOR INSERT TO public WITH CHECK (true);
  END IF;
END $$;

-- Create indexes for better performance
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS customers_cpf_idx ON customers(cpf);
  CREATE INDEX IF NOT EXISTS customers_full_name_idx ON customers(full_name);
  CREATE INDEX IF NOT EXISTS installation_locations_customer_id_idx ON installation_locations(customer_id);
  CREATE INDEX IF NOT EXISTS technical_configs_customer_id_idx ON technical_configs(customer_id);
  CREATE INDEX IF NOT EXISTS financial_terms_customer_id_idx ON financial_terms(customer_id);
  CREATE INDEX IF NOT EXISTS installments_financial_terms_id_idx ON installments(financial_terms_id);
END $$;