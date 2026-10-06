"use client";

import React, { useState } from "react";
import {
  Shield,
  Users,
  BookOpen,
  PlusCircle,
  GraduationCap,
  Sparkles,
  LogOut,
  Search,
  CheckCircle2,
  Trash2,
  KeyRound,
  AlertCircle,
  School,
  UserPlus,
  Target,
  BadgePercent,
  Layers,
  UploadCloud,
  Download,
  FileSpreadsheet,
  Check,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, GlowCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { supabase } from "@/lib/supabase";

interface TeacherData {
  id: string;
  name: string;
  email: string;
  subject: string;
  gradeLevel: string;
  nip: string;
  classAssigned: string;
  password?: string;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  nisn: string;
  gradeLevel: string;
  classGroup: string;
  targetProgram: string;
  password?: string;
}

const INITIAL_TEACHERS: TeacherData[] = [
  {
    id: "t-0",
    name: "Brio Pratama",
    email: "brio@gmail.com",
    subject: "Bahasa Indonesia",
    gradeLevel: "Kelas XI (Kelas 2 SMA)",
    nip: "12334553211",
    classAssigned: "Kelas XI-A",
    password: "password123",
  },
  {
    id: "t-1",
    name: "Dra. Sri Wahyuni",
    email: "guru@sekolah.sch.id",
    subject: "Matematika",
    gradeLevel: "Kelas X, XI, XII",
    nip: "197508122000032001",
    classAssigned: "Kelas X-A, X-B",
    password: "password123",
  },
  {
    id: "t-2",
    name: "Ahmad Fauzi, S.Pd",
    email: "guru.indo@sekolah.sch.id",
    subject: "Bahasa Indonesia",
    gradeLevel: "Kelas X, XI",
    nip: "198203152006041005",
    classAssigned: "Kelas X-A, XI-IPA",
    password: "password123",
  },
  {
    id: "t-3",
    name: "Bambang Sudarmono, M.Si",
    email: "guru.sekdin@sekolah.sch.id",
    subject: "Persiapan Sekdin (TIU & TPA)",
    gradeLevel: "Kelas XII & Alumni",
    nip: "198006202005011003",
    classAssigned: "Kelas Intensif SEKDIN",
    password: "password123",
  },
];

const INITIAL_STUDENTS: StudentData[] = [
  {
    id: "s-1",
    name: "Andi Pratama",
    email: "andi@sekolah.sch.id",
    nisn: "0081234567",
    gradeLevel: "Kelas X (Kelas 1 SMA)",
    classGroup: "Kelas X-A",
    targetProgram: "SMA Reguler & Kedinasan",
    password: "password123",
  },
  {
    id: "s-2",
    name: "Doni Setiawan",
    email: "doni.s@sekolah.sch.id",
    nisn: "0081234568",
    gradeLevel: "Kelas XI (Kelas 2 SMA)",
    classGroup: "Kelas XI-A",
    targetProgram: "SMA Reguler",
    password: "password123",
  },
  {
    id: "s-3",
    name: "Siti Nurhaliza",
    email: "siti.n@sekolah.sch.id",
    nisn: "0081234569",
    gradeLevel: "Kelas XI (Kelas 2 SMA)",
    classGroup: "Kelas XI-A",
    targetProgram: "Persiapan UTBK / SNBT",
    password: "password123",
  },
  {
    id: "s-4",
    name: "Budi Santoso",
    email: "budi.s@sekolah.sch.id",
    nisn: "0081234570",
    gradeLevel: "Kelas XI (Kelas 2 SMA)",
    classGroup: "Kelas XI-B",
    targetProgram: "Sekolah Kedinasan (SEKDIN)",
    password: "password123",
  },
  {
    id: "s-5",
    name: "Rina Wulandari",
    email: "rina.w@sekolah.sch.id",
    nisn: "0081234571",
    gradeLevel: "Kelas XII (Kelas 3 SMA)",
    classGroup: "Kelas XII-IPA 1",
    targetProgram: "Persiapan UTBK & SEKDIN",
    password: "password123",
  },
];

export default function AdminDashboardPage() {
  const [adminTab, setAdminTab] = useState<"teachers" | "students">("teachers");

  // Teachers State
  const [teachers, setTeachers] = useState<TeacherData[]>(INITIAL_TEACHERS);
  const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [isSubmittingTeacher, setIsSubmittingTeacher] = useState(false);

  // Teacher Form State
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("password123");
  const [teacherSubject, setTeacherSubject] = useState("Matematika");
  const [teacherGradeLevel, setTeacherGradeLevel] = useState("Kelas X (Kelas 1 SMA)");
  const [teacherClassAssigned, setTeacherClassAssigned] = useState("Kelas X-A");
  const [teacherNip, setTeacherNip] = useState("");

  // Students State
  const [students, setStudents] = useState<StudentData[]>(INITIAL_STUDENTS);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false);

  // Student Form State
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentNisn, setStudentNisn] = useState("");
  const [studentPassword, setStudentPassword] = useState("password123");
  const [studentGradeLevel, setStudentGradeLevel] = useState("Kelas X (Kelas 1 SMA)");
  const [studentClassGroup, setStudentClassGroup] = useState("Kelas X-A");
  const [studentTargetProgram, setStudentTargetProgram] = useState("SMA Reguler");

  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Add Teacher Handler
  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim() || !teacherEmail.trim()) return;

    setIsSubmittingTeacher(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/create-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teacherName.trim(),
          email: teacherEmail.trim().toLowerCase(),
          password: teacherPassword.trim() || "password123",
          subject: teacherSubject,
          gradeLevel: teacherGradeLevel,
          nip: teacherNip.trim() || "-",
          classAssigned: teacherClassAssigned,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mendaftarkan guru");
      }

      const newTeacher: TeacherData = {
        id: data.teacher?.id || `t-${Date.now()}`,
        name: teacherName.trim(),
        email: teacherEmail.trim().toLowerCase(),
        subject: teacherSubject,
        gradeLevel: teacherGradeLevel,
        nip: teacherNip.trim() || "-",
        classAssigned: teacherClassAssigned,
        password: teacherPassword.trim() || "password123",
      };

      setTeachers([newTeacher, ...teachers]);
      setStatusMsg(`Guru ${teacherName} (${teacherEmail}) berhasil didaftarkan di Supabase Auth & DB!`);
      setTeacherName("");
      setTeacherEmail("");
      setTeacherNip("");

      setTimeout(() => {
        setShowAddTeacherForm(false);
        setStatusMsg(null);
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mendaftarkan guru";
      setStatusMsg(`Error: ${msg}`);
    } finally {
      setIsSubmittingTeacher(false);
    }
  };

  // Add Student Handler
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) return;

    setIsSubmittingStudent(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/create-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName.trim(),
          email: studentEmail.trim().toLowerCase(),
          nisn: studentNisn.trim() || "-",
          password: studentPassword.trim() || "password123",
          gradeLevel: studentGradeLevel,
          classGroup: studentClassGroup,
          targetProgram: studentTargetProgram,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mendaftarkan siswa");
      }

      const newStudent: StudentData = {
        id: data.student?.id || `s-${Date.now()}`,
        name: studentName.trim(),
        email: studentEmail.trim().toLowerCase(),
        nisn: studentNisn.trim() || "-",
        gradeLevel: studentGradeLevel,
        classGroup: studentClassGroup,
        targetProgram: studentTargetProgram,
        password: studentPassword.trim() || "password123",
      };

      setStudents([newStudent, ...students]);
      setStatusMsg(`Siswa ${studentName} (${studentEmail}) berhasil didaftarkan di Supabase Auth & DB!`);
      setStudentName("");
      setStudentEmail("");
      setStudentNisn("");

      setTimeout(() => {
        setShowAddStudentForm(false);
        setStatusMsg(null);
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mendaftarkan siswa";
      setStatusMsg(`Error: ${msg}`);
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  // Bulk Import State
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [csvRawText, setCsvRawText] = useState("");
  const [parsedBulkStudents, setParsedBulkStudents] = useState<StudentData[]>([]);
  const [isImportingBulk, setIsImportingBulk] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // File Upload Handler (Direct file picker from computer / Excel)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        handleParseCsv(content);
      }
    };
    reader.readAsText(file);
  };

  // Generate sample CSV template download (Configured with Semicolon & UTF-8 BOM so Excel opens in separate Columns A, B, C, D, E, F, G)
  const handleDownloadCsvTemplate = () => {
    const csvHeader = "Nama Lengkap;NISN;Email;Jenjang Kelas;Rombel / Kelas;Target Program;Password\n";
    const sampleRows = [
      "Ahmad Rizky;0081230001;ahmad.rizky@sekolah.sch.id;Kelas X (Kelas 1 SMA);Kelas X-A;SMA Reguler;password123",
      "Bella Safitri;0081230002;bella.s@sekolah.sch.id;Kelas X (Kelas 1 SMA);Kelas X-A;SMA Reguler;password123",
      "Citra Kirana;0081230003;citra.k@sekolah.sch.id;Kelas XI (Kelas 2 SMA);Kelas XI-A;Persiapan UTBK / SNBT;password123",
      "Dimas Prasetyo;0081230004;dimas.p@sekolah.sch.id;Kelas XII (Kelas 3 SMA);Kelas XII-IPA 1;Sekolah Kedinasan (SEKDIN);password123",
      "Eko Saputra;0081230005;eko.s@sekolah.sch.id;Alumni / Lulus (Persiapan UTBK SNBT);Alumni 2025;Persiapan UTBK / SNBT;password123",
    ].join("\n");

    // Add \uFEFF UTF-8 BOM so Microsoft Excel automatically recognises encoding and cleanly separates columns
    const blob = new Blob(["\uFEFF" + csvHeader + sampleRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template_import_siswa_nalara.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Load 100 or 300 Sample Students automatically for School Pilot Demo
  const handleLoadSampleBatch = (count: number) => {
    const sampleNames = [
      "Aditya Pratama", "Annisa Rahma", "Bagus Wicaksono", "Bayu Setiawan", "Citra Lestari",
      "Danang Firmansyah", "Dewa Saputra", "Dian Permata", "Eka Putri", "Fadli Kurniawan",
      "Farhan Hakim", "Gita Gutawa", "Hafiz Maulana", "Hanif Alamsyah", "Indah Kusuma",
      "Intan Nuraini", "Joko Susilo", "Kevin Sanjaya", "Larasati Dewi", "Lukman Hakim",
      "Mega Utami", "Naufal Zaki", "Putri Maharani", "Rian Hidayat", "Salsa Billah",
      "Taufik Hidayat", "Wahyu Ramadhan", "Yusuf Habibie", "Zahra Salsabila", "Zikri Maulana"
    ];

    const generated: StudentData[] = [];
    for (let i = 1; i <= count; i++) {
      const baseName = sampleNames[(i - 1) % sampleNames.length];
      const name = `${baseName} ${Math.floor((i - 1) / sampleNames.length) > 0 ? (Math.floor((i - 1) / sampleNames.length) + 1) : ""}`.trim();
      const nisn = `008${String(1000000 + i).slice(1)}`;
      const email = `siswa${i}@sekolah.sch.id`;
      const gradeChoice = i <= 35 ? "Kelas X (Kelas 1 SMA)" : i <= 70 ? "Kelas XI (Kelas 2 SMA)" : i <= 90 ? "Kelas XII (Kelas 3 SMA)" : "Alumni / Lulus (Persiapan UTBK SNBT)";
      const classChoice = i <= 35 ? "Kelas X-A" : i <= 70 ? "Kelas XI-A" : i <= 90 ? "Kelas XII-IPA 1" : "Alumni 2025";
      const target = i % 3 === 0 ? "Persiapan UTBK / SNBT" : i % 3 === 1 ? "Sekolah Kedinasan (SEKDIN)" : "SMA Reguler";

      generated.push({
        id: `bulk-${Date.now()}-${i}`,
        name,
        nisn,
        email,
        gradeLevel: gradeChoice,
        classGroup: classChoice,
        targetProgram: target,
        password: "password123",
      });
    }

    setParsedBulkStudents(generated);
  };

  // Smart Multi-Format CSV Parser (supports Comma, Semicolon (Indonesian Excel), Tab, and custom columns)
  const handleParseCsv = (text: string) => {
    setCsvRawText(text);
    if (!text.trim()) {
      setParsedBulkStudents([]);
      return;
    }

    const lines = text.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return;

    // 1. Detect delimiter (, or ; or \t)
    const firstLine = lines[0];
    const semicolonCount = (firstLine.match(/;/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    const tabCount = (firstLine.match(/\t/g) || []).length;

    let delimiter = ",";
    if (semicolonCount > commaCount && semicolonCount >= tabCount) delimiter = ";";
    else if (tabCount > commaCount && tabCount > semicolonCount) delimiter = "\t";

    // 2. Detect column mapping from header
    const headerCols = firstLine.split(delimiter).map((c) => c.trim().toLowerCase().replace(/^["']|["']$/g, ""));
    const isHeaderRow = headerCols.some((h) => h.includes("nama") || h.includes("email") || h.includes("nisn") || h.includes("kelas"));

    let nameIdx = 0;
    let nisnIdx = 1;
    let emailIdx = 2;
    let gradeIdx = 3;
    let classIdx = 4;
    let targetIdx = 5;
    let passIdx = 6;

    if (isHeaderRow) {
      headerCols.forEach((col, idx) => {
        if (col.includes("nama") || col.includes("name") || col.includes("siswa")) nameIdx = idx;
        else if (col.includes("nisn") || col.includes("nis") || col.includes("induk")) nisnIdx = idx;
        else if (col.includes("email") || col.includes("mail") || col.includes("surel")) emailIdx = idx;
        else if (col.includes("jenjang") || col.includes("grade") || col.includes("fase")) gradeIdx = idx;
        else if (col.includes("rombel") || col.includes("kelas") || col.includes("class")) classIdx = idx;
        else if (col.includes("target") || col.includes("program")) targetIdx = idx;
        else if (col.includes("password") || col.includes("sandi") || col.includes("pass")) passIdx = idx;
      });
    }

    const startRow = isHeaderRow ? 1 : 0;
    const parsed: StudentData[] = [];

    for (let i = startRow; i < lines.length; i++) {
      const row = lines[i].split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ""));
      const rawName = row[nameIdx] || "";
      if (!rawName) continue;

      const cleanName = rawName.replace(/^[0-9.]+\s*/, ""); // remove leading numbering like "1. Andi"
      const nisn = row[nisnIdx] || `008${String(1000000 + i).slice(1)}`;
      
      // Auto-generate clean email if missing
      const defaultEmail = `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "")}${i}@sekolah.sch.id`;
      const email = (row[emailIdx] && row[emailIdx].includes("@")) ? row[emailIdx].toLowerCase() : defaultEmail;
      
      const grade = row[gradeIdx] || (row[classIdx]?.includes("11") || row[classIdx]?.includes("XI") ? "Kelas XI (Kelas 2 SMA)" : row[classIdx]?.includes("12") || row[classIdx]?.includes("XII") ? "Kelas XII (Kelas 3 SMA)" : "Kelas X (Kelas 1 SMA)");
      const classGroup = row[classIdx] || (grade.includes("XI") ? "Kelas XI-A" : grade.includes("XII") ? "Kelas XII-IPA 1" : "Kelas X-A");
      const targetProgram = row[targetIdx] || "SMA Reguler";
      const password = row[passIdx] || "password123";

      parsed.push({
        id: `csv-${Date.now()}-${i}`,
        name: cleanName,
        nisn,
        email,
        gradeLevel: grade,
        classGroup,
        targetProgram,
        password,
      });
    }

    setParsedBulkStudents(parsed);
  };

  // Submit Bulk Import
  const handleExecuteBulkImport = async () => {
    if (parsedBulkStudents.length === 0) return;

    setIsImportingBulk(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/bulk-create-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: parsedBulkStudents }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengimpor data");
      }

      setStudents((prev) => [...parsedBulkStudents, ...prev]);
      setStatusMsg(`🎉 Berhasil mengimpor ${parsedBulkStudents.length} siswa sekaligus ke sistem! Akun Supabase Auth siap digunakan.`);
      setParsedBulkStudents([]);
      setCsvRawText("");
      
      setTimeout(() => {
        setShowBulkImportModal(false);
        setStatusMsg(null);
      }, 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengimpor";
      setStatusMsg(`Error Bulk Import: ${msg}`);
    } finally {
      setIsImportingBulk(false);
    }
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers(teachers.filter((t) => t.id !== id));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.email.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.subject.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.gradeLevel.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.nisn.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.classGroup.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.gradeLevel.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Admin Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border shadow-md" style={{ background: "var(--surface)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--brand))",
            }}
          >
            <Shield className="w-6 h-6 text-bg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-text">
                Portal Administrator Sekolah
              </h1>
              <Badge variant="accent">Admin Verified</Badge>
            </div>
            <p className="text-xs text-muted">
              Manajemen Data Pengajar, Siswa, Kurikulum &amp; Akun Terdaftar Supabase
            </p>
          </div>
        </div>

        <Button size="sm" variant="secondary" onClick={handleLogout} className="text-error border-error/30 hover:bg-error/10">
          <LogOut size={14} />
          <span>Keluar (Sign Out)</span>
        </Button>
      </header>

      {/* Status Notification Toast */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-lg ${
            statusMsg.startsWith("Error")
              ? "bg-red-500/15 border-red-500/40 text-red-300"
              : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
          }`}
        >
          {statusMsg.startsWith("Error") ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{statusMsg}</span>
        </div>
      )}

      {/* 2. Main Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-border pb-2">
        <button
          onClick={() => setAdminTab("teachers")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            adminTab === "teachers"
              ? "bg-brand text-bg shadow-md"
              : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <Users size={16} />
          <span>👨‍🏫 Kelola Guru &amp; Mata Pelajaran ({teachers.length})</span>
        </button>

        <button
          onClick={() => setAdminTab("students")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            adminTab === "students"
              ? "bg-brand text-bg shadow-md"
              : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <GraduationCap size={16} />
          <span>🎓 Kelola &amp; Daftarkan Siswa Baru ({students.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TEACHER MANAGEMENT                                                 */}
      {/* ========================================================================= */}
      {adminTab === "teachers" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-text">Daftar Guru Mata Pelajaran</h2>
              <p className="text-xs text-muted">Setiap guru dihubungkan dengan mapel dan kelas yang diampunya.</p>
            </div>

            <Button
              onClick={() => setShowAddTeacherForm(!showAddTeacherForm)}
              variant="primary"
              className="shadow-lg font-bold"
            >
              <PlusCircle size={18} />
              <span>{showAddTeacherForm ? "Tutup Form" : "+ Tambah Guru Baru"}</span>
            </Button>
          </div>

          {/* Form Input Guru Baru */}
          {showAddTeacherForm && (
            <Card className="p-6 sm:p-8 space-y-6 border-brand/40 bg-surface">
              <div className="border-b border-border pb-3">
                <h3 className="text-lg font-bold font-serif text-text flex items-center gap-2">
                  <UserPlus size={18} className="text-brand" />
                  <span>Form Pendaftaran Guru &amp; Mata Pelajaran Baru</span>
                </h3>
                <p className="text-xs text-muted">
                  Akun guru akan langsung dibuatkan di Supabase Auth dan dapat digunakan untuk login di Dashboard Guru.
                </p>
              </div>

              <form onSubmit={handleAddTeacher} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nama Lengkap Guru"
                    placeholder="Contoh: Dra. Brio Pratama, M.Pd"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    required
                  />

                  <Input
                    label="Email Akun Guru"
                    type="email"
                    placeholder="nama.guru@sekolah.sch.id"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">Mata Pelajaran yang Diampu</label>
                    <select
                      value={teacherSubject}
                      onChange={(e) => setTeacherSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                    >
                      <option value="Matematika">Matematika</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                      <option value="IPA (Fisika/Kimia/Biologi)">IPA (Fisika/Kimia/Biologi)</option>
                      <option value="IPS (Ekonomi/Sosiologi/Geografi)">IPS (Ekonomi/Sosiologi/Geografi)</option>
                      <option value="Persiapan Sekdin (TIU & TPA)">Persiapan Sekdin (TIU &amp; TPA)</option>
                      <option value="Persiapan UTBK / SNBT">Persiapan UTBK / SNBT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">Tingkat Jenjang / Kelas</label>
                    <select
                      value={teacherGradeLevel}
                      onChange={(e) => setTeacherGradeLevel(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                    >
                      <option value="Kelas X (Kelas 1 SMA)">Kelas X (Kelas 1 SMA)</option>
                      <option value="Kelas XI (Kelas 2 SMA)">Kelas XI (Kelas 2 SMA)</option>
                      <option value="Kelas XII (Kelas 3 SMA)">Kelas XII (Kelas 3 SMA)</option>
                      <option value="Kelas X, XI, XII">Semua Jenjang SMA (X, XI, XII)</option>
                      <option value="Persiapan Kedinasan & UTBK">Persiapan Kedinasan &amp; UTBK</option>
                    </select>
                  </div>

                  <Input
                    label="Rombel / Kelas yang Diajar"
                    placeholder="Contoh: Kelas X-A, X-B"
                    value={teacherClassAssigned}
                    onChange={(e) => setTeacherClassAssigned(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="NIP / No. Induk Pendidik (Opsional)"
                    placeholder="198001012005011001"
                    value={teacherNip}
                    onChange={(e) => setTeacherNip(e.target.value)}
                  />

                  <Input
                    label="Password Default Akun Guru"
                    placeholder="password123"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                  />
                </div>

                <div className="flex justify-end pt-2 border-t border-border">
                  <Button type="submit" variant="primary" loading={isSubmittingTeacher}>
                    <span>Daftarkan Guru ke Sistem</span>
                    <CheckCircle2 size={16} />
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Teacher List Table */}
          <Card className="p-6 space-y-4 border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-bold font-serif text-text flex items-center gap-2">
                <Users size={18} className="text-brand" />
                <span>Guru Terdaftar ({teachers.length})</span>
              </h3>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Cari nama guru / mapel..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-border bg-surface2 text-xs outline-none focus:border-brand w-56 text-text"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-3">Nama &amp; NIP</th>
                    <th className="pb-3 px-3">Email Akun</th>
                    <th className="pb-3 px-3">Mata Pelajaran</th>
                    <th className="pb-3 px-3">Jenjang Kelas</th>
                    <th className="pb-3 px-3">Rombel</th>
                    <th className="pb-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredTeachers.map((t) => (
                    <tr key={t.id} className="hover:bg-surface2/50 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-text text-sm">{t.name}</div>
                        <div className="text-[11px] text-muted">NIP: {t.nip}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-muted">{t.email}</td>
                      <td className="py-3.5 px-3">
                        <Badge variant="brand" className="text-[10px]">{t.subject}</Badge>
                      </td>
                      <td className="py-3.5 px-3">{t.gradeLevel}</td>
                      <td className="py-3.5 px-3">
                        <Badge variant="neutral" className="text-[10px]">{t.classAssigned}</Badge>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteTeacher(t.id)}
                          className="text-muted hover:text-error transition-colors p-1.5 rounded-lg"
                          title="Hapus Guru"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STUDENT MANAGEMENT (ADD & MANAGE MULTIPLE STUDENTS)                 */}
      {/* ========================================================================= */}
      {adminTab === "students" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-text">Daftar Siswa Terdaftar</h2>
              <p className="text-xs text-muted">
                Admin dapat mendaftarkan siswa baru secara mandiri atau import massal ratusan siswa (CSV / Excel).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => {
                  setShowBulkImportModal(!showBulkImportModal);
                  setShowAddStudentForm(false);
                }}
                variant="secondary"
                className="shadow-sm font-bold border-brand/40 text-brand hover:bg-brand/10"
              >
                <FileSpreadsheet size={18} />
                <span>{showBulkImportModal ? "Tutup Import" : "📥 Import Massal (CSV / Excel)"}</span>
              </Button>

              <Button
                onClick={() => {
                  setShowAddStudentForm(!showAddStudentForm);
                  setShowBulkImportModal(false);
                }}
                variant="primary"
                className="shadow-lg font-bold"
              >
                <PlusCircle size={18} />
                <span>{showAddStudentForm ? "Tutup Form" : "+ Daftarkan 1 Siswa"}</span>
              </Button>
            </div>
          </div>

          {/* Bulk Import Modal / Box */}
          {showBulkImportModal && (
            <Card className="p-6 sm:p-8 space-y-6 border-brand/40 bg-surface shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h3 className="text-lg font-bold font-serif text-text flex items-center gap-2">
                    <FileSpreadsheet size={20} className="text-brand" />
                    <span>Import Massal Data Siswa (Batch CSV / Excel)</span>
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    Unggah atau tempel data ratusan siswa sekaligus (misal: 100 siswa Kelas X, 100 Kelas XI, 100 Kelas XII) ke sistem.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={handleDownloadCsvTemplate} className="text-xs font-semibold">
                    <Download size={14} />
                    <span>Unduh Template CSV</span>
                  </Button>
                </div>
              </div>

              {/* Direct File Upload Dropzone */}
              <div className="space-y-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-brand/40 hover:border-brand rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-surface2/30 hover:bg-surface2/60 group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-brand/10 group-hover:bg-brand/20 flex items-center justify-center text-brand transition-colors shadow-inner">
                    <UploadCloud size={24} />
                  </div>
                  <div className="font-bold text-sm text-text mb-1">
                    {uploadedFileName ? (
                      <span className="text-brand flex items-center justify-center gap-1.5 font-bold">
                        <FileSpreadsheet size={16} /> File Terpilih: {uploadedFileName}
                      </span>
                    ) : (
                      "📁 Klik di sini untuk Upload File CSV dari Komputer (atau Drag & Drop ke Sini)"
                    )}
                  </div>
                  <p className="text-xs text-muted">
                    Pilih file template CSV yang telah diedit/diekspor dari Excel / Dapodik
                  </p>
                </div>

                <div className="flex items-center gap-4 my-2">
                  <div className="h-[1px] bg-border flex-1" />
                  <span className="text-[10px] uppercase font-bold text-muted">Atau Gunakan Uji Coba Cepat / Paste Data</span>
                  <div className="h-[1px] bg-border flex-1" />
                </div>

                {/* Quick Preset Generator & Paste Area */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-surface2/60 border border-border text-xs">
                  <span className="text-muted font-medium">⚡ Uji Coba Cepat (Pilot Sekolah):</span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleLoadSampleBatch(30)} className="text-xs">
                      + Siapkan 30 Siswa
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleLoadSampleBatch(100)} className="text-xs text-brand font-bold border-brand/40">
                      🚀 Siapkan 100 Siswa Sekaligus
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleLoadSampleBatch(300)} className="text-xs">
                      🏫 Siapkan 300 Siswa (Semua Kelas)
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase mb-1.5">
                    Atau Tempel / Edit Data CSV Langsung di Sini:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Nama Lengkap,NISN,Email,Jenjang Kelas,Rombel,Target Program,Password&#10;Ahmad Rizky,0081230001,ahmad@sekolah.sch.id,Kelas X (Kelas 1 SMA),Kelas X-A,SMA Reguler,password123&#10;Bella Safitri,0081230002,bella@sekolah.sch.id,Kelas XI (Kelas 2 SMA),Kelas XI-A,SMA Reguler,password123"
                    value={csvRawText}
                    onChange={(e) => handleParseCsv(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-surface2 text-xs font-mono text-text outline-none focus:border-brand"
                  />
                </div>
              </div>

              {/* Preview of Parsed Students */}
              {parsedBulkStudents.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-brand flex items-center gap-1.5">
                      <CheckCircle2 size={16} />
                      Siap Mengimpor {parsedBulkStudents.length} Akun Siswa Baru
                    </span>
                    <span className="text-muted">
                      Menampilkan {Math.min(parsedBulkStudents.length, 5)} dari {parsedBulkStudents.length} data
                    </span>
                  </div>

                  <div className="overflow-x-auto max-h-48 overflow-y-auto rounded-xl border border-border bg-surface2/40">
                    <table className="w-full text-left text-[11px]">
                      <thead className="sticky top-0 bg-surface2 border-b border-border text-muted font-bold">
                        <tr>
                          <th className="py-2 px-3">No</th>
                          <th className="py-2 px-3">Nama Siswa</th>
                          <th className="py-2 px-3">NISN</th>
                          <th className="py-2 px-3">Email Login</th>
                          <th className="py-2 px-3">Jenjang</th>
                          <th className="py-2 px-3">Rombel</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 font-mono">
                        {parsedBulkStudents.slice(0, 5).map((s, idx) => (
                          <tr key={s.id || idx}>
                            <td className="py-1.5 px-3 text-muted">{idx + 1}</td>
                            <td className="py-1.5 px-3 font-bold text-text font-sans">{s.name}</td>
                            <td className="py-1.5 px-3 text-muted">{s.nisn}</td>
                            <td className="py-1.5 px-3 text-brand">{s.email}</td>
                            <td className="py-1.5 px-3">{s.gradeLevel}</td>
                            <td className="py-1.5 px-3">{s.classGroup}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-border">
                    <Button
                      onClick={handleExecuteBulkImport}
                      variant="primary"
                      loading={isImportingBulk}
                      className="font-bold shadow-lg"
                    >
                      <UploadCloud size={16} />
                      <span>Eksekusi Import {parsedBulkStudents.length} Siswa Sekarang</span>
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Form Input Siswa Baru */}
          {showAddStudentForm && (
            <Card className="p-6 sm:p-8 space-y-6 border-brand/40 bg-surface">
              <div className="border-b border-border pb-3">
                <h3 className="text-lg font-bold font-serif text-text flex items-center gap-2">
                  <UserPlus size={18} className="text-brand" />
                  <span>Form Pendaftaran Akun Siswa Baru</span>
                </h3>
                <p className="text-xs text-muted">
                  Akun siswa akan langsung terdaftar di Supabase Auth dan dapat digunakan siswa untuk login mandiri.
                </p>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Nama Lengkap Siswa"
                    placeholder="Contoh: Rahmat Hidayat"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />

                  <Input
                    label="NISN / No. Induk Siswa"
                    placeholder="Contoh: 0081234588"
                    value={studentNisn}
                    onChange={(e) => setStudentNisn(e.target.value)}
                    required
                  />

                  <Input
                    label="Email Akun Siswa"
                    type="email"
                    placeholder="rahmat@sekolah.sch.id"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">Jenjang Kelas</label>
                    <select
                      value={studentGradeLevel}
                      onChange={(e) => setStudentGradeLevel(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                    >
                      <option value="Kelas X (Kelas 1 SMA)">Kelas X (Kelas 1 SMA)</option>
                      <option value="Kelas XI (Kelas 2 SMA)">Kelas XI (Kelas 2 SMA)</option>
                      <option value="Kelas XII (Kelas 3 SMA)">Kelas XII (Kelas 3 SMA)</option>
                      <option value="Alumni / Lulus (Persiapan UTBK SNBT)">Alumni / Lulus (Persiapan UTBK SNBT)</option>
                      <option value="Alumni / Mahasiswa (Persiapan SEKDIN)">Alumni / Mahasiswa (Persiapan SEKDIN)</option>
                    </select>
                  </div>

                  <Input
                    label="Rombongan Belajar (Kelas / Angkatan)"
                    placeholder="Contoh: Kelas XII-IPA 1 atau Alumni 2025"
                    value={studentClassGroup}
                    onChange={(e) => setStudentClassGroup(e.target.value)}
                  />

                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">Target Utama Belajar</label>
                    <select
                      value={studentTargetProgram}
                      onChange={(e) => setStudentTargetProgram(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                    >
                      <option value="SMA Reguler">SMA Reguler</option>
                      <option value="Persiapan UTBK / SNBT">Persiapan UTBK / SNBT</option>
                      <option value="Sekolah Kedinasan (SEKDIN)">Sekolah Kedinasan (SEKDIN)</option>
                      <option value="SMA Reguler & Kedinasan">SMA Reguler &amp; Kedinasan</option>
                      <option value="Alumni / Persiapan Kampus & Kedinasan">Alumni / Persiapan Kampus &amp; Kedinasan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Password Default Akun Siswa"
                    placeholder="password123"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                  />
                  <div className="flex items-end">
                    <p className="text-[11px] text-muted leading-relaxed pb-2">
                      💡 Siswa dapat langsung login di <code>/login</code> menggunakan email dan password di atas.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-border">
                  <Button type="submit" variant="primary" loading={isSubmittingStudent}>
                    <span>Daftarkan Siswa ke Sistem</span>
                    <CheckCircle2 size={16} />
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Student List Table */}
          <Card className="p-6 space-y-4 border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-bold font-serif text-text flex items-center gap-2">
                <GraduationCap size={18} className="text-brand" />
                <span>Siswa Terdaftar ({students.length})</span>
              </h3>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Cari nama siswa / NISN..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-border bg-surface2 text-xs outline-none focus:border-brand w-56 text-text"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-3">Nama Siswa</th>
                    <th className="pb-3 px-3">NISN</th>
                    <th className="pb-3 px-3">Email Akun</th>
                    <th className="pb-3 px-3">Jenjang &amp; Kelas</th>
                    <th className="pb-3 px-3">Target Belajar</th>
                    <th className="pb-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-surface2/50 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-text text-sm">{s.name}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-muted">{s.nisn}</td>
                      <td className="py-3.5 px-3 font-mono text-brand font-medium">{s.email}</td>
                      <td className="py-3.5 px-3">
                        <Badge variant="neutral" className="text-[10px]">{s.classGroup}</Badge>
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge variant="accent" className="text-[10px]">{s.targetProgram}</Badge>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteStudent(s.id)}
                          className="text-muted hover:text-error transition-colors p-1.5 rounded-lg"
                          title="Hapus Siswa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
