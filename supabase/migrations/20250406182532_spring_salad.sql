/*
  # Add public insert policy for waitlist

  1. Changes
    - Add policy allowing public users to insert into waitlist table
    - This enables unauthenticated users to sign up for the waitlist
    
  2. Security
    - Only allows INSERT operations
    - No authentication required
    - Maintains data integrity through proper constraints
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON waitlist;

-- Create new policy allowing public inserts
CREATE POLICY "Anyone can insert into waitlist"
  ON waitlist
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index on email if it doesn't exist
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist(email);

-- Create unique constraint on email if it doesn't exist
ALTER TABLE waitlist
  DROP CONSTRAINT IF EXISTS waitlist_email_key,
  ADD CONSTRAINT waitlist_email_key UNIQUE (email);