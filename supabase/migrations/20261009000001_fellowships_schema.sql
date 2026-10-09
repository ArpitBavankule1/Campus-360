-- ============================================================================
-- CampusLens AI — Phase 44: Smart Campus Teaching Assistantships, Graduate Fellowships & Work-Study Schema
-- Table definitions, RLS policies, timesheets, and stipend payroll ledger
-- ============================================================================

-- 1. Fellowship & Assistantship Positions Table
CREATE TABLE IF NOT EXISTS public.fellowship_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    position_type VARCHAR(50) NOT NULL DEFAULT 'teaching_assistant', -- 'teaching_assistant', 'research_assistant', 'lab_demonstrator', 'work_study', 'maker_proctor'
    department VARCHAR(100) NOT NULL,
    course_code VARCHAR(30),
    course_name VARCHAR(150),
    faculty_supervisor_name VARCHAR(150) NOT NULL,
    faculty_supervisor_email VARCHAR(150) NOT NULL,
    monthly_stipend_inr NUMERIC(10,2) NOT NULL DEFAULT 15000.00,
    required_hours_per_week INT NOT NULL DEFAULT 12,
    open_slots INT NOT NULL DEFAULT 2,
    filled_slots INT NOT NULL DEFAULT 0,
    min_cgpa_requirement NUMERIC(4,2) NOT NULL DEFAULT 8.00,
    prerequisite_course_grade VARCHAR(10) DEFAULT 'A',
    description TEXT NOT NULL,
    responsibilities TEXT[] NOT NULL DEFAULT '{}',
    academic_term VARCHAR(50) NOT NULL DEFAULT 'Autumn 2026-27',
    application_deadline TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Fellowship Applications Table (Student submissions & appointment status)
CREATE TABLE IF NOT EXISTS public.fellowship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    position_id UUID NOT NULL REFERENCES public.fellowship_positions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    student_cgpa NUMERIC(4,2) NOT NULL,
    course_grade VARCHAR(10) NOT NULL,
    statement_of_purpose TEXT NOT NULL,
    portfolio_url TEXT,
    weekly_availability_hours INT NOT NULL DEFAULT 12,
    application_token VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted', -- 'submitted', 'shortlisted', 'interview_scheduled', 'appointed', 'rejected'
    appointment_token VARCHAR(100) UNIQUE,
    appointed_at TIMESTAMPTZ,
    faculty_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Fellowship Timesheets Table (Weekly hours and duty tracking)
CREATE TABLE IF NOT EXISTS public.fellowship_timesheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    application_id UUID NOT NULL REFERENCES public.fellowship_applications(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    hours_logged NUMERIC(5,2) NOT NULL DEFAULT 12.00,
    duty_type VARCHAR(50) NOT NULL DEFAULT 'laboratory_supervision', -- 'tutorial_conduct', 'laboratory_supervision', 'grading_assessments', 'office_hours', 'research_experiments'
    duty_summary TEXT NOT NULL,
    supervisor_feedback TEXT,
    approval_status VARCHAR(50) NOT NULL DEFAULT 'submitted', -- 'draft', 'submitted', 'faculty_approved', 'rejected'
    approved_by_supervisor VARCHAR(150),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Fellowship Disbursements Table (Monthly stipend payroll & DBT ledger)
CREATE TABLE IF NOT EXISTS public.fellowship_disbursements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    fellowship_title VARCHAR(150) NOT NULL,
    disbursement_month VARCHAR(30) NOT NULL, -- e.g. 'October 2026'
    gross_stipend_inr NUMERIC(10,2) NOT NULL DEFAULT 15000.00,
    attendance_deductions_inr NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    net_stipend_inr NUMERIC(10,2) NOT NULL DEFAULT 15000.00,
    dbt_bank_account_mask VARCHAR(20) NOT NULL DEFAULT 'HDFC-XXXX-8821',
    utr_transaction_number VARCHAR(100) UNIQUE NOT NULL,
    voucher_token VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'disbursed', -- 'pending', 'escrow_locked', 'disbursed', 'on_hold'
    disbursed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.fellowship_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fellowship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fellowship_timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fellowship_disbursements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read for fellowship_positions"
    ON public.fellowship_positions FOR SELECT USING (true);

CREATE POLICY "Allow authenticated manage for fellowship_positions"
    ON public.fellowship_positions FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated read for fellowship_applications"
    ON public.fellowship_applications FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert for fellowship_applications"
    ON public.fellowship_applications FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update for fellowship_applications"
    ON public.fellowship_applications FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read for fellowship_timesheets"
    ON public.fellowship_timesheets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert for fellowship_timesheets"
    ON public.fellowship_timesheets FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update for fellowship_timesheets"
    ON public.fellowship_timesheets FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read for fellowship_disbursements"
    ON public.fellowship_disbursements FOR SELECT TO authenticated USING (true);

-- Indexes for optimal querying
CREATE INDEX IF NOT EXISTS idx_fellowship_pos_dept ON public.fellowship_positions(department);
CREATE INDEX IF NOT EXISTS idx_fellowship_pos_type ON public.fellowship_positions(position_type);
CREATE INDEX IF NOT EXISTS idx_fellowship_app_student ON public.fellowship_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_fellowship_app_token ON public.fellowship_applications(application_token);
CREATE INDEX IF NOT EXISTS idx_fellowship_time_app ON public.fellowship_timesheets(application_id);
CREATE INDEX IF NOT EXISTS idx_fellowship_disb_student ON public.fellowship_disbursements(student_id);
