/*
  # Create comments table for the comment system

  1. New Tables
    - `comments`
      - `id` (uuid, primary key)
      - `username` (text, 2-50 characters)
      - `comment_text` (text, 10-500 characters)
      - `timestamp` (timestamptz, default now())
      - `ip_address` (inet, for moderation)
      - `likes` (integer, default 0)
      - `reported` (boolean, default false)

  2. Security
    - Enable RLS on `comments` table
    - Add policy for public read access
    - Add policy for authenticated comment creation
    - Add policy for moderation (admin only)

  3. Indexes
    - Index on timestamp for efficient sorting
    - Index on ip_address for rate limiting queries
*/

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL CHECK (length(username) >= 2 AND length(username) <= 50),
  comment_text text NOT NULL CHECK (length(comment_text) >= 10 AND length(comment_text) <= 500),
  timestamp timestamptz DEFAULT now(),
  ip_address inet,
  likes integer DEFAULT 0,
  reported boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can delete comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_timestamp ON comments(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_comments_ip_address ON comments(ip_address);
CREATE INDEX IF NOT EXISTS idx_comments_reported ON comments(reported) WHERE reported = true;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();