-- ================================================================
-- CampusLens AI — Phase 25 Database Migration
-- Student Clubs, Technical Societies, Event Ticketing & Activity Merit Ledger
-- Tables: student_clubs, club_memberships, club_event_tickets, student_merit_activities
-- Indexes, RLS Multi-Tenant Policies & Triggers
-- ================================================================

-- 1. Student Clubs & Societies Table
CREATE TABLE IF NOT EXISTS public.student_clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('technical', 'cultural', 'sports', 'literary', 'social')),
  description TEXT NOT NULL,
  logo_url TEXT,
  lead_student_name TEXT NOT NULL,
  faculty_mentor_name TEXT NOT NULL,
  member_count INTEGER NOT NULL DEFAULT 1 CHECK (member_count >= 0),
  meeting_venue TEXT NOT NULL,
  recruitment_open BOOLEAN NOT NULL DEFAULT true,
  social_links JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Club Memberships Table
CREATE TABLE IF NOT EXISTS public.club_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES public.student_clubs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'core_team', 'lead', 'treasurer')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'alumni', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT club_membership_unique UNIQUE (club_id, student_id)
);

-- 3. Club Event Passes & Tickets Table
CREATE TABLE IF NOT EXISTS public.club_event_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ticket_code TEXT NOT NULL UNIQUE,
  event_title TEXT NOT NULL,
  venue TEXT NOT NULL,
  seat_tier TEXT NOT NULL DEFAULT 'General Access',
  price NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Student Activity Merit Ledger Table
CREATE TABLE IF NOT EXISTS public.student_merit_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  club_id UUID REFERENCES public.student_clubs(id) ON DELETE SET NULL,
  activity_title TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('hackathon', 'workshop', 'cultural_performance', 'sports_meet', 'paper_presentation')),
  merit_points INTEGER NOT NULL DEFAULT 10 CHECK (merit_points > 0),
  certificate_url TEXT,
  verified_by TEXT NOT NULL,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_student_clubs_category ON public.student_clubs(category);
CREATE INDEX IF NOT EXISTS idx_club_memberships_student ON public.club_memberships(student_id);
CREATE INDEX IF NOT EXISTS idx_club_event_tickets_student ON public.club_event_tickets(student_id);
CREATE INDEX IF NOT EXISTS idx_student_merit_student ON public.student_merit_activities(student_id);

-- Enable RLS
ALTER TABLE public.student_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_event_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_merit_activities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read student clubs" ON public.student_clubs
  FOR SELECT USING (true);

CREATE POLICY "Students view their club memberships" ON public.club_memberships
  FOR SELECT USING (auth.uid() = student_id OR current_user_role() IN ('admin', 'faculty'));

CREATE POLICY "Students insert club membership requests" ON public.club_memberships
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students view their event tickets" ON public.club_event_tickets
  FOR SELECT USING (auth.uid() = student_id OR current_user_role() IN ('admin', 'faculty'));

CREATE POLICY "Students view their activity merit points" ON public.student_merit_activities
  FOR SELECT USING (auth.uid() = student_id OR current_user_role() IN ('admin', 'faculty', 'hod'));
