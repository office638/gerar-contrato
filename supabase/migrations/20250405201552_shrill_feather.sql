/*
  # Add user_id column to customers table

  1. Changes
    - Add `user_id` column to `customers` table
    - Add foreign key reference to `auth.users` table
    - Add index on `user_id` column for better query performance
    - Add RLS policy to ensure users can only access their own data

  2. Security
    - Update RLS policies to restrict access based on user_id
    - Users can only access customers associated with their user_id
*/

-- Add user_id column
ALTER TABLE customers
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create index for better query performance
CREATE INDEX customers_user_id_idx ON customers(user_id);

-- Update RLS policies to use user_id
DROP POLICY IF EXISTS "Allow public read access" ON customers;
DROP POLICY IF EXISTS "Allow public insert" ON customers;
DROP POLICY IF EXISTS "Allow public delete" ON customers;

-- Add new RLS policies
CREATE POLICY "Users can read own customers"
ON customers FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers"
ON customers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers"
ON customers FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers"
ON customers FOR DELETE
TO authenticated
USING (auth.uid() = user_id);