-- Phase 51: Smart Campus Academic Bank of Credits (ABC), APAAR ID & NEP 2020 Multi-Disciplinary Credit Mobility Schema
-- Migration: 20261016000001_academic_credits_schema.sql

-- 1. APAAR Student Registries Table (Automated Permanent Academic Account Registry & ABC Accounts)
CREATE TABLE IF NOT EXISTS public.apaar_student_registries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    apaar_id VARCHAR(16) UNIQUE NOT NULL, -- e.g. '9081-3421-7789'
    abc_account_id VARCHAR(32) UNIQUE NOT NULL, -- e.g. 'ABC-2026-9081-3421'
    full_name VARCHAR(255) NOT NULL,
    enrollment_number VARCHAR(64) UNIQUE NOT NULL,
    department VARCHAR(128) NOT NULL,
    admission_year INTEGER NOT NULL,
    aadhar_linked BOOLEAN DEFAULT true,
    digilocker_verified BOOLEAN DEFAULT true,
    kyc_status VARCHAR(32) NOT NULL DEFAULT 'verified' CHECK (kyc_status IN ('verified', 'pending', 'rejected')),
    total_credits_accumulated INTEGER NOT NULL DEFAULT 0,
    total_credits_redeemed INTEGER NOT NULL DEFAULT 0,
    current_credit_balance INTEGER NOT NULL DEFAULT 0,
    exit_pathway_eligible VARCHAR(64) NOT NULL DEFAULT 'none' CHECK (exit_pathway_eligible IN ('none', 'certificate', 'diploma', 'degree', 'honours_research')),
    nad_certificate_uri TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Academic Credit Ledgers Table (Course Credits, Categories & Tamper-Proof Cryptographic Verification)
CREATE TABLE IF NOT EXISTS public.academic_credit_ledgers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apaar_id VARCHAR(16) NOT NULL,
    course_code VARCHAR(32) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    course_category VARCHAR(64) NOT NULL CHECK (course_category IN ('major', 'minor', 'multidisciplinary', 'aec', 'sec', 'vac', 'internship_project')),
    awarding_institution VARCHAR(255) NOT NULL,
    awarding_university_code VARCHAR(64) NOT NULL,
    credits INTEGER NOT NULL CHECK (credits > 0),
    grade_earned VARCHAR(8) NOT NULL,
    grade_points NUMERIC(4, 2) NOT NULL,
    semester_earned VARCHAR(32) NOT NULL,
    academic_year VARCHAR(16) NOT NULL,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'deposited' CHECK (verification_status IN ('deposited', 'verified_nad', 'redeemed', 'transferred', 'locked')),
    nad_transaction_hash VARCHAR(128) NOT NULL,
    verification_token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Inter-University & Swayam/NPTEL Credit Transfer Applications Table
CREATE TABLE IF NOT EXISTS public.credit_transfer_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apaar_id VARCHAR(16) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    source_institution VARCHAR(255) NOT NULL,
    course_code VARCHAR(32) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    credits_claimed INTEGER NOT NULL CHECK (credits_claimed > 0),
    target_equivalent_course_code VARCHAR(32) NOT NULL,
    target_equivalent_course_name VARCHAR(255) NOT NULL,
    evaluation_status VARCHAR(32) NOT NULL DEFAULT 'submitted' CHECK (evaluation_status IN ('submitted', 'under_scrutiny', 'approved_by_dean', 'rejected')),
    equivalence_score INTEGER NOT NULL DEFAULT 85 CHECK (equivalence_score >= 0 AND equivalence_score <= 100),
    transfer_docket_token VARCHAR(64) UNIQUE NOT NULL,
    scrutiny_remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. NEP 2020 Multiple Exit Qualifications Table (Certificate, Diploma, Degree, Honours/Research)
CREATE TABLE IF NOT EXISTS public.nep_exit_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apaar_id VARCHAR(16) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    program_enrolled VARCHAR(255) NOT NULL,
    target_exit_level VARCHAR(32) NOT NULL CHECK (target_exit_level IN ('certificate', 'diploma', 'degree', 'honours_research')),
    required_credits INTEGER NOT NULL,
    completed_credits INTEGER NOT NULL,
    exit_status VARCHAR(32) NOT NULL DEFAULT 'eligible' CHECK (exit_status IN ('eligible', 'application_filed', 'docket_awarded', 'deferred')),
    qualification_docket_token VARCHAR(64) UNIQUE NOT NULL,
    academic_council_approval_ref VARCHAR(64),
    convocation_signoff_date VARCHAR(32),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DigiLocker NAD Synchronization Logs Table
CREATE TABLE IF NOT EXISTS public.digilocker_nad_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_token VARCHAR(64) UNIQUE NOT NULL,
    synced_records_count INTEGER NOT NULL DEFAULT 0,
    sha256_merkle_root VARCHAR(128) NOT NULL,
    sync_status VARCHAR(32) NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced', 'in_progress', 'failed')),
    sync_timestamp TIMESTAMPTZ DEFAULT NOW(),
    operator_officer VARCHAR(255) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.apaar_student_registries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_credit_ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transfer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nep_exit_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digilocker_nad_sync_logs ENABLE ROW LEVEL SECURITY;

-- Public read access policies for authenticated and authorized campus roles
CREATE POLICY "Public read access for apaar_student_registries"
    ON public.apaar_student_registries FOR SELECT USING (true);

CREATE POLICY "Public read access for academic_credit_ledgers"
    ON public.academic_credit_ledgers FOR SELECT USING (true);

CREATE POLICY "Public read access for credit_transfer_applications"
    ON public.credit_transfer_applications FOR SELECT USING (true);

CREATE POLICY "Public read access for nep_exit_qualifications"
    ON public.nep_exit_qualifications FOR SELECT USING (true);

CREATE POLICY "Public read access for digilocker_nad_sync_logs"
    ON public.digilocker_nad_sync_logs FOR SELECT USING (true);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_apaar_registries_apaar_id ON public.apaar_student_registries(apaar_id);
CREATE INDEX IF NOT EXISTS idx_apaar_registries_enrollment ON public.apaar_student_registries(enrollment_number);
CREATE INDEX IF NOT EXISTS idx_credit_ledgers_apaar ON public.academic_credit_ledgers(apaar_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledgers_status ON public.academic_credit_ledgers(verification_status);
CREATE INDEX IF NOT EXISTS idx_credit_transfers_apaar ON public.credit_transfer_applications(apaar_id);
CREATE INDEX IF NOT EXISTS idx_nep_exit_apaar ON public.nep_exit_qualifications(apaar_id);
