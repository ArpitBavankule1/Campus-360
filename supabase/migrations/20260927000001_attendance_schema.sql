-- ============================================================
-- CampusLens AI — Phase 17: Attendance Management Schema
-- Creates attendance_sessions and attendance_records tables
-- with Row-Level Security policies
-- ============================================================

-- Table: attendance_sessions
-- Faculty creates a session for each lecture they conduct.
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id    UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  timetable_id  UUID REFERENCES public.timetable(id) ON DELETE SET NULL,
  faculty_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  course_code   TEXT NOT NULL,
  course_name   TEXT NOT NULL,
  room_number   TEXT NOT NULL,
  session_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL,
  qr_token      TEXT NOT NULL,            -- Base64-encoded LectureSessionToken
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  total_enrolled INTEGER DEFAULT 0,
  total_present  INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: attendance_records
-- Each student's check-in for a specific session.
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
  student_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  college_id    UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
  checked_in_at TIMESTAMPTZ,
  latitude      DECIMAL(10, 8),
  longitude     DECIMAL(11, 8),
  device_hint   TEXT,                     -- e.g. "web-browser", "mobile-pwa"
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_faculty ON public.attendance_sessions(faculty_id);
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_date    ON public.attendance_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_college ON public.attendance_sessions(college_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student  ON public.attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_session  ON public.attendance_records(session_id);

-- ============================================================
-- Row-Level Security
-- ============================================================

ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- attendance_sessions: faculty can create/manage their own sessions; students can read active sessions
CREATE POLICY "attendance_sessions_select_any_auth" ON public.attendance_sessions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "attendance_sessions_insert_faculty" ON public.attendance_sessions
  FOR INSERT WITH CHECK (
    faculty_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('faculty', 'hod', 'admin')
    )
  );

CREATE POLICY "attendance_sessions_update_faculty" ON public.attendance_sessions
  FOR UPDATE USING (
    faculty_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('faculty', 'hod', 'admin')
    )
  );

-- attendance_records: students can insert their own; faculty/admin can read all
CREATE POLICY "attendance_records_insert_self" ON public.attendance_records
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "attendance_records_select_self" ON public.attendance_records
  FOR SELECT USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('faculty', 'hod', 'admin')
    )
  );

CREATE POLICY "attendance_records_update_faculty" ON public.attendance_records
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('faculty', 'hod', 'admin')
    )
  );

-- ============================================================
-- Trigger: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_attendance_sessions_updated_at
  BEFORE UPDATE ON public.attendance_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_attendance_records_updated_at
  BEFORE UPDATE ON public.attendance_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
