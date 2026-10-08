"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Send,
  HelpCircle,
  GraduationCap,
  Layers,
  ChevronRight,
  LogOut,
  BrainCircuit,
  Lightbulb,
  Award,
  Check,
  Zap,
  TrendingUp,
  BarChart3,
  RefreshCw,
  X,
  FileQuestion,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, GlowCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { supabase } from "@/lib/supabase";

// 1. Hierarchical Curriculum Definition
interface SubjectOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  conceptCount: number;
}

interface GradeProgram {
  id: string;
  title: string;
  badge: string;
  icon: string;
  description: string;
  subjects: SubjectOption[];
}

const CURRICULUM_PROGRAMS: GradeProgram[] = [
  {
    id: "sma-10",
    title: "SMA Kelas 10 (Fase E)",
    badge: "Kelas 10",
    icon: "🎓",
    description: "Fondasi konsep materi SMA Kurikulum Merdeka",
    subjects: [
      {
        id: "indo-10",
        name: "Bahasa Indonesia",
        icon: "📖",
        description: "Teks Laporan Hasil Observasi (LHO), Anekdot, & Kalimat Definisi",
        conceptCount: 8,
      },
      {
        id: "mat-10",
        name: "Matematika",
        icon: "📐",
        description: "Eksponen, Logaritma, Persamaan & Pertidaksamaan Kuadrat",
        conceptCount: 12,
      },
      {
        id: "ipa-10",
        name: "IPA Terpadu (Fisika / Kimia)",
        icon: "🔬",
        description: "Pengukuran, Vektor, Struktur Atom, & Ikatan Kimia",
        conceptCount: 10,
      },
      {
        id: "ips-10",
        name: "IPS Terpadu (Sosiologi / Ekonomi)",
        icon: "🌍",
        description: "Interaksi Sosial, Kelangkaan Sumber Daya & Pasar",
        conceptCount: 8,
      },
    ],
  },
  {
    id: "sma-11",
    title: "SMA Kelas 11 (Fase F)",
    badge: "Kelas 11",
    icon: "🎓",
    description: "Pendalaman materi lanjutan & kompetensi analisis",
    subjects: [
      {
        id: "indo-11",
        name: "Bahasa Indonesia",
        icon: "📖",
        description: "Teks Eksplanasi, Konjungsi Kausalitas, Proposal & Karya Ilmiah",
        conceptCount: 10,
      },
      {
        id: "mat-11",
        name: "Matematika Peminatan & Wajib",
        icon: "📐",
        description: "Trigonometri, Polinomial, Lingkaran & Matriks",
        conceptCount: 14,
      },
      {
        id: "kimia-11",
        name: "Kimia & Biologi",
        icon: "🧪",
        description: "Termokimia, Laju Reaksi, Sel & Sistem Organ",
        conceptCount: 12,
      },
      {
        id: "ekonomi-11",
        name: "Ekonomi & Akuntansi",
        icon: "📊",
        description: "Pendapatan Nasional, APBN, & Siklus Akuntansi Jasa",
        conceptCount: 9,
      },
    ],
  },
  {
    id: "sma-12",
    title: "SMA Kelas 12 (Fase F Lanjutan)",
    badge: "Kelas 12",
    icon: "🎓",
    description: "Pemantapan Ujian Sekolah & Kesiapan Kelulusan",
    subjects: [
      {
        id: "mat-12",
        name: "Matematika",
        icon: "📐",
        description: "Kalkulus (Turunan & Integral), Dimensi Tiga, Peluang & Statistika",
        conceptCount: 15,
      },
      {
        id: "indo-12",
        name: "Bahasa Indonesia",
        icon: "📖",
        description: "Surat Lamaran Pekerjaan, Artikel Ilmiah, & Kritik Sastra",
        conceptCount: 8,
      },
      {
        id: "fisika-12",
        name: "Fisika Lanjutan",
        icon: "⚡",
        description: "Listrik Dinamis, Medan Magnet, Gelombang Elektromagnetik",
        conceptCount: 11,
      },
    ],
  },
  {
    id: "utbk-snbt",
    title: "Persiapan Masuk PTN (UTBK / SNBT)",
    badge: "UTBK SNBT",
    icon: "🏛️",
    description: "Latihan intensif tes skolastik & literasi berstandar nasional",
    subjects: [
      {
        id: "utbk-pm",
        name: "Penalaran Matematika",
        icon: "📐",
        description: "Aplikasi matematika dalam pemecahan masalah konteks riil",
        conceptCount: 16,
      },
      {
        id: "utbk-pu",
        name: "Kemampuan Penalaran Umum (TPS)",
        icon: "🧠",
        description: "Penalaran Induktif, Deduktif, & Penalaran Kuantitatif",
        conceptCount: 14,
      },
      {
        id: "utbk-pbm",
        name: "Pemahaman Bacaan & Menulis (PBM)",
        icon: "📝",
        description: "Kelogisan kalimat, kepaduan paragraf, & ejaan baku",
        conceptCount: 12,
      },
      {
        id: "utbk-lit",
        name: "Literasi Bahasa Indonesia & Inggris",
        icon: "🌐",
        description: "Analisis teks wacana kritis, inferensi, & kosa kata kontekstual",
        conceptCount: 10,
      },
    ],
  },
  {
    id: "sekdin",
    title: "Sekolah Kedinasan (SEKDIN - STAN / STIS / IPDN)",
    badge: "SEKDIN SKD",
    icon: "🛡️",
    description: "Simulasi Seleksi Kompetensi Dasar (SKD) & Tes Inteligensi Umum",
    subjects: [
      {
        id: "sekdin-deret",
        name: "TIU - Deret Angka & Pola Bilangan",
        icon: "🔢",
        description: "Deret bertingkat, barisan geometri, & pola kombinasi huruf",
        conceptCount: 14,
      },
      {
        id: "sekdin-hitung",
        name: "TIU - Berhitung Cepat & Aljabar",
        icon: "⚡",
        description: "Operasi pecahan, persentase cepat, aljabar linear & perbandingan",
        conceptCount: 16,
      },
      {
        id: "sekdin-silogisme",
        name: "TIU - Silogisme & Logika Analitik",
        icon: "⚖️",
        description: "Penarikan kesimpulan modus ponens/tollens & posisi analitis",
        conceptCount: 12,
      },
      {
        id: "sekdin-figural",
        name: "TIU - Penalaran Spasial Figural",
        icon: "🧩",
        description: "Rotasi pola 3D, analogi gambar, & serialitas visual",
        conceptCount: 10,
      },
      {
        id: "sekdin-twk",
        name: "SKD - Tes Wawasan Kebangsaan (TWK)",
        icon: "🇮🇩",
        description: "Pancasila, UUD 1945, Bhinneka Tunggal Ika, & Bela Negara",
        conceptCount: 15,
      },
    ],
  },
];

