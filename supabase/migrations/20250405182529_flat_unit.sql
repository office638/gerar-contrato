/*
  # Add CASCADE DELETE to Foreign Keys

  1. Changes
    - Add ON DELETE CASCADE to all foreign key constraints
    - This ensures automatic deletion of related records when a customer is deleted
    
  2. Security
    - Maintains existing RLS policies
    - Preserves data integrity through proper cascading
*/

-- Drop existing foreign key constraints
ALTER TABLE installation_locations 
  DROP CONSTRAINT IF EXISTS installation_locations_customer_id_fkey;

ALTER TABLE technical_configs 
  DROP CONSTRAINT IF EXISTS technical_configs_customer_id_fkey;

ALTER TABLE financial_terms 
  DROP CONSTRAINT IF EXISTS financial_terms_customer_id_fkey;

ALTER TABLE installments 
  DROP CONSTRAINT IF EXISTS installments_financial_terms_id_fkey;

-- Re-add constraints with CASCADE DELETE
ALTER TABLE installation_locations
  ADD CONSTRAINT installation_locations_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES customers(id) 
  ON DELETE CASCADE;

ALTER TABLE technical_configs
  ADD CONSTRAINT technical_configs_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES customers(id) 
  ON DELETE CASCADE;

ALTER TABLE financial_terms
  ADD CONSTRAINT financial_terms_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES customers(id) 
  ON DELETE CASCADE;

ALTER TABLE installments
  ADD CONSTRAINT installments_financial_terms_id_fkey 
  FOREIGN KEY (financial_terms_id) 
  REFERENCES financial_terms(id) 
  ON DELETE CASCADE;