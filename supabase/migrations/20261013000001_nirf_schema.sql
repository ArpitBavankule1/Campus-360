-- ==============================================================================
-- CampusLens AI — Phase 48: Smart Campus National Institutional Ranking Framework (NIRF),
-- Institutional Benchmarking & Higher Education Ranking Intelligence Gateway
-- ==============================================================================

-- 1. NIRF Parameters & Weightage Breakdown Table
CREATE TABLE IF NOT EXISTS public.nirf_parameters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    code TEXT NOT NULL CHECK (code IN ('TLR', 'RPC', 'GO', 'OI', 'PR')),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    max_weightage NUMERIC(5, 2) NOT NULL,
    current_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    projected_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    sub_metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
    lead_coordinator TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('verified', 'in_review', 'action_required', 'completed')) DEFAULT 'in_review',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_nirf_param_college_code UNIQUE (college_id, code)
);

-- 2. NIRF Institutional Dossiers & Ranking Submissions Table
CREATE TABLE IF NOT EXISTS public.nirf_dossiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    dossier_code TEXT NOT NULL UNIQUE,
    academic_year TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Engineering', 'Overall', 'Research', 'Management', 'Innovation', 'State_Public_University')),
    composite_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    projected_rank_range TEXT NOT NULL,
    previous_year_rank INTEGER,
    submitted_by TEXT NOT NULL,
    approving_authority TEXT NOT NULL,
    verification_hash TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'internal_audit', 'board_approved', 'submitted_to_moe', 'published')) DEFAULT 'internal_audit',
    dossier_metadata JSONB DEFAULT '{}'::jsonb,
    submission_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. NIRF Peer Benchmark Rankings Table
CREATE TABLE IF NOT EXISTS public.nirf_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    institute_name TEXT NOT NULL,
    category TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    current_rank INTEGER NOT NULL,
    tlr_score NUMERIC(5, 2) NOT NULL,
    rpc_score NUMERIC(5, 2) NOT NULL,
    go_score NUMERIC(5, 2) NOT NULL,
    oi_score NUMERIC(5, 2) NOT NULL,
    pr_score NUMERIC(5, 2) NOT NULL,
    composite_score NUMERIC(5, 2) NOT NULL,
    institute_type TEXT NOT NULL CHECK (institute_type IN ('IIT', 'NIT', 'IIIT', 'BITS', 'Apex_Institute', 'State_Govt', 'Private_Deemed')),
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. NIRF Department Data Metrics Table
CREATE TABLE IF NOT EXISTS public.nirf_data_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    parameter_code TEXT NOT NULL CHECK (parameter_code IN ('TLR', 'RPC', 'GO', 'OI', 'PR')),
    metric_code TEXT NOT NULL,
    metric_title TEXT NOT NULL,
    department TEXT NOT NULL,
    reported_value TEXT NOT NULL,
    benchmark_value TEXT NOT NULL,
    weightage NUMERIC(5, 2) NOT NULL,
    score_achieved NUMERIC(5, 2) NOT NULL,
    verified_by TEXT NOT NULL,
    audit_status TEXT NOT NULL CHECK (audit_status IN ('pending', 'verified', 'flagged')) DEFAULT 'verified',
    evidence_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_nirf_params_college ON public.nirf_parameters(college_id);
CREATE INDEX IF NOT EXISTS idx_nirf_dossiers_college_year ON public.nirf_dossiers(college_id, academic_year);
CREATE INDEX IF NOT EXISTS idx_nirf_benchmarks_college_cat ON public.nirf_benchmarks(college_id, category);
CREATE INDEX IF NOT EXISTS idx_nirf_metrics_college_param ON public.nirf_data_metrics(college_id, parameter_code);

-- Enable Row Level Security (RLS)
ALTER TABLE public.nirf_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nirf_dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nirf_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nirf_data_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access to NIRF parameters"
    ON public.nirf_parameters FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to NIRF dossiers"
    ON public.nirf_dossiers FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated staff to insert or update NIRF dossiers"
    ON public.nirf_dossiers FOR ALL
    USING (true);

CREATE POLICY "Allow public read access to NIRF benchmarks"
    ON public.nirf_benchmarks FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to NIRF data metrics"
    ON public.nirf_data_metrics FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated staff to manage NIRF data metrics"
    ON public.nirf_data_metrics FOR ALL
    USING (true);