// 2. Question Bank mapped by subject ID
interface QuestionOptionDetail {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface Question {
  id: string;
  conceptName: string;
  topic: string;
  questionText: string;
  type: "numeric" | "mcq";
  options?: string[];
  optionDetails?: Record<string, string>; // explanation per option
  correctAnswer: string;
  explanationText?: string;
  knownWrongPatterns: Record<string, { misconceptionCode: string; hint: string }>;
}

const QUESTION_BANK: Record<string, Question[]> = {
  "indo-10": [
    {
      id: "q-ind10-1",
      conceptName: "Kaidah Kebahasaan Teks LHO",
      topic: "Bahasa Indonesia X - Teks Laporan",
      questionText: "Manakah kalimat di bawah ini yang menggunakan 'kalimat definisi' yang tepat?",
      type: "mcq",
      options: [
        "Wayang adalah seni pertunjukan tradisional Indonesia yang ditetapkan sebagai warisan budaya dunia.",
        "Wayang sangat digemari oleh masyarakat di berbagai daerah di Jawa.",
        "Kesenian ini harus selalu kita lestarikan bersama-sama.",
        "Pertunjukan wayang biasanya diadakan semalam suntuk.",
      ],
      optionDetails: {
        "Wayang adalah seni pertunjukan tradisional Indonesia yang ditetapkan sebagai warisan budaya dunia.":
          "✓ BENAR: Memuat kata kopula 'adalah' yang merumuskan batasan pengertian/definisi objek secara formal.",
        "Wayang sangat digemari oleh masyarakat di berbagai daerah di Jawa.":
          "✕ SALAH: Ini adalah kalimat fakta umum/deskripsi kondisi, bukan kalimat definisi.",
        "Kesenian ini harus selalu kita lestarikan bersama-sama.":
          "✕ SALAH: Ini adalah kalimat persuasi/ajakan moral.",
        "Pertunjukan wayang biasanya diadakan semalam suntuk.":
          "✕ SALAH: Ini adalah kalimat deskripsi bagian mengenai waktu pelaksanaan pertunjukan.",
      },
      correctAnswer: "Wayang adalah seni pertunjukan tradisional Indonesia yang ditetapkan sebagai warisan budaya dunia.",
      explanationText:
        "Kalimat definisi adalah kalimat yang memberikan penjelasan umum atau batasan konsep suatu objek, biasanya ditandai oleh kata kopula 'adalah', 'merupakan', atau 'yaitu'.",
      knownWrongPatterns: {
        "Wayang sangat digemari oleh masyarakat di berbagai daerah di Jawa.": {
          misconceptionCode: "FACT_INSTEAD_OF_DEFINITION",
          hint: "Ciri kalimat definisi ditandai oleh kopula seperti 'adalah', 'merupakan', atau 'yaitu' yang menerangkan pengertian objek, bukan pernyataan fakta umum.",
        },
      },
    },
    {
      id: "q-ind10-2",
      conceptName: "Struktur Teks Laporan Hasil Observasi",
      topic: "Bahasa Indonesia X - Teks Laporan",
      questionText: "Bagian yang berisi penjelasan detail mengenai ciri-ciri fisik dan manfaat objek yang diamati disebut...",
      type: "mcq",
      options: [
        "Deskripsi Bagian & Manfaat",
        "Pernyataan Umum (Klasifikasi)",
        "Orientasi Cerita",
        "Reorientasi",
      ],
      optionDetails: {
        "Deskripsi Bagian & Manfaat":
          "✓ BENAR: Bagian ini membedah rincian bagian, ciri fisik, perilaku, serta manfaat spesifik objek observasi.",
        "Pernyataan Umum (Klasifikasi)":
          "✕ SALAH: Pernyataan umum hanya berisi pembuka dan pengelompokan objek di awal teks.",
        "Orientasi Cerita":
          "✕ SALAH: Orientasi adalah struktur teks narasi/cerita fiksi, bukan teks ilmiah laporan observasi.",
        "Reorientasi":
          "✕ SALAH: Reorientasi merupakan penutup opsional pada teks cerita atau recount.",
      },
      correctAnswer: "Deskripsi Bagian & Manfaat",
      explanationText:
        "Struktur utama Teks LHO terdiri atas (1) Pernyataan Umum/Klasifikasi dan (2) Deskripsi Bagian serta Deskripsi Manfaat.",
      knownWrongPatterns: {
        "Orientasi Cerita": {
          misconceptionCode: "NARRATIVE_STRUCTURE_CONFUSION",
          hint: "Ingat bahwa struktur teks laporan observasi terdiri dari Pernyataan Umum dan Deskripsi Bagian/Manfaat, bukan Orientasi seperti pada teks narasi/cerita.",
        },
      },
    },
  ],
  "mat-10": [
    {
      id: "q-mat10-1",
      conceptName: "Eksponen & Perpangkatan",
      topic: "Matematika X - Aljabar & Eksponen",
      questionText: "Hitunglah hasil dari operasi perpangkatan berikut: 3² + 4²",
      type: "numeric",
      correctAnswer: "25",
      explanationText: "3² = 3 × 3 = 9, sedangkan 4² = 4 × 4 = 16. Jumlah keduanya: 9 + 16 = 25.",
      knownWrongPatterns: {
        "7": {
          misconceptionCode: "POWER_AS_ADDITION",
          hint: "Perhatikan basis dan eksponen. Apakah 3² artinya (3 + 2) atau (3 × 3)?",
        },
        "14": {
          misconceptionCode: "POWER_AS_MULTIPLICATION",
          hint: "Ingat kembali definisi aⁿ = a × a × ... (sebanyak n kali). 3² = 3 × 3, bukan 3 × 2.",
        },
      },
    },
    {
      id: "q-mat10-2",
      conceptName: "Teorema Pythagoras",
      topic: "Matematika X - Geometri Segitiga",
      questionText: "Sebuah segitiga siku-siku memiliki panjang sisi tegak 6 cm dan 8 cm. Berapakah panjang sisi miringnya (hipotenusa)?",
      type: "numeric",
      correctAnswer: "10",
      explanationText: "c² = a² + b² = 6² + 8² = 36 + 64 = 100. Panjang sisi miring c = √100 = 10 cm.",
      knownWrongPatterns: {
        "14": {
          misconceptionCode: "SUM_OF_SIDES_DIRECTLY",
          hint: "Apakah sisi miring sama dengan penjumlahan langsung kedua sisi (6 + 8), atau kuadrat sisi miring c² = a² + b²?",
        },
        "100": {
          misconceptionCode: "FORGOT_SQUARE_ROOT",
          hint: "Hasil 100 adalah nilai c². Jangan lupa menarik akar kuadrat (√100) untuk mendapatkan panjang sisi c.",
        },
      },
    },
  ],
  "indo-11": [
    {
      id: "q-ind11-1",
      conceptName: "Kaidah Kebahasaan Teks Eksplanasi",
      topic: "Bahasa Indonesia XI - Teks Eksplanasi",
      questionText: "Pilihlah konjungsi kausalitas yang paling tepat untuk menghubungkan hubungan sebab-akibat pada fenomena alam!",
      type: "mcq",
      options: [
        "Oleh karena itu",
        "Setelah itu",
        "Kemudian",
        "Bahkan",
      ],
      optionDetails: {
        "Oleh karena itu": "✓ BENAR: Merupakan konjungsi antarkalimat yang menyatakan hubungan sebab-akibat (kausalitas).",
        "Setelah itu": "✕ SALAH: Merupakan konjungsi kronologis (urutan waktu).",
        "Kemudian": "✕ SALAH: Merupakan konjungsi urutan waktu.",
        "Bahkan": "✕ SALAH: Merupakan konjungsi penegas/penambahan.",
      },
      correctAnswer: "Oleh karena itu",
      explanationText:
        "Konjungsi kausalitas adalah kata hubung yang menghubungkan sebab dan akibat, seperti 'sebab', 'karena', 'oleh karena itu', 'sehingga'.",
      knownWrongPatterns: {
        "Setelah itu": {
          misconceptionCode: "CHRONOLOGICAL_CONFUSION",
          hint: "Kata 'setelah itu' adalah konjungsi kronologis (urutan waktu). Pilihlah konjungsi yang menyatakan sebab-akibat.",
        },
      },
    },
  ],
  "mat-11": [
    {
      id: "q-mat11-1",
      conceptName: "Trigonometri Sudut Istimewa",
      topic: "Matematika XI - Trigonometri",
      questionText: "Berapakah nilai dari sin(30°) + cos(60°)?",
      type: "numeric",
      correctAnswer: "1",
      explanationText: "sin(30°) = 1/2 dan cos(60°) = 1/2. Jumlah: 1/2 + 1/2 = 1.",
      knownWrongPatterns: {
        "0.5": {
          misconceptionCode: "ONLY_CALCULATED_ONE_TERM",
          hint: "Ingat bahwa sin(30°) = 1/2 dan cos(60°) = 1/2. Jumlahkan kedua nilai tersebut: (1/2 + 1/2).",
        },
      },
    },
  ],
  "mat-12": [
    {
      id: "q-mat12-1",
      conceptName: "Turunan Fungsi Aljabar",
      topic: "Matematika XII - Kalkulus",
      questionText: "Jika f(x) = 3x² + 5x, berapakah nilai turunan pertama f'(2)?",
      type: "numeric",
      correctAnswer: "17",
      explanationText: "f'(x) = 6x + 5. Maka f'(2) = 6(2) + 5 = 12 + 5 = 17.",
      knownWrongPatterns: {
        "11": {
          misconceptionCode: "FORGOT_POWER_RULE",
          hint: "Rumus turunan axⁿ adalah n · axⁿ⁻¹. Turunan 3x² adalah 6x, sehingga f'(x) = 6x + 5.",
        },
      },
    },
  ],
  "utbk-pm": [
    {
      id: "q-utbk-1",
      conceptName: "Penalaran Kuantitatif & Perbandingan",
      topic: "UTBK SNBT - Penalaran Matematika",
      questionText: "Suatu pekerjaan dapat diselesaikan oleh 6 orang dalam waktu 12 hari. Berapa hari yang dibutuhkan jika pekerjaan dikerjakan oleh 9 orang?",
      type: "numeric",
      correctAnswer: "8",
      explanationText: "Perbandingan berbalik nilai: (6 × 12) = 9 × Hari. Hari = 72 / 9 = 8 hari.",
      knownWrongPatterns: {
        "18": {
          misconceptionCode: "DIRECT_PROPORTION_INSTEAD_OF_INVERSE",
          hint: "Ini adalah perbandingan berbalik nilai. Semakin banyak pekerja, semakin sedikit hari yang dibutuhkan: (6 × 12) / 9.",
        },
      },
    },
  ],
  "sekdin-deret": [
    {
      id: "q-sekdin-1",
      conceptName: "TIU - Deret Geometri",
      topic: "Sekolah Kedinasan (SEKDIN) - SKD TIU",
      questionText: "Tentukan angka berikutnya dari pola deret: 3, 6, 12, 24, 48, ...",
      type: "numeric",
      correctAnswer: "96",
      explanationText: "Setiap suku dikalikan 2: 3 (×2) = 6 (×2) = 12 (×2) = 24 (×2) = 48 (×2) = 96.",
      knownWrongPatterns: {
        "72": {
          misconceptionCode: "ARITHMETIC_ADDITION_SLIP",
          hint: "Perhatikan rasio antar angka. Pola deret ini dikalikan 2 pada setiap langkahnya (3×2=6, 6×2=12, 48×2=?).",
        },
      },
    },
  ],
  "sekdin-hitung": [
    {
      id: "q-sekdin-h1",
      conceptName: "TIU - Operasi Hitung Cepat",
      topic: "Sekolah Kedinasan (SEKDIN) - SKD TIU",
      questionText: "Hitunglah hasil dari operasi: (15 × 12) ÷ 6 + 18",
      type: "numeric",
      correctAnswer: "48",
      explanationText: "(15 × 12 = 180) ÷ 6 = 30 + 18 = 48.",
      knownWrongPatterns: {
        "30": {
          misconceptionCode: "FORGOT_ORDER_OF_OPERATIONS",
          hint: "Kerjakan perkalian dan pembagian terlebih dahulu: (15 × 12 = 180) ÷ 6 = 30, lalu tambahkan 18.",
        },
      },
    },
  ],
};

const DEFAULT_FALLBACK_QUESTIONS: Question[] = [
  {
    id: "q-fallback-1",
    conceptName: "Konsep Dasar & Logika",
    topic: "Latihan Konseptual Adaptif",
    questionText: "Hitunglah hasil dari operasi: 2³ + 5²",
    type: "numeric",
    correctAnswer: "33",
    knownWrongPatterns: {
      "16": {
        misconceptionCode: "POWER_AS_ADDITION",
        hint: "Ingat bahwa 2³ = 8 dan 5² = 25. Jumlahkan 8 + 25.",
      },
    },
  },
];

interface QuestionAttemptRecord {
  questionId: string;
  conceptName: string;
  questionText: string;
  userAnswer: string;
  isCorrect: boolean;
  misconceptionCode?: string;
  hintGiven?: string;
}

function StudentPortalContent() {
  const searchParams = useSearchParams();

  // Student Session & Metadata State
  const [studentEmail, setStudentEmail] = useState<string>("andi@sekolah.sch.id");
  const [studentName, setStudentName] = useState<string>("Andi Pratama");
  const [studentClassGroup, setStudentClassGroup] = useState<string>("Kelas XI-A");
  const [studentGradeTitle, setStudentGradeTitle] = useState<string>("SMA Kelas 11 (Fase F)");

  // Navigation / Selection State
  const [selectedGrade, setSelectedGrade] = useState<GradeProgram | null>(CURRICULUM_PROGRAMS[0]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectOption | null>(CURRICULUM_PROGRAMS[0].subjects[0]);
  const [activeStep, setActiveStep] = useState<"choose_grade" | "choose_subject" | "confirm_start" | "quiz" | "completed">("choose_subject");

  // Load Authentic Supabase Session & Profile Meta
  React.useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const u = data.session.user;
        const meta = u.user_metadata || {};
        const email = u.email || "andi@sekolah.sch.id";
        setStudentEmail(email);

        const fullName = meta.full_name || (email.includes("andi") ? "Andi Pratama" : email.split("@")[0]);
        const classGroup = meta.class_group || "Kelas XI-A";
        const gradeTitle = meta.grade_title || "SMA Kelas 11 (Fase F)";

        setStudentName(fullName);
        setStudentClassGroup(classGroup);
        setStudentGradeTitle(gradeTitle);

        // Auto-match Grade Program based on student metadata
        const matched = CURRICULUM_PROGRAMS.find((p) =>
          p.id.includes("11") || p.title.toLowerCase().includes("11") || p.id === meta.grade_level
        ) || CURRICULUM_PROGRAMS[0];

        setSelectedGrade(matched);
        setSelectedSubject(matched.subjects[0]);
        setActiveStep("choose_subject"); // Direct landing on subject hub!
      }
    }
    loadSession();
  }, []);

  // Confirmation Modal State
  const [pendingSubject, setPendingSubject] = useState<SubjectOption | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, boolean>>({});
  const [remedialPermissions, setRemedialPermissions] = useState<Record<string, boolean>>({});
  const [customQuestions, setCustomQuestions] = useState<any[]>([]);

  // Real-Time Live Sync: Completed Quizzes and Remedial Permissions
  React.useEffect(() => {
    const syncQuizState = () => {
      if (typeof window === "undefined") return;
      try {
        const completedRaw = localStorage.getItem("nalara_completed_quizzes");
        if (completedRaw) {
          setCompletedQuizzes(JSON.parse(completedRaw));
        }

        const remedialRaw = localStorage.getItem("nalara_remedial_permissions");
        if (remedialRaw) {
          setRemedialPermissions(JSON.parse(remedialRaw));
        }

        const customRaw = localStorage.getItem("nalara_custom_questions");
        if (customRaw) {
          const parsed = JSON.parse(customRaw);
          if (Array.isArray(parsed)) {
            setCustomQuestions(parsed);
          }
        }
      } catch (err) {
        console.error("Error syncing quiz status:", err);
      }
    };

    // 1. Initial Load
    syncQuizState();

    // 2. Cross-tab Storage Event Listener
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "nalara_completed_quizzes" ||
        e.key === "nalara_remedial_permissions" ||
        e.key === "nalara_custom_questions"
      ) {
        syncQuizState();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // 3. Periodic Pulse Polling (every 1.5 seconds)
    const interval = setInterval(syncQuizState, 1500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Quiz State
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAiHint, setShowAiHint] = useState(false);
  const [selectedOptionForExplanation, setSelectedOptionForExplanation] = useState<string | null>(null);
  const [sessionAttempts, setSessionAttempts] = useState<QuestionAttemptRecord[]>([]);

  const [result, setResult] = useState<{
    status: "correct" | "incorrect" | "think_first";
    feedback: string;
    hintLevel1?: string;
    misconceptionCode?: string;
    newMastery?: number;
  } | null>(null);

  const [masteryScore, setMasteryScore] = useState(68);
  const [streak, setStreak] = useState(0);

  // Active Questions for current subject (merging default + teacher custom questions for this grade & subject)
  const currentSubjectQuestions = React.useMemo(() => {
    if (!selectedSubject) return DEFAULT_FALLBACK_QUESTIONS;
    const base = QUESTION_BANK[selectedSubject.id] || DEFAULT_FALLBACK_QUESTIONS;

    if (!customQuestions || customQuestions.length === 0) return base;

    // Filter matching custom questions added by teacher for this grade & subject
    const matchedCustom: Question[] = customQuestions
      .filter((cq) => {
        const subjectMatch =
          (cq.subject?.toLowerCase().includes("indonesia") && selectedSubject.id.includes("indo")) ||
          (cq.subject?.toLowerCase().includes("matematika") && (selectedSubject.id.includes("mat") || selectedSubject.id.includes("pm"))) ||
          (cq.subject?.toLowerCase().includes("fisika") && selectedSubject.id.includes("fisika")) ||
          (cq.subject?.toLowerCase().includes("kimia") && selectedSubject.id.includes("kimia")) ||
          (cq.subject?.toLowerCase().includes("ekonomi") && selectedSubject.id.includes("ekonomi")) ||
          (cq.subject?.toLowerCase().includes("kedinasan") && selectedSubject.id.includes("sekdin"));

        const gradeMatch =
          ((cq.gradeLevel?.includes("XI") || cq.gradeLevel?.includes("11")) && (selectedGrade?.id.includes("11") || false)) ||
          ((cq.gradeLevel?.includes("X (") || cq.gradeLevel?.includes("10")) && (selectedGrade?.id.includes("10") || false)) ||
          ((cq.gradeLevel?.includes("XII") || cq.gradeLevel?.includes("12")) && (selectedGrade?.id.includes("12") || false)) ||
          ((cq.gradeLevel?.includes("Kedinasan") || false) && (selectedGrade?.id.includes("sekdin") || false)) ||
          ((cq.gradeLevel?.includes("UTBK") || false) && (selectedGrade?.id.includes("utbk") || false));

        return Boolean(subjectMatch && gradeMatch);
      })
      .map((cq) => {
        const defaultWrongOptions = [
          "Kurang tepat sesuai kaidah konsep",
          "Kekeliruan analisis premis",
          "Penarikan kesimpulan yang tidak valid",
        ];
        const allOptions = cq.type === "mcq" && cq.options ? cq.options : [
          cq.correctAnswer,
          ...defaultWrongOptions,
        ];

        return {
          id: cq.id,
          conceptName: cq.conceptName || "Konsep Pembelajaran",
          topic: cq.conceptName || "Materi Uji",
          questionText: cq.questionText,
          type: (cq.type === "numeric" ? "numeric" : "mcq") as "numeric" | "mcq",
          options: allOptions,
          optionDetails: {
            [cq.correctAnswer]: "✓ Jawaban benar dan sesuai dengan kaidah konsep materi ini.",
            [defaultWrongOptions[0]]: "✕ Pilihan ini belum tepat sesuai aturan logika.",
            [defaultWrongOptions[1]]: "✕ Pilihan ini mengalami kekeliruan analisis dasar.",
            [defaultWrongOptions[2]]: "✕ Kesimpulan ini tidak valid berdasarkan konteks soal.",
          },
          correctAnswer: cq.correctAnswer,
          difficulty: cq.difficulty || "medium",
          knownWrongPatterns: {
            [cq.misconceptionPattern || "MISCONCEPTION_DEFAULT"]: {
              misconceptionCode: cq.misconceptionPattern || "MISCONCEPTION_DEFAULT",
              hint: cq.hintLevel1 || "Perhatikan kembali kaidah materi yang telah diajarkan guru di kelas.",
            },
          },
        };
      });

    return matchedCustom.length > 0 ? [...matchedCustom, ...base] : base;
  }, [selectedSubject, selectedGrade, customQuestions]);

  const currentQ = currentSubjectQuestions[currentIdx % currentSubjectQuestions.length];
  const isLastQuestion = currentIdx >= currentSubjectQuestions.length - 1;

  const handleSelectGrade = (grade: GradeProgram) => {
    setSelectedGrade(grade);
    setSelectedSubject(grade.subjects[0]);
    setActiveStep("choose_subject");
  };

  // Step 2 -> Ask Confirmation before starting quiz
  const handleRequestSubject = (subject: SubjectOption) => {
    setPendingSubject(subject);
    setActiveStep("confirm_start");
  };

  // Confirm and start quiz
  const handleConfirmStart = () => {
    if (!pendingSubject) return;
    setSelectedSubject(pendingSubject);
    setCurrentIdx(0);
    setUserAnswer("");
    setResult(null);
    setShowAiHint(false);
    setSelectedOptionForExplanation(null);
    setSessionAttempts([]);
    setActiveStep("quiz");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setIsSubmitting(true);
    setResult(null);

    const cleanAns = userAnswer.trim();
    const isCorrect = cleanAns.toLowerCase() === currentQ.correctAnswer.toLowerCase();

    if (isCorrect) {
      const updatedMastery = Math.min(100, masteryScore + 12);
      setMasteryScore(updatedMastery);
      setStreak((prev) => prev + 1);

      // Record successful attempt
      setSessionAttempts((prev) => [
        ...prev,
        {
          questionId: currentQ.id,
          conceptName: currentQ.conceptName,
          questionText: currentQ.questionText,
          userAnswer: cleanAns,
          isCorrect: true,
        },
      ]);

      setResult({
        status: "correct",
        feedback: "Luar biasa! Pilihan jawaban Anda tepat dan konsep telah dikuasai.",
        newMastery: updatedMastery,
      });
      setIsSubmitting(false);
    } else {
      // Wrong Answer -> Trigger Think First Mode & Misconception Analysis
      try {
        const res = await fetch("/api/diagnostic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionText: currentQ.questionText,
            correctAnswer: currentQ.correctAnswer,
            studentAnswer: cleanAns,
            conceptName: currentQ.conceptName,
            currentMastery: masteryScore,
          }),
        });

        const data = await res.json();
        const analysis = data?.analysis?.output;

        const knownPattern = currentQ.knownWrongPatterns[cleanAns];
        const misconceptionCode = knownPattern?.misconceptionCode || analysis?.misconception_code || "CONCEPTUAL_MISMATCH";
        const hint = knownPattern?.hint || analysis?.hint_level_1 || "Coba periksa kembali langkah logika pengerjaan Anda.";

        // Record attempt with misconception
        setSessionAttempts((prev) => [
          ...prev,
          {
            questionId: currentQ.id,
            conceptName: currentQ.conceptName,
            questionText: currentQ.questionText,
            userAnswer: cleanAns,
            isCorrect: false,
            misconceptionCode,
            hintGiven: hint,
          },
        ]);

        setResult({
          status: "think_first",
          feedback: "Jawaban belum tepat. AI Think First Mode diaktifkan untuk membimbing nalar Anda.",
          hintLevel1: hint,
          misconceptionCode: misconceptionCode,
        });
      } catch {
        const fallbackHint = currentQ.knownWrongPatterns[cleanAns]?.hint || "Periksa kembali aturan dasar materi ini sebelum menarik kesimpulan.";
        setSessionAttempts((prev) => [
          ...prev,
          {
            questionId: currentQ.id,
            conceptName: currentQ.conceptName,
            questionText: currentQ.questionText,
            userAnswer: cleanAns,
            isCorrect: false,
            misconceptionCode: "GENERAL_RETRY",
            hintGiven: fallbackHint,
          },
        ]);

        setResult({
          status: "think_first",
          feedback: "Jawaban belum tepat.",
          hintLevel1: fallbackHint,
          misconceptionCode: "GENERAL_RETRY",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Save real submission record for teacher analytics
      if (selectedGrade && selectedSubject) {
        const correctAttempts = sessionAttempts.filter((a) => a.isCorrect);
        const wrongAttemptsList = sessionAttempts.filter((a) => !a.isCorrect);
        const total = Math.max(sessionAttempts.length, currentSubjectQuestions.length);
        const accuracy = Math.round((correctAttempts.length / total) * 100);
        const status = masteryScore >= 85 ? "mastered" : masteryScore >= 60 ? "practicing" : "needs_attention";
        
        const studentName = studentEmail.toLowerCase().includes("andi")
          ? "Andi Pratama"
          : studentEmail.split("@")[0].replace(".", " ");

        const newSubmission = {
          id: `sub-${studentEmail}-${selectedSubject.id}`,
          studentId: `std-${studentEmail}`,
          name: studentName.charAt(0).toUpperCase() + studentName.slice(1),
          email: studentEmail,
          classGroup: selectedGrade.title.includes("10") ? "Kelas X-A" : selectedGrade.title.includes("11") ? "Kelas XI-A" : "Kelas XII-A",
          gradeLevel: selectedGrade.title,
          subjectId: selectedSubject.id,
          subjectName: selectedSubject.name,
          totalAnswered: sessionAttempts.length,
          correctCount: correctAttempts.length,
          accuracyRate: accuracy,
          masteryScore: masteryScore,
          status,
          frequentMisconceptions: wrongAttemptsList.map((w) => w.misconceptionCode || "Kekeliruan nalar konsep"),
          lastActive: "Baru saja",
          timestamp: Date.now(),
        };

        try {
          const existingRaw = localStorage.getItem("nalara_student_submissions");
          const existing: any[] = existingRaw ? JSON.parse(existingRaw) : [];
          const filtered = existing.filter((e) => !(e.email === studentEmail && e.subjectId === selectedSubject.id));
          filtered.unshift(newSubmission);
          localStorage.setItem("nalara_student_submissions", JSON.stringify(filtered));
        } catch (err) {
          console.error("Failed to save student submission:", err);
        }
      }

      // Complete the session and show the result report!
      setActiveStep("completed");
      return;
    }

    setResult(null);
    setUserAnswer("");
    setShowAiHint(false);
    setSelectedOptionForExplanation(null);
    setCurrentIdx((prev) => prev + 1);
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setUserAnswer("");
    setResult(null);
    setShowAiHint(false);
    setSelectedOptionForExplanation(null);
    setSessionAttempts([]);
    setActiveStep("quiz");
  };

  // Summary calculations for completed screen
  const totalSessionQuestions = currentSubjectQuestions.length;
  const correctCount = sessionAttempts.filter((a) => a.isCorrect).length;
  const wrongAttempts = sessionAttempts.filter((a) => !a.isCorrect);
  const accuracyPercentage = totalSessionQuestions > 0 ? Math.round((correctCount / totalSessionQuestions) * 100) : 100;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* 1. Header Bar with Student Profile & Logout */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border shadow-md" style={{ background: "var(--surface)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--brand), var(--brand-light))",
            }}
          >
            <Sparkles className="w-5 h-5 text-bg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-text">{studentName}</h1>
              <Badge variant="brand" className="text-[10px]">{studentClassGroup}</Badge>
            </div>
            <p className="text-xs text-muted flex items-center gap-2">
              <span>{studentGradeTitle}</span>
              <span>•</span>
              <span className="text-text">{studentEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface2 text-xs">
            <Award size={16} className="text-brand" />
            <span>Mastery Score: <strong className="text-brand">{masteryScore}%</strong></span>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => (window.location.href = `/future-path?tab=scholarships`)}
            className="text-xs border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-bold hover:bg-emerald-500/20 shadow-sm"
          >
            <GraduationCap size={15} />
            <span>🎓 Beasiswa</span>
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => (window.location.href = `/future-path?tab=jobs`)}
            className="text-xs border-brand/40 bg-brand/10 text-brand font-bold hover:bg-brand/20 shadow-sm"
          >
            <Sparkles size={14} />
            <span>💼 Karir</span>
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setActiveStep("completed")}
            className="text-xs border-brand/30 text-brand"
          >
            <BarChart3 size={14} />
            <span>Rapor</span>
          </Button>

          <Button size="sm" variant="secondary" onClick={handleLogout} className="text-error border-error/30 hover:bg-error/10">
            <LogOut size={14} />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </header>

      {/* 2. Breadcrumb Navigation Bar */}
      <div className="flex items-center gap-2 text-xs font-semibold text-muted bg-surface2 p-3 rounded-xl border border-border overflow-x-auto">
        <button
          onClick={() => setActiveStep("choose_grade")}
          className={`flex items-center gap-1.5 hover:text-text transition-colors ${
            activeStep === "choose_grade" ? "text-brand font-bold" : ""
          }`}
        >
          <GraduationCap size={15} />
          <span>1. Jenjang ({selectedGrade ? selectedGrade.badge : "Pilih"})</span>
        </button>

        <ChevronRight size={14} className="text-muted/60" />

        <button
          onClick={() => selectedGrade && setActiveStep("choose_subject")}
          disabled={!selectedGrade}
          className={`flex items-center gap-1.5 hover:text-text transition-colors ${
            activeStep === "choose_subject" || activeStep === "confirm_start" ? "text-brand font-bold" : ""
          } ${!selectedGrade ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <BookOpen size={15} />
          <span>2. Mata Pelajaran ({selectedSubject ? selectedSubject.name : "Pilih"})</span>
        </button>

        <ChevronRight size={14} className="text-muted/60" />

        <button
          onClick={() => selectedSubject && setActiveStep("quiz")}
          className={`flex items-center gap-1.5 hover:text-text transition-colors ${
            activeStep === "quiz" ? "text-brand font-bold" : ""
          }`}
        >
          <BrainCircuit size={15} />
          <span>3. Ruang Latihan</span>
        </button>

        <ChevronRight size={14} className="text-muted/60" />

        <button
          onClick={() => setActiveStep("completed")}
          className={`flex items-center gap-1.5 hover:text-text transition-colors ${
            activeStep === "completed" ? "text-emerald-400 font-bold" : "text-muted"
          }`}
        >
          <Award size={15} />
          <span>4. Hasil Evaluasi &amp; Rekap</span>
        </button>
      </div>

      {/* 3. STEP 1: CHOOSE GRADE / PROGRAM */}
      {activeStep === "choose_grade" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <Badge variant="brand">Langkah 1</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-text">
              Pilih Jenjang / Target Pembelajaran
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Pilih tingkat kelas sekolah atau target persiapan ujian kedinasan/PTN yang ingin kamu pelajari hari ini.
            </p>
          </div>

          {/* Cards Jenjang */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CURRICULUM_PROGRAMS.map((prog) => (
              <Card
                key={prog.id}
                onClick={() => handleSelectGrade(prog)}
                className={`p-6 space-y-4 border transition-all cursor-pointer hover:border-brand hover:scale-[1.01] ${
                  selectedGrade?.id === prog.id ? "border-brand ring-1 ring-brand bg-brand/5" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{prog.icon}</span>
                  <Badge variant={selectedGrade?.id === prog.id ? "brand" : "neutral"} className="text-[10px]">
                    {prog.subjects.length} Mata Pelajaran
                  </Badge>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-serif text-text">{prog.title}</h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{prog.description}</p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-brand">
                  <span>Pilih Jenjang Ini</span>
                  <ArrowRight size={15} />
                </div>
              </Card>
            ))}
          </div>

          {/* Prominent Dual Banner: Beasiswa Kuliah S1 & Rekomendasi Karir */}
          <div className="pt-6 border-t border-border/80 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-brand" />
              <h3 className="text-lg font-bold font-serif text-text">
                Pusat Beasiswa Kuliah &amp; Peluang Karir Siswa
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Beasiswa Kuliah S1 */}
              <Card
                onClick={() => (window.location.href = `/future-path?user=${encodeURIComponent(studentEmail)}&tab=scholarships`)}
                className="p-6 space-y-3 border-emerald-500/40 bg-emerald-950/15 hover:border-emerald-400 hover:bg-emerald-950/25 cursor-pointer transition-all group shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🎓</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> Bebas Biaya Kuliah 100%
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold font-serif text-emerald-300 group-hover:text-emerald-200">
                    Ingin Cari Beasiswa Kuliah S1?
                  </h4>
                  <p className="text-xs text-muted mt-1.5 leading-relaxed">
                    Temukan beasiswa KIP Kuliah Merdeka, BCA, Djarum, &amp; Beasiswa Unggulan dengan pembebasan biaya kuliah 100% + tunjangan uang saku bulanan.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>Lihat Daftar Beasiswa Aktif Real-Time</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>

              {/* Card 2: Loker & Minat Karir */}
              <Card
                onClick={() => (window.location.href = `/future-path?user=${encodeURIComponent(studentEmail)}&tab=jobs`)}
                className="p-6 space-y-3 border-brand/40 bg-brand/10 hover:border-brand hover:bg-brand/15 cursor-pointer transition-all group shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">💼</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand/20 text-brand border border-brand/40 flex items-center gap-1.5">
                    <Sparkles size={13} /> AI Career Diagnostic
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold font-serif text-text group-hover:text-brand">
                    Ingin Bekerja tapi Bingung Mau Kerja Apa?
                  </h4>
                  <p className="text-xs text-muted mt-1.5 leading-relaxed">
                    Ikuti tes minat bakat AI (4 soal cepat) untuk mendeteksi keahlianmu, lalu temukan lowongan kerja real-time yang cocok untuk lulusan SMA/SMK.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-brand">
                  <span>Tes Minat &amp; Cari Lowongan Kerja</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. STEP 2: CHOOSE SUBJECT */}
      {activeStep === "choose_subject" && selectedGrade && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="accent">Langkah 2</Badge>
                <span className="text-xs text-muted">Jenjang: <strong className="text-text">{selectedGrade.title}</strong></span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-text">
                Pilih Mata Pelajaran / Subjek Materi
              </h2>
              <p className="text-xs sm:text-sm text-muted">
                Pilih mata pelajaran yang ingin kamu perdalam pemahaman konsep dan latihannya.
              </p>
            </div>

            <Button size="sm" variant="secondary" onClick={() => setActiveStep("choose_grade")}>
              ← Ganti Jenjang
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedGrade.subjects.map((subj) => (
              <GlowCard
                key={subj.id}
                onClick={() => handleRequestSubject(subj)}
                className="p-6 space-y-3 cursor-pointer transition-all hover:border-brand hover:scale-[1.01] border-border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-surface2 border border-border">{subj.icon}</span>
                    <div>
                      <h3 className="text-base font-bold font-serif text-text">{subj.name}</h3>
                      <span className="text-[11px] text-brand font-medium">{subj.conceptCount} Konsep Materi</span>
                    </div>
                  </div>
                  <Badge variant="brand" className="text-[10px]">Pilih</Badge>
                </div>

                <p className="text-xs text-muted leading-relaxed pt-1">
                  {subj.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-brand border-t border-border/50">
                  <span>Mulai Latihan Soal</span>
                  <ArrowRight size={14} />
                </div>
              </GlowCard>
            ))}
          </div>
        </motion.div>
      )}

      {/* 4.5. STEP 2.5: PRE-QUIZ CONFIRMATION & REMEDIAL LOCK MODAL */}
      {activeStep === "confirm_start" && pendingSubject && selectedGrade && (() => {
        const isSubjectCompleted = !!completedQuizzes[`${studentEmail}_${pendingSubject.id}`];
        const hasTeacherRemedialPermission = !!remedialPermissions[studentEmail] || !!remedialPermissions[`${studentEmail}_${pendingSubject.id}`];

        // Case 1: Already completed and locked (No remedial permission yet)
        if (isSubjectCompleted && !hasTeacherRemedialPermission) {
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto space-y-6"
            >
              <GlowCard className="p-6 sm:p-8 space-y-6 border-amber-500/40 bg-surface text-center shadow-2xl">
                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl bg-amber-500/20 text-amber-300">
                  🔒
                </div>

                <div className="space-y-2">
                  <Badge variant="accent" className="text-xs">
                    Sesi Terkunci • 1x Kesempatan
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-text">
                    Sesi Latihan Sudah Selesai Dikerjakan
                  </h2>
                  <p className="text-xs text-muted leading-relaxed max-w-md mx-auto">
                    Kamu telah menyelesaikan seluruh soal pada mata pelajaran <strong className="text-brand">{pendingSubject.name}</strong>. Nilai dan rekap pembahasan telah tersimpan secara resmi.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/15 text-left space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <ShieldCheck size={16} />
                    <span>Integritas Asesmen Pilot Sekolah:</span>
                  </div>
                  <p className="text-text leading-relaxed">
                    Siswa hanya dapat mengulang latihan pada modul ini jika <strong>Guru Mata Pelajaran</strong> memberikan izin <em>Remedial</em> melalui Portal Guru.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={() => setActiveStep("choose_subject")}
                    variant="secondary"
                    className="w-full sm:w-1/2 text-xs"
                  >
                    ← Pilih Mapel Lain
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedSubject(pendingSubject);
                      setActiveStep("completed");
                    }}
                    variant="primary"
                    className="w-full sm:w-1/2 font-bold shadow-lg text-xs"
                  >
                    <BookOpen size={15} />
                    <span>Buka Rapor Rekap &amp; Pembahasan</span>
                  </Button>
                </div>
              </GlowCard>
            </motion.div>
          );
        }

        // Case 2: Remedial Permission Granted by Teacher!
        if (isSubjectCompleted && hasTeacherRemedialPermission) {
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto space-y-6"
            >
              <GlowCard className="p-6 sm:p-8 space-y-6 border-emerald-500/50 bg-surface text-center shadow-2xl">
                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl bg-emerald-500/20 text-emerald-400">
                  ✨
                </div>

                <div className="space-y-2">
                  <Badge variant="brand" className="text-xs bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                    Izin Remedial Diberikan Guru
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-text">
                    Kesempatan Remedial Telah Aktif!
                  </h2>
                  <p className="text-xs text-muted leading-relaxed max-w-md mx-auto">
                    Guru kamu telah mengaktifkan kesempatan remedial untuk <strong className="text-brand">{pendingSubject.name}</strong>. Kamu dapat mengerjakan kembali seluruh soal untuk memperbaiki nilai dan pemahaman konsep.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/15 text-left space-y-1 text-xs text-emerald-300">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={15} />
                    <span>Akses Remedial Dibuka:</span>
                  </div>
                  <p className="text-text">
                    Skor baru kamu akan otomatis memperbarui grafik penguasaan materi di dashboard guru.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={() => setActiveStep("choose_subject")}
                    variant="secondary"
                    className="w-full sm:w-1/2 text-xs"
                  >
                    ← Batal
                  </Button>
                  <Button
                    onClick={handleConfirmStart}
                    variant="primary"
                    className="w-full sm:w-1/2 font-bold shadow-lg text-xs"
                  >
                    <span>🚀 Mulai Latihan Remedial</span>
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </GlowCard>
            </motion.div>
          );
        }

        // Case 3: Fresh Attempt (Never completed before)
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto space-y-6"
          >
            <GlowCard className="p-6 sm:p-8 space-y-6 border-brand/40 bg-surface text-center shadow-2xl">
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl bg-brand/20 text-brand">
                {pendingSubject.icon}
              </div>

              <div className="space-y-2">
                <Badge variant="brand" className="text-xs">
                  Konfirmasi Mulai Latihan (1x Kesempatan)
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-text">
                  Yakin Ingin Mulai Mengerjakan Soal Sekarang?
                </h2>
                <p className="text-xs text-muted">
                  Kamu akan memulai sesi latihan adaptif untuk mata pelajaran:
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-surface2 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted">Jenjang Kelas:</span>
                  <span className="font-bold text-text">{selectedGrade.title}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted">Mata Pelajaran:</span>
                  <span className="font-bold text-brand">{pendingSubject.name}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted">Jumlah Soal Sesi Ini:</span>
                  <span className="font-bold text-text">
                    {(QUESTION_BANK[pendingSubject.id] || DEFAULT_FALLBACK_QUESTIONS).length} Soal
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-muted">Fitur Unggulan:</span>
                  <span className="font-bold text-accent flex items-center gap-1">
                    <Sparkles size={13} /> AI Think First &amp; Evaluasi Nalar
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={() => setActiveStep("choose_subject")}
                  variant="secondary"
                  className="w-full sm:w-1/2"
                >
                  ← Batal / Ganti Mapel
                </Button>
                <Button
                  onClick={handleConfirmStart}
                  variant="primary"
                  className="w-full sm:w-1/2 font-bold shadow-lg"
                >
                  <span>🚀 Ya, Mulai Sekarang</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </GlowCard>
          </motion.div>
        );
      })()}

      {/* 5. STEP 3: ADAPTIVE QUIZ & AI THINK FIRST MODE */}
      {activeStep === "quiz" && selectedGrade && selectedSubject && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Top Subject Banner with Switch Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface2">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 rounded-xl bg-surface border border-border">{selectedSubject.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="brand" className="text-[10px]">{selectedGrade.badge}</Badge>
                  <h2 className="text-base font-bold font-serif text-text">{selectedSubject.name}</h2>
                </div>
                <p className="text-xs text-muted">{currentQ.topic}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setActiveStep("choose_subject")}>
                Ganti Mapel
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setActiveStep("choose_grade")}>
                Ganti Jenjang
              </Button>
            </div>
          </div>

          {/* Mastery Progress Bar */}
          <div className="space-y-1.5 p-4 rounded-xl border border-border bg-surface">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-text flex items-center gap-1.5">
                <BrainCircuit size={15} className="text-brand" />
                Penguasaan Konsep: <strong>{currentQ.conceptName}</strong>
              </span>
              <span className="text-muted">Target: <strong className="text-brand">85% (Mastered)</strong></span>
            </div>
            <ProgressBar progress={masteryScore} size="md" />
          </div>

          {/* Active Question Card */}
          <Card className="p-6 sm:p-8 space-y-6 border-border shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Badge variant="accent">{currentQ.conceptName}</Badge>
                <span className="text-xs text-muted">
                  Soal {currentIdx + 1} dari {currentSubjectQuestions.length}
                </span>
              </div>
              <span className="text-xs font-mono text-muted">Mode: Adaptif AI</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-serif text-text leading-snug">
              {currentQ.questionText}
            </h3>

            {/* Answer Input Section: Numeric or Multiple Choice */}
            {currentQ.type === "mcq" && currentQ.options ? (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                  {result ? "Klik Opsi Jawaban untuk Melihat Analisis & Penjelasan:" : "Pilih Salah Satu Jawaban:"}
                </label>

                {currentQ.options.map((opt, idx) => {
                  const isSelected = userAnswer === opt;
                  const isCorrectAnswer = opt === currentQ.correctAnswer;
                  const hasSubmitted = !!result;

                  let optionCardStyle = "border-border bg-surface2 text-muted hover:text-text hover:border-brand/40";
                  if (hasSubmitted) {
                    if (isCorrectAnswer) {
                      optionCardStyle = "border-emerald-500/80 bg-emerald-950/20 text-emerald-300 font-bold ring-1 ring-emerald-500/40";
                    } else if (isSelected && !isCorrectAnswer) {
                      optionCardStyle = "border-amber-500/80 bg-amber-950/20 text-amber-300 font-bold ring-1 ring-amber-500/40";
                    }
                  } else if (isSelected) {
                    optionCardStyle = "border-brand bg-brand/10 text-text font-bold ring-1 ring-brand";
                  }

                  return (
                    <div key={idx} className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!hasSubmitted) {
                            setUserAnswer(opt);
                          }
                          setSelectedOptionForExplanation(opt);
                        }}
                        className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${optionCardStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-surface border border-border flex items-center justify-center font-mono text-xs shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          {hasSubmitted && isCorrectAnswer && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/40">
                              <CheckCircle2 size={12} /> Kunci Jawaban Benar
                            </span>
                          )}
                          {hasSubmitted && isSelected && !isCorrectAnswer && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1 border border-amber-500/40">
                              <AlertTriangle size={12} /> Jawaban Kamu (Keliru)
                            </span>
                          )}
                          {!hasSubmitted && isSelected && (
                            <Check size={16} className="text-brand shrink-0" />
                          )}
                        </div>
                      </button>

                      {/* On-Demand Explanation on click when result is visible */}
                      {hasSubmitted && selectedOptionForExplanation === opt && currentQ.optionDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className={`p-3 rounded-lg text-xs leading-relaxed border ${
                            isCorrectAnswer
                              ? "bg-emerald-950/15 border-emerald-500/30 text-emerald-300"
                              : "bg-surface border-border text-muted"
                          }`}
                        >
                          <strong>Penjelasan Opsi {String.fromCharCode(65 + idx)}:</strong>{" "}
                          {currentQ.optionDetails[opt]}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                  Ketik Jawaban Angka Anda:
                </label>
                <input
                  type="text"
                  placeholder="Ketik angka hasil pengerjaan..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={isSubmitting || result?.status === "correct"}
                  className="w-full p-4 rounded-xl outline-none text-lg font-bold border border-border focus:border-brand transition-all"
                  style={{ background: "var(--surface2)", color: "var(--text)" }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAiHint(!showAiHint)}
                className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all flex items-center gap-2"
              >
                <Lightbulb size={16} />
                <span>{showAiHint ? "Tutup Petunjuk AI" : "Minta Bimbingan Nalar AI (Think First)"}</span>
              </button>

              {result?.status !== "correct" ? (
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  loading={isSubmitting}
                  disabled={!userAnswer.trim()}
                  className="font-bold px-6"
                >
                  <span>Kirim Jawaban</span>
                  <Send size={15} />
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} variant="primary" className="font-bold px-6">
                  <span>{isLastQuestion ? "Selesaikan & Lihat Hasil Evaluasi" : "Lanjut ke Soal Berikutnya"}</span>
                  <ArrowRight size={15} />
                </Button>
              )}
            </div>

            {/* AI Think First Socratic Guidance Panel */}
            {showAiHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 rounded-xl bg-brand/10 border border-brand/30 space-y-2 text-xs"
              >
                <div className="flex items-center gap-2 text-brand font-bold">
                  <Compass size={16} />
                  <span>Petunjuk Penalaran Mandiri (Think First):</span>
                </div>
                <p className="text-text leading-relaxed">
                  💡 <em>
                    "Fokuslah pada konsep dasar <strong>{currentQ.conceptName}</strong>. Uraikan setiap langkah pengerjaan secara terpisah sebelum menarik kesimpulan akhir."
                  </em>
                </p>
              </motion.div>
            )}

            {/* Feedback & Result Message */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="pt-2"
                >
                  {result.status === "correct" ? (
                    <div className="p-5 rounded-xl border border-brand/40 bg-brand/10 space-y-2">
                      <div className="flex items-center gap-2 text-brand font-bold text-sm">
                        <CheckCircle2 size={18} />
                        <span>Jawaban Tepat! Penguasaan Materi Meningkat.</span>
                      </div>
                      <p className="text-xs text-muted">{result.feedback}</p>
                      {currentQ.explanationText && (
                        <div className="mt-2 p-3 rounded-lg bg-surface border border-border text-xs text-text">
                          📖 <strong>Pembahasan:</strong> {currentQ.explanationText}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-5 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-3">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                        <AlertTriangle size={18} />
                        <span>Jawaban Belum Tepat — Evaluasi Nalar:</span>
                      </div>
                      {result.misconceptionCode && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-surface text-[11px] font-mono text-accent border border-border">
                          Pola Miskonsepsi: {result.misconceptionCode}
                        </span>
                      )}
                      {result.hintLevel1 && (
                        <div className="p-3 rounded-lg bg-surface border border-border text-xs text-text leading-relaxed">
                          💡 <strong>Bimbingan AI:</strong> {result.hintLevel1}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}

      {/* 6. STEP 4: COMPLETED SUMMARY & DIAGNOSTIC REPORT CARD */}
      {activeStep === "completed" && selectedGrade && selectedSubject && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Main Success Hero Banner */}
          <GlowCard className="p-6 sm:p-8 space-y-6 border-brand/40 bg-surface text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl bg-brand/20 text-brand shadow-lg">
              🎉
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <Badge variant="brand" className="px-3 py-1 text-xs">
                Sesi Pembelajaran Selesai
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-text">
                Rapor Evaluasi Belajar: {selectedSubject.name}
              </h2>
              <p className="text-xs sm:text-sm text-muted">
                Jenjang: <strong>{selectedGrade.title}</strong> • Hasil analisis nalar dan tingkat penguasaan materi kamu telah disimpan.
              </p>
            </div>

            {/* Score Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
              <Card className="p-4 text-center space-y-1 border-border">
                <span className="text-xs text-muted font-semibold">Tingkat Akurasi</span>
                <div className="text-3xl font-extrabold font-serif text-emerald-400 font-mono">
                  {accuracyPercentage}%
                </div>
                <span className="text-[11px] text-muted">{correctCount} dari {totalSessionQuestions} Benar</span>
              </Card>

              <Card className="p-4 text-center space-y-1 border-brand/30 bg-brand/5">
                <span className="text-xs text-brand font-semibold">Mastery Score Akhir</span>
                <div className="text-3xl font-extrabold font-serif text-brand font-mono">
                  {masteryScore}%
                </div>
                <span className="text-[11px] text-brand font-bold">
                  {masteryScore >= 85 ? "🟢 Mastered" : masteryScore >= 60 ? "🟡 Practicing" : "🔴 Needs Focus"}
                </span>
              </Card>

              <Card className="p-4 text-center space-y-1 border-border">
                <span className="text-xs text-muted font-semibold">Status AI Diagnostic</span>
                <div className="text-3xl font-extrabold font-serif text-accent font-mono">
                  {wrongAttempts.length === 0 ? "Optimal" : `${wrongAttempts.length} Catatan`}
                </div>
                <span className="text-[11px] text-muted">Pola Nalar Terpetakan</span>
              </Card>
            </div>
          </GlowCard>

          {/* AI Concept Diagnostic Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strength Analysis */}
            <Card className="p-6 space-y-4 border-emerald-500/30 bg-emerald-950/5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 size={18} />
                <span>Konsep yang Sudah Dikuasai dengan Baik:</span>
              </div>

              <ul className="space-y-2.5 text-xs">
                {sessionAttempts
                  .filter((a) => a.isCorrect)
                  .map((item, idx) => (
                    <li key={idx} className="p-3 rounded-xl bg-surface border border-border space-y-1">
                      <div className="font-bold text-text flex items-center justify-between">
                        <span>• {item.conceptName}</span>
                        <Badge variant="brand" className="text-[10px]">Tuntas</Badge>
                      </div>
                      <p className="text-muted leading-relaxed">{item.questionText}</p>
                    </li>
                  ))}

                {sessionAttempts.filter((a) => a.isCorrect).length === 0 && (
                  <p className="text-muted italic">Belum ada konsep yang tuntas sempurna pada sesi ini.</p>
                )}
              </ul>
            </Card>

            {/* Weakness & Remedial Recommendations */}
            <Card className="p-6 space-y-4 border-amber-500/30 bg-amber-950/5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <AlertTriangle size={18} />
                <span>Hal yang Perlu Diperhatikan &amp; Ditingkatkan:</span>
              </div>

              {wrongAttempts.length > 0 ? (
                <div className="space-y-3 text-xs">
                  {wrongAttempts.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-surface border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-text">• {item.conceptName}</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-[10px] font-mono">
                          {item.misconceptionCode || "Perlu Review"}
                        </span>
                      </div>
                      {item.hintGiven && (
                        <p className="text-muted leading-relaxed italic bg-surface2 p-2 rounded-lg">
                          💡 <strong>Saran Guru &amp; AI:</strong> &ldquo;{item.hintGiven}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-surface border border-border text-xs text-emerald-400 space-y-1">
                  <div className="font-bold">✨ Sempurna! Tanpa Miskonsepsi</div>
                  <p className="text-muted">Kamu memahami seluruh alur logika soal pada modul ini tanpa kesalahan penalaran.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Full Question-by-Question Review & Conceptual Explanations */}
          <Card className="p-6 space-y-4 border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold font-serif text-text flex items-center gap-2">
                  <BookOpen size={18} className="text-brand" />
                  <span>Rekap Detail Soal &amp; Pembahasan Konsep</span>
                </h3>
                <p className="text-xs text-muted">
                  Pelajari kembali kunci jawaban, logika pengerjaan, dan catatan evaluasi nalar untuk setiap soal.
                </p>
              </div>
              <Badge variant="brand" className="text-xs">
                {currentSubjectQuestions.length} Soal Dianalisis
              </Badge>
            </div>

            <div className="space-y-4 pt-2">
              {currentSubjectQuestions.map((q, idx) => {
                const userAttempt = sessionAttempts.find((a) => a.questionId === q.id);
                const wasAnsweredCorrectly = userAttempt?.isCorrect ?? true;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all space-y-3 ${
                      wasAnsweredCorrectly
                        ? "border-emerald-500/30 bg-emerald-950/5"
                        : "border-amber-500/40 bg-amber-950/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-surface2 border border-border flex items-center justify-center font-mono font-bold text-xs">
                          {idx + 1}
                        </span>
                        <Badge variant="accent" className="text-[10px]">{q.conceptName}</Badge>
                        <span className="text-xs text-muted">{q.topic}</span>
                      </div>

                      {wasAnsweredCorrectly ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs">
                          <CheckCircle2 size={14} /> Jawaban Tepat
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-300 font-bold text-xs">
                          <AlertTriangle size={14} /> Perlu Perhatian
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-text leading-relaxed">
                      {q.questionText}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-border/60">
                      <div className="p-2.5 rounded-lg bg-surface border border-border space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted block">Jawaban Kamu:</span>
                        <p className={`font-bold ${wasAnsweredCorrectly ? "text-emerald-400" : "text-amber-300"}`}>
                          {userAttempt?.userAnswer || q.correctAnswer}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-surface border border-brand/30 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-brand block">Kunci Jawaban Benar:</span>
                        <p className="font-bold text-brand">
                          {q.correctAnswer}
                        </p>
                      </div>
                    </div>

                    {/* Conceptual Explanation & Think First Breakdown */}
                    <div className="p-3 rounded-lg bg-surface2 border border-border text-xs space-y-1">
                      <div className="font-bold text-text flex items-center gap-1.5">
                        <Compass size={14} className="text-brand" />
                        <span>Pembahasan Konsep &amp; Alur Penalaran:</span>
                      </div>
                      <p className="text-muted leading-relaxed">
                        {q.explanationText || (
                          q.knownWrongPatterns && Object.values(q.knownWrongPatterns)[0]?.hint ? (
                            <span>💡 <strong>Tips Memahami:</strong> {Object.values(q.knownWrongPatterns)[0].hint}</span>
                          ) : (
                            <span>Kuasai definisi inti dan rumus baku pada konsep <strong>{q.conceptName}</strong> untuk menyelesaikan variasi soal serupa.</span>
                          )
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Action Navigation Footer */}
          <Card className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-border">
            <div className="space-y-0.5 text-center sm:text-left">
              <h3 className="text-base font-bold font-serif text-text">Mau Lanjut Belajar Apa Sekarang?</h3>
              <p className="text-xs text-muted">Pilih langkah berikutnya untuk melanjutkan penguatan kompetensi kamu.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={handleRestartQuiz} variant="secondary" size="sm">
                <RefreshCw size={14} />
                <span>Ulangi Topik Ini (Remedial)</span>
              </Button>

              <Button onClick={() => setActiveStep("choose_subject")} variant="secondary" size="sm">
                <BookOpen size={14} />
                <span>Pilih Mapel Lain</span>
              </Button>

              <Button onClick={() => setActiveStep("choose_grade")} variant="primary" size="sm" className="font-bold">
                <GraduationCap size={14} />
                <span>Ganti Jenjang / Target</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export default function StudentQuizPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-muted">Memuat Portal Belajar Siswa...</div>}>
      <StudentPortalContent />
    </React.Suspense>
  );
}
