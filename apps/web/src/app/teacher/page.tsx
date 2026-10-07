"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  BookOpen,
  CheckCircle2,
  Trash2,
  BrainCircuit,
  HelpCircle,
  Sparkles,
  Search,
  LogOut,
  GraduationCap,
  Filter,
  Users,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  UserCheck,
  Award,
  Layers,
  Send,
  Eye,
  School,
  Briefcase,
  ShieldAlert,
  ClipboardList,
  CalendarCheck,
  Check,
  Clock,
  BookMarked,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, GlowCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { supabase } from "@/lib/supabase";
import {
  TeacherAssignmentItem,
  LearningMaterialItem,
  StudentAttendanceRecord,
  getStoredAssignments,
  getStoredMaterials,
  saveStoredMaterials,
  getAssignmentsForTeacher,
  validateTeacherAccess,
  DEFAULT_ASSIGNMENTS,
  DEFAULT_MATERIALS,
} from "@/lib/assignment-service";

interface QuestionItem {
  id: string;
  subject: string;
  gradeLevel: string;
  className?: string;
  conceptName: string;
  questionText: string;
  difficulty: "easy" | "medium" | "hard";
  type: "numeric" | "mcq";
  correctAnswer: string;
  misconceptionPattern?: string;
  hintLevel1?: string;
}

interface StudentPerformance {
  id: string;
  name: string;
  email: string;
  classGroup: string;
  gradeLevel?: string;
  subjectName?: string;
  totalAnswered: number;
  correctCount: number;
  accuracyRate: number;
  masteryScore: number;
  status: "mastered" | "practicing" | "needs_attention";
  frequentMisconceptions: string[];
  lastActive: string;
  remedialAssigned?: boolean;
}

const INITIAL_STUDENTS_DATA: StudentPerformance[] = [
  {
    id: "s-1",
    name: "Andi Pratama",
    email: "andi@sekolah.sch.id",
    classGroup: "Kelas 1-A (X-A)",
    gradeLevel: "Kelas 1",
    subjectName: "Matematika",
    totalAnswered: 15,
    correctCount: 14,
    accuracyRate: 93.3,
    masteryScore: 92,
    status: "mastered",
    frequentMisconceptions: [],
    lastActive: "Baru saja",
  },
  {
    id: "s-1b",
    name: "Ahmad Rizky",
    email: "ahmad.rizky@sekolah.sch.id",
    classGroup: "Kelas 1-A (X-A)",
    gradeLevel: "Kelas 1",
    subjectName: "Matematika",
    totalAnswered: 12,
    correctCount: 6,
    accuracyRate: 50.0,
    masteryScore: 52,
    status: "needs_attention",
    frequentMisconceptions: ["POWER_AS_ADDITION (Menghitung eksponen sebagai penjumlahan)"],
    lastActive: "30 menit lalu",
  },
  {
    id: "s-2",
    name: "Doni Setiawan",
    email: "doni.s@sekolah.sch.id",
    classGroup: "Kelas 2-A (XI-A)",
    gradeLevel: "Kelas 2",
    subjectName: "Bahasa Indonesia",
    totalAnswered: 18,
    correctCount: 8,
    accuracyRate: 44.4,
    masteryScore: 48,
    status: "needs_attention",
    frequentMisconceptions: [
      "CONJUNCTION_CONFUSION (Tertukar sebab-akibat dengan urutan waktu)",
      "Salah membedakan kalimat fakta vs opini",
    ],
    lastActive: "15 menit lalu",
  },
  {
    id: "s-3",
    name: "Siti Nurhaliza",
    email: "siti.n@sekolah.sch.id",
    classGroup: "Kelas 2-A (XI-A)",
    gradeLevel: "Kelas 2",
    subjectName: "Bahasa Indonesia",
    totalAnswered: 22,
    correctCount: 19,
    accuracyRate: 86.3,
    masteryScore: 88,
    status: "mastered",
    frequentMisconceptions: [],
    lastActive: "1 jam lalu",
  },
  {
    id: "s-4",
    name: "Budi Santoso",
    email: "budi.s@sekolah.sch.id",
    classGroup: "Kelas 2-B (XI-B)",
    gradeLevel: "Kelas 2",
    subjectName: "Matematika",
    totalAnswered: 28,
    correctCount: 26,
    accuracyRate: 92.8,
    masteryScore: 94,
    status: "mastered",
    frequentMisconceptions: [],
    lastActive: "30 menit lalu",
  },
  {
    id: "s-5",
    name: "Rina Wulandari",
    email: "rina.w@sekolah.sch.id",
    classGroup: "Kelas 3-A (XII-A)",
    gradeLevel: "Kelas 3",
    subjectName: "Persiapan Sekolah Kedinasan (SEKDIN - TIU/TPA)",
    totalAnswered: 15,
    correctCount: 11,
    accuracyRate: 73.3,
    masteryScore: 72,
    status: "practicing",
    frequentMisconceptions: ["Terburu-buru pada tes ketelitian deret"],
    lastActive: "2 jam lalu",
  },
  {
    id: "s-6",
    name: "Fajar Maulana",
    email: "fajar.m@sekolah.sch.id",
    classGroup: "Kelas 2-A (XI-A)",
    gradeLevel: "Kelas 2",
    subjectName: "Matematika",
    totalAnswered: 20,
    correctCount: 9,
    accuracyRate: 45.0,
    masteryScore: 50,
    status: "needs_attention",
    frequentMisconceptions: ["SUM_OF_SIDES_DIRECTLY (Mengabaikan kuadrat rumus Pythagoras)"],
    lastActive: "3 jam lalu",
  },
];

