"use client";

import React, { useState, useEffect } from "react";
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
  AlertCircle,
  School,
  UserPlus,
  Target,
  Layers,
  UploadCloud,
  Download,
  FileSpreadsheet,
  Check,
  RefreshCw,
  Briefcase,
  BookMarked,
  ToggleLeft,
  ToggleRight,
  X,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, GlowCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { supabase } from "@/lib/supabase";
import {
  ClassroomItem,
  SubjectItem,
  TeacherAssignmentItem,
  getStoredClasses,
  saveStoredClasses,
  getStoredSubjects,
  saveStoredSubjects,
  getStoredAssignments,
  saveStoredAssignments,
  DEFAULT_CLASSES,
  DEFAULT_SUBJECTS,
  DEFAULT_ASSIGNMENTS,
} from "@/lib/assignment-service";

interface TeacherData {
  id: string;
  name: string;
  email: string;
  subject: string;
  gradeLevel: string;
  nip: string;
  classAssigned: string;
  password?: string;
  status?: "active" | "inactive";
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
    name: "Brio Pratama, S.Pd",
    email: "brio@gmail.com",
    subject: "Bahasa Indonesia",
    gradeLevel: "Kelas 1 & Kelas 2",
    nip: "12334553211",
    classAssigned: "Kelas 1-A, Kelas 2-A",
    password: "password123",
    status: "active",
  },
  {
    id: "t-1",
    name: "Dra. Sri Wahyuni",
    email: "guru@sekolah.sch.id",
    subject: "Matematika",
    gradeLevel: "Kelas 1 & Kelas 2",
    nip: "197508122000032001",
    classAssigned: "Kelas 1-A, Kelas 2-A",
    password: "password123",
    status: "active",
  },
  {
    id: "t-2",
    name: "Ahmad Fauzi, S.Pd",
    email: "guru.indo@sekolah.sch.id",
    subject: "Bahasa Indonesia",
    gradeLevel: "Kelas 1 & Kelas 3",
    nip: "198203152006041005",
    classAssigned: "Kelas 1-B, Kelas 3-A",
    password: "password123",
    status: "active",
  },
  {
    id: "t-3",
    name: "Bambang Sudarmono, M.Si",
    email: "guru.sekdin@sekolah.sch.id",
    subject: "Persiapan Kedinasan (SEKDIN - TIU/TPA)",
    gradeLevel: "Kelas 3",
    nip: "198006202005011003",
    classAssigned: "Kelas 3-A",
    password: "password123",
    status: "active",
  },
];

const INITIAL_STUDENTS: StudentData[] = [
  {
    id: "s-1",
    name: "Andi Pratama",
    email: "andi@sekolah.sch.id",
    nisn: "0081234567",
    gradeLevel: "Kelas 1 (Kelas X)",
    classGroup: "Kelas 1-A (X-A)",
    targetProgram: "SMA Reguler & Kedinasan",
    password: "password123",
  },
  {
    id: "s-2",
    name: "Doni Setiawan",
    email: "doni.s@sekolah.sch.id",
    nisn: "0081234568",
    gradeLevel: "Kelas 2 (Kelas XI)",
    classGroup: "Kelas 2-A (XI-A)",
    targetProgram: "SMA Reguler",
    password: "password123",
  },
  {
    id: "s-3",
    name: "Siti Nurhaliza",
    email: "siti.n@sekolah.sch.id",
    nisn: "0081234569",
    gradeLevel: "Kelas 2 (Kelas XI)",
    classGroup: "Kelas 2-A (XI-A)",
    targetProgram: "Persiapan UTBK / SNBT",
    password: "password123",
  },
  {
    id: "s-4",
    name: "Budi Santoso",
    email: "budi.s@sekolah.sch.id",
    nisn: "0081234570",
    gradeLevel: "Kelas 2 (Kelas XI)",
    classGroup: "Kelas 2-B (XI-B)",
    targetProgram: "Sekolah Kedinasan (SEKDIN)",
    password: "password123",
  },
  {
    id: "s-5",
    name: "Rina Wulandari",
    email: "rina.w@sekolah.sch.id",
    nisn: "0081234571",
    gradeLevel: "Kelas 3 (Kelas XII)",
    classGroup: "Kelas 3-A (XII-A)",
    targetProgram: "Persiapan UTBK & SEKDIN",
    password: "password123",
  },
];

