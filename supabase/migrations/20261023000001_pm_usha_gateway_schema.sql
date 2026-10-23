-- ============================================================================
-- Phase 58: Smart Campus PM-USHA (Pradhan Mantri Uchchatar Shiksha Abhiyan),
-- Grants & Institutional Development Gateway Schema
-- Multi-Disciplinary Research (MERU), Infrastructure Grants, PFMS & GFR 12-A
-- ============================================================================

-- 1. PM-USHA Institutional Profile
CREATE TABLE IF NOT EXISTS public.pm_usha_institutional_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    institutional_code VARCHAR(64) NOT NULL UNIQUE,
    shec_state VARCHAR(128) NOT NULL, -- State Higher Education Council
    category VARCHAR(64) NOT NULL DEFAULT 'INFRASTRUCTURE_COLLEGE',
    nodal_officer_name VARCHAR(128) NOT NULL,
    nodal_officer_email VARCHAR(128) NOT NULL,
    nodal_officer_phone VARCHAR(32) NOT NULL,
    pfms_agency_code VARCHAR(64) NOT NULL, -- Public Financial Management System Code
    pfms_bank_account_no VARCHAR(64) NOT NULL,
    current_cycle VARCHAR(64) NOT NULL DEFAULT 'PM-USHA Cycle 2024-2027',
    total_approved_grant_cr NUMERIC(10, 2) NOT NULL DEFAULT 20.00,
    total_disbursed_grant_cr NUMERIC(10, 2) NOT NULL DEFAULT 12.50,
    total_utilized_grant_cr NUMERIC(10, 2) NOT NULL DEFAULT 9.80,
    status VARCHAR(32) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PM-USHA Project Proposals (DPRs)
CREATE TABLE IF NOT EXISTS public.pm_usha_project_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    proposal_code VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    component_type VARCHAR(64) NOT NULL, -- MERU_UPGRADE, INFRASTRUCTURE_GRANTS, etc.
    submitted_date DATE NOT NULL DEFAULT CURRENT_DATE,
    estimated_budget_lakhs NUMERIC(10, 2) NOT NULL,
    approved_budget_lakhs NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    central_share_percentage NUMERIC(5, 2) NOT NULL DEFAULT 60.00,
    state_share_percentage NUMERIC(5, 2) NOT NULL DEFAULT 40.00,
    target_completion_date DATE NOT NULL,
    approval_status VARCHAR(32) NOT NULL DEFAULT 'Submitted',
    review_remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PM-USHA Fund Allocations & PFMS Disbursals
CREATE TABLE IF NOT EXISTS public.pm_usha_fund_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    allocation_code VARCHAR(64) NOT NULL UNIQUE,
    proposal_id UUID REFERENCES public.pm_usha_project_proposals(id) ON DELETE SET NULL,
    sanction_order_no VARCHAR(128) NOT NULL,
    sanction_date DATE NOT NULL,
    installment_number INT NOT NULL DEFAULT 1,
    central_share_amount_lakhs NUMERIC(10, 2) NOT NULL,
    state_share_amount_lakhs NUMERIC(10, 2) NOT NULL,
    total_sanctioned_lakhs NUMERIC(10, 2) NOT NULL,
    pfms_transaction_id VARCHAR(64) NOT NULL,
    disbursal_status VARCHAR(32) NOT NULL DEFAULT 'Sanctioned',
    disbursal_date DATE,
    utilization_status VARCHAR(32) NOT NULL DEFAULT 'Unspent',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PM-USHA Physical Milestones & Geo-Tag Inspection
CREATE TABLE IF NOT EXISTS public.pm_usha_physical_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    milestone_code VARCHAR(64) NOT NULL UNIQUE,
    proposal_id UUID REFERENCES public.pm_usha_project_proposals(id) ON DELETE SET NULL,
    milestone_name VARCHAR(255) NOT NULL,
    work_category VARCHAR(64) NOT NULL, -- Civil_Works, Lab_Modernization, etc.
    target_date DATE NOT NULL,
    physical_progress_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    financial_progress_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    geo_latitude NUMERIC(10, 6),
    geo_longitude NUMERIC(10, 6),
    site_inspection_status VARCHAR(32) NOT NULL DEFAULT 'Pending',
    inspection_date DATE,
    inspector_designation VARCHAR(128),
    geo_tag_photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PM-USHA GFR 12-A Utilization Certificates (UC)
CREATE TABLE IF NOT EXISTS public.pm_usha_utilization_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    certificate_number VARCHAR(64) NOT NULL UNIQUE,
    allocation_id UUID REFERENCES public.pm_usha_fund_allocations(id) ON DELETE SET NULL,
    financial_year VARCHAR(32) NOT NULL DEFAULT '2025-2026',
    gfr_format VARCHAR(32) NOT NULL DEFAULT 'GFR 12-A',
    grant_in_aid_sanctioned_lakhs NUMERIC(10, 2) NOT NULL,
    interest_earned_lakhs NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    expenditure_incurred_lakhs NUMERIC(10, 2) NOT NULL,
    unspent_balance_lakhs NUMERIC(10, 2) NOT NULL,
    statutory_auditor_name VARCHAR(128) NOT NULL,
    ca_membership_no VARCHAR(64) NOT NULL,
    signed_date DATE NOT NULL,
    submission_status VARCHAR(32) NOT NULL DEFAULT 'Draft',
    verification_hash VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.pm_usha_institutional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pm_usha_project_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pm_usha_fund_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pm_usha_physical_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pm_usha_utilization_certificates ENABLE ROW LEVEL SECURITY;

-- Default Permissive RLS Policies for authenticated users
CREATE POLICY "Allow authenticated read on pm_usha_institutional_profiles"
    ON public.pm_usha_institutional_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write on pm_usha_institutional_profiles"
    ON public.pm_usha_institutional_profiles FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on pm_usha_project_proposals"
    ON public.pm_usha_project_proposals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write on pm_usha_project_proposals"
    ON public.pm_usha_project_proposals FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on pm_usha_fund_allocations"
    ON public.pm_usha_fund_allocations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write on pm_usha_fund_allocations"
    ON public.pm_usha_fund_allocations FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on pm_usha_physical_milestones"
    ON public.pm_usha_physical_milestones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write on pm_usha_physical_milestones"
    ON public.pm_usha_physical_milestones FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on pm_usha_utilization_certificates"
    ON public.pm_usha_utilization_certificates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write on pm_usha_utilization_certificates"
    ON public.pm_usha_utilization_certificates FOR ALL TO authenticated USING (true);
