-- ==============================================================================
-- CampusLens AI — Phase 36: Smart Campus Auditorium, Cultural Convention Center & Event Ticketing
-- Migration: 20261004000002_auditorium_schema.sql
-- ==============================================================================

-- 1. Auditorium Halls & Venues Table
CREATE TABLE IF NOT EXISTS public.auditorium_halls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  hall_name TEXT NOT NULL,
  seating_capacity INT NOT NULL DEFAULT 850,
  venue_building TEXT NOT NULL,
  acoustic_rating TEXT NOT NULL DEFAULT 'Dolby Atmos Pro Sound',
  stage_dimensions TEXT NOT NULL DEFAULT '45ft x 30ft Proscenium',
  projector_type TEXT NOT NULL DEFAULT 'Laser 4K Christie Digital',
  current_status TEXT NOT NULL DEFAULT 'Available' CHECK (current_status IN ('Available', 'In Session', 'Under Maintenance')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Auditorium Event Reservations Table
CREATE TABLE IF NOT EXISTS public.auditorium_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  booking_code TEXT NOT NULL UNIQUE,
  hall_name TEXT NOT NULL,
  event_title TEXT NOT NULL,
  organizer_name TEXT NOT NULL,
  organizer_role TEXT NOT NULL CHECK (organizer_role IN ('Student Club Lead', 'Faculty Coordinator', 'Dean Office', 'External Guest Speaker')),
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  expected_attendees INT NOT NULL DEFAULT 350,
  booking_status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (booking_status IN ('Confirmed', 'Pending Approval', 'Cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Event Tickets & Seat Admittance Passes Table
CREATE TABLE IF NOT EXISTS public.auditorium_event_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  ticket_code TEXT NOT NULL UNIQUE,
  event_title TEXT NOT NULL,
  hall_name TEXT NOT NULL,
  attendee_name TEXT NOT NULL,
  seat_number TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'Orchestra Premium' CHECK (tier IN ('Orchestra Premium', 'Executive Mezzanine', 'General Balcony', 'VIP Dignitary')),
  is_checked_in BOOLEAN NOT NULL DEFAULT false,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Stage Equipment Riders & AV Technicians Table
CREATE TABLE IF NOT EXISTS public.stage_equipment_riders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES public.auditorium_reservations(id) ON DELETE CASCADE,
  equipment_type TEXT NOT NULL CHECK (equipment_type IN ('Wireless Lapel Mics', 'Digital Mixer 32-Ch', 'Line Array PA Speakers', 'Moving Head LED Rigs', '4K Telepresence Cameras')),
  quantity INT NOT NULL DEFAULT 2,
  technician_assigned TEXT NOT NULL DEFAULT 'Campus AV Chief Technician',
  status TEXT NOT NULL DEFAULT 'Installed & Tested' CHECK (status IN ('Dispatched', 'Installed & Tested', 'Returned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.auditorium_halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditorium_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditorium_event_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_equipment_riders ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated campus members
CREATE POLICY "Allow members to view auditorium halls"
  ON public.auditorium_halls FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow members to view auditorium reservations"
  ON public.auditorium_reservations FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow attendees to view event tickets"
  ON public.auditorium_event_tickets FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow members to view equipment riders"
  ON public.stage_equipment_riders FOR SELECT
  TO authenticated, anon
  USING (true);
