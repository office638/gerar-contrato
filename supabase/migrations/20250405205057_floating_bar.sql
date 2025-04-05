/*
  # Fix Power of Attorney Policies

  1. Changes
    - Drop and recreate policies with proper error handling
    - Ensure policies are properly scoped to authenticated users
    
  2. Security
    - Maintains same RLS policies and security model
    - Ensures data isolation between users
*/

-- Drop existing policies with proper error handling
DO $$ 
BEGIN
  -- Drop SELECT policy
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'power_of_attorney' 
    AND policyname = 'Users can read own power_of_attorney'
  ) THEN
    DROP POLICY "Users can read own power_of_attorney" ON power_of_attorney;
  END IF;

  -- Drop INSERT policy
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'power_of_attorney' 
    AND policyname = 'Users can insert own power_of_attorney'
  ) THEN
    DROP POLICY "Users can insert own power_of_attorney" ON power_of_attorney;
  END IF;

  -- Drop UPDATE policy
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'power_of_attorney' 
    AND policyname = 'Users can update own power_of_attorney'
  ) THEN
    DROP POLICY "Users can update own power_of_attorney" ON power_of_attorney;
  END IF;

  -- Drop DELETE policy
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'power_of_attorney' 
    AND policyname = 'Users can delete own power_of_attorney'
  ) THEN
    DROP POLICY "Users can delete own power_of_attorney" ON power_of_attorney;
  END IF;
END $$;

-- Recreate policies with proper scoping
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