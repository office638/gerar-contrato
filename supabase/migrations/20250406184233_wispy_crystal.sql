/*
  # Fix waitlist table and constraints

  1. Changes
    - Create waitlist table if not exists
    - Add unique constraint on email safely
    - Create index on email
    - Enable RLS with proper policies
    
  2. Security
    - Enable RLS
    - Allow public inserts
    - Allow authenticated users to read own entries
*/

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Safely add unique constraint on email
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'waitlist_email_key'
  ) THEN
    ALTER TABLE waitlist ADD CONSTRAINT waitlist_email_key UNIQUE (email);
  END IF;
END $$;

-- Create index on email if it doesn't exist
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist(email);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON waitlist;
DROP POLICY IF EXISTS "Users can read own waitlist entries" ON waitlist;

-- Create policies
CREATE POLICY "Anyone can insert into waitlist"
ON waitlist
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Users can read own waitlist entries"
ON waitlist
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);