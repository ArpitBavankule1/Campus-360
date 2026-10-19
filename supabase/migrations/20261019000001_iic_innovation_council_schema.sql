-- Phase 54: Smart Campus MoE Institution's Innovation Council (IIC 6.0/7.0), NISP & YUKTI Repository Schema
-- Migration: 20261019000001_iic_innovation_council_schema.sql

-- 1. IIC Council Office-Bearers & Coordinators Table
CREATE TABLE IF NOT EXISTS public.iic_council_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(64) NOT NULL CHECK (role IN ('president', 'vice_president', 'convener', 'ipr_coordinator', 'startup_coordinator', 'innovation_coordinator', 'social_media_coordinator', 'nirf_ariia_coordinator', 'external_expert', 'student_lead')),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    department VARCHAR(128) NOT NULL,
    email VARCHAR(255) NOT NULL,
    tenure_year VARCHAR(32) NOT NULL DEFAULT '2026-27 (IIC 7.0)',
    member_type VARCHAR(32) NOT NULL DEFAULT 'internal_faculty' CHECK (member_type IN ('internal_faculty', 'external_industry', 'angel_investor', 'student_coordinator')),
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'emeritus', 'term_completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. IIC Quarterly Calendar & MoE/MIC Driven Activities Table
CREATE TABLE IF NOT EXISTS public.iic_quarterly_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_code VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL CHECK (category IN ('mic_driven', 'calendar_activity', 'self_driven', 'celebration_activity')),
    quarter VARCHAR(16) NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
    academic_year VARCHAR(32) NOT NULL DEFAULT '2026-27',
    start_date VARCHAR(32) NOT NULL,
    end_date VARCHAR(32) NOT NULL,
    coordinator_name VARCHAR(255) NOT NULL,
    participant_count INTEGER NOT NULL DEFAULT 0 CHECK (participant_count >= 0),
    faculty_participant_count INTEGER NOT NULL DEFAULT 0 CHECK (faculty_participant_count >= 0),
    expenditure_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    mic_reward_points INTEGER NOT NULL DEFAULT 10,
    status VARCHAR(32) NOT NULL DEFAULT 'verified_approved' CHECK (status IN ('verified_approved', 'report_submitted', 'scheduled', 'draft')),
    mic_verification_token VARCHAR(64) UNIQUE NOT NULL,
    report_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. National Innovation and Startup Policy (NISP 2019/2026) Implementation Table
CREATE TABLE IF NOT EXISTS public.iic_nisp_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_dimension VARCHAR(128) NOT NULL,
    clause_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    institutional_target VARCHAR(255) NOT NULL,
    budget_allocated_inr NUMERIC(12, 2) NOT NULL DEFAULT 4500000.00,
    budget_percentage NUMERIC(5, 2) NOT NULL DEFAULT 1.25 CHECK (budget_percentage >= 1.00),
    academic_incentives TEXT NOT NULL,
    equity_sharing_slab VARCHAR(64) NOT NULL DEFAULT '2.0% - 9.5%',
    ip_ownership_terms TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active_enacted' CHECK (status IN ('active_enacted', 'board_approved', 'under_revision')),
    policy_resolution_token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. YUKTI National Innovation Repository Submissions Table
CREATE TABLE IF NOT EXISTS public.iic_yukti_innovations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    yukti_token VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    lead_innovator VARCHAR(255) NOT NULL,
    innovator_type VARCHAR(32) NOT NULL CHECK (innovator_type IN ('student', 'faculty', 'joint_consortium')),
    department VARCHAR(128) NOT NULL,
    domain VARCHAR(128) NOT NULL,
    innovation_stage VARCHAR(64) NOT NULL CHECK (innovation_stage IN ('ideation', 'proof_of_concept', 'prototype', 'startup_commercialized')),
    trl_level INTEGER NOT NULL CHECK (trl_level BETWEEN 1 AND 9),
    patent_status VARCHAR(64) NOT NULL DEFAULT 'published' CHECK (patent_status IN ('granted', 'published', 'filed', 'provisional', 'not_applicable')),
    patent_application_no VARCHAR(64),
    seed_funding_received_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    moe_mic_evaluated BOOLEAN NOT NULL DEFAULT TRUE,
    national_recognition_status VARCHAR(64) NOT NULL DEFAULT 'shortlisted_national_finals',
    digital_signature_hash VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ARIIA & NIRF Innovation Institutional Benchmarking Table
CREATE TABLE IF NOT EXISTS public.iic_ariia_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ranking_year VARCHAR(32) NOT NULL DEFAULT '2026-27',
    rank_band VARCHAR(64) NOT NULL DEFAULT 'Band 1: Top 10-50 / Excellent',
    total_score NUMERIC(5, 2) NOT NULL DEFAULT 89.65,
    mindset_development_score NUMERIC(5, 2) NOT NULL DEFAULT 94.20,
    infrastructure_facilities_score NUMERIC(5, 2) NOT NULL DEFAULT 91.50,
    annual_budget_expenditure_score NUMERIC(5, 2) NOT NULL DEFAULT 86.80,
    patents_and_commercialization_score NUMERIC(5, 2) NOT NULL DEFAULT 88.40,
    startups_graduated_score NUMERIC(5, 2) NOT NULL DEFAULT 87.35,
    annual_dossier_token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MoE Innovation Cell 5-Star Annual Performance Certificate Table
CREATE TABLE IF NOT EXISTS public.iic_performance_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    council_code VARCHAR(64) NOT NULL DEFAULT 'IIC-HEI-2026-APEX-0941',
    academic_year VARCHAR(32) NOT NULL DEFAULT '2026-27',
    star_rating INTEGER NOT NULL DEFAULT 5 CHECK (star_rating BETWEEN 1 AND 5),
    cumulative_points NUMERIC(6, 2) NOT NULL DEFAULT 98.40,
    national_percentile NUMERIC(5, 2) NOT NULL DEFAULT 99.45,
    annual_certificate_token VARCHAR(64) UNIQUE NOT NULL,
    verified_by_mic VARCHAR(255) NOT NULL DEFAULT 'Prof. Anil Sahasrabudhe (Chairman, MoE Innovation Cell)',
    qr_verification_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.iic_council_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iic_quarterly_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iic_nisp_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iic_yukti_innovations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iic_ariia_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iic_performance_ratings ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated read policies
CREATE POLICY "Allow public read access to iic_council_members" ON public.iic_council_members FOR SELECT USING (true);
CREATE POLICY "Allow public read access to iic_quarterly_activities" ON public.iic_quarterly_activities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to iic_nisp_policies" ON public.iic_nisp_policies FOR SELECT USING (true);
CREATE POLICY "Allow public read access to iic_yukti_innovations" ON public.iic_yukti_innovations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to iic_ariia_rankings" ON public.iic_ariia_rankings FOR SELECT USING (true);
CREATE POLICY "Allow public read access to iic_performance_ratings" ON public.iic_performance_ratings FOR SELECT USING (true);
