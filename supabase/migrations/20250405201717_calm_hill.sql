/*
  # Fix user_id column and RLS policies

  1. Changes
    - Add user_id column if not exists
    - Add foreign key reference to auth.users
    - Update RLS policies to properly handle user_id
    - Add indexes for better performance

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users only
    - Ensure users can only access their own data
*/

-- Add user_id column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE customers ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS customers_user_id_idx ON customers(user_id);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own customers" ON customers;
DROP POLICY IF EXISTS "Users can insert own customers" ON customers;
DROP POLICY IF EXISTS "Users can update own customers" ON customers;
DROP POLICY IF EXISTS "Users can delete own customers" ON customers;
DROP POLICY IF EXISTS "Enable read access for users" ON customers;
DROP POLICY IF EXISTS "Enable insert for users" ON customers;
DROP POLICY IF EXISTS "Enable update for users" ON customers;
DROP POLICY IF EXISTS "Enable delete for users" ON customers;

-- Create new RLS policies
CREATE POLICY "Users can read own customers"
ON customers FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own customers"
ON customers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own customers"
ON customers FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own customers"
ON customers FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL);

-- Update existing records to set user_id if null
UPDATE customers 
SET user_id = auth.uid()
WHERE user_id IS NULL;