-- ================================================================
-- CampusLens AI — Phase 19 Database Migration
-- Academic Examinations, Hall Tickets, Seating Matrix & Grades
-- ================================================================

-- 1. Exam Schedules Table
CREATE TABLE IF NOT EXISTS public.exam_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  semester TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  exam_date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  room_number TEXT NOT NULL,
  building_name TEXT NOT NULL DEFAULT 'Main Academic Block',
  total_marks INTEGER NOT NULL DEFAULT 100,
  exam_type TEXT NOT NULL DEFAULT 'end_sem' CHECK (exam_type IN ('mid_term', 'end_sem', 'practical', 'viva')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Exam Hall Tickets Table (Admit Cards)
CREATE TABLE IF NOT EXISTS public.exam_hall_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  semester TEXT NOT NULL,
  hall_ticket_number TEXT NOT NULL UNIQUE,
  is_eligible BOOLEAN NOT NULL DEFAULT true,
  attendance_percentage NUMERIC(5,2) NOT NULL DEFAULT 85.00,
  fee_clearance BOOLEAN NOT NULL DEFAULT true,
  qr_verification_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Exam Seating Allocations Table
CREATE TABLE IF NOT EXISTS public.exam_seating_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_schedule_id UUID NOT NULL REFERENCES public.exam_schedules(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  roll_number TEXT NOT NULL,
  room_number TEXT NOT NULL,
  floor TEXT NOT NULL,
  bench_number TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Student Grade Records (Transcripts & GPA)
CREATE TABLE IF NOT EXISTS public.student_grade_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  semester TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 4,
  internal_marks INTEGER NOT NULL,
  endsem_marks INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  grade TEXT NOT NULL CHECK (grade IN ('O', 'A+', 'A', 'B+', 'B', 'C', 'F')),
  grade_point NUMERIC(3,1) NOT NULL,
  status TEXT NOT NULL DEFAULT 'passed' CHECK (status IN ('passed', 'failed', 'under_revaluation')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Indexes for fast searches and collision checks
CREATE INDEX IF NOT EXISTS idx_exam_schedules_dept_sem
  ON public.exam_schedules (department_id, semester, exam_date);

CREATE INDEX IF NOT EXISTS idx_exam_hall_tickets_student
  ON public.exam_hall_tickets (student_id, semester);

CREATE INDEX IF NOT EXISTS idx_exam_seating_roll
  ON public.exam_seating_allocations (roll_number, exam_schedule_id);

CREATE INDEX IF NOT EXISTS idx_student_grades_student_sem
  ON public.student_grade_records (student_id, semester);

-- 6. Enable Row Level Security
ALTER TABLE public.exam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_hall_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_seating_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_grade_records ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
DROP POLICY IF EXISTS "Anyone in college can view exam schedules" ON public.exam_schedules;
CREATE POLICY "Anyone in college can view exam schedules"
  ON public.exam_schedules FOR SELECT
  USING (college_id = current_user_college_id());

DROP POLICY IF EXISTS "Students can view their own hall ticket" ON public.exam_hall_tickets;
CREATE POLICY "Students can view their own hall ticket"
  ON public.exam_hall_tickets FOR SELECT
  USING (student_id = auth.uid() OR current_user_role() IN ('admin', 'hod', 'faculty'));

DROP POLICY IF EXISTS "Anyone in college can view seating arrangement" ON public.exam_seating_allocations;
CREATE POLICY "Anyone in college can view seating arrangement"
  ON public.exam_seating_allocations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Students can view their own grade records" ON public.student_grade_records;
CREATE POLICY "Students can view their own grade records"
  ON public.student_grade_records FOR SELECT
  USING (student_id = auth.uid() OR current_user_role() IN ('admin', 'hod', 'faculty'));
