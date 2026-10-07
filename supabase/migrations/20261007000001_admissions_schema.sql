-- CampusLens AI — Phase 42: Smart Campus Admissions, Program Application & Seat Allocation Gateway
-- Migration: 20261007000001_admissions_schema.sql

-- 1. Academic Programs Table
CREATE TABLE IF NOT EXISTS public.academic_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  program_code TEXT NOT NULL UNIQUE,
  program_name TEXT NOT NULL,
  department TEXT NOT NULL,
  degree_level TEXT NOT NULL CHECK (degree_level IN (
    'Undergraduate (B.Tech)',
    'Postgraduate (M.Tech)',
    'Master of Business Administration (MBA)',
    'Master of Science (M.Sc)',
    'Doctor of Philosophy (Ph.D.)'
  )),
  duration_years NUMERIC(3, 1) NOT NULL DEFAULT 4.0,
  total_seats INTEGER NOT NULL DEFAULT 120,
  available_seats INTEGER NOT NULL DEFAULT 45,
  annual_tuition_inr NUMERIC(10, 2) NOT NULL DEFAULT 185000.00,
  eligibility_cutoff TEXT NOT NULL,
  accreditation TEXT NOT NULL DEFAULT 'NBA Tier-1 & NAAC A++',
  application_deadline DATE NOT NULL,
  is_admissions_open BOOLEAN NOT NULL DEFAULT true,
  brochure_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Admission Applications Table
CREATE TABLE IF NOT EXISTS public.admission_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  application_number TEXT NOT NULL UNIQUE,
  candidate_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  program_code TEXT NOT NULL,
  program_name TEXT NOT NULL,
  quota_category TEXT NOT NULL CHECK (quota_category IN (
    'All India Open (General)',
    'OBC-NCL',
    'SC',
    'ST',
    'EWS',
    'Defense & PwD',
    'Supernumerary International'
  )),
  entrance_exam TEXT NOT NULL,
  entrance_score_rank TEXT NOT NULL,
  qualifying_percentage NUMERIC(5, 2) NOT NULL,
  statement_of_purpose TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN (
    'submitted',
    'document_verified',
    'shortlisted',
    'seat_allotted',
    'provisional_admitted',
    'rejected'
  )),
  allotment_token TEXT,
  provisional_letter_id TEXT,
  application_fee_paid BOOLEAN NOT NULL DEFAULT true,
  applied_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Seat Allotment Dockets Table
CREATE TABLE IF NOT EXISTS public.seat_allotment_dockets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  allotment_number TEXT NOT NULL UNIQUE,
  candidate_name TEXT NOT NULL,
  application_number TEXT NOT NULL,
  program_code TEXT NOT NULL,
  program_name TEXT NOT NULL,
  counseling_round TEXT NOT NULL CHECK (counseling_round IN (
    'Round 1 (Merit Allocation)',
    'Round 2 (Upgradation Round)',
    'Round 3 (Special Round)',
    'Spot & Mop-Up Round'
  )),
  allotted_category TEXT NOT NULL,
  merit_rank INTEGER NOT NULL,
  acceptance_deadline DATE NOT NULL,
  seat_lock_deposit_inr NUMERIC(10, 2) NOT NULL DEFAULT 25000.00,
  is_seat_accepted BOOLEAN NOT NULL DEFAULT false,
  provisional_letter_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Campus Tour & Counselor Bookings Table
CREATE TABLE IF NOT EXISTS public.campus_tour_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  booking_code TEXT NOT NULL UNIQUE,
  candidate_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  tour_mode TEXT NOT NULL CHECK (tour_mode IN (
    'In-Person Welcome Center',
    'Virtual 360 Video Tour'
  )),
  assigned_counselor TEXT NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN (
    'confirmed',
    'completed',
    'rescheduled'
  )),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_academic_programs_code ON public.academic_programs(program_code);
CREATE INDEX IF NOT EXISTS idx_academic_programs_open ON public.academic_programs(is_admissions_open);
CREATE INDEX IF NOT EXISTS idx_admission_applications_num ON public.admission_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_admission_applications_email ON public.admission_applications(email);
CREATE INDEX IF NOT EXISTS idx_seat_allotment_dockets_num ON public.seat_allotment_dockets(allotment_number);
CREATE INDEX IF NOT EXISTS idx_campus_tour_bookings_code ON public.campus_tour_bookings(booking_code);

-- Enable Row Level Security
ALTER TABLE public.academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_allotment_dockets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_tour_bookings ENABLE ROW LEVEL SECURITY;

-- Permissive demo policies
CREATE POLICY "Allow public read academic programs" ON public.academic_programs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert academic programs" ON public.academic_programs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read admission applications" ON public.admission_applications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert admission applications" ON public.admission_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read seat allotment dockets" ON public.seat_allotment_dockets FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert seat allotment dockets" ON public.seat_allotment_dockets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read campus tour bookings" ON public.campus_tour_bookings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert campus tour bookings" ON public.campus_tour_bookings FOR INSERT WITH CHECK (true);
