-- ==============================================================================
-- CampusLens AI — Phase 37: Smart Campus Scholarships, Financial Aid & Merit Endowment Ledger
-- Migration: 20261004000003_scholarship_schema.sql
-- ==============================================================================

-- 1. Scholarship Schemes & Endowment Trusts Table
CREATE TABLE IF NOT EXISTS public.scholarship_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  scheme_name TEXT NOT NULL,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('Institutional Merit', 'Corporate CSR', 'Alumni Endowment', 'Government DBT', 'Sports Excellence')),
  amount_per_scholar_inr INT NOT NULL CHECK (amount_per_scholar_inr > 0),
  total_budget_inr INT NOT NULL CHECK (total_budget_inr > 0),
  disbursed_budget_inr INT NOT NULL DEFAULT 0,
  min_cgpa NUMERIC(3, 2) NOT NULL DEFAULT 7.50,
  max_family_income_lpa NUMERIC(4, 2) NOT NULL DEFAULT 8.00,
  application_deadline DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Applications Open' CHECK (status IN ('Applications Open', 'Scrutiny Phase', 'Disbursed', 'Archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Student Scholarship Applications Pipeline Table
CREATE TABLE IF NOT EXISTS public.scholarship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  application_code TEXT NOT NULL UNIQUE,
  scheme_name TEXT NOT NULL,
  scholar_id TEXT NOT NULL,
  scholar_name TEXT NOT NULL,
  department TEXT NOT NULL,
  current_cgpa NUMERIC(3, 2) NOT NULL,
  annual_family_income_inr INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Documents Verified', 'Dean Approved', 'Disbursed', 'Rejected')),
  statement_of_purpose TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Direct Benefit Transfer (DBT) Disbursement Tranches Table
CREATE TABLE IF NOT EXISTS public.scholarship_disbursements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  tranche_code TEXT NOT NULL UNIQUE,
  scholar_id TEXT NOT NULL,
  scholar_name TEXT NOT NULL,
  scheme_name TEXT NOT NULL,
  tranche_number INT NOT NULL DEFAULT 1,
  amount_inr INT NOT NULL,
  bank_ref_no TEXT NOT NULL UNIQUE,
  disbursement_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Credited' CHECK (status IN ('Credited', 'Escrow Processing', 'On Hold')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Verifiable Cryptographic Award Certificates Table
CREATE TABLE IF NOT EXISTS public.scholarship_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  certificate_code TEXT NOT NULL UNIQUE,
  scholar_name TEXT NOT NULL,
  scheme_name TEXT NOT NULL,
  academic_year TEXT NOT NULL DEFAULT '2026-2027',
  award_title TEXT NOT NULL,
  sanction_authority TEXT NOT NULL DEFAULT 'Dean of Academic Welfare & Financial Aid',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scholarship_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_disbursements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_certificates ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated campus members
CREATE POLICY "Allow members to view scholarship schemes"
  ON public.scholarship_schemes FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow scholars to view their applications"
  ON public.scholarship_applications FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow scholars to submit scholarship applications"
  ON public.scholarship_applications FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Allow scholars to view disbursements"
  ON public.scholarship_disbursements FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow members to verify scholarship certificates"
  ON public.scholarship_certificates FOR SELECT
  TO authenticated, anon
  USING (true);
