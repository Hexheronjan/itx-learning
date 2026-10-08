"use client";

import React, { useState, useEffect } from "react";
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
  ArrowUpRight,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, GlowCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { supabase } from "@/lib/supabase";

interface QuestionItem {
  id: string;
  subject: string;
  gradeLevel: string;
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
  accuracyRate: number; // in percentage
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
    classGroup: "Kelas XI-A",
    totalAnswered: 2,
    correctCount: 2,
    accuracyRate: 100,
    masteryScore: 92,
    status: "mastered",
    frequentMisconceptions: [],
    lastActive: "Baru saja (Selesai Kuis Bahasa Indonesia)",
  },
  {
    id: "s-2",
    name: "Doni Setiawan",
    email: "doni.s@sekolah.sch.id",
    classGroup: "Kelas XI-A",
    totalAnswered: 18,
    correctCount: 8,
    accuracyRate: 44.4,
    masteryScore: 48,
    status: "needs_attention",
    frequentMisconceptions: [
      "CONJUNCTION_CONFUSION (Tertukar sebab-akibat dengan kronologis)",
      "Salah membedakan kalimat fakta vs opini",
    ],
    lastActive: "15 menit lalu",
  },
  {
    id: "s-3",
    name: "Siti Nurhaliza",
    email: "siti.n@sekolah.sch.id",
    classGroup: "Kelas XI-A",
    totalAnswered: 22,
    correctCount: 12,
    accuracyRate: 54.5,
    masteryScore: 56,
    status: "needs_attention",
    frequentMisconceptions: [
      "POWER_AS_ADDITION (Menghitung eksponen sebagai penjumlahan)",
      "Kurang teliti pada tanda minus aljabar",
    ],
    lastActive: "1 jam lalu",
  },
  {
    id: "s-4",
    name: "Budi Santoso",
    email: "budi.s@sekolah.sch.id",
    classGroup: "Kelas XI-B",
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
    classGroup: "Kelas XI-B",
    totalAnswered: 15,
    correctCount: 11,
    accuracyRate: 73.3,
    masteryScore: 72,
    status: "practicing",
    frequentMisconceptions: ["Terburu-buru pada soal teks bacaan panjang"],
    lastActive: "2 jam lalu",
  },
  {
    id: "s-6",
    name: "Fajar Maulana",
    email: "fajar.m@sekolah.sch.id",
    classGroup: "Kelas XI-A",
    totalAnswered: 20,
    correctCount: 9,
    accuracyRate: 45.0,
    masteryScore: 50,
    status: "needs_attention",
    frequentMisconceptions: [
      "SUM_OF_SIDES_DIRECTLY (Mengabaikan kuadrat rumus Pythagoras)",
    ],
    lastActive: "3 jam lalu",
  },
];

const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: "q-1",
    subject: "Bahasa Indonesia",
    gradeLevel: "Kelas XI (Kelas 2 SMA)",
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
    gradeLevel: "Kelas X (Kelas 1 SMA)",
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
    subject: "Persiapan Sekolah Kedinasan (SEKDIN)",
    gradeLevel: "Persiapan Kedinasan (SEKDIN - STAN/STIS)",
    conceptName: "Tes Inteligensi Umum (TIU) - Deret Angka",
    questionText: "Tentukan angka berikutnya dari pola deret: 3, 6, 12, 24, 48, ...",
    difficulty: "medium",
    type: "numeric",
    correctAnswer: "96",
    misconceptionPattern: "CONSTANT_ADDITION",
    hintLevel1: "Perhatikan rasio antar angka. Ini adalah barisan geometri perkalian 2.",
  },
];

