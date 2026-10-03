-- ==============================================================================
-- CampusLens AI — Phase 34: Smart Campus Security, Visitor Passes & AI Lost & Found
-- Migration: 20261003000003_security_schema.sql
-- ==============================================================================

-- 1. Digital Visitor Pre-Registration & Gate Passes Table
CREATE TABLE IF NOT EXISTS public.security_visitor_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  pass_code TEXT NOT NULL UNIQUE,
  visitor_name TEXT NOT NULL,
  visitor_phone TEXT NOT NULL,
  visitor_id_proof TEXT NOT NULL,
  visiting_purpose TEXT NOT NULL CHECK (visiting_purpose IN ('Guest Lecture & Academic Seminar', 'Parent & Guardian Residence Visit', 'Vendor & Logistics Delivery', 'Corporate Campus Recruitment', 'Official Statutory Inspection', 'General Inquiry')),
  host_person TEXT NOT NULL,
  entry_gate TEXT NOT NULL DEFAULT 'Main Gate 1 (North Arch)' CHECK (entry_gate IN ('Main Gate 1 (North Arch)', 'Gate 2 (Hostel Quad)', 'Gate 3 (Sports Complex)', 'Gate 4 (Research Park)')),
  valid_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pre-Registered' CHECK (status IN ('Pre-Registered', 'Checked In', 'Departed', 'Expired', 'Revoked')),
  vehicle_number TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Smart Turnstile Access & Tailgating Anomaly Logs Table
CREATE TABLE IF NOT EXISTS public.turnstile_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  checkpoint_name TEXT NOT NULL,
  card_hash TEXT NOT NULL,
  user_role TEXT NOT NULL DEFAULT 'student' CHECK (user_role IN ('student', 'faculty', 'visitor', 'contractor', 'security_staff')),
  access_result TEXT NOT NULL DEFAULT 'Granted' CHECK (access_result IN ('Granted', 'Denied Invalid Card', 'Denied Expired Pass', 'Anomaly Tailgating Flagged')),
  anomaly_flag BOOLEAN NOT NULL DEFAULT false,
  tap_time TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. AI Perceptual Lost & Found Item Catalog Table
CREATE TABLE IF NOT EXISTS public.lost_and_found_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  item_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Electronics & Laptops', 'Wallets & ID Cards', 'Keys & Smart Badges', 'Bags & Backpacks', 'Watches & Jewellery', 'Books & Documents', 'Other Items')),
  found_location TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'Unclaimed' CHECK (status IN ('Unclaimed', 'Verification Pending', 'Claimed & Returned', 'Auctioned / Disposed')),
  claimed_by_id TEXT,
  reported_by TEXT NOT NULL,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. 24x7 Campus Security Guard Patrol Routes & Checkpoints Table
CREATE TABLE IF NOT EXISTS public.campus_patrol_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  route_name TEXT NOT NULL,
  checkpoint_marker TEXT NOT NULL,
  guard_name TEXT NOT NULL,
  last_patrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'Normal Secure' CHECK (status IN ('Normal Secure', 'Observation Logged', 'Incident Alerted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sec_pass_code ON public.security_visitor_passes(pass_code);
CREATE INDEX IF NOT EXISTS idx_sec_visitor_date ON public.security_visitor_passes(valid_date);
CREATE INDEX IF NOT EXISTS idx_sec_turnstile_time ON public.turnstile_access_logs(tap_time);
CREATE INDEX IF NOT EXISTS idx_sec_item_code ON public.lost_and_found_items(item_code);
CREATE INDEX IF NOT EXISTS idx_sec_item_category ON public.lost_and_found_items(category);

-- Enable RLS
ALTER TABLE public.security_visitor_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turnstile_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_and_found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_patrol_checkpoints ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public read for visitor passes" ON public.security_visitor_passes FOR SELECT USING (true);
CREATE POLICY "Public read for turnstile access logs" ON public.turnstile_access_logs FOR SELECT USING (true);
CREATE POLICY "Public read for lost and found items" ON public.lost_and_found_items FOR SELECT USING (true);
CREATE POLICY "Public read for patrol checkpoints" ON public.campus_patrol_checkpoints FOR SELECT USING (true);
