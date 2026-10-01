-- ==============================================================================
-- CampusLens AI — Phase 28: Research Publications, Innovation Grants & IPR Hub
-- Migration: 20261001000003_research_schema.sql
-- ==============================================================================

-- 1. Research Publications Table
CREATE TABLE IF NOT EXISTS public.research_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  authors JSONB NOT NULL DEFAULT '[]'::jsonb,
  department TEXT NOT NULL,
  journal_or_conference TEXT NOT NULL,
  publication_date DATE NOT NULL,
  doi TEXT NOT NULL UNIQUE,
  citation_count INTEGER NOT NULL DEFAULT 0 CHECK (citation_count >= 0),
  indexing TEXT NOT NULL CHECK (indexing IN ('Scopus', 'IEEE Xplore', 'Springer', 'ACM', 'SCI', 'Other')),
  open_access BOOLEAN NOT NULL DEFAULT true,
  abstract TEXT NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Research Sponsored Grants Table
CREATE TABLE IF NOT EXISTS public.research_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  project_title TEXT NOT NULL,
  principal_investigator TEXT NOT NULL,
  co_pis JSONB NOT NULL DEFAULT '[]'::jsonb,
  funding_agency TEXT NOT NULL CHECK (funding_agency IN ('DST', 'SERB', 'ISRO', 'DRDO', 'Industry Sponsored', 'EU Horizon', 'Institutional Grant')),
  total_grant_amount NUMERIC(14, 2) NOT NULL CHECK (total_grant_amount > 0),
  disbursed_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (disbursed_amount >= 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  milestone_status TEXT NOT NULL DEFAULT 'ongoing' CHECK (milestone_status IN ('ongoing', 'completed', 'under_review', 'extended')),
  deliverables_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Patent & Intellectual Property Rights (IPR) Table
CREATE TABLE IF NOT EXISTS public.patent_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  inventors JSONB NOT NULL DEFAULT '[]'::jsonb,
  application_number TEXT NOT NULL UNIQUE,
  filing_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'filed' CHECK (status IN ('filed', 'published', 'granted', 'commercialized')),
  ipr_type TEXT NOT NULL CHECK (ipr_type IN ('Patent', 'Copyright', 'Industrial Design', 'Trademark')),
  abstract TEXT NOT NULL,
  commercial_partner TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Campus Incubation Startups Table
CREATE TABLE IF NOT EXISTS public.innovation_startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  startup_name TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  founder_role TEXT NOT NULL DEFAULT 'student' CHECK (founder_role IN ('student', 'faculty', 'alumni', 'team')),
  sector TEXT NOT NULL CHECK (sector IN ('EdTech', 'CleanTech', 'HealthTech', 'AI/ML', 'Robotics', 'FinTech', 'BioTech')),
  funding_stage TEXT NOT NULL DEFAULT 'Prototype' CHECK (funding_stage IN ('Idea', 'Prototype', 'Seed Funded', 'Series A', 'Revenue Generating')),
  incubation_space TEXT NOT NULL DEFAULT 'T-Hub Innovation Pod C4',
  seed_grant_awarded NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  pitch_deck_url TEXT,
  website_url TEXT,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_research_pub_doi ON public.research_publications(doi);
CREATE INDEX IF NOT EXISTS idx_research_pub_indexing ON public.research_publications(indexing);
CREATE INDEX IF NOT EXISTS idx_research_grants_agency ON public.research_grants(funding_agency);
CREATE INDEX IF NOT EXISTS idx_patents_number ON public.patent_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_startups_sector ON public.innovation_startups(sector);

-- Enable RLS
ALTER TABLE public.research_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patent_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_startups ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public read for research publications" ON public.research_publications FOR SELECT USING (true);
CREATE POLICY "Public read for research grants" ON public.research_grants FOR SELECT USING (true);
CREATE POLICY "Public read for patent applications" ON public.patent_applications FOR SELECT USING (true);
CREATE POLICY "Public read for innovation startups" ON public.innovation_startups FOR SELECT USING (true);
