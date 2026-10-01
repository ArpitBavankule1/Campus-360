-- ==============================================================================
-- CampusLens AI — Phase 26: Alumni Network, Mentorship Nexus & Endowment Giving
-- Migration: 20261001000001_alumni_schema.sql
-- ==============================================================================

-- 1. Alumni Profiles Table
CREATE TABLE IF NOT EXISTS public.alumni_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  graduating_year INTEGER NOT NULL,
  department TEXT NOT NULL,
  degree TEXT NOT NULL DEFAULT 'B.Tech',
  current_role TEXT NOT NULL,
  company TEXT NOT NULL,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  bio TEXT,
  linkedin_url TEXT,
  mentorship_available BOOLEAN NOT NULL DEFAULT true,
  willing_to_refer BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Alumni Mentorship Sessions Table
CREATE TABLE IF NOT EXISTS public.alumni_mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  alumni_id UUID NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  topic TEXT NOT NULL CHECK (topic IN ('resume_review', 'mock_interview', 'career_guidance', 'phd_advice', 'startup_mentorship')),
  session_type TEXT NOT NULL DEFAULT 'virtual',
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 45,
  meeting_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Alumni Job & Internship Referrals Table
CREATE TABLE IF NOT EXISTS public.alumni_job_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  alumni_id UUID NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  alumni_name TEXT NOT NULL,
  company TEXT NOT NULL,
  role_title TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('full_time', 'internship', 'remote', 'contract')),
  experience_level TEXT NOT NULL DEFAULT 'entry_level' CHECK (experience_level IN ('entry_level', 'mid_level', 'senior', 'intern')),
  location TEXT NOT NULL,
  salary_range TEXT,
  application_deadline TIMESTAMPTZ NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  apply_url TEXT,
  description TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Alumni Endowment Giving & Donations Table
CREATE TABLE IF NOT EXISTS public.alumni_donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  graduating_year INTEGER,
  campaign TEXT NOT NULL CHECK (campaign IN ('stem_scholarship', 'innovation_lab', 'sports_complex', 'hardship_fund', 'library_endowment')),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  pledge_status TEXT NOT NULL DEFAULT 'completed' CHECK (pledge_status IN ('pledged', 'completed', 'processing')),
  transaction_ref TEXT NOT NULL UNIQUE,
  receipt_code TEXT NOT NULL UNIQUE,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Alumni Digital Passes Table
CREATE TABLE IF NOT EXISTS public.alumni_digital_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  alumni_id UUID NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  pass_code TEXT NOT NULL UNIQUE,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '5 years')::date,
  privileges JSONB NOT NULL DEFAULT '["library_access", "guest_house", "gym_access", "campus_entry"]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_college ON public.alumni_profiles(college_id);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_industry ON public.alumni_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_batch ON public.alumni_profiles(graduating_year);
CREATE INDEX IF NOT EXISTS idx_alumni_mentorship_alumni ON public.alumni_mentorship_sessions(alumni_id);
CREATE INDEX IF NOT EXISTS idx_alumni_mentorship_student ON public.alumni_mentorship_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_alumni_referrals_company ON public.alumni_job_referrals(company);
CREATE INDEX IF NOT EXISTS idx_alumni_donations_campaign ON public.alumni_donations(campaign);
CREATE INDEX IF NOT EXISTS idx_alumni_passes_code ON public.alumni_digital_passes(pass_code);

-- Enable Row Level Security (RLS)
ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_job_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_digital_passes ENABLE ROW LEVEL SECURITY;

-- Read policies for institutional community
CREATE POLICY "Public read for alumni profiles" ON public.alumni_profiles FOR SELECT USING (true);
CREATE POLICY "Public read for mentorship sessions" ON public.alumni_mentorship_sessions FOR SELECT USING (true);
CREATE POLICY "Public read for alumni job referrals" ON public.alumni_job_referrals FOR SELECT USING (true);
CREATE POLICY "Public read for alumni donations" ON public.alumni_donations FOR SELECT USING (true);
CREATE POLICY "Public read for alumni passes" ON public.alumni_digital_passes FOR SELECT USING (true);

-- Insert policies for authenticated users
CREATE POLICY "Insert mentorship session" ON public.alumni_mentorship_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Insert job referral" ON public.alumni_job_referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Insert donation pledge" ON public.alumni_donations FOR INSERT WITH CHECK (true);
