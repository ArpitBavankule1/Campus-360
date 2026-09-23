-- ================================================================
-- CampusLens AI — Phase 4: Full Campus Data Schema Migration
-- Tables: locations, faculty, timetable, notices, events, 
--         facilities, help_requests, help_request_replies,
--         notifications, bookmarks, ai_conversations, ai_messages
-- ================================================================

-- 1. Custom Types & Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'location_category') THEN
    CREATE TYPE location_category AS ENUM (
      'academic', 'library', 'laboratory', 'sports', 
      'cafeteria', 'auditorium', 'administrative', 
      'hostel', 'facility', 'parking'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notice_priority') THEN
    CREATE TYPE notice_priority AS ENUM ('normal', 'important', 'urgent');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notice_category') THEN
    CREATE TYPE notice_category AS ENUM (
      'academic', 'exam', 'event', 'administrative', 
      'placement', 'sports', 'general'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_category') THEN
    CREATE TYPE event_category AS ENUM (
      'academic', 'cultural', 'sports', 'tech', 
      'workshop', 'seminar', 'hackathon', 'other'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_priority') THEN
    CREATE TYPE request_priority AS ENUM ('low', 'medium', 'high', 'urgent');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
    CREATE TYPE request_status AS ENUM (
      'submitted', 'under_review', 'in_progress', 'resolved', 'closed'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE notification_type AS ENUM (
      'notice', 'event', 'timetable', 'query', 'announcement', 'system'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bookmark_type') THEN
    CREATE TYPE bookmark_type AS ENUM ('location', 'notice', 'event', 'faculty');
  END IF;
END $$;

-- ================================================================
-- 2. Locations Table (Campus Navigation & Explorer)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  category location_category NOT NULL DEFAULT 'academic',
  building TEXT NOT NULL,
  floor TEXT,
  room_number TEXT,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  description TEXT,
  image_url TEXT,
  amenities TEXT[] DEFAULT '{}',
  is_accessible BOOLEAN NOT NULL DEFAULT true,
  opening_time TEXT,
  closing_time TEXT,
  contact_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_locations_updated_at ON public.locations;
CREATE TRIGGER tr_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- 3. Faculty Table (Department Faculty Directory)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  office_room TEXT,
  bio TEXT,
  avatar_url TEXT,
  qualifications TEXT,
  specializations TEXT[] DEFAULT '{}',
  office_hours TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_faculty_updated_at ON public.faculty;
CREATE TRIGGER tr_faculty_updated_at
  BEFORE UPDATE ON public.faculty
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- 4. Timetable Table (Weekly Class Schedule)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  year INTEGER NOT NULL CHECK (year >= 1 AND year <= 5),
  division TEXT NOT NULL,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  start_time TEXT NOT NULL, -- e.g. '09:00 AM'
  end_time TEXT NOT NULL,   -- e.g. '10:00 AM'
  subject_name TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  faculty_id UUID REFERENCES public.faculty(id) ON DELETE SET NULL,
  faculty_name TEXT,
  room_number TEXT NOT NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'lecture' CHECK (type IN ('lecture', 'lab', 'tutorial')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_timetable_updated_at ON public.timetable;
CREATE TRIGGER tr_timetable_updated_at
  BEFORE UPDATE ON public.timetable
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- 5. Notices Table (Broadcast Announcements & Notices)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE, -- NULL means college-wide
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority notice_priority NOT NULL DEFAULT 'normal',
  category notice_category NOT NULL DEFAULT 'general',
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Administration',
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  attachments JSONB DEFAULT '[]',
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_notices_updated_at ON public.notices;
CREATE TRIGGER tr_notices_updated_at
  BEFORE UPDATE ON public.notices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- 6. Events Table (Campus Events, Fests & Seminars)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category event_category NOT NULL DEFAULT 'tech',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  venue_name TEXT NOT NULL,
  organizer TEXT NOT NULL,
  registration_link TEXT,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_events_updated_at ON public.events;
CREATE TRIGGER tr_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- 7. Facilities Table (Campus Facilities & Amenities)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  timings TEXT,
  in_charge TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_facilities_updated_at ON public.facilities;
CREATE TRIGGER tr_facilities_updated_at
  BEFORE UPDATE ON public.facilities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- 8. Help Requests & Replies (Help Desk Ticket System)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.help_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority request_priority NOT NULL DEFAULT 'medium',
  status request_status NOT NULL DEFAULT 'submitted',
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_help_requests_updated_at ON public.help_requests;
CREATE TRIGGER tr_help_requests_updated_at
  BEFORE UPDATE ON public.help_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.help_request_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.help_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- 9. Notifications Table
-- ================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'system',
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- 10. Bookmarks Table
-- ================================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entity_type bookmark_type NOT NULL,
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_bookmark UNIQUE (user_id, entity_type, entity_id)
);

-- ================================================================
-- 11. AI Assistant Conversations & Messages
-- ================================================================
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_ai_conversations_updated_at ON public.ai_conversations;
CREATE TRIGGER tr_ai_conversations_updated_at
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- 12. Indexes for Performance
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_locations_college ON public.locations(college_id);
CREATE INDEX IF NOT EXISTS idx_locations_category ON public.locations(category);
CREATE INDEX IF NOT EXISTS idx_faculty_department ON public.faculty(department_id);
CREATE INDEX IF NOT EXISTS idx_timetable_schedule ON public.timetable(college_id, department_id, year, division, day_of_week);
CREATE INDEX IF NOT EXISTS idx_notices_college ON public.notices(college_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_start ON public.events(college_id, start_date);
CREATE INDEX IF NOT EXISTS idx_facilities_college ON public.facilities(college_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_student ON public.help_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON public.ai_messages(conversation_id);

-- ================================================================
-- 13. Row Level Security Policies
-- ================================================================
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_request_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- Locations: readable by everyone in same college (or public directory)
CREATE POLICY "locations_select_policy" ON public.locations
  FOR SELECT USING (true);

CREATE POLICY "locations_admin_policy" ON public.locations
  FOR ALL USING (public.is_college_admin(college_id));

-- Faculty: readable by everyone
CREATE POLICY "faculty_select_policy" ON public.faculty
  FOR SELECT USING (true);

CREATE POLICY "faculty_admin_policy" ON public.faculty
  FOR ALL USING (public.is_college_admin(college_id));

-- Timetable: readable by students/faculty of college
CREATE POLICY "timetable_select_policy" ON public.timetable
  FOR SELECT USING (
    college_id = public.current_user_college_id() OR 
    public.current_user_role() = 'admin'
  );

CREATE POLICY "timetable_manage_policy" ON public.timetable
  FOR ALL USING (
    public.is_college_admin(college_id) OR
    public.current_user_role() IN ('hod', 'faculty')
  );

-- Notices: readable by all in college
CREATE POLICY "notices_select_policy" ON public.notices
  FOR SELECT USING (
    college_id = public.current_user_college_id() OR
    public.current_user_role() = 'admin'
  );

CREATE POLICY "notices_manage_policy" ON public.notices
  FOR ALL USING (
    public.is_college_admin(college_id) OR
    public.current_user_role() IN ('hod', 'faculty')
  );

-- Events: readable by all
CREATE POLICY "events_select_policy" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "events_manage_policy" ON public.events
  FOR ALL USING (
    public.is_college_admin(college_id) OR
    public.current_user_role() IN ('hod', 'faculty')
  );

-- Facilities: readable by all
CREATE POLICY "facilities_select_policy" ON public.facilities
  FOR SELECT USING (true);

-- Help Requests: students view and manage their own tickets; staff view for their college
CREATE POLICY "help_requests_user_policy" ON public.help_requests
  FOR ALL USING (
    student_id = auth.uid() OR
    public.is_college_admin(college_id) OR
    public.current_user_role() IN ('hod', 'faculty')
  );

CREATE POLICY "help_replies_policy" ON public.help_request_replies
  FOR ALL USING (
    sender_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.help_requests hr 
      WHERE hr.id = request_id AND (
        hr.student_id = auth.uid() OR 
        public.is_college_admin(hr.college_id)
      )
    )
  );

-- Notifications: user reads and updates their own
CREATE POLICY "notifications_user_policy" ON public.notifications
  FOR ALL USING (user_id = auth.uid());

-- Bookmarks: user owns their bookmarks
CREATE POLICY "bookmarks_user_policy" ON public.bookmarks
  FOR ALL USING (user_id = auth.uid());

-- AI Conversations & Messages: user owns their own chats
CREATE POLICY "ai_conversations_user_policy" ON public.ai_conversations
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "ai_messages_user_policy" ON public.ai_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ai_conversations ac
      WHERE ac.id = conversation_id AND ac.user_id = auth.uid()
    )
  );
