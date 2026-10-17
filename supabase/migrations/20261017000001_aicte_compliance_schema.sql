-- Phase 52: Smart Campus AICTE Approval Process Handbook (APH), Extension of Approval (EoA) & Statutory Regulatory Compliance Schema
-- Migration: 20261017000001_aicte_compliance_schema.sql

-- 1. AICTE Approved Programs Table (UG/PG Intakes, Supernumerary Quotas, Accreditation Status)
CREATE TABLE IF NOT EXISTS public.aicte_approved_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_name VARCHAR(255) NOT NULL,
    program_level VARCHAR(64) NOT NULL CHECK (program_level IN ('undergraduate', 'postgraduate', 'diploma', 'doctoral')),
    department VARCHAR(128) NOT NULL,
    approved_intake INTEGER NOT NULL CHECK (approved_intake > 0),
    applied_intake INTEGER NOT NULL CHECK (applied_intake > 0),
    eoa_status VARCHAR(64) NOT NULL DEFAULT 'approved' CHECK (eoa_status IN ('approved', 'under_scrutiny', 'deficiency_flagged', 'applied')),
    approval_academic_year VARCHAR(16) NOT NULL DEFAULT '2026-27',
    accreditation_status VARCHAR(64) NOT NULL DEFAULT 'tier_1_accredited' CHECK (accreditation_status IN ('tier_1_accredited', 'accredited', 'eligible', 'not_accredited')),
    nri_quota_approved BOOLEAN DEFAULT true,
    pio_fn_quota_approved BOOLEAN DEFAULT true,
    tfw_quota_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AICTE Infrastructure & Space Norms Table (Instructional, Administrative, Amenities & Labs)
CREATE TABLE IF NOT EXISTS public.aicte_infrastructure_norms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_type VARCHAR(64) NOT NULL CHECK (room_type IN ('classroom', 'tutorial_room', 'laboratory', 'computer_center', 'library', 'seminar_hall', 'administrative', 'amenities')),
    category_name VARCHAR(128) NOT NULL,
    required_area_sqm NUMERIC(10, 2) NOT NULL,
    available_area_sqm NUMERIC(10, 2) NOT NULL,
    required_count INTEGER NOT NULL,
    available_count INTEGER NOT NULL,
    deficiency_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    compliance_status VARCHAR(32) NOT NULL DEFAULT 'compliant' CHECK (compliance_status IN ('compliant', 'minor_deficiency', 'non_compliant')),
    audited_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AICTE Faculty Cadre Ratio & FSR Metrics Table (Professor:Assoc Prof:Asst Prof = 1:2:6)
CREATE TABLE IF NOT EXISTS public.aicte_cadre_fsr_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department VARCHAR(128) NOT NULL,
    total_students INTEGER NOT NULL,
    required_faculty INTEGER NOT NULL,
    available_faculty INTEGER NOT NULL,
    fsr_ratio VARCHAR(32) NOT NULL DEFAULT '1:15',
    professors_count INTEGER NOT NULL,
    assoc_professors_count INTEGER NOT NULL,
    asst_professors_count INTEGER NOT NULL,
    phd_faculty_pct NUMERIC(5, 2) NOT NULL,
    cadre_ratio_compliant BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AICTE Statutory Committees Table (Anti-Ragging, ICC POSH, SC/ST, SGRC, IIIC)
CREATE TABLE IF NOT EXISTS public.aicte_statutory_committees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    committee_name VARCHAR(255) NOT NULL,
    committee_type VARCHAR(64) NOT NULL CHECK (committee_type IN ('anti_ragging', 'icc_posh', 'sc_st_cell', 'grievance_sgrc', 'industry_cell')),
    chairperson_name VARCHAR(255) NOT NULL,
    external_member_name VARCHAR(255) NOT NULL,
    total_members INTEGER NOT NULL CHECK (total_members >= 5),
    last_meeting_date VARCHAR(32) NOT NULL,
    mom_docket_token VARCHAR(64) UNIQUE NOT NULL,
    statutory_compliance_status VARCHAR(32) NOT NULL DEFAULT 'compliant' CHECK (statutory_compliance_status IN ('active', 'reconstitution_due', 'compliant')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AICTE EoA Application & Mandatory Disclosure Dossiers Table
CREATE TABLE IF NOT EXISTS public.aicte_eoa_dossiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(64) UNIQUE NOT NULL, -- e.g. 'AICTE-EOA-2026-94812'
    academic_year VARCHAR(16) NOT NULL DEFAULT '2026-27',
    submission_date VARCHAR(32) NOT NULL,
    deficiency_index NUMERIC(4, 2) NOT NULL DEFAULT 0.0,
    evc_inspection_status VARCHAR(64) NOT NULL DEFAULT 'recommended' CHECK (evc_inspection_status IN ('recommended', 'scrutiny_cleared', 'under_scrutiny', 'clarification_sought')),
    eoa_docket_token VARCHAR(64) UNIQUE NOT NULL,
    mandatory_disclosure_token VARCHAR(64) UNIQUE NOT NULL,
    digital_signature_hash VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.aicte_approved_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aicte_infrastructure_norms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aicte_cadre_fsr_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aicte_statutory_committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aicte_eoa_dossiers ENABLE ROW LEVEL SECURITY;

-- Public read access policies for authenticated and authorized institutional roles
CREATE POLICY "Public read access for aicte_approved_programs"
    ON public.aicte_approved_programs FOR SELECT USING (true);

CREATE POLICY "Public read access for aicte_infrastructure_norms"
    ON public.aicte_infrastructure_norms FOR SELECT USING (true);

CREATE POLICY "Public read access for aicte_cadre_fsr_metrics"
    ON public.aicte_cadre_fsr_metrics FOR SELECT USING (true);

CREATE POLICY "Public read access for aicte_statutory_committees"
    ON public.aicte_statutory_committees FOR SELECT USING (true);

CREATE POLICY "Public read access for aicte_eoa_dossiers"
    ON public.aicte_eoa_dossiers FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_aicte_programs_level ON public.aicte_approved_programs(program_level);
CREATE INDEX IF NOT EXISTS idx_aicte_infra_room_type ON public.aicte_infrastructure_norms(room_type);
CREATE INDEX IF NOT EXISTS idx_aicte_cadre_dept ON public.aicte_cadre_fsr_metrics(department);
CREATE INDEX IF NOT EXISTS idx_aicte_committees_type ON public.aicte_statutory_committees(committee_type);
CREATE INDEX IF NOT EXISTS idx_aicte_dossiers_app_no ON public.aicte_eoa_dossiers(application_number);
