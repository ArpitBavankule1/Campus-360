-- CampusLens AI — Phase 20 Database Migration
-- Campus Placements, Internship Drives & Career Lifecycle Schema
-- Multi-tenant, RLS-protected, and enterprise-grade

-- 1. Create Placement Drives Table
CREATE TABLE IF NOT EXISTS public.placement_drives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    company_logo_url TEXT,
    role_title TEXT NOT NULL,
    drive_type TEXT NOT NULL CHECK (drive_type IN ('full_time', 'internship', 'intern_to_fte')),
    ctc_lpa NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    stipend_monthly NUMERIC(10, 2) DEFAULT 0.00,
    location TEXT NOT NULL DEFAULT 'On-Campus / Hybrid',
    eligibility_min_cgpa NUMERIC(3, 2) NOT NULL DEFAULT 6.00,
    allowed_departments TEXT[] NOT NULL DEFAULT ARRAY['CSE', 'IT', 'ECE'],
    max_active_backlogs INTEGER NOT NULL DEFAULT 0,
    application_deadline TIMESTAMPTZ NOT NULL,
    drive_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    job_description TEXT NOT NULL,
    skills_required TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create Placement Applications Table
CREATE TABLE IF NOT EXISTS public.placement_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID NOT NULL REFERENCES public.placement_drives(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    resume_url TEXT,
    current_cgpa NUMERIC(3, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'assessment_scheduled', 'interview_scheduled', 'offered', 'rejected', 'withdrawn')),
    applied_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    notes TEXT,
    CONSTRAINT unique_student_drive_application UNIQUE (drive_id, student_id)
);

-- 3. Create Placement Interview Rounds Table
CREATE TABLE IF NOT EXISTS public.placement_interview_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.placement_applications(id) ON DELETE CASCADE,
    drive_id UUID NOT NULL REFERENCES public.placement_drives(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL DEFAULT 1,
    round_name TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    mode TEXT NOT NULL DEFAULT 'online' CHECK (mode IN ('online', 'on_campus')),
    venue_or_link TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cleared', 'failed', 'rescheduled')),
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Create Placement Offers Table
CREATE TABLE IF NOT EXISTS public.placement_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.placement_applications(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    offered_ctc_lpa NUMERIC(6, 2) NOT NULL,
    bonus_joining NUMERIC(10, 2) DEFAULT 0.00,
    offer_letter_url TEXT,
    acceptance_status TEXT NOT NULL DEFAULT 'pending' CHECK (acceptance_status IN ('pending', 'accepted', 'declined')),
    offer_date DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_placement_drives_college_status ON public.placement_drives(college_id, status);
CREATE INDEX IF NOT EXISTS idx_placement_drives_deadline ON public.placement_drives(application_deadline);
CREATE INDEX IF NOT EXISTS idx_placement_apps_student ON public.placement_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_placement_apps_drive ON public.placement_applications(drive_id);
CREATE INDEX IF NOT EXISTS idx_placement_rounds_app ON public.placement_interview_rounds(application_id);
CREATE INDEX IF NOT EXISTS idx_placement_offers_student ON public.placement_offers(student_id);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_interview_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_offers ENABLE ROW LEVEL SECURITY;

-- 7. Multi-Tenant RLS Policies
-- Drives: Visible to everyone in the same college
CREATE POLICY "Users can view drives in their college"
    ON public.placement_drives FOR SELECT
    USING (college_id = (SELECT college_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage drives in their college"
    ON public.placement_drives FOR ALL
    USING (
        college_id = (SELECT college_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hod')
    );

-- Applications: Students view/manage own; Admins view all in college
CREATE POLICY "Students can view and create their own applications"
    ON public.placement_applications FOR ALL
    USING (student_id = auth.uid());

CREATE POLICY "Admins can view and manage all applications in college"
    ON public.placement_applications FOR ALL
    USING (
        college_id = (SELECT college_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hod')
    );

-- Rounds: Students view own rounds; Admins manage all
CREATE POLICY "Students can view rounds for their applications"
    ON public.placement_interview_rounds FOR SELECT
    USING (
        application_id IN (SELECT id FROM public.placement_applications WHERE student_id = auth.uid())
    );

CREATE POLICY "Admins can manage interview rounds"
    ON public.placement_interview_rounds FOR ALL
    USING (
        drive_id IN (
            SELECT id FROM public.placement_drives 
            WHERE college_id = (SELECT college_id FROM public.profiles WHERE id = auth.uid())
        )
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hod')
    );

-- Offers: Students view/update own offers; Admins manage all
CREATE POLICY "Students can view and update their own offers"
    ON public.placement_offers FOR ALL
    USING (student_id = auth.uid());

CREATE POLICY "Admins can manage all offers in college"
    ON public.placement_offers FOR ALL
    USING (
        college_id = (SELECT college_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hod')
    );
