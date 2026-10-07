-- ==============================================================================
-- NALARA DATABASE MIGRATION 002: GRANULAR TEACHER ASSIGNMENTS & ACCESS CONTROL
-- Role Guru Berdasarkan Kombinasi: (Guru + Kelas + Mata Pelajaran)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SUBJECTS TABLE (Mata Pelajaran Sekolah)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    grade_level VARCHAR(50) DEFAULT 'Semua',
    category VARCHAR(50) DEFAULT 'Wajib',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Initial Subjects matching platform curriculum
INSERT INTO public.subjects (code, name, grade_level, category)
VALUES 
    ('INDO-1', 'Bahasa Indonesia', 'Kelas 1', 'Wajib'),
    ('MATH-1', 'Matematika', 'Kelas 1', 'Wajib'),
    ('IPA-1', 'IPA Terpadu (Fisika / Kimia)', 'Kelas 1', 'Wajib'),
    ('IPS-1', 'IPS Terpadu (Sosiologi / Ekonomi)', 'Kelas 1', 'Wajib'),
    ('PPKN-1', 'Pendidikan Pancasila', 'Kelas 1', 'Wajib'),
    ('INDO-2', 'Bahasa Indonesia', 'Kelas 2', 'Wajib'),
    ('MATH-2', 'Matematika Peminatan & Wajib', 'Kelas 2', 'Peminatan'),
    ('KIMIA-2', 'Kimia & Biologi', 'Kelas 2', 'Peminatan'),
    ('EKONOMI-2', 'Ekonomi & Akuntansi', 'Kelas 2', 'Peminatan'),
    ('PPKN-2', 'Pendidikan Pancasila', 'Kelas 2', 'Wajib'),
    ('INDO-3', 'Bahasa Indonesia', 'Kelas 3', 'Wajib'),
    ('MATH-3', 'Matematika', 'Kelas 3', 'Wajib'),
    ('FISIKA-3', 'Fisika Lanjutan', 'Kelas 3', 'Peminatan'),
    ('UTBK-SNBT', 'Persiapan Masuk PTN (UTBK / SNBT)', 'Kelas 3', 'Intensif'),
    ('SEKDIN-TIU', 'Persiapan Sekolah Kedinasan (SEKDIN - TIU/TPA)', 'Kelas 3', 'Kedinasan')
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. TEACHER ASSIGNMENTS TABLE (Penugasan Guru: Guru + Kelas + Mapel)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teacher_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(teacher_id, class_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_teacher_assignments_lookup 
ON public.teacher_assignments(teacher_id, class_id, subject_id);

-- ------------------------------------------------------------------------------
-- 3. LEARNING MATERIALS (Materi Pembelajaran per Kelas & Mapel)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    concept_topic VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    file_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. CLASS QUESTIONS / BANK SOAL (Bank Soal Khusus Kelas & Mapel Guru)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.class_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    concept_name VARCHAR(255) NOT NULL,
    question_text TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'medium',
    question_type VARCHAR(20) NOT NULL DEFAULT 'numeric',
    correct_answer TEXT NOT NULL,
    misconception_pattern TEXT,
    hint_level1 TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. STUDENT ATTENDANCE (Absensi Siswa per Kelas & Mapel)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'present', -- present, sick, absent, excused
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. SECURITY DEFINER HELPER FUNCTION FOR ACCESS VALIDATION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_teacher_assignment(
    p_teacher_id UUID,
    p_class_id UUID,
    p_subject_id UUID
)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.teacher_assignments ta
        WHERE ta.teacher_id = p_teacher_id
          AND ta.class_id = p_class_id
          AND ta.subject_id = p_subject_id
          AND ta.status = 'active'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- ------------------------------------------------------------------------------
-- 7. RLS POLICIES FOR GRANULAR TEACHER ACCESS
-- ------------------------------------------------------------------------------
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_attendances ENABLE ROW LEVEL SECURITY;

-- Subjects: Everyone authenticated can view active subjects
CREATE POLICY "Anyone authenticated can view subjects"
    ON public.subjects FOR SELECT
    USING (status = 'active');

CREATE POLICY "Admins full access subjects"
    ON public.subjects FOR ALL
    USING (public.get_auth_role() = 'admin');

-- Teacher Assignments:
-- Teacher can only see their own assignments
CREATE POLICY "Teachers can view own assignments"
    ON public.teacher_assignments FOR SELECT
    USING (teacher_id = (SELECT auth.uid()) OR public.get_auth_role() = 'admin');

CREATE POLICY "Admins full access assignments"
    ON public.teacher_assignments FOR ALL
    USING (public.get_auth_role() = 'admin');

-- Learning Materials:
-- Teacher can only manage materials for assigned class & subject
CREATE POLICY "Teachers can view and manage assigned materials"
    ON public.learning_materials FOR ALL
    USING (
        public.get_auth_role() = 'admin' OR 
        (teacher_id = (SELECT auth.uid()) AND public.check_teacher_assignment((SELECT auth.uid()), class_id, subject_id))
    );

-- Class Questions:
CREATE POLICY "Teachers can manage assigned questions"
    ON public.class_questions FOR ALL
    USING (
        public.get_auth_role() = 'admin' OR 
        (teacher_id = (SELECT auth.uid()) AND public.check_teacher_assignment((SELECT auth.uid()), class_id, subject_id))
    );

-- Student Attendances:
CREATE POLICY "Teachers can manage assigned attendance"
    ON public.student_attendances FOR ALL
    USING (
        public.get_auth_role() = 'admin' OR 
        (teacher_id = (SELECT auth.uid()) AND public.check_teacher_assignment((SELECT auth.uid()), class_id, subject_id))
    );
