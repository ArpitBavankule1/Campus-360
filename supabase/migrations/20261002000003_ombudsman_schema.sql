-- ==============================================================================
-- CampusLens AI — Phase 31: Campus Grievance Redressal, Anti-Ragging & Student Ombudsman
-- Migration: 20261002000003_ombudsman_schema.sql
-- ==============================================================================

-- 1. Formal Grievance Cases Table
CREATE TABLE IF NOT EXISTS public.grievance_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  tracking_hash TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Anti-Ragging Squad', 'Internal Complaints Committee (ICC)', 'Academic Evaluation & Exams', 'Hostel Amenities & Mess', 'Discrimination & Harassment', 'General Grievance')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT true,
  complainant_masked_id TEXT NOT NULL,
  urgency_level TEXT NOT NULL DEFAULT 'Standard Review' CHECK (urgency_level IN ('Critical Emergency', 'High Priority', 'Standard Review')),
  escalation_tier TEXT NOT NULL DEFAULT 'Department Committee' CHECK (escalation_tier IN ('Department Committee', 'Proctorial Board', 'Dean of Student Welfare', 'Campus Ombudsman')),
  sla_deadline TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Under Hearing', 'Directive Issued', 'Resolved', 'Dismissed')),
  evidence_attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Statutory Ombudsman & ICC Committee Members Table
CREATE TABLE IF NOT EXISTS public.grievance_committee_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  committee_role TEXT NOT NULL CHECK (committee_role IN ('Ombudsman Chair (Retd. District Judge)', 'Chief Proctor', 'Dean of Student Welfare', 'External NGO Representative', 'ICC Presiding Officer', 'Student Representative')),
  contact_email TEXT NOT NULL,
  office_location TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Confidential Redressal Hearings Docket Table
CREATE TABLE IF NOT EXISTS public.grievance_hearings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES public.grievance_cases(id) ON DELETE CASCADE,
  docket_number TEXT NOT NULL UNIQUE,
  hearing_date TIMESTAMPTZ NOT NULL,
  tribunal_venue TEXT NOT NULL,
  presiding_officer TEXT NOT NULL,
  quorum_present JSONB NOT NULL DEFAULT '[]'::jsonb,
  hearing_notes TEXT,
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Session', 'Concluded', 'Adjourned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Formal Resolution Directives & Orders Table
CREATE TABLE IF NOT EXISTS public.grievance_resolution_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES public.grievance_cases(id) ON DELETE CASCADE,
  order_serial_code TEXT NOT NULL UNIQUE,
  presiding_authority TEXT NOT NULL,
  findings_summary TEXT NOT NULL,
  mandatory_directives TEXT NOT NULL,
  compliance_deadline DATE NOT NULL,
  is_statutory_binding BOOLEAN NOT NULL DEFAULT true,
  digital_seal_hash TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_grv_tracking_hash ON public.grievance_cases(tracking_hash);
CREATE INDEX IF NOT EXISTS idx_grv_category ON public.grievance_cases(category);
CREATE INDEX IF NOT EXISTS idx_grv_status ON public.grievance_cases(status);
CREATE INDEX IF NOT EXISTS idx_grv_hearing_docket ON public.grievance_hearings(docket_number);
CREATE INDEX IF NOT EXISTS idx_grv_order_serial ON public.grievance_resolution_orders(order_serial_code);

-- Enable RLS
ALTER TABLE public.grievance_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievance_committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievance_hearings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievance_resolution_orders ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public read for grievance cases" ON public.grievance_cases FOR SELECT USING (true);
CREATE POLICY "Public read for grievance committee members" ON public.grievance_committee_members FOR SELECT USING (true);
CREATE POLICY "Public read for grievance hearings" ON public.grievance_hearings FOR SELECT USING (true);
CREATE POLICY "Public read for grievance resolution orders" ON public.grievance_resolution_orders FOR SELECT USING (true);
