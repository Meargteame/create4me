-- Create4Me Database Schema for Supabase PostgreSQL
-- Run this SQL in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'creator' CHECK (role IN ('creator', 'brand', 'admin')),
  email_verified BOOLEAN DEFAULT FALSE,
  
  -- Security & Verification
  is_verified BOOLEAN DEFAULT FALSE,
  is_vetted_profile BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id),
  
  -- Auth Providers
  google_id TEXT UNIQUE,
  phone_number TEXT UNIQUE,
  is_phone_verified BOOLEAN DEFAULT FALSE,
  
  -- Payment Providers (JSONB for flexibility)
  payment_providers JSONB DEFAULT '{}'::jsonb,
  
  -- Security Tracking
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMPTZ,
  login_history JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- CREATOR PROFILES TABLE
-- =====================================================
CREATE TABLE creator_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar TEXT,
  category TEXT DEFAULT 'General',
  location TEXT,
  
  -- Arrays
  platforms TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  
  -- Stats
  followers INTEGER DEFAULT 0,
  engagement DECIMAL DEFAULT 0,
  rating DECIMAL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  completed_campaigns INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  
  -- Availability
  is_available BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'unavailable')),
  response_time INTEGER DEFAULT 24,
  completion_rate DECIMAL DEFAULT 100,
  
  -- Pricing
  hourly_rate DECIMAL,
  price_range JSONB,
  
  -- JSONB fields
  portfolio_items JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for creator_profiles
CREATE INDEX idx_creator_profiles_user_id ON creator_profiles(user_id);
CREATE INDEX idx_creator_profiles_username ON creator_profiles(username);
CREATE INDEX idx_creator_profiles_category ON creator_profiles(category);

-- =====================================================
-- CAMPAIGNS TABLE
-- =====================================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'in_progress', 'completed', 'cancelled')),
  requirements TEXT,
  deliverables TEXT[] DEFAULT '{}',
  deadline TIMESTAMPTZ,
  
  -- Payment Fields
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'escrowed', 'released', 'refunded', 'failed')),
  payment_per_post DECIMAL,
  payout_date TIMESTAMPTZ,
  payout_transaction_id TEXT,
  payout_amount DECIMAL,
  platform_fee DECIMAL,
  payout_provider TEXT CHECK (payout_provider IN ('chapa', 'telebirr')),
  payment_error TEXT,
  payment_error_date TIMESTAMPTZ,
  
  -- Enhanced fields
  cover_image TEXT,
  target_audience TEXT,
  platforms TEXT[] DEFAULT '{}',
  content_type TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  selected_creators UUID[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for campaigns
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC);

-- =====================================================
-- APPLICATIONS TABLE
-- =====================================================
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  cover_letter TEXT,
  proposed_price DECIMAL CHECK (proposed_price >= 0),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(campaign_id, creator_id)
);

-- Indexes for applications
CREATE INDEX idx_applications_campaign_id ON applications(campaign_id);
CREATE INDEX idx_applications_creator_id ON applications(creator_id);
CREATE INDEX idx_applications_brand_id ON applications(brand_id);
CREATE INDEX idx_applications_status ON applications(status);

-- =====================================================
-- MESSAGES TABLE
-- =====================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for messages
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- =====================================================
-- PAYOUTS TABLE
-- =====================================================
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  provider TEXT NOT NULL CHECK (provider IN ('chapa', 'telebirr')),
  transaction_id TEXT,
  payout_method JSONB,
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for payouts
CREATE INDEX idx_payouts_user_id ON payouts(user_id);
CREATE INDEX idx_payouts_campaign_id ON payouts(campaign_id);
CREATE INDEX idx_payouts_status ON payouts(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Users: Can read all, update own
CREATE POLICY "Users can read all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::TEXT = id::TEXT);

-- Creator Profiles: Can read all, creators can update own
CREATE POLICY "Anyone can read creator profiles" ON creator_profiles FOR SELECT USING (true);
CREATE POLICY "Creators can update own profile" ON creator_profiles FOR UPDATE USING (auth.uid()::TEXT = user_id::TEXT);

-- Campaigns: Brands can create, everyone can read active ones
CREATE POLICY "Anyone can read active campaigns" ON campaigns FOR SELECT USING (status = 'active' OR user_id::TEXT = auth.uid()::TEXT);
CREATE POLICY "Brands can create campaigns" ON campaigns FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id::TEXT);
CREATE POLICY "Brands can update own campaigns" ON campaigns FOR UPDATE USING (auth.uid()::TEXT = user_id::TEXT);

-- Applications: Creators and brands can see relevant ones
CREATE POLICY "Users can read relevant applications" ON applications FOR SELECT USING (
  creator_id::TEXT = auth.uid()::TEXT OR brand_id::TEXT = auth.uid()::TEXT
);
CREATE POLICY "Creators can create applications" ON applications FOR INSERT WITH CHECK (auth.uid()::TEXT = creator_id::TEXT);
CREATE POLICY "Brands can update application status" ON applications FOR UPDATE USING (auth.uid()::TEXT = brand_id::TEXT);

-- Messages: Only sender and receiver can access
CREATE POLICY "Users can read own messages" ON messages FOR SELECT USING (
  sender_id::TEXT = auth.uid()::TEXT OR receiver_id::TEXT = auth.uid()::TEXT
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid()::TEXT = sender_id::TEXT);

-- Payouts: Users can see own payouts
CREATE POLICY "Users can read own payouts" ON payouts FOR SELECT USING (auth.uid()::TEXT = user_id::TEXT);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_creator_profiles_updated_at BEFORE UPDATE ON creator_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON payouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMPLETE
-- =====================================================
-- Schema creation complete! 
-- Next: Configure Auth providers in Supabase Dashboard
