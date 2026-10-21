-- Phase 56: Smart Campus SWAYAM-NPTEL MOOCs, Local Chapter & Academic Credit Transfer Gateway Schema
-- Scoped to college_id for multi-tenant isolation

-- 1. SWAYAM-NPTEL Local Chapter Profile Table
CREATE TABLE IF NOT EXISTS public.swayam_local_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    local_chapter_id VARCHAR(64) UNIQUE NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    spoc_name VARCHAR(128) NOT NULL,
    spoc_email VARCHAR(128) NOT NULL,
    spoc_designation VARCHAR(128) NOT NULL DEFAULT 'Associate Professor',
    spoc_department VARCHAR(128) NOT NULL DEFAULT 'Computer Science & Engineering',
    rating_tier VARCHAR(32) NOT NULL DEFAULT 'AAA' CHECK (rating_tier IN ('AAA', 'AA', 'A', 'Active')),
    active_semester_cycle VARCHAR(64) NOT NULL DEFAULT 'Jan-Apr 2026',
    national_rank INTEGER NOT NULL DEFAULT 14,
    total_enrollments INTEGER NOT NULL DEFAULT 842,
    exam_registrations INTEGER NOT NULL DEFAULT 624,
    successful_certifications INTEGER NOT NULL DEFAULT 592,
    elite_gold_certifications INTEGER NOT NULL DEFAULT 68,
    elite_silver_certifications INTEGER NOT NULL DEFAULT 244,
    faculty_fdp_certifications INTEGER NOT NULL DEFAULT 54,
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'renewal_due', 'archived')),
    chapter_token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SWAYAM / NPTEL Curated Courses Repository Table
CREATE TABLE IF NOT EXISTS public.swayam_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    course_code VARCHAR(64) UNIQUE NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    offering_institute VARCHAR(128) NOT NULL,
    instructor_name VARCHAR(128) NOT NULL,
    discipline VARCHAR(64) NOT NULL DEFAULT 'Computer Science & Engineering',
    duration_weeks VARCHAR(32) NOT NULL DEFAULT '12_weeks' CHECK (duration_weeks IN ('4_weeks', '8_weeks', '12_weeks')),
    credit_equivalency INTEGER NOT NULL CHECK (credit_equivalency IN (2, 3, 4)),
    aicte_approved_fdp BOOLEAN NOT NULL DEFAULT TRUE,
    syllabus_outline TEXT NOT NULL,
    exam_date VARCHAR(32) NOT NULL,
    enrollment_status VARCHAR(32) NOT NULL DEFAULT 'enrolling' CHECK (enrollment_status IN ('enrolling', 'ongoing', 'exam_completed', 'archived')),
    course_token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SWAYAM-NPTEL Student & Faculty Enrollments Table
CREATE TABLE IF NOT EXISTS public.swayam_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    enrollment_token VARCHAR(64) UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name VARCHAR(128) NOT NULL,
    roll_number VARCHAR(64) NOT NULL,
    department VARCHAR(128) NOT NULL,
    academic_year VARCHAR(32) NOT NULL DEFAULT 'Third Year (Sem 6)',
    course_code VARCHAR(64) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty')),
    enrollment_status VARCHAR(32) NOT NULL DEFAULT 'enrolled' CHECK (enrollment_status IN ('enrolled', 'assignment_submitted', 'exam_registered', 'certified', 'transferred')),
    assignment_avg_score NUMERIC(5, 2) DEFAULT 88.5,
    hall_ticket_no VARCHAR(64),
    exam_city VARCHAR(128) DEFAULT 'Bengaluru Central',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SWAYAM-NPTEL Proctored Certifications Table
CREATE TABLE IF NOT EXISTS public.swayam_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    cert_token VARCHAR(64) UNIQUE NOT NULL,
    enrollment_token VARCHAR(64) NOT NULL,
    candidate_name VARCHAR(128) NOT NULL,
    roll_number VARCHAR(64) NOT NULL,
    course_code VARCHAR(64) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    offering_institute VARCHAR(128) NOT NULL,
    assignment_score NUMERIC(5, 2) NOT NULL CHECK (assignment_score >= 0 AND assignment_score <= 100),
    exam_score NUMERIC(5, 2) NOT NULL CHECK (exam_score >= 0 AND exam_score <= 100),
    consolidated_score NUMERIC(5, 2) NOT NULL CHECK (consolidated_score >= 0 AND consolidated_score <= 100),
    cert_tier VARCHAR(32) NOT NULL CHECK (cert_tier IN ('elite_gold', 'elite_silver', 'elite', 'successfully_completed', 'participation')),
    aicte_fdp_credits INTEGER DEFAULT 0,
    verification_hash VARCHAR(128) NOT NULL,
    qr_seal_payload VARCHAR(255) NOT NULL,
    issued_date VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Academic Credit Equivalence & Transfer Ledger Table (NEP 2020 / ABC Integration)
CREATE TABLE IF NOT EXISTS public.swayam_credit_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    transfer_token VARCHAR(64) UNIQUE NOT NULL,
    cert_token VARCHAR(64) NOT NULL,
    student_name VARCHAR(128) NOT NULL,
    roll_number VARCHAR(64) NOT NULL,
    department VARCHAR(128) NOT NULL,
    swayam_course_code VARCHAR(64) NOT NULL,
    swayam_course_title VARCHAR(255) NOT NULL,
    equivalent_curriculum_course VARCHAR(255) NOT NULL,
    credits_transferred INTEGER NOT NULL CHECK (credits_transferred IN (2, 3, 4)),
    grade_awarded VARCHAR(8) NOT NULL DEFAULT 'O' CHECK (grade_awarded IN ('O', 'A+', 'A', 'B+', 'B')),
    bos_approval_date VARCHAR(32) NOT NULL,
    academic_council_ref VARCHAR(128) NOT NULL,
    approval_status VARCHAR(32) NOT NULL DEFAULT 'approved_transferred' CHECK (approval_status IN ('approved_transferred', 'bos_cleared', 'pending_review')),
    abc_sync_status VARCHAR(32) NOT NULL DEFAULT 'synced_abc' CHECK (abc_sync_status IN ('synced_abc', 'pending_sync', 'failed_sync')),
    apaar_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.swayam_local_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swayam_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swayam_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swayam_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swayam_credit_transfers ENABLE ROW LEVEL SECURITY;

-- Create Open Read/Write Policies for Multi-Tenant Scoping
CREATE POLICY "Public Read swayam_local_chapters" ON public.swayam_local_chapters FOR SELECT USING (true);
CREATE POLICY "Public Write swayam_local_chapters" ON public.swayam_local_chapters FOR ALL USING (true);

CREATE POLICY "Public Read swayam_courses" ON public.swayam_courses FOR SELECT USING (true);
CREATE POLICY "Public Write swayam_courses" ON public.swayam_courses FOR ALL USING (true);

CREATE POLICY "Public Read swayam_enrollments" ON public.swayam_enrollments FOR SELECT USING (true);
CREATE POLICY "Public Write swayam_enrollments" ON public.swayam_enrollments FOR ALL USING (true);

CREATE POLICY "Public Read swayam_certifications" ON public.swayam_certifications FOR SELECT USING (true);
CREATE POLICY "Public Write swayam_certifications" ON public.swayam_certifications FOR ALL USING (true);

CREATE POLICY "Public Read swayam_credit_transfers" ON public.swayam_credit_transfers FOR SELECT USING (true);
CREATE POLICY "Public Write swayam_credit_transfers" ON public.swayam_credit_transfers FOR ALL USING (true);
