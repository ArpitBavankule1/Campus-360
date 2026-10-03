-- ==============================================================================
-- CampusLens AI — Phase 32: Smart Campus Sports Arena, Athletic Leagues & Gym Facilities
-- Migration: 20261003000001_sports_schema.sql
-- ==============================================================================

-- 1. Sports Arenas & Courts Table
CREATE TABLE IF NOT EXISTS public.sports_arenas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  arena_name TEXT NOT NULL,
  sport_type TEXT NOT NULL CHECK (sport_type IN ('Badminton', 'Basketball', 'Tennis', 'Football / Turf', 'Cricket Nets', 'Swimming Pool', 'Table Tennis', 'Squash')),
  location_venue TEXT NOT NULL,
  total_courts INT NOT NULL DEFAULT 1,
  court_surface TEXT NOT NULL DEFAULT 'Synthetic Maple Wood',
  hourly_rate INT NOT NULL DEFAULT 0,
  is_floodlit BOOLEAN NOT NULL DEFAULT true,
  opening_time TIME NOT NULL DEFAULT '06:00:00',
  closing_time TIME NOT NULL DEFAULT '22:00:00',
  current_status TEXT NOT NULL DEFAULT 'Available' CHECK (current_status IN ('Available', 'Booked Out', 'Maintenance')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Athletic Leagues & Inter-Department Tournaments Table
CREATE TABLE IF NOT EXISTS public.athletic_leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  tournament_title TEXT NOT NULL,
  sport_type TEXT NOT NULL,
  organizer_department TEXT NOT NULL,
  season_year INT NOT NULL DEFAULT 2026,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  participating_teams INT NOT NULL DEFAULT 8,
  prize_pool_inr INT NOT NULL DEFAULT 25000,
  status TEXT NOT NULL DEFAULT 'Registration Open' CHECK (status IN ('Upcoming', 'Registration Open', 'Knockouts Ongoing', 'Completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. High-Performance Campus Gym Memberships & Biometric Passes Table
CREATE TABLE IF NOT EXISTS public.gym_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  scholar_id TEXT NOT NULL,
  scholar_name TEXT NOT NULL,
  pass_code TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'Student All-Access' CHECK (tier IN ('Student All-Access', 'Faculty Executive', 'Athlete High-Performance', 'Day Pass')),
  fitness_slot TEXT NOT NULL CHECK (fitness_slot IN ('Early Bird (06:00 - 08:00)', 'Morning Peak (08:00 - 10:00)', 'Evening Surge (17:00 - 19:30)', 'Night Owl (19:30 - 22:00)')),
  trainer_assigned TEXT,
  bmi_index NUMERIC(4, 1),
  is_biometric_active BOOLEAN NOT NULL DEFAULT true,
  valid_until DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Sports Equipment Inventory & Loan Ledger Table
CREATE TABLE IF NOT EXISTS public.equipment_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  equipment_code TEXT NOT NULL UNIQUE,
  item_name TEXT NOT NULL,
  sport_type TEXT NOT NULL,
  borrower_id TEXT NOT NULL,
  borrower_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  checkout_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_time TIMESTAMPTZ NOT NULL,
  deposit_inr INT NOT NULL DEFAULT 200,
  item_condition TEXT NOT NULL DEFAULT 'Good' CHECK (item_condition IN ('Mint', 'Good', 'Fair', 'Damaged')),
  status TEXT NOT NULL DEFAULT 'Active Loan' CHECK (status IN ('Active Loan', 'Returned On-Time', 'Overdue', 'Deposit Forfeited')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sports_sport_type ON public.sports_arenas(sport_type);
CREATE INDEX IF NOT EXISTS idx_sports_status ON public.sports_arenas(current_status);
CREATE INDEX IF NOT EXISTS idx_leagues_sport ON public.athletic_leagues(sport_type);
CREATE INDEX IF NOT EXISTS idx_gym_pass_code ON public.gym_memberships(pass_code);
CREATE INDEX IF NOT EXISTS idx_equipment_code ON public.equipment_loans(equipment_code);

-- Enable RLS
ALTER TABLE public.sports_arenas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletic_leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_loans ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public read for sports arenas" ON public.sports_arenas FOR SELECT USING (true);
CREATE POLICY "Public read for athletic leagues" ON public.athletic_leagues FOR SELECT USING (true);
CREATE POLICY "Public read for gym memberships" ON public.gym_memberships FOR SELECT USING (true);
CREATE POLICY "Public read for equipment loans" ON public.equipment_loans FOR SELECT USING (true);
