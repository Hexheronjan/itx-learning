export interface ClassroomItem {
  id: string;
  name: string;
  gradeLevel: string; // "Kelas 1", "Kelas 2", "Kelas 3", etc.
  classCode: string;
  status: "active" | "inactive";
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  gradeLevel: string; // "Kelas 1", "Kelas 2", "Kelas 3", "Semua"
  category: string; // "Wajib", "Peminatan", "Kedinasan/UTBK"
  status: "active" | "inactive";
}

export interface TeacherAssignmentItem {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  classId: string;
  className: string;
  gradeLevel: string;
  subjectId: string;
  subjectName: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface LearningMaterialItem {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherEmail: string;
  teacherName: string;
  title: string;
  conceptTopic: string;
  content: string;
  createdAt: string;
}

export interface StudentAttendanceRecord {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  studentId: string;
  studentName: string;
  teacherEmail: string;
  date: string;
  status: "present" | "sick" | "absent" | "excused";
  notes?: string;
}

export const DEFAULT_CLASSES: ClassroomItem[] = [
  { id: "cls-1a", name: "Kelas 1-A (X-A)", gradeLevel: "Kelas 1", classCode: "K1A", status: "active" },
  { id: "cls-1b", name: "Kelas 1-B (X-B)", gradeLevel: "Kelas 1", classCode: "K1B", status: "active" },
  { id: "cls-2a", name: "Kelas 2-A (XI-A)", gradeLevel: "Kelas 2", classCode: "K2A", status: "active" },
  { id: "cls-2b", name: "Kelas 2-B (XI-B)", gradeLevel: "Kelas 2", classCode: "K2B", status: "active" },
  { id: "cls-3a", name: "Kelas 3-A (XII-A)", gradeLevel: "Kelas 3", classCode: "K3A", status: "active" },
  { id: "cls-3b", name: "Kelas 3-B (XII-B)", gradeLevel: "Kelas 3", classCode: "K3B", status: "active" },
];

export const DEFAULT_SUBJECTS: SubjectItem[] = [
  { id: "sub-indo", name: "Bahasa Indonesia", code: "INDO", gradeLevel: "Semua", category: "Wajib", status: "active" },
  { id: "sub-mat", name: "Matematika", code: "MAT", gradeLevel: "Semua", category: "Wajib", status: "active" },
  { id: "sub-ipa", name: "IPA Terpadu (Fisika / Kimia)", code: "IPA", gradeLevel: "Kelas 1", category: "Wajib", status: "active" },
  { id: "sub-ips", name: "IPS Terpadu (Sosiologi / Ekonomi)", code: "IPS", gradeLevel: "Kelas 1", category: "Wajib", status: "active" },
  { id: "sub-ppkn", name: "Pendidikan Pancasila", code: "PPKN", gradeLevel: "Semua", category: "Wajib", status: "active" },
  { id: "sub-kimia", name: "Kimia & Biologi", code: "KIM-BIO", gradeLevel: "Kelas 2", category: "Peminatan", status: "active" },
  { id: "sub-ekonomi", name: "Ekonomi & Akuntansi", code: "EKO-AKT", gradeLevel: "Kelas 2", category: "Peminatan", status: "active" },
  { id: "sub-fisika", name: "Fisika Lanjutan", code: "FIS", gradeLevel: "Kelas 3", category: "Peminatan", status: "active" },
  { id: "sub-utbk", name: "Persiapan Masuk PTN (UTBK / SNBT)", code: "UTBK", gradeLevel: "Kelas 3", category: "Intensif", status: "active" },
  { id: "sub-sekdin", name: "Persiapan Sekolah Kedinasan (SEKDIN - TIU/TPA)", code: "SEKDIN", gradeLevel: "Kelas 3", category: "Kedinasan", status: "active" },
];

export const DEFAULT_ASSIGNMENTS: TeacherAssignmentItem[] = [
  {
    id: "asg-1",
    teacherId: "t-1",
    teacherName: "Dra. Sri Wahyuni",
    teacherEmail: "guru@sekolah.sch.id",
    classId: "cls-1a",
    className: "Kelas 1-A (X-A)",
    gradeLevel: "Kelas 1",
    subjectId: "sub-mat",
    subjectName: "Matematika",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "asg-2",
    teacherId: "t-1",
    teacherName: "Dra. Sri Wahyuni",
    teacherEmail: "guru@sekolah.sch.id",
    classId: "cls-2a",
    className: "Kelas 2-A (XI-A)",
    gradeLevel: "Kelas 2",
    subjectId: "sub-mat",
    subjectName: "Matematika",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "asg-3",
    teacherId: "t-0",
    teacherName: "Brio Pratama, S.Pd",
    teacherEmail: "brio@gmail.com",
    classId: "cls-2a",
    className: "Kelas 2-A (XI-A)",
    gradeLevel: "Kelas 2",
    subjectId: "sub-indo",
    subjectName: "Bahasa Indonesia",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "asg-4",
    teacherId: "t-0",
    teacherName: "Brio Pratama, S.Pd",
    teacherEmail: "brio@gmail.com",
    classId: "cls-1a",
    className: "Kelas 1-A (X-A)",
    gradeLevel: "Kelas 1",
    subjectId: "sub-indo",
    subjectName: "Bahasa Indonesia",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "asg-5",
    teacherId: "t-2",
    teacherName: "Ahmad Fauzi, S.Pd",
    teacherEmail: "guru.indo@sekolah.sch.id",
    classId: "cls-1b",
    className: "Kelas 1-B (X-B)",
    gradeLevel: "Kelas 1",
    subjectId: "sub-indo",
    subjectName: "Bahasa Indonesia",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "asg-6",
    teacherId: "t-3",
    teacherName: "Bambang Sudarmono, M.Si",
    teacherEmail: "guru.sekdin@sekolah.sch.id",
    classId: "cls-3a",
    className: "Kelas 3-A (XII-A)",
    gradeLevel: "Kelas 3",
    subjectId: "sub-sekdin",
    subjectName: "Persiapan Sekolah Kedinasan (SEKDIN - TIU/TPA)",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "asg-2b",
    teacherId: "t-1",
    teacherName: "Dra. Sri Wahyuni",
    teacherEmail: "guru@sekolah.sch.id",
    classId: "cls-3a",
    className: "Kelas 3-A (XII-A)",
    gradeLevel: "Kelas 3",
    subjectId: "sub-mat",
    subjectName: "Matematika",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "asg-7",
    teacherId: "t-4",
    teacherName: "Dr. Hendra Wijaya, M.Si",
    teacherEmail: "guru.kimia@sekolah.sch.id",
    classId: "cls-2a",
    className: "Kelas 2-A (XI-A)",
    gradeLevel: "Kelas 2",
    subjectId: "sub-kimia",
    subjectName: "Kimia & Biologi",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "asg-8",
    teacherId: "t-5",
    teacherName: "Siti Rahayu, S.E, M.Ak",
    teacherEmail: "guru.ekonomi@sekolah.sch.id",
    classId: "cls-2a",
    className: "Kelas 2-A (XI-A)",
    gradeLevel: "Kelas 2",
    subjectId: "sub-ekonomi",
    subjectName: "Ekonomi & Akuntansi",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_MATERIALS: LearningMaterialItem[] = [
  {
    id: "mat-1",
    classId: "cls-1a",
    className: "Kelas 1-A (X-A)",
    subjectId: "sub-mat",
    subjectName: "Matematika",
    teacherEmail: "guru@sekolah.sch.id",
    teacherName: "Dra. Sri Wahyuni",
    title: "Modul 1: Eksponen & Logaritma Dasar",
    conceptTopic: "Eksponen & Perpangkatan",
    content: "Pembahasan sifat-sifat eksponen: perkalian pangkat, pembagian pangkat, dan pangkat nol/negatif.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mat-2",
    classId: "cls-2a",
    className: "Kelas 2-A (XI-A)",
    subjectId: "sub-indo",
    subjectName: "Bahasa Indonesia",
    teacherEmail: "brio@gmail.com",
    teacherName: "Brio Pratama, S.Pd",
    title: "Modul 2: Struktur & Kaidah Teks Eksplanasi",
    conceptTopic: "Teks Eksplanasi & Konjungsi Kausalitas",
    content: "Menganalisis hubungan sebab akibat fenomena alam dan sosial menggunakan konjungsi kausalitas yang tepat.",
    createdAt: new Date().toISOString(),
  },
];

const STORAGE_KEYS = {
  CLASSES: "nalara_classes",
  SUBJECTS: "nalara_subjects",
  ASSIGNMENTS: "nalara_teacher_assignments",
  MATERIALS: "nalara_learning_materials",
  ATTENDANCE: "nalara_student_attendance",
};

// Client-safe storage getter
export function getStoredClasses(): ClassroomItem[] {
  if (typeof window === "undefined") return DEFAULT_CLASSES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASSES);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(DEFAULT_CLASSES));
  } catch (err) {
    console.error("Error reading classes:", err);
  }
  return DEFAULT_CLASSES;
}

