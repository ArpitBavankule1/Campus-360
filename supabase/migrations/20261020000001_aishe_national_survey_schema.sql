-- Phase 55: Smart Campus All India Survey on Higher Education (AISHE), Ministry of Education DCF Portal & Institutional Telemetry Schema
-- Migration: 20261020000001_aishe_national_survey_schema.sql

-- 1. AISHE Institutional Profile & Official Code Table
CREATE TABLE IF NOT EXISTS public.aishe_institution_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aishe_code VARCHAR(32) UNIQUE NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    affiliating_university VARCHAR(255) NOT NULL,
    institution_type VARCHAR(64) NOT NULL DEFAULT 'autonomous_affiliated_college',
    management_type VARCHAR(64) NOT NULL DEFAULT 'private_unaided',
    survey_year VARCHAR(32) NOT NULL DEFAULT '2025-2026',
    year_of_establishment INTEGER NOT NULL DEFAULT 1998,
    nodal_officer_name VARCHAR(255) NOT NULL,
    nodal_officer_email VARCHAR(255) NOT NULL,
    nodal_officer_phone VARCHAR(32) NOT NULL,
    survey_status VARCHAR(32) NOT NULL DEFAULT 'certified_submitted' CHECK (survey_status IN ('draft', 'in_progress', 'submitted', 'certified_submitted', 'locked')),
    certificate_token VARCHAR(64) UNIQUE NOT NULL,
    verification_hash VARCHAR(128) NOT NULL,
    moe_approval_date VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AISHE Data Capture Format (DCF) Annual Surveys Table
CREATE TABLE IF NOT EXISTS public.aishe_dcf_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_year VARCHAR(32) NOT NULL,
    dcf_type VARCHAR(32) NOT NULL DEFAULT 'DCF-II' CHECK (dcf_type IN ('DCF-I', 'DCF-II', 'DCF-III', 'DCF-IV')),
    submission_deadline VARCHAR(32) NOT NULL,
    completion_percentage NUMERIC(5, 2) NOT NULL DEFAULT 100.0,
    status VARCHAR(32) NOT NULL DEFAULT 'approved_certified' CHECK (status IN ('draft', 'under_verification', 'submitted', 'approved_certified')),
    block_a_basic_info BOOLEAN NOT NULL DEFAULT true,
    block_b_programmes BOOLEAN NOT NULL DEFAULT true,
    block_c_student_enrollment BOOLEAN NOT NULL DEFAULT true,
    block_d_foreign_students BOOLEAN NOT NULL DEFAULT true,
    block_e_staff_information BOOLEAN NOT NULL DEFAULT true,
    block_f_financial_info BOOLEAN NOT NULL DEFAULT true,
    block_g_infrastructure BOOLEAN NOT NULL DEFAULT true,
    block_h_scholarships BOOLEAN NOT NULL DEFAULT true,
    filing_token VARCHAR(64) UNIQUE NOT NULL,
    certified_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AISHE Student Enrollment & Demographic Telemetry Table
CREATE TABLE IF NOT EXISTS public.aishe_enrollment_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_year VARCHAR(32) NOT NULL,
    programme_level VARCHAR(32) NOT NULL CHECK (programme_level IN ('undergraduate', 'postgraduate', 'doctoral', 'integrated', 'pg_diploma')),
    discipline_name VARCHAR(128) NOT NULL,
    sanctioned_intake INTEGER NOT NULL CHECK (sanctioned_intake > 0),
    enrolled_male INTEGER NOT NULL CHECK (enrolled_male >= 0),
    enrolled_female INTEGER NOT NULL CHECK (enrolled_female >= 0),
    enrolled_transgender INTEGER NOT NULL DEFAULT 0 CHECK (enrolled_transgender >= 0),
    total_enrolled INTEGER NOT NULL CHECK (total_enrolled >= 0),
    sc_count INTEGER NOT NULL DEFAULT 0,
    st_count INTEGER NOT NULL DEFAULT 0,
    obc_count INTEGER NOT NULL DEFAULT 0,
    general_count INTEGER NOT NULL DEFAULT 0,
    ews_count INTEGER NOT NULL DEFAULT 0,
    pwd_count INTEGER NOT NULL DEFAULT 0,
    out_of_state_count INTEGER NOT NULL DEFAULT 0,
    foreign_national_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AISHE Faculty Cadres & Staff Strength Table
