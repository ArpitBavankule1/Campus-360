-- ==============================================================================
-- CampusLens AI — Phase 50: Smart Campus QS World University Rankings,
-- Times Higher Education (THE) & Global Sustainable Development (SDG Impact)
-- World Rankings Intelligence Gateway
-- ==============================================================================

-- 1. World Ranking Frameworks Table
CREATE TABLE IF NOT EXISTS public.world_ranking_frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    framework_code TEXT NOT NULL CHECK (framework_code IN ('QS_WUR', 'THE_WUR', 'THE_IMPACT_SDG', 'QS_ASIA', 'ARWU_SHANGHAI')),
    framework_name TEXT NOT NULL,
    edition_year INTEGER NOT NULL,
    overall_rank_display TEXT NOT NULL,
    rank_numeric_min INTEGER NOT NULL,
    rank_numeric_max INTEGER NOT NULL,
    national_rank INTEGER NOT NULL,
    overall_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    previous_year_rank TEXT,
    rank_trajectory TEXT NOT NULL CHECK (rank_trajectory IN ('improved', 'retained', 'declined', 'new_entry')),
    methodology_url TEXT,
    coordinator_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_world_rank_fw_college_year UNIQUE (college_id, framework_code, edition_year)
);

-- 2. World Ranking Performance Metrics Table
CREATE TABLE IF NOT EXISTS public.world_ranking_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    framework_id UUID NOT NULL REFERENCES public.world_ranking_frameworks(id) ON DELETE CASCADE,
    metric_code TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Reputation', 'Research_Citations', 'Faculty_Student_Ratio', 'Internationalization', 'Employability', 'Industry_Income', 'Sustainability')),
    weightage_pct NUMERIC(4, 2) NOT NULL,
    raw_score NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    normalized_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    global_percentile NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    audit_source TEXT NOT NULL,
    edition_year INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_world_rank_metric_fw_code UNIQUE (framework_id, metric_code, edition_year)
);

-- 3. UN Sustainable Development Goals (SDG Impact) Table
CREATE TABLE IF NOT EXISTS public.world_ranking_sdg_impacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    sdg_number INTEGER NOT NULL CHECK (sdg_number BETWEEN 1 AND 17),
    sdg_title TEXT NOT NULL,
    the_impact_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    global_sdg_rank TEXT NOT NULL,
    national_sdg_rank INTEGER NOT NULL,
    key_initiative TEXT NOT NULL,
    lead_department TEXT NOT NULL,
    audited_kpi TEXT NOT NULL,
    evidence_url TEXT,
    edition_year INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_world_rank_sdg_college_year UNIQUE (college_id, sdg_number, edition_year)
);

-- 4. Official Ranking Submission Dossiers Table
CREATE TABLE IF NOT EXISTS public.world_ranking_dossiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    dossier_code TEXT NOT NULL UNIQUE,
    framework_code TEXT NOT NULL,
    edition_year INTEGER NOT NULL,
    cycle_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'under_internal_audit', 'vice_chancellor_approved', 'submitted_to_agency', 'published')),
    data_submission_deadline DATE NOT NULL,
    verified_publications_count INTEGER NOT NULL DEFAULT 0,
    international_academic_peers_nominated INTEGER NOT NULL DEFAULT 0,
    international_employers_nominated INTEGER NOT NULL DEFAULT 0,
    lead_compiler_name TEXT NOT NULL,
    vc_approval_date DATE,
    integrity_hash TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Global Peer Benchmarking Table
CREATE TABLE IF NOT EXISTS public.world_ranking_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    peer_institution_name TEXT NOT NULL,
    peer_country TEXT NOT NULL,
    peer_qs_rank INTEGER NOT NULL,
    peer_the_rank INTEGER NOT NULL,
    citations_per_faculty NUMERIC(6, 2) NOT NULL,
    international_student_pct NUMERIC(5, 2) NOT NULL,
    faculty_student_ratio NUMERIC(5, 2) NOT NULL,
    academic_reputation_score NUMERIC(5, 2) NOT NULL,
    employer_reputation_score NUMERIC(5, 2) NOT NULL,
    edition_year INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_world_rank_peer_college_year UNIQUE (college_id, peer_institution_name, edition_year)
);

-- 6. Cryptographic World Ranking Credentials Verification Table
CREATE TABLE IF NOT EXISTS public.world_ranking_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    certificate_code TEXT NOT NULL UNIQUE,
    framework_code TEXT NOT NULL,
    edition_year INTEGER NOT NULL,
    institution_legal_name TEXT NOT NULL,
    rank_achieved_display TEXT NOT NULL,
    issue_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    authenticity_status TEXT NOT NULL CHECK (authenticity_status IN ('VERIFIED_AUTHENTIC', 'EXPIRED', 'PROVISIONAL', 'REVOKED')),
    issuer_agency TEXT NOT NULL,
    digital_signature_hash TEXT NOT NULL,
    verification_count INTEGER NOT NULL DEFAULT 0,
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_wr_frameworks_year ON public.world_ranking_frameworks(edition_year);
CREATE INDEX IF NOT EXISTS idx_wr_metrics_fw ON public.world_ranking_metrics(framework_id);
CREATE INDEX IF NOT EXISTS idx_wr_sdg_num ON public.world_ranking_sdg_impacts(sdg_number);
CREATE INDEX IF NOT EXISTS idx_wr_dossiers_code ON public.world_ranking_dossiers(dossier_code);
CREATE INDEX IF NOT EXISTS idx_wr_verif_code ON public.world_ranking_verifications(certificate_code);

-- Enable Row Level Security (RLS)
ALTER TABLE public.world_ranking_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_ranking_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_ranking_sdg_impacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_ranking_dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_ranking_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_ranking_verifications ENABLE ROW LEVEL SECURITY;

-- Permissive RLS Policies for authenticated and anon users in Demo/Portal Mode
CREATE POLICY "Allow public read on world_ranking_frameworks" ON public.world_ranking_frameworks FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on world_ranking_frameworks" ON public.world_ranking_frameworks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on world_ranking_frameworks" ON public.world_ranking_frameworks FOR UPDATE USING (true);

CREATE POLICY "Allow public read on world_ranking_metrics" ON public.world_ranking_metrics FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on world_ranking_metrics" ON public.world_ranking_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on world_ranking_metrics" ON public.world_ranking_metrics FOR UPDATE USING (true);

CREATE POLICY "Allow public read on world_ranking_sdg_impacts" ON public.world_ranking_sdg_impacts FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on world_ranking_sdg_impacts" ON public.world_ranking_sdg_impacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on world_ranking_sdg_impacts" ON public.world_ranking_sdg_impacts FOR UPDATE USING (true);

CREATE POLICY "Allow public read on world_ranking_dossiers" ON public.world_ranking_dossiers FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on world_ranking_dossiers" ON public.world_ranking_dossiers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on world_ranking_dossiers" ON public.world_ranking_dossiers FOR UPDATE USING (true);

CREATE POLICY "Allow public read on world_ranking_benchmarks" ON public.world_ranking_benchmarks FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on world_ranking_benchmarks" ON public.world_ranking_benchmarks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on world_ranking_benchmarks" ON public.world_ranking_benchmarks FOR UPDATE USING (true);

CREATE POLICY "Allow public read on world_ranking_verifications" ON public.world_ranking_verifications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on world_ranking_verifications" ON public.world_ranking_verifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on world_ranking_verifications" ON public.world_ranking_verifications FOR UPDATE USING (true);
