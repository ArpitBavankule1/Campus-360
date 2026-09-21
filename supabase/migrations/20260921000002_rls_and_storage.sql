-- ================================================================
-- CampusLens AI — Phase 2: Row Level Security & Storage Setup
-- Security: Multi-tenant College isolation + Role-based permissions
-- Storage: 'avatars', 'college-logos', 'documents'
-- ================================================================

-- ================================================================
-- 1. Enable Row Level Security (RLS)
-- ================================================================
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- 2. Helper Security Functions
-- ================================================================

-- Get current authenticated user's profile role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Get current authenticated user's college_id
CREATE OR REPLACE FUNCTION public.current_user_college_id()
RETURNS UUID AS $$
  SELECT college_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current user is an admin of a given college
CREATE OR REPLACE FUNCTION public.is_college_admin(target_college_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
      AND college_id = target_college_id
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ================================================================
-- 3. RLS Policies: Colleges
-- ================================================================

-- Allow anyone (public/authenticated) to read colleges for registration & directory
DROP POLICY IF EXISTS "Colleges are publicly readable" ON public.colleges;
CREATE POLICY "Colleges are publicly readable"
  ON public.colleges
  FOR SELECT
  USING (true);

-- Only college admin can update their own college details
DROP POLICY IF EXISTS "Admins can update their college" ON public.colleges;
CREATE POLICY "Admins can update their college"
  ON public.colleges
  FOR UPDATE
  TO authenticated
  USING (public.is_college_admin(id))
  WITH CHECK (public.is_college_admin(id));

-- Only superadmins/service_role can insert new colleges
-- (Regular signups cannot create colleges)

-- ================================================================
-- 4. RLS Policies: Departments
-- ================================================================

-- Allow reading departments of colleges
DROP POLICY IF EXISTS "Departments are readable by all" ON public.departments;
CREATE POLICY "Departments are readable by all"
  ON public.departments
  FOR SELECT
  USING (true);

-- Admins and HODs of the college can manage departments
DROP POLICY IF EXISTS "Admins and HODs can insert departments" ON public.departments;
CREATE POLICY "Admins and HODs can insert departments"
  ON public.departments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_college_admin(college_id) OR
    (public.current_user_role() = 'hod' AND public.current_user_college_id() = college_id)
  );

DROP POLICY IF EXISTS "Admins and HODs can update departments" ON public.departments;
CREATE POLICY "Admins and HODs can update departments"
  ON public.departments
  FOR UPDATE
  TO authenticated
  USING (
    public.is_college_admin(college_id) OR
    (public.current_user_role() = 'hod' AND public.current_user_college_id() = college_id)
  )
  WITH CHECK (
    public.is_college_admin(college_id) OR
    (public.current_user_role() = 'hod' AND public.current_user_college_id() = college_id)
  );

DROP POLICY IF EXISTS "Admins can delete departments" ON public.departments;
CREATE POLICY "Admins can delete departments"
  ON public.departments
  FOR DELETE
  TO authenticated
  USING (public.is_college_admin(college_id));

-- ================================================================
-- 5. RLS Policies: Profiles
-- ================================================================

-- Users can view their own profile OR profiles belonging to the same college
DROP POLICY IF EXISTS "Users can read same-college profiles" ON public.profiles;
CREATE POLICY "Users can read same-college profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    college_id = public.current_user_college_id()
  );

-- Users can insert their own profile during registration
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    id = auth.uid()
  );

-- Users can update their own profile, or college admins can update members
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() OR
    public.is_college_admin(college_id)
  )
  WITH CHECK (
    (id = auth.uid() AND (role = public.current_user_role())) -- Regular users cannot escalate their own role
    OR public.is_college_admin(college_id)
  );

-- Only college admin or the user can delete profile
DROP POLICY IF EXISTS "Users or admins can delete profile" ON public.profiles;
CREATE POLICY "Users or admins can delete profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (
    id = auth.uid() OR
    public.is_college_admin(college_id)
  );

-- ================================================================
-- 6. Supabase Storage Setup (Buckets & Policies)
-- ================================================================

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('college-logos', 'college-logos', true),
  ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Public can view avatars
DROP POLICY IF EXISTS "Avatars are publicly viewable" ON storage.objects;
CREATE POLICY "Avatars are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Authenticated users can upload their own avatar into folder matching their uid
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can update/delete their own avatar
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
