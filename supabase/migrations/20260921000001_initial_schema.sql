-- ================================================================
-- CampusLens AI — Phase 2: Initial Database Schema Migration
-- Tables: colleges, departments, profiles
-- Enums: user_role
-- Functions: handle_updated_at, handle_new_user
-- ================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Types & Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('student', 'faculty', 'hod', 'admin');
  END IF;
END $$;

-- 3. Utility Function: Updated At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 4. Colleges Table
-- ================================================================
CREATE TABLE IF NOT EXISTS public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- College trigger for updated_at
DROP TRIGGER IF EXISTS tr_colleges_updated_at ON public.colleges;
CREATE TRIGGER tr_colleges_updated_at
  BEFORE UPDATE ON public.colleges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- 5. Departments Table
-- ================================================================
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  building TEXT,
  room_number TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_college_department_code UNIQUE (college_id, code)
);

-- Department trigger for updated_at
DROP TRIGGER IF EXISTS tr_departments_updated_at ON public.departments;
CREATE TRIGGER tr_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- 6. Profiles Table (Linked to auth.users)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  student_id TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  year INTEGER CHECK (year >= 1 AND year <= 5),
  division TEXT,
  role user_role NOT NULL DEFAULT 'student'::user_role,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profile trigger for updated_at
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- 7. Performance Indexes
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_colleges_code ON public.colleges (code);
CREATE INDEX IF NOT EXISTS idx_colleges_city ON public.colleges (city);
CREATE INDEX IF NOT EXISTS idx_departments_college_id ON public.departments (college_id);
CREATE INDEX IF NOT EXISTS idx_departments_code ON public.departments (code);
CREATE INDEX IF NOT EXISTS idx_profiles_college_id ON public.profiles (college_id);
CREATE INDEX IF NOT EXISTS idx_profiles_department_id ON public.profiles (department_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON public.profiles (college_id, student_id);

-- ================================================================
-- 8. Auth Trigger for Automatic Profile Creation (Optional sync from auth)
-- ================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_college_id UUID;
  v_role user_role;
BEGIN
  -- Extract college_id from metadata, or fallback to first college if not passed
  IF (NEW.raw_user_meta_data->>'college_id') IS NOT NULL THEN
    v_college_id := (NEW.raw_user_meta_data->>'college_id')::UUID;
  ELSE
    SELECT id INTO v_college_id FROM public.colleges LIMIT 1;
  END IF;

  -- Extract role or default to 'student'
  IF (NEW.raw_user_meta_data->>'role') IS NOT NULL THEN
    v_role := (NEW.raw_user_meta_data->>'role')::user_role;
  ELSE
    v_role := 'student'::user_role;
  END IF;

  IF v_college_id IS NOT NULL THEN
    INSERT INTO public.profiles (
      id,
      college_id,
      full_name,
      email,
      student_id,
      department_id,
      year,
      division,
      role,
      avatar_url
    ) VALUES (
      NEW.id,
      v_college_id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
      NEW.email,
      NEW.raw_user_meta_data->>'student_id',
      (NEW.raw_user_meta_data->>'department_id')::UUID,
      (NEW.raw_user_meta_data->>'year')::INTEGER,
      NEW.raw_user_meta_data->>'division',
      v_role,
      NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger hook on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
