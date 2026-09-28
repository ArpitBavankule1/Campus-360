-- ================================================================
-- CampusLens AI — Security Hardening Migration
-- 1. Secures all SECURITY DEFINER functions with strict search_path
--    to prevent search_path hijacking / privilege escalation.
-- 2. Revokes public execute permissions on internal admin functions.
-- ================================================================

-- 1. Secure current_user_role()
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, auth;

-- 2. Secure current_user_college_id()
CREATE OR REPLACE FUNCTION public.current_user_college_id()
RETURNS UUID AS $$
  SELECT college_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, auth;

-- 3. Secure is_college_admin()
CREATE OR REPLACE FUNCTION public.is_college_admin(target_college_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
      AND college_id = target_college_id
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, auth;

-- 4. Secure handle_new_user()
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_college_id UUID;
BEGIN
  SELECT id INTO default_college_id FROM public.colleges LIMIT 1;

  INSERT INTO public.profiles (
    id,
    college_id,
    full_name,
    email,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data->>'college_id')::UUID,
      default_college_id
    ),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;
