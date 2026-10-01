-- ==============================================================================
-- CampusLens AI — Phase 27: Smart Campus Transport, EV Shuttles & Digital Parking
-- Migration: 20261001000002_transport_schema.sql
-- ==============================================================================

-- 1. Transport Routes Table
CREATE TABLE IF NOT EXISTS public.transport_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  route_name TEXT NOT NULL,
  route_code TEXT NOT NULL UNIQUE,
  shuttle_type TEXT NOT NULL CHECK (shuttle_type IN ('electric_bus', 'mini_van', 'express_shuttle', 'night_transit')),
  start_point TEXT NOT NULL,
  end_point TEXT NOT NULL,
  stops JSONB NOT NULL DEFAULT '[]'::jsonb,
  operating_hours TEXT NOT NULL DEFAULT '07:30 AM - 10:00 PM',
  frequency_mins INTEGER NOT NULL DEFAULT 15,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'delayed', 'off_duty')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Transport Live Schedules Table
CREATE TABLE IF NOT EXISTS public.transport_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES public.transport_routes(id) ON DELETE CASCADE,
  bus_number TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  driver_phone TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  current_stop TEXT NOT NULL,
  live_eta_mins INTEGER NOT NULL DEFAULT 5,
  live_status TEXT NOT NULL DEFAULT 'on_time' CHECK (live_status IN ('on_time', 'approaching', 'delayed', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Digital Transport Boarding Passes Table
CREATE TABLE IF NOT EXISTS public.transport_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  scholar_id UUID NOT NULL,
  scholar_name TEXT NOT NULL,
  pass_type TEXT NOT NULL CHECK (pass_type IN ('semester_unlimited', 'monthly_commuter', 'faculty_express', 'single_day_guest')),
  pass_code TEXT NOT NULL UNIQUE,
  route_id UUID REFERENCES public.transport_routes(id) ON DELETE SET NULL,
  valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_to DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '6 months')::date,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Smart Parking Zones Table
CREATE TABLE IF NOT EXISTS public.parking_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  zone_name TEXT NOT NULL,
  zone_code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('faculty', 'scholar', 'visitor', 'ev_charging')),
  total_bays INTEGER NOT NULL CHECK (total_bays > 0),
  occupied_bays INTEGER NOT NULL DEFAULT 0 CHECK (occupied_bays >= 0),
  hourly_rate NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Parking Bay Reservations Table
CREATE TABLE IF NOT EXISTS public.parking_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  zone_id UUID NOT NULL REFERENCES public.parking_zones(id) ON DELETE CASCADE,
  bay_number TEXT NOT NULL,
  vehicle_plate TEXT NOT NULL,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car', 'two_wheeler', 'ev')),
  reserved_from TIMESTAMPTZ NOT NULL,
  reserved_until TIMESTAMPTZ NOT NULL,
  pass_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Campus Carpool & Ride Share Listings Table
CREATE TABLE IF NOT EXISTS public.carpool_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL,
  driver_name TEXT NOT NULL,
  driver_role TEXT NOT NULL DEFAULT 'student' CHECK (driver_role IN ('student', 'faculty', 'staff')),
  departure_location TEXT NOT NULL,
  destination_campus TEXT NOT NULL DEFAULT 'Main Campus North Gate',
  departure_time TEXT NOT NULL,
  seats_available INTEGER NOT NULL CHECK (seats_available >= 0),
  price_per_seat NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
  vehicle_model TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transport_routes_code ON public.transport_routes(route_code);
CREATE INDEX IF NOT EXISTS idx_transport_passes_code ON public.transport_passes(pass_code);
CREATE INDEX IF NOT EXISTS idx_parking_zones_category ON public.parking_zones(category);
CREATE INDEX IF NOT EXISTS idx_parking_reservations_code ON public.parking_reservations(pass_code);
CREATE INDEX IF NOT EXISTS idx_carpool_driver ON public.carpool_listings(driver_id);

-- Enable RLS
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carpool_listings ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public read for transport routes" ON public.transport_routes FOR SELECT USING (true);
CREATE POLICY "Public read for transport schedules" ON public.transport_schedules FOR SELECT USING (true);
CREATE POLICY "Public read for transport passes" ON public.transport_passes FOR SELECT USING (true);
CREATE POLICY "Public read for parking zones" ON public.parking_zones FOR SELECT USING (true);
CREATE POLICY "Public read for parking reservations" ON public.parking_reservations FOR SELECT USING (true);
CREATE POLICY "Public read for carpool listings" ON public.carpool_listings FOR SELECT USING (true);
