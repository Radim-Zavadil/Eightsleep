-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  date_of_birth DATE,
  weight DECIMAL(5,2), -- in kg
  height DECIMAL(5,2), -- in cm
  sport_activity TEXT CHECK (sport_activity IN ('Yes', 'No', 'Sometimes')),
  sleep_goal_hours DECIMAL(3,1), -- in hours
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a new user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sleep Records Table (linked to profiles)
CREATE TABLE sleep_records (
    sleep_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL,
    date DATE NOT NULL,
    sleep_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    wake_up_time TIMESTAMP WITH TIME ZONE NOT NULL,
    sleep_duration DECIMAL(4,2) NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    UNIQUE (profile_id, date)
);

-- Journal Entries Table (linked to profiles)
CREATE TABLE journal_entries (
    entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL,
    date DATE NOT NULL,
    text_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Drop old table if it exists
DROP TABLE IF EXISTS checlist_items;

-- Create new table for bedroom checklist items
CREATE TABLE IF NOT EXISTS bedroom_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  rule_name text NOT NULL,
  goal text,
  checked boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Optional: index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_bedroom_checklist_user_id ON bedroom_checklist_items (user_id);

-- Create indexes for better query performance
CREATE INDEX idx_sleep_records_profile_id ON sleep_records(profile_id);
CREATE INDEX idx_journal_entries_profile_id ON journal_entries(profile_id);
CREATE INDEX idx_checklist_items_profile_id ON checklist_items(profile_id);
