-- ==============================================================================
-- CampusLens AI — Phase 29: International Scholars, Exchange Programs & Global Mobility Hub
-- Migration: 20261002000001_international_schema.sql
-- ==============================================================================

-- 1. Partner Universities Table
CREATE TABLE IF NOT EXISTS public.partner_universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  university_name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  qs_world_ranking INTEGER CHECK (qs_world_ranking > 0),
  programs_offered JSONB NOT NULL DEFAULT '[]'::jsonb,
  min_gpa_required NUMERIC(3, 2) NOT NULL DEFAULT 3.00 CHECK (min_gpa_required >= 0.00 AND min_gpa_required <= 4.00),
  exchange_slots INTEGER NOT NULL DEFAULT 5 CHECK (exchange_slots >= 0),
  tuition_waiver BOOLEAN NOT NULL DEFAULT true,
  application_deadline DATE NOT NULL,
  semester_term TEXT NOT NULL CHECK (semester_term IN ('Fall 2026', 'Spring 2027', 'Summer Research 2027', 'Full Academic Year 2026-27')),
  campus_website TEXT,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. International Scholarships & Fellowships Table
CREATE TABLE IF NOT EXISTS public.international_scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  fellowship_title TEXT NOT NULL,
  sponsoring_body TEXT NOT NULL,
  coverage_type TEXT NOT NULL CHECK (coverage_type IN ('Full Tuition + Living', 'Full Tuition Only', 'Travel & Research Grant', 'Partial Subsidy')),
  award_amount_usd NUMERIC(10, 2) NOT NULL CHECK (award_amount_usd > 0),
  target_countries JSONB NOT NULL DEFAULT '[]'::jsonb,
  eligibility_criteria TEXT NOT NULL,
  application_deadline DATE NOT NULL,
  open_slots INTEGER NOT NULL DEFAULT 3 CHECK (open_slots >= 0),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'reviewing')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Academic Credit Transfer & Equivalence Table
CREATE TABLE IF NOT EXISTS public.credit_transfer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  host_university TEXT NOT NULL,
  foreign_course_code TEXT NOT NULL,
  foreign_course_title TEXT NOT NULL,
  credits_earned INTEGER NOT NULL CHECK (credits_earned > 0),
  equivalent_domestic_course TEXT NOT NULL,
  equivalent_credits INTEGER NOT NULL CHECK (equivalent_credits > 0),
  grade_earned TEXT NOT NULL,
  syllabus_document_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
  evaluator_remarks TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  evaluated_at TIMESTAMPTZ
);

-- 4. International Travel Clearance & Visa Verification Table
CREATE TABLE IF NOT EXISTS public.travel_clearance_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  pass_code TEXT NOT NULL UNIQUE,
  destination_country TEXT NOT NULL,
  host_institution TEXT NOT NULL,
  passport_number_masked TEXT NOT NULL,
  visa_type TEXT NOT NULL CHECK (visa_type IN ('F-1 / J-1 (USA)', 'Tier 4 / Student Visa (UK)', 'Schengen Student (EU)', 'Student Pass (Singapore)', 'Australian Student 500')),
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  dean_approval_status TEXT NOT NULL DEFAULT 'approved' CHECK (dean_approval_status IN ('pending', 'approved', 'denied')),
  digital_qr_token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_partner_univ_country ON public.partner_universities(country);
CREATE INDEX IF NOT EXISTS idx_partner_univ_term ON public.partner_universities(semester_term);
CREATE INDEX IF NOT EXISTS idx_intl_schol_coverage ON public.international_scholarships(coverage_type);
CREATE INDEX IF NOT EXISTS idx_credit_transfer_student ON public.credit_transfer_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_travel_clearance_code ON public.travel_clearance_passes(pass_code);

-- Enable Row Level Security (RLS)
ALTER TABLE public.partner_universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.international_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transfer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_clearance_passes ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public read for partner universities" ON public.partner_universities FOR SELECT USING (true);
CREATE POLICY "Public read for international scholarships" ON public.international_scholarships FOR SELECT USING (true);
CREATE POLICY "Public read for credit transfer requests" ON public.credit_transfer_requests FOR SELECT USING (true);
CREATE POLICY "Public read for travel clearance passes" ON public.travel_clearance_passes FOR SELECT USING (true);
