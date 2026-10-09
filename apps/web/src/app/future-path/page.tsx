"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Compass,
  ArrowLeft,
  ExternalLink,
  Award,
  DollarSign,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  Globe,
  BrainCircuit,
  Layers,
  PlusCircle,
  X,
  Send,
  Star,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  SlidersHorizontal,
  BookmarkCheck,
  Check,
  Target,
  School,
  FileCheck,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { Card, GlowCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  getStoredTracerRecords,
  updateOrAddTracerRecord,
  TracerRecord,
} from "@/lib/tracer-study";

// Types
interface Scholarship {
  id: string;
  title: string;
  provider: string;
  category: string;
  level: string;
  coverageBadge: string;
  allowance: string;
  minScoreReq: number;
  deadline: string;
  status: string;
  requirements: string[];
  applyUrl: string;
  tags: string[];
  aiFitScore?: number;
  isRecommended?: boolean;
  description?: string;
  isCustomPosted?: boolean;
}

interface JobVacancy {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  category: string;
  tags: string[];
  jobType: string;
  publicationDate: string;
  location: string;
  salary: string;
  url: string;
  description: string;
  isCustomPosted?: boolean;
}

interface CareerAssessmentResult {
  archetype: string;
  riasecCode: string;
  riasecBreakdown?: {
    Realistic: number;
    Investigative: number;
    Artistic: number;
    Social: number;
    Enterprising: number;
    Conventional: number;
  };
  topStrengths: string[];
  recommendedCareers: {
    title: string;
    description: string;
    suitableIndustries?: string;
    jobTag: string;
  }[];
  recommendedScholarshipTrack?: string;
  adviceForStudent: string;
}

// 12 Comprehensive Holland RIASEC Model Questions
const ASSESSMENT_QUESTIONS = [
  // Bagian 1: Preferensi Aktivitas & Gaya Kerja Alami
  {
    id: 1,
    dimension: "Aktivitas Harian",
    question: "Aktivitas mana yang paling membuatmu bersemangat dan betah berjam-jam tanpa merasa bosan?",
    options: [
      { text: "🔧 Membongkar, merakit, atau memperbaiki perangkat fisik & komputer", category: "realistic" },
      { text: "🔬 Mengamati fenomena, riset logika, atau memecahkan soal hitungan rumit", category: "investigative" },
      { text: "🎨 Mendesain grafis, menggambar, mengedit video, atau menulis cerita", category: "artistic" },
      { text: "👥 Mengobrol, mendengarkan curhat, atau mengajar materi ke teman", category: "social" },
      { text: "💼 Mempromosikan ide, berjualan, atau memimpin rapat koordinasi", category: "enterprising" },
      { text: "📊 Merapikan file arsip, menyusun data spreadsheet, dan budgeting kas", category: "conventional" },
    ],
  },
  {
    id: 2,
    dimension: "Pilihan Proyek",
    question: "Jika kelasmu mengadakan acara pameran sekolah, divisi mana yang paling ingin kamu pimpin?",
    options: [
      { text: "⚙️ Logistik & Perlengkapan: Menyiapkan panggung, kabel, dan instalasi teknis", category: "realistic" },
      { text: "🔎 Riset & Evaluasi: Menganalisis kuesioner respon pengunjung dan materi edukasi", category: "investigative" },
      { text: "✨ Dekorasi & Publikasi: Mendesain poster, backdrop, dan video teaser pameran", category: "artistic" },
      { text: "🤝 Humas & Guest Relations: Menyambut tamu undangan dan memandu pengunjung", category: "social" },
      { text: "🎯 Sponsorship & Ticketing: Mencari sponsor dana dan strategi penjualan tiket", category: "enterprising" },
      { text: "📑 Administrasi & Keuangan: Mencatat pemasukan/pengeluaran dan pembukuan resmi", category: "conventional" },
    ],
  },
  {
    id: 3,
    dimension: "Gaya Berpikir",
    question: "Bagaimana caramu paling nyaman dalam memecahkan masalah yang membingungkan?",
    options: [
      { text: "🛠️ Langsung uji coba dengan tangan sendiri (trial & error pada objek fisik)", category: "realistic" },
      { text: "🧠 Menganalisis data fakta, mencari literatur, dan menguji rumus logika", category: "investigative" },
      { text: "💡 Berpikir di luar kebiasaan (out of the box) dengan pendekatan kreatif baru", category: "artistic" },
      { text: "🗣️ Berdiskusi dan meminta sudut pandang dari orang lain secara empatik", category: "social" },
      { text: "🚀 Mengambil keputusan cepat dan mendelegasikan tugas ke anggota tim", category: "enterprising" },
      { text: "📋 Mengikuti buku panduan SOP dan prosedur terstandarisasi yang teruji", category: "conventional" },
    ],
  },
  {
    id: 4,
    dimension: "Mata Pelajaran Favorit",
    question: "Mata pelajaran atau bidang keahlian apa yang nilainya paling mudah kamu pahami?",
    options: [
      { text: "🔩 Fisika Terapan / Bengkel Kejuruan / Komputer Jaringan (TKJ/TKR)", category: "realistic" },
      { text: "📐 Matematika Murni / Kimia / Biologi / Logika Sains", category: "investigative" },
      { text: "🎭 Seni Budaya / Bahasa & Sastra / Desain Komunikasi Visual (DKV)", category: "artistic" },
      { text: "📖 Sosiologi / Bimbingan Konseling / Pendidikan Kewarganegaraan", category: "social" },
      { text: "📈 Ekonomi Bisnis / Kewirausahaan (PKWU) / Pemasaran", category: "enterprising" },
      { text: "💻 Akuntansi / Administrasi Perkantoran / Otomatisasi Tata Kelola", category: "conventional" },
    ],
  },
  // Bagian 2: Lingkungan Kerja & Interaksi Sosial
  {
    id: 5,
    dimension: "Lingkungan Kerja",
    question: "Suasana tempat kerja impianmu yang paling mendukung produktivitasmu adalah...",
    options: [
      { text: "🏗️ Bengkel, lapangan outdoor, laboratorium teknis, atau ruang data center", category: "realistic" },
      { text: "🔬 Laboratorium riset yang tenang, perpustakaan, atau workstation analisis", category: "investigative" },
      { text: "🎨 Studio kreatif yang fleksibel, penuh estetika visual, dan bebas berekspresi", category: "artistic" },
      { text: "🏫 Ruang kelas, pusat layanan publik, atau lingkungan sosial yang hangat", category: "social" },
      { text: "🏢 Ruang rapat eksekutif, agensi yang serba cepat, atau pusat bisnis dinamis", category: "enterprising" },
      { text: "🏛️ Kantor modern yang rapi, bersih, teratur, dengan alur kerja yang jelas", category: "conventional" },
    ],
  },
  {
    id: 6,
    dimension: "Kekuatan Diri",
    question: "Pujian apa yang paling sering kamu dapatkan dari orang tua, guru, atau teman dekat?",
    options: [
      { text: "'Kamu cekatan sekali kalau disuruh benerin barang atau alat rusak!'", category: "realistic" },
      { text: "'Pikiranmu sangat kritis dan analitis, selalu punya data di balik omonganmu!'", category: "investigative" },
      { text: "'Ide kamu selalu orisinal, desain atau tulisanmu punya ciri khas keren!'", category: "artistic" },
      { text: "'Kamu ramah banget dan selalu bisa menenangkan orang yang lagi susah!'", category: "social" },
      { text: "'Kamu jago membujuk dan memotivasi orang lain untuk ikut rencanamu!'", category: "enterprising" },
      { text: "'Kamu sangat teliti, rapi, dan bertanggung jawab terhadap catatan dokumen!'", category: "conventional" },
    ],
  },
  {
    id: 7,
    dimension: "Teknologi Digital",
    question: "Perangkat lunak (software) atau aplikasi apa yang paling sering dan senang kamu gunakan?",
    options: [
      { text: "⚡ Software utilitas sistem, emulator, terminal CLI, atau mikrokontroler", category: "realistic" },
      { text: "📊 Alat pengolah data statistik, database, atau search engine riset ilmiah", category: "investigative" },
      { text: "🎨 Canva, Figma, Adobe Photoshop, Premiere Pro, atau aplikasi lukis digital", category: "artistic" },
      { text: "💬 Platform komunikasi tim, media edukasi, forum diskusi, dan video conference", category: "social" },
      { text: "📱 Ads Manager media sosial, analitik penjualan marketplace, dan presentasi", category: "enterprising" },
      { text: "📑 Microsoft Excel / Google Sheets, software kasir POS, dan form administrasi", category: "conventional" },
    ],
  },
  {
    id: 8,
    dimension: "Sikap Terhadap Aturan",
    question: "Bagaimana pandanganmu tentang aturan dan Standard Operating Procedure (SOP) di tempat kerja?",
    options: [
      { text: "⚙️ Aturan praktis keselamatan kerja mutlak penting agar alat bekerja aman", category: "realistic" },
      { text: "🔍 Aturan harus berbasis bukti ilmiah yang masuk akal dan dapat diuji", category: "investigative" },
      { text: "🎨 Terlalu banyak aturan kaku bisa membatasi kreativitas dan inspirasi bebas", category: "artistic" },
      { text: "🤝 Aturan harus mengutamakan kebaikan bersama dan kesejahteraan manusia", category: "social" },
      { text: "🚀 Aturan harus fleksibel mengikuti dinamika pasar demi mencapai target sukses", category: "enterprising" },
      { text: "📋 SOP tertulis sangat krusial agar operasional rapi, seragam, dan minim error", category: "conventional" },
    ],
  },
  // Bagian 3: Orientasi Karir & Visi Masa Depan
  {
    id: 9,
    dimension: "Pengambilan Keputusan",
    question: "Saat harus memilih antara beberapa pilihan penting, faktor apa yang menjadi penentu utamamu?",
    options: [
      { text: "🛠️ Kepraktisan fisik: Mana yang paling bisa langsung diterapkan di dunia nyata", category: "realistic" },
      { text: "🧠 Logika & Fakta: Mana yang didukung argumen ilmiah dan perhitungan probabilitas", category: "investigative" },
      { text: "💡 Intuisi & Nilai Keindahan: Mana yang paling membangkitkan rasa estetik & passion", category: "artistic" },
      { text: "👥 Dampak Kemanusiaan: Mana yang paling menolong dan membahagiakan orang banyak", category: "social" },
      { text: "📈 Peluang Keberhasilan: Mana yang memberikan keuntungan dan peluang karier terbesar", category: "enterprising" },
      { text: "📑 Kepastian & Keamanan: Mana yang paling minim risiko dan alurnya paling terukur", category: "conventional" },
    ],
  },
  {
    id: 10,
    dimension: "Waktu Luang",
    question: "Di akhir pekan atau saat liburan panjang, kegiatan apa yang paling kamu sukai?",
    options: [
      { text: "🚲 Bersepeda, merakit hobi mekanik/elektronika, atau olahraga fisik", category: "realistic" },
      { text: "📚 Menonton video dokumenter sains, membaca buku pengetahuan, atau teka-teki", category: "investigative" },
      { text: "✍️ Menulis jurnal/cerita, menggambar ilustrasi, atau membuat konten video", category: "artistic" },
      { text: "☕ Nongkrong santai bersama teman, kegiatan sukarelawan, atau mentoring adik kelas", category: "social" },
      { text: "💰 Menjual barang dagangan online, menyusun ide bisnis, atau networking", category: "enterprising" },
      { text: "📁 Merapikan kamar, membersihkan file HP/laptop, dan menyusun to-do list pekanan", category: "conventional" },
    ],
  },
  {
    id: 11,
    dimension: "Tantangan Favorit",
    question: "Tantangan seperti apa yang membuatmu merasa bangga setelah berhasil menyelesaikannya?",
    options: [
      { text: "🔧 Berhasil memperbaiki barang yang tadinya rusak menjadi berfungsi normal", category: "realistic" },
      { text: "🔬 Berhasil menemukan jawaban dari misteri logika yang tidak dipahami orang lain", category: "investigative" },
      { text: "🎨 Berhasil membuat karya seni atau desain yang diapresiasi banyak orang", category: "artistic" },
      { text: "🤝 Berhasil membantu seseorang yang tadinya bingung menjadi paham dan lega", category: "social" },
      { text: "🏆 Berhasil meyakinkan orang yang ragu dan mencapai target yang tinggi", category: "enterprising" },
      { text: "📑 Berhasil merapikan laporan dokumen rumit hingga 100% akurat tanpa selisih", category: "conventional" },
    ],
  },
  {
    id: 12,
    dimension: "Tujuan Karir Utama",
    question: "Apa visi karir jangka panjang yang paling ingin kamu capai di masa depan?",
    options: [
      { text: "⚡ Menjadi master praktisi teknis / insinyur ahli terpercaya di bidangnya", category: "realistic" },
      { text: "🔬 Menjadi peneliti / pakar data analis yang memecahkan masalah kompleks", category: "investigative" },
      { text: "✨ Menjadi kreator / desainer ternama dengan portofolio karya berkelas dunia", category: "artistic" },
      { text: "🌟 Menjadi pengajar / konsultan pembimbing yang mengubah hidup banyak orang", category: "social" },
      { text: "🚀 Menjadi entrepreneur sukses / eksekutif pemimpin perusahaan besar", category: "enterprising" },
      { text: "📈 Menjadi manajer keuangan / pengendali administrasi perusahaan yang mapan", category: "conventional" },
    ],
  },
];

