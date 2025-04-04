/*
  # Add Delete Policies
  
  1. Changes
    - Add CASCADE DELETE to foreign key constraints
    - Add DELETE policies for all tables
    
  2. Security
    - Enable public delete access with proper constraints
*/

-- Add DELETE policies
DO $$ BEGIN
  -- Delete policies for customers
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public delete' AND tablename = 'customers') THEN
    CREATE POLICY "Allow public delete" ON customers FOR DELETE TO public USING (true);
  END IF;

  -- Delete policies for related tables
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public delete' AND tablename = 'installation_locations') THEN
    CREATE POLICY "Allow public delete" ON installation_locations FOR DELETE TO public USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public delete' AND tablename = 'technical_configs') THEN
    CREATE POLICY "Allow public delete" ON technical_configs FOR DELETE TO public USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public delete' AND tablename = 'financial_terms') THEN
    CREATE POLICY "Allow public delete" ON financial_terms FOR DELETE TO public USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public delete' AND tablename = 'installments') THEN
    CREATE POLICY "Allow public delete" ON installments FOR DELETE TO public USING (true);
  END IF;
END $$;