function TeacherQuestionsContent() {
  const searchParams = useSearchParams();

  // Teacher Profile Session State
  const [loggedEmail, setLoggedEmail] = useState("guru@sekolah.sch.id");
  const [teacherName, setTeacherName] = useState("Dra. Sri Wahyuni");
  const [teacherType, setTeacherType] = useState<"subject" | "homeroom" | "both">("both");
  const [defaultSubject, setDefaultSubject] = useState("Matematika");
  const [homeroomClass, setHomeroomClass] = useState("Kelas XI-A");
  const [defaultGrade, setDefaultGrade] = useState("Kelas X & XI");

  // Mode Switcher: "subject" (Guru Mapel) or "homeroom" (Wali Kelas)
  const [viewMode, setViewMode] = useState<"subject" | "homeroom">("homeroom");

  // Dashboard Active Tab: 'analytics' (Pantauan Siswa) or 'bank' (Bank Soal)
  const [activeTab, setActiveTab] = useState<"analytics" | "bank">("analytics");

  // Load Session from Supabase
  useEffect(() => {
    async function loadTeacherSession() {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const u = data.session.user;
        const meta = u.user_metadata || {};
        const email = u.email || "guru@sekolah.sch.id";
        setLoggedEmail(email);

        const isBrio = email.toLowerCase().includes("brio") || meta.full_name?.includes("Brio");
        const name = meta.full_name || (isBrio ? "Brio Pratama, S.Pd" : "Dra. Sri Wahyuni");
        const type = meta.teacher_type || (isBrio ? "both" : "subject");
        const subj = meta.subject || (isBrio ? "Bahasa Indonesia" : "Matematika");
        const hrClass = meta.homeroom_class || "Kelas XI-A";
        const grade = meta.grade_level || "Kelas XI (Kelas 2 SMA)";

        setTeacherName(name);
        setTeacherType(type);
        setDefaultSubject(subj);
        setHomeroomClass(hrClass);
        setDefaultGrade(grade);

        if (type === "homeroom" || type === "both" || isBrio) {
          setViewMode("homeroom");
        } else {
          setViewMode("subject");
        }
      }
    }
    loadTeacherSession();
  }, []);

  const isBrio = loggedEmail.toLowerCase().includes("brio");

  // Questions & Form State
  const [questions, setQuestions] = useState<QuestionItem[]>(INITIAL_QUESTIONS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("Semua");

  // Students Performance State & Class Filter
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("Kelas XI-A");
  const [students, setStudents] = useState<StudentPerformance[]>(INITIAL_STUDENTS_DATA);
  const [studentSearch, setStudentSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "needs_attention" | "practicing" | "mastered">("all");
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentPerformance | null>(null);
  const [remedialToast, setRemedialToast] = useState<string | null>(null);

  // Form State
  const [subject, setSubject] = useState(defaultSubject);
  const [gradeLevel, setGradeLevel] = useState(defaultGrade);
  const [conceptName, setConceptName] = useState(isBrio ? "Teks Argumentasi & Kebahasaan" : "Eksponen & Perpangkatan");
  const [questionText, setQuestionText] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [type, setType] = useState<"numeric" | "mcq">("numeric");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [misconceptionPattern, setMisconceptionPattern] = useState("");
  const [hintLevel1, setHintLevel1] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setSubject(defaultSubject);
    setGradeLevel(defaultGrade);
    setSelectedClassFilter(isBrio ? "Kelas XI" : "Kelas X");
  }, [defaultSubject, defaultGrade, isBrio]);

  // Load Custom Questions from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawQ = localStorage.getItem("nalara_custom_questions");
        if (rawQ) {
          const parsed = JSON.parse(rawQ);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuestions(parsed);
          }
        }
      } catch (err) {
        console.error("Error reading custom questions:", err);
      }
    }
  }, []);

  // Real-Time Live Sync: Load Submissions from Real Students instantly across tabs/devices
  useEffect(() => {
    const loadSubmissions = () => {
      if (typeof window === "undefined") return;
      try {
        const raw = localStorage.getItem("nalara_student_submissions");
        if (raw) {
          const liveSubmissions: StudentPerformance[] = JSON.parse(raw);
          if (liveSubmissions.length > 0) {
            // Merge live with defaults
            const liveEmails = new Set(liveSubmissions.map((s) => s.email));
            const retainedDefaults = INITIAL_STUDENTS_DATA.filter((d) => !liveEmails.has(d.email));
            setStudents([...liveSubmissions, ...retainedDefaults]);
          }
        }
      } catch (err) {
        console.error("Error reading student submissions:", err);
      }
    };

    // 1. Initial Load
    loadSubmissions();

    // 2. Cross-tab Storage Event Listener (instant sync when student submits in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nalara_student_submissions" || e.key === "nalara_custom_questions") {
        loadSubmissions();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // 3. Periodic Pulse Polling (every 1.5 seconds for instant real-time reflection)
    const interval = setInterval(loadSubmissions, 1500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !correctAnswer.trim()) return;

    const newQ: QuestionItem = {
      id: `q-${Date.now()}`,
      subject,
      gradeLevel,
      conceptName: conceptName.trim() || "Konsep Umum",
      questionText: questionText.trim(),
      difficulty,
      type,
      correctAnswer: correctAnswer.trim(),
      misconceptionPattern: misconceptionPattern.trim() || undefined,
      hintLevel1: hintLevel1.trim() || undefined,
    };

    const updatedQuestions = [newQ, ...questions];
    setQuestions(updatedQuestions);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("nalara_custom_questions", JSON.stringify(updatedQuestions));
      } catch (err) {
        console.error("Error saving custom question:", err);
      }
    }

    setSaveSuccess(true);
    setQuestionText("");
    setCorrectAnswer("");
    setMisconceptionPattern("");
    setHintLevel1("");

    setTimeout(() => {
      setSaveSuccess(false);
      setShowAddForm(false);
    }, 1500);
  };

  const handleDelete = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("nalara_custom_questions", JSON.stringify(updated));
      } catch (err) {
        console.error("Error saving custom questions:", err);
      }
    }
  };

  const handleAssignRemedial = (studentId: string, studentName: string) => {
    setStudents(
      students.map((s) => (s.id === studentId ? { ...s, remedialAssigned: true } : s))
    );

    // Persist remedial permission for this student
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("nalara_remedial_permissions");
        const perms: Record<string, boolean> = raw ? JSON.parse(raw) : {};
        const targetStudent = students.find((s) => s.id === studentId);
        if (targetStudent) {
          perms[targetStudent.email] = true;
          localStorage.setItem("nalara_remedial_permissions", JSON.stringify(perms));
        }
      } catch (err) {
        console.error("Error saving remedial permission:", err);
      }
    }

    setRemedialToast(`Izin remedial berhasil diberikan! Siswa ${studentName} sekarang dapat mengulang latihan soal.`);
    setTimeout(() => setRemedialToast(null), 4000);
  };

  // Filtered Students by Class/Grade + Search + Status
  const filteredStudents = students.filter((s) => {
    // 1. Grade/Class filter
    if (selectedClassFilter !== "all") {
      const matchGrade =
        (selectedClassFilter === "Kelas XI" && (s.classGroup.includes("XI") || s.gradeLevel?.includes("11") || s.gradeLevel?.includes("XI"))) ||
        (selectedClassFilter === "Kelas X" && (s.classGroup.includes("X-") || s.classGroup === "Kelas X-A" || s.gradeLevel?.includes("10") || s.gradeLevel?.includes("Fase E"))) ||
        (selectedClassFilter === "Kelas XII" && (s.classGroup.includes("XII") || s.gradeLevel?.includes("12") || s.gradeLevel?.includes("XII") || s.gradeLevel?.includes("Fase F Lanjutan"))) ||
        (selectedClassFilter === "Kedinasan & UTBK" && (s.classGroup.includes("SEKDIN") || s.classGroup.includes("UTBK") || s.gradeLevel?.includes("Kedinasan") || s.gradeLevel?.includes("UTBK")));
      
      if (!matchGrade) return false;
    }

    // 2. Search query
    const matchQuery =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.classGroup.toLowerCase().includes(studentSearch.toLowerCase());

    if (!matchQuery) return false;
    if (statusFilter === "all") return true;
    return s.status === statusFilter;
  });

  // Summary Metrics based on current filter
  const totalStudents = filteredStudents.length;
  const needsAttentionCount = filteredStudents.filter((s) => s.status === "needs_attention").length;
  const avgAccuracy = totalStudents > 0
    ? (filteredStudents.reduce((acc, curr) => acc + curr.accuracyRate, 0) / totalStudents).toFixed(1)
    : "0.0";
  const masteredCount = filteredStudents.filter((s) => s.status === "mastered").length;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header Bar with Dual Role Switcher */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl border border-border shadow-md" style={{ background: "var(--surface)" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg bg-brand text-bg">
            {viewMode === "homeroom" ? "🏫" : "👨‍🏫"}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold font-serif text-text">
                Portal Guru — {teacherName}
              </h1>
              {viewMode === "homeroom" ? (
                <Badge variant="accent" className="text-[10px] uppercase font-bold">
                  Wali Kelas {homeroomClass}
                </Badge>
              ) : (
                <Badge variant="brand" className="text-[10px] uppercase font-bold">
                  Guru Mapel {defaultSubject}
                </Badge>
              )}
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Real-Time
              </span>
            </div>
            <p className="text-xs text-muted">
              Akun Guru ({loggedEmail}) • {defaultGrade}
            </p>
          </div>
        </div>

        {/* Mode Switcher Pill Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {(teacherType === "both" || teacherType === "homeroom" || isBrio) && (
            <div className="flex items-center p-1 rounded-xl bg-surface2 border border-border text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode("homeroom")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === "homeroom"
                    ? "bg-accent text-white shadow-md font-bold"
                    : "text-muted hover:text-text"
                }`}
              >
                <School size={14} />
                <span>Mode Wali Kelas</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("subject")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === "subject"
                    ? "bg-brand text-bg shadow-md font-bold"
                    : "text-muted hover:text-text"
                }`}
              >
                <BookOpen size={14} />
                <span>Mode Guru Mapel</span>
              </button>
            </div>
          )}

          <Button size="sm" variant="secondary" onClick={handleLogout} className="text-error border-error/30 hover:bg-error/10 text-xs">
            <LogOut size={14} />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </header>

      {/* 2. Navigation Tabs: Analisis Murid vs Bank Soal */}
      <div className="flex items-center gap-3 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === "analytics"
              ? "bg-brand text-bg shadow-md"
              : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <BarChart3 size={16} />
          <span>📊 Analisis &amp; Pemantauan Nilai Siswa</span>
          {needsAttentionCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-error text-white text-[10px] font-bold">
              {needsAttentionCount} Perlu Perhatian
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("bank")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === "bank"
              ? "bg-brand text-bg shadow-md"
              : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <BookOpen size={16} />
          <span>📝 Kelola Bank Soal ({questions.length})</span>
        </button>
      </div>

      {/* Toast Alert for Remedial Assignment */}
      <AnimatePresence>
        {remedialToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{remedialToast}</span>
            </div>
            <button onClick={() => setRemedialToast(null)} className="text-muted hover:text-text">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* TAB 1: STUDENT ANALYTICS & INTERVENTION MONITORING                        */}
      {/* ========================================================================= */}
      {activeTab === "analytics" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 space-y-1 border-border">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-semibold">Total Siswa Aktif</span>
                <Users size={16} className="text-brand" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-serif text-text">
                {totalStudents} <span className="text-xs font-normal text-muted">Siswa</span>
              </div>
              <p className="text-[11px] text-muted">Terdaftar di kelas {defaultGrade}</p>
            </Card>

            <Card className="p-5 space-y-1 border-border">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-semibold">Rata-Rata Tingkat Kebenaran</span>
                <TrendingUp size={16} className="text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-serif text-emerald-400">
                {avgAccuracy}%
              </div>
              <p className="text-[11px] text-muted">Akurasi pengerjaan seluruh siswa</p>
            </Card>

            <Card className="p-5 space-y-1 border-red-500/30 bg-red-950/10">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-bold text-red-400">Perlu Perhatian (Intervensi)</span>
                <AlertTriangle size={16} className="text-red-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-serif text-red-400">
                {needsAttentionCount} <span className="text-xs font-normal text-muted">Siswa</span>
              </div>
              <p className="text-[11px] text-red-300/80">Skor penguasaan di bawah 60%</p>
            </Card>

            <Card className="p-5 space-y-1 border-brand/30 bg-brand/5">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-bold text-brand">Sudah Menguasai (Mastered)</span>
                <Award size={16} className="text-brand" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-serif text-brand">
                {masteredCount} <span className="text-xs font-normal text-muted">Siswa</span>
              </div>
              <p className="text-[11px] text-muted">Skor penguasaan di atas 85%</p>
            </Card>
          </div>

          {/* Concept Heatmap & Topic Mastery Alert */}
          <GlowCard className="p-6 space-y-4 border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h2 className="text-lg font-bold font-serif text-text flex items-center gap-2">
                  <BrainCircuit size={18} className="text-brand" />
                  <span>Peta Penguasaan Materi Kelas ({defaultSubject})</span>
                </h2>
                <p className="text-xs text-muted">
                  Sistem otomatis mendeteksi topik materi yang paling banyak mengalami miskonsepsi agar guru dapat mengulanginya di kelas.
                </p>
              </div>
              <Badge variant="accent" className="text-xs">
                Analisis AI Real-Time
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-red-300">1. Konjungsi Kausalitas &amp; Logika</span>
                  <span className="font-bold text-red-400">54% Paham</span>
                </div>
                <ProgressBar progress={54} size="sm" />
                <p className="text-[11px] text-red-300/70 leading-relaxed">
                  ⚠️ <strong>Peringatan AI:</strong> 4 siswa sering tertukar antara konjungsi kausalitas (sebab-akibat) dan konjungsi kronologis. Disarankan ulasan 15 menit di kelas.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-300">2. Kaidah Teks Eksplanasi</span>
                  <span className="font-bold text-amber-400">72% Paham</span>
                </div>
                <ProgressBar progress={72} size="sm" />
                <p className="text-[11px] text-muted leading-relaxed">
                  Sebagian besar siswa memahami struktur umum namun perlu latihan kalimat pasif dan kata kerja material.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-300">3. Kalimat Definisi &amp; EYD V</span>
                  <span className="font-bold text-emerald-400">89% Paham</span>
                </div>
                <ProgressBar progress={89} size="sm" />
                <p className="text-[11px] text-emerald-400/80 leading-relaxed">
                  ✓ Mayoritas siswa telah menguasai konsep ini dengan sangat baik.
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Homeroom Cross-Subject Summary Card when in Homeroom Mode */}
          {viewMode === "homeroom" && (
            <GlowCard className="p-6 space-y-4 border-accent/40 bg-accent/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <div>
                  <h3 className="text-lg font-bold font-serif text-text flex items-center gap-2">
                    <School size={20} className="text-accent" />
                    <span>Rekapitulasi Nilai Lintas Mata Pelajaran — Wali Kelas {homeroomClass}</span>
                  </h3>
                  <p className="text-xs text-muted">
                    Setiap nilai di bawah ini mengagregasi performa pengerjaan kuis siswa pada seluruh mata pelajaran di sekolah.
                  </p>
                </div>
                <Badge variant="accent" className="text-xs font-bold">
                  Dashboard Wali Kelas
                </Badge>
              </div>

              {/* Cross-Subject Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted uppercase tracking-wider font-semibold">
                      <th className="pb-3 px-3">Siswa (Kelas XI-A)</th>
                      <th className="pb-3 px-3 text-center">📐 Matematika</th>
                      <th className="pb-3 px-3 text-center">📖 B. Indonesia</th>
                      <th className="pb-3 px-3 text-center">⚡ Fisika</th>
                      <th className="pb-3 px-3 text-center">🧪 Kimia</th>
                      <th className="pb-3 px-3 text-center">📈 Ekonomi</th>
                      <th className="pb-3 px-3 text-center">Status Risiko</th>
                      <th className="pb-3 px-3 text-right">Aksi Wali Kelas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr className="hover:bg-surface2/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-text text-sm">Andi Pratama</div>
                        <div className="text-[10px] text-muted">andi@sekolah.sch.id</div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-400">92%</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-400">95%</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-400">88%</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-400">85%</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-400">90%</td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant="brand" className="text-[10px]">🟢 Aman (Prestasi)</Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button size="sm" variant="secondary" onClick={() => setRemedialToast("Catatan apresiasi Wali Kelas terkirim ke Andi Pratama")} className="text-[11px] py-1 border-brand/40 text-brand font-semibold">
                          <Send size={12} /> Catatan Wali Kelas
                        </Button>
                      </td>
                    </tr>

                    <tr className="hover:bg-surface2/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-text text-sm">Doni Setiawan</div>
                        <div className="text-[10px] text-muted">doni.s@sekolah.sch.id</div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-amber-400">55%</td>
                      <td className="py-3 px-3 text-center font-bold text-red-400">44%</td>
                      <td className="py-3 px-3 text-center font-bold text-amber-400">60%</td>
                      <td className="py-3 px-3 text-center font-bold text-red-400">48%</td>
                      <td className="py-3 px-3 text-center font-bold text-amber-400">62%</td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant="error" className="text-[10px] font-bold">🔴 Risiko Tinggi (B. Indo &amp; Kimia)</Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button size="sm" variant="secondary" onClick={() => setRemedialToast("Surat Panggilan Pembimbingan terkirim ke Orang Tua Doni Setiawan")} className="text-[11px] py-1 border-red-500/40 text-red-400 font-semibold hover:bg-red-950/30">
                          <AlertTriangle size={12} /> Undang Orang Tua
                        </Button>
                      </td>
                    </tr>

                    <tr className="hover:bg-surface2/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-text text-sm">Siti Nurhaliza</div>
                        <div className="text-[10px] text-muted">siti.n@sekolah.sch.id</div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-red-400">48%</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-400">82%</td>
                      <td className="py-3 px-3 text-center font-bold text-amber-400">56%</td>
                      <td className="py-3 px-3 text-center font-bold text-amber-400">60%</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-400">78%</td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant="accent" className="text-[10px] font-bold">🟡 Perlu Penguatan (Matematika)</Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button size="sm" variant="secondary" onClick={() => setRemedialToast("Rekomendasi remedial Matematika terkirim ke Siti Nurhaliza")} className="text-[11px] py-1 border-amber-500/40 text-amber-300 font-semibold">
                          <Send size={12} /> Konsultasi Guru Mapel
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </GlowCard>
          )}

          {/* Student Progress Monitoring Table */}
          <Card className="p-6 space-y-4 border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-text flex items-center gap-2">
                  <UserCheck size={18} className="text-brand" />
                  <span>Daftar Jawaban &amp; Tingkat Akurasi Siswa ({viewMode === "homeroom" ? "Rekapitulasi Kelas XI-A" : defaultSubject})</span>
                </h3>
                <p className="text-xs text-muted">
                  Pantau setiap siswa yang telah mengerjakan soal, tingkat kebenaran, dan miskonsepsi yang dialaminya.
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-surface2">
                  <span className="text-[10px] text-muted font-bold px-2 uppercase">Kelas:</span>
                  <button
                    onClick={() => setSelectedClassFilter("Kelas XI")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedClassFilter === "Kelas XI" ? "bg-brand text-bg font-bold shadow-sm" : "text-muted hover:text-text"
                    }`}
                  >
                    Kelas XI {isBrio ? "(Kelas Anda)" : ""}
                  </button>
                  <button
                    onClick={() => setSelectedClassFilter("Kelas X")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedClassFilter === "Kelas X" ? "bg-brand text-bg font-bold shadow-sm" : "text-muted hover:text-text"
                    }`}
                  >
                    Kelas X {!isBrio ? "(Kelas Anda)" : ""}
                  </button>
                  <button
                    onClick={() => setSelectedClassFilter("Kelas XII")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedClassFilter === "Kelas XII" ? "bg-brand text-bg font-bold shadow-sm" : "text-muted hover:text-text"
                    }`}
                  >
                    Kelas XII
                  </button>
                  <button
                    onClick={() => setSelectedClassFilter("all")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedClassFilter === "all" ? "bg-brand text-bg font-bold shadow-sm" : "text-muted hover:text-text"
                    }`}
                  >
                    Semua Jenjang
                  </button>
                </div>

                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    placeholder="Cari nama siswa..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-border bg-surface2 text-xs outline-none focus:border-brand w-36 text-text"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-surface2">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      statusFilter === "all" ? "bg-brand text-bg" : "text-muted hover:text-text"
                    }`}
                  >
                    Semua ({filteredStudents.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter("needs_attention")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      statusFilter === "needs_attention" ? "bg-error text-white font-bold" : "text-muted hover:text-error"
                    }`}
                  >
                    ⚠️ Perlu Perhatian ({needsAttentionCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter("mastered")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      statusFilter === "mastered" ? "bg-brand text-bg" : "text-muted hover:text-text"
                    }`}
                  >
                    Mastered ({masteredCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-3">Nama Siswa</th>
                    <th className="pb-3 px-3">Jenjang / Kelas</th>
                    <th className="pb-3 px-3 text-center">Soal Dikerjakan</th>
                    <th className="pb-3 px-3 text-center">Akurasi (%)</th>
                    <th className="pb-3 px-3">Status Penguasaan</th>
                    <th className="pb-3 px-3">Miskonsepsi Terdeteksi</th>
                    <th className="pb-3 px-3 text-right">Aksi Guru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-surface2/50 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-text text-sm">{student.name}</div>
                        <div className="text-[11px] text-muted">{student.email}</div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-1">
                          <Badge variant="neutral" className="text-[10px] w-fit font-mono">
                            {student.classGroup}
                          </Badge>
                          {student.gradeLevel && (
                            <span className="text-[10px] text-muted font-medium">
                              {student.gradeLevel.split("(")[0]}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-medium">
                        <span className="text-emerald-400 font-bold">{student.correctCount} Benar</span> / {student.totalAnswered} Soal
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`font-mono font-bold text-sm ${
                            student.accuracyRate >= 80
                              ? "text-emerald-400"
                              : student.accuracyRate >= 60
                              ? "text-amber-400"
                              : "text-red-400 font-extrabold"
                          }`}
                        >
                          {student.accuracyRate}%
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        {student.status === "mastered" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 size={12} /> Mastered ({student.masteryScore}%)
                          </span>
                        ) : student.status === "practicing" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <TrendingUp size={12} /> Practicing ({student.masteryScore}%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                            <AlertTriangle size={12} /> Perlu Perhatian ({student.masteryScore}%)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        {student.frequentMisconceptions.length > 0 ? (
                          <div className="space-y-1">
                            {student.frequentMisconceptions.map((m, idx) => (
                              <div key={idx} className="text-[11px] text-amber-300/90 leading-tight">
                                • {m}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted italic">Tidak ada miskonsepsi mayor</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant={student.remedialAssigned ? "secondary" : "primary"}
                            onClick={() => handleAssignRemedial(student.id, student.name)}
                            disabled={student.remedialAssigned}
                            className="text-xs px-2.5 py-1"
                          >
                            {student.remedialAssigned ? (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 size={12} /> Remedial Dikirim
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Send size={12} /> Beri Remedial
                              </span>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: QUESTION BANK MANAGEMENT                                           */}
      {/* ========================================================================= */}
      {activeTab === "bank" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-serif text-text">
                Bank Soal Mata Pelajaran {defaultSubject}
              </h2>
              <p className="text-xs text-muted">
                Materi kurikulum untuk <strong className="text-text">{defaultGrade}</strong>. Soal yang Anda input akan disajikan secara adaptif ke siswa.
              </p>
            </div>

            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              variant="primary"
              className="shadow-lg"
            >
              <PlusCircle size={18} />
              <span>{showAddForm ? "Tutup Form" : "+ Input Soal Baru"}</span>
            </Button>
          </div>

          {/* Form Input Soal Baru */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="p-6 sm:p-8 space-y-6 border-brand/40 bg-surface">
                  <div className="border-b border-border pb-3">
                    <h3 className="text-lg font-bold font-serif text-text flex items-center gap-2">
                      <Sparkles size={18} className="text-brand" />
                      <span>Form Input Soal Pembelajaran Adaptif</span>
                    </h3>
                    <p className="text-xs text-muted">
                      Lengkapi pertanyaan, jawaban benar, pola miskonsepsi, dan bimbingan Think First.
                    </p>
                  </div>

                  <form onSubmit={handleAddQuestion} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1">Mata Pelajaran</label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                        >
                          <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                          <option value="Matematika">Matematika</option>
                          <option value="IPA (Fisika/Kimia/Biologi)">IPA (Fisika/Kimia/Biologi)</option>
                          <option value="IPS (Ekonomi/Sosiologi)">IPS (Ekonomi/Sosiologi)</option>
                          <option value="Persiapan Sekolah Kedinasan (SEKDIN)">Persiapan Kedinasan (SEKDIN)</option>
                          <option value="Persiapan UTBK / SNBT">Persiapan UTBK / SNBT</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1">Jenjang Kelas / Target</label>
                        <select
                          value={gradeLevel}
                          onChange={(e) => setGradeLevel(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                        >
                          <option value="Kelas X (Kelas 1 SMA)">Kelas X (Kelas 1 SMA)</option>
                          <option value="Kelas XI (Kelas 2 SMA)">Kelas XI (Kelas 2 SMA)</option>
                          <option value="Kelas XII (Kelas 3 SMA)">Kelas XII (Kelas 3 SMA)</option>
                          <option value="Persiapan UTBK / SNBT PTN">Persiapan UTBK / SNBT PTN</option>
                          <option value="Persiapan Kedinasan (SEKDIN - STAN/STIS)">Persiapan Kedinasan (SEKDIN)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1">Tingkat Kesulitan</label>
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                          className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                        >
                          <option value="easy">Easy (Dasar)</option>
                          <option value="medium">Medium (Sedang)</option>
                          <option value="hard">Hard / HOTS (Tinggi)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted uppercase mb-1">Nama Konsep / Topik Materi</label>
                      <Input
                        placeholder="Contoh: Kaidah Kebahasaan & Teks Eksplanasi / Eksponen & Akar"
                        value={conceptName}
                        onChange={(e) => setConceptName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted uppercase mb-1">Teks Pertanyaan / Soal</label>
                      <textarea
                        rows={3}
                        placeholder="Tuliskan teks soal secara jelas..."
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        required
                        className="w-full p-3 rounded-xl border border-border bg-surface2 text-xs text-text outline-none focus:border-brand leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1">Kunci Jawaban Benar</label>
                        <Input
                          placeholder="Jawaban benar, misal: Oleh karena itu atau 25"
                          value={correctAnswer}
                          onChange={(e) => setCorrectAnswer(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1">Pola Miskonsepsi Umum (Opsional)</label>
                        <Input
                          placeholder="Misal: CONJUNCTION_CONFUSION (Tertukar kata waktu)"
                          value={misconceptionPattern}
                          onChange={(e) => setMisconceptionPattern(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted uppercase mb-1">
                        Bimbingan Nalar AI (Think First Socratic Hint)
                      </label>
                      <Input
                        placeholder="Petunjuk pemandu tanpa membocorkan jawaban langsung..."
                        value={hintLevel1}
                        onChange={(e) => setHintLevel1(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      {saveSuccess ? (
                        <span className="text-xs font-bold text-brand flex items-center gap-1">
                          <CheckCircle2 size={16} /> Soal Berhasil Disimpan ke Bank Soal!
                        </span>
                      ) : <span />}

                      <Button type="submit" variant="primary">
                        <span>Simpan Soal Baru</span>
                        <CheckCircle2 size={16} />
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List Soal yang Ada */}
          <Card className="p-6 space-y-4 border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-bold font-serif text-text flex items-center gap-2">
                <BookOpen size={18} className="text-brand" />
                <span>Daftar Soal Tersedia ({questions.length})</span>
              </h3>

              <div className="flex items-center gap-2">
                {(["Semua", "Bahasa Indonesia", "Matematika", "Persiapan Sekolah Kedinasan (SEKDIN)"] as const).map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSubjectFilter(s)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedSubjectFilter === s
                          ? "bg-brand text-bg font-bold"
                          : "text-muted hover:text-text bg-surface2 border border-border"
                      }`}
                    >
                      {s === "Persiapan Sekolah Kedinasan (SEKDIN)" ? "Kedinasan" : s}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {questions
                .filter(
                  (q) =>
                    selectedSubjectFilter === "Semua" || q.subject.includes(selectedSubjectFilter)
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-border hover:border-brand/40 transition-all space-y-3 bg-surface2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="brand" className="text-[10px]">{item.subject}</Badge>
                        <Badge variant="neutral" className="text-[10px]">{item.gradeLevel}</Badge>
                        <Badge variant="accent" className="text-[10px] uppercase">{item.difficulty}</Badge>
                        <span className="text-xs font-bold text-text">{item.conceptName}</span>
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-muted hover:text-error transition-colors p-1.5 rounded-lg"
                        title="Hapus Soal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-text leading-relaxed">
                      {item.questionText}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-border/60">
                      <div className="flex items-center gap-1.5 text-brand">
                        <CheckCircle2 size={14} />
                        <span>Kunci Jawaban: <strong>{item.correctAnswer}</strong></span>
                      </div>
                      {item.misconceptionPattern && (
                        <div className="flex items-center gap-1.5 text-accent">
                          <BrainCircuit size={14} />
                          <span>Pola Miskonsepsi: {item.misconceptionPattern}</span>
                        </div>
                      )}
                    </div>

                    {item.hintLevel1 && (
                      <div className="p-3 rounded-xl text-xs border border-border bg-surface">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-0.5">
                          Think First Hint:
                        </span>
                        <p className="text-muted italic">&ldquo;{item.hintLevel1}&rdquo;</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export default function TeacherQuestionsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-muted">Memuat Dashboard Guru...</div>}>
      <TeacherQuestionsContent />
    </React.Suspense>
  );
}
