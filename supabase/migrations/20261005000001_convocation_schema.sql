-- CampusLens AI — Phase 38: Smart Campus Digital Credentialing, Academic Convocation & Verifiable Degree Ledger
-- Migration: 20261005000001_convocation_schema.sql

-- 1. Degree Credentials Table
CREATE TABLE IF NOT EXISTS public.degree_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  credential_code TEXT NOT NULL UNIQUE,
  scholar_id TEXT NOT NULL,
  scholar_name TEXT NOT NULL,
  degree_type TEXT NOT NULL CHECK (degree_type IN ('Bachelor of Technology', 'Master of Technology', 'Doctor of Philosophy', 'Master of Business Admin', 'Honorary Doctorate')),
  department TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  cgpa NUMERIC(4, 2) NOT NULL,
  honors_classification TEXT NOT NULL CHECK (honors_classification IN ('First Class with Distinction', 'First Class Honours', 'Dean''s Gold Medalist', 'Chancellor''s Citation')),
  cryptographic_hash TEXT NOT NULL,
  credential_status TEXT NOT NULL DEFAULT 'Issued & Cryptographically Signed' CHECK (credential_status IN ('Issued & Cryptographically Signed', 'Pending Convocation', 'Revoked')),
  conferred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Convocation Ceremonies Table
CREATE TABLE IF NOT EXISTS public.convocation_ceremonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  edition_title TEXT NOT NULL,
  academic_session TEXT NOT NULL,
  chief_guest_name TEXT NOT NULL,
  chief_guest_designation TEXT NOT NULL,
  ceremony_date DATE NOT NULL,
  ceremony_time TEXT NOT NULL,
  venue_auditorium TEXT NOT NULL,
  total_degrees_awarded INTEGER NOT NULL DEFAULT 0,
  regalia_dress_code TEXT NOT NULL,
  ceremony_status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (ceremony_status IN ('Scheduled', 'In Procession', 'Concluded')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Convocation Registrations Table
CREATE TABLE IF NOT EXISTS public.convocation_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  registration_code TEXT NOT NULL UNIQUE,
  scholar_id TEXT NOT NULL,
  scholar_name TEXT NOT NULL,
  ceremony_id UUID REFERENCES public.convocation_ceremonies(id) ON DELETE CASCADE,
  degree_awarded TEXT NOT NULL,
  gown_size TEXT NOT NULL CHECK (gown_size IN ('Small (S)', 'Medium (M)', 'Large (L)', 'Extra Large (XL)')),
  guest_pass_count INTEGER NOT NULL DEFAULT 2,
  allocated_seat_number TEXT NOT NULL,
  admittance_pass_code TEXT NOT NULL UNIQUE,
  is_gown_collected BOOLEAN NOT NULL DEFAULT false,
  is_checked_in BOOLEAN NOT NULL DEFAULT false,
  registered_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Credential Verifications (Employer / University Background Check) Table
CREATE TABLE IF NOT EXISTS public.credential_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  verification_code TEXT NOT NULL UNIQUE,
  credential_code TEXT NOT NULL,
  requester_organization TEXT NOT NULL,
  requester_contact_email TEXT NOT NULL,
  verification_purpose TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'Verified & Authentic' CHECK (verification_status IN ('Verified & Authentic', 'Record Under Audit', 'Invalid Hash')),
  verified_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for lightning queries
CREATE INDEX IF NOT EXISTS idx_degree_credentials_college ON public.degree_credentials(college_id);
CREATE INDEX IF NOT EXISTS idx_degree_credentials_code ON public.degree_credentials(credential_code);
CREATE INDEX IF NOT EXISTS idx_degree_credentials_scholar ON public.degree_credentials(scholar_id);
CREATE INDEX IF NOT EXISTS idx_convocation_ceremonies_college ON public.convocation_ceremonies(college_id);
CREATE INDEX IF NOT EXISTS idx_convocation_registrations_scholar ON public.convocation_registrations(scholar_id);
CREATE INDEX IF NOT EXISTS idx_credential_verifications_code ON public.credential_verifications(verification_code);

-- Enable Row Level Security
ALTER TABLE public.degree_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.convocation_ceremonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.convocation_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credential_verifications ENABLE ROW LEVEL SECURITY;

-- Permissive demo policies
CREATE POLICY "Allow public read degree credentials" ON public.degree_credentials FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert degree credentials" ON public.degree_credentials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read convocation ceremonies" ON public.convocation_ceremonies FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert convocation ceremonies" ON public.convocation_ceremonies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read convocation registrations" ON public.convocation_registrations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert convocation registrations" ON public.convocation_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read credential verifications" ON public.credential_verifications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert credential verifications" ON public.credential_verifications FOR INSERT WITH CHECK (true);