const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: "q-1",
    subject: "Bahasa Indonesia",
    gradeLevel: "Kelas 2",
    className: "Kelas 2-A (XI-A)",
    conceptName: "Kaidah Kebahasaan & Teks Eksplanasi",
    questionText: "Tentukan konjungsi kausalitas yang tepat untuk menghubungkan sebab dan akibat pada fenomena alam!",
    difficulty: "medium",
    type: "mcq",
    correctAnswer: "Oleh karena itu",
    misconceptionPattern: "CONJUNCTION_CONFUSION",
    hintLevel1: "Perhatikan fungsi kata hubung: apakah menunjukkan urutan waktu atau hubungan sebab-akibat?",
  },
  {
    id: "q-2",
    subject: "Matematika",
    gradeLevel: "Kelas 1",
    className: "Kelas 1-A (X-A)",
    conceptName: "Eksponen & Perpangkatan",
    questionText: "Hitunglah hasil dari operasi perpangkatan berikut: 3² + 4²",
    difficulty: "medium",
    type: "numeric",
    correctAnswer: "25",
    misconceptionPattern: "POWER_AS_ADDITION (Jawaban 7)",
    hintLevel1: "Perhatikan basis dan eksponen. Apakah 3² artinya (3 + 2) atau (3 × 3)?",
  },
  {
    id: "q-3",
    subject: "Persiapan Sekolah Kedinasan (SEKDIN - TIU/TPA)",
    gradeLevel: "Kelas 3",
    className: "Kelas 3-A (XII-A)",
    conceptName: "Tes Inteligensi Umum (TIU) - Deret Angka",
    questionText: "Tentukan angka berikutnya dari pola deret: 3, 6, 12, 24, 48, ...",
    difficulty: "medium",
    type: "numeric",
    correctAnswer: "96",
    misconceptionPattern: "CONSTANT_ADDITION",
    hintLevel1: "Perhatikan rasio antar angka. Ini adalah barisan geometri perkalian 2.",
  },
  {
    id: "q-4",
    subject: "Matematika",
    gradeLevel: "Kelas 2",
    className: "Kelas 2-A (XI-A)",
    conceptName: "Trigonometri Sudut Istimewa",
    questionText: "Berapakah nilai dari sin(30°) + cos(60°)?",
    difficulty: "easy",
    type: "numeric",
    correctAnswer: "1",
    misconceptionPattern: "TRIG_VALUE_CONFUSION",
    hintLevel1: "Ingat kembali nilai sudut istimewa kuadran 1: sin 30° = 1/2 dan cos 60° = 1/2.",
  },
];

