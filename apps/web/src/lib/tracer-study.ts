export interface TracerRecord {
  id: string;
  studentName: string;
  email: string;
  nisn: string;
  classOrigin: string;
  academicStatus: "graduated" | "active";
  plannedPathway: "Kuliah" | "Kedinasan" | "Bekerja" | "Wirausaha";
  plannedTarget: string;
  realizationStatus: "Kuliah" | "Kedinasan" | "Bekerja" | "Wirausaha" | "Mencari Kerja";
  realizationDetail: string;
  verificationStatus: "verified" | "pending";
  updatedAt: string;
}

export const INITIAL_TRACER_DATA: TracerRecord[] = [
  {
    id: "trc-1",
    studentName: "Andi Pratama",
    email: "andi@sekolah.sch.id",
    nisn: "0081234567",
    classOrigin: "Kelas XI-A",
    academicStatus: "active",
    plannedPathway: "Kuliah",
    plannedTarget: "Universitas Indonesia (UI) - Teknik Informatika",
    realizationStatus: "Kuliah",
    realizationDetail: "Sedang proses bimbingan SNBT & SNBP",
    verificationStatus: "verified",
    updatedAt: "2026-04-10T10:00:00Z",
  },
  {
    id: "trc-2",
    studentName: "Doni Setiawan",
    email: "doni.s@sekolah.sch.id",
    nisn: "0081234568",
    classOrigin: "Kelas XI-A",
    academicStatus: "active",
    plannedPathway: "Bekerja",
    plannedTarget: "Industri Otomotif / Astra Honda",
    realizationStatus: "Mencari Kerja",
    realizationDetail: "Mengikuti program sertifikasi teknisi",
    verificationStatus: "verified",
    updatedAt: "2026-04-12T11:20:00Z",
  },
  {
    id: "trc-3",
    studentName: "Siti Nurhaliza",
    email: "siti.n@sekolah.sch.id",
    nisn: "0081234569",
    classOrigin: "Kelas XI-A",
    academicStatus: "active",
    plannedPathway: "Kuliah",
    plannedTarget: "Universitas Gadjah Mada (UGM) - Farmasi",
    realizationStatus: "Kuliah",
    realizationDetail: "Lolos Seleksi SNBP UGM Farmasi",
    verificationStatus: "verified",
    updatedAt: "2026-05-01T09:15:00Z",
  },
  {
    id: "trc-4",
    studentName: "Budi Santoso",
    email: "budi.s@sekolah.sch.id",
    nisn: "0081234570",
    classOrigin: "Kelas XI-B",
    academicStatus: "active",
    plannedPathway: "Kedinasan",
    plannedTarget: "PKN STAN (Politeknik Keuangan Negara STAN)",
    realizationStatus: "Kedinasan",
    realizationDetail: "Lolos SKD & Diterima PKN STAN D4 Akuntansi Sektor Publik",
    verificationStatus: "verified",
    updatedAt: "2026-05-05T14:30:00Z",
  },
  {
    id: "trc-5",
    studentName: "Rina Wulandari",
    email: "rina.w@sekolah.sch.id",
    nisn: "0081234571",
    classOrigin: "Kelas XII-A",
    academicStatus: "graduated",
    plannedPathway: "Kedinasan",
    plannedTarget: "Institut Pemerintahan Dalam Negeri (IPDN)",
    realizationStatus: "Kedinasan",
    realizationDetail: "Diterima Praja IPDN Angkatan XXXV",
    verificationStatus: "verified",
    updatedAt: "2026-05-10T16:00:00Z",
  },
  {
    id: "trc-6",
    studentName: "Fajar Nugraha",
    email: "fajar.n@sekolah.sch.id",
    nisn: "0081234572",
    classOrigin: "Kelas XII-B",
    academicStatus: "graduated",
    plannedPathway: "Bekerja",
    plannedTarget: "Software House / Digital Agency",
    realizationStatus: "Bekerja",
    realizationDetail: "Junior Frontend Developer di PT Telkom Digital Solution",
    verificationStatus: "verified",
    updatedAt: "2026-05-12T13:40:00Z",
  },
  {
    id: "trc-7",
    studentName: "Aulia Rahma",
    email: "aulia.r@sekolah.sch.id",
    nisn: "0081234573",
    classOrigin: "Kelas XII-A",
    academicStatus: "graduated",
    plannedPathway: "Wirausaha",
    plannedTarget: "Bisnis Kuliner & F&B Lokal",
    realizationStatus: "Wirausaha",
    realizationDetail: "Owner Kedai Kopi & Bakery 'Rasa Senja'",
    verificationStatus: "verified",
    updatedAt: "2026-05-15T08:00:00Z",
  },
  {
    id: "trc-8",
    studentName: "Eko Prasetyo",
    email: "eko.p@sekolah.sch.id",
    nisn: "0081234574",
    classOrigin: "Kelas XII-B",
    academicStatus: "graduated",
    plannedPathway: "Bekerja",
    plannedTarget: "Industri Manufaktur Logistik",
    realizationStatus: "Mencari Kerja",
    realizationDetail: "Sedang melamar lowongan kerja di portal NALARA Mitra Karir",
    verificationStatus: "pending",
    updatedAt: "2026-05-18T10:10:00Z",
  },
];

const STORAGE_KEY = "nalara_tracer_study_records";

export function getStoredTracerRecords(): TracerRecord[] {
  if (typeof window === "undefined") return INITIAL_TRACER_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // initialize
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRACER_DATA));
  } catch {
    // fallback
  }
  return INITIAL_TRACER_DATA;
}

export function saveStoredTracerRecords(records: TracerRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error("Failed to save tracer records:", e);
  }
}

export function updateOrAddTracerRecord(record: Partial<TracerRecord> & { email: string }): TracerRecord[] {
  const current = getStoredTracerRecords();
  const lowerEmail = record.email.toLowerCase().trim();
  const index = current.findIndex((c) => c.email.toLowerCase() === lowerEmail);

  if (index >= 0) {
    current[index] = {
      ...current[index],
      ...record,
      updatedAt: new Date().toISOString(),
    };
  } else {
    current.unshift({
      id: `trc-${Date.now()}`,
      studentName: record.studentName || record.email.split("@")[0],
      email: record.email,
      nisn: record.nisn || "-",
      classOrigin: record.classOrigin || "Kelas XII-A",
      academicStatus: record.academicStatus || "active",
      plannedPathway: record.plannedPathway || "Kuliah",
      plannedTarget: record.plannedTarget || "Perguruan Tinggi Negeri",
      realizationStatus: record.realizationStatus || "Kuliah",
      realizationDetail: record.realizationDetail || "Belum ada keterangan",
      verificationStatus: record.verificationStatus || "verified",
      updatedAt: new Date().toISOString(),
    });
  }

  saveStoredTracerRecords(current);
  return current;
}
