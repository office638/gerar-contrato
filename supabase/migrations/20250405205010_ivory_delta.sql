/*
  # Fix Power of Attorney Policies

  1. Changes
    - Add DROP POLICY IF EXISTS statements before creating policies
    - This ensures policies can be recreated without errors
    
  2. Security
    - Maintains same RLS policies
    - No changes to security model
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own power_of_attorney" ON power_of_attorney;
DROP POLICY IF EXISTS "Users can insert own power_of_attorney" ON power_of_attorney;
DROP POLICY IF EXISTS "Users can update own power_of_attorney" ON power_of_attorney;
DROP POLICY IF EXISTS "Users can delete own power_of_attorney" ON power_of_attorney;

-- Recreate policies
CREATE POLICY "Users can read own power_of_attorney"
  ON power_of_attorney
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own power_of_attorney"
  ON power_of_attorney
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own power_of_attorney"
  ON power_of_attorney
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own power_of_attorney"
  ON power_of_attorney
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);