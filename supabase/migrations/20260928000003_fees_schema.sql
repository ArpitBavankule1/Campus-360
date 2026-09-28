-- CampusLens AI — Phase 21 Database Migration
-- Student Fee Management, Digital Payments & Scholarships Schema
-- Multi-tenant, RLS-protected, and enterprise-grade

-- 1. Create Student Fee Dues Table
CREATE TABLE IF NOT EXISTS public.student_fee_dues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    semester TEXT NOT NULL,
    academic_year TEXT NOT NULL DEFAULT '2026-2027',
    category TEXT NOT NULL CHECK (category IN ('tuition', 'hostel', 'library', 'examination', 'lab_equipment')),
    amount_due NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    penalty_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partially_paid', 'paid', 'overdue')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create Fee Payment Transactions Table
CREATE TABLE IF NOT EXISTS public.fee_payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fee_due_id UUID NOT NULL REFERENCES public.student_fee_dues(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    transaction_ref TEXT NOT NULL UNIQUE,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('upi', 'credit_card', 'debit_card', 'net_banking')),
    amount_paid NUMERIC(10, 2) NOT NULL,
    payment_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    receipt_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'pending', 'failed')),
    gateway_response_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create Scholarship Programs Table
CREATE TABLE IF NOT EXISTS public.scholarship_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    grant_amount NUMERIC(10, 2) NOT NULL,
    min_cgpa NUMERIC(3, 2) NOT NULL DEFAULT 7.50,
    max_family_income NUMERIC(12, 2) NOT NULL DEFAULT 800000.00,
    deadline DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Create Scholarship Applications Table
CREATE TABLE IF NOT EXISTS public.scholarship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scholarship_id UUID NOT NULL REFERENCES public.scholarship_programs(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'disbursed', 'rejected')),
    disbursed_amount NUMERIC(10, 2) DEFAULT 0.00,
    notes TEXT,
    CONSTRAINT unique_student_scholarship UNIQUE (scholarship_id, student_id)
);

-- 5. High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_fee_dues_student ON public.student_fee_dues(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_dues_college_status ON public.student_fee_dues(college_id, status);
CREATE INDEX IF NOT EXISTS idx_fee_transactions_student ON public.fee_payment_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_transactions_ref ON public.fee_payment_transactions(transaction_ref);
CREATE INDEX IF NOT EXISTS idx_scholarship_apps_student ON public.scholarship_applications(student_id);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.student_fee_dues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;

-- 7. Multi-Tenant RLS Policies
-- Dues: Students view own; Admins manage all in college
CREATE POLICY "Students can view their own fee dues"
    ON public.student_fee_dues FOR SELECT
    USING (student_id = auth.uid());

CREATE POLICY "Admins can manage all fee dues in their college"
    ON public.student_fee_dues FOR ALL
    USING (
        college_id = (SELECT college_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hod')
    );

-- Transactions: Students view own; Admins manage all
CREATE POLICY "Students can view their own fee payment transactions"
    ON public.fee_payment_transactions FOR SELECT
    USING (student_id = auth.uid());

CREATE POLICY "Students can insert payment transactions"
    ON public.fee_payment_transactions FOR INSERT
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can view and manage all transactions in college"
    ON public.fee_payment_transactions FOR ALL
    USING (
        college_id = (SELECT college_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hod')
    );

-- Scholarships: Viewable by all in college; Managed by admins
CREATE POLICY "Users can view scholarships in their college"
    ON public.scholarship_programs FOR SELECT
    USING (college_id = (SELECT college_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage scholarship programs"
    ON public.scholarship_programs FOR ALL
    USING (
        college_id = (SELECT college_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hod')
    );

-- Scholarship Applications: Students view/submit own; Admins manage all
CREATE POLICY "Students can view and submit their own scholarship applications"
    ON public.scholarship_applications FOR ALL
    USING (student_id = auth.uid());

CREATE POLICY "Admins can view and manage scholarship applications"
    ON public.scholarship_applications FOR ALL
    USING (
        college_id = (SELECT college_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hod')
    );
