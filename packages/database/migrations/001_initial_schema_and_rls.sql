-- ==============================================================================
-- NALARA DATABASE MIGRATION 001: INITIAL SCHEMA & RLS POLICIES
-- Multi-role (Student, Teacher, Admin), School Org, Audit Logs, RLS
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES & ROLES (Identity & Org)
-- ------------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');

CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'student',
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar_url TEXT,
    status user_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    nisn VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.teacher_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    nip VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    grade_level VARCHAR(50) NOT NULL DEFAULT 'Kelas X',
    class_code VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.class_teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(class_id, teacher_id)
);

-- ------------------------------------------------------------------------------
-- 2. AUDIT LOGS & AI USAGE LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_resource VARCHAR(100) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    prompt_tokens INT NOT NULL DEFAULT 0,
    completion_tokens INT NOT NULL DEFAULT 0,
    total_tokens INT NOT NULL DEFAULT 0,
    latency_ms INT NOT NULL DEFAULT 0,
    model VARCHAR(100) NOT NULL,
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. INDEXES FOR HIGH-PERFORMANCE QUERIES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_class_members_class_student ON public.class_members(class_id, student_id);
CREATE INDEX IF NOT EXISTS idx_class_teachers_teacher ON public.class_teachers(teacher_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user ON public.ai_usage_logs(user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Helper security definer functions with locked search_path
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = (SELECT auth.uid());
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_teacher_of_student(target_student_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.class_members cm
    JOIN public.class_teachers ct ON ct.class_id = cm.class_id
    WHERE ct.teacher_id = (SELECT auth.uid()) 
      AND cm.student_id = target_student_id
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Profiles Policies
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Teachers can read enrolled students profiles"
    ON public.profiles FOR SELECT
    USING (public.is_teacher_of_student(user_id));

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.get_auth_role() = 'admin');

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (user_id = (SELECT auth.uid()));

-- Classrooms Policies
CREATE POLICY "Students see classrooms they belong to"
    ON public.classrooms FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.class_members 
        WHERE class_id = public.classrooms.id AND student_id = (SELECT auth.uid())
      )
    );

CREATE POLICY "Teachers see classrooms they teach"
    ON public.classrooms FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.class_teachers 
        WHERE class_id = public.classrooms.id AND teacher_id = (SELECT auth.uid())
      )
    );

CREATE POLICY "Admins full access classrooms"
    ON public.classrooms FOR ALL
    USING (public.get_auth_role() = 'admin');

-- Audit Logs Policies (Admin Only)
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    USING (public.get_auth_role() = 'admin');
