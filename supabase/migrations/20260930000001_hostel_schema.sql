-- ================================================================
-- CampusLens AI — Phase 23 Database Migration
-- Smart Campus Hostel, Residence Management, Mess Nutrition & Out-Passes
-- Tables: hostel_blocks, hostel_rooms, hostel_allocations, hostel_mess_menus, hostel_out_passes, hostel_grievances
-- Indexes, RLS Multi-Tenant Policies & Triggers
-- ================================================================

-- 1. Hostel Blocks Table
CREATE TABLE IF NOT EXISTS public.hostel_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('boys', 'girls', 'coed')),
  total_floors INTEGER NOT NULL DEFAULT 4 CHECK (total_floors > 0),
  total_rooms INTEGER NOT NULL DEFAULT 60 CHECK (total_rooms > 0),
  warden_name TEXT NOT NULL,
  warden_phone TEXT NOT NULL,
  warden_email TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Hostel Rooms Table
CREATE TABLE IF NOT EXISTS public.hostel_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  block_id UUID NOT NULL REFERENCES public.hostel_blocks(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  floor INTEGER NOT NULL CHECK (floor >= 0),
  capacity INTEGER NOT NULL DEFAULT 2 CHECK (capacity > 0),
  occupied_count INTEGER NOT NULL DEFAULT 0 CHECK (occupied_count >= 0),
  room_type TEXT NOT NULL DEFAULT 'double' CHECK (room_type IN ('single', 'double', 'triple', 'quad')),
  monthly_rent NUMERIC(8, 2) NOT NULL DEFAULT 6500.00,
  ac_enabled BOOLEAN NOT NULL DEFAULT false,
  amenities TEXT[] DEFAULT ARRAY['bed', 'study_table', 'wardrobe', 'lan_port']::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT hostel_room_unique_per_block UNIQUE (block_id, room_number)
);

-- 3. Hostel Student Allocations Table
CREATE TABLE IF NOT EXISTS public.hostel_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.hostel_rooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bed_number TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'vacated', 'suspended')),
  allocated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  vacated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT hostel_student_single_active UNIQUE (student_id, academic_year)
);

-- 4. Hostel Mess Menus Table
CREATE TABLE IF NOT EXISTS public.hostel_mess_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'snacks', 'dinner')),
  timings TEXT NOT NULL,
  items TEXT[] NOT NULL,
  special_item TEXT,
  calories_approx INTEGER NOT NULL DEFAULT 650,
  dietary_tags TEXT[] DEFAULT ARRAY['vegetarian']::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT hostel_mess_unique_slot UNIQUE (college_id, day_of_week, meal_type)
);

-- 5. Hostel Night Out-Pass Requests Table
CREATE TABLE IF NOT EXISTS public.hostel_out_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pass_code TEXT NOT NULL UNIQUE,
  destination TEXT NOT NULL,
  reason TEXT NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  expected_return TIMESTAMPTZ NOT NULL,
  actual_return TIMESTAMPTZ,
  parent_contact TEXT NOT NULL,
  parent_consent_verified BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'departed', 'returned', 'overdue')),
  warden_remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Hostel Maintenance Grievances Table
CREATE TABLE IF NOT EXISTS public.hostel_grievances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.hostel_rooms(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('plumbing', 'electrical', 'carpentry', 'cleanliness', 'wifi', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'assigned', 'in_progress', 'resolved')),
  assigned_to TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_hostel_rooms_block ON public.hostel_rooms(block_id);
CREATE INDEX IF NOT EXISTS idx_hostel_allocations_student ON public.hostel_allocations(student_id);
CREATE INDEX IF NOT EXISTS idx_hostel_allocations_room ON public.hostel_allocations(room_id);
CREATE INDEX IF NOT EXISTS idx_hostel_out_passes_student ON public.hostel_out_passes(student_id);
CREATE INDEX IF NOT EXISTS idx_hostel_out_passes_status ON public.hostel_out_passes(status);
CREATE INDEX IF NOT EXISTS idx_hostel_grievances_student ON public.hostel_grievances(student_id);
CREATE INDEX IF NOT EXISTS idx_hostel_grievances_status ON public.hostel_grievances(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.hostel_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_mess_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_out_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_grievances ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read access to hostel blocks" ON public.hostel_blocks
  FOR SELECT USING (true);

CREATE POLICY "Public read access to hostel rooms" ON public.hostel_rooms
  FOR SELECT USING (true);

CREATE POLICY "Public read access to hostel mess menus" ON public.hostel_mess_menus
  FOR SELECT USING (true);

CREATE POLICY "Students can view their own hostel allocation" ON public.hostel_allocations
  FOR SELECT USING (auth.uid() = student_id OR current_user_role() IN ('admin', 'faculty', 'hod'));

CREATE POLICY "Students can view their own out-passes" ON public.hostel_out_passes
  FOR SELECT USING (auth.uid() = student_id OR current_user_role() IN ('admin', 'faculty', 'hod'));

CREATE POLICY "Students can insert out-pass requests" ON public.hostel_out_passes
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view their own grievances" ON public.hostel_grievances
  FOR SELECT USING (auth.uid() = student_id OR current_user_role() IN ('admin', 'faculty', 'hod'));

CREATE POLICY "Students can report grievances" ON public.hostel_grievances
  FOR INSERT WITH CHECK (auth.uid() = student_id);
