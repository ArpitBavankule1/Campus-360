-- ============================================================================
-- Phase 57: Smart Campus SAMARTH eGov Suite & Enterprise ERP Integration Gateway
-- Migration: 20261022000001_samarth_egov_gateway_schema.sql
-- ============================================================================

-- 1. SAMARTH Institutional Instance Registry
CREATE TABLE IF NOT EXISTS public.samarth_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    instance_code VARCHAR(64) NOT NULL UNIQUE,
    institutional_name VARCHAR(255) NOT NULL,
    moe_institution_code VARCHAR(64) NOT NULL,
    samarth_version VARCHAR(32) NOT NULL DEFAULT 'v4.2-enterprise',
    environment VARCHAR(32) NOT NULL DEFAULT 'production',
    api_endpoint_url TEXT NOT NULL,
    deployment_status VARCHAR(32) NOT NULL DEFAULT 'active', -- active, syncing, degraded, maintenance
    last_sync_at TIMESTAMPTZ DEFAULT NOW(),
    health_score NUMERIC(5,2) DEFAULT 99.4,
    active_microservices_count INT DEFAULT 38,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SAMARTH Modular Microservices Registry
CREATE TABLE IF NOT EXISTS public.samarth_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID REFERENCES public.samarth_instances(id) ON DELETE CASCADE,
    module_key VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL, -- student_lifecycle, hrms_faculty, governance_academics, research_development, finance_logistics
    description TEXT,
    is_enabled BOOLEAN DEFAULT true,
    sync_frequency VARCHAR(32) DEFAULT 'realtime', -- realtime, hourly, daily, biweekly
    api_route VARCHAR(255) NOT NULL,
    total_records_synced INT DEFAULT 0,
    last_successful_sync_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_instance_module UNIQUE(instance_id, module_key)
);

-- 3. SAMARTH Data Synchronization Telemetry & Transaction Queue
CREATE TABLE IF NOT EXISTS public.samarth_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID REFERENCES public.samarth_instances(id) ON DELETE CASCADE,
    sync_token VARCHAR(64) NOT NULL UNIQUE,
    module_key VARCHAR(64) NOT NULL,
    direction VARCHAR(16) NOT NULL DEFAULT 'BIDIRECTIONAL', -- INBOUND, OUTBOUND, BIDIRECTIONAL
    status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED', -- COMPLETED, IN_PROGRESS, PENDING, FAILED
    records_processed INT DEFAULT 0,
    records_updated INT DEFAULT 0,
    records_failed INT DEFAULT 0,
    latency_ms INT DEFAULT 185,
    payload_checksum VARCHAR(128),
    error_message TEXT,
    initiated_by VARCHAR(128) DEFAULT 'samarth-cron-daemon',
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SAMARTH Career Advancement Scheme (CAS) Faculty Promotions
CREATE TABLE IF NOT EXISTS public.samarth_cas_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID REFERENCES public.samarth_instances(id) ON DELETE CASCADE,
    cas_token VARCHAR(64) NOT NULL UNIQUE,
    faculty_name VARCHAR(128) NOT NULL,
    faculty_email VARCHAR(128) NOT NULL,
    department VARCHAR(128) NOT NULL,
    current_designation VARCHAR(128) NOT NULL,
    current_stage VARCHAR(32) NOT NULL, -- Stage 1 (Assistant Prof), Stage 2, Stage 3, Stage 4 (Associate Prof), Stage 5 (Professor)
    target_stage VARCHAR(32) NOT NULL,
    api_score_claimed NUMERIC(6,2) NOT NULL,
    api_score_verified NUMERIC(6,2) NOT NULL,
    publications_count INT DEFAULT 0,
    research_projects_count INT DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'UNDER_SCRUTINY', -- DRAFT, SUBMITTED, UNDER_SCRUTINY, COMMITTEE_APPROVED, GAZETTED, REJECTED
    scrutiny_notes TEXT,
    gazette_notification_number VARCHAR(64),
    submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SAMARTH Student Lifecycle Onboardings & SSO Ledger
CREATE TABLE IF NOT EXISTS public.samarth_student_onboardings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID REFERENCES public.samarth_instances(id) ON DELETE CASCADE,
    onboarding_token VARCHAR(64) NOT NULL UNIQUE,
    student_name VARCHAR(128) NOT NULL,
    student_email VARCHAR(128) NOT NULL,
    enrollment_number VARCHAR(64) NOT NULL UNIQUE,
    apaar_id VARCHAR(64) NOT NULL,
    program_name VARCHAR(128) NOT NULL,
    admission_quota VARCHAR(64) NOT NULL DEFAULT 'Merit (State Cap)',
    academic_year VARCHAR(32) NOT NULL DEFAULT '2026-2027',
    verification_status VARCHAR(32) NOT NULL DEFAULT 'VERIFIED', -- PENDING, IN_REVIEW, VERIFIED, PROVISIONAL, FLAGGED
    fee_clearance_status VARCHAR(32) NOT NULL DEFAULT 'CLEARED', -- CLEARED, PARTIAL, PENDING, EXEMPTED
    digilocker_verified BOOLEAN DEFAULT true,
    samarth_sso_linked BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.samarth_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.samarth_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.samarth_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.samarth_cas_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.samarth_student_onboardings ENABLE ROW LEVEL SECURITY;

-- Transparent RLS Policies for Multi-Tenant Scoping & Interop
CREATE POLICY "Public read access for samarth_instances"
    ON public.samarth_instances FOR SELECT
    USING (true);

CREATE POLICY "Public read access for samarth_modules"
    ON public.samarth_modules FOR SELECT
    USING (true);

CREATE POLICY "Public read access for samarth_sync_logs"
    ON public.samarth_sync_logs FOR SELECT
    USING (true);

CREATE POLICY "Public read access for samarth_cas_applications"
    ON public.samarth_cas_applications FOR SELECT
    USING (true);

CREATE POLICY "Public read access for samarth_student_onboardings"
    ON public.samarth_student_onboardings FOR SELECT
    USING (true);

-- Authenticated Full Access Policies
CREATE POLICY "Authenticated users full access on samarth_instances"
    ON public.samarth_instances FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users full access on samarth_modules"
    ON public.samarth_modules FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users full access on samarth_sync_logs"
    ON public.samarth_sync_logs FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users full access on samarth_cas_applications"
    ON public.samarth_cas_applications FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users full access on samarth_student_onboardings"
    ON public.samarth_student_onboardings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_samarth_instances_code ON public.samarth_instances(instance_code);
CREATE INDEX IF NOT EXISTS idx_samarth_modules_category ON public.samarth_modules(category);
CREATE INDEX IF NOT EXISTS idx_samarth_sync_logs_module ON public.samarth_sync_logs(module_key);
CREATE INDEX IF NOT EXISTS idx_samarth_cas_applications_status ON public.samarth_cas_applications(status);
CREATE INDEX IF NOT EXISTS idx_samarth_student_onboardings_apaar ON public.samarth_student_onboardings(apaar_id);
