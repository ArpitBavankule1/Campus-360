-- ==============================================================================
-- CampusLens AI — Phase 49: Smart Campus National Board of Accreditation (NBA),
-- Outcome-Based Education (OBE) & Washington Accord Tier-1 Accreditation Gateway
-- ==============================================================================

-- 1. NBA Accredited Programs Table
CREATE TABLE IF NOT EXISTS public.nba_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    program_code TEXT NOT NULL,
    program_name TEXT NOT NULL,
    department TEXT NOT NULL,
    degree_level TEXT NOT NULL CHECK (degree_level IN ('UG', 'PG', 'Doctoral')),
    tier TEXT NOT NULL CHECK (tier IN ('Tier_1_Washington_Accord', 'Tier_2')),
    accreditation_status TEXT NOT NULL CHECK (accreditation_status IN ('accredited_6_years', 'accredited_3_years', 'provisional', 'in_progress', 'applied')),
    validity_start DATE,
    validity_end DATE,
    total_criteria_score NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    sar_code TEXT NOT NULL UNIQUE,
    program_coordinator TEXT NOT NULL,
    hod_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_nba_prog_college_code UNIQUE (college_id, program_code)
);

-- 2. Program Outcomes (POs 1-12 & PSOs) Table
CREATE TABLE IF NOT EXISTS public.nba_program_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.nba_programs(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_attainment NUMERIC(4, 2) NOT NULL DEFAULT 2.40,
    actual_attainment NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
    academic_year TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('attained', 'substantially_attained', 'under_review', 'action_required')) DEFAULT 'under_review',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_nba_po_program_code_year UNIQUE (program_id, code, academic_year)
);

-- 3. Course Outcomes (COs) Table
CREATE TABLE IF NOT EXISTS public.nba_course_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.nba_programs(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    co_code TEXT NOT NULL,
    statement TEXT NOT NULL,
    bloom_level TEXT NOT NULL CHECK (bloom_level IN ('Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create')),
    direct_attainment_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    indirect_attainment_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    final_attainment_score NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
    target_score NUMERIC(4, 2) NOT NULL DEFAULT 2.50,
    academic_year TEXT NOT NULL,
    semester INTEGER NOT NULL,
    faculty_in_charge TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_nba_co_course_code_year UNIQUE (program_id, course_code, co_code, academic_year)
);

-- 4. CO-PO Correlation Mapping Table
CREATE TABLE IF NOT EXISTS public.nba_co_po_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    course_outcome_id UUID NOT NULL REFERENCES public.nba_course_outcomes(id) ON DELETE CASCADE,
    po_code TEXT NOT NULL,
    correlation_level INTEGER NOT NULL CHECK (correlation_level IN (0, 1, 2, 3)),
    justification TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. NBA Self-Assessment Reports (SAR) Table
CREATE TABLE IF NOT EXISTS public.nba_sar_dossiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.nba_programs(id) ON DELETE CASCADE,
    sar_code TEXT NOT NULL UNIQUE,
    academic_year TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('Tier_1_Washington_Accord', 'Tier_2')),
    total_eval_points NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    criteria_progress JSONB NOT NULL DEFAULT '[]'::jsonb,
    verification_hash TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'internal_review', 'academic_council_approved', 'submitted_to_nba', 'accredited')) DEFAULT 'internal_review',
    submission_date DATE,
    coordinator_name TEXT NOT NULL,
    evaluator_remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. NBA Evaluation Team Visits Table
CREATE TABLE IF NOT EXISTS public.nba_evaluation_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    visit_code TEXT NOT NULL UNIQUE,
    program_code TEXT NOT NULL,
    team_chairperson TEXT NOT NULL,
    member_evaluators JSONB NOT NULL DEFAULT '[]'::jsonb,
    visit_dates TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'report_submitted')) DEFAULT 'scheduled',
    exit_meeting_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_nba_programs_college ON public.nba_programs(college_id);
CREATE INDEX IF NOT EXISTS idx_nba_po_program ON public.nba_program_outcomes(program_id);
CREATE INDEX IF NOT EXISTS idx_nba_co_program_course ON public.nba_course_outcomes(program_id, course_code);
CREATE INDEX IF NOT EXISTS idx_nba_mapping_co ON public.nba_co_po_mappings(course_outcome_id);
CREATE INDEX IF NOT EXISTS idx_nba_sar_program ON public.nba_sar_dossiers(program_id);
CREATE INDEX IF NOT EXISTS idx_nba_visits_college ON public.nba_evaluation_visits(college_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.nba_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nba_program_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nba_course_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nba_co_po_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nba_sar_dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nba_evaluation_visits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access to NBA programs"
    ON public.nba_programs FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated staff to manage NBA programs"
    ON public.nba_programs FOR ALL
    USING (true);

CREATE POLICY "Allow public read access to NBA program outcomes"
    ON public.nba_program_outcomes FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated staff to manage NBA program outcomes"
    ON public.nba_program_outcomes FOR ALL
    USING (true);

CREATE POLICY "Allow public read access to NBA course outcomes"
    ON public.nba_course_outcomes FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated staff to manage NBA course outcomes"
    ON public.nba_course_outcomes FOR ALL
    USING (true);

CREATE POLICY "Allow public read access to NBA CO-PO mappings"
    ON public.nba_co_po_mappings FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated staff to manage NBA CO-PO mappings"
    ON public.nba_co_po_mappings FOR ALL
    USING (true);

CREATE POLICY "Allow public read access to NBA SAR dossiers"
    ON public.nba_sar_dossiers FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated staff to manage NBA SAR dossiers"
    ON public.nba_sar_dossiers FOR ALL
    USING (true);

CREATE POLICY "Allow public read access to NBA evaluation visits"
    ON public.nba_evaluation_visits FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated staff to manage NBA evaluation visits"
    ON public.nba_evaluation_visits FOR ALL
    USING (true);
