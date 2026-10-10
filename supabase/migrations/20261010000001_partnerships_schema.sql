-- ============================================================================
-- CampusLens AI — Phase 45: Smart Campus Industry MoUs, Corporate CSR & Sponsored Research Partnerships Schema
-- Migration: 20261010000001_partnerships_schema.sql
-- ============================================================================

-- 1. Industry MoUs & Corporate Alliances
CREATE TABLE IF NOT EXISTS public.industry_mous (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID,
    partner_name VARCHAR(255) NOT NULL,
    partner_logo VARCHAR(512),
    partner_tier VARCHAR(50) NOT NULL DEFAULT 'core' CHECK (partner_tier IN ('strategic', 'core', 'affiliate', 'startup_incubator')),
    industry_sector VARCHAR(100) NOT NULL,
    mou_token VARCHAR(64) UNIQUE NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    scope TEXT NOT NULL,
    key_objectives TEXT[] DEFAULT '{}',
    executive_sponsor VARCHAR(255) NOT NULL,
    nodal_faculty_coordinator VARCHAR(255) NOT NULL,
    financial_commitment_inr BIGINT DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_renewal', 'expired', 'under_draft')),
    signed_document_url VARCHAR(512),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Corporate Sponsored Research & CSR Grants
CREATE TABLE IF NOT EXISTS public.sponsored_grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID,
    project_title VARCHAR(255) NOT NULL,
    mou_id UUID REFERENCES public.industry_mous(id) ON DELETE SET NULL,
    sponsor_name VARCHAR(255) NOT NULL,
    grant_type VARCHAR(50) NOT NULL DEFAULT 'sponsored_research' CHECK (grant_type IN ('sponsored_research', 'corporate_csr', 'faculty_chair', 'student_hackathon')),
    principal_investigator VARCHAR(255) NOT NULL,
    co_investigators TEXT[] DEFAULT '{}',
    department VARCHAR(100) NOT NULL,
    grant_amount_inr BIGINT NOT NULL,
    disbursed_amount_inr BIGINT DEFAULT 0,
    grant_token VARCHAR(64) UNIQUE NOT NULL,
    milestones_json JSONB DEFAULT '[]'::jsonb,
    deliverables TEXT[] DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('proposed', 'under_review', 'awarded', 'active', 'completed')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Joint Industry Co-Branded Laboratories & Facilities
CREATE TABLE IF NOT EXISTS public.industry_labs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID,
    lab_name VARCHAR(255) NOT NULL,
    mou_id UUID REFERENCES public.industry_mous(id) ON DELETE CASCADE,
    industry_partner VARCHAR(255) NOT NULL,
    facility_location VARCHAR(255) NOT NULL,
    sponsored_equipment TEXT[] DEFAULT '{}',
    compute_quota_teraflops NUMERIC DEFAULT 0,
    access_tier VARCHAR(50) NOT NULL DEFAULT 'students_and_faculty' CHECK (access_tier IN ('open_campus', 'students_and_faculty', 'research_fellows_only', 'restricted_clearance')),
    active_scholars INT DEFAULT 0,
    lab_director VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'under_commissioning', 'maintenance', 'decommissioned')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Technology Transfer & Intellectual Property Licensing Docket
CREATE TABLE IF NOT EXISTS public.technology_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID,
    patent_title VARCHAR(255) NOT NULL,
    patent_number VARCHAR(100),
    inventors TEXT[] DEFAULT '{}',
    licensee_org VARCHAR(255) NOT NULL,
    licensing_token VARCHAR(64) UNIQUE NOT NULL,
    trl_level INT NOT NULL CHECK (trl_level BETWEEN 1 AND 9),
    license_type VARCHAR(50) NOT NULL DEFAULT 'non_exclusive' CHECK (license_type IN ('exclusive', 'non_exclusive', 'evaluation_only')),
    royalty_terms VARCHAR(255) NOT NULL,
    upfront_fee_inr BIGINT DEFAULT 0,
    filing_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'term_sheet' CHECK (status IN ('inquiry', 'term_sheet', 'executed', 'royalty_bearing', 'terminated')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.industry_mous ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsored_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technology_licenses ENABLE ROW LEVEL SECURITY;

-- Public Read & Authenticated Write Policies
CREATE POLICY "Public read access for active industry MoUs" ON public.industry_mous
    FOR SELECT USING (true);

CREATE POLICY "Public read access for sponsored grants" ON public.sponsored_grants
    FOR SELECT USING (true);

CREATE POLICY "Public read access for industry labs" ON public.industry_labs
    FOR SELECT USING (true);

CREATE POLICY "Public read access for technology licenses" ON public.technology_licenses
    FOR SELECT USING (true);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_industry_mous_token ON public.industry_mous(mou_token);
CREATE INDEX IF NOT EXISTS idx_industry_mous_tier ON public.industry_mous(partner_tier);
CREATE INDEX IF NOT EXISTS idx_sponsored_grants_token ON public.sponsored_grants(grant_token);
CREATE INDEX IF NOT EXISTS idx_sponsored_grants_dept ON public.sponsored_grants(department);
CREATE INDEX IF NOT EXISTS idx_industry_labs_mou ON public.industry_labs(mou_id);
CREATE INDEX IF NOT EXISTS idx_technology_licenses_token ON public.technology_licenses(licensing_token);
