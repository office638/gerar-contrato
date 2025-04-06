/*
  # Update waitlist policy for unauthenticated users

  1. Changes
    - Modify policy to only allow unauthenticated users to insert into waitlist
    - This ensures authenticated users cannot sign up for the waitlist
    
  2. Security
    - Only allows INSERT operations from unauthenticated users
    - Maintains data integrity through proper constraints
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON waitlist;

-- Create new policy allowing only unauthenticated inserts
CREATE POLICY "Only unauthenticated users can insert into waitlist"
  ON waitlist
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NULL);

-- Ensure status is set to pending by default
ALTER TABLE waitlist 
  ALTER COLUMN status SET DEFAULT 'pending';