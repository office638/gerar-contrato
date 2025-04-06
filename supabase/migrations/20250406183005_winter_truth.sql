/*
  # Fix waitlist table RLS policies

  1. Changes
    - Drop existing RLS policies on waitlist table
    - Create new policies that allow:
      - Public users to insert new rows
      - Only authenticated users to view their own entries
      - Status field defaults to 'pending'

  2. Security
    - Enable RLS on waitlist table
    - Public can insert but not read
    - Authenticated users can only read their own entries
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Only unauthenticated users can insert into waitlist" ON waitlist;
DROP POLICY IF EXISTS "Users can read own waitlist entries" ON waitlist;

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create new policies
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