CREATE TABLE IF NOT EXISTS public.aishe_faculty_cadres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_year VARCHAR(32) NOT NULL,
    cadre_type VARCHAR(64) NOT NULL CHECK (cadre_type IN ('professor', 'associate_professor', 'assistant_professor', 'adjunct_visiting')),
    sanctioned_posts INTEGER NOT NULL CHECK (sanctioned_posts > 0),
    regular_in_position INTEGER NOT NULL CHECK (regular_in_position >= 0),
    contractual_in_position INTEGER NOT NULL DEFAULT 0 CHECK (contractual_in_position >= 0),
    male_faculty INTEGER NOT NULL CHECK (male_faculty >= 0),
    female_faculty INTEGER NOT NULL CHECK (female_faculty >= 0),
    phd_holders INTEGER NOT NULL CHECK (phd_holders >= 0),
    sc_faculty INTEGER NOT NULL DEFAULT 0,
    st_faculty INTEGER NOT NULL DEFAULT 0,
    obc_faculty INTEGER NOT NULL DEFAULT 0,
    general_faculty INTEGER NOT NULL DEFAULT 0,
    ews_faculty INTEGER NOT NULL DEFAULT 0,
    pwd_faculty INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AISHE Institutional Finances & Capital Expenditure Table
CREATE TABLE IF NOT EXISTS public.aishe_financial_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_year VARCHAR(32) NOT NULL,
    financial_year VARCHAR(32) NOT NULL,
    recurring_grants_gov_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.0,
    non_recurring_grants_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.0,
    tuition_fee_income_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.0,
    other_income_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.0,
    total_income_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.0,
    faculty_salary_expenditure_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.0,
    non_teaching_salary_expenditure_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.0,
    laboratory_capex_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.0,
    library_capex_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.0,
    scholarships_distributed_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.0,
    total_expenditure_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.0,
    audited_udin_token VARCHAR(64) UNIQUE NOT NULL,
    ca_auditor_name VARCHAR(255) NOT NULL,
    audit_date VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Indexes for High-Speed AISHE Telemetry Lookups
CREATE INDEX IF NOT EXISTS idx_aishe_profiles_code ON public.aishe_institution_profiles(aishe_code);
CREATE INDEX IF NOT EXISTS idx_aishe_dcf_surveys_year ON public.aishe_dcf_surveys(survey_year);
CREATE INDEX IF NOT EXISTS idx_aishe_enrollment_prog ON public.aishe_enrollment_telemetry(programme_level, survey_year);
CREATE INDEX IF NOT EXISTS idx_aishe_faculty_cadre ON public.aishe_faculty_cadres(cadre_type, survey_year);
CREATE INDEX IF NOT EXISTS idx_aishe_finances_fy ON public.aishe_financial_statements(financial_year);

-- 7. Row Level Security Policies
ALTER TABLE public.aishe_institution_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aishe_dcf_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aishe_enrollment_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aishe_faculty_cadres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aishe_financial_statements ENABLE ROW LEVEL SECURITY;

-- Read policies for verified campus users & auditors
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access for aishe_institution_profiles') THEN
        CREATE POLICY "Allow public read access for aishe_institution_profiles" ON public.aishe_institution_profiles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access for aishe_dcf_surveys') THEN
        CREATE POLICY "Allow public read access for aishe_dcf_surveys" ON public.aishe_dcf_surveys FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access for aishe_enrollment_telemetry') THEN
        CREATE POLICY "Allow public read access for aishe_enrollment_telemetry" ON public.aishe_enrollment_telemetry FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access for aishe_faculty_cadres') THEN
        CREATE POLICY "Allow public read access for aishe_faculty_cadres" ON public.aishe_faculty_cadres FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access for aishe_financial_statements') THEN
        CREATE POLICY "Allow public read access for aishe_financial_statements" ON public.aishe_financial_statements FOR SELECT USING (true);
    END IF;
END $$;
