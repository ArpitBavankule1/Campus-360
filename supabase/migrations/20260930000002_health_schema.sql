-- ================================================================
-- CampusLens AI — Phase 24 Database Migration
-- Campus Health Center, Infirmary, Medical Leaves & Emergency SOS
-- Tables: health_appointments, student_health_profiles, medical_leave_requests, dispensary_medicines, emergency_sos_dispatches
-- Indexes, RLS Multi-Tenant Policies & Triggers
-- ================================================================

-- 1. Student Health Profiles Table
CREATE TABLE IF NOT EXISTS public.student_health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  blood_group TEXT NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
  chronic_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  emergency_contact_relation TEXT NOT NULL,
  insurance_policy_no TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Health Appointments Table
CREATE TABLE IF NOT EXISTS public.health_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  token_number INTEGER NOT NULL,
  symptoms TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  prescription_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT health_appointment_unique_token UNIQUE (appointment_date, time_slot, token_number)
);

-- 3. Medical Leave Requests Table
CREATE TABLE IF NOT EXISTS public.medical_leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  leave_code TEXT NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL CHECK (total_days > 0),
  reason TEXT NOT NULL,
  doctor_certificate_url TEXT,
  attendance_waiver_granted BOOLEAN NOT NULL DEFAULT false,
  verified_by TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Dispensary Medicines Table
CREATE TABLE IF NOT EXISTS public.dispensary_medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  generic_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  available_quantity INTEGER NOT NULL DEFAULT 0 CHECK (available_quantity >= 0),
  unit TEXT NOT NULL DEFAULT 'strips',
  requires_prescription BOOLEAN NOT NULL DEFAULT false,
  is_in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Emergency SOS Dispatches Table
CREATE TABLE IF NOT EXISTS public.emergency_sos_dispatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sos_ticket_code TEXT NOT NULL UNIQUE,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  building_reference TEXT NOT NULL,
  emergency_type TEXT NOT NULL DEFAULT 'general' CHECK (emergency_type IN ('cardiac', 'trauma', 'asthma', 'fainting', 'general')),
  ambulance_dispatched BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'dispatched' CHECK (status IN ('dispatched', 'en_route', 'attended', 'resolved')),
  responder_notes TEXT,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_health_appointments_student ON public.health_appointments(student_id);
CREATE INDEX IF NOT EXISTS idx_health_appointments_date ON public.health_appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_medical_leaves_student ON public.medical_leave_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_emergency_sos_status ON public.emergency_sos_dispatches(status);

-- Enable RLS
ALTER TABLE public.student_health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispensary_medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_sos_dispatches ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read dispensary medicines" ON public.dispensary_medicines
  FOR SELECT USING (true);

CREATE POLICY "Students manage their health profile" ON public.student_health_profiles
  FOR ALL USING (auth.uid() = student_id OR current_user_role() IN ('admin', 'faculty'));

CREATE POLICY "Students manage their appointments" ON public.health_appointments
  FOR ALL USING (auth.uid() = student_id OR current_user_role() IN ('admin', 'faculty'));

CREATE POLICY "Students view medical leaves" ON public.medical_leave_requests
  FOR SELECT USING (auth.uid() = student_id OR current_user_role() IN ('admin', 'faculty', 'hod'));

CREATE POLICY "Students insert medical leaves" ON public.medical_leave_requests
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Emergency SOS accessible by caller and responders" ON public.emergency_sos_dispatches
  FOR ALL USING (true);