export function saveStoredClasses(classes: ClassroomItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  } catch (err) {
    console.error("Error saving classes:", err);
  }
}

export function getStoredSubjects(): SubjectItem[] {
  if (typeof window === "undefined") return DEFAULT_SUBJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(DEFAULT_SUBJECTS));
  } catch (err) {
    console.error("Error reading subjects:", err);
  }
  return DEFAULT_SUBJECTS;
}

export function saveStoredSubjects(subjects: SubjectItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  } catch (err) {
    console.error("Error saving subjects:", err);
  }
}

export function getStoredAssignments(): TeacherAssignmentItem[] {
  if (typeof window === "undefined") return DEFAULT_ASSIGNMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(DEFAULT_ASSIGNMENTS));
  } catch (err) {
    console.error("Error reading assignments:", err);
  }
  return DEFAULT_ASSIGNMENTS;
}

export function saveStoredAssignments(assignments: TeacherAssignmentItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  } catch (err) {
    console.error("Error saving assignments:", err);
  }
}

export function getStoredMaterials(): LearningMaterialItem[] {
  if (typeof window === "undefined") return DEFAULT_MATERIALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(DEFAULT_MATERIALS));
  } catch (err) {
    console.error("Error reading materials:", err);
  }
  return DEFAULT_MATERIALS;
}

