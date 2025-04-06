/*
  # Update waitlist table for public access
  
  1. Changes
    - Drop user_id requirement
    - Update policies to allow public access
    - Remove authentication requirements
    
  2. Security
    - Allow public inserts without auth
    - Maintain data integrity through constraints
*/

-- Create waitlist table if it doesn't exist
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON waitlist;
DROP POLICY IF EXISTS "Users can read own waitlist entries" ON waitlist;
DROP POLICY IF EXISTS "Allow anyone to join waitlist" ON waitlist;
DROP POLICY IF EXISTS "Waitlist for public visitors" ON waitlist;
DROP POLICY IF EXISTS "Public (unauthenticated) can insert into waitlist" ON waitlist;

-- Create new public insert policy
CREATE POLICY "Public (unauthenticated) can insert into waitlist"
ON waitlist
FOR INSERT
TO public
WITH CHECK (auth.uid() IS NULL);

-- Create index on email if it doesn't exist
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist(email);