function TeacherDashboardContent() {
  const searchParams = useSearchParams();
  const loggedEmail = (searchParams.get("user") || "guru@sekolah.sch.id").toLowerCase();

  // All Assignments & Teacher Specific Assignments
  const [allAssignments, setAllAssignments] = useState<TeacherAssignmentItem[]>(DEFAULT_ASSIGNMENTS);
  const [teacherAssignments, setTeacherAssignments] = useState<TeacherAssignmentItem[]>([]);
  const [activeAssignment, setActiveAssignment] = useState<TeacherAssignmentItem | null>(null);

  // Security Access Violation State (403 Forbidden detector)
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  // Active Tab Menu
  const [activeMenu, setActiveMenu] = useState<
    "dashboard" | "materials" | "questions" | "quiz" | "grades" | "students" | "attendance"
  >("dashboard");

  // Questions State
  const [questions, setQuestions] = useState<QuestionItem[]>(INITIAL_QUESTIONS);
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [conceptName, setConceptName] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [type, setType] = useState<"numeric" | "mcq">("numeric");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [misconceptionPattern, setMisconceptionPattern] = useState("");
  const [hintLevel1, setHintLevel1] = useState("");
  const [questionSearch, setQuestionSearch] = useState("");

  // Materials State
  const [materials, setMaterials] = useState<LearningMaterialItem[]>(DEFAULT_MATERIALS);
  const [showAddMaterialForm, setShowAddMaterialForm] = useState(false);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialConcept, setMaterialConcept] = useState("");
  const [materialContent, setMaterialContent] = useState("");

  // Students & Performance State
  const [students, setStudents] = useState<StudentPerformance[]>(INITIAL_STUDENTS_DATA);
  const [studentSearch, setStudentSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "needs_attention" | "practicing" | "mastered">("all");
  const [remedialToast, setRemedialToast] = useState<string | null>(null);

  // Attendance State
  const [attendanceDate, setAttendanceDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "present" | "sick" | "absent" | "excused">>({});
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);

  // Toast / Status Message
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // 1. Initialize Assignments from Storage & Load for this teacher
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = getStoredAssignments();
      setAllAssignments(stored);

      const assigned = getAssignmentsForTeacher(loggedEmail, stored);
      setTeacherAssignments(assigned);

      if (assigned.length > 0) {
        // Check if query params specified a specific class/subject
        const reqClass = searchParams.get("class");
        const reqSubject = searchParams.get("subject");

        if (reqClass || reqSubject) {
          const validation = validateTeacherAccess({
            teacherEmail: loggedEmail,
            className: reqClass || undefined,
            subjectName: reqSubject || undefined,
            assignments: stored,
          });

          if (!validation.allowed) {
            setAccessDeniedMessage(
              `Akses Ditolak (403 Forbidden): Anda tidak memiliki hak akses untuk ${reqClass || ""} • ${reqSubject || ""}. Mengalihkan ke area tugas yang sah...`
            );
            setActiveAssignment(assigned[0]);
          } else if (validation.matchedAssignment) {
            setActiveAssignment(validation.matchedAssignment);
            setAccessDeniedMessage(null);
          }
        } else {
          setActiveAssignment(assigned[0]);
        }
      } else {
        // Teacher has no assignments yet
        setActiveAssignment(null);
      }

      // Load Materials & Questions
      setMaterials(getStoredMaterials());
      try {
        const rawQ = localStorage.getItem("nalara_custom_questions");
        if (rawQ) {
          const parsed = JSON.parse(rawQ);
          if (Array.isArray(parsed) && parsed.length > 0) setQuestions(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [loggedEmail, searchParams]);

  // Sync Live Submissions from Students
  useEffect(() => {
    const loadSubmissions = () => {
      if (typeof window === "undefined") return;
      try {
        const raw = localStorage.getItem("nalara_student_submissions");
        if (raw) {
          const liveSubmissions: StudentPerformance[] = JSON.parse(raw);
          if (liveSubmissions.length > 0) {
            const liveEmails = new Set(liveSubmissions.map((s) => s.email));
            const retainedDefaults = INITIAL_STUDENTS_DATA.filter((d) => !liveEmails.has(d.email));
            setStudents([...liveSubmissions, ...retainedDefaults]);
          }
        }
      } catch (err) {
        console.error("Error reading student submissions:", err);
      }
    };

    loadSubmissions();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nalara_student_submissions" || e.key === "nalara_custom_questions" || e.key === "nalara_teacher_assignments") {
        loadSubmissions();
        setAllAssignments(getStoredAssignments());
      }
    };
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(loadSubmissions, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Switch assignment handler
  const handleSelectAssignment = (asg: TeacherAssignmentItem) => {
    setActiveAssignment(asg);
    setAccessDeniedMessage(null);
  };

  // ===========================================================================
  // STRICT DATA FILTERING BASED ON ACTIVE ASSIGNMENT (KELAS + MAPEL)
  // ===========================================================================
  const currentClassName = activeAssignment?.className || "";
  const currentSubjectName = activeAssignment?.subjectName || "";

  // Helper normalizer for flexible string match
  const norm = (s?: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  // 1. Filtered Students: strictly in the active assignment's class
  const classStudents = students.filter((s) => {
    if (!currentClassName) return false;
    const matchClass =
      norm(s.classGroup).includes(norm(currentClassName)) ||
      norm(currentClassName).includes(norm(s.classGroup)) ||
      (currentClassName.includes("1-A") && (s.classGroup.includes("1-A") || s.classGroup.includes("X-A"))) ||
      (currentClassName.includes("2-A") && (s.classGroup.includes("2-A") || s.classGroup.includes("XI-A"))) ||
      (currentClassName.includes("2-B") && (s.classGroup.includes("2-B") || s.classGroup.includes("XI-B"))) ||
      (currentClassName.includes("3-A") && (s.classGroup.includes("3-A") || s.classGroup.includes("XII-A")));

    if (!matchClass) return false;
    if (studentSearch && !s.name.toLowerCase().includes(studentSearch.toLowerCase()) && !s.email.toLowerCase().includes(studentSearch.toLowerCase())) {
      return false;
    }
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  // 2. Filtered Questions: strictly in the active assignment's subject
  const subjectQuestions = questions.filter((q) => {
    if (!currentSubjectName) return false;
    const matchSubject =
      norm(q.subject).includes(norm(currentSubjectName)) ||
      norm(currentSubjectName).includes(norm(q.subject));
    if (!matchSubject) return false;
    if (questionSearch && !q.questionText.toLowerCase().includes(questionSearch.toLowerCase()) && !q.conceptName.toLowerCase().includes(questionSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  // 3. Filtered Materials: strictly in the active assignment's class & subject
  const assignmentMaterials = materials.filter((m) => {
    if (!currentClassName || !currentSubjectName) return false;
    const matchClass = norm(m.className).includes(norm(currentClassName)) || norm(currentClassName).includes(norm(m.className));
    const matchSubj = norm(m.subjectName).includes(norm(currentSubjectName)) || norm(currentSubjectName).includes(norm(m.subjectName));
    return matchClass && matchSubj;
  });

  // KPI Metrics for Active Assignment
  const totalClassStudents = classStudents.length;
  const avgAccuracy = totalClassStudents > 0
    ? (classStudents.reduce((acc, curr) => acc + curr.accuracyRate, 0) / totalClassStudents).toFixed(1)
    : "0.0";
  const needsAttentionCount = classStudents.filter((s) => s.status === "needs_attention").length;
  const masteredCount = classStudents.filter((s) => s.status === "mastered").length;

  // ===========================================================================
  // ADD QUESTION HANDLER (Enforces active class + subject)
  // ===========================================================================
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment || !questionText.trim() || !correctAnswer.trim()) return;

    const newQ: QuestionItem = {
      id: `q-${Date.now()}`,
      subject: activeAssignment.subjectName,
      gradeLevel: activeAssignment.gradeLevel,
      className: activeAssignment.className,
      conceptName: conceptName.trim() || "Konsep Inti",
      questionText: questionText.trim(),
      difficulty,
      type,
      correctAnswer: correctAnswer.trim(),
      misconceptionPattern: misconceptionPattern.trim() || undefined,
      hintLevel1: hintLevel1.trim() || undefined,
    };

    const updated = [newQ, ...questions];
    setQuestions(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("nalara_custom_questions", JSON.stringify(updated));
    }

    setStatusMsg(`Soal berhasil ditambahkan khusus untuk ${activeAssignment.className} • ${activeAssignment.subjectName}!`);
    setQuestionText("");
    setCorrectAnswer("");
    setMisconceptionPattern("");
    setHintLevel1("");
    setShowAddQuestionForm(false);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("nalara_custom_questions", JSON.stringify(updated));
    }
  };

  // ===========================================================================
  // ADD MATERIAL HANDLER (Calls API & verifies access)
  // ===========================================================================
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment || !materialTitle.trim() || !materialContent.trim()) return;

    try {
      // Backend authorization verification
      const res = await fetch("/api/teacher/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherEmail: loggedEmail,
          teacherName: activeAssignment.teacherName,
          classId: activeAssignment.classId,
          className: activeAssignment.className,
          subjectId: activeAssignment.subjectId,
          subjectName: activeAssignment.subjectName,
          title: materialTitle.trim(),
          conceptTopic: materialConcept.trim() || "Topik Materi",
          content: materialContent.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Gagal menyimpan materi");
      }

      const newMat: LearningMaterialItem = data.material || {
        id: `mat-${Date.now()}`,
        classId: activeAssignment.classId,
        className: activeAssignment.className,
        subjectId: activeAssignment.subjectId,
        subjectName: activeAssignment.subjectName,
        teacherEmail: loggedEmail,
        teacherName: activeAssignment.teacherName,
        title: materialTitle.trim(),
        conceptTopic: materialConcept.trim() || "Topik Materi",
        content: materialContent.trim(),
        createdAt: new Date().toISOString(),
      };

      const updated = [newMat, ...materials];
      setMaterials(updated);
      saveStoredMaterials(updated);

      setStatusMsg(`Materi '${materialTitle}' berhasil disimpan untuk ${activeAssignment.className}!`);
      setMaterialTitle("");
      setMaterialConcept("");
      setMaterialContent("");
      setShowAddMaterialForm(false);
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      setStatusMsg(`Error: ${msg}`);
    }
  };

  // ===========================================================================
  // ATTENDANCE SUBMISSION HANDLER
  // ===========================================================================
  const handleSaveAttendance = async () => {
    if (!activeAssignment) return;

    const records = classStudents.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      status: attendanceMap[s.id] || "present",
    }));

    try {
      const res = await fetch("/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherEmail: loggedEmail,
          className: activeAssignment.className,
          subjectName: activeAssignment.subjectName,
          attendanceRecords: records,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Gagal menyimpan presensi");
      }

      setAttendanceSuccess(true);
      setStatusMsg(`Presensi kelas ${activeAssignment.className} tanggal ${attendanceDate} berhasil disimpan!`);
      setTimeout(() => {
        setAttendanceSuccess(false);
        setStatusMsg(null);
      }, 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      setStatusMsg(`Error: ${msg}`);
    }
  };

  const handleAssignRemedial = (studentId: string, studentName: string) => {
    setStudents(students.map((s) => (s.id === studentId ? { ...s, remedialAssigned: true } : s)));
    setRemedialToast(`Izin remedial berhasil diberikan kepada ${studentName}! Siswa dapat mengulang kuis.`);
    setTimeout(() => setRemedialToast(null), 4000);
  };

  // ===========================================================================
  // SECURITY BARRIER: NO ASSIGNMENTS REGISTERED
  // ===========================================================================
  if (teacherAssignments.length === 0) {
    return (
      <div className="min-h-screen p-6 max-w-4xl mx-auto flex items-center justify-center">
        <Card className="p-8 text-center space-y-6 border-amber-500/40 bg-surface shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
            <ShieldAlert size={36} />
          </div>
          <div className="space-y-2">
            <Badge variant="neutral" className="text-amber-400 border-amber-500/30">
              Hak Akses Terkunci
            </Badge>
            <h2 className="text-2xl font-bold font-serif text-text">
              Belum Memiliki Penugasan Kelas &amp; Mata Pelajaran
            </h2>
            <p className="text-sm text-muted max-w-lg mx-auto">
              Akun guru Anda (<strong>{loggedEmail}</strong>) telah terdaftar di sistem, namun Admin Sekolah belum menetapkan kombinasi <strong>Kelas dan Mata Pelajaran</strong> yang Anda ampu.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-surface2 border border-border text-xs text-muted max-w-md mx-auto text-left space-y-1.5">
            <p className="font-semibold text-text">Aturan Keamanan Sistem:</p>
            <p>• Hak akses guru tidak ditentukan oleh peran guru saja, melainkan oleh kombinasi spesifik <code>Guru + Kelas + Mapel</code>.</p>
            <p>• Silakan hubungi Administrator Sekolah untuk mendapatkan penugasan mengajar.</p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Keluar</span>
            </Button>
            <a href={`/admin`}>
              <Button variant="primary">
                <span>Buka Portal Admin</span>
              </Button>
            </a>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Bar */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border shadow-md" style={{ background: "var(--surface)" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg bg-brand text-bg">
            👨‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-text">
                Portal Guru — {activeAssignment?.teacherName || "Pengajar"}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Assignment Engine
              </span>
            </div>
            <p className="text-xs text-muted">
              Akun: <span className="font-mono text-brand font-medium">{loggedEmail}</span> • Memiliki {teacherAssignments.length} Penugasan Aktif
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={handleLogout} className="text-error border-error/30 hover:bg-error/10 text-xs">
            <LogOut size={14} />
            <span>Keluar (Sign Out)</span>
          </Button>
        </div>
      </header>

      {/* 403 Forbidden Access Violation Toast */}
      {accessDeniedMessage && (
        <div className="p-4 rounded-xl border border-red-500/50 bg-red-500/15 text-red-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <ShieldAlert size={18} className="text-red-400 shrink-0" />
          <span>{accessDeniedMessage}</span>
        </div>
      )}

      {/* Status Notification Toast */}
      {statusMsg && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-lg ${statusMsg.startsWith("Error") ? "bg-red-500/15 border-red-500/40 text-red-300" : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"}`}>
          {statusMsg.startsWith("Error") ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          <span>{statusMsg}</span>
        </div>
      )}

      {remedialToast && (
        <div className="p-4 rounded-xl border border-accent/40 bg-accent/15 text-accent text-xs font-semibold flex items-center gap-2 shadow-lg">
          <Sparkles size={16} />
          <span>{remedialToast}</span>
        </div>
      )}

      {/* 2. ASSIGNMENT SELECTOR BAR (MULTI-CLASS & MULTI-SUBJECT SUPPORT) */}
      <Card className="p-4 space-y-2 border-brand/40 bg-surface">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase size={14} className="text-brand" />
            <span>Pilih Penugasan Mengajar Aktif ({teacherAssignments.length} Kelas / Mapel):</span>
          </span>
          <span className="text-[11px] text-muted italic">
            Data siswa, bank soal, dan materi akan otomatis tersinkronisasi khusus untuk penugasan terpilih.
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
          {teacherAssignments.map((asg) => {
            const isSelected = activeAssignment?.id === asg.id;
            return (
              <button
                key={asg.id}
                onClick={() => handleSelectAssignment(asg)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  isSelected
                    ? "bg-brand text-bg border-brand shadow-md scale-[1.02]"
                    : "bg-surface2 text-muted hover:text-text border-border hover:border-brand/40"
                }`}
              >
                <School size={14} />
                <span>{asg.className}</span>
                <span className="opacity-40">•</span>
                <BookOpen size={14} />
                <span>{asg.subjectName}</span>
                {isSelected && <Check size={14} className="ml-1" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 3. ACTIVE ASSIGNMENT STATUS BANNER */}
      {activeAssignment && (
        <div className="p-4 rounded-2xl bg-surface2 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand/10 border border-brand/30 text-brand">
              <BookMarked size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text uppercase">Area Tanggung Jawab:</span>
                <Badge variant="brand" className="text-xs font-bold">
                  {activeAssignment.className}
                </Badge>
                <Badge variant="accent" className="text-xs font-bold">
                  {activeAssignment.subjectName}
                </Badge>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Jenjang: {activeAssignment.gradeLevel} • Anda memiliki akses penuh untuk mengelola materi, soal, nilai, dan absensi di kelas ini.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Otorisasi Sah (200 OK)
            </span>
          </div>
        </div>
      )}

      {/* 4. TEACHER SUB-MENUS */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-2">
        <button
          onClick={() => setActiveMenu("dashboard")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
            activeMenu === "dashboard" ? "bg-brand text-bg shadow-md" : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <BarChart3 size={15} />
          <span>Dashboard &amp; KPI</span>
        </button>

        <button
          onClick={() => setActiveMenu("materials")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
            activeMenu === "materials" ? "bg-brand text-bg shadow-md" : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <BookOpen size={15} />
          <span>Materi &amp; Konsep ({assignmentMaterials.length})</span>
        </button>

        <button
          onClick={() => setActiveMenu("questions")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
            activeMenu === "questions" ? "bg-brand text-bg shadow-md" : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <Layers size={15} />
          <span>Tugas &amp; Bank Soal ({subjectQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveMenu("grades")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
            activeMenu === "grades" ? "bg-brand text-bg shadow-md" : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <Award size={15} />
          <span>Nilai &amp; Evaluasi ({classStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveMenu("students")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
            activeMenu === "students" ? "bg-brand text-bg shadow-md" : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <Users size={15} />
          <span>Daftar Siswa Kelas ({classStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveMenu("attendance")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
            activeMenu === "attendance" ? "bg-brand text-bg shadow-md" : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <CalendarCheck size={15} />
          <span>Presensi &amp; Absensi</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MENU 1: DASHBOARD & KPI RINGKASAN                                         */}
      {/* ========================================================================= */}
      {activeMenu === "dashboard" && (
        <div className="space-y-6">
          {/* KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 space-y-1 border-border">
              <span className="text-xs font-bold text-muted uppercase">Siswa Terdaftar</span>
              <div className="text-2xl font-black font-serif text-text">{totalClassStudents}</div>
              <p className="text-[10px] text-muted">Di rombel {currentClassName}</p>
            </Card>

            <Card className="p-4 space-y-1 border-border">
              <span className="text-xs font-bold text-muted uppercase">Rata-rata Akurasi</span>
              <div className="text-2xl font-black font-serif text-brand">{avgAccuracy}%</div>
              <p className="text-[10px] text-muted">Mata pelajaran {currentSubjectName}</p>
            </Card>

            <Card className="p-4 space-y-1 border-border">
              <span className="text-xs font-bold text-muted uppercase">Perlu Bimbingan</span>
              <div className="text-2xl font-black font-serif text-amber-400">{needsAttentionCount}</div>
              <p className="text-[10px] text-muted">Siswa dengan miskonsepsi aktif</p>
            </Card>

            <Card className="p-4 space-y-1 border-border">
              <span className="text-xs font-bold text-muted uppercase">Tingkat Penguasaan</span>
              <div className="text-2xl font-black font-serif text-emerald-400">{masteredCount}</div>
              <p className="text-[10px] text-muted">Siswa telah menguasai konsep</p>
            </Card>
          </div>

          {/* AI Insights & Diagnostics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-7 p-6 space-y-4 border-border">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <BrainCircuit className="text-brand w-5 h-5" />
                <h3 className="text-base font-bold font-serif text-text">
                  Deteksi Pola Miskonsepsi — {currentSubjectName}
                </h3>
              </div>

              <div className="space-y-3">
                {classStudents
                  .filter((s) => s.frequentMisconceptions.length > 0)
                  .map((s) => (
                    <div key={s.id} className="p-3.5 rounded-xl bg-surface2 border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-text">{s.name} ({s.classGroup})</span>
                        <Badge variant="neutral" className="text-[10px] text-amber-400 border-amber-500/30">
                          Perlu Remedial
                        </Badge>
                      </div>
                      <div className="text-xs text-muted space-y-1">
                        {s.frequentMisconceptions.map((m, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-amber-300">
                            <span className="text-[10px]">•</span>
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-border flex justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAssignRemedial(s.id, s.name)}
                          className="text-xs font-bold"
                        >
                          <Sparkles size={13} className="text-brand" />
                          <span>Beri Remedial</span>
                        </Button>
                      </div>
                    </div>
                  ))}

                {classStudents.filter((s) => s.frequentMisconceptions.length > 0).length === 0 && (
                  <p className="text-xs text-muted text-center py-6">
                    🎉 Tidak ada pola miskonsepsi kritis yang terdeteksi di kelas ini! Seluruh siswa berada di jalur yang baik.
                  </p>
                )}
              </div>
            </Card>

            <Card className="lg:col-span-5 p-6 space-y-4 border-border">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Sparkles className="text-accent w-5 h-5" />
                <h3 className="text-base font-bold font-serif text-text">
                  Ringkasan Penugasan
                </h3>
              </div>

              <div className="space-y-3 text-xs text-muted">
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span>Guru Pengampu:</span>
                  <span className="font-bold text-text">{activeAssignment?.teacherName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span>Kelas Aktif:</span>
                  <span className="font-bold text-brand">{currentClassName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span>Mata Pelajaran:</span>
                  <span className="font-bold text-accent">{currentSubjectName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span>Modul Pembelajaran:</span>
                  <span className="font-bold text-text">{assignmentMaterials.length} Modul</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span>Bank Soal Khusus:</span>
                  <span className="font-bold text-text">{subjectQuestions.length} Soal</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-brand/10 border border-brand/30 text-[11px] text-muted space-y-1">
                <p className="font-bold text-brand">🔒 Validasi Keamanan Multi-Layer:</p>
                <p>Setiap operasi data divalidasi pada URL, komponen, dan endpoint API backend untuk memastikan integritas data sekolah.</p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MENU 2: MATERI & KONSEP                                                   */}
      {/* ========================================================================= */}
      {activeMenu === "materials" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-text">
                Modul Materi — {currentClassName} ({currentSubjectName})
              </h2>
              <p className="text-xs text-muted">
                Kelola materi pembelajaran yang dapat diakses oleh siswa pada kelas dan mata pelajaran ini.
              </p>
            </div>

            <Button
              onClick={() => setShowAddMaterialForm(!showAddMaterialForm)}
              variant="primary"
              className="shadow-lg font-bold"
            >
              <PlusCircle size={18} />
              <span>{showAddMaterialForm ? "Tutup Form" : "+ Tambah Materi Baru"}</span>
            </Button>
          </div>

          {/* Add Material Form */}
          {showAddMaterialForm && (
            <Card className="p-6 space-y-4 border-brand/40 bg-surface">
              <h3 className="text-sm font-bold font-serif text-text flex items-center gap-2 border-b border-border pb-2">
                <BookOpen size={16} className="text-brand" />
                <span>Tambah Modul Materi untuk {currentClassName} • {currentSubjectName}</span>
              </h3>
              <form onSubmit={handleAddMaterial} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Judul Modul Materi"
                    placeholder="Contoh: Modul 1: Konsep Dasar & Kaidah Utama"
                    value={materialTitle}
                    onChange={(e) => setMaterialTitle(e.target.value)}
                    required
                  />
                  <Input
                    label="Topik / Konsep Utama"
                    placeholder="Contoh: Eksponen Dasar / Konjungsi Kausalitas"
                    value={materialConcept}
                    onChange={(e) => setMaterialConcept(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase mb-1">
                    Isi Materi &amp; Panduan Belajar
                  </label>
                  <textarea
                    rows={4}
                    value={materialContent}
                    onChange={(e) => setMaterialContent(e.target.value)}
                    placeholder="Tuliskan uraian materi, penjelasan langkah-langkah, rumus, atau konsep penting..."
                    className="w-full p-3 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                    required
                  />
                </div>
                <div className="flex justify-end pt-2 border-t border-border">
                  <Button type="submit" variant="primary">
                    <span>Simpan Modul Materi</span>
                    <CheckCircle2 size={16} />
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Material Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignmentMaterials.map((m) => (
              <Card key={m.id} className="p-5 space-y-3 border-border hover:border-brand/40 transition-colors">
                <div className="flex items-center justify-between">
                  <Badge variant="brand" className="text-[10px]">{m.conceptTopic}</Badge>
                  <span className="text-[10px] text-muted">{new Date(m.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-text">{m.title}</h4>
                  <p className="text-xs text-muted mt-2 line-clamp-3 leading-relaxed">{m.content}</p>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted">
                  <span>Dibuat oleh: {m.teacherName}</span>
                  <span className="text-brand font-semibold">{m.className}</span>
                </div>
              </Card>
            ))}

            {assignmentMaterials.length === 0 && (
              <div className="col-span-2 text-center py-12 text-muted text-xs">
                Belum ada modul materi untuk kelas dan mata pelajaran ini. Klik <strong>+ Tambah Materi Baru</strong> di atas.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MENU 3: TUGAS & BANK SOAL                                                 */}
      {/* ========================================================================= */}
      {activeMenu === "questions" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-text">
                Bank Soal — {currentSubjectName}
              </h2>
              <p className="text-xs text-muted">
                Daftar soal latihan &amp; diagnostik yang aktif untuk mata pelajaran yang Anda ampu.
              </p>
            </div>

            <Button
              onClick={() => setShowAddQuestionForm(!showAddQuestionForm)}
              variant="primary"
              className="shadow-lg font-bold"
            >
              <PlusCircle size={18} />
              <span>{showAddQuestionForm ? "Tutup Form" : "+ Buat Soal Baru"}</span>
            </Button>
          </div>

          {/* Add Question Form */}
          {showAddQuestionForm && (
            <Card className="p-6 space-y-4 border-brand/40 bg-surface">
              <h3 className="text-sm font-bold font-serif text-text flex items-center gap-2 border-b border-border pb-2">
                <Layers size={16} className="text-brand" />
                <span>Buat Soal Baru untuk {currentSubjectName} ({currentClassName})</span>
              </h3>
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Nama Konsep / Kompetensi"
                    placeholder="Contoh: Eksponen & Perpangkatan"
                    value={conceptName}
                    onChange={(e) => setConceptName(e.target.value)}
                    required
                  />
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">Tingkat Kesulitan</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                    >
                      <option value="easy">Mudah (Easy)</option>
                      <option value="medium">Sedang (Medium)</option>
                      <option value="hard">Tantangan (Hard)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">Tipe Input</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                    >
                      <option value="numeric">Numerik (Angka Pasti)</option>
                      <option value="mcq">Pilihan Ganda (MCQ)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase mb-1">Teks Pertanyaan</label>
                  <textarea
                    rows={3}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Tuliskan soal dengan jelas..."
                    className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Kunci Jawaban Benar"
                    placeholder="Contoh: 25 atau Oleh karena itu"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    required
                  />
                  <Input
                    label="Pola Miskonsepsi Siswa (Opsional)"
                    placeholder="Contoh: POWER_AS_ADDITION"
                    value={misconceptionPattern}
                    onChange={(e) => setMisconceptionPattern(e.target.value)}
                  />
                </div>

                <div>
                  <Input
                    label="Petunjuk Penalaran AI (Think First Hint)"
                    placeholder="Contoh: Coba perhatikan arti eksponen: apakah dikali atau ditambah?"
                    value={hintLevel1}
                    onChange={(e) => setHintLevel1(e.target.value)}
                  />
                </div>

                <div className="flex justify-end pt-2 border-t border-border">
                  <Button type="submit" variant="primary">
                    <span>Simpan ke Bank Soal</span>
                    <CheckCircle2 size={16} />
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Questions List */}
          <Card className="p-6 space-y-4 border-border">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-bold font-serif text-text flex items-center gap-2">
                <Layers size={16} className="text-brand" />
                <span>Daftar Soal ({subjectQuestions.length})</span>
              </h3>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Cari soal..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-border bg-surface2 text-xs outline-none focus:border-brand w-48 text-text"
                />
              </div>
            </div>

            <div className="space-y-3">
              {subjectQuestions.map((q) => (
                <div key={q.id} className="p-4 rounded-xl bg-surface2 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="brand" className="text-[10px]">{q.conceptName}</Badge>
                      <Badge variant="neutral" className="text-[10px] uppercase">{q.difficulty}</Badge>
                      <span className="text-[10px] text-muted font-mono">{q.type}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-muted hover:text-error transition-colors p-1 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-text">{q.questionText}</p>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted pt-1 border-t border-border/40">
                    <span>Kunci: <strong className="text-brand">{q.correctAnswer}</strong></span>
                    {q.misconceptionPattern && (
                      <span>Miskonsepsi: <strong className="text-amber-400">{q.misconceptionPattern}</strong></span>
                    )}
                    {q.hintLevel1 && (
                      <span className="italic">Hint: {q.hintLevel1}</span>
                    )}
                  </div>
                </div>
              ))}

              {subjectQuestions.length === 0 && (
                <p className="text-xs text-muted text-center py-8">
                  Belum ada soal pada mata pelajaran ini. Silakan buat soal baru.
                </p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MENU 4: NILAI & EVALUASI SISWA                                            */}
      {/* ========================================================================= */}
      {activeMenu === "grades" && (
        <Card className="p-6 space-y-4 border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold font-serif text-text flex items-center gap-2">
                <Award size={18} className="text-brand" />
                <span>Rekap Nilai Siswa — {currentClassName} ({currentSubjectName})</span>
              </h3>
              <p className="text-xs text-muted">
                Hanya menampilkan data evaluasi siswa yang berada di rombel ini.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-border bg-surface2 text-xs outline-none focus:border-brand text-text"
              >
                <option value="all">Semua Status</option>
                <option value="mastered">Menguasai</option>
                <option value="practicing">Berlatih</option>
                <option value="needs_attention">Perlu Bimbingan</option>
              </select>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Cari siswa..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-border bg-surface2 text-xs outline-none focus:border-brand w-48 text-text"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-3">Nama Siswa</th>
                  <th className="pb-3 px-3">Rombel</th>
                  <th className="pb-3 px-3">Soal Terjawab</th>
                  <th className="pb-3 px-3">Akurasi</th>
                  <th className="pb-3 px-3">Mastery Score</th>
                  <th className="pb-3 px-3">Status Penguasaan</th>
                  <th className="pb-3 px-3 text-right">Aksi Remedial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {classStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-surface2/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-text text-sm">{s.name}</div>
                      <div className="text-[11px] font-mono text-muted">{s.email}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant="brand" className="text-[10px]">{s.classGroup}</Badge>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-text">
                      {s.correctCount} / {s.totalAnswered}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-brand">
                      {s.accuracyRate.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 font-bold text-text">
                      <div className="flex items-center gap-2">
                        <span className="w-8">{s.masteryScore}</span>
                        <div className="w-16 bg-surface2 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-brand rounded-full"
                            style={{ width: `${s.masteryScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      {s.status === "mastered" ? (
                        <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 text-[11px] font-semibold">
                          Menguasai
                        </span>
                      ) : s.status === "needs_attention" ? (
                        <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 text-[11px] font-semibold">
                          Perlu Bimbingan
                        </span>
                      ) : (
                        <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/30 text-[11px] font-semibold">
                          Berlatih
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Button
                        size="sm"
                        variant={s.remedialAssigned ? "secondary" : "primary"}
                        onClick={() => handleAssignRemedial(s.id, s.name)}
                        className="text-[11px] font-bold"
                      >
                        {s.remedialAssigned ? "Remedial Aktif" : "Beri Remedial"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* MENU 5: DAFTAR SISWA KELAS                                                */}
      {/* ========================================================================= */}
      {activeMenu === "students" && (
        <Card className="p-6 space-y-4 border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold font-serif text-text flex items-center gap-2">
                <Users size={18} className="text-brand" />
                <span>Daftar Siswa Rombel — {currentClassName} ({classStudents.length} Siswa)</span>
              </h3>
              <p className="text-xs text-muted">
                Daftar siswa yang terdaftar secara resmi di kelas binaan Anda.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-3">Nama Lengkap</th>
                  <th className="pb-3 px-3">Email Siswa</th>
                  <th className="pb-3 px-3">Kelas &amp; Rombel</th>
                  <th className="pb-3 px-3">Status Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {classStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-surface2/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-text text-sm">{s.name}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-muted">{s.email}</td>
                    <td className="py-3.5 px-3">
                      <Badge variant="brand" className="text-[10px]">{s.classGroup}</Badge>
                    </td>
                    <td className="py-3.5 px-3 text-muted">{s.lastActive || "Aktif"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* MENU 6: PRESENSI & ABSENSI                                                */}
      {/* ========================================================================= */}
      {activeMenu === "attendance" && (
        <Card className="p-6 space-y-4 border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h3 className="text-base font-bold font-serif text-text flex items-center gap-2">
                <CalendarCheck size={18} className="text-brand" />
                <span>Presensi Kehadiran Siswa — {currentClassName}</span>
              </h3>
              <p className="text-xs text-muted">
                Catat kehadiran siswa pada jam pelajaran {currentSubjectName}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-border bg-surface2 text-xs font-semibold text-text outline-none focus:border-brand"
              />
              <Button onClick={handleSaveAttendance} variant="primary" className="text-xs font-bold">
                <Check size={15} />
                <span>Simpan Presensi</span>
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-3">Nama Siswa</th>
                  <th className="pb-3 px-3">Email</th>
                  <th className="pb-3 px-3">Status Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {classStudents.map((s) => {
                  const currentStatus = attendanceMap[s.id] || "present";
                  return (
                    <tr key={s.id} className="hover:bg-surface2/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-text text-sm">{s.name}</td>
                      <td className="py-3 px-3 font-mono text-muted">{s.email}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          {(["present", "sick", "excused", "absent"] as const).map((st) => {
                            const labels = {
                              present: "Hadir",
                              sick: "Sakit",
                              excused: "Izin",
                              absent: "Alpa",
                            };
                            const isSelected = currentStatus === st;
                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => setAttendanceMap({ ...attendanceMap, [s.id]: st })}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  isSelected
                                    ? st === "present"
                                      ? "bg-emerald-500 text-bg shadow-sm"
                                      : st === "sick"
                                      ? "bg-amber-500 text-bg shadow-sm"
                                      : st === "excused"
                                      ? "bg-blue-500 text-bg shadow-sm"
                                      : "bg-red-500 text-bg shadow-sm"
                                    : "bg-surface2 text-muted border border-border hover:text-text"
                                }`}
                              >
                                {labels[st]}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function TeacherDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Memuat Portal Guru...</div>}>
      <TeacherDashboardContent />
    </Suspense>
  );
}
