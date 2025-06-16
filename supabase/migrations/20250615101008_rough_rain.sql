-- supabase/migrations/20250616120000_add_age_and_progress.sql

/*
  # Add age field to users table and create user_progress table

  1. Changes to existing tables
    - Add `age` column to `users` table

  2. New Tables
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users.id)
      - `courses_completed` (jsonb, array of completed course IDs)
      - `total_lessons_completed` (integer, total number of lessons completed)
      - `current_streak` (integer, current consecutive days of activity)
      - `last_activity` (timestamptz, last time user was active)
      - `created_at` (timestamptz, when progress tracking started)
      - `updated_at` (timestamptz, last update time)

  3. Security
    - Enable RLS on `user_progress` table
    - Add policy for users to read their own progress
    - Add policy for users to update their own progress

  4. Indexes
    - Index on user_id for fast lookups
    - Index on last_activity for analytics
*/

-- Add age column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS age integer;

-- Add constraint to ensure age is reasonable
ALTER TABLE users ADD CONSTRAINT age_check CHECK (age >= 2 AND age <= 120);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  courses_completed jsonb DEFAULT '[]'::jsonb,
  total_lessons_completed integer DEFAULT 0 CHECK (total_lessons_completed >= 0),
  current_streak integer DEFAULT 0 CHECK (current_streak >= 0),
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on user_progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user_progress
CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_activity ON user_progress(last_activity DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_progress_user_unique ON user_progress(user_id);

-- Create trigger to automatically update updated_at on user_progress
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update existing users to have a default age if null
UPDATE users SET age = 18 WHERE age IS NULL;