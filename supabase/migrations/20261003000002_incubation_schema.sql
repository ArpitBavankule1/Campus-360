-- ==============================================================================
-- CampusLens AI — Phase 33: Campus Incubation, Startup Accelerator & Maker Space
-- Migration: 20261003000002_incubation_schema.sql
-- ==============================================================================

-- 1. Student & Faculty Incubation Ventures Table
CREATE TABLE IF NOT EXISTS public.incubation_ventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  venture_name TEXT NOT NULL,
  sector TEXT NOT NULL CHECK (sector IN ('DeepTech & AI', 'Climate & CleanTech', 'BioTech & HealthCare', 'FinTech & Web3', 'Robotics & Hardware', 'EdTech & Consumer')),
  founder_name TEXT NOT NULL,
  founder_id TEXT NOT NULL,
  founder_role TEXT NOT NULL DEFAULT 'Student Founder',
  pitch_deck_url TEXT,
  stage TEXT NOT NULL DEFAULT 'Ideation' CHECK (stage IN ('Ideation', 'Prototyping', 'Seed Funded', 'Series A Scaled', 'Graduated')),
  valuation_inr BIGINT NOT NULL DEFAULT 5000000,
  seed_grant_inr INT NOT NULL DEFAULT 250000,
  patents_filed INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Incubated' CHECK (status IN ('Applied', 'Incubated', 'Accelerated', 'Exited', 'Rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Seed Funding Tranches & Angel Investor Disbursements Table
CREATE TABLE IF NOT EXISTS public.venture_funding_tranches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  venture_id UUID NOT NULL REFERENCES public.incubation_ventures(id) ON DELETE CASCADE,
  tranche_name TEXT NOT NULL,
  amount_inr INT NOT NULL,
  investor_type TEXT NOT NULL CHECK (investor_type IN ('Institutional Seed Fund', 'Angel Syndicate', 'Government DST Grant', 'Alumni Endowment Venture Fund')),
  disbursement_date DATE NOT NULL,
  milestone_verified BOOLEAN NOT NULL DEFAULT true,
  disbursement_status TEXT NOT NULL DEFAULT 'Disbursed' CHECK (disbursement_status IN ('Pending Audit', 'Approved', 'Disbursed', 'Withheld')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Rapid Prototyping Maker Space Equipment & Workbenches Table
CREATE TABLE IF NOT EXISTS public.maker_space_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  equipment_name TEXT NOT NULL,
  equipment_type TEXT NOT NULL CHECK (equipment_type IN ('Industrial 3D Printer', 'CNC Milling Workbench', 'Laser Cutter & Engraver', 'PCB Pick-and-Place Machine', 'High-Frequency Spectrum Analyzer', 'VR / AR Emulation Rig')),
  location_lab TEXT NOT NULL,
  hourly_slot_capacity INT NOT NULL DEFAULT 2,
  specs_summary TEXT NOT NULL,
  is_operational BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Angel Demo Day & Mentor Pitch Sessions Table
CREATE TABLE IF NOT EXISTS public.pitch_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  session_code TEXT NOT NULL UNIQUE,
  venture_id UUID NOT NULL REFERENCES public.incubation_ventures(id) ON DELETE CASCADE,
  pitch_date TIMESTAMPTZ NOT NULL,
  angel_investor_panel JSONB NOT NULL DEFAULT '[]'::jsonb,
  venue TEXT NOT NULL DEFAULT 'Apex Incubation Boardroom & Webcast Suite',
  verdict TEXT NOT NULL DEFAULT 'Under Deliberation' CHECK (verdict IN ('Term Sheet Offered', 'Seed Grant Approved', 'Follow-up Diligence', 'Under Deliberation', 'Declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ventures_sector ON public.incubation_ventures(sector);
CREATE INDEX IF NOT EXISTS idx_ventures_stage ON public.incubation_ventures(stage);
CREATE INDEX IF NOT EXISTS idx_tranches_venture ON public.venture_funding_tranches(venture_id);
CREATE INDEX IF NOT EXISTS idx_makerspace_type ON public.maker_space_equipment(equipment_type);
CREATE INDEX IF NOT EXISTS idx_pitch_code ON public.pitch_sessions(session_code);

-- Enable RLS
ALTER TABLE public.incubation_ventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venture_funding_tranches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maker_space_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitch_sessions ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public read for incubation ventures" ON public.incubation_ventures FOR SELECT USING (true);
CREATE POLICY "Public read for venture funding tranches" ON public.venture_funding_tranches FOR SELECT USING (true);
CREATE POLICY "Public read for maker space equipment" ON public.maker_space_equipment FOR SELECT USING (true);
CREATE POLICY "Public read for pitch sessions" ON public.pitch_sessions FOR SELECT USING (true);
