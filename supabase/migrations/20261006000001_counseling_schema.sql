-- CampusLens AI — Phase 41: Smart Campus Mental Health, Psychological Counseling & Peer Support Sanctuary
-- Migration: 20261006000001_counseling_schema.sql

-- 1. Counseling Sessions Table
CREATE TABLE IF NOT EXISTS public.counseling_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  session_code TEXT NOT NULL UNIQUE,
  scholar_id TEXT NOT NULL,
  scholar_name TEXT NOT NULL,
  counselor_name TEXT NOT NULL,
  counselor_specialization TEXT NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('One-on-One Tele-Therapy', 'In-Person Clinic Visit', 'Stress & Academic Anxiety', 'Urgent Crisis Counseling')),
  scheduled_date DATE NOT NULL,
  scheduled_time_slot TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('Confidential Video Call', 'Infirmary Wellness Suite', 'Anonymous Voice Line')),
  status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'In Session', 'Completed', 'Rescheduled')),
  confidential_notes_encrypted BOOLEAN NOT NULL DEFAULT true,
  access_pass_token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Peer Support Circles Table
CREATE TABLE IF NOT EXISTS public.peer_support_circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  circle_name TEXT NOT NULL,
  theme TEXT NOT NULL CHECK (theme IN ('Exam Stress & Burnout', 'Imposter Syndrome & Tech Pressure', 'Hostel Homesickness & Transition', 'Mindfulness & Sleep Hygiene')),
  facilitator_name TEXT NOT NULL,
  schedule_info TEXT NOT NULL,
  meeting_venue TEXT NOT NULL,
  max_participants INTEGER NOT NULL DEFAULT 15,
  enrolled_count INTEGER NOT NULL DEFAULT 8,
  is_anonymous BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'Open for Joining' CHECK (status IN ('Open for Joining', 'Session in Progress', 'Full Capacity')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Daily Mood Check-Ins Table
CREATE TABLE IF NOT EXISTS public.mood_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  scholar_id TEXT NOT NULL,
  mood_score INTEGER NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
  mood_tag TEXT NOT NULL CHECK (mood_tag IN ('Great', 'Calm', 'Overwhelmed', 'Anxious', 'Exhausted')),
  sleep_hours NUMERIC(3, 1) NOT NULL DEFAULT 7.0,
  stress_factors TEXT[] NOT NULL DEFAULT '{"Academics"}',
  coping_exercise TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 24x7 Campus & National Crisis Helplines Table
CREATE TABLE IF NOT EXISTS public.crisis_helplines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  availability TEXT NOT NULL DEFAULT '24x7 Emergency',
  coverage_scope TEXT NOT NULL,
  is_toll_free BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_counseling_sessions_code ON public.counseling_sessions(session_code);
CREATE INDEX IF NOT EXISTS idx_counseling_sessions_scholar ON public.counseling_sessions(scholar_id);
CREATE INDEX IF NOT EXISTS idx_peer_support_circles_status ON public.peer_support_circles(status);
CREATE INDEX IF NOT EXISTS idx_mood_checkins_scholar ON public.mood_checkins(scholar_id);

-- Enable Row Level Security
ALTER TABLE public.counseling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_support_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_helplines ENABLE ROW LEVEL SECURITY;

-- Permissive demo policies
CREATE POLICY "Allow public read counseling sessions" ON public.counseling_sessions FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert counseling sessions" ON public.counseling_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read peer circles" ON public.peer_support_circles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert peer circles" ON public.peer_support_circles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read mood checkins" ON public.mood_checkins FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert mood checkins" ON public.mood_checkins FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read crisis helplines" ON public.crisis_helplines FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert crisis helplines" ON public.crisis_helplines FOR INSERT WITH CHECK (true);
