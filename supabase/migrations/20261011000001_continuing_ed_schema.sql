-- ============================================================================
-- CampusLens AI — Phase 46: Smart Campus Continuing Education, Executive MDP & Professional Micro-Credentials Schema
-- Migration: 20261011000001_continuing_ed_schema.sql
-- ============================================================================

-- 1. Executive Programs & Faculty Development Programs (MDP/FDP)
CREATE TABLE IF NOT EXISTS public.executive_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID,
    program_code VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    program_type VARCHAR(50) NOT NULL DEFAULT 'executive_mdp' CHECK (program_type IN ('executive_mdp', 'faculty_fdp', 'industry_masterclass', 'certificate_bootcamp')),
    department VARCHAR(100) NOT NULL,
    lead_faculty_director VARCHAR(255) NOT NULL,
    co_instructors TEXT[] DEFAULT '{}',
    target_audience VARCHAR(255) NOT NULL,
    duration_weeks INT NOT NULL DEFAULT 4,
    credit_units NUMERIC(4,2) NOT NULL DEFAULT 2.50,
    pedagogy_mode VARCHAR(50) NOT NULL DEFAULT 'hybrid' CHECK (pedagogy_mode IN ('hybrid', 'in_person_residential', 'live_virtual')),
    fee_inr BIGINT NOT NULL DEFAULT 0,
    intake_capacity INT NOT NULL DEFAULT 40,
    enrolled_count INT NOT NULL DEFAULT 0,
    syllabus_modules TEXT[] DEFAULT '{}',
    program_token VARCHAR(64) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'enrolling' CHECK (status IN ('enrolling', 'in_progress', 'completed', 'upcoming')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Professional Micro-Credentials & Cryptographic Skill Badges
CREATE TABLE IF NOT EXISTS public.professional_micro_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID,
    credential_code VARCHAR(64) UNIQUE NOT NULL,
    badge_title VARCHAR(255) NOT NULL,
    competency_domain VARCHAR(50) NOT NULL CHECK (competency_domain IN ('generative_ai', 'cloud_devops', 'cybersecurity', 'quantum_computing', 'fintech_blockchain', 'esg_sustainability')),
    issuing_board VARCHAR(255) NOT NULL,
    ceu_credits NUMERIC(4,2) NOT NULL DEFAULT 3.00,
    prerequisites TEXT[] DEFAULT '{}',
    credential_token VARCHAR(64) UNIQUE NOT NULL,
    credential_hash VARCHAR(64) NOT NULL,
    evaluation_mode VARCHAR(50) NOT NULL DEFAULT 'capstone_peer_review' CHECK (evaluation_mode IN ('capstone_peer_review', 'proctored_exam', 'industry_hackathon')),
    total_certified_scholars INT DEFAULT 0,
    validity_years INT DEFAULT 3,
    badge_icon_url VARCHAR(512),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Corporate Nominations & Executive Enrollments
CREATE TABLE IF NOT EXISTS public.corporate_nominations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID,
    program_id UUID REFERENCES public.executive_programs(id) ON DELETE CASCADE,
    corporate_sponsor VARCHAR(255) NOT NULL,
    participant_name VARCHAR(255) NOT NULL,
    participant_email VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    years_of_experience INT DEFAULT 0,
    nomination_token VARCHAR(64) UNIQUE NOT NULL,
    sponsorship_status VARCHAR(50) NOT NULL DEFAULT 'sponsored_approved' CHECK (sponsorship_status IN ('sponsored_approved', 'self_funded', 'scholarship_waived')),
    attendance_percentage NUMERIC(5,2) DEFAULT 0.00,
    capstone_submitted BOOLEAN DEFAULT FALSE,
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_token VARCHAR(64),
    grade VARCHAR(50) DEFAULT 'Pending' CHECK (grade IN ('Distinction', 'Merit', 'Pass', 'Pending')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Faculty Development Cohorts & AICTE/ATAL Academy Tracks
CREATE TABLE IF NOT EXISTS public.faculty_development_cohorts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID,
    cohort_name VARCHAR(255) NOT NULL,
    program_id UUID REFERENCES public.executive_programs(id) ON DELETE SET NULL,
    coordinating_department VARCHAR(100) NOT NULL,
    aicte_atal_recognized BOOLEAN DEFAULT TRUE,
    funding_source VARCHAR(50) NOT NULL DEFAULT 'aicte_atal_grant' CHECK (funding_source IN ('aicte_atal_grant', 'institutional_endowment', 'self_sustained')),
    participating_institutions_count INT DEFAULT 1,
    faculty_fellows_enrolled INT DEFAULT 0,
    grant_subsidy_inr BIGINT DEFAULT 0,
    lead_convenor VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('scheduled', 'active', 'concluded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.executive_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_micro_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_nominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_development_cohorts ENABLE ROW LEVEL SECURITY;

-- Public Read & Authenticated Write Policies
CREATE POLICY "Public read access for active executive programs" ON public.executive_programs
    FOR SELECT USING (true);

CREATE POLICY "Public read access for professional micro-credentials" ON public.professional_micro_credentials
    FOR SELECT USING (true);

CREATE POLICY "Public read access for corporate nominations" ON public.corporate_nominations
    FOR SELECT USING (true);

CREATE POLICY "Public read access for faculty development cohorts" ON public.faculty_development_cohorts
    FOR SELECT USING (true);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_executive_programs_token ON public.executive_programs(program_token);
CREATE INDEX IF NOT EXISTS idx_executive_programs_type ON public.executive_programs(program_type);
CREATE INDEX IF NOT EXISTS idx_executive_programs_status ON public.executive_programs(status);
CREATE INDEX IF NOT EXISTS idx_micro_credentials_token ON public.professional_micro_credentials(credential_token);
CREATE INDEX IF NOT EXISTS idx_micro_credentials_domain ON public.professional_micro_credentials(competency_domain);
CREATE INDEX IF NOT EXISTS idx_corporate_nominations_token ON public.corporate_nominations(nomination_token);
CREATE INDEX IF NOT EXISTS idx_corporate_nominations_program ON public.corporate_nominations(program_id);
CREATE INDEX IF NOT EXISTS idx_faculty_cohorts_program ON public.faculty_development_cohorts(program_id);
