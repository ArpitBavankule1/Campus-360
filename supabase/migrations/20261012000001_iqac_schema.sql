-- ============================================================================
-- CampusLens AI — Phase 47: Smart Campus Internal Quality Assurance Cell (IQAC),
-- NAAC Criteria & Institutional Accreditation Gateway Schema
-- Migration: 20261012000001_iqac_schema.sql
-- ============================================================================

-- 1. Create IQAC Criteria Metrics Table (NAAC Criterion 1-7 Framework)
CREATE TABLE IF NOT EXISTS public.iqac_criteria_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID,
    criterion_code TEXT NOT NULL CHECK (criterion_code IN ('CRITERION_1', 'CRITERION_2', 'CRITERION_3', 'CRITERION_4', 'CRITERION_5', 'CRITERION_6', 'CRITERION_7')),
    criterion_title TEXT NOT NULL,
    lead_evaluator TEXT NOT NULL,
    max_weightage INTEGER NOT NULL DEFAULT 100,
    current_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    target_score NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    key_indicators JSONB DEFAULT '[]'::jsonb,
    ssr_readiness_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    last_audited_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('draft', 'in_progress', 'ready_for_review', 'validated')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create IQAC AQAR Reports Table (Annual Quality Assurance Report)
CREATE TABLE IF NOT EXISTS public.iqac_aqar_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID,
    academic_year TEXT NOT NULL,
    submission_token TEXT UNIQUE NOT NULL,
    iqac_director TEXT NOT NULL,
    overall_cgpa_projected NUMERIC(4, 2) NOT NULL DEFAULT 3.80,
    projected_naac_grade TEXT NOT NULL DEFAULT 'A++',
    aqar_status TEXT NOT NULL DEFAULT 'draft' CHECK (aqar_status IN ('draft', 'peer_review', 'executive_approved', 'submitted_naac')),
    executive_signoff_date TIMESTAMPTZ,
    executive_signoff_by TEXT,
    criteria_summary JSONB DEFAULT '{}'::jsonb,
    document_attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create IQAC Academic & Administrative Audits (AAA) Table
CREATE TABLE IF NOT EXISTS public.iqac_academic_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID,
    audit_code TEXT UNIQUE NOT NULL,
    audit_title TEXT NOT NULL,
    audit_type TEXT NOT NULL CHECK (audit_type IN ('academic', 'administrative', 'green_energy', 'gender_equity', 'financial_compliance')),
    target_department TEXT NOT NULL,
    lead_external_auditor TEXT NOT NULL,
    external_auditor_affiliation TEXT NOT NULL,
    internal_co_auditor TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    completion_date DATE,
    overall_compliance_score NUMERIC(5, 2) DEFAULT 0.00,
    audit_status TEXT NOT NULL DEFAULT 'scheduled' CHECK (audit_status IN ('scheduled', 'in_inspection', 'completed', 'atr_pending', 'closed')),
    key_observations JSONB DEFAULT '[]'::jsonb,
    action_taken_report TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create IQAC Institutional Best Practices & Distinctiveness Table
CREATE TABLE IF NOT EXISTS public.iqac_best_practices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID,
    practice_token TEXT UNIQUE NOT NULL,
    practice_title TEXT NOT NULL,
    criterion_alignment TEXT NOT NULL DEFAULT 'CRITERION_7',
    thematic_area TEXT NOT NULL,
    contextual_background TEXT NOT NULL,
    objectives TEXT NOT NULL,
    practice_implementation TEXT NOT NULL,
    evidence_of_success TEXT NOT NULL,
    sdg_goals JSONB DEFAULT '[]'::jsonb,
    beneficiaries_impacted INTEGER DEFAULT 0,
    institutional_status TEXT NOT NULL DEFAULT 'institutionalized' CHECK (institutional_status IN ('piloted', 'institutionalized', 'nationally_recognized')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row-Level Security (RLS)
ALTER TABLE public.iqac_criteria_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iqac_aqar_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iqac_academic_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iqac_best_practices ENABLE ROW LEVEL SECURITY;

-- Anonymous/Public Read Policies for Authenticated & Public Views
CREATE POLICY "Public read iqac_criteria_metrics" ON public.iqac_criteria_metrics FOR SELECT USING (true);
CREATE POLICY "Public read iqac_aqar_reports" ON public.iqac_aqar_reports FOR SELECT USING (true);
CREATE POLICY "Public read iqac_academic_audits" ON public.iqac_academic_audits FOR SELECT USING (true);
CREATE POLICY "Public read iqac_best_practices" ON public.iqac_best_practices FOR SELECT USING (true);

-- Insert/Update Policies
CREATE POLICY "Allow insert iqac_criteria_metrics" ON public.iqac_criteria_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update iqac_criteria_metrics" ON public.iqac_criteria_metrics FOR UPDATE USING (true);
CREATE POLICY "Allow insert iqac_aqar_reports" ON public.iqac_aqar_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update iqac_aqar_reports" ON public.iqac_aqar_reports FOR UPDATE USING (true);
CREATE POLICY "Allow insert iqac_academic_audits" ON public.iqac_academic_audits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update iqac_academic_audits" ON public.iqac_academic_audits FOR UPDATE USING (true);
CREATE POLICY "Allow insert iqac_best_practices" ON public.iqac_best_practices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update iqac_best_practices" ON public.iqac_best_practices FOR UPDATE USING (true);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_iqac_criteria_code ON public.iqac_criteria_metrics (criterion_code);
CREATE INDEX IF NOT EXISTS idx_iqac_aqar_year ON public.iqac_aqar_reports (academic_year);
CREATE INDEX IF NOT EXISTS idx_iqac_audit_type ON public.iqac_academic_audits (audit_type);
CREATE INDEX IF NOT EXISTS idx_iqac_audit_dept ON public.iqac_academic_audits (target_department);
