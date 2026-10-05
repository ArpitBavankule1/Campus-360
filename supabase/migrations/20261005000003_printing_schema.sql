-- CampusLens AI — Phase 40: Smart Campus Cloud Printing, Document Xerox & Thesis Binding Hub
-- Migration: 20261005000003_printing_schema.sql

-- 1. Print Stations (Smart Kiosks) Table
CREATE TABLE IF NOT EXISTS public.print_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  kiosk_name TEXT NOT NULL,
  campus_building TEXT NOT NULL,
  floor_location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Online & Ready' CHECK (status IN ('Online & Ready', 'Paper Tray Low', 'Out of Toner', 'Under Maintenance')),
  paper_level_pct INTEGER NOT NULL DEFAULT 85,
  toner_level_pct INTEGER NOT NULL DEFAULT 90,
  supported_sizes TEXT[] NOT NULL DEFAULT '{"A4", "A3"}',
  is_color_capable BOOLEAN NOT NULL DEFAULT true,
  is_duplex_capable BOOLEAN NOT NULL DEFAULT true,
  queue_jobs_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Student Print Wallets & Quotas Table
CREATE TABLE IF NOT EXISTS public.student_print_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  scholar_id TEXT NOT NULL UNIQUE,
  scholar_name TEXT NOT NULL,
  semester_free_quota_pages INTEGER NOT NULL DEFAULT 500,
  free_pages_remaining INTEGER NOT NULL DEFAULT 380,
  wallet_balance_inr NUMERIC(8, 2) NOT NULL DEFAULT 150.00,
  total_pages_printed INTEGER NOT NULL DEFAULT 120,
  last_used_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Print Jobs Queue Table
CREATE TABLE IF NOT EXISTS public.print_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  job_code TEXT NOT NULL UNIQUE,
  scholar_id TEXT NOT NULL,
  scholar_name TEXT NOT NULL,
  document_name TEXT NOT NULL,
  page_count INTEGER NOT NULL,
  color_mode TEXT NOT NULL CHECK (color_mode IN ('Monochrome B&W', 'High-Res Color')),
  duplex_mode TEXT NOT NULL CHECK (duplex_mode IN ('Single-Sided', 'Double-Sided Duplex')),
  total_cost_inr NUMERIC(6, 2) NOT NULL,
  pickup_kiosk_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ready for Kiosk Pickup' CHECK (status IN ('Queued in Cloud', 'Processing', 'Ready for Kiosk Pickup', 'Printed & Collected', 'Purged')),
  release_pin TEXT NOT NULL,
  release_token_hash TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Thesis & Hardcover Binding Orders Table
CREATE TABLE IF NOT EXISTS public.thesis_binding_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  order_code TEXT NOT NULL UNIQUE,
  scholar_id TEXT NOT NULL,
  scholar_name TEXT NOT NULL,
  department TEXT NOT NULL,
  thesis_title TEXT NOT NULL,
  degree_program TEXT NOT NULL,
  cover_type TEXT NOT NULL CHECK (cover_type IN ('Hardcover Royal Navy (Gold Foil)', 'Hardcover Emerald Green (Silver Foil)', 'Softcover Spiral Binding', 'Deluxe Leatherette Archival')),
  copies_requested INTEGER NOT NULL DEFAULT 3,
  embossing_text TEXT NOT NULL,
  binding_status TEXT NOT NULL DEFAULT 'Submitted for Binding' CHECK (binding_status IN ('Submitted for Binding', 'Cover Embossing', 'Quality Inspected', 'Ready for Library Deposit')),
  department_signoff_status TEXT NOT NULL DEFAULT 'Approved by HOD' CHECK (department_signoff_status IN ('Pending Guide Signoff', 'Approved by Guide', 'Approved by HOD')),
  target_delivery_date DATE NOT NULL,
  total_fee_inr NUMERIC(8, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_print_stations_college ON public.print_stations(college_id);
CREATE INDEX IF NOT EXISTS idx_student_print_wallets_scholar ON public.student_print_wallets(scholar_id);
CREATE INDEX IF NOT EXISTS idx_print_jobs_code ON public.print_jobs(job_code);
CREATE INDEX IF NOT EXISTS idx_print_jobs_scholar ON public.print_jobs(scholar_id);
CREATE INDEX IF NOT EXISTS idx_thesis_binding_orders_code ON public.thesis_binding_orders(order_code);

-- Enable Row Level Security
ALTER TABLE public.print_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_print_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thesis_binding_orders ENABLE ROW LEVEL SECURITY;

-- Permissive demo policies
CREATE POLICY "Allow public read print stations" ON public.print_stations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert print stations" ON public.print_stations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read student print wallets" ON public.student_print_wallets FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert student print wallets" ON public.student_print_wallets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read print jobs" ON public.print_jobs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert print jobs" ON public.print_jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read thesis binding orders" ON public.thesis_binding_orders FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert thesis binding orders" ON public.thesis_binding_orders FOR INSERT WITH CHECK (true);
