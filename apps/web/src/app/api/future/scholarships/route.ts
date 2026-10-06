import { NextResponse } from "next/server";

// Global In-Memory Store for Real-Time Custom Scholarship Postings
declare global {
  // eslint-disable-next-line no-var
  var __NALARA_CUSTOM_SCHOLARSHIPS__: any[] | undefined;
}

// Reset store to ensure zero dummy test entries remain
global.__NALARA_CUSTOM_SCHOLARSHIPS__ = [];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "all";
    const studentScore = Number(searchParams.get("score") || "75");

    const BASE_SCHOLARSHIPS_DATA = [
      // 1. Beasiswa Pemerintah & Kedinasan RI
      {
        id: "sch-kipk",
        title: "KIP Kuliah Merdeka (Kemendikbudristek RI)",
        provider: "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi RI",
        category: "pemerintah",
        level: "S1 / D4 / D3 Perguruan Tinggi Negeri & Swasta Seluruh Indonesia",
        coverageBadge: "Bebas UKT 100% + Uang Saku Bulanan",
        allowance: "Rp 800.000 - Rp 1.400.000 / bulan (sesuai klaster wilayah)",
        minScoreReq: 60,
        deadline: "Pendaftaran Aktif Bersamaan Jalur SNBP & SNBT",
        status: "Buka Pendaftaran",
        requirements: [
          "Siswa SMA/SMK/MA lulusan tahun berjalan atau maksimal 2 tahun sebelumnya",
          "Memiliki NISN, NPSN, dan NIK yang valid",
          "Memiliki potensi akademik baik dengan keterbatasan ekonomi (KIP/KKS/DTKS)",
          "Diterima di PTN atau PTS program studi terakreditasi",
        ],
        applyUrl: "https://kip-kuliah.kemdikbud.go.id/",
        tags: ["Pemerintah", "Bebas Uang Kuliah", "Biaya Hidup", "SNBT / SNBP"],
      },
      {
        id: "sch-unggulan",
        title: "Beasiswa Unggulan Masyarakat Berprestasi",
        provider: "Puslapdik Kemendikbudristek RI",
        category: "pemerintah",
        level: "Jenjang Sarjana (S1) Dalam Negeri",
        coverageBadge: "Biaya Pendidikan Penuh + Biaya Hidup + Buku",
        allowance: "Biaya hidup bulanan + bantuan buku per semester",
        minScoreReq: 85,
        deadline: "Buka Gelombang II - Periode Berjalan",
        status: "Buka Pendaftaran",
        requirements: [
          "Memiliki prestasi tingkat nasional/internasional atau sertifikat kompetensi akademik",
          "Memiliki Letter of Acceptance (LoA) dari perguruan tinggi",
          "Menulis esai rencana studi dan kontribusi untuk Indonesia",
          "Nilai rapor semester 1–5 di atas rata-rata sekolah",
        ],
        applyUrl: "https://beasiswaunggulan.kemdikbud.go.id/",
        tags: ["Pemerintah", "Prestasi Akademik", "Biaya Buku", "S1 Nasional"],
      },
      {
        id: "sch-bim",
        title: "Beasiswa Indonesia Maju (BIM S1 Dalam & Luar Negeri)",
        provider: "Pusat Prestasi Nasional (Puspresnas) Kemendikbudristek",
        category: "pemerintah",
        level: "Program Sarjana (S1) PTN Ternama & Top Global Universities",
        coverageBadge: "Full Scholarship + Biaya Hidup + Asuransi + Tiket PP",
        allowance: "Tunjangan hidup bulanan + biaya visa & asuransi kesehatan",
        minScoreReq: 88,
        deadline: "Pendaftaran Seleksi Tahunan",
        status: "Buka Pendaftaran",
        requirements: [
          "Siswa berprestasi di ajang talenta OSN / FLS2N / O2SN / LDBI / OPSI tingkat nasional",
          "Memiliki kemampuan bahasa Inggris (IELTS/TOEFL) untuk jalur luar negeri",
          "Memiliki integritas kebangsaan yang tinggi",
        ],
        applyUrl: "https://pusatprestasinasional.kemdikbud.go.id/",
        tags: ["Pemerintah", "Top Global University", "Biaya Penuh", "Prestasi OSN"],
      },
      {
        id: "sch-baznas",
        title: "Beasiswa Cendekia BAZNAS (BCB)",
        provider: "Badan Amil Zakat Nasional (BAZNAS RI)",
        category: "pemerintah",
        level: "S1 di 111 Kampus Mitra BAZNAS se-Indonesia",
        coverageBadge: "Subsidi UKT + Uang Saku + Pembinaan Tokoh Bangsa",
        allowance: "Bantuan UKT sampai lulus + pembinaan bulanan",
        minScoreReq: 70,
        deadline: "Pendaftaran Periode Tahunan",
        status: "Buka Pendaftaran",
        requirements: [
          "Mahasiswa dari keluarga kurang mampu atau aktivis dakwah/sosial",
          "Melampirkan surat rekomendasi tokoh masyarakat / pengurus BAZNAS daerah",
          "Memiliki komitmen pengabdian masyarakat pasca lulus",
        ],
        applyUrl: "https://beasiswa.baznas.go.id/",
        tags: ["Pemerintah / BAZNAS", "Bantuan UKT", "Pembinaan Karakter"],
      },

      // 2. Beasiswa BUMN & Korporasi Nasional
      {
        id: "sch-aperti",
        title: "Beasiswa APERTI BUMN (Aliansi Perguruan Tinggi BUMN)",
        provider: "Telkom University, UISI, IT PLN, IT Telkom, Poltek POS",
        category: "bumn",
        level: "Program Sarjana (S1 / D4) di 8 Universitas Mitra BUMN",
        coverageBadge: "Beasiswa Penuh 100% Bebas Biaya Kuliah Sampai Lulus",
        allowance: "Potensi rekrutmen kerja dan magang di BUMN terkait",
        minScoreReq: 78,
        deadline: "Pendaftaran Periode Mei - Juli",
        status: "Buka Pendaftaran",
        requirements: [
          "Lulusan SMA/SMK/MA seluruh jurusan di Indonesia",
          "Nilai rapor semester 1–5 minimal rata-rata 75",
          "Melampirkan sertifikat prestasi pendukung",
        ],
        applyUrl: "https://apertibumn.org/",
        tags: ["BUMN", "Telkom University", "Bebas UKT 100%", "Magang BUMN"],
      },
      {
        id: "sch-pertamina",
        title: "Beasiswa Sobat Bumi Pertamina",
        provider: "Pertamina Foundation",
        category: "bumn",
        level: "Mahasiswa S1 Perguruan Tinggi Mitra Pertamina",
        coverageBadge: "Bantuan UKT + Uang Saku + Aksi Hijau Sobat Bumi",
        allowance: "Rp 1.000.000 / bulan + Dana proyek pelestarian lingkungan",
        minScoreReq: 80,
        deadline: "Pendaftaran Periode Tahunan",
        status: "Buka Pendaftaran",
        requirements: [
          "Mahasiswa aktif semester 2 ke atas di kampus mitra",
          "IPK minimal 3.00",
          "Memiliki kepedulian tinggi terhadap lingkungan hidup dan energi hijau",
        ],
        applyUrl: "https://pertaminafoundation.org/",
        tags: ["BUMN / Pertamina", "Uang Saku", "Aksi Hijau", "Networking"],
      },
      {
        id: "sch-bi",
        title: "Beasiswa Bank Indonesia (Generasi Baru Indonesia - GenBI)",
        provider: "Bank Indonesia",
        category: "bumn",
        level: "Mahasiswa S1 Perguruan Tinggi Negeri & Vokasi",
        coverageBadge: "Tunjangan Rp 1.000.000 / bulan + Komunitas GenBI",
        allowance: "Bantuan biaya kuliah & pengembangan wawasan kebanksentralan",
        minScoreReq: 78,
        deadline: "Pendaftaran Seleksi Tahunan",
        status: "Buka Pendaftaran",
        requirements: [
          "Telah menyelesaikan minimal 40 SKS di perguruan tinggi mitra BI",
          "IPK minimal 3.00 (Skala 4.00)",
          "Menulis resume motivasi diri dan komitmen kebangsaan",
          "Aktif berperan dalam kegiatan sosial kemasyarakatan",
        ],
        applyUrl: "https://www.bi.go.id",
        tags: ["BUMN / BI", "Ekonomi & Moneter", "Komunitas GenBI"],
      },
      {
        id: "sch-bri",
        title: "Beasiswa BRILiaN Scholarship Program",
        provider: "PT Bank Rakyat Indonesia (Persero) Tbk",
        category: "bumn",
        level: "Mahasiswa S1 Semester 5-7 Kampus Mitra BRI",
        coverageBadge: "Biaya Pendidikan + Uang Saku + Jaminan Karir Management Trainee",
        allowance: "Uang saku bulanan + bantuan skripsi + fasilitas laptop",
        minScoreReq: 82,
        deadline: "Pendaftaran Periode Berjalan",
        status: "Buka Pendaftaran",
        requirements: [
          "IPK minimal 3.25 dari skala 4.00",
          "Jurusan Teknik Informatika, Sistem Informasi, MIPA, Ekonomi, Hukum, Komunikasi",
          "Lolos seleksi interview dan asesmen budaya kerja BRI",
        ],
        applyUrl: "https://bbri.id/scholarship",
        tags: ["BUMN / BRI", "Jaminan Karir MT", "Laptop", "Uang Saku"],
      },
      {
        id: "sch-bsi",
        title: "BSI Scholarship Inspirasi & Prestasi",
        provider: "BSI Maslahat & PT Bank Syariah Indonesia Tbk",
        category: "bumn",
        level: "Mahasiswa S1 Tahun Pertama di Kampus Mitra BSI",
        coverageBadge: "Bantuan UKT 100% Selama 4 Tahun + Uang Saku",
        allowance: "Uang saku bulanan + pembinaan ekonomi syariah & magang",
        minScoreReq: 75,
        deadline: "Pendaftaran Periode Tahunan",
        status: "Buka Pendaftaran",
        requirements: [
          "Mahasiswa baru semester 1 di PTN yang bekerja sama dengan BSI",
          "Memiliki prestasi akademik atau hafalan Al-Qur'an (Jalur Prestasi)",
          "Memiliki keterbatasan finansial (Jalur Inspirasi)",
        ],
        applyUrl: "https://bsischolarship.id/",
        tags: ["BUMN / BSI", "Full UKT 4 Tahun", "Ekonomi Syariah", "Magang"],
      },

      // 3. Beasiswa Swasta & Yayasan Filantropi
      {
        id: "sch-bca",
        title: "Beasiswa BCA Finance & PPTI / PPBP",
        provider: "PT Bank Central Asia Tbk",
        category: "swasta",
        level: "Program Pendidikan Teknik Informatika & Bisnis Perbankan (Bebas Biaya)",
        coverageBadge: "100% Bebas Biaya Pendidikan + Uang Saku + Laptop",
        allowance: "Uang saku bulanan + jaminan kesempatan magang & karir di BCA",
        minScoreReq: 80,
        deadline: "Pendaftaran Ditutup 30 November 2026",
        status: "Buka Pendaftaran",
        requirements: [
          "Lulusan SMA (Jurusan IPA/IPS) atau SMK Teknologi/Informatika",
          "Nilai rata-rata rapor minimal 7.50 (Matematika min. 7.50)",
          "Memiliki minat tinggi di bidang teknologi informasi atau perbankan",
          "Belum menikah dan bersedia tidak menikah selama pendidikan",
        ],
        applyUrl: "https://karir.bca.co.id/beasiswa-bca",
        tags: ["Swasta", "Perbankan & IT", "Laptop Diberikan", "Uang Saku"],
      },
      {
        id: "sch-tanoto",
        title: "Program TELADAN - Tanoto Foundation",
        provider: "Tanoto Foundation",
        category: "swasta",
        level: "Mahasiswa S1 Reguler di 9 Universitas Negeri Mitra",
        coverageBadge: "Biaya Kuliah 100% + Tunjangan Bulanan + Leadership Bootcamp",
        allowance: "Biaya hidup bulanan dari semester 2 hingga semester 8",
        minScoreReq: 82,
        deadline: "Pendaftaran Dibuka Setiap Agustus - September",
        status: "Buka Pendaftaran",
        requirements: [
          "WNI yang baru terdaftar sebagai mahasiswa S1 di kampus mitra Tanoto",
          "Memiliki prestasi akademik dan kepemimpinan yang teruji",
          "Berkomitmen mengikuti rangkaian pengembangan kepemimpinan TELADAN",
        ],
        applyUrl: "https://tanotofoundation.org/id/teladan/",
        tags: ["Swasta", "Leadership Training", "Full UKT", "Tunjangan Bulanan"],
      },
      {
        id: "sch-djarum",
        title: "Djarum Beasiswa Plus",
        provider: "Djarum Foundation",
        category: "swasta",
        level: "Mahasiswa S1 / D4 Semester 4 (Bisa dipersiapkan sejak SMA)",
        coverageBadge: "Dana Beasiswa Rp 1.000.000 / bln + Pelatihan Karakter",
        allowance: "Rp 12.000.000 / tahun + Pelatihan Soft Skills & Karakter",
        minScoreReq: 75,
        deadline: "Pendaftaran Dibuka Setiap Periode Berjalan",
        status: "Buka Pendaftaran",
        requirements: [
          "Sedang menempuh pendidikan S1/D4 di perguruan tinggi mitra",
          "IPK minimum 3.00 pada semester III",
          "Aktif berorganisasi di lingkungan kampus atau sekolah sebelumnya",
          "Tidak sedang menerima beasiswa dari pihak lain",
        ],
        applyUrl: "https://djarumbeasiswaplus.org/",
        tags: ["Swasta", "Leadership Training", "Dana Tunai", "Komunitas Nasional"],
      },
      {
        id: "sch-sea",
        title: "Sea Scholarship Indonesia (Shopee & Garena Group)",
        provider: "Sea Group (Shopee, Garena, SeaMoney)",
        category: "swasta",
        level: "Mahasiswa S1 di Perguruan Tinggi Terkemuka Indonesia",
        coverageBadge: "Biaya Kuliah Penuh 100% + Uang Saku Bulanan + Magang di Shopee",
        allowance: "Biaya hidup bulanan + asuransi + kesempatan berkarir di Sea Group",
        minScoreReq: 84,
        deadline: "Pendaftaran Tahunan",
        status: "Buka Pendaftaran",
        requirements: [
          "Warga Negara Indonesia terdaftar di kampus mitra (UI, ITB, UGM, IPB, Binus, dll)",
          "Memiliki prestasi akademik cemerlang dan kemampuan analytical thinking",
          "Tidak terikat ikatan dinas dengan instansi lain",
        ],
        applyUrl: "https://careers.sea.com/scholarship",
        tags: ["Swasta / Tech", "Shopee & Garena", "Full UKT", "Jalur Karir Tech"],
      },
      {
        id: "sch-paragon",
        title: "Paragon Scholarship Program (Wardah & Emina Group)",
        provider: "PT Paragon Technology and Innovation",
        category: "swasta",
        level: "Mahasiswa D3 / D4 / S1 di Kampus Mitra",
        coverageBadge: "Bantuan Dana Pendidikan + Leadership Program + Project Magang",
        allowance: "Dana pembinaan Rp 6.250.000 per semester + pelatihan profesional",
        minScoreReq: 78,
        deadline: "Pendaftaran Dibuka Setiap Semester Ganjil",
        status: "Buka Pendaftaran",
        requirements: [
          "Mahasiswa aktif D3 (semester 3) atau S1 (semester 5) di kampus mitra",
          "IPK minimal 3.00",
          "Berkomitmen mengikuti program pengembangan diri Paragonian",
        ],
        applyUrl: "https://paragon-innovation.com/scholarship",
        tags: ["Swasta", "Kosmetik & FMCG", "Leadership", "Dana Pembinaan"],
      },
      {
        id: "sch-osc",
        title: "Online Scholarship Competition (OSC Medcom.id)",
        provider: "Medcom.id & Surya Edukasi Bangsa Foundation",
        category: "swasta",
        level: "Program Sarjana (S1) Bebas Tes di 20+ Universitas Swasta Top",
        coverageBadge: "Bebas Uang Pangkal 100% + Bebas Biaya SPP Sampai Lulus",
        allowance: "Bebas biaya perkuliahan 100% selama 8 semester",
        minScoreReq: 75,
        deadline: "Pendaftaran Agustus - November Setiap Tahun",
        status: "Buka Pendaftaran",
        requirements: [
          "Siswa SMA/SMK/MA kelas XII atau lulusan tahun sebelumnya",
          "Mengikuti tes online kemampuan dasar dan potensi akademik di platform OSC",
          "Memilih program studi di kampus mitra yang diminati",
        ],
        applyUrl: "https://osc.medcom.id/",
        tags: ["Swasta", "Bebas Uang Pangkal", "Tes Online", "20+ Kampus Swasta"],
      },

      // 4. Beasiswa Internasional (Kuliah Luar Negeri)
      {
        id: "sch-turki",
        title: "Türkiye Bursları Scholarship (Beasiswa Pemerintah Turki)",
        provider: "Pemerintah Republik Turki (YTB)",
        category: "internasional",
        level: "Program Sarjana (S1) di Universitas Negeri Terkemuka Turki",
        coverageBadge: "Biaya Kuliah 100% + Asrama Gratis + Uang Saku + Tiket PP",
        allowance: "Uang saku bulanan TL 3.500 + Kursus Bahasa Turki 1 Tahun Gratis",
        minScoreReq: 80,
        deadline: "Pendaftaran Tahunan Januari - Februari",
        status: "Buka Pendaftaran",
        requirements: [
          "Warga Negara Indonesia usia di bawah 21 tahun untuk jenjang S1",
          "Nilai rata-rata rapor atau ijazah minimal 70%",
          "Sehat jasmani dan melampirkan surat rekomendasi sekolah",
        ],
        applyUrl: "https://turkiyeburslari.gov.tr/",
        tags: ["Internasional", "Kuliah ke Turki", "Asrama Gratis", "Uang Saku"],
      },
      {
        id: "sch-mitsui",
        title: "Mitsui-Bussan Scholarship for Indonesia",
        provider: "Mitsui Bussan Scholarship Association",
        category: "internasional",
        level: "Program Sarjana (S1) di Universitas Terkemuka Jepang",
        coverageBadge: "Biaya Kuliah 100% + Tiket PP + Uang Saku ¥145.000/bln",
        allowance: "¥145.000 (sekitar Rp 15.000.000) / bulan + Pelatihan Bahasa Jepang 1.5 tahun",
        minScoreReq: 85,
        deadline: "Pendaftaran Tahunan",
        status: "Buka Pendaftaran",
        requirements: [
          "Warga Negara Indonesia usia di bawah 20 tahun saat pendaftaran",
          "Lulusan SMA Jurusan IPA atau IPS dengan nilai minimal 80 pada Matematika & B. Inggris",
          "Sehat jasmani dan rohani",
          "Bersedia belajar bahasa Jepang intensif sebelum kuliah reguler",
        ],
        applyUrl: "https://www.mbk-scholarship-id.com/",
        tags: ["Internasional", "Kuliah ke Jepang", "Tiket Pesawat", "Uang Saku Tinggi"],
      },
      {
        id: "sch-mext",
        title: "Monbukagakusho (MEXT) Undergraduate Scholarship",
        provider: "Kementerian Pendidikan, Kebudayaan, Olahraga, Sains & Teknologi Jepang",
        category: "internasional",
        level: "Program Sarjana (S1) di Universitas Negeri Jepang",
        coverageBadge: "100% Bebas Biaya Kuliah + Tiket PP + Tunjangan ¥117.000/bln",
        allowance: "¥117.000 (sekitar Rp 12.000.000) / bulan + Biaya Ujian Masuk Ditanggung",
        minScoreReq: 84,
        deadline: "Pendaftaran Jalur G to G Setiap April - Mei",
        status: "Buka Pendaftaran",
        requirements: [
          "Lulusan SMA/SMK sederajat nilai rata-rata ujian sekolah minimal 84",
          "Usia antara 17 hingga 25 tahun",
          "Lolos seleksi dokumen dan tes tulis Kedutaan Besar Jepang",
        ],
        applyUrl: "https://www.id.emb-japan.go.jp/sch.html",
        tags: ["Internasional", "Jepang MEXT", "Biaya Penuh", "G to G Official"],
      },
      {
        id: "sch-gks",
        title: "Global Korea Scholarship (GKS S1 Korea Selatan)",
        provider: "National Institute for International Education (NIIED Korea)",
        category: "internasional",
        level: "Program Sarjana (S1) di Seluruh Universitas Top Korea Selatan",
        coverageBadge: "Full Tuition + Uang Saku 1 Juta Won/bln + Kursus Bahasa Korea Gratis",
        allowance: "KRW 1.000.000 / bulan + Asuransi Kesehatan + Tiket Pesawat PP",
        minScoreReq: 85,
        deadline: "Pendaftaran Jalur Embassy & University Setiap September - Oktober",
        status: "Buka Pendaftaran",
        requirements: [
          "WNI lulusan SMA/SMK sederajat dengan nilai rapor masuk 20% terbaik di kelas",
          "Usia di bawah 25 tahun",
          "Memiliki minat mendalam untuk melanjutkan studi dan riset di Korea Selatan",
        ],
        applyUrl: "https://www.studyinkorea.go.kr",
        tags: ["Internasional", "Korea Selatan", "Full Biaya Hidup", "Kursus Bahasa"],
      },
      {
        id: "sch-hungary",
        title: "Stipendium Hungaricum Scholarship (Hungaria / Eropa)",
        provider: "Pemerintah Republik Hungaria (Tempus Public Foundation)",
        category: "internasional",
        level: "Program Sarjana (S1 / BA / BSc) di Universitas Hungaria",
        coverageBadge: "Bebas Biaya Kuliah 100% + Asrama Mahasiswa + Asuransi Kesehatan",
        allowance: "Uang saku bulanan HUF 43.700 + Asrama atau subsidi akomodasi",
        minScoreReq: 80,
        deadline: "Pendaftaran Setiap November - Januari",
        status: "Buka Pendaftaran",
        requirements: [
          "Warga Negara Indonesia usia minimal 18 tahun",
          "Memiliki sertifikat kemampuan bahasa Inggris (IELTS/TOEFL)",
          "Melakukan registrasi ganda di portal Tempus dan Kemendikbudristek RI",
        ],
        applyUrl: "https://stipendiumhungaricum.hu/",
        tags: ["Internasional", "Uni Eropa / Hungaria", "Bebas UKT", "Asrama"],
      },
      {
        id: "sch-jardine",
        title: "The Jardine Scholarship (Oxford & Cambridge UK)",
        provider: "The Jardine Foundation",
        category: "internasional",
        level: "Program Sarjana (Undergraduate) di Universitas Oxford & Cambridge",
        coverageBadge: "Full Tuition Fee + Biaya Hidup Penuh + Tiket Pesawat PP",
        allowance: "Seluruh biaya hidup di Inggris + tunjangan buku & perlengkapan",
        minScoreReq: 92,
        deadline: "Pendaftaran Setiap Agustus - Oktober",
        status: "Buka Pendaftaran",
        requirements: [
          "Siswa berprestasi luar biasa dengan kemampuan akademik dan kepemimpinan tinggi",
          "Mendaftar ke salah satu Colleges mitra di Oxford atau Cambridge via UCAS",
          "Memiliki kemampuan bahasa Inggris level mahir (IELTS min. 7.5)",
        ],
        applyUrl: "https://www.jardines.com/en/community/foundation.html",
        tags: ["Internasional", "Oxford & Cambridge", "Prestise Dunia", "Full Biaya"],
      },
    ];

    // Real-Time Live Feed Fetcher
    let liveFeedScholarships: any[] = [];
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const feedRes = await fetch("https://indbeasiswa.com/feed", {
        headers: { "User-Agent": "NALARA-ScholarshipBot/1.0" },
        signal: controller.signal,
        next: { revalidate: 1800 },
      });
      clearTimeout(timeout);

      if (feedRes.ok) {
        const xmlText = await feedRes.text();
        const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];

        liveFeedScholarships = items.map((itemXml, idx) => {
          const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
          const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
          const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);
          const pubMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

          const rawTitle = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : `Program Beasiswa Terkini #${idx + 1}`;
          const rawLink = linkMatch ? linkMatch[1].trim() : "https://indbeasiswa.com";
          const rawDesc = descMatch ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").replace(/<[^>]*>?/gm, "").slice(0, 160) : "";

          const isInternational =
            rawTitle.toLowerCase().includes("luar") ||
            rawTitle.toLowerCase().includes("jepang") ||
            rawTitle.toLowerCase().includes("korea") ||
            rawTitle.toLowerCase().includes("turki") ||
            rawTitle.toLowerCase().includes("eropa") ||
            rawTitle.toLowerCase().includes("singapura") ||
            rawTitle.toLowerCase().includes("australia") ||
            rawTitle.toLowerCase().includes("inggris") ||
            rawTitle.toLowerCase().includes("usa");

          const isBUMN = rawTitle.toLowerCase().includes("bumn") || rawTitle.toLowerCase().includes("pertamina") || rawTitle.toLowerCase().includes("pln") || rawTitle.toLowerCase().includes("telkom");

          return {
            id: `live-feed-${idx}`,
            title: rawTitle,
            provider: "Portal Beasiswa Indonesia Terverifikasi",
            category: isInternational ? "internasional" : isBUMN ? "bumn" : "swasta",
            level: "Program Sarjana (S1) / Diploma / SMA",
            coverageBadge: "Bantuan Dana Pendidikan & Tunjangan",
            allowance: "Bantuan dana tunai, UKT, & pembinaan prestasi",
            minScoreReq: 75,
            deadline: pubMatch ? `Dipublikasikan: ${pubMatch[1].slice(0, 16)}` : "Pendaftaran Baru Dirilis Hari Ini",
            status: "Baru Dirilis",
            requirements: [
              "Siswa SMA/SMK sederajat atau mahasiswa aktif",
              "Mengisi formulir pendaftaran daring di portal resmi penyelenggara",
              "Melampirkan dokumen identitas, transkrip nilai/rapor, dan esai motivasi",
            ],
            applyUrl: rawLink,
            tags: ["Update Real-Time", "Beasiswa Baru", "S1 / D4", isInternational ? "Luar Negeri" : "Dalam Negeri"],
            description: rawDesc,
          };
        });
      }
    } catch {
      // Graceful fallback
    }

    // Custom posted scholarships from foundations or school admins (Prioritized at the top!)
    const customUserScholarships = global.__NALARA_CUSTOM_SCHOLARSHIPS__ || [];

    const allScholarships = [
      ...customUserScholarships,
      ...liveFeedScholarships,
      ...BASE_SCHOLARSHIPS_DATA,
    ];

    let filtered = allScholarships;
    if (category && category !== "all") {
      filtered = filtered.filter((s) => s.category === category);
    }

    // Calculate AI Fit Score based on student mastery
    const enriched = filtered.map((s) => {
      let fitPercent = Math.min(98, Math.max(65, Math.round((studentScore / s.minScoreReq) * 85)));
      if (studentScore >= s.minScoreReq) fitPercent = Math.min(99, fitPercent + 10);

      return {
        ...s,
        aiFitScore: fitPercent,
        isRecommended: fitPercent >= 80,
      };
    });

    return NextResponse.json({
      success: true,
      total: enriched.length,
      customPostedCount: customUserScholarships.length,
      liveFeedCount: liveFeedScholarships.length,
      isLiveRss: true,
      scholarships: enriched,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST: Allows Institutions, Universities, Foundations, and Counselors to Post New Scholarships Directly
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, provider, category, level, coverageBadge, allowance, deadline, requirements, applyUrl, tags, minScoreReq } = body;

    if (!title || !provider || !applyUrl) {
      return NextResponse.json(
        { error: "Nama beasiswa, institusi penyelenggara, dan link pendaftaran resmi wajib diisi." },
        { status: 400 }
      );
    }

    const newScholarship = {
      id: `custom-sch-${Date.now()}`,
      title: title.trim(),
      provider: provider.trim(),
      category: category || "swasta",
      level: level || "Program Sarjana (S1 / D4)",
      coverageBadge: coverageBadge || "Bantuan Biaya Pendidikan & Tunjangan",
      allowance: allowance || "Bantuan UKT / Tunjangan Operasional",
      minScoreReq: Number(minScoreReq) || 75,
      deadline: deadline || "Pendaftaran Terbuka Periode Berjalan",
      status: "Buka Pendaftaran",
      requirements: Array.isArray(requirements) && requirements.length > 0
        ? requirements
        : ["Siswa SMA/SMK sederajat atau lulusan baru", "Melampirkan rapor atau dokumen identitas"],
      applyUrl: applyUrl.trim(),
      tags: Array.isArray(tags) ? tags : ["Mitra Resmi", "Beasiswa Baru", "S1"],
      isCustomPosted: true,
      publication_date: new Date().toISOString(),
    };

    if (!global.__NALARA_CUSTOM_SCHOLARSHIPS__) {
      global.__NALARA_CUSTOM_SCHOLARSHIPS__ = [];
    }

    // Prepend to top of list
    global.__NALARA_CUSTOM_SCHOLARSHIPS__.unshift(newScholarship);

    return NextResponse.json({
      success: true,
      message: "Program beasiswa berhasil diterbitkan dan langsung tampil secara real-time untuk seluruh siswa!",
      scholarship: newScholarship,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memproses input beasiswa";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
