-- ================================================================
-- CampusLens AI — Phase 18 Database Migration
-- Campus Resource & Facility Booking System
-- Adds: facility_bookings table, collision index, RLS policies & seed
-- ================================================================

-- 1. Facility Bookings Table
CREATE TABLE IF NOT EXISTS public.facility_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  purpose TEXT NOT NULL,
  attendees_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'completed')),
  booking_pass_code TEXT NOT NULL UNIQUE,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes for collision check and high-speed queries
CREATE INDEX IF NOT EXISTS idx_facility_bookings_slot
  ON public.facility_bookings (facility_id, booking_date, start_time, status);

CREATE INDEX IF NOT EXISTS idx_facility_bookings_user
  ON public.facility_bookings (user_id, status);

CREATE INDEX IF NOT EXISTS idx_facility_bookings_date
  ON public.facility_bookings (booking_date);

-- 3. Automatic updated_at trigger
DROP TRIGGER IF EXISTS tr_facility_bookings_updated_at ON public.facility_bookings;
CREATE TRIGGER tr_facility_bookings_updated_at
  BEFORE UPDATE ON public.facility_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Enable Row Level Security
ALTER TABLE public.facility_bookings ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Allow users to view all bookings in their college (needed to see booked slots on calendar)
DROP POLICY IF EXISTS "Users can view facility bookings in their college" ON public.facility_bookings;
CREATE POLICY "Users can view facility bookings in their college"
  ON public.facility_bookings FOR SELECT
  USING (college_id = current_user_college_id());

-- Allow users to create bookings for themselves
DROP POLICY IF EXISTS "Users can create their own facility bookings" ON public.facility_bookings;
CREATE POLICY "Users can create their own facility bookings"
  ON public.facility_bookings FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    college_id = current_user_college_id()
  );

-- Allow users to update/cancel their own bookings
DROP POLICY IF EXISTS "Users can update their own facility bookings" ON public.facility_bookings;
CREATE POLICY "Users can update their own facility bookings"
  ON public.facility_bookings FOR UPDATE
  USING (user_id = auth.uid());

-- Allow staff/admin/HOD to approve/manage all bookings in college
DROP POLICY IF EXISTS "Staff and Admins can manage all bookings" ON public.facility_bookings;
CREATE POLICY "Staff and Admins can manage all bookings"
  ON public.facility_bookings FOR ALL
  USING (
    college_id = current_user_college_id() AND
    current_user_role() IN ('admin', 'hod', 'faculty')
  );