const JOB_CATEGORIES = [
  { id: "all", label: "Semua Lowongan" },
  { id: "software-dev", label: "Software & IT Tech" },
  { id: "customer-support", label: "Customer Service & Retail" },
  { id: "data", label: "Data & Administrasi" },
  { id: "marketing", label: "Marketing & Sales" },
  { id: "design", label: "Desain & Media" },
  { id: "writing", label: "Writing & Content" },
  { id: "finance", label: "Finance & Legal" },
  { id: "hr", label: "Human Resources (HR)" },
];

function FuturePathContent() {
  const searchParams = useSearchParams();
  const studentEmail = searchParams.get("user") || "andi@sekolah.sch.id";

  // Navigation: "scholarships" | "jobs" | "tracer"
  const initialTab = searchParams.get("tab") === "jobs" ? "jobs" : searchParams.get("tab") === "tracer" ? "tracer" : "scholarships";
  const [activeTab, setActiveTab] = useState<"scholarships" | "jobs" | "tracer">(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "jobs" || tabParam === "scholarships" || tabParam === "tracer") {
      setActiveTab(tabParam as "scholarships" | "jobs" | "tracer");
    }
  }, [searchParams]);

  // Tracer Study & Career Tracking State
  const [tracerData, setTracerData] = useState<TracerRecord | null>(null);
  const [plannedPathway, setPlannedPathway] = useState<"Kuliah" | "Kedinasan" | "Bekerja" | "Wirausaha">("Kuliah");
  const [plannedTarget, setPlannedTarget] = useState("Universitas Indonesia (UI) - Teknik Informatika");
  const [realizationStatus, setRealizationStatus] = useState<"Kuliah" | "Kedinasan" | "Bekerja" | "Wirausaha" | "Mencari Kerja">("Kuliah");
  const [realizationDetail, setRealizationDetail] = useState("Sedang bimbingan intensif persiapan SNBT & UTBK");
  const [isSavingTracer, setIsSavingTracer] = useState(false);
  const [tracerSuccessMsg, setTracerSuccessMsg] = useState<string | null>(null);
  const [isStudentGraduated, setIsStudentGraduated] = useState(false);
  const [studentGrade, setStudentGrade] = useState("Kelas 2 (Kelas XI)");
  const [studentClass, setStudentClass] = useState("Kelas XI-A");

  // Sync Tracer Data on Mount
  useEffect(() => {
    try {
      const records = getStoredTracerRecords();
      const current = records.find((r) => r.email.toLowerCase() === studentEmail.toLowerCase());
      if (current) {
        setTracerData(current);
        setPlannedPathway(current.plannedPathway);
        setPlannedTarget(current.plannedTarget);
        setRealizationStatus(current.realizationStatus);
        setRealizationDetail(current.realizationDetail);
        setIsStudentGraduated(current.academicStatus === "graduated");
        if (current.classOrigin) setStudentClass(current.classOrigin);
      }

      // Check graduated status in local storage
      const rawGrad = localStorage.getItem("nalara_graduated_students");
      if (rawGrad) {
        const grads: string[] = JSON.parse(rawGrad);
        if (grads.includes(studentEmail.toLowerCase())) {
          setIsStudentGraduated(true);
        }
      }

      // Check student grade level from registered students list
      const rawReg = localStorage.getItem("nalara_registered_students");
      if (rawReg) {
        const list: any[] = JSON.parse(rawReg);
        const found = list.find((s) => s.email?.toLowerCase() === studentEmail.toLowerCase());
        if (found) {
          if (found.gradeLevel) setStudentGrade(found.gradeLevel);
          if (found.classGroup) setStudentClass(found.classGroup);
        }
      }
    } catch {
      // ignore
    }
  }, [studentEmail]);

  const isFinalYearOrGraduated =
    studentGrade.toLowerCase().includes("12") ||
    studentGrade.toLowerCase().includes("xii") ||
    studentGrade.toLowerCase().includes("kelas 3") ||
    studentClass.toLowerCase().includes("xii") ||
    studentClass.toLowerCase().includes("3-") ||
    isStudentGraduated;

  // Scholarships State
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [scholarshipCategory, setScholarshipCategory] = useState("all");
  const [scholarshipSearch, setScholarshipSearch] = useState("");
  const [isLoadingScholarships, setIsLoadingScholarships] = useState(true);
  const [visibleScholarshipsCount, setVisibleScholarshipsCount] = useState(36);

  // Jobs State
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [jobCategory, setJobCategory] = useState("all");
  const [jobSearch, setJobSearch] = useState("");
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [visibleJobsCount, setVisibleJobsCount] = useState(36);

  // Modals for Direct Input & Quick Apply
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isScholarshipModalOpen, setIsScholarshipModalOpen] = useState(false);
  const [selectedApplyJob, setSelectedApplyJob] = useState<JobVacancy | null>(null);
  const [isApplySubmitted, setIsApplySubmitted] = useState(false);
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantNote, setApplicantNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State: Job
  const [newJobForm, setNewJobForm] = useState({
    title: "",
    companyName: "",
    category: "data",
    location: "",
    salary: "",
    jobType: "Full Time",
    url: "",
    description: "",
    tags: "",
  });

  // Form State: Scholarship
  const [newSchForm, setNewSchForm] = useState({
    title: "",
    provider: "",
    category: "swasta",
    level: "Program Sarjana (S1 / D4)",
    coverageBadge: "Bebas Biaya Pendidikan 100% + Uang Saku",
    allowance: "",
    deadline: "",
    applyUrl: "",
    requirements: "",
    tags: "",
  });

  // Career Assessment State (12 Questions Pagination)
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, { text: string; category: string }>>({});
  const [currentQuestionPage, setCurrentQuestionPage] = useState(0); // 0: Q1-Q4, 1: Q5-Q8, 2: Q9-Q12
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<CareerAssessmentResult | null>(null);

  // Fetch Scholarships
  const loadScholarships = async () => {
    setIsLoadingScholarships(true);
    try {
      const res = await fetch(`/api/future/scholarships?category=${scholarshipCategory}&score=85`);
      const data = await res.json();
      if (data.success) {
        setScholarships(data.scholarships || []);
      }
    } catch (err) {
      console.error("Error loading scholarships:", err);
    } finally {
      setIsLoadingScholarships(false);
    }
  };

  useEffect(() => {
    loadScholarships();
  }, [scholarshipCategory]);

  // Fetch Real-Time Jobs
  const loadJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const res = await fetch(`/api/future/jobs?category=${jobCategory}&query=${encodeURIComponent(jobSearch)}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
        setVisibleJobsCount(36);
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [jobCategory, jobSearch]);

  // Filtered Scholarships (by search)
  const filteredScholarships = scholarships.filter((s) => {
    if (!scholarshipSearch.trim()) return true;
    const q = scholarshipSearch.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.provider.toLowerCase().includes(q) ||
      s.level.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  // Handle Assessment Submit
  const handleRunAssessment = async () => {
    if (Object.keys(assessmentAnswers).length < ASSESSMENT_QUESTIONS.length) {
      alert(`Harap lengkapi seluruh 12 pertanyaan asesmen terlebih dahulu (Saat ini dijawab: ${Object.keys(assessmentAnswers).length}/12).`);
      return;
    }

    setIsAssessing(true);
    try {
      const res = await fetch("/api/future/career-assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: assessmentAnswers,
          studentName: studentEmail.split("@")[0],
          masteryScore: 85,
        }),
      });

      const data = await res.json();
      if (data.success && data.assessment) {
        setAssessmentResult(data.assessment);
        if (data.assessment.recommendedCareers?.[0]?.jobTag) {
          setJobCategory(data.assessment.recommendedCareers[0].jobTag);
        }
      }
    } catch (err) {
      console.error("Error analyzing career:", err);
    } finally {
      setIsAssessing(false);
    }
  };

  // Submit Direct Custom Job
  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobForm.title || !newJobForm.companyName || !newJobForm.url) {
      alert("Judul posisi, nama perusahaan, dan link pendaftaran wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/future/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newJobForm,
          tags: newJobForm.tags ? newJobForm.tags.split(",").map((t) => t.trim()) : ["Mitra Sekolah", "Lowongan Baru"],
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("🎉 Berhasil! Lowongan kerja baru telah diterbitkan dan langsung tampil secara real-time untuk seluruh siswa.");
        setIsJobModalOpen(false);
        setNewJobForm({
          title: "",
          companyName: "",
          category: "data",
          location: "",
          salary: "",
          jobType: "Full Time",
          url: "",
          description: "",
          tags: "",
        });
        await loadJobs();
      } else {
        alert(data.error || "Gagal menerbitkan lowongan.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Direct Custom Scholarship
  const handleSubmitScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchForm.title || !newSchForm.provider || !newSchForm.applyUrl) {
      alert("Nama beasiswa, institusi penyelenggara, dan link pendaftaran wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/future/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newSchForm,
          requirements: newSchForm.requirements ? newSchForm.requirements.split("\n").map((r) => r.trim()).filter(Boolean) : ["Siswa SMA/SMK sederajat", "Rapor akademik baik"],
          tags: newSchForm.tags ? newSchForm.tags.split(",").map((t) => t.trim()) : ["Mitra Resmi", "Beasiswa Baru"],
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("🎉 Berhasil! Program beasiswa baru telah diterbitkan dan langsung tampil secara real-time untuk seluruh siswa.");
        setIsScholarshipModalOpen(false);
        setNewSchForm({
          title: "",
          provider: "",
          category: "swasta",
          level: "Program Sarjana (S1 / D4)",
          coverageBadge: "Bebas Biaya Pendidikan 100% + Uang Saku",
          allowance: "",
          deadline: "",
          applyUrl: "",
          requirements: "",
          tags: "",
        });
        await loadScholarships();
      } else {
        alert(data.error || "Gagal menerbitkan beasiswa.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveTracer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTracer(true);
    setTracerSuccessMsg(null);
    try {
      const res = await fetch("/api/student/update-tracer-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: studentEmail,
          name: studentName,
          plannedPathway,
          plannedTarget,
          realizationStatus,
          realizationDetail,
          verificationStatus: "verified",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data");

      const updated = updateOrAddTracerRecord({
        email: studentEmail,
        studentName,
        plannedPathway,
        plannedTarget,
        realizationStatus,
        realizationDetail,
        verificationStatus: "verified",
      });
      const myRecord = updated.find((r) => r.email.toLowerCase() === studentEmail.toLowerCase());
      if (myRecord) setTracerData(myRecord);

      setTracerSuccessMsg("🎉 Data formulir rencana & realisasi kelulusan (Tracer Study) berhasil diperbarui dan tersimpan!");
      setTimeout(() => setTracerSuccessMsg(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan data";
      alert(msg);
    } finally {
      setIsSavingTracer(false);
    }
  };

  const studentName = studentEmail.toLowerCase().includes("andi")
    ? "Andi Pratama"
    : studentEmail.split("@")[0].replace(".", " ");

  // Questions per page (4 questions per page for smooth focus)
  const questionsPerPage = 4;
  const totalPages = Math.ceil(ASSESSMENT_QUESTIONS.length / questionsPerPage);
  const currentQuestions = ASSESSMENT_QUESTIONS.slice(
    currentQuestionPage * questionsPerPage,
    (currentQuestionPage + 1) * questionsPerPage
  );
  const answeredCount = Object.keys(assessmentAnswers).length;
  const progressPercent = Math.round((answeredCount / ASSESSMENT_QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header Bar with Professional Gradient & Actions */}
      <header
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl border border-border shadow-lg relative overflow-hidden backdrop-blur-xl"
        style={{ background: "linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%)" }}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => (window.location.href = `/quiz?user=${encodeURIComponent(studentEmail)}`)}
            className="text-xs font-bold gap-2 px-3 py-2 sm:px-3.5 shadow-sm rounded-xl hover:scale-105 transition-all shrink-0"
          >
            <ArrowLeft size={16} />
            <span className="hidden xs:inline">Kuis &amp; Latihan</span>
            <span className="xs:hidden">Kuis</span>
          </Button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl font-black font-serif text-brand tracking-tight">NALARA</span>
              <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-brand/15 text-brand border border-brand/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles size={12} />
                <span>Pusat Karir &amp; Beasiswa</span>
              </span>
            </div>
            <p className="text-xs text-muted mt-1">
              Halo, <span className="font-bold text-text">{studentName}</span>! Eksplorasi beasiswa aktif, lowongan kerja, serta formulir tracer study.
            </p>
          </div>
        </div>

        {/* Global Tab Switcher & Direct Posting Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-surface border border-border shadow-inner overflow-x-auto max-w-full no-scrollbar">
            <button
              onClick={() => setActiveTab("scholarships")}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === "scholarships"
                  ? "bg-brand text-bg shadow-md scale-[1.02]"
                  : "text-muted hover:text-text hover:bg-surface2"
              }`}
            >
              <GraduationCap size={15} />
              <span className="hidden sm:inline">Cari Beasiswa ({scholarships.length})</span>
              <span className="sm:hidden">Beasiswa ({scholarships.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === "jobs"
                  ? "bg-brand text-bg shadow-md scale-[1.02]"
                  : "text-muted hover:text-text hover:bg-surface2"
              }`}
            >
              <Briefcase size={15} />
              <span className="hidden sm:inline">Lowongan Kerja ({jobs.length})</span>
              <span className="sm:hidden">Loker ({jobs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("tracer")}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === "tracer"
                  ? "bg-brand text-bg shadow-md scale-[1.02]"
                  : "text-muted hover:text-text hover:bg-surface2"
              }`}
            >
              <Target size={15} />
              <span className="hidden sm:inline">📋 Tracer &amp; Rencana</span>
              <span className="sm:hidden">📋 Tracer</span>
            </button>
          </div>

          {/* Direct Input Action Button */}
          {activeTab === "jobs" ? (
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsJobModalOpen(true)}
              className="text-xs font-bold gap-1.5 shadow-md bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
            >
              <PlusCircle size={15} />
              <span>+ Pasang Loker Mitra</span>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsScholarshipModalOpen(true)}
              className="text-xs font-bold gap-1.5 shadow-md bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
            >
              <PlusCircle size={15} />
              <span>+ Input Info Beasiswa</span>
            </Button>
          )}
        </div>
      </header>

      {/* Grade Level Notice for Underclassmen (Kelas 10 & 11) */}
      {!isFinalYearOrGraduated && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start sm:items-center gap-3 shadow-sm">
          <span className="text-xl shrink-0">ℹ️</span>
          <div className="leading-relaxed">
            <strong>Catatan Kurikulum ({studentClass} - {studentGrade}):</strong> Akses pencarian Beasiswa Kuliah &amp; Lowongan Kerja difokuskan intensif saat Anda memasuki <strong>Tingkat Akhir (Kelas 12)</strong> atau setelah <strong>Lulus (Alumni)</strong>. Saat ini Anda dapat mengisi pemetaan cita-cita awal pada tab <strong>Tracer &amp; Rencana Kelulusan</strong>.
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: SCHOLARSHIPS REAL-TIME INTELLIGENCE (PROFESSIONAL EDTECH BENTO)    */}
      {/* ========================================================================= */}
      {activeTab === "scholarships" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* AI Professional Banner */}
          <GlowCard className="p-6 sm:p-8 border-brand/30 bg-surface relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-wider">
                  <BrainCircuit size={16} />
                  <span>Sistem Rekomendasi Beasiswa Lengkap &amp; Terverifikasi NALARA</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-text leading-tight">
                  Katalog Beasiswa Kuliah Lengkap Seluruh Indonesia &amp; Global ({filteredScholarships.length} Program Aktif)
                </h2>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Semua program beasiswa sarjana (S1), diploma (D4/D3), dan kedinasan yang sedang membuka pendaftaran. Mulai dari bebas UKT 100%, tunjangan uang saku, biaya buku, hingga tiket luar negeri.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <Clock size={14} className="animate-pulse" />
                  <span>Live Stream RSS Feed Aktif</span>
                </div>
                <span className="text-[11px] text-muted font-medium">Diperbarui setiap 30 menit otomatis</span>
              </div>
            </div>
          </GlowCard>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface2/60 border border-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-muted uppercase flex items-center gap-1 mr-1">
                <SlidersHorizontal size={14} />
                <span>Kategori:</span>
              </span>
              {[
                { id: "all", label: `Semua Beasiswa (${scholarships.length})` },
                { id: "pemerintah", label: "🏛️ Pemerintah & KIP-K" },
                { id: "bumn", label: "🏦 BUMN & BI" },
                { id: "swasta", label: "🏢 Swasta & Korporat" },
                { id: "internasional", label: "🌍 Luar Negeri / Global" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setScholarshipCategory(cat.id);
                    setVisibleScholarshipsCount(36);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    scholarshipCategory === cat.id
                      ? "bg-brand text-bg shadow-sm scale-[1.02]"
                      : "bg-surface border border-border text-muted hover:text-text hover:border-brand/40"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Cari beasiswa / kampus / negara..."
                value={scholarshipSearch}
                onChange={(e) => setScholarshipSearch(e.target.value)}
                className="pl-9 pr-3.5 py-2 rounded-xl border border-border bg-surface text-xs outline-none focus:border-brand w-full sm:w-64 text-text shadow-sm"
              />
            </div>
          </div>

          {/* Scholarship Bento Cards Grid */}
          {isLoadingScholarships ? (
            <div className="p-16 text-center text-muted text-xs">
              <span className="animate-pulse">Memuat seluruh data beasiswa real-time dari portal resmi...</span>
            </div>
          ) : filteredScholarships.length === 0 ? (
            <Card className="p-12 text-center text-muted text-xs space-y-3 border-border">
              <p className="text-sm font-semibold">Tidak ditemukan beasiswa dengan kata kunci &quot;{scholarshipSearch}&quot;.</p>
              <Button size="sm" variant="secondary" onClick={() => { setScholarshipCategory("all"); setScholarshipSearch(""); }}>
                Reset Filter &amp; Tampilkan Semua
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScholarships.slice(0, visibleScholarshipsCount).map((sch) => (
                  <Card
                    key={sch.id}
                    className="p-6 space-y-5 border-border hover:border-brand/50 hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden bg-surface group"
                  >
                    {/* Top Ribbon for Custom/Verified Partner */}
                    {sch.isCustomPosted ? (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-600 text-white text-[10px] font-bold px-3.5 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                        <Star size={11} fill="white" />
                        <span>Mitra Terdaftar</span>
                      </div>
                    ) : (
                      <div className="absolute top-0 right-0 bg-surface2 border-b border-l border-border text-muted text-[10px] font-bold px-3 py-0.5 rounded-bl-xl">
                        {sch.category.toUpperCase()}
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Status & Match Score */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          {sch.status}
                        </span>

                        {sch.aiFitScore && (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-brand/15 text-brand border border-brand/30 flex items-center gap-1">
                            <TrendingUp size={11} />
                            <span>{sch.aiFitScore}% Kecocokan</span>
                          </span>
                        )}
                      </div>

                      {/* Title & Provider */}
                      <div>
                        <h3 className="text-base font-bold font-serif text-text leading-snug group-hover:text-brand transition-colors">
                          {sch.title}
                        </h3>
                        <p className="text-xs text-muted font-medium mt-1.5 flex items-center gap-1.5">
                          <Building2 size={13} className="text-brand shrink-0" />
                          <span className="truncate">{sch.provider}</span>
                        </p>
                      </div>

                      {/* Highlighted Coverage Bento Box */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-surface2 to-surface border border-border space-y-2">
                        <div className="font-bold text-brand text-xs flex items-center gap-1.5">
                          <Award size={15} className="text-brand shrink-0" />
                          <span>{sch.coverageBadge}</span>
                        </div>
                        <div className="text-[11px] text-muted flex items-start gap-1">
                          <span className="font-bold text-text shrink-0">💵 Uang Saku:</span>
                          <span className="text-text/90 font-medium">{sch.allowance}</span>
                        </div>
                      </div>

                      {/* Requirements Checklist */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Persyaratan Utama:</div>
                        <ul className="space-y-1.5">
                          {sch.requirements.slice(0, 3).map((req, rIdx) => (
                            <li key={rIdx} className="text-[11px] text-muted flex items-start gap-2 leading-relaxed">
                              <Check size={13} className="text-brand shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Meta & Action */}
                    <div className="pt-4 border-t border-border space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-brand" />
                          <span className="truncate max-w-[200px]">{sch.deadline}</span>
                        </span>
                      </div>

                      <a
                        href={sch.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block"
                      >
                        <Button variant="primary" className="w-full text-xs font-bold gap-2 py-2.5 rounded-xl shadow-md">
                          <span>Buka Portal Resmi</span>
                          <ExternalLink size={14} />
                        </Button>
                      </a>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Load More Button for Scholarships */}
              {visibleScholarshipsCount < filteredScholarships.length && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setVisibleScholarshipsCount((prev) => prev + 36)}
                    className="text-xs font-bold gap-2 rounded-xl px-5 py-2.5"
                  >
                    <Layers size={15} />
                    <span>Muat 36 Beasiswa Lagi (Tersisa {filteredScholarships.length - visibleScholarshipsCount})</span>
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setVisibleScholarshipsCount(filteredScholarships.length)}
                    className="text-xs font-bold rounded-xl px-5 py-2.5"
                  >
                    Tampilkan Semua ({filteredScholarships.length} Beasiswa)
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CAREER ASSESSMENT & REAL-TIME JOB VACANCIES                        */}
      {/* ========================================================================= */}
      {activeTab === "jobs" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* 1. AI Comprehensive 12-Question Holland RIASEC Assessment Section */}
          <GlowCard className="p-6 sm:p-8 space-y-6 border-border bg-surface">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-wider">
                  <Compass size={17} />
                  <span>AI Career Diagnostic Test (Holland RIASEC 6-Dimensions Model)</span>
                </div>
                <h2 className="text-xl font-bold font-serif text-text mt-1">
                  Tes Diagnostik Minat Bakat &amp; Karir Masa Depan (12 Soal Komprehensif)
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Ukur 6 dimensi kepribadian kerja: <strong>Realistic</strong>, <strong>Investigative</strong>, <strong>Artistic</strong>, <strong>Social</strong>, <strong>Enterprising</strong>, &amp; <strong>Conventional</strong>.
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className="text-xs font-bold text-text flex items-center gap-1.5">
                  <span>Progres Asesmen:</span>
                  <span className="text-brand font-mono">{answeredCount} / 12 Soal ({progressPercent}%)</span>
                </div>
                <div className="w-48 h-2 bg-surface2 rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-brand transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Questions Grid (4 questions per page with smooth transition) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-muted">
                <span>Bagian {currentQuestionPage + 1} dari {totalPages}</span>
                <span>Soal {currentQuestionPage * questionsPerPage + 1} - {Math.min((currentQuestionPage + 1) * questionsPerPage, ASSESSMENT_QUESTIONS.length)}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentQuestions.map((q) => {
                  const currentAnswer = assessmentAnswers[q.id];
                  return (
                    <div key={q.id} className="p-5 rounded-2xl bg-surface2/70 border border-border space-y-3.5 hover:border-brand/30 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-bold text-text flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-xl bg-brand/20 text-brand flex items-center justify-center text-xs font-mono font-bold shrink-0">
                            {q.id}
                          </span>
                          <span className="leading-snug">{q.question}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = currentAnswer?.text === opt.text;
                          return (
                            <button
                              key={oIdx}
                              onClick={() =>
                                setAssessmentAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: { text: opt.text, category: opt.category },
                                }))
                              }
                              className={`w-full text-left p-3 rounded-xl text-xs transition-all border flex items-start gap-3 ${
                                isSelected
                                  ? "bg-brand/15 border-brand text-text font-semibold shadow-sm scale-[1.01]"
                                  : "bg-surface border-border text-muted hover:text-text hover:border-border/80"
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                                  isSelected ? "border-brand bg-brand" : "border-muted/60"
                                }`}
                              >
                                {isSelected && <Check size={10} className="text-bg stroke-[3]" />}
                              </span>
                              <span className="leading-relaxed">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assessment Navigation Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={currentQuestionPage === 0}
                  onClick={() => setCurrentQuestionPage((prev) => Math.max(0, prev - 1))}
                  className="text-xs font-bold gap-1 rounded-xl"
                >
                  <ChevronLeft size={15} />
                  <span>Sebelumnya</span>
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  disabled={currentQuestionPage === totalPages - 1}
                  onClick={() => setCurrentQuestionPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  className="text-xs font-bold gap-1 rounded-xl"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight size={15} />
                </Button>
              </div>

              <Button
                variant="primary"
                onClick={handleRunAssessment}
                disabled={isAssessing || answeredCount < ASSESSMENT_QUESTIONS.length}
                className="text-xs font-bold gap-2 px-6 py-2.5 rounded-xl shadow-md"
              >
                {isAssessing ? (
                  <>
                    <span className="animate-spin">🌀</span>
                    <span>Menganalisis 6 Dimensi RIASEC dengan AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>
                      {answeredCount === ASSESSMENT_QUESTIONS.length
                        ? "Jalankan Analisis AI & Filter Loker Otomatis"
                        : `Jawab Semua Soal (${answeredCount}/12) Untuk Analisis`}
                    </span>
                  </>
                )}
              </Button>
            </div>

            {/* Assessment Result Panel with RIASEC Meter & Career Advice */}
            <AnimatePresence>
              {assessmentResult && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="p-6 rounded-3xl bg-gradient-to-br from-brand/15 via-surface2 to-surface border border-brand/40 space-y-6 shadow-xl"
                >
                  {/* Archetype Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand/20 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-brand uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-brand/20">
                        Hasil Diagnosa AI Karir NALARA
                      </span>
                      <h3 className="text-2xl font-black font-serif text-text mt-1.5">
                        {assessmentResult.archetype}
                      </h3>
                      <p className="text-xs text-muted mt-0.5">
                        Dominasi Holland RIASEC: <strong className="text-text">{assessmentResult.riasecCode}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="accent" className="text-xs px-3 py-1 font-bold">
                        ⚡ Loker Terfilter Sesuai Bakatmu
                      </Badge>
                    </div>
                  </div>

                  {/* RIASEC 6-Dimensions Score Breakdown Meter */}
                  {assessmentResult.riasecBreakdown && (
                    <div className="space-y-3 p-4 rounded-2xl bg-surface/80 border border-border">
                      <div className="text-xs font-bold text-text uppercase flex items-center justify-between">
                        <span>Skor 6 Dimensi Holland RIASEC:</span>
                        <span className="text-muted text-[11px] font-normal">Tingkat Minat Kepribadian Kerja (%)</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {Object.entries(assessmentResult.riasecBreakdown).map(([dim, score]) => (
                          <div key={dim} className="space-y-1.5 text-center p-2.5 rounded-xl bg-surface2 border border-border">
                            <div className="text-[11px] font-bold text-text">{dim}</div>
                            <div className="text-base font-black font-mono text-brand">{score}%</div>
                            <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                              <div className="h-full bg-brand rounded-full" style={{ width: `${score}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-text uppercase">Kekuatan Terbesarmu:</h4>
                      <div className="space-y-2">
                        {assessmentResult.topStrengths.map((str, sIdx) => (
                          <div key={sIdx} className="text-xs text-muted flex items-start gap-2.5 bg-surface2 p-3 rounded-xl border border-border">
                            <CheckCircle2 size={16} className="text-brand shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{str}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Careers */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-text uppercase">Profesi yang Sangat Cocok:</h4>
                      <div className="space-y-2">
                        {assessmentResult.recommendedCareers.map((car, cIdx) => (
                          <div key={cIdx} className="p-3 rounded-xl bg-surface2 border border-border text-xs space-y-1">
                            <div className="font-bold text-brand flex items-center justify-between">
                              <span>{car.title}</span>
                              {car.suitableIndustries && (
                                <span className="text-[10px] text-muted font-normal">{car.suitableIndustries}</span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted leading-relaxed">{car.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Track & Advice */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assessmentResult.recommendedScholarshipTrack && (
                      <div className="p-4 rounded-2xl bg-surface2 border border-border text-xs text-muted space-y-1">
                        <div className="font-bold text-text flex items-center gap-1.5">
                          <GraduationCap size={15} className="text-brand" />
                          <span>Rekomendasi Rumpun Beasiswa Kuliah:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{assessmentResult.recommendedScholarshipTrack}</p>
                      </div>
                    )}

                    <div className="p-4 rounded-2xl bg-surface2 border border-border text-xs text-muted space-y-1">
                      <div className="font-bold text-text flex items-center gap-1.5">
                        <BookmarkCheck size={15} className="text-brand" />
                        <span>Nasihat Pengembangan Karir AI:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{assessmentResult.adviceForStudent}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlowCard>

          {/* 2. Real-Time Live Job Vacancies Bento Grid */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-text flex items-center gap-2">
                  <Briefcase size={18} className="text-brand" />
                  <span>Daftar Lowongan Kerja Real-Time ({jobs.length} Posisi Tersedia)</span>
                </h3>
                <p className="text-xs text-muted">
                  Menarik lowongan kerja aktif secara langsung dari Remotive, ArbeitNow, Jobicy, dan Rekrutmen Mitra Perusahaan.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Cari profesi / perusahaan / lokasi..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="pl-9 pr-3.5 py-2 rounded-xl border border-border bg-surface2 text-xs outline-none focus:border-brand w-full sm:w-64 text-text shadow-sm"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border border-border bg-surface2 overflow-x-auto">
              {JOB_CATEGORIES.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => {
                    setJobCategory(btn.id);
                    setVisibleJobsCount(36);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    jobCategory === btn.id
                      ? "bg-brand text-bg shadow-sm scale-[1.02]"
                      : "text-muted hover:text-text hover:bg-surface"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Jobs Bento Cards Grid */}
            {isLoadingJobs ? (
              <div className="p-16 text-center text-muted text-xs">
                <span className="animate-pulse">Mengambil lowongan pekerjaan real-time dari multi-stream API...</span>
              </div>
            ) : jobs.length === 0 ? (
              <Card className="p-12 text-center text-muted text-xs space-y-3 border-border">
                <p className="text-sm font-semibold">Tidak ditemukan lowongan dengan kata kunci &quot;{jobSearch}&quot;.</p>
                <Button size="sm" variant="secondary" onClick={() => { setJobCategory("all"); setJobSearch(""); }}>
                  Reset Filter
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {jobs.slice(0, visibleJobsCount).map((job) => (
                    <Card
                      key={job.id}
                      className="p-5 space-y-4 border-border hover:border-brand/50 hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden bg-surface group"
                    >
                      {/* Top Ribbon for Custom Mitra */}
                      {job.isCustomPosted ? (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl shadow-sm flex items-center gap-1">
                          <Star size={10} fill="white" />
                          <span>Lowongan Mitra</span>
                        </div>
                      ) : (
                        <div className="absolute top-0 right-0 bg-surface2 border-b border-l border-border text-muted text-[10px] font-bold px-3 py-0.5 rounded-bl-xl font-mono">
                          LIVE API
                        </div>
                      )}

                      <div className="space-y-3.5">
                        {/* Category & Pulse badge */}
                        <div className="flex items-center gap-2 pt-1">
                          <Badge variant="neutral" className="text-[10px] uppercase font-mono truncate max-w-[150px]">
                            {job.category}
                          </Badge>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold shrink-0">
                            <Clock size={10} className="animate-pulse" />
                            Live Real-Time
                          </span>
                        </div>

                        {/* Title & Company */}
                        <div>
                          <h4 className="text-sm font-bold text-text font-serif leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                            {job.title}
                          </h4>
                          <div className="text-xs text-brand font-semibold mt-1.5 flex items-center gap-1.5">
                            <Building2 size={13} />
                            <span className="truncate">{job.companyName}</span>
                          </div>
                        </div>

                        {/* Bento Highlight Box: Location & Salary */}
                        <div className="p-3 rounded-xl bg-gradient-to-br from-surface2 to-surface border border-border text-[11px] space-y-1.5">
                          <div className="text-muted flex items-center gap-1.5">
                            <Globe size={13} className="text-brand shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="text-text font-bold flex items-center gap-1.5">
                            <DollarSign size={13} className="text-emerald-400 shrink-0" />
                            <span className="truncate">{job.salary}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-muted line-clamp-3 leading-relaxed">
                          {job.description}
                        </p>

                        {/* Skill Tags */}
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {job.tags.slice(0, 3).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded-md bg-surface2 border border-border text-[10px] text-muted font-mono truncate max-w-[120px]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Button: Direct 1-Click to Job Application Page */}
                      <div className="pt-3.5 border-t border-border">
                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="w-full block">
                          <Button
                            variant="primary"
                            className="w-full text-xs font-bold gap-2 py-2.5 rounded-xl shadow-sm hover:scale-[1.02] transition-all bg-brand hover:bg-brand/90 text-bg"
                          >
                            <span>Lamar Sekarang (Quick Apply)</span>
                            <ExternalLink size={14} />
                          </Button>
                        </a>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Load More Button for Jobs */}
                {visibleJobsCount < jobs.length && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <Button
                      variant="secondary"
                      onClick={() => setVisibleJobsCount((prev) => prev + 36)}
                      className="text-xs font-bold gap-2 rounded-xl px-5 py-2.5"
                    >
                      <Layers size={15} />
                      <span>Muat 36 Lowongan Lagi (Tersisa {jobs.length - visibleJobsCount})</span>
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setVisibleJobsCount(jobs.length)}
                      className="text-xs font-bold rounded-xl px-5 py-2.5"
                    >
                      Tampilkan Semua ({jobs.length} Lowongan)
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TRACER STUDY & PEMETAAN RENCANA KELULUSAN                          */}
      {/* ========================================================================= */}
      {activeTab === "tracer" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Header Banner */}
          <GlowCard className="p-6 sm:p-8 border-brand/30 bg-surface relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-wider">
                  <Target size={16} />
                  <span>Sistem Penelusuran Karir &amp; Tracer Study NALARA</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-text leading-tight">
                  Formulir Pemetaan Rencana &amp; Realisasi Kelulusan Siswa
                </h2>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Data ini digunakan oleh <strong>Wali Kelas</strong>, <strong>Guru Bimbingan Konseling (BK)</strong>, dan <strong>Admin Sekolah</strong> untuk memantau transisi siswa: mulai dari rencana sebelum lulus hingga ketercapaian pasca-kelulusan (Kuliah, Kedinasan, Bekerja, atau Wirausaha).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface2 border border-border text-xs space-y-1.5 shrink-0">
                <div className="text-muted">Status Akun Siswa:</div>
                <div className="font-bold text-text flex items-center gap-2">
                  {isStudentGraduated ? (
                    <span className="text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                      <span>🎓</span> Alumni / Lulus
                    </span>
                  ) : (
                    <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Aktif Belajar
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted font-mono">{studentEmail}</div>
              </div>
            </div>
          </GlowCard>

          {/* Success Notification */}
          {tracerSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2.5 shadow-lg animate-in fade-in">
              <CheckCircle2 size={18} />
              <span>{tracerSuccessMsg}</span>
            </div>
          )}

          {/* Two Column Bento Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Col 1 & 2: Interactive Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 sm:p-8 space-y-6 border-border bg-surface">
                <div className="border-b border-border pb-4">
                  <h3 className="text-lg font-bold font-serif text-text flex items-center gap-2">
                    <FileCheck size={20} className="text-brand" />
                    <span>Formulir Pengisian &amp; Pemutakhiran Status</span>
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    Isi rencana sebelum lulus dan perbarui status Anda secara berkala jika sudah ada pengumuman seleksi atau pekerjaan.
                  </p>
                </div>

                <form onSubmit={handleSaveTracer} className="space-y-6">
                  {/* Bagian 1: Rencana Sebelum Lulus */}
                  <div className="p-5 rounded-2xl bg-surface2/60 border border-border/80 space-y-4">
                    <div className="flex items-center gap-2 text-brand font-bold text-xs">
                      <span className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center text-xs">1</span>
                      <span>Tahap Pra-Kelulusan: Rencana &amp; Peminatan Masa Depan</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-text mb-1.5">
                          Jalur Rencana Pilihan *
                        </label>
                        <select
                          value={plannedPathway}
                          onChange={(e) => setPlannedPathway(e.target.value as any)}
                          className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs font-medium text-text outline-none focus:border-brand"
                        >
                          <option value="Kuliah">🎓 Kuliah (PTN / PTS)</option>
                          <option value="Kedinasan">🏛️ Sekolah Kedinasan (SEKDIN)</option>
                          <option value="Bekerja">💼 Bekerja (Industri / DUDI)</option>
                          <option value="Wirausaha">🚀 Wirausaha / Bisnis Mandiri</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-text mb-1.5">
                          Target Utama Kampus / Instansi / Bidang *
                        </label>
                        <input
                          type="text"
                          required
                          value={plannedTarget}
                          onChange={(e) => setPlannedTarget(e.target.value)}
                          placeholder="Contoh: UI Teknik Informatika / PKN STAN / Astra"
                          className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs text-text outline-none focus:border-brand"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed">
                      💡 Pilihan ini membantu sekolah memfasilitasi program bimbingan UTBK/SNBT, tryout SKD Kedinasan, atau bursa kerja khusus (BKK).
                    </p>
                  </div>

                  {/* Bagian 2: Realisasi Pasca-Kelulusan (Tracer Study) */}
                  <div className="p-5 rounded-2xl bg-surface2/60 border border-border/80 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">2</span>
                      <span>Tahap Pasca-Kelulusan: Realisasi Status Terkini (Tracer Study)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-text mb-1.5">
                          Status Realisasi Saat Ini *
                        </label>
                        <select
                          value={realizationStatus}
                          onChange={(e) => setRealizationStatus(e.target.value as any)}
                          className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs font-medium text-text outline-none focus:border-brand"
                        >
                          <option value="Kuliah">🎓 Diterima Kuliah (PTN / PTS)</option>
                          <option value="Kedinasan">🏛️ Diterima Sekolah Kedinasan (SEKDIN)</option>
                          <option value="Bekerja">💼 Sudah Bekerja (Karyawan / Kontrak)</option>
                          <option value="Wirausaha">🚀 Wirausaha / Membuka Usaha</option>
                          <option value="Mencari Kerja">⏳ Belum Bekerja / Masih Mencari Loker</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-text mb-1.5">
                          Keterangan / Nama Instansi / Perusahaan *
                        </label>
                        <input
                          type="text"
                          required
                          value={realizationDetail}
                          onChange={(e) => setRealizationDetail(e.target.value)}
                          placeholder="Contoh: Lolos SNBT UI Informatika / Praja IPDN / PT Telkom"
                          className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs text-text outline-none focus:border-brand"
                        />
                      </div>
                    </div>

                    {realizationStatus === "Mencari Kerja" && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                        ℹ️ <strong>Tips NALARA:</strong> Anda dapat mengecek tab <strong>Lowongan Kerja</strong> di atas untuk langsung melamar ke mitra perusahaan terverifikasi.
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={isSavingTracer}
                      className="text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg"
                    >
                      <CheckCircle2 size={16} />
                      <span>Simpan &amp; Perbarui Data Tracer Study</span>
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Col 3: Student Live Overview Card */}
            <div className="space-y-4">
              <Card className="p-6 space-y-4 border-border bg-surface">
                <h4 className="text-sm font-bold font-serif text-text flex items-center gap-2 border-b border-border pb-3">
                  <School size={16} className="text-brand" />
                  <span>Ringkasan Profil Tracer Anda</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-muted">Nama Siswa:</span>
                    <strong className="text-text">{studentName}</strong>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-muted">Rencana Awal:</span>
                    <span className="px-2 py-0.5 rounded-md bg-brand/15 text-brand font-semibold text-[11px]">
                      {plannedPathway}
                    </span>
                  </div>

                  <div className="border-b border-border/60 pb-2 space-y-1">
                    <span className="text-muted text-[11px]">Target Rencana:</span>
                    <div className="font-medium text-text text-[11px] bg-surface2 p-2 rounded-lg">
                      {plannedTarget || "-"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-muted">Realisasi Terkini:</span>
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                      realizationStatus === "Kuliah"
                        ? "bg-blue-500/15 text-blue-400"
                        : realizationStatus === "Kedinasan"
                        ? "bg-purple-500/15 text-purple-400"
                        : realizationStatus === "Bekerja"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : realizationStatus === "Wirausaha"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-red-500/15 text-red-400"
                    }`}>
                      {realizationStatus}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted text-[11px]">Instansi / Keterangan:</span>
                    <div className="font-medium text-text text-[11px] bg-surface2 p-2 rounded-lg">
                      {realizationDetail || "-"}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                    <span className="text-muted">Verifikasi Sekolah:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>Terverifikasi</span>
                    </span>
                  </div>
                </div>
              </Card>

              {/* Informational Guidance Card */}
              <div className="p-4 rounded-2xl bg-brand/10 border border-brand/30 space-y-2 text-xs text-muted">
                <div className="font-bold text-text flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-brand" />
                  <span>Bagaimana Sekolah Memfilter Data?</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Wali Kelas dan Admin memiliki dashboard pemantauan dengan filter khusus untuk mengelompokkan siswa yang <strong>Keterima Kuliah</strong>, <strong>Keterima Kedinasan</strong>, <strong>Bekerja</strong>, atau yang <strong>Belum Bekerja</strong> sehingga sekolah dapat menyalurkan bantuan bimbingan tepat sasaran.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: INPUT LOWONGAN KERJA BARU (MITRA PERUSAHAAN / ADMIN)             */}
      {/* ========================================================================= */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <Briefcase size={22} className="text-emerald-400" />
                <h3 className="text-lg font-bold font-serif text-text">Pasang Lowongan Kerja Baru</h3>
              </div>
              <button onClick={() => setIsJobModalOpen(false)} className="text-muted hover:text-text p-1 rounded-lg hover:bg-surface2">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitJob} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-text">Nama Posisi / Jabatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Junior Web Developer / Admin Gudang"
                  value={newJobForm.title}
                  onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-text">Nama Perusahaan *</label>
                  <input
                    type="text"
                    required
                    placeholder="PT / CV Nama Perusahaan"
                    value={newJobForm.companyName}
                    onChange={(e) => setNewJobForm({ ...newJobForm, companyName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-text">Kategori Bidang</label>
                  <select
                    value={newJobForm.category}
                    onChange={(e) => setNewJobForm({ ...newJobForm, category: e.target.value })}
                    className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                  >
                    <option value="data">Data &amp; Administrasi</option>
                    <option value="customer-support">Customer Support &amp; Ritel</option>
                    <option value="software-dev">Software &amp; IT Tech</option>
                    <option value="marketing">Marketing &amp; Sales</option>
                    <option value="design">Desain &amp; Multimedia</option>
                    <option value="writing">Writing &amp; Content</option>
                    <option value="finance">Finance &amp; Legal</option>
                    <option value="hr">Human Resources (HR)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-text">Lokasi Kerja</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jakarta Selatan / WFH / Surabaya"
                    value={newJobForm.location}
                    onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                    className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-text">Gaji / Tunjangan</label>
                  <input
                    type="text"
                    placeholder="Rp 4.500.000 - Rp 6.000.000 / bln"
                    value={newJobForm.salary}
                    onChange={(e) => setNewJobForm({ ...newJobForm, salary: e.target.value })}
                    className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text">Link Pendaftaran / Lamar Pekerjaan *</label>
                <input
                  type="url"
                  required
                  placeholder="https://perusahaan.com/karir atau link Google Form"
                  value={newJobForm.url}
                  onChange={(e) => setNewJobForm({ ...newJobForm, url: e.target.value })}
                  className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text">Deskripsi Singkat &amp; Tanggung Jawab</label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan gambaran pekerjaan dan kualifikasi yang dicari..."
                  value={newJobForm.description}
                  onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text">Tag Skill / Kualifikasi (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  placeholder="Excel, Fresh Graduate, SMA/SMK, Teliti"
                  value={newJobForm.tags}
                  onChange={(e) => setNewJobForm({ ...newJobForm, tags: e.target.value })}
                  className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
                <Button size="sm" variant="secondary" type="button" onClick={() => setIsJobModalOpen(false)} className="rounded-xl">
                  Batal
                </Button>
                <Button size="sm" variant="primary" type="submit" disabled={isSubmitting} className="gap-1.5 font-bold rounded-xl shadow-md">
                  <Send size={14} />
                  <span>{isSubmitting ? "Menerbitkan..." : "Terbitkan Lowongan Sekarang"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: INPUT BEASISWA BARU (GURU BK / YAYASAN / KAMPUS)                  */}
      {/* ========================================================================= */}
      {isScholarshipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <GraduationCap size={22} className="text-emerald-400" />
                <h3 className="text-lg font-bold font-serif text-text">Input Info Program Beasiswa Baru</h3>
              </div>
              <button onClick={() => setIsScholarshipModalOpen(false)} className="text-muted hover:text-text p-1 rounded-lg hover:bg-surface2">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitScholarship} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-text">Nama Program Beasiswa *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beasiswa Alumni Berprestasi 2026"
                  value={newSchForm.title}
                  onChange={(e) => setNewSchForm({ ...newSchForm, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-text">Lembaga / Penyelenggara *</label>
                  <input
                    type="text"
                    required
                    placeholder="Yayasan / Universitas / Instansi"
                    value={newSchForm.provider}
                    onChange={(e) => setNewSchForm({ ...newSchForm, provider: e.target.value })}
                    className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-text">Kategori Beasiswa</label>
                  <select
                    value={newSchForm.category}
                    onChange={(e) => setNewSchForm({ ...newSchForm, category: e.target.value })}
                    className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                  >
                    <option value="pemerintah">Pemerintah &amp; KIP-K</option>
                    <option value="bumn">BUMN &amp; BI</option>
                    <option value="swasta">Swasta &amp; Yayasan</option>
                    <option value="internasional">Luar Negeri / Internasional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-text">Cakupan Beasiswa</label>
                  <input
                    type="text"
                    placeholder="100% Bebas UKT + Uang Saku"
                    value={newSchForm.coverageBadge}
                    onChange={(e) => setNewSchForm({ ...newSchForm, coverageBadge: e.target.value })}
                    className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-text">Uang Saku / Tunjangan</label>
                  <input
                    type="text"
                    placeholder="Rp 1.000.000 / bln + Laptop"
                    value={newSchForm.allowance}
                    onChange={(e) => setNewSchForm({ ...newSchForm, allowance: e.target.value })}
                    className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-text">Batas Waktu Pendaftaran</label>
                  <input
                    type="text"
                    placeholder="Contoh: 31 Desember 2026"
                    value={newSchForm.deadline}
                    onChange={(e) => setNewSchForm({ ...newSchForm, deadline: e.target.value })}
                    className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-text">Link Pendaftaran Resmi *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://beasiswa.org/daftar"
                    value={newSchForm.applyUrl}
                    onChange={(e) => setNewSchForm({ ...newSchForm, applyUrl: e.target.value })}
                    className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text">Persyaratan Utama (Satu baris per syarat)</label>
                <textarea
                  rows={3}
                  placeholder="Lulusan SMA/SMK sederajat&#10;Nilai rapor rata-rata minimal 75&#10;Melampirkan surat rekomendasi"
                  value={newSchForm.requirements}
                  onChange={(e) => setNewSchForm({ ...newSchForm, requirements: e.target.value })}
                  className="w-full p-3 rounded-xl border border-border bg-surface2 text-text outline-none focus:border-brand"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
                <Button size="sm" variant="secondary" type="button" onClick={() => setIsScholarshipModalOpen(false)} className="rounded-xl">
                  Batal
                </Button>
                <Button size="sm" variant="primary" type="submit" disabled={isSubmitting} className="gap-1.5 font-bold rounded-xl shadow-md">
                  <Send size={14} />
                  <span>{isSubmitting ? "Menerbitkan..." : "Terbitkan Beasiswa Sekarang"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* End of Modals */}
    </div>
  );
}

export default function FuturePathPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 text-muted text-xs">
          Memuat Jalur Masa Depan NALARA...
        </div>
      }
    >
      <FuturePathContent />
    </Suspense>
  );
}