export default function AdminDashboardPage() {
  const [adminTab, setAdminTab] = useState<"assignments" | "teachers" | "classes" | "subjects" | "students">("assignments");

  // Dynamic Data States from Storage & APIs
  const [classes, setClasses] = useState<ClassroomItem[]>(DEFAULT_CLASSES);
  const [subjects, setSubjects] = useState<SubjectItem[]>(DEFAULT_SUBJECTS);
  const [assignments, setAssignments] = useState<TeacherAssignmentItem[]>(DEFAULT_ASSIGNMENTS);

  // Teachers & Students State
  const [teachers, setTeachers] = useState<TeacherData[]>(INITIAL_TEACHERS);
  const [students, setStudents] = useState<StudentData[]>(INITIAL_STUDENTS);

  // Assignment Management States
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [assignTeacherId, setAssignTeacherId] = useState("");
  const [assignClassId, setAssignClassId] = useState("");
  const [assignSubjectId, setAssignSubjectId] = useState("");
  const [assignmentSearch, setAssignmentSearch] = useState("");
  const [assignmentGradeFilter, setAssignmentGradeFilter] = useState("all");

  // Classes Management States
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassGrade, setNewClassGrade] = useState("Kelas 1");
  const [newClassCode, setNewClassCode] = useState("");

  // Subjects Management States
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [newSubjectGrade, setNewSubjectGrade] = useState("Semua");
  const [newSubjectCategory, setNewSubjectCategory] = useState("Wajib");

  // Teacher Form State
  const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [isSubmittingTeacher, setIsSubmittingTeacher] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("password123");
  const [teacherSubject, setTeacherSubject] = useState("Matematika");
  const [teacherGradeLevel, setTeacherGradeLevel] = useState("Kelas 1");
  const [teacherClassAssigned, setTeacherClassAssigned] = useState("Kelas 1-A (X-A)");
  const [teacherNip, setTeacherNip] = useState("");

  // Student Form State
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentNisn, setStudentNisn] = useState("");
  const [studentPassword, setStudentPassword] = useState("password123");
  const [studentGradeLevel, setStudentGradeLevel] = useState("Kelas 1 (Kelas X)");
  const [studentClassGroup, setStudentClassGroup] = useState("Kelas 1-A (X-A)");
  const [studentTargetProgram, setStudentTargetProgram] = useState("SMA Reguler");

  // Bulk Import State
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [csvRawText, setCsvRawText] = useState("");
  const [parsedBulkStudents, setParsedBulkStudents] = useState<StudentData[]>([]);
  const [isImportingBulk, setIsImportingBulk] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Initialize and Sync from Storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setClasses(getStoredClasses());
      setSubjects(getStoredSubjects());
      setAssignments(getStoredAssignments());

      try {
        const rawT = localStorage.getItem("nalara_registered_teachers");
        if (rawT) setTeachers(JSON.parse(rawT));
        const rawS = localStorage.getItem("nalara_registered_students");
        if (rawS) setStudents(JSON.parse(rawS));
      } catch (err) {
        console.error("Storage read error:", err);
      }
    }
  }, []);

  // Set default dropdown values
  useEffect(() => {
    if (teachers.length > 0 && !assignTeacherId) {
      setAssignTeacherId(teachers[0].id);
    }
    if (classes.length > 0 && !assignClassId) {
      setAssignClassId(classes[0].id);
    }
    if (subjects.length > 0 && !assignSubjectId) {
      setAssignSubjectId(subjects[0].id);
    }
  }, [teachers, classes, subjects, assignTeacherId, assignClassId, assignSubjectId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // ===========================================================================
  // 1. ASSIGNMENT MANAGEMENT HANDLERS (Guru + Kelas + Mapel)
  // ===========================================================================
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find((t) => t.id === assignTeacherId);
    const cls = classes.find((c) => c.id === assignClassId);
    const subj = subjects.find((s) => s.id === assignSubjectId);

    if (!teacher || !cls || !subj) {
      setStatusMsg("Error: Pastikan Guru, Kelas, dan Mata Pelajaran dipilih dengan benar.");
      return;
    }

    // Check if this assignment already exists
    const exists = assignments.some(
      (a) => a.teacherEmail.toLowerCase() === teacher.email.toLowerCase() &&
             a.classId === cls.id &&
             a.subjectId === subj.id
    );

    if (exists) {
      setStatusMsg(`Error: Guru ${teacher.name} sudah ditugaskan pada ${cls.name} - ${subj.name}.`);
      return;
    }

    const newAssignment: TeacherAssignmentItem = {
      id: `asg-${Date.now()}`,
      teacherId: teacher.id,
      teacherName: teacher.name,
      teacherEmail: teacher.email.toLowerCase(),
      classId: cls.id,
      className: cls.name,
      gradeLevel: cls.gradeLevel,
      subjectId: subj.id,
      subjectName: subj.name,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    const updated = [newAssignment, ...assignments];
    setAssignments(updated);
    saveStoredAssignments(updated);

    // Call Backend API to sync and persist
    try {
      await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssignment),
      });
    } catch {
      // Storage fallback
    }

    setStatusMsg(`✅ Sukses: Guru ${teacher.name} berhasil ditugaskan untuk ${cls.name} • ${subj.name}!`);
    setShowAddAssignmentModal(false);
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    const updated = assignments.filter((a) => a.id !== assignmentId);
    setAssignments(updated);
    saveStoredAssignments(updated);
    setStatusMsg("Penugasan guru berhasil dihapus.");
    setTimeout(() => setStatusMsg(null), 2500);
  };

  const handleToggleAssignmentStatus = (assignmentId: string) => {
    const updated = assignments.map((a) => {
      if (a.id === assignmentId) {
        return { ...a, status: a.status === "active" ? "inactive" : ("active" as "active" | "inactive") };
      }
      return a;
    });
    setAssignments(updated);
    saveStoredAssignments(updated);
  };

  // ===========================================================================
  // 2. CLASSROOM MANAGEMENT HANDLERS (Kelas 1, 2, 3, dst.)
  // ===========================================================================
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newClass: ClassroomItem = {
      id: `cls-${Date.now()}`,
      name: newClassName.trim(),
      gradeLevel: newClassGrade,
      classCode: newClassCode.trim() || newClassName.trim().slice(0, 4).toUpperCase(),
      status: "active",
    };

    const updated = [...classes, newClass];
    setClasses(updated);
    saveStoredClasses(updated);
    setStatusMsg(`Kelas ${newClass.name} (${newClass.gradeLevel}) berhasil dibuat!`);
    setNewClassName("");
    setNewClassCode("");
    setShowAddClassModal(false);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDeleteClass = (id: string) => {
    const updated = classes.filter((c) => c.id !== id);
    setClasses(updated);
    saveStoredClasses(updated);
    setStatusMsg("Kelas berhasil dihapus.");
    setTimeout(() => setStatusMsg(null), 2500);
  };

  // ===========================================================================
  // 3. SUBJECT MANAGEMENT HANDLERS
  // ===========================================================================
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const newSubj: SubjectItem = {
      id: `sub-${Date.now()}`,
      name: newSubjectName.trim(),
      code: newSubjectCode.trim() || newSubjectName.trim().slice(0, 4).toUpperCase(),
      gradeLevel: newSubjectGrade,
      category: newSubjectCategory,
      status: "active",
    };

    const updated = [...subjects, newSubj];
    setSubjects(updated);
    saveStoredSubjects(updated);
    setStatusMsg(`Mata pelajaran ${newSubj.name} (${newSubj.code}) berhasil ditambahkan!`);
    setNewSubjectName("");
    setNewSubjectCode("");
    setShowAddSubjectModal(false);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDeleteSubject = (id: string) => {
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    saveStoredSubjects(updated);
    setStatusMsg("Mata pelajaran berhasil dihapus.");
    setTimeout(() => setStatusMsg(null), 2500);
  };

  // ===========================================================================
  // 4. TEACHER ACCOUNT MANAGEMENT HANDLERS
  // ===========================================================================
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
        status: "active",
      };

      const updatedTeachers = [newTeacher, ...teachers];
      setTeachers(updatedTeachers);
      if (typeof window !== "undefined") {
        localStorage.setItem("nalara_registered_teachers", JSON.stringify(updatedTeachers));
      }

      // Automatically create an initial assignment for this teacher if class matches
      const targetClass = classes.find((c) => c.name.toLowerCase().includes(teacherClassAssigned.toLowerCase())) || classes[0];
      const targetSubject = subjects.find((s) => s.name.toLowerCase().includes(teacherSubject.toLowerCase())) || subjects[0];

      if (targetClass && targetSubject) {
        const autoAssignment: TeacherAssignmentItem = {
          id: `asg-${Date.now()}`,
          teacherId: newTeacher.id,
          teacherName: newTeacher.name,
          teacherEmail: newTeacher.email,
          classId: targetClass.id,
          className: targetClass.name,
          gradeLevel: targetClass.gradeLevel,
          subjectId: targetSubject.id,
          subjectName: targetSubject.name,
          status: "active",
          createdAt: new Date().toISOString(),
        };
        const updatedAssignments = [autoAssignment, ...assignments];
        setAssignments(updatedAssignments);
        saveStoredAssignments(updatedAssignments);
      }

      setStatusMsg(`Guru ${teacherName} (${teacherEmail}) berhasil didaftarkan dan diberikan penugasan awal!`);
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

  const handleDeleteTeacher = (id: string) => {
    const updated = teachers.filter((t) => t.id !== id);
    setTeachers(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("nalara_registered_teachers", JSON.stringify(updated));
    }
  };

  const handleToggleTeacherStatus = (id: string) => {
    const updated = teachers.map((t) => (t.id === id ? { ...t, status: t.status === "active" ? "inactive" : ("active" as "active" | "inactive") } : t));
    setTeachers(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("nalara_registered_teachers", JSON.stringify(updated));
    }
  };

  // ===========================================================================
  // 5. STUDENT & CSV BULK IMPORT HANDLERS
  // ===========================================================================
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

      const updated = [newStudent, ...students];
      setStudents(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("nalara_registered_students", JSON.stringify(updated));
      }

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

  const handleDeleteStudent = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("nalara_registered_students", JSON.stringify(updated));
    }
  };

  // CSV Parser
  const handleParseCsv = (text: string) => {
    setCsvRawText(text);
    if (!text.trim()) {
      setParsedBulkStudents([]);
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

      const cleanName = rawName.replace(/^[0-9.]+\s*/, "");
      const nisn = row[nisnIdx] || `008${String(1000000 + i).slice(1)}`;
      const defaultEmail = `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "")}${i}@sekolah.sch.id`;
      const email = row[emailIdx] && row[emailIdx].includes("@") ? row[emailIdx].toLowerCase() : defaultEmail;
      const grade = row[gradeIdx] || (row[classIdx]?.includes("2") || row[classIdx]?.includes("XI") ? "Kelas 2 (Kelas XI)" : row[classIdx]?.includes("3") || row[classIdx]?.includes("XII") ? "Kelas 3 (Kelas XII)" : "Kelas 1 (Kelas X)");
      const classGroup = row[classIdx] || (grade.includes("2") ? "Kelas 2-A (XI-A)" : grade.includes("3") ? "Kelas 3-A (XII-A)" : "Kelas 1-A (X-A)");
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

  const handleDownloadCsvTemplate = () => {
    const csvHeader = "Nama Lengkap;NISN;Email;Jenjang Kelas;Rombel / Kelas;Target Program;Password\n";
    const sampleRows = [
      "Ahmad Rizky;0081230001;ahmad.rizky@sekolah.sch.id;Kelas 1;Kelas 1-A (X-A);SMA Reguler;password123",
      "Bella Safitri;0081230002;bella.s@sekolah.sch.id;Kelas 1;Kelas 1-A (X-A);SMA Reguler;password123",
      "Citra Kirana;0081230003;citra.k@sekolah.sch.id;Kelas 2;Kelas 2-A (XI-A);Persiapan UTBK / SNBT;password123",
      "Dimas Prasetyo;0081230004;dimas.p@sekolah.sch.id;Kelas 3;Kelas 3-A (XII-A);Sekolah Kedinasan (SEKDIN);password123",
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvHeader + sampleRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template_import_siswa_nalara.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      setStatusMsg(`🎉 Berhasil mengimpor ${parsedBulkStudents.length} siswa sekaligus ke sistem! Akun Supabase Auth siap.`);
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

  // Filtered queries
  const filteredAssignments = assignments.filter((a) => {
    const matchSearch =
      a.teacherName.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
      a.teacherEmail.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
      a.className.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
      a.subjectName.toLowerCase().includes(assignmentSearch.toLowerCase());
    const matchGrade = assignmentGradeFilter === "all" || a.gradeLevel.toLowerCase().includes(assignmentGradeFilter.toLowerCase());
    return matchSearch && matchGrade;
  });

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
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg bg-brand text-bg"
          >
            <Shield className="w-6 h-6 text-bg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-text">
                Portal Administrator Sekolah
              </h1>
              <Badge variant="accent">Role Engine v2.0</Badge>
            </div>
            <p className="text-xs text-muted">
              Sistem Hak Akses Guru Berdasarkan Kombinasi: <span className="font-semibold text-text">Guru + Kelas + Mata Pelajaran</span>
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
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
        <button
          onClick={() => setAdminTab("assignments")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            adminTab === "assignments"
              ? "bg-brand text-bg shadow-md"
              : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <Briefcase size={16} />
          <span>📋 Penugasan Guru ({assignments.length})</span>
        </button>

        <button
          onClick={() => setAdminTab("classes")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            adminTab === "classes"
              ? "bg-brand text-bg shadow-md"
              : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <School size={16} />
          <span>🏫 Kelola Kelas ({classes.length})</span>
        </button>

        <button
          onClick={() => setAdminTab("subjects")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            adminTab === "subjects"
              ? "bg-brand text-bg shadow-md"
              : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <BookMarked size={16} />
          <span>📚 Mata Pelajaran ({subjects.length})</span>
        </button>

        <button
          onClick={() => setAdminTab("teachers")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            adminTab === "teachers"
              ? "bg-brand text-bg shadow-md"
              : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <Users size={16} />
          <span>👨‍🏫 Akun Guru ({teachers.length})</span>
        </button>

        <button
          onClick={() => setAdminTab("students")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            adminTab === "students"
              ? "bg-brand text-bg shadow-md"
              : "text-muted hover:text-text bg-surface2 border border-border"
          }`}
        >
          <GraduationCap size={16} />
          <span>🎓 Data Siswa ({students.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TEACHER ASSIGNMENTS (GURU + KELAS + MAPEL)                          */}
      {/* ========================================================================= */}
      {adminTab === "assignments" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-text flex items-center gap-2">
                <span>Manajemen Penugasan Guru (Kelas &amp; Mata Pelajaran)</span>
              </h2>
              <p className="text-xs text-muted">
                Kombinasi <strong className="text-brand">Guru + Kelas + Mata Pelajaran</strong> menentukan area kerja dan hak akses data secara ketat.
              </p>
            </div>

            <Button
              onClick={() => setShowAddAssignmentModal(!showAddAssignmentModal)}
              variant="primary"
              className="shadow-lg font-bold"
            >
              <PlusCircle size={18} />
              <span>{showAddAssignmentModal ? "Tutup Form" : "+ Buat Penugasan Baru"}</span>
            </Button>
          </div>

          {/* Form Buat Penugasan Baru */}
          {showAddAssignmentModal && (
            <Card className="p-6 sm:p-8 space-y-6 border-brand/40 bg-surface">
              <div className="border-b border-border pb-3">
                <h3 className="text-base font-bold font-serif text-text flex items-center gap-2">
                  <Briefcase size={18} className="text-brand" />
                  <span>Tetapkan Guru ke Kelas dan Mata Pelajaran</span>
                </h3>
                <p className="text-xs text-muted">
                  Pilih Guru yang akan bertanggung jawab atas satu mata pelajaran di satu kelas tertentu.
                </p>
              </div>

              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Select Guru */}
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">
                      1. Pilih Guru
                    </label>
                    <select
                      value={assignTeacherId}
                      onChange={(e) => setAssignTeacherId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-semibold text-text outline-none focus:border-brand"
                      required
                    >
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Kelas */}
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">
                      2. Pilih Kelas
                    </label>
                    <select
                      value={assignClassId}
                      onChange={(e) => setAssignClassId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-semibold text-text outline-none focus:border-brand"
                      required
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — ({c.gradeLevel})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Mata Pelajaran */}
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">
                      3. Pilih Mata Pelajaran
                    </label>
                    <select
                      value={assignSubjectId}
                      onChange={(e) => setAssignSubjectId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-semibold text-text outline-none focus:border-brand"
                      required
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code} - {s.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <p className="text-[11px] text-muted">
                    💡 Satu guru dapat ditugaskan pada mata pelajaran yang sama di beberapa kelas (misal Kelas 1 dan Kelas 2).
                  </p>
                  <Button type="submit" variant="primary">
                    <span>Simpan Penugasan</span>
                    <CheckCircle2 size={16} />
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Assignment Table Card */}
          <Card className="p-6 space-y-4 border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold font-serif text-text flex items-center gap-2">
                  <Layers size={18} className="text-brand" />
                  <span>Daftar Matriks Penugasan ({filteredAssignments.length})</span>
                </h3>
                <span className="text-xs text-muted">
                  Total {assignments.length} penugasan terdaftar
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={assignmentGradeFilter}
                  onChange={(e) => setAssignmentGradeFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-border bg-surface2 text-xs outline-none focus:border-brand text-text"
                >
                  <option value="all">Semua Tingkat</option>
                  <option value="Kelas 1">Kelas 1</option>
                  <option value="Kelas 2">Kelas 2</option>
                  <option value="Kelas 3">Kelas 3</option>
                </select>

                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    placeholder="Cari guru, kelas, mapel..."
                    value={assignmentSearch}
                    onChange={(e) => setAssignmentSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-border bg-surface2 text-xs outline-none focus:border-brand w-48 text-text"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-3">Guru</th>
                    <th className="pb-3 px-3">Email Akun</th>
                    <th className="pb-3 px-3">Kelas &amp; Tingkat</th>
                    <th className="pb-3 px-3">Mata Pelajaran yang Diampu</th>
                    <th className="pb-3 px-3">Status Akses</th>
                    <th className="pb-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredAssignments.map((a) => (
                    <tr key={a.id} className="hover:bg-surface2/50 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-text text-sm flex items-center gap-2">
                          <span className="text-brand">👨‍🏫</span>
                          <span>{a.teacherName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-muted">{a.teacherEmail}</td>
                      <td className="py-3.5 px-3">
                        <Badge variant="brand" className="text-[10px] font-bold">
                          {a.className}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-accent/40 bg-accent/10 text-accent font-semibold text-xs">
                          <BookOpen size={13} />
                          <span>{a.subjectName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => handleToggleAssignmentStatus(a.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold"
                          title="Klik untuk ubah status penugasan"
                        >
                          {a.status === "active" ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Aktif (Diizinkan)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              Dinonaktifkan
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteAssignment(a.id)}
                          className="text-muted hover:text-error transition-colors p-1.5 rounded-lg hover:bg-error/10"
                          title="Hapus Penugasan"
                        >
                          <Trash2 size={15} />
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
      {/* TAB 2: CLASSES MANAGEMENT (KELAS 1, KELAS 2, KELAS 3, DST)                 */}
      {/* ========================================================================= */}
      {adminTab === "classes" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-text">Daftar Rombongan Belajar / Kelas</h2>
              <p className="text-xs text-muted">
                Admin dapat menambah atau mengedit kelas baru (Kelas 1, Kelas 2, Kelas 3, dan jenjang lainnya).
              </p>
            </div>

            <Button
              onClick={() => setShowAddClassModal(!showAddClassModal)}
              variant="primary"
              className="shadow-lg font-bold"
            >
              <PlusCircle size={18} />
              <span>{showAddClassModal ? "Tutup Form" : "+ Tambah Kelas Baru"}</span>
            </Button>
          </div>

          {/* Add Class Form */}
          {showAddClassModal && (
            <Card className="p-6 space-y-4 border-brand/40 bg-surface">
              <h3 className="text-sm font-bold font-serif text-text flex items-center gap-2">
                <School size={16} className="text-brand" />
                <span>Form Pembuatan Rombel / Kelas Baru</span>
              </h3>
              <form onSubmit={handleCreateClass} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <Input
                  label="Nama Kelas"
                  placeholder="Contoh: Kelas 1-C atau Kelas 4-A"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-xs font-bold text-muted uppercase mb-1">Tingkat Jenjang</label>
                  <select
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                  >
                    <option value="Kelas 1">Kelas 1 (Fase E)</option>
                    <option value="Kelas 2">Kelas 2 (Fase F)</option>
                    <option value="Kelas 3">Kelas 3 (Fase F Lanjutan)</option>
                    <option value="Kelas 4">Kelas 4</option>
                    <option value="Kelas 5">Kelas 5</option>
                    <option value="Kelas 6">Kelas 6</option>
                  </select>
                </div>
                <Input
                  label="Kode Singkat (Opsional)"
                  placeholder="K1C"
                  value={newClassCode}
                  onChange={(e) => setNewClassCode(e.target.value)}
                />
                <Button type="submit" variant="primary">
                  <span>Simpan Kelas</span>
                  <Check size={16} />
                </Button>
              </form>
            </Card>
          )}

          {/* Classes Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((c) => {
              const assignedCount = assignments.filter((a) => a.classId === c.id).length;
              return (
                <Card key={c.id} className="p-5 space-y-3 border-border hover:border-brand/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface2 text-muted">
                      {c.classCode || c.id}
                    </span>
                    <Badge variant="brand" className="text-[10px]">{c.gradeLevel}</Badge>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-text">{c.name}</h4>
                    <p className="text-xs text-muted mt-1">
                      {assignedCount} guru mata pelajaran ditugaskan di kelas ini.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Aktif
                    </span>
                    <button
                      onClick={() => handleDeleteClass(c.id)}
                      className="text-muted hover:text-error transition-colors p-1 rounded"
                      title="Hapus Kelas"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SUBJECTS MANAGEMENT                                                */}
      {/* ========================================================================= */}
      {adminTab === "subjects" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-text">Daftar Mata Pelajaran Kurikulum</h2>
              <p className="text-xs text-muted">
                Seluruh mata pelajaran yang ada di sekolah dapat dikaitkan dengan guru dan kelas.
              </p>
            </div>

            <Button
              onClick={() => setShowAddSubjectModal(!showAddSubjectModal)}
              variant="primary"
              className="shadow-lg font-bold"
            >
              <PlusCircle size={18} />
              <span>{showAddSubjectModal ? "Tutup Form" : "+ Tambah Mapel Baru"}</span>
            </Button>
          </div>

          {/* Add Subject Form */}
          {showAddSubjectModal && (
            <Card className="p-6 space-y-4 border-brand/40 bg-surface">
              <h3 className="text-sm font-bold font-serif text-text flex items-center gap-2">
                <BookMarked size={16} className="text-brand" />
                <span>Form Pembuatan Mata Pelajaran Baru</span>
              </h3>
              <form onSubmit={handleCreateSubject} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <Input
                  label="Nama Mata Pelajaran"
                  placeholder="Contoh: Pendidikan Pancasila / Seni Musik"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  required
                />
                <Input
                  label="Kode Mapel"
                  placeholder="PPKN / MUSIK"
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-xs font-bold text-muted uppercase mb-1">Kategori</label>
                  <select
                    value={newSubjectCategory}
                    onChange={(e) => setNewSubjectCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                  >
                    <option value="Wajib">Wajib</option>
                    <option value="Peminatan">Peminatan</option>
                    <option value="Intensif">Intensif UTBK</option>
                    <option value="Kedinasan">Kedinasan SEKDIN</option>
                  </select>
                </div>
                <Button type="submit" variant="primary">
                  <span>Simpan Mapel</span>
                  <Check size={16} />
                </Button>
              </form>
            </Card>
          )}

          {/* Subjects Table */}
          <Card className="p-6 space-y-4 border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-3">Kode</th>
                    <th className="pb-3 px-3">Nama Mata Pelajaran</th>
                    <th className="pb-3 px-3">Kategori</th>
                    <th className="pb-3 px-3">Tingkat Kurikulum</th>
                    <th className="pb-3 px-3">Jumlah Guru Ditugaskan</th>
                    <th className="pb-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {subjects.map((s) => {
                    const assignedTeachers = assignments.filter((a) => a.subjectId === s.id);
                    return (
                      <tr key={s.id} className="hover:bg-surface2/50 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-brand">{s.code}</td>
                        <td className="py-3.5 px-3 font-bold text-text text-sm">{s.name}</td>
                        <td className="py-3.5 px-3">
                          <Badge variant="accent" className="text-[10px]">{s.category}</Badge>
                        </td>
                        <td className="py-3.5 px-3 text-muted">{s.gradeLevel}</td>
                        <td className="py-3.5 px-3 font-medium">
                          {assignedTeachers.length} Guru ({assignedTeachers.map((at) => at.teacherName).join(", ") || "-"})
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => handleDeleteSubject(s.id)}
                            className="text-muted hover:text-error transition-colors p-1.5 rounded-lg"
                            title="Hapus Mapel"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TEACHERS MANAGEMENT                                                */}
      {/* ========================================================================= */}
      {adminTab === "teachers" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-text">Daftar Akun Guru Terdaftar</h2>
              <p className="text-xs text-muted">
                Kelola akun autentikasi guru. Setiap guru dapat memiliki satu atau lebih penugasan kelas dan mata pelajaran.
              </p>
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
                <h3 className="text-base font-bold font-serif text-text flex items-center gap-2">
                  <UserPlus size={18} className="text-brand" />
                  <span>Form Pendaftaran Guru Baru</span>
                </h3>
                <p className="text-xs text-muted">
                  Akun guru akan langsung dibuatkan di Supabase Auth dan diberikan penugasan awal.
                </p>
              </div>

              <form onSubmit={handleAddTeacher} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nama Lengkap Guru"
                    placeholder="Contoh: Brio Pratama, S.Pd"
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
                    <label className="block text-xs font-bold text-muted uppercase mb-1">Mata Pelajaran Utama</label>
                    <select
                      value={teacherSubject}
                      onChange={(e) => setTeacherSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">Jenjang Utama</label>
                    <select
                      value={teacherGradeLevel}
                      onChange={(e) => setTeacherGradeLevel(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                    >
                      <option value="Kelas 1">Kelas 1</option>
                      <option value="Kelas 2">Kelas 2</option>
                      <option value="Kelas 3">Kelas 3</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">Kelas Penugasan Awal</label>
                    <select
                      value={teacherClassAssigned}
                      onChange={(e) => setTeacherClassAssigned(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="NIP / No. Induk Pendidik"
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
                  placeholder="Cari nama guru..."
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
                    <th className="pb-3 px-3">Penugasan Aktif (Kelas &amp; Mapel)</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredTeachers.map((t) => {
                    const teacherAssignments = assignments.filter(
                      (a) => a.teacherEmail.toLowerCase() === t.email.toLowerCase() && a.status === "active"
                    );
                    return (
                      <tr key={t.id} className="hover:bg-surface2/50 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-text text-sm">{t.name}</div>
                          <div className="text-[11px] text-muted font-mono">{t.nip || "-"}</div>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-brand font-medium">{t.email}</td>
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1.5">
                            {teacherAssignments.length > 0 ? (
                              teacherAssignments.map((asg) => (
                                <span
                                  key={asg.id}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-brand/40 bg-brand/10 text-brand text-[11px] font-semibold"
                                >
                                  <span>{asg.className}</span> • <span>{asg.subjectName}</span>
                                </span>
                              ))
                            ) : (
                              <span className="text-amber-400 text-[11px] italic">
                                Belum ada penugasan (Tugaskan di Tab Penugasan)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <button
                            onClick={() => handleToggleTeacherStatus(t.id)}
                            className="text-xs font-semibold"
                          >
                            {t.status !== "inactive" ? (
                              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                Aktif
                              </span>
                            ) : (
                              <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                                Nonaktif
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => handleDeleteTeacher(t.id)}
                            className="text-muted hover:text-error transition-colors p-1.5 rounded-lg"
                            title="Hapus Guru"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: STUDENTS MANAGEMENT & CSV IMPORT                                   */}
      {/* ========================================================================= */}
      {adminTab === "students" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-text">Daftar Siswa Sekolah</h2>
              <p className="text-xs text-muted">
                Kelola akun siswa dan distribusi ke rombongan belajar masing-masing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowBulkImportModal(true)}
                variant="secondary"
                className="font-bold border-accent/40 text-accent hover:bg-accent/10"
              >
                <FileSpreadsheet size={16} />
                <span>Import CSV / Excel Siswa</span>
              </Button>

              <Button
                onClick={() => setShowAddStudentForm(!showAddStudentForm)}
                variant="primary"
                className="shadow-lg font-bold"
              >
                <PlusCircle size={18} />
                <span>{showAddStudentForm ? "Tutup Form" : "+ Tambah Siswa Baru"}</span>
              </Button>
            </div>
          </div>

          {/* Add Student Form */}
          {showAddStudentForm && (
            <Card className="p-6 sm:p-8 space-y-6 border-brand/40 bg-surface">
              <h3 className="text-base font-bold font-serif text-text flex items-center gap-2 border-b border-border pb-3">
                <UserPlus size={18} className="text-brand" />
                <span>Form Pendaftaran Siswa Baru</span>
              </h3>

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
                    label="NISN Siswa"
                    placeholder="0081234567"
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
                    <label className="block text-xs font-bold text-muted uppercase mb-1">Jenjang Tingkat</label>
                    <select
                      value={studentGradeLevel}
                      onChange={(e) => setStudentGradeLevel(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                    >
                      <option value="Kelas 1 (Kelas X)">Kelas 1 (Kelas X)</option>
                      <option value="Kelas 2 (Kelas XI)">Kelas 2 (Kelas XI)</option>
                      <option value="Kelas 3 (Kelas XII)">Kelas 3 (Kelas XII)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">Rombel / Kelas</label>
                    <select
                      value={studentClassGroup}
                      onChange={(e) => setStudentClassGroup(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">Target Belajar</label>
                    <select
                      value={studentTargetProgram}
                      onChange={(e) => setStudentTargetProgram(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-surface2 text-xs font-medium text-text outline-none focus:border-brand"
                    >
                      <option value="SMA Reguler">SMA Reguler</option>
                      <option value="Persiapan UTBK / SNBT">Persiapan UTBK / SNBT</option>
                      <option value="Sekolah Kedinasan (SEKDIN)">Sekolah Kedinasan (SEKDIN)</option>
                      <option value="SMA Reguler & Kedinasan">SMA Reguler &amp; Kedinasan</option>
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
                    <p className="text-[11px] text-muted pb-2">
                      💡 Siswa dapat langsung login di <code>/login</code> menggunakan email dan password ini.
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
                  placeholder="Cari siswa / NISN..."
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
                    <th className="pb-3 px-3">Rombel / Kelas</th>
                    <th className="pb-3 px-3">Status Sekolah</th>
                    <th className="pb-3 px-3 text-right">Aksi Kelulusan &amp; Akun</th>
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
                        <Badge variant="success" className="text-[10px]">🟢 Aktif</Badge>
                      </td>
                      <td className="py-3.5 px-3 text-right flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={async () => {
                            if (confirm(`Set status siswa ${s.name} (${s.email}) menjadi LULUS / ALUMNI? Akses masuk kelas akan dinonaktifkan.`)) {
                              try {
                                const res = await fetch("/api/admin/toggle-student-status", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    studentId: s.id,
                                    email: s.email,
                                    academicStatus: "graduated",
                                  }),
                                });
                                const data = await res.json();
                                if (res.ok) {
                                  setStatusMsg(`Siswa ${s.name} berhasil di-set LULUS / ALUMNI. Akses kelas di-block.`);
                                } else {
                                  alert(`Gagal: ${data.error}`);
                                }
                              } catch (err) {
                                alert("Error updating status");
                              }
                            }
                          }}
                          className="text-[11px] py-1 border-amber-500/40 text-amber-400 font-bold hover:bg-amber-950/20"
                        >
                          🎓 Tandai Lulus
                        </Button>
                        <button
                          onClick={() => handleDeleteStudent(s.id)}
                          className="text-muted hover:text-error transition-colors p-1.5 rounded-lg"
                          title="Hapus Siswa"
                        >
                          <Trash2 size={15} />
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

      {/* Bulk Import Modal */}
      {showBulkImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <Card className="w-full max-w-2xl p-6 space-y-5 border-border shadow-2xl bg-surface max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-accent w-5 h-5" />
                <h3 className="text-lg font-bold font-serif text-text">Import Siswa dari Excel / CSV</h3>
              </div>
              <button
                onClick={() => setShowBulkImportModal(false)}
                className="text-muted hover:text-text p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-surface2 border border-border">
              <span className="text-xs text-muted">Unduh format CSV sesuai standar sekolah:</span>
              <Button size="sm" variant="secondary" onClick={handleDownloadCsvTemplate} className="text-xs">
                <Download size={14} />
                <span>Unduh Template CSV</span>
              </Button>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted uppercase mb-2">
                Upload File CSV / Excel
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="w-full text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand file:text-bg hover:file:opacity-90"
              />
              {uploadedFileName && (
                <p className="text-[11px] text-brand mt-1 font-mono">File terpilih: {uploadedFileName}</p>
              )}
            </div>

            {parsedBulkStudents.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-text">
                  <span>Pratinjau Data ({parsedBulkStudents.length} siswa siap diimpor):</span>
                </div>
                <div className="max-h-48 overflow-y-auto border border-border rounded-xl p-2 bg-surface2 space-y-1">
                  {parsedBulkStudents.slice(0, 10).map((p, idx) => (
                    <div key={idx} className="text-[11px] flex items-center justify-between py-1 border-b border-border/40">
                      <span className="font-semibold text-text">{p.name} ({p.nisn})</span>
                      <span className="font-mono text-muted">{p.email} • {p.classGroup}</span>
                    </div>
                  ))}
                  {parsedBulkStudents.length > 10 && (
                    <p className="text-[10px] text-muted text-center pt-1 italic">
                      ...dan {parsedBulkStudents.length - 10} siswa lainnya
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-border">
              <Button variant="secondary" onClick={() => setShowBulkImportModal(false)}>
                Batal
              </Button>
              <Button
                variant="primary"
                onClick={handleExecuteBulkImport}
                loading={isImportingBulk}
                disabled={parsedBulkStudents.length === 0}
              >
                <span>Impor {parsedBulkStudents.length} Siswa Sekarang</span>
                <Check size={16} />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
