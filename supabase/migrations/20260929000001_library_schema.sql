-- ================================================================
-- CampusLens AI — Phase 22 Database Migration
-- Smart Digital Library & Knowledge Commons (LMS)
-- Tables: library_books, library_borrow_records, library_reservations, library_e_resources
-- Indexes, RLS Multi-Tenant Policies & Triggers
-- ================================================================

-- 1. Library Books Catalog Table
CREATE TABLE IF NOT EXISTS public.library_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN (
    'computer_science', 'electronics', 'mechanical', 'civil',
    'mathematics', 'physics', 'management', 'literature', 'general'
  )),
  publisher TEXT NOT NULL,
  edition TEXT,
  call_number TEXT NOT NULL,
  shelf_location TEXT NOT NULL,
  total_copies INTEGER NOT NULL DEFAULT 1 CHECK (total_copies >= 0),
  available_copies INTEGER NOT NULL DEFAULT 1 CHECK (available_copies >= 0),
  cover_image_url TEXT,
  description TEXT,
  is_digital_available BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Library Borrow & Circulation Records Table
CREATE TABLE IF NOT EXISTS public.library_borrow_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  borrow_pass_code TEXT NOT NULL UNIQUE,
  borrowed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_date TIMESTAMPTZ NOT NULL,
  returned_at TIMESTAMPTZ,
  renewal_count INTEGER NOT NULL DEFAULT 0,
  max_renewals INTEGER NOT NULL DEFAULT 2,
  fine_amount NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
  fine_paid BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue', 'lost')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Library Book Reservations / Holds Table
CREATE TABLE IF NOT EXISTS public.library_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reservation_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'ready_for_pickup', 'fulfilled', 'cancelled', 'expired')),
  reserved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Digital E-Resources & Academic Journals Table
CREATE TABLE IF NOT EXISTS public.library_e_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('journal', 'ebook', 'research_paper', 'conference', 'thesis')),
  publisher TEXT NOT NULL,
  access_url TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  downloads_count INTEGER NOT NULL DEFAULT 0,
  is_open_access BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Performance Indexes for Query Optimization
CREATE INDEX IF NOT EXISTS idx_library_books_college_category
  ON public.library_books (college_id, category);

CREATE INDEX IF NOT EXISTS idx_library_books_isbn
  ON public.library_books (isbn);

CREATE INDEX IF NOT EXISTS idx_library_books_call_number
  ON public.library_books (call_number);

CREATE INDEX IF NOT EXISTS idx_library_borrow_records_student
  ON public.library_borrow_records (student_id, status);

CREATE INDEX IF NOT EXISTS idx_library_borrow_records_due_date
  ON public.library_borrow_records (due_date, status);

CREATE INDEX IF NOT EXISTS idx_library_reservations_student_book
  ON public.library_reservations (student_id, book_id, status);

CREATE INDEX IF NOT EXISTS idx_library_e_resources_college_type
  ON public.library_e_resources (college_id, type);

-- 6. Updated At Triggers
DROP TRIGGER IF EXISTS tr_library_books_updated_at ON public.library_books;
CREATE TRIGGER tr_library_books_updated_at
  BEFORE UPDATE ON public.library_books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_library_borrow_updated_at ON public.library_borrow_records;
CREATE TRIGGER tr_library_borrow_updated_at
  BEFORE UPDATE ON public.library_borrow_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_library_reservations_updated_at ON public.library_reservations;
CREATE TRIGGER tr_library_reservations_updated_at
  BEFORE UPDATE ON public.library_reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Row Level Security Policies (Multi-Tenant Scoping)
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_borrow_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_e_resources ENABLE ROW LEVEL SECURITY;

-- Library Books: All authenticated college members can view catalog
DROP POLICY IF EXISTS "College members can view books" ON public.library_books;
CREATE POLICY "College members can view books"
  ON public.library_books FOR SELECT
  USING (college_id = current_user_college_id());

DROP POLICY IF EXISTS "Librarians and admins can manage books" ON public.library_books;
CREATE POLICY "Librarians and admins can manage books"
  ON public.library_books FOR ALL
  USING (
    college_id = current_user_college_id() AND
    current_user_role() IN ('admin', 'faculty', 'hod')
  );

-- Borrow Records: Students can view their own loans; Staff can view all
DROP POLICY IF EXISTS "Users can view their own borrow records" ON public.library_borrow_records;
CREATE POLICY "Users can view their own borrow records"
  ON public.library_borrow_records FOR SELECT
  USING (
    student_id = auth.uid() OR
    (college_id = current_user_college_id() AND current_user_role() IN ('admin', 'faculty', 'hod'))
  );

-- Reservations: Students can create and manage their own holds
DROP POLICY IF EXISTS "Users can manage their own reservations" ON public.library_reservations;
CREATE POLICY "Users can manage their own reservations"
  ON public.library_reservations FOR ALL
  USING (
    student_id = auth.uid() OR
    (college_id = current_user_college_id() AND current_user_role() IN ('admin', 'faculty', 'hod'))
  );

-- E-Resources: Read access for all college members
DROP POLICY IF EXISTS "College members can view e-resources" ON public.library_e_resources;
CREATE POLICY "College members can view e-resources"
  ON public.library_e_resources FOR SELECT
  USING (college_id = current_user_college_id());
