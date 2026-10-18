-- Phase 53: Smart Campus UGC Autonomous College Governance, Statutory Academic Council & 2(f)/12(B) Regulations Schema
-- Migration: 20261018000001_ugc_autonomous_governance_schema.sql

-- 1. UGC Statutory Councils & Governance Bodies Table (Governing Body, Academic Council, Board of Studies, Finance Committee)
CREATE TABLE IF NOT EXISTS public.ugc_statutory_councils (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    council_type VARCHAR(64) NOT NULL CHECK (council_type IN ('governing_body', 'academic_council', 'board_of_studies', 'finance_committee', 'examination_cell')),
    council_name VARCHAR(255) NOT NULL,
    chairperson VARCHAR(255) NOT NULL,
    university_nominee VARCHAR(255) NOT NULL,
    ugc_nominee VARCHAR(255) NOT NULL,
    state_gov_nominee VARCHAR(255) NOT NULL,
    total_members INTEGER NOT NULL CHECK (total_members >= 5),
    tenure_period VARCHAR(64) NOT NULL DEFAULT '2024-2027 (3 Years)',
    last_meeting_date VARCHAR(32) NOT NULL,
    next_meeting_date VARCHAR(32) NOT NULL,
    resolution_token VARCHAR(64) UNIQUE NOT NULL,
    compliance_status VARCHAR(32) NOT NULL DEFAULT 'compliant' CHECK (compliance_status IN ('active', 'term_renewal_due', 'compliant')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. UGC Autonomous Curriculum & BoS Syllabi Autonomy Table
CREATE TABLE IF NOT EXISTS public.ugc_curriculum_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_code VARCHAR(64) NOT NULL,
    program_name VARCHAR(255) NOT NULL,
    department VARCHAR(128) NOT NULL,
    regulation_year VARCHAR(64) NOT NULL DEFAULT 'R-2026 CBCS Autonomous Regulations',
    revision_type VARCHAR(64) NOT NULL CHECK (revision_type IN ('full_curriculum_revision', 'elective_basket_update', 'industry_internship_embed', 'nep_multidisciplinary_minor')),
    bos_approval_date VARCHAR(32) NOT NULL,
    academic_council_approval_date VARCHAR(32) NOT NULL,
    total_credits INTEGER NOT NULL CHECK (total_credits > 0),
    industry_component_pct NUMERIC(5, 2) NOT NULL DEFAULT 25.0,
    status VARCHAR(32) NOT NULL DEFAULT 'approved_ratified' CHECK (status IN ('approved_ratified', 'bos_cleared', 'under_review', 'submitted')),
    curriculum_docket_token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. UGC Autonomous Status & Expert Committee Reviews Table
CREATE TABLE IF NOT EXISTS public.ugc_autonomy_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    autonomy_cycle VARCHAR(128) NOT NULL,
    ugc_conferment_letter_no VARCHAR(128) NOT NULL,
    ugc_section_status VARCHAR(64) NOT NULL DEFAULT '2f_and_12b_recognized' CHECK (ugc_section_status IN ('2f_and_12b_recognized', '2f_recognized', 'applied')),
    validity_start_year INTEGER NOT NULL,
    validity_end_year INTEGER NOT NULL,
    expert_committee_visit_date VARCHAR(32) NOT NULL,
    inspection_outcome VARCHAR(64) NOT NULL DEFAULT 'extension_recommended' CHECK (inspection_outcome IN ('extension_recommended', 'unconditional_extension', 'compliance_pending', 'inspection_scheduled')),
    annual_compliance_report_token VARCHAR(64) UNIQUE NOT NULL,
    naac_score_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 3.65,
    autonomy_dossier_hash VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. UGC Autonomous Grants & Utilisation Certificates (UC) Table
CREATE TABLE IF NOT EXISTS public.ugc_grants_utilization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grant_scheme VARCHAR(255) NOT NULL,
    financial_year VARCHAR(16) NOT NULL DEFAULT '2026-27',
    sanctioned_amount_inr NUMERIC(14, 2) NOT NULL,
    released_amount_inr NUMERIC(14, 2) NOT NULL,
    utilized_amount_inr NUMERIC(14, 2) NOT NULL,
    uc_status VARCHAR(64) NOT NULL DEFAULT 'uc_audited_submitted' CHECK (uc_status IN ('uc_audited_submitted', 'uc_under_audit', 'partially_utilized', 'sanctioned')),
    chartered_accountant_audit_no VARCHAR(128) NOT NULL,
    uc_certificate_token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. UGC Compliance & Annual Governance Dossiers Table
CREATE TABLE IF NOT EXISTS public.ugc_compliance_dossiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dossier_type VARCHAR(64) NOT NULL CHECK (dossier_type IN ('annual_autonomy_return', 'governing_body_minutes', 'ugc_2f_12b_certificate', 'affiliation_endorsement', 'iqac_statutory_action_taken')),
    title VARCHAR(255) NOT NULL,
    academic_year VARCHAR(16) NOT NULL DEFAULT '2026-27',
    submission_date VARCHAR(32) NOT NULL,
    dossier_token VARCHAR(64) UNIQUE NOT NULL,
    approval_status VARCHAR(64) NOT NULL DEFAULT 'verified_compliant' CHECK (approval_status IN ('verified_compliant', 'submitted_to_ugc', 'governing_body_approved', 'draft')),
    digital_seal_hash VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ugc_statutory_councils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ugc_curriculum_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ugc_autonomy_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ugc_grants_utilization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ugc_compliance_dossiers ENABLE ROW LEVEL SECURITY;

-- Public read access policies for authenticated and authorized institutional roles
CREATE POLICY "Public read access for ugc_statutory_councils"
    ON public.ugc_statutory_councils FOR SELECT USING (true);

CREATE POLICY "Public read access for ugc_curriculum_revisions"
    ON public.ugc_curriculum_revisions FOR SELECT USING (true);

CREATE POLICY "Public read access for ugc_autonomy_reviews"
    ON public.ugc_autonomy_reviews FOR SELECT USING (true);

CREATE POLICY "Public read access for ugc_grants_utilization"
    ON public.ugc_grants_utilization FOR SELECT USING (true);

CREATE POLICY "Public read access for ugc_compliance_dossiers"
    ON public.ugc_compliance_dossiers FOR SELECT USING (true);