export function saveStoredMaterials(materials: LearningMaterialItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  } catch (err) {
    console.error("Error saving materials:", err);
  }
}

/**
 * Filter assignments specifically assigned to a teacher
 */
export function getAssignmentsForTeacher(
  teacherEmail: string,
  assignments: TeacherAssignmentItem[] = DEFAULT_ASSIGNMENTS
): TeacherAssignmentItem[] {
  if (!teacherEmail) return [];
  const cleanEmail = teacherEmail.trim().toLowerCase();
  return assignments.filter(
    (a) => a.teacherEmail.trim().toLowerCase() === cleanEmail && a.status === "active"
  );
}

/**
 * Check and validate whether teacher has access to (Class + Subject)
 */
export function validateTeacherAccess(params: {
  teacherEmail: string;
  classId?: string;
  className?: string;
  subjectId?: string;
  subjectName?: string;
  assignments?: TeacherAssignmentItem[];
}): { allowed: boolean; reason?: string; matchedAssignment?: TeacherAssignmentItem } {
  const { teacherEmail, classId, className, subjectId, subjectName } = params;
  const assignments = params.assignments || (typeof window !== "undefined" ? getStoredAssignments() : DEFAULT_ASSIGNMENTS);

  if (!teacherEmail) {
    return { allowed: false, reason: "Identitas guru tidak valid atau belum terautentikasi." };
  }

  const cleanEmail = teacherEmail.trim().toLowerCase();

  // Admin has universal override access
  if (cleanEmail.includes("admin")) {
    return {
      allowed: true,
      matchedAssignment: assignments[0],
    };
  }

  const teacherAssignments = assignments.filter(
    (a) => a.teacherEmail.trim().toLowerCase() === cleanEmail && a.status === "active"
  );

  if (teacherAssignments.length === 0) {
    return {
      allowed: false,
      reason: "Anda belum memiliki penugasan kelas atau mata pelajaran aktif dari Admin.",
    };
  }

  // Helper normalizer for class names (e.g. "Kelas 1-A (X-A)" vs "Kelas 1-A" vs "Kelas X-A")
  const normalize = (str?: string) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  const matched = teacherAssignments.find((a) => {
    // Check class match
    const classMatch =
      (!classId && !className) ||
      (classId && a.classId === classId) ||
      (className && (normalize(a.className).includes(normalize(className)) || normalize(className).includes(normalize(a.className))));

    // Check subject match
    const subjectMatch =
      (!subjectId && !subjectName) ||
      (subjectId && a.subjectId === subjectId) ||
      (subjectName && (normalize(a.subjectName).includes(normalize(subjectName)) || normalize(subjectName).includes(normalize(a.subjectName))));

    return classMatch && subjectMatch;
  });

  if (!matched) {
    return {
      allowed: false,
      reason: "Akses ditolak: Anda tidak memiliki hak akses untuk mengelola kelas dan mata pelajaran ini. Silakan hubungi Admin Sekolah.",
    };
  }

  return {
    allowed: true,
    matchedAssignment: matched,
  };
}
