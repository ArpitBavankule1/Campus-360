-- ============================================================================
-- CampusLens AI — Phase 43: Smart Campus Parent & Guardian Connect Schema
-- Table definitions, RLS policies, and telemetry for Ward & Guardian Gateway
-- ============================================================================

-- 1. Guardian Profiles Table
CREATE TABLE IF NOT EXISTS public.guardian_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    guardian_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    relationship VARCHAR(50) NOT NULL DEFAULT 'Father',
    emergency_contact VARCHAR(30) NOT NULL,
    residential_address TEXT,
    is_identity_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ward Telemetry Links (Connecting Guardian to Enrolled Scholar)
CREATE TABLE IF NOT EXISTS public.ward_telemetry_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES public.guardian_profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    academic_year INT NOT NULL DEFAULT 3,
    semester INT NOT NULL DEFAULT 5,
    cumulative_cgpa NUMERIC(4,2) NOT NULL DEFAULT 8.75,
    overall_attendance_pct NUMERIC(5,2) NOT NULL DEFAULT 86.40,
    theory_attendance_pct NUMERIC(5,2) NOT NULL DEFAULT 89.10,
    practical_attendance_pct NUMERIC(5,2) NOT NULL DEFAULT 82.50,
    fee_dues_inr NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    fee_status VARCHAR(50) NOT NULL DEFAULT 'cleared',
    assigned_proctor_name VARCHAR(150) NOT NULL,
    assigned_proctor_email VARCHAR(150) NOT NULL,
    hostel_room VARCHAR(50) DEFAULT 'Aryabhatta Hall B-304',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Guardian Out-Pass Approvals (Hostel leave requests requiring guardian consent)
CREATE TABLE IF NOT EXISTS public.guardian_outpass_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    ward_id UUID NOT NULL REFERENCES public.ward_telemetry_links(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    leave_start_date TIMESTAMPTZ NOT NULL,
    return_expected_date TIMESTAMPTZ NOT NULL,
    reason TEXT NOT NULL,
    outpass_token VARCHAR(100) UNIQUE NOT NULL,
    guardian_status VARCHAR(30) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    warden_status VARCHAR(30) NOT NULL DEFAULT 'awaiting_guardian',
    guardian_action_at TIMESTAMPTZ,
    guardian_remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PTM & Proctor Consultation Slots
CREATE TABLE IF NOT EXISTS public.ptm_consultation_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    ward_id UUID NOT NULL REFERENCES public.ward_telemetry_links(id) ON DELETE CASCADE,
    faculty_proctor_name VARCHAR(150) NOT NULL,
    faculty_proctor_designation VARCHAR(150) NOT NULL,
    consultation_mode VARCHAR(50) NOT NULL DEFAULT 'Virtual Google Meet', -- 'In-Person Proctor Cabin', 'Virtual Google Meet'
    scheduled_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    agenda VARCHAR(255) NOT NULL,
    booking_token VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    meeting_link VARCHAR(255),
    proctor_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_guardian_profiles_college ON public.guardian_profiles(college_id);
CREATE INDEX IF NOT EXISTS idx_ward_telemetry_guardian ON public.ward_telemetry_links(guardian_id);
CREATE INDEX IF NOT EXISTS idx_ward_telemetry_student ON public.ward_telemetry_links(student_id);
CREATE INDEX IF NOT EXISTS idx_guardian_outpasses_ward ON public.guardian_outpass_approvals(ward_id);
CREATE INDEX IF NOT EXISTS idx_ptm_slots_ward ON public.ptm_consultation_slots(ward_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.guardian_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ward_telemetry_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_outpass_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ptm_consultation_slots ENABLE ROW LEVEL SECURITY;

-- Permissive public policies for authenticated and authorized campus actors
CREATE POLICY "Allow read guardian_profiles" ON public.guardian_profiles FOR SELECT USING (true);
CREATE POLICY "Allow modify guardian_profiles" ON public.guardian_profiles FOR ALL USING (true);

CREATE POLICY "Allow read ward_telemetry_links" ON public.ward_telemetry_links FOR SELECT USING (true);
CREATE POLICY "Allow modify ward_telemetry_links" ON public.ward_telemetry_links FOR ALL USING (true);

CREATE POLICY "Allow read guardian_outpass_approvals" ON public.guardian_outpass_approvals FOR SELECT USING (true);
CREATE POLICY "Allow modify guardian_outpass_approvals" ON public.guardian_outpass_approvals FOR ALL USING (true);

CREATE POLICY "Allow read ptm_consultation_slots" ON public.ptm_consultation_slots FOR SELECT USING (true);
CREATE POLICY "Allow modify ptm_consultation_slots" ON public.ptm_consultation_slots FOR ALL USING (true);
