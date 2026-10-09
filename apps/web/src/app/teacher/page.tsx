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
  MessageSquare,
  HeartHandshake,
  X,
  FileSpreadsheet,
  Download,
  Upload,
  UserPlus,
  Rocket,
  ArrowUpRight,
  RotateCcw,
  CheckSquare,
  Square,
  Target,
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
import {
  getStoredTracerRecords,
  saveStoredTracerRecords,
  TracerRecord,
} from "@/lib/tracer-study";

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

export interface HomeroomStudentSummary {
  id: string;
  name: string;
  nisn: string;
  email: string;
  classGroup?: string;
  gradeLevel?: string;
  promotionStatus?: "promoted" | "retained" | "active" | "graduated";
  status?: "active" | "graduated";
  scores: {
    matematika: number;
    bahasaIndonesia: number;
    fisika: number;
    kimia: number;
    ekonomi: number;
  };
  overallAverage: number;
  riskLevel: "low" | "medium" | "high";
  riskDescription: string;
}

const HOMEROOM_STUDENTS_DATA: HomeroomStudentSummary[] = [
  {
    id: "hr-1",
    name: "Andi Pratama",
    nisn: "0081234567",
    email: "andi@sekolah.sch.id",
    scores: {
      matematika: 92,
      bahasaIndonesia: 88,
      fisika: 90,
      kimia: 85,
      ekonomi: 89,
    },
    overallAverage: 88.8,
    riskLevel: "low",
    riskDescription: "🟢 Stabil & Berprestasi di seluruh mata pelajaran",
  },
  {
    id: "hr-2",
    name: "Doni Setiawan",
    nisn: "0081234568",
    email: "doni.s@sekolah.sch.id",
    scores: {
      matematika: 72,
      bahasaIndonesia: 48,
      fisika: 65,
      kimia: 45,
      ekonomi: 70,
    },
    overallAverage: 60.0,
    riskLevel: "high",
    riskDescription: "🔴 Risiko Tinggi: Lemah di B. Indonesia (48) & Kimia (45) sekaligus",
  },
  {
    id: "hr-3",
    name: "Siti Nurhaliza",
    nisn: "0081234569",
    email: "siti.n@sekolah.sch.id",
    scores: {
      matematika: 85,
      bahasaIndonesia: 88,
      fisika: 82,
      kimia: 80,
      ekonomi: 92,
    },
    overallAverage: 85.4,
    riskLevel: "low",
    riskDescription: "🟢 Sangat Baik & Mandiri di seluruh mata pelajaran",
  },
  {
    id: "hr-4",
    name: "Fajar Maulana",
    nisn: "0081234570",
    email: "fajar.m@sekolah.sch.id",
    scores: {
      matematika: 50,
      bahasaIndonesia: 75,
      fisika: 58,
      kimia: 64,
      ekonomi: 78,
    },
    overallAverage: 65.0,
    riskLevel: "medium",
    riskDescription: "🟡 Perhatian Sedang: Perlu penguatan pada Matematika (50) & Fisika (58)",
  },
  {
    id: "hr-5",
    name: "Rania Putri",
    nisn: "0081234571",
    email: "rania.p@sekolah.sch.id",
    scores: {
      matematika: 80,
      bahasaIndonesia: 82,
      fisika: 78,
      kimia: 76,
      ekonomi: 84,
    },
    overallAverage: 80.0,
    riskLevel: "low",
    riskDescription: "🟢 Memenuhi standar KKM & perkembangan stabil",
  },
];

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

  // ===========================================================================
  // HOMEROOM (WALI KELAS) STATES & DUAL-MODE SUPPORT
  // ===========================================================================
  const isHomeroomTeacher =
    loggedEmail.toLowerCase().includes("brio") ||
    loggedEmail.toLowerCase().includes("wali");
  const [teacherMode, setTeacherMode] = useState<"homeroom" | "subject">(
    loggedEmail.toLowerCase().includes("brio") ? "homeroom" : "subject"
  );
  const [homeroomStudents, setHomeroomStudents] = useState<HomeroomStudentSummary[]>(HOMEROOM_STUDENTS_DATA);
  const [activeHomeroomActionStudent, setActiveHomeroomActionStudent] = useState<HomeroomStudentSummary | null>(null);
  const [homeroomActionType, setHomeroomActionType] = useState<"appreciation" | "parent_consultation">("appreciation");
  const [homeroomNoteMessage, setHomeroomNoteMessage] = useState<string>("");
  const [homeroomConsultationTopic, setHomeroomConsultationTopic] = useState<string>("");

  const handleOpenAppreciationModal = (s: HomeroomStudentSummary) => {
    setActiveHomeroomActionStudent(s);
    setHomeroomActionType("appreciation");
    setHomeroomConsultationTopic("Apresiasi Prestasi & Konsistensi Belajar");
    setHomeroomNoteMessage(
      `Selamat kepada Ananda ${s.name} (NISN: ${s.nisn}) atas pencapaian nilai rata-rata ${s.overallAverage} di Kelas XI-A. Pertahankan konsistensi belajar dan dedikasi eksplorasi mandirimu di seluruh mata pelajaran!`
    );
  };

  const handleOpenConsultationModal = (s: HomeroomStudentSummary) => {
    setActiveHomeroomActionStudent(s);
    setHomeroomActionType("parent_consultation");
    setHomeroomConsultationTopic("Undangan Diskusi Evaluasi & Pendampingan Belajar Siswa");
    const weakSubjects: string[] = [];
    if (s.scores.matematika < 75) weakSubjects.push(`Matematika (${s.scores.matematika})`);
    if (s.scores.bahasaIndonesia < 75) weakSubjects.push(`Bahasa Indonesia (${s.scores.bahasaIndonesia})`);
    if (s.scores.fisika < 75) weakSubjects.push(`Fisika (${s.scores.fisika})`);
    if (s.scores.kimia < 75) weakSubjects.push(`Kimia (${s.scores.kimia})`);
    if (s.scores.ekonomi < 75) weakSubjects.push(`Ekonomi (${s.scores.ekonomi})`);

    setHomeroomNoteMessage(
      `Yth. Orang Tua / Wali dari Ananda ${s.name}, kami mengundang Bapak/Ibu untuk berdiskusi bersama Wali Kelas XI-A terkait evaluasi hasil belajar siswa semester ini, khususnya pendampingan intensif pada: ${weakSubjects.join(", ") || "mata pelajaran terkait"}. Pertemuan direncanakan secara tatap muka / daring untuk menyusun program bimbingan belajar remedial bersama.`
    );
  };

  const handleSendHomeroomNote = () => {
    if (!activeHomeroomActionStudent) return;
    setStatusMsg(
      homeroomActionType === "appreciation"
        ? `🎉 Catatan apresiasi resmi berhasil dikirimkan ke Ananda ${activeHomeroomActionStudent.name} & Orang Tua melalui Portal NALARA & WhatsApp!`
        : `📋 Undangan pembimbingan orang tua untuk ${activeHomeroomActionStudent.name} berhasil dijadwalkan dan terkirim ke WhatsApp Orang Tua!`
    );
    setActiveHomeroomActionStudent(null);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Homeroom Tab & Roster Management State
  const [homeroomTab, setHomeroomTab] = useState<"rekap" | "roster" | "tracer">("rekap");
  const [homeroomSearch, setHomeroomSearch] = useState("");
  const [showAddHomeroomStudentModal, setShowAddHomeroomStudentModal] = useState(false);
  const [isSubmittingHomeroomStudent, setIsSubmittingHomeroomStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentNisn, setNewStudentNisn] = useState("");
  const [newStudentPassword, setNewStudentPassword] = useState("password123");

  // Homeroom Tracer Study State
  const [homeroomTracerRecords, setHomeroomTracerRecords] = useState<TracerRecord[]>([]);
  const [homeroomTracerFilter, setHomeroomTracerFilter] = useState("all");
  const [homeroomTracerSearch, setHomeroomTracerSearch] = useState("");
  const [editingHomeroomTracer, setEditingHomeroomTracer] = useState<TracerRecord | null>(null);
  const [isUpdatingHomeroomTracer, setIsUpdatingHomeroomTracer] = useState(false);

  // Multi-select & Bulk Promotion State
  const [selectedStudentEmails, setSelectedStudentEmails] = useState<string[]>([]);
  const [showBulkPromotionModal, setShowBulkPromotionModal] = useState(false);
  const [isProcessingBulkPromotion, setIsProcessingBulkPromotion] = useState(false);
  const [targetPromotionClass, setTargetPromotionClass] = useState("Kelas 3-A (XII-A)");
  const [targetPromotionGrade, setTargetPromotionGrade] = useState("Kelas 3 (Kelas XII)");

  // Homeroom Bulk Import State
  const [showHomeroomBulkModal, setShowHomeroomBulkModal] = useState(false);
  const [homeroomCsvRaw, setHomeroomCsvRaw] = useState("");
  const [homeroomBulkParsed, setHomeroomBulkParsed] = useState<Array<{ name: string; email: string; nisn: string; password?: string }>>([]);
  const [isImportingHomeroomBulk, setIsImportingHomeroomBulk] = useState(false);
  const [homeroomBulkFileName, setHomeroomBulkFileName] = useState<string | null>(null);
  const homeroomFileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync Homeroom Students with local graduated list, promotions & registered students
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const gradEmails: string[] = JSON.parse(localStorage.getItem("nalara_graduated_students") || "[]");
      const rawReg = localStorage.getItem("nalara_registered_students");
      const rawPromotions = localStorage.getItem("nalara_homeroom_promotions");
      const promotionsMap: Record<string, { promotionStatus?: "promoted" | "retained" | "active" | "graduated"; classGroup?: string; gradeLevel?: string }> = rawPromotions ? JSON.parse(rawPromotions) : {};
      const baseList = [...HOMEROOM_STUDENTS_DATA];

      if (rawReg) {
        const regStudents = JSON.parse(rawReg);
        regStudents.forEach((rs: { classGroup?: string; email: string; id?: string; name: string; nisn?: string; status?: "active" | "graduated" }) => {
          const matchClass = (rs.classGroup || "").includes("XI-A") || (rs.classGroup || "").includes("2-A");
          if (matchClass && !baseList.some((h) => h.email.toLowerCase() === rs.email.toLowerCase())) {
            baseList.push({
              id: rs.id || `hr-${rs.email}`,
              name: rs.name,
              nisn: rs.nisn || "-",
              email: rs.email,
              classGroup: "Kelas 2-A (XI-A)",
              gradeLevel: "Kelas 2 (Kelas XI)",
              promotionStatus: "active",
              status: rs.status || "active",
              scores: {
                matematika: 78,
                bahasaIndonesia: 80,
                fisika: 75,
                kimia: 76,
                ekonomi: 82,
              },
              overallAverage: 78.2,
              riskLevel: "low",
              riskDescription: "🟢 Siswa Bimbingan Kelas XI-A",
            });
          }
        });
      }

      const synced = baseList.map((s) => {
        const promo = promotionsMap[s.email.toLowerCase()];
        const isGrad = gradEmails.includes(s.email.toLowerCase());
        return {
          ...s,
          classGroup: promo?.classGroup || s.classGroup || "Kelas 2-A (XI-A)",
          gradeLevel: promo?.gradeLevel || s.gradeLevel || "Kelas 2 (Kelas XI)",
          promotionStatus: promo?.promotionStatus || (isGrad ? "graduated" : s.promotionStatus || "active"),
          status: isGrad ? ("graduated" as const) : s.status || ("active" as const),
        };
      });
      setHomeroomStudents(synced);
      setHomeroomTracerRecords(getStoredTracerRecords());
    } catch (e) {
      console.error("Error loading homeroom students:", e);
    }
  }, []);

  const handleUpdateHomeroomTracer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHomeroomTracer) return;
    setIsUpdatingHomeroomTracer(true);
    try {
      const res = await fetch("/api/student/update-tracer-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: editingHomeroomTracer.email,
          name: editingHomeroomTracer.studentName,
          plannedPathway: editingHomeroomTracer.plannedPathway,
          plannedTarget: editingHomeroomTracer.plannedTarget,
          realizationStatus: editingHomeroomTracer.realizationStatus,
          realizationDetail: editingHomeroomTracer.realizationDetail,
          verificationStatus: editingHomeroomTracer.verificationStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengupdate");

      const all = getStoredTracerRecords();
      const updated = all.map((t) =>
        t.email.toLowerCase() === editingHomeroomTracer.email.toLowerCase()
          ? { ...editingHomeroomTracer, updatedAt: new Date().toISOString() }
          : t
      );
      saveStoredTracerRecords(updated);
      setHomeroomTracerRecords(updated);
      setStatusMsg(`🎉 Berhasil memperbarui status kelulusan & karir siswa ${editingHomeroomTracer.studentName}!`);
      setEditingHomeroomTracer(null);
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengupdate";
      setStatusMsg(`Error Update Tracer: ${msg}`);
    } finally {
      setIsUpdatingHomeroomTracer(false);
    }
  };

  // Multi-select handlers
  const handleToggleSelectAll = () => {
    const allFilteredEmails = filteredHomeroomStudents.map((s) => s.email.toLowerCase());
    if (selectedStudentEmails.length === allFilteredEmails.length) {
      setSelectedStudentEmails([]);
    } else {
      setSelectedStudentEmails(allFilteredEmails);
    }
  };

  const handleToggleSelectStudent = (email: string) => {
    const lower = email.toLowerCase();
    setSelectedStudentEmails((prev) =>
      prev.includes(lower) ? prev.filter((e) => e !== lower) : [...prev, lower]
    );
  };

  // Handler for single student promotion / retention / reset
  const handlePromoteStudentAction = async (
    s: HomeroomStudentSummary,
    action: "promote" | "retain" | "graduate" | "reset"
  ) => {
    try {
      const res = await fetch("/api/admin/promote-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: [s.email],
          action,
          targetClassGroup: targetPromotionClass,
          targetGradeLevel: targetPromotionGrade,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memproses kenaikan kelas");

      const newClassGroup =
        action === "promote"
          ? targetPromotionClass
          : action === "reset"
          ? "Kelas 2-A (XI-A)"
          : s.classGroup || "Kelas 2-A (XI-A)";
      const newGradeLevel =
        action === "promote"
          ? targetPromotionGrade
          : action === "reset"
          ? "Kelas 2 (Kelas XI)"
          : s.gradeLevel || "Kelas 2 (Kelas XI)";
      const newStatus = action === "graduate" ? "graduated" : "active";

      const mappedPromoStatus: "promoted" | "retained" | "graduated" | "active" =
        action === "promote"
          ? "promoted"
          : action === "retain"
          ? "retained"
          : action === "graduate"
          ? "graduated"
          : "active";

      const updated = homeroomStudents.map((item) =>
        item.email.toLowerCase() === s.email.toLowerCase()
          ? {
              ...item,
              promotionStatus: mappedPromoStatus,
              classGroup: newClassGroup,
              gradeLevel: newGradeLevel,
              status: newStatus as "active" | "graduated",
            }
          : item
      );
      setHomeroomStudents(updated);

      if (typeof window !== "undefined") {
        const promotionsMap: Record<string, unknown> = JSON.parse(
          localStorage.getItem("nalara_homeroom_promotions") || "{}"
        );
        promotionsMap[s.email.toLowerCase()] = {
          promotionStatus: mappedPromoStatus,
          classGroup: newClassGroup,
          gradeLevel: newGradeLevel,
          status: newStatus,
        };
        localStorage.setItem("nalara_homeroom_promotions", JSON.stringify(promotionsMap));

        const gradEmails: string[] = JSON.parse(
          localStorage.getItem("nalara_graduated_students") || "[]"
        );
        if (action === "graduate") {
          if (!gradEmails.includes(s.email.toLowerCase())) {
            gradEmails.push(s.email.toLowerCase());
            localStorage.setItem("nalara_graduated_students", JSON.stringify(gradEmails));
          }
        } else {
          const filteredGrad = gradEmails.filter((e) => e !== s.email.toLowerCase());
          localStorage.setItem("nalara_graduated_students", JSON.stringify(filteredGrad));
        }
      }

      setStatusMsg(
        action === "promote"
          ? `🚀 Siswa ${s.name} berhasil dinaikkan ke ${targetPromotionClass}!`
          : action === "retain"
          ? `🔴 Siswa ${s.name} ditetapkan tinggal di ${s.classGroup || "Kelas XI-A"}.`
          : action === "graduate"
          ? `🎓 Siswa ${s.name} berhasil ditandai Lulus / Alumni!`
          : `🟢 Status ${s.name} dikembalikan ke normal.`
      );
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      setStatusMsg(`Error: ${msg}`);
    }
  };

  // Handler for bulk promotion / retention / reset
  const handleExecuteBulkPromotion = async (
    action: "promote" | "retain" | "graduate" | "reset",
    customEmails?: string[]
  ) => {
    const emailsToProcess = customEmails || selectedStudentEmails;
    if (emailsToProcess.length === 0) return;

    setIsProcessingBulkPromotion(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/promote-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: emailsToProcess,
          action,
          targetClassGroup: targetPromotionClass,
          targetGradeLevel: targetPromotionGrade,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memproses kenaikan kelas massal");

      const emailSet = new Set(emailsToProcess.map((e) => e.toLowerCase()));
      const newClassGroup =
        action === "promote"
          ? targetPromotionClass
          : action === "reset"
          ? "Kelas 2-A (XI-A)"
          : "Kelas 2-A (XI-A)";
      const newGradeLevel =
        action === "promote"
          ? targetPromotionGrade
          : action === "reset"
          ? "Kelas 2 (Kelas XI)"
          : "Kelas 2 (Kelas XI)";
      const newStatus = action === "graduate" ? "graduated" : "active";

      const mappedPromoStatus: "promoted" | "retained" | "graduated" | "active" =
        action === "promote"
          ? "promoted"
          : action === "retain"
          ? "retained"
          : action === "graduate"
          ? "graduated"
          : "active";

      const updated = homeroomStudents.map((item) =>
        emailSet.has(item.email.toLowerCase())
          ? {
              ...item,
              promotionStatus: mappedPromoStatus,
              classGroup: newClassGroup,
              gradeLevel: newGradeLevel,
              status: newStatus as "active" | "graduated",
            }
          : item
      );
      setHomeroomStudents(updated);

      if (typeof window !== "undefined") {
        const promotionsMap: Record<string, unknown> = JSON.parse(
          localStorage.getItem("nalara_homeroom_promotions") || "{}"
        );
        emailsToProcess.forEach((email) => {
          promotionsMap[email.toLowerCase()] = {
            promotionStatus: mappedPromoStatus,
            classGroup: newClassGroup,
            gradeLevel: newGradeLevel,
            status: newStatus,
          };
        });
        localStorage.setItem("nalara_homeroom_promotions", JSON.stringify(promotionsMap));

        const gradEmails: string[] = JSON.parse(
          localStorage.getItem("nalara_graduated_students") || "[]"
        );
        if (action === "graduate") {
          emailsToProcess.forEach((email) => {
            if (!gradEmails.includes(email.toLowerCase())) {
              gradEmails.push(email.toLowerCase());
            }
          });
          localStorage.setItem("nalara_graduated_students", JSON.stringify(gradEmails));
        } else {
          const filteredGrad = gradEmails.filter((e) => !emailSet.has(e.toLowerCase()));
          localStorage.setItem("nalara_graduated_students", JSON.stringify(filteredGrad));
        }
      }

      setSelectedStudentEmails([]);
      setShowBulkPromotionModal(false);

      const actionText =
        action === "promote"
          ? `🚀 Berhasil menaikkan ${emailsToProcess.length} siswa ke ${targetPromotionClass}!`
          : action === "retain"
          ? `🔴 Berhasil menetapkan ${emailsToProcess.length} siswa tinggal kelas.`
          : action === "graduate"
          ? `🎓 Berhasil menandai ${emailsToProcess.length} siswa lulus (alumni).`
          : `🟢 Berhasil mereset status ${emailsToProcess.length} siswa.`;

      setStatusMsg(actionText);
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      setStatusMsg(`Error: ${msg}`);
    } finally {
      setIsProcessingBulkPromotion(false);
    }
  };

  // Toggle Graduation Status (Wali Kelas)
  const handleToggleHomeroomStudentStatus = async (s: HomeroomStudentSummary) => {
    const nextStatus = s.status === "graduated" ? "active" : "graduated";
    try {
      const res = await fetch("/api/admin/toggle-student-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: s.id,
          email: s.email,
          status: nextStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengubah status kelulusan siswa");

      const updated = homeroomStudents.map((item) =>
        item.id === s.id || item.email.toLowerCase() === s.email.toLowerCase()
          ? { ...item, status: nextStatus as "active" | "graduated" }
          : item
      );
      setHomeroomStudents(updated);

      if (typeof window !== "undefined") {
        const gradEmails = updated
          .filter((item) => item.status === "graduated")
          .map((item) => item.email.toLowerCase());
        localStorage.setItem("nalara_graduated_students", JSON.stringify(gradEmails));

        const rawReg = localStorage.getItem("nalara_registered_students");
        if (rawReg) {
          try {
            const regList = JSON.parse(rawReg);
            const updatedReg = regList.map((item: { id?: string; email: string }) =>
              item.id === s.id || item.email.toLowerCase() === s.email.toLowerCase()
                ? { ...item, status: nextStatus }
                : item
            );
            localStorage.setItem("nalara_registered_students", JSON.stringify(updatedReg));
          } catch (e) {}
        }
      }

      setStatusMsg(
        nextStatus === "graduated"
          ? `🎓 Siswa ${s.name} berhasil ditandai Lulus / Alumni! Akses kuis & portal otomatis diblokir.`
          : `🟢 Siswa ${s.name} berhasil diaktifkan kembali status belajarnya!`
      );
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      setStatusMsg(`Error: ${msg}`);
    }
  };

  // Add Manual Student (Wali Kelas)
  const handleAddHomeroomStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    setIsSubmittingHomeroomStudent(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/create-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newStudentName.trim(),
          email: newStudentEmail.trim().toLowerCase(),
          nisn: newStudentNisn.trim() || "-",
          password: newStudentPassword.trim() || "password123",
          gradeLevel: "Kelas 2 (Kelas XI)",
          classGroup: "Kelas 2-A (XI-A)",
          targetProgram: "SMA Reguler",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mendaftarkan siswa");
      }

      const newStudent: HomeroomStudentSummary = {
        id: data.student?.id || `hr-${Date.now()}`,
        name: newStudentName.trim(),
        email: newStudentEmail.trim().toLowerCase(),
        nisn: newStudentNisn.trim() || "-",
        status: "active",
        scores: {
          matematika: 75,
          bahasaIndonesia: 75,
          fisika: 75,
          kimia: 75,
          ekonomi: 75,
        },
        overallAverage: 75.0,
        riskLevel: "low",
        riskDescription: "🟢 Siswa Baru Kelas XI-A - Siap mengikuti pembelajaran",
      };

      const updated = [newStudent, ...homeroomStudents];
      setHomeroomStudents(updated);

      if (typeof window !== "undefined") {
        const rawReg = localStorage.getItem("nalara_registered_students");
        const regList = rawReg ? JSON.parse(rawReg) : [];
        regList.unshift({
          id: newStudent.id,
          name: newStudent.name,
          email: newStudent.email,
          nisn: newStudent.nisn,
          gradeLevel: "Kelas 2 (Kelas XI)",
          classGroup: "Kelas 2-A (XI-A)",
          targetProgram: "SMA Reguler",
          password: newStudentPassword.trim() || "password123",
          status: "active",
        });
        localStorage.setItem("nalara_registered_students", JSON.stringify(regList));
      }

      setStatusMsg(`Siswa ${newStudentName} (${newStudentEmail}) berhasil didaftarkan langsung ke Rombel Kelas XI-A!`);
      setNewStudentName("");
      setNewStudentEmail("");
      setNewStudentNisn("");
      setShowAddHomeroomStudentModal(false);
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mendaftarkan siswa";
      setStatusMsg(`Error: ${msg}`);
    } finally {
      setIsSubmittingHomeroomStudent(false);
    }
  };

  // Download Homeroom CSV Template
  const handleDownloadHomeroomCsvTemplate = () => {
    const csvContent =
      "Nama Siswa,Email,NISN,Password\n" +
      "Budi Santoso,budi.xi@sekolah.sch.id,0081234591,password123\n" +
      "Citra Kirana,citra.xi@sekolah.sch.id,0081234592,password123\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template_siswa_rombel_xi_a.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Parsing for Homeroom
  const handleHomeroomCsvParse = (text: string) => {
    setHomeroomCsvRaw(text);
    if (!text.trim()) {
      setHomeroomBulkParsed([]);
      return;
    }

    const lines = text.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return;

    const firstLine = lines[0];
    const semicolonCount = (firstLine.match(/;/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    const tabCount = (firstLine.match(/\t/g) || []).length;

    let delimiter = ",";
    if (semicolonCount > commaCount && semicolonCount >= tabCount) delimiter = ";";
    else if (tabCount > commaCount && tabCount > semicolonCount) delimiter = "\t";

    const headerCols = firstLine.split(delimiter).map((c) => c.trim().toLowerCase().replace(/^["']|["']$/g, ""));
    const isHeaderRow = headerCols.some((h) => h.includes("nama") || h.includes("email") || h.includes("nisn"));

    let nameIdx = 0;
    let emailIdx = 1;
    let nisnIdx = 2;
    let passIdx = 3;

    if (isHeaderRow) {
      headerCols.forEach((col, idx) => {
        if (col.includes("nama") || col.includes("name") || col.includes("siswa")) nameIdx = idx;
        else if (col.includes("email") || col.includes("mail") || col.includes("surel")) emailIdx = idx;
        else if (col.includes("nisn") || col.includes("nis") || col.includes("induk")) nisnIdx = idx;
        else if (col.includes("password") || col.includes("sandi") || col.includes("pass")) passIdx = idx;
      });
    }

    const startIndex = isHeaderRow ? 1 : 0;
    const parsed: Array<{ name: string; email: string; nisn: string; password?: string }> = [];

    for (let i = startIndex; i < lines.length; i++) {
      const row = lines[i].split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ""));
      if (row.length < 2) continue;

      const name = row[nameIdx] || `Siswa ${i}`;
      const email = row[emailIdx] || `siswa${i}@sekolah.sch.id`;
      const nisn = row[nisnIdx] || `008${Math.floor(1000000 + Math.random() * 9000000)}`;
      const password = row[passIdx] || "password123";

      parsed.push({ name, email, nisn, password });
    }

    setHomeroomBulkParsed(parsed);
  };

  const handleHomeroomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setHomeroomBulkFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleHomeroomCsvParse(content);
      }
    };
    reader.readAsText(file);
  };

  const handleHomeroomBulkSubmit = async () => {
    if (homeroomBulkParsed.length === 0) return;
    setIsImportingHomeroomBulk(true);
    setStatusMsg(null);

    try {
      const studentsToRegister = homeroomBulkParsed.map((s) => ({
        name: s.name,
        email: s.email.toLowerCase(),
        nisn: s.nisn,
        password: s.password || "password123",
        gradeLevel: "Kelas 2 (Kelas XI)",
        classGroup: "Kelas 2-A (XI-A)",
        targetProgram: "SMA Reguler",
      }));

      const res = await fetch("/api/admin/bulk-create-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: studentsToRegister }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengimpor siswa massal");

      const newSummaries: HomeroomStudentSummary[] = homeroomBulkParsed.map((s, idx) => ({
        id: `hr-bulk-${Date.now()}-${idx}`,
        name: s.name,
        email: s.email.toLowerCase(),
        nisn: s.nisn,
        status: "active",
        scores: {
          matematika: 75,
          bahasaIndonesia: 75,
          fisika: 75,
          kimia: 75,
          ekonomi: 75,
        },
        overallAverage: 75.0,
        riskLevel: "low",
        riskDescription: "🟢 Siswa Baru Hasil Import Rombel Kelas XI-A",
      }));

      const updated = [...newSummaries, ...homeroomStudents];
      setHomeroomStudents(updated);

      if (typeof window !== "undefined") {
        const rawReg = localStorage.getItem("nalara_registered_students");
        const regList = rawReg ? JSON.parse(rawReg) : [];
        studentsToRegister.forEach((s) => {
          regList.unshift({
            id: `s-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            ...s,
            status: "active",
          });
        });
        localStorage.setItem("nalara_registered_students", JSON.stringify(regList));
      }

      setStatusMsg(`🎉 Berhasil mengimpor ${homeroomBulkParsed.length} siswa baru ke Rombel Kelas XI-A!`);
      setShowHomeroomBulkModal(false);
      setHomeroomCsvRaw("");
      setHomeroomBulkParsed([]);
      setHomeroomBulkFileName(null);
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengimpor siswa";
      setStatusMsg(`Error: ${msg}`);
    } finally {
      setIsImportingHomeroomBulk(false);
    }
  };

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
    if (typeof document !== "undefined") {
      document.cookie = "sb-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "sb-user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "sb-user-email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
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

  const filteredHomeroomStudents = homeroomStudents.filter((s) => {
    if (!homeroomSearch.trim()) return true;
    const term = homeroomSearch.toLowerCase();
    return s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term) || s.nisn.includes(term);
  });

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Bar */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border shadow-md" style={{ background: "var(--surface)" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg bg-brand text-bg">
            👨‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold font-serif text-text">
                Portal Guru — {activeAssignment?.teacherName || (loggedEmail.includes("brio") ? "Brio Pratama, S.Pd" : "Pengajar")}
              </h1>
              {isHomeroomTeacher ? (
                <Badge variant={teacherMode === "homeroom" ? "brand" : "accent"} className="text-[10px] font-bold">
                  {teacherMode === "homeroom" ? "🏫 Mode Wali Kelas (XI-A)" : "📐 Mode Guru Mapel (B. Indo)"}
                </Badge>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Assignment Engine
                </span>
              )}
            </div>
            <p className="text-xs text-muted">
              Akun: <span className="font-mono text-brand font-medium">{loggedEmail}</span>
              {isHomeroomTeacher && teacherMode === "homeroom" ? (
                <span> • Pembimbing Kelas XI-A (5 Siswa Bimbingan)</span>
              ) : (
                <span> • Memiliki {teacherAssignments.length} Penugasan Aktif</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dual-Mode Switcher (Wali Kelas vs Guru Mapel) */}
          {isHomeroomTeacher && (
            <div className="flex items-center p-1 rounded-xl bg-surface2 border border-border shadow-inner">
              <button
                type="button"
                onClick={() => setTeacherMode("homeroom")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  teacherMode === "homeroom"
                    ? "bg-brand text-bg shadow-sm"
                    : "text-muted hover:text-text"
                }`}
              >
                <School size={14} />
                <span>Mode Wali Kelas</span>
              </button>
              <button
                type="button"
                onClick={() => setTeacherMode("subject")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  teacherMode === "subject"
                    ? "bg-brand text-bg shadow-sm"
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

      {/* 2. DUAL MODE: WALI KELAS VS GURU MAPEL */}
      {isHomeroomTeacher && teacherMode === "homeroom" ? (
        <div className="space-y-6">
          {/* A. Homeroom Banner */}
          <div
            className="p-6 rounded-2xl border border-brand/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            style={{
              background: "linear-gradient(135deg, rgba(var(--brand-rgb), 0.12), var(--surface2) 60%, rgba(var(--brand-rgb), 0.05))",
            }}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="brand" className="text-xs font-bold">Wali Kelas XI-A</Badge>
                <Badge variant="neutral" className="text-xs">SMA Kelas 11 (Fase F)</Badge>
                <span className="text-xs text-muted">Tahun Ajaran 2026/2027 • Semester Ganjil</span>
              </div>
              <h2 className="text-2xl font-bold font-serif text-text">
                Dashboard Rekapitulasi Lintas Mata Pelajaran
              </h2>
              <p className="text-xs text-muted max-w-2xl leading-relaxed">
                Pemantauan komprehensif 5 mata pelajaran (Matematika, Bahasa Indonesia, Fisika, Kimia, Ekonomi) untuk seluruh siswa Kelas XI-A. Deteksi dini miskonsepsi lintas mapel dan risiko akademik holistik.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-semibold text-text flex items-center gap-1.5 shadow-sm">
                <Users size={14} className="text-brand" />
                <span>5 Siswa Bimbingan</span>
              </span>
            </div>
          </div>

          {/* B. KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 space-y-1 border-border bg-surface">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-bold uppercase tracking-wider">Total Siswa Kelas</span>
                <Users size={18} className="text-brand" />
              </div>
              <div className="text-2xl font-black font-serif text-text">5 Siswa</div>
              <p className="text-[11px] text-muted">100% aktif bimbingan di Kelas XI-A</p>
            </Card>

            <Card className="p-4 space-y-1 border-border bg-surface">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-bold uppercase tracking-wider">Rata-Rata Lintas Mapel</span>
                <TrendingUp size={18} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-black font-serif text-emerald-400">75.8</div>
              <p className="text-[11px] text-muted">Batas Standar KKM Sekolah: 75.0</p>
            </Card>

            <Card className="p-4 space-y-1 border-red-500/30 bg-red-500/5">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">Risiko Tinggi</span>
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <div className="text-2xl font-black font-serif text-red-400">1 Siswa</div>
              <p className="text-[11px] text-red-300">Doni Setiawan (Lemah B. Indo &amp; Kimia)</p>
            </Card>

            <Card className="p-4 space-y-1 border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Prestasi Mandiri</span>
                <Award size={18} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-black font-serif text-emerald-400">3 Siswa</div>
              <p className="text-[11px] text-emerald-300">Andi, Siti, &amp; Rania (&gt; 80.0)</p>
            </Card>
          </div>

          {/* Sub-Tab Switcher: Rekapitulasi vs Roster Siswa Rombel vs Tracer Study */}
          <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setHomeroomTab("rekap")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                homeroomTab === "rekap"
                  ? "bg-brand text-bg shadow-md"
                  : "text-muted hover:text-text bg-surface2 border border-border"
              }`}
            >
              <BarChart3 size={15} />
              <span>📊 Rekapitulasi Lintas Mapel</span>
            </button>
            <button
              type="button"
              onClick={() => setHomeroomTab("roster")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                homeroomTab === "roster"
                  ? "bg-brand text-bg shadow-md"
                  : "text-muted hover:text-text bg-surface2 border border-border"
              }`}
            >
              <Users size={15} />
              <span>👥 Daftar Siswa Rombel (Kelas XI-A) ({homeroomStudents.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setHomeroomTab("tracer")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                homeroomTab === "tracer"
                  ? "bg-brand text-bg shadow-md"
                  : "text-muted hover:text-text bg-surface2 border border-border"
              }`}
            >
              <Target size={15} />
              <span>🎯 Tracer Study &amp; Karir Rombel</span>
            </button>
          </div>

          {homeroomTab === "rekap" ? (
            /* C. Tabel Rekapitulasi Lintas Mata Pelajaran */
            <Card className="p-5 space-y-4 border-border bg-surface shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold font-serif text-text flex items-center gap-2">
                    <BarChart3 size={18} className="text-brand" />
                    <span>Tabel Rekapitulasi Nilai Lintas 5 Mata Pelajaran</span>
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Nilai dihimpun otomatis dari penilaian guru mapel masing-masing (Matematika, B. Indo, Fisika, Kimia, Ekonomi).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface2 border border-border">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>≥75 KKM Tercapai</span>
                  </span>
                  <span className="text-[11px] text-muted flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface2 border border-border">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span>&lt;75 Perlu Remedial</span>
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface2 text-muted border-b border-border uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">No</th>
                      <th className="p-3.5">Siswa &amp; Identitas</th>
                      <th className="p-3.5 text-center">Matematika</th>
                      <th className="p-3.5 text-center">B. Indonesia</th>
                      <th className="p-3.5 text-center">Fisika</th>
                      <th className="p-3.5 text-center">Kimia</th>
                      <th className="p-3.5 text-center">Ekonomi</th>
                      <th className="p-3.5 text-center">Rata-Rata</th>
                      <th className="p-3.5">Diagnosis Risiko Belajar</th>
                      <th className="p-3.5 text-center">Aksi Wali Kelas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {homeroomStudents.map((s, idx) => {
                      const isHighRisk = s.riskLevel === "high";
                      const isMedRisk = s.riskLevel === "medium";

                      return (
                        <tr
                          key={s.id}
                          className={`hover:bg-surface2/60 transition-colors ${
                            isHighRisk ? "bg-red-500/[0.04]" : isMedRisk ? "bg-amber-500/[0.03]" : ""
                          }`}
                        >
                          <td className="p-3.5 font-bold text-muted">{idx + 1}</td>
                          <td className="p-3.5">
                            <div className="font-bold text-text text-sm flex items-center gap-1.5">
                              <span>{s.name}</span>
                              {isHighRisk && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                                  Butuh Perhatian
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted font-mono mt-0.5">
                              NISN: {s.nisn} • {s.email}
                            </div>
                          </td>

                          {/* Nilai Mapel: Matematika */}
                          <td className="p-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg font-bold font-mono text-xs ${
                                s.scores.matematika >= 75
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {s.scores.matematika}
                            </span>
                          </td>

                          {/* Nilai Mapel: Bahasa Indonesia */}
                          <td className="p-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg font-bold font-mono text-xs ${
                                s.scores.bahasaIndonesia >= 75
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {s.scores.bahasaIndonesia}
                            </span>
                          </td>

                          {/* Nilai Mapel: Fisika */}
                          <td className="p-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg font-bold font-mono text-xs ${
                                s.scores.fisika >= 75
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {s.scores.fisika}
                            </span>
                          </td>

                          {/* Nilai Mapel: Kimia */}
                          <td className="p-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg font-bold font-mono text-xs ${
                                s.scores.kimia >= 75
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {s.scores.kimia}
                            </span>
                          </td>

                          {/* Nilai Mapel: Ekonomi */}
                          <td className="p-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg font-bold font-mono text-xs ${
                                s.scores.ekonomi >= 75
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {s.scores.ekonomi}
                            </span>
                          </td>

                          {/* Rata-Rata */}
                          <td className="p-3.5 text-center">
                            <span className="font-extrabold font-mono text-sm text-text">
                              {s.overallAverage.toFixed(1)}
                            </span>
                          </td>

                          {/* Diagnosis Risiko */}
                          <td className="p-3.5 max-w-xs">
                            <div
                              className={`p-2 rounded-xl text-xs leading-relaxed border ${
                                isHighRisk
                                  ? "bg-red-500/10 border-red-500/30 text-red-300 font-semibold"
                                  : isMedRisk
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                              }`}
                            >
                              {s.riskDescription}
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="p-3.5 text-center">
                            {isHighRisk || isMedRisk ? (
                              <button
                                type="button"
                                onClick={() => handleOpenConsultationModal(s)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-all flex items-center gap-1.5 whitespace-nowrap mx-auto shadow-sm"
                              >
                                <AlertTriangle size={13} />
                                <span>Undang Pembimbingan Ortu</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenAppreciationModal(s)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all flex items-center gap-1.5 whitespace-nowrap mx-auto shadow-sm"
                              >
                                <HeartHandshake size={13} />
                                <span>Kirim Catatan Apresiasi</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : homeroomTab === "roster" ? (
            /* D. Roster Siswa Rombel (Kelas XI-A) & Manajemen Kenaikan Kelas */
            <Card className="p-6 space-y-5 border-border bg-surface shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold font-serif text-text flex items-center gap-2">
                    <Users size={18} className="text-brand" />
                    <span>Daftar Siswa Bimbingan Rombel XI-A ({filteredHomeroomStudents.length})</span>
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Wali Kelas mengelola kenaikan jenjang (Fase F Kelas 11 $\rightarrow$ Kelas 12), seleksi massal, dan administrasi rombel.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setSelectedStudentEmails(filteredHomeroomStudents.map((s) => s.email.toLowerCase()));
                      setShowBulkPromotionModal(true);
                    }}
                    className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-1.5"
                  >
                    <Rocket size={14} />
                    <span>🚀 Kenaikan Kelas Massal Seluruh Rombel</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowHomeroomBulkModal(true)}
                    className="text-xs font-bold"
                  >
                    <FileSpreadsheet size={14} className="text-accent" />
                    <span>📥 Import Excel / CSV</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowAddHomeroomStudentModal(true)}
                    className="text-xs font-bold"
                  >
                    <UserPlus size={14} />
                    <span>+ Tambah Siswa</span>
                  </Button>
                </div>
              </div>

              {/* Multi-Select Floating Action Bar */}
              {selectedStudentEmails.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs text-text font-bold">
                    <CheckSquare size={16} className="text-blue-400" />
                    <span>{selectedStudentEmails.length} dari {filteredHomeroomStudents.length} Siswa Terpilih</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleExecuteBulkPromotion("promote")}
                      loading={isProcessingBulkPromotion}
                      className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow"
                    >
                      <Rocket size={13} />
                      <span>🚀 Naikkan Terpilih ke Kelas XII-A ({selectedStudentEmails.length})</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleExecuteBulkPromotion("retain")}
                      loading={isProcessingBulkPromotion}
                      className="text-xs font-bold text-red-400 border-red-500/30 hover:bg-red-500/10"
                    >
                      <span>🔴 Tetapkan Tinggal Kelas</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleExecuteBulkPromotion("reset")}
                      loading={isProcessingBulkPromotion}
                      className="text-xs font-bold text-muted hover:text-text"
                    >
                      <RotateCcw size={13} />
                      <span>Reset</span>
                    </Button>
                    <button
                      type="button"
                      onClick={() => setSelectedStudentEmails([])}
                      className="text-xs text-muted hover:text-text underline ml-1"
                    >
                      Batal Pilih
                    </button>
                  </div>
                </div>
              )}

              {/* Filter Search */}
              <div className="flex items-center justify-between gap-4">
                <div className="relative w-full max-w-xs">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    placeholder="Cari nama siswa / NISN..."
                    value={homeroomSearch}
                    onChange={(e) => setHomeroomSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border bg-surface2 text-xs outline-none focus:border-brand text-text"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="brand" className="text-xs">
                    Rombel Asal: Kelas 2-A (XI-A)
                  </Badge>
                  <span className="text-xs text-muted">➔</span>
                  <Badge variant="accent" className="text-xs">
                    Tujuan: Kelas 3-A (XII-A)
                  </Badge>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface2 text-muted border-b border-border uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            filteredHomeroomStudents.length > 0 &&
                            selectedStudentEmails.length === filteredHomeroomStudents.length
                          }
                          onChange={handleToggleSelectAll}
                          className="w-4 h-4 rounded border-border text-brand focus:ring-brand cursor-pointer"
                          title="Pilih Semua Siswa"
                        />
                      </th>
                      <th className="p-3.5">No</th>
                      <th className="p-3.5">Nama Siswa</th>
                      <th className="p-3.5">NISN</th>
                      <th className="p-3.5">Email Akun</th>
                      <th className="p-3.5">Kelas / Rombel</th>
                      <th className="p-3.5 text-center">Status Akademik</th>
                      <th className="p-3.5 text-right">Aksi Wali Kelas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredHomeroomStudents.map((s, idx) => {
                      const isSelected = selectedStudentEmails.includes(s.email.toLowerCase());
                      const isPromoted = s.promotionStatus === "promoted";
                      const isRetained = s.promotionStatus === "retained";
                      const isGraduated = s.status === "graduated" || s.promotionStatus === "graduated";

                      return (
                        <tr
                          key={s.id}
                          className={`transition-colors ${
                            isSelected
                              ? "bg-blue-500/[0.08]"
                              : isPromoted
                              ? "bg-blue-500/[0.03]"
                              : isRetained
                              ? "bg-red-500/[0.03]"
                              : "hover:bg-surface2/60"
                          }`}
                        >
                          <td className="p-3.5 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectStudent(s.email)}
                              className="w-4 h-4 rounded border-border text-brand focus:ring-brand cursor-pointer"
                            />
                          </td>
                          <td className="p-3.5 font-bold text-muted">{idx + 1}</td>
                          <td className="p-3.5">
                            <div className="font-bold text-text text-sm flex items-center gap-1.5">
                              <span>{s.name}</span>
                              {isPromoted && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                                  Promoted
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted">
                              Rata-Rata Nilai: <strong className="text-text font-mono">{s.overallAverage.toFixed(1)}</strong>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-muted">{s.nisn}</td>
                          <td className="p-3.5 font-mono text-brand font-medium">{s.email}</td>
                          <td className="p-3.5">
                            <Badge
                              variant={isPromoted ? "accent" : "neutral"}
                              className="text-[10px]"
                            >
                              {isPromoted ? s.classGroup || "Kelas XII-A" : "Kelas XI-A"}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-center">
                            {isPromoted ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                🚀 Naik ke Kelas XII-A
                              </span>
                            ) : isRetained ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                                🔴 Tinggal di Kelas XI-A
                              </span>
                            ) : isGraduated ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                🎓 Lulus / Alumni
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                🟢 Aktif di Kelas XI-A
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isPromoted ? (
                                <button
                                  type="button"
                                  onClick={() => handlePromoteStudentAction(s, "reset")}
                                  className="px-2.5 py-1 rounded-lg transition-colors text-xs font-semibold bg-surface2 border border-border text-muted hover:text-text flex items-center gap-1"
                                  title="Batalkan kenaikan kelas"
                                >
                                  <RotateCcw size={12} />
                                  <span>Batal Naik</span>
                                </button>
                              ) : isRetained ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handlePromoteStudentAction(s, "promote")}
                                    className="px-2.5 py-1 rounded-lg transition-colors text-xs font-bold bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30 flex items-center gap-1"
                                    title="Naikkan ke Kelas XII-A"
                                  >
                                    <Rocket size={12} />
                                    <span>Naikkan</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handlePromoteStudentAction(s, "reset")}
                                    className="px-2 py-1 rounded-lg transition-colors text-xs text-muted hover:text-text"
                                    title="Kembalikan status"
                                  >
                                    Reset
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handlePromoteStudentAction(s, "promote")}
                                    className="px-3 py-1.5 rounded-xl transition-colors text-xs font-bold bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30 flex items-center gap-1 shadow-sm"
                                    title="Naikkan siswa ke Kelas XII-A"
                                  >
                                    <Rocket size={13} />
                                    <span>Naik ke Kelas XII</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handlePromoteStudentAction(s, "retain")}
                                    className="px-2 py-1.5 rounded-xl transition-colors text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                                    title="Tetapkan siswa tinggal kelas"
                                  >
                                    <span>Tinggal</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredHomeroomStudents.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-muted">
                          Tidak ada siswa yang sesuai pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            /* E. Tracer Study & Karir Siswa Bimbingan Rombel (Wali Kelas) */
            <div className="space-y-6">
              <Card className="p-6 space-y-5 border-border bg-surface shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold font-serif text-text flex items-center gap-2">
                      <Target size={18} className="text-brand" />
                      <span>Pelacakan Minat &amp; Tracer Study Siswa Rombel XI-A</span>
                    </h3>
                    <p className="text-xs text-muted mt-0.5">
                      Pantau pemetaan rencana sebelum lulus vs realisasi pasca-kelulusan: Kuliah (PTN/PTS), Sekolah Kedinasan (SEKDIN), Bekerja, Wirausaha, dan yang Sedang Mencari Kerja.
                    </p>
                  </div>
                </div>

                {/* Metric Summary Counters */}
                {(() => {
                  const rombelTracer = homeroomTracerRecords.filter((r) =>
                    homeroomStudents.some((hs) => hs.email.toLowerCase() === r.email.toLowerCase()) ||
                    r.classOrigin.includes("XI") ||
                    r.classOrigin.includes("2-A")
                  );
                  const total = rombelTracer.length || 1;
                  const kuliah = rombelTracer.filter((r) => r.realizationStatus === "Kuliah").length;
                  const sekdin = rombelTracer.filter((r) => r.realizationStatus === "Kedinasan").length;
                  const kerja = rombelTracer.filter((r) => r.realizationStatus === "Bekerja").length;
                  const usaha = rombelTracer.filter((r) => r.realizationStatus === "Wirausaha").length;
                  const mencari = rombelTracer.filter((r) => r.realizationStatus === "Mencari Kerja").length;

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      <div className="p-3.5 rounded-xl bg-surface2 border border-border space-y-0.5">
                        <span className="text-[10px] font-bold text-muted uppercase">Total Rombel</span>
                        <div className="text-xl font-black font-serif text-text">{rombelTracer.length} Siswa</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-0.5">
                        <span className="text-[10px] font-bold text-blue-400 uppercase">🎓 Kuliah</span>
                        <div className="text-xl font-black font-serif text-blue-300">{kuliah} ({Math.round((kuliah/total)*100)}%)</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-0.5">
                        <span className="text-[10px] font-bold text-purple-400 uppercase">🏛️ Kedinasan</span>
                        <div className="text-xl font-black font-serif text-purple-300">{sekdin} ({Math.round((sekdin/total)*100)}%)</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-0.5">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">💼 Bekerja</span>
                        <div className="text-xl font-black font-serif text-emerald-300">{kerja} ({Math.round((kerja/total)*100)}%)</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-0.5">
                        <span className="text-[10px] font-bold text-amber-400 uppercase">🚀 Wirausaha</span>
                        <div className="text-xl font-black font-serif text-amber-300">{usaha} ({Math.round((usaha/total)*100)}%)</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 space-y-0.5">
                        <span className="text-[10px] font-bold text-red-400 uppercase">⏳ Belum Kerja</span>
                        <div className="text-xl font-black font-serif text-red-300">{mencari} ({Math.round((mencari/total)*100)}%)</div>
                      </div>
                    </div>
                  );
                })()}

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: "all", label: "Semua Realisasi" },
                      { id: "Kuliah", label: "🎓 Kuliah" },
                      { id: "Kedinasan", label: "🏛️ Kedinasan" },
                      { id: "Bekerja", label: "💼 Bekerja" },
                      { id: "Wirausaha", label: "🚀 Wirausaha" },
                      { id: "Mencari Kerja", label: "⏳ Belum Kerja" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setHomeroomTracerFilter(f.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          homeroomTracerFilter === f.id
                            ? "bg-brand text-bg shadow font-bold"
                            : "bg-surface2 text-muted hover:text-text border border-border"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      placeholder="Cari siswa / kampus / instansi..."
                      value={homeroomTracerSearch}
                      onChange={(e) => setHomeroomTracerSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-border bg-surface2 text-xs outline-none focus:border-brand w-56 text-text"
                    />
                  </div>
                </div>

                {/* Table Rombel Tracer */}
                <div className="overflow-x-auto border border-border rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface2 text-muted border-b border-border uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3.5">Nama Siswa &amp; NISN</th>
                        <th className="p-3.5">Rencana Pra-Kelulusan</th>
                        <th className="p-3.5">Target Rencana</th>
                        <th className="p-3.5">Realisasi Pasca-Lulus</th>
                        <th className="p-3.5">Detail Instansi / Perusahaan</th>
                        <th className="p-3.5 text-center">Status Verifikasi</th>
                        <th className="p-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(() => {
                        const list = homeroomTracerRecords.filter((r) => {
                          const isRombel =
                            homeroomStudents.some((hs) => hs.email.toLowerCase() === r.email.toLowerCase()) ||
                            r.classOrigin.includes("XI") ||
                            r.classOrigin.includes("2-A");
                          const matchFilter =
                            homeroomTracerFilter === "all" || r.realizationStatus === homeroomTracerFilter;
                          const matchSearch =
                            r.studentName.toLowerCase().includes(homeroomTracerSearch.toLowerCase()) ||
                            r.email.toLowerCase().includes(homeroomTracerSearch.toLowerCase()) ||
                            r.plannedTarget.toLowerCase().includes(homeroomTracerSearch.toLowerCase()) ||
                            r.realizationDetail.toLowerCase().includes(homeroomTracerSearch.toLowerCase());
                          return isRombel && matchFilter && matchSearch;
                        });

                        if (list.length === 0) {
                          return (
                            <tr>
                              <td colSpan={7} className="text-center py-8 text-muted italic">
                                Tidak ada data tracer study yang sesuai dengan filter siswa rombel ini.
                              </td>
                            </tr>
                          );
                        }

                        return list.map((r) => (
                          <tr key={r.id} className="hover:bg-surface2/60 transition-colors">
                            <td className="p-3.5">
                              <div className="font-bold text-text text-sm">{r.studentName}</div>
                              <div className="text-[11px] text-muted font-mono">{r.email} • {r.nisn}</div>
                            </td>
                            <td className="p-3.5">
                              <Badge variant="accent" className="text-[10px] font-bold">{r.plannedPathway}</Badge>
                            </td>
                            <td className="p-3.5">
                              <div className="font-medium text-text text-[11px] truncate max-w-[170px]">{r.plannedTarget}</div>
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  r.realizationStatus === "Kuliah"
                                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                    : r.realizationStatus === "Kedinasan"
                                    ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                                    : r.realizationStatus === "Bekerja"
                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                    : r.realizationStatus === "Wirausaha"
                                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                    : "bg-red-500/15 text-red-400 border border-red-500/30"
                                }`}
                              >
                                {r.realizationStatus === "Kuliah" && "🎓 Diterima Kuliah"}
                                {r.realizationStatus === "Kedinasan" && "🏛️ Diterima Kedinasan"}
                                {r.realizationStatus === "Bekerja" && "💼 Bekerja"}
                                {r.realizationStatus === "Wirausaha" && "🚀 Wirausaha"}
                                {r.realizationStatus === "Mencari Kerja" && "⏳ Belum Bekerja"}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="font-medium text-text text-[11px]">{r.realizationDetail || "-"}</div>
                            </td>
                            <td className="p-3.5 text-center">
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                                <CheckCircle2 size={12} />
                                <span>Terverifikasi</span>
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setEditingHomeroomTracer(r)}
                                className="text-xs px-2.5 py-1 rounded-lg"
                              >
                                <span>Perbarui</span>
                              </Button>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Modal Edit Tracer oleh Wali Kelas */}
              {editingHomeroomTracer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                  <Card className="w-full max-w-lg p-6 sm:p-8 space-y-5 border-border shadow-2xl bg-surface max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex items-center gap-2">
                        <Target className="text-brand w-5 h-5" />
                        <h3 className="text-base font-bold font-serif text-text">
                          Perbarui Status Tracer: {editingHomeroomTracer.studentName}
                        </h3>
                      </div>
                      <button
                        onClick={() => setEditingHomeroomTracer(null)}
                        className="text-muted hover:text-text p-1"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleUpdateHomeroomTracer} className="space-y-4">
                      <div className="p-3 rounded-xl bg-surface2 border border-border text-xs space-y-1">
                        <div className="text-muted">Nama: <strong className="text-text">{editingHomeroomTracer.studentName}</strong></div>
                        <div className="text-muted">Email: <span className="font-mono text-brand">{editingHomeroomTracer.email}</span></div>
                        <div className="text-muted">Rencana Awal Siswa: <span className="font-bold text-brand">{editingHomeroomTracer.plannedPathway} - {editingHomeroomTracer.plannedTarget}</span></div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1.5">
                          Status Realisasi Pasca-Kelulusan *
                        </label>
                        <select
                          value={editingHomeroomTracer.realizationStatus}
                          onChange={(e) =>
                            setEditingHomeroomTracer({
                              ...editingHomeroomTracer,
                              realizationStatus: e.target.value as any,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                        >
                          <option value="Kuliah">🎓 Diterima Kuliah (PTN / PTS)</option>
                          <option value="Kedinasan">🏛️ Diterima Sekolah Kedinasan (SEKDIN)</option>
                          <option value="Bekerja">💼 Sudah Bekerja</option>
                          <option value="Wirausaha">🚀 Wirausaha</option>
                          <option value="Mencari Kerja">⏳ Belum Bekerja / Masih Mencari</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1.5">
                          Keterangan / Nama Kampus / Sekolah Kedinasan / Perusahaan *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingHomeroomTracer.realizationDetail}
                          onChange={(e) =>
                            setEditingHomeroomTracer({
                              ...editingHomeroomTracer,
                              realizationDetail: e.target.value,
                            })
                          }
                          placeholder="Contoh: Diterima di PKN STAN / PT Telkom"
                          className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs text-text outline-none focus:border-brand"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1.5">
                          Status Verifikasi Bukti
                        </label>
                        <select
                          value={editingHomeroomTracer.verificationStatus}
                          onChange={(e) =>
                            setEditingHomeroomTracer({
                              ...editingHomeroomTracer,
                              verificationStatus: e.target.value as any,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                        >
                          <option value="verified">✅ Terverifikasi (Telah Dicek Bukti Pengumuman/Surat)</option>
                          <option value="pending">⏳ Menunggu Verifikasi Bukti</option>
                        </select>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-border">
                        <Button variant="secondary" onClick={() => setEditingHomeroomTracer(null)}>
                          Batal
                        </Button>
                        <Button variant="primary" type="submit" loading={isUpdatingHomeroomTracer}>
                          <span>Simpan Perubahan</span>
                          <Check size={16} />
                        </Button>
                      </div>
                    </form>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
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
      )}

      {/* 5. INTERACTIVE MODAL FOR HOMEROOM ACTION */}
      {activeHomeroomActionStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl rounded-2xl border border-border bg-surface p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    homeroomActionType === "appreciation"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-red-500/20 text-red-400 border border-red-500/40"
                  }`}
                >
                  {homeroomActionType === "appreciation" ? <HeartHandshake size={20} /> : <AlertTriangle size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-text">
                    {homeroomActionType === "appreciation"
                      ? "Kirim Catatan Apresiasi Siswa"
                      : "Undangan Pembimbingan & Konsultasi Orang Tua"}
                  </h3>
                  <p className="text-xs text-muted">
                    Kelas XI-A • Dikirim langsung oleh Wali Kelas: Brio Pratama, S.Pd
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveHomeroomActionStudent(null)}
                className="p-1 rounded-lg text-muted hover:text-text hover:bg-surface2"
              >
                <X size={18} />
              </button>
            </div>

            {/* Student Preview Pill */}
            <div className="p-3.5 rounded-xl bg-surface2 border border-border flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-text">{activeHomeroomActionStudent.name}</span>
                <span className="text-muted ml-2 font-mono">NISN: {activeHomeroomActionStudent.nisn}</span>
              </div>
              <Badge
                variant={activeHomeroomActionStudent.riskLevel === "high" ? "neutral" : "brand"}
                className="font-mono font-bold"
              >
                Rata-Rata: {activeHomeroomActionStudent.overallAverage.toFixed(1)}
              </Badge>
            </div>

            {/* Note Editor */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text">Pesan Resmi Wali Kelas:</label>
              <textarea
                rows={4}
                value={homeroomNoteMessage}
                onChange={(e) => setHomeroomNoteMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-surface2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-brand leading-relaxed"
                placeholder="Tuliskan pesan pembimbingan atau apresiasi untuk orang tua dan siswa..."
              />
            </div>

            {/* Delivery Channels */}
            <div className="p-3 rounded-xl bg-surface2/60 border border-border space-y-1 text-[11px] text-muted">
              <span className="font-semibold text-text flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" />
                Saluran Pengiriman Resmi Terintegrasi:
              </span>
              <div className="flex items-center gap-3 pt-1">
                <span className="px-2 py-0.5 rounded bg-surface border border-border">🔔 Notifikasi Portal Siswa NALARA</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-border">📱 Pesan WhatsApp Gateway Orang Tua</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveHomeroomActionStudent(null)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendHomeroomNote}
                className="font-bold shadow-md"
              >
                <Send size={14} />
                <span>Kirim Pesan Resmi</span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 5. HOMEROOM: MODAL TAMBAH SISWA MANUAL */}
      {showAddHomeroomStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg p-6 rounded-2xl border border-border shadow-2xl bg-surface space-y-5"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="text-brand w-5 h-5" />
                <h3 className="text-lg font-bold font-serif text-text">Tambah Siswa Baru ke Kelas XI-A</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddHomeroomStudentModal(false)}
                className="text-muted hover:text-text p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-surface2 border border-border space-y-1 text-xs">
              <div className="font-semibold text-text">Otoritas Wali Kelas Mandiri:</div>
              <div className="text-muted text-[11px]">
                Siswa akan langsung didaftarkan ke rombel <strong>Kelas 2-A (XI-A)</strong> dan terdaftar di database autentikasi NALARA.
              </div>
            </div>

            <form onSubmit={handleAddHomeroomStudent} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted font-bold uppercase mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Raditya Permana"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-muted font-bold uppercase mb-1">Email Akun Sekolah</label>
                <input
                  type="email"
                  required
                  placeholder="misal: raditya.xi@sekolah.sch.id"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted font-bold uppercase mb-1">NISN Siswa</label>
                  <input
                    type="text"
                    placeholder="misal: 0081987654"
                    value={newStudentNisn}
                    onChange={(e) => setNewStudentNisn(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand font-mono"
                  />
                </div>

                <div>
                  <label className="block text-muted font-bold uppercase mb-1">Password Akun</label>
                  <input
                    type="text"
                    value={newStudentPassword}
                    onChange={(e) => setNewStudentPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAddHomeroomStudentModal(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={isSubmittingHomeroomStudent}
                  className="font-bold shadow-md"
                >
                  <CheckCircle2 size={14} />
                  <span>Daftarkan ke Kelas XI-A</span>
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 6. HOMEROOM: MODAL BULK IMPORT CSV / EXCEL */}
      {showHomeroomBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl p-6 rounded-2xl border border-border shadow-2xl bg-surface space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-accent w-5 h-5" />
                <h3 className="text-lg font-bold font-serif text-text">Import Siswa Rombel XI-A dari Excel / CSV</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHomeroomBulkModal(false)}
                className="text-muted hover:text-text p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-surface2 border border-border">
              <span className="text-xs text-muted">Unduh format CSV standar rombel kelas XI-A:</span>
              <Button size="sm" variant="secondary" onClick={handleDownloadHomeroomCsvTemplate} className="text-xs">
                <Download size={14} />
                <span>Unduh Template CSV</span>
              </Button>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted uppercase mb-2">
                Upload File Excel / CSV (.csv, .txt)
              </label>
              <input
                type="file"
                ref={homeroomFileInputRef}
                accept=".csv,.txt"
                onChange={handleHomeroomFileUpload}
                className="w-full text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand file:text-bg hover:file:opacity-90"
              />
              {homeroomBulkFileName && (
                <p className="text-[11px] text-brand mt-1 font-mono">File terpilih: {homeroomBulkFileName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-muted uppercase mb-1">
                Atau Tempel (Paste) Teks CSV di sini
              </label>
              <textarea
                rows={3}
                value={homeroomCsvRaw}
                onChange={(e) => handleHomeroomCsvParse(e.target.value)}
                placeholder="Nama Siswa,Email,NISN,Password&#10;Budi Santoso,budi.xi@sekolah.sch.id,0081234591,password123"
                className="w-full p-2.5 rounded-xl border border-border bg-surface2 font-mono text-xs text-text focus:outline-none focus:border-brand"
              />
            </div>

            {homeroomBulkParsed.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text">
                    Pratinjau Siswa Terdeteksi ({homeroomBulkParsed.length} Siswa):
                  </span>
                  <Badge variant="accent" className="text-[10px]">Kelas 2-A (XI-A)</Badge>
                </div>
                <div className="max-h-48 overflow-y-auto border border-border rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface2 text-muted border-b border-border sticky top-0">
                      <tr>
                        <th className="p-2">Nama</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">NISN</th>
                        <th className="p-2">Password</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-mono text-[11px]">
                      {homeroomBulkParsed.map((p, idx) => (
                        <tr key={idx} className="hover:bg-surface2/50">
                          <td className="p-2 font-sans font-medium text-text">{p.name}</td>
                          <td className="p-2 text-brand">{p.email}</td>
                          <td className="p-2 text-muted">{p.nisn}</td>
                          <td className="p-2 text-muted">{p.password}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowHomeroomBulkModal(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={homeroomBulkParsed.length === 0}
                loading={isImportingHomeroomBulk}
                onClick={handleHomeroomBulkSubmit}
                className="font-bold shadow-md"
              >
                <CheckCircle2 size={14} />
                <span>Import {homeroomBulkParsed.length} Siswa ke Kelas XI-A</span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 7. HOMEROOM: MODAL KENAIKAN KELAS MASSAL (1-KLIK PROSES SELURUH ROMBEL) */}
      {showBulkPromotionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl p-6 rounded-2xl border border-blue-500/40 shadow-2xl bg-surface space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Rocket size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-text">
                    Kenaikan Kelas Massal Rombel XI-A
                  </h3>
                  <p className="text-xs text-muted">
                    Proses kenaikan jenjang dari SMA Kelas 11 (Fase F) ke SMA Kelas 12 (Tingkat Akhir)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBulkPromotionModal(false)}
                className="text-muted hover:text-text p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Target Configuration Card */}
            <div className="p-4 rounded-xl bg-surface2 border border-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-muted font-bold uppercase mb-1">Rombel Asal (Saat Ini):</label>
                <div className="font-bold text-text bg-surface p-2.5 rounded-xl border border-border flex items-center justify-between">
                  <span>Kelas 2-A (XI-A)</span>
                  <Badge variant="neutral" className="text-[10px]">Fase F (Kelas 11)</Badge>
                </div>
              </div>
              <div>
                <label className="block text-muted font-bold uppercase mb-1">Rombel Tujuan (Kenaikan):</label>
                <div className="font-bold text-brand bg-surface p-2.5 rounded-xl border border-brand/40 flex items-center justify-between">
                  <span>{targetPromotionClass}</span>
                  <Badge variant="brand" className="text-[10px]">Fase F (Kelas 12)</Badge>
                </div>
              </div>
            </div>

            {/* Student Checklist Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text">
                  Daftar Siswa yang Akan Dinaikkan ({selectedStudentEmails.length} dari {filteredHomeroomStudents.length}):
                </span>
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="text-brand font-semibold hover:underline"
                >
                  {selectedStudentEmails.length === filteredHomeroomStudents.length ? "Batal Pilih Semua" : "Pilih Semua Siswa"}
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto border border-border rounded-xl divide-y divide-border">
                {filteredHomeroomStudents.map((s) => {
                  const isChecked = selectedStudentEmails.includes(s.email.toLowerCase());
                  const isHighRisk = s.riskLevel === "high";

                  return (
                    <div
                      key={s.id}
                      onClick={() => handleToggleSelectStudent(s.email)}
                      className={`p-3 flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors ${
                        isChecked ? "bg-blue-500/[0.06]" : "hover:bg-surface2"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-border text-brand focus:ring-brand cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-text flex items-center gap-1.5">
                            <span>{s.name}</span>
                            {isHighRisk && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                                Berisiko Tinggi
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted font-mono">{s.email}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-text">
                          Rata-Rata: {s.overallAverage.toFixed(1)}
                        </div>
                        <span className={`text-[10px] font-semibold ${s.overallAverage >= 75 ? "text-emerald-400" : "text-red-400"}`}>
                          {s.overallAverage >= 75 ? "✓ Layak Naik Kelas" : "⚠ Perlu Evaluasi"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note & Confirmation */}
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-blue-200">
                <Rocket size={14} />
                <span>Otomatisasi Sistem:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Siswa yang dinaikkan akan otomatis beralih ke <strong>{targetPromotionClass}</strong> di database autentikasi. Saat login berikutnya, mereka langsung mendapatkan bank soal dan kurikulum Fase F Kelas 12 secara otomatis tanpa perlu registrasi ulang.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowBulkPromotionModal(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={selectedStudentEmails.length === 0}
                loading={isProcessingBulkPromotion}
                onClick={() => handleExecuteBulkPromotion("promote")}
                className="font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-1.5"
              >
                <Rocket size={14} />
                <span>Eksekusi Kenaikan ({selectedStudentEmails.length} Siswa)</span>
              </Button>
            </div>
          </motion.div>
        </div>
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
