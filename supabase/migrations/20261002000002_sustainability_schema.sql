-- ==============================================================================
-- CampusLens AI — Phase 30: Smart Campus Sustainability & Green Energy Ledger
-- Migration: 20261002000002_sustainability_schema.sql
-- ==============================================================================

-- 1. Solar Photovoltaic (PV) Generation & Microgrid Telemetry Table
CREATE TABLE IF NOT EXISTS public.sustainability_solar_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  array_zone TEXT NOT NULL CHECK (array_zone IN ('Engineering Block A & B', 'Central Library Complex', 'Indoor Sports Arena', 'Scholars Residence Hall', 'Administrative Tower')),
  peak_capacity_kwp NUMERIC(8, 2) NOT NULL CHECK (peak_capacity_kwp > 0),
  current_generation_kw NUMERIC(8, 2) NOT NULL CHECK (current_generation_kw >= 0),
  daily_total_kwh NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (daily_total_kwh >= 0),
  battery_storage_percent INTEGER NOT NULL DEFAULT 85 CHECK (battery_storage_percent >= 0 AND battery_storage_percent <= 100),
  grid_export_kw NUMERIC(8, 2) NOT NULL DEFAULT 0,
  carbon_offset_kg NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (carbon_offset_kg >= 0),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Smart Campus Water Management & Rainwater Harvesting Table
CREATE TABLE IF NOT EXISTS public.sustainability_water_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  reservoir_name TEXT NOT NULL,
  capacity_kiloliters NUMERIC(10, 2) NOT NULL CHECK (capacity_kiloliters > 0),
  current_reserve_kiloliters NUMERIC(10, 2) NOT NULL CHECK (current_reserve_kiloliters >= 0),
  greywater_recycled_liters_today NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (greywater_recycled_liters_today >= 0),
  water_quality_index NUMERIC(5, 2) NOT NULL DEFAULT 94.50 CHECK (water_quality_index >= 0 AND water_quality_index <= 100),
  tds_ppm INTEGER NOT NULL DEFAULT 140,
  ph_level NUMERIC(3, 1) NOT NULL DEFAULT 7.2 CHECK (ph_level >= 0 AND ph_level <= 14),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Solid Waste, Composting & Cafeteria Diversion Audit Table
CREATE TABLE IF NOT EXISTS public.sustainability_waste_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  audit_week TEXT NOT NULL,
  organic_compost_kg NUMERIC(8, 2) NOT NULL DEFAULT 0 CHECK (organic_compost_kg >= 0),
  dry_recyclables_kg NUMERIC(8, 2) NOT NULL DEFAULT 0 CHECK (dry_recyclables_kg >= 0),
  electronic_waste_kg NUMERIC(8, 2) NOT NULL DEFAULT 0 CHECK (electronic_waste_kg >= 0),
  landfill_waste_kg NUMERIC(8, 2) NOT NULL DEFAULT 0 CHECK (landfill_waste_kg >= 0),
  landfill_diversion_rate_percent NUMERIC(5, 2) NOT NULL CHECK (landfill_diversion_rate_percent >= 0 AND landfill_diversion_rate_percent <= 100),
  auditor_officer TEXT NOT NULL,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Student Green Commute Leaderboard & Eco-Credits Table
CREATE TABLE IF NOT EXISTS public.sustainability_eco_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  commute_mode TEXT NOT NULL CHECK (commute_mode IN ('Bicycle', 'Walking', 'Campus EV Shuttle', 'Carpooling')),
  distance_km NUMERIC(6, 2) NOT NULL CHECK (distance_km > 0),
  co2_saved_kg NUMERIC(6, 2) NOT NULL CHECK (co2_saved_kg >= 0),
  eco_points_earned INTEGER NOT NULL CHECK (eco_points_earned >= 0),
  certificate_code TEXT NOT NULL UNIQUE,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sustain_solar_zone ON public.sustainability_solar_telemetry(array_zone);
CREATE INDEX IF NOT EXISTS idx_sustain_water_res ON public.sustainability_water_metrics(reservoir_name);
CREATE INDEX IF NOT EXISTS idx_sustain_waste_week ON public.sustainability_waste_audits(audit_week);
CREATE INDEX IF NOT EXISTS idx_sustain_eco_student ON public.sustainability_eco_credits(student_id);
CREATE INDEX IF NOT EXISTS idx_sustain_eco_code ON public.sustainability_eco_credits(certificate_code);

-- Enable RLS
ALTER TABLE public.sustainability_solar_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sustainability_water_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sustainability_waste_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sustainability_eco_credits ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public read for sustainability solar" ON public.sustainability_solar_telemetry FOR SELECT USING (true);
CREATE POLICY "Public read for sustainability water" ON public.sustainability_water_metrics FOR SELECT USING (true);
CREATE POLICY "Public read for sustainability waste" ON public.sustainability_waste_audits FOR SELECT USING (true);
CREATE POLICY "Public read for sustainability eco credits" ON public.sustainability_eco_credits FOR SELECT USING (true);
