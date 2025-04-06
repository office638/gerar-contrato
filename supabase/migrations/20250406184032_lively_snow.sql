/*
  # Update waitlist table policies

  1. Changes
    - Allow both authenticated and unauthenticated users to insert into waitlist
    - Remove user_id requirement from insert policy
    - Keep existing read policy for authenticated users
    
  2. Security
    - Maintains RLS enabled
    - Allows public inserts without user_id
    - Preserves data access control for reads
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON waitlist;
DROP POLICY IF EXISTS "Users can read own waitlist entries" ON waitlist;

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create new insert policy with true check
CREATE POLICY "Anyone can insert into waitlist"
ON waitlist
FOR INSERT
TO public
WITH CHECK (true);

-- Keep existing read policy
CREATE POLICY "Users can read own waitlist entries"
ON waitlist
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);