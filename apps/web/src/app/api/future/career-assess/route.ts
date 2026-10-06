import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      answers,
      studentName = "Siswa NALARA",
      masteryScore = 75,
    } = body;

    // Algorithmic RIASEC Score Calculator
    const scores: Record<string, number> = {
      Realistic: 0,
      Investigative: 0,
      Artistic: 0,
      Social: 0,
      Enterprising: 0,
      Conventional: 0,
    };

    if (answers && typeof answers === "object") {
      Object.values(answers).forEach((ans: any) => {
        const cat = typeof ans === "object" ? ans.category : ans;
        if (cat === "realistic" || cat === "hardware") scores.Realistic += 15;
        else if (cat === "investigative" || cat === "data" || cat === "logic") scores.Investigative += 15;
        else if (cat === "artistic" || cat === "design" || cat === "writing") scores.Artistic += 15;
        else if (cat === "social" || cat === "customer-support" || cat === "teaching") scores.Social += 15;
        else if (cat === "enterprising" || cat === "marketing" || cat === "leadership") scores.Enterprising += 15;
        else if (cat === "conventional" || cat === "admin" || cat === "finance") scores.Conventional += 15;
        else if (cat === "software-dev") {
          scores.Investigative += 10;
          scores.Realistic += 5;
        }
      });
    }

    // Determine top 2 RIASEC dimensions
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top1 = sorted[0]?.[0] || "Investigative";
    const top2 = sorted[1]?.[0] || "Conventional";
    const riasecCode = `${top1} - ${top2}`;

    // Persona mapping based on top dimensions
    let archetype = "Strategic Problem Solver";
    let defaultJobTag = "data";
    let recommendedCareers = [
      {
        title: "Data Analyst & Operations Specialist",
        description: "Menganalisis tren data, merapikan basis data operasional, dan menghasilkan wawasan keputusan bisnis yang akurat.",
        suitableIndustries: "Fintech, E-commerce, Logistik, Perbankan",
        jobTag: "data",
      },
      {
        title: "Administrative & Financial Controller",
        description: "Mengelola arus pembukuan, kepatuhan administrasi, dan koordinasi dokumen operasional organisasi.",
        suitableIndustries: "Korporasi, Startup, Institusi Pemerintahan",
        jobTag: "data",
      },
      {
        title: "Junior Software & Technical Support",
        description: "Mengembangkan modul aplikasi, testing kualitas sistem, dan memecahkan kendala teknis operasional.",
        suitableIndustries: "Teknologi Digital, SaaS, EduTech",
        jobTag: "software-dev",
      },
    ];

    if (top1 === "Artistic" || top2 === "Artistic") {
      archetype = "Creative Visionary & Content Innovator";
      defaultJobTag = "design";
      recommendedCareers = [
        {
          title: "UI/UX & Graphic Designer",
          description: "Menciptakan antarmuka visual aplikasi yang estetik, ramah pengguna, dan materi branding digital.",
          suitableIndustries: "Agensi Kreatif, Studio Desain, Startup Tech",
          jobTag: "design",
        },
        {
          title: "Content Strategist & Copywriter",
          description: "Merancang narasi promosi, script video kreatif, dan artikel bernilai informasi tinggi.",
          suitableIndustries: "Media Digital, FMCG, E-commerce",
          jobTag: "writing",
        },
        {
          title: "Video Editor & Motion Designer",
          description: "Mengolah materi visual bergerak, animasi interaktif, dan konten promosi multimedia.",
          suitableIndustries: "Production House, Social Media Agency",
          jobTag: "design",
        },
      ];
    } else if (top1 === "Social" || top2 === "Social") {
      archetype = "Empathetic Communicator & Human Relations";
      defaultJobTag = "customer-support";
      recommendedCareers = [
        {
          title: "Customer Relationship & Experience Lead",
          description: "Membangun hubungan erat dengan klien, menangani kebutuhan pengguna dengan solusi cepat dan hangat.",
          suitableIndustries: "Perbankan, Layanan Digital, Hospitality",
          jobTag: "customer-support",
        },
        {
          title: "Public Relations & Community Manager",
          description: "Menghubungkan institusi dengan publik, mengelola komunitas pengguna, dan edukasi publik.",
          suitableIndustries: "EduTech, Komunitas Startup, Yayasan Publik",
          jobTag: "customer-support",
        },
        {
          title: "Human Resources & Talent Coordinator",
          description: "Mengelola pengembangan potensi tim, rekrutmen talenta muda, dan budaya kerja kolaboratif.",
          suitableIndustries: "Korporasi, Perusahaan Multinasional",
          jobTag: "hr",
        },
      ];
    } else if (top1 === "Enterprising" || top2 === "Enterprising") {
      archetype = "Dynamic Growth Driver & Strategist";
      defaultJobTag = "marketing";
      recommendedCareers = [
        {
          title: "Digital Marketing & Growth Specialist",
          description: "Merancang kampanye promosi digital, optimasi akuisisi pelanggan, dan strategi penjualan multikanal.",
          suitableIndustries: "E-commerce, Ritel Modern, Agency",
          jobTag: "marketing",
        },
        {
          title: "Business Development & Sales Executive",
          description: "Menegosiasikan kemitraan bisnis strategis, memimpin ekspansi pasar, dan mempresentasikan penawaran.",
          suitableIndustries: "B2B SaaS, Logistik, Retail Group",
          jobTag: "marketing",
        },
        {
          title: "Retail Store Leader Trainee",
          description: "Memimpin manajemen gerai ritel modern, pengelolaan tim lapangan, dan pencapaian target penjualan.",
          suitableIndustries: "Ritel Nasional, Waralaba F&B",
          jobTag: "customer-support",
        },
      ];
    } else if (top1 === "Realistic" || top2 === "Realistic") {
      archetype = "Hands-on Technical Builder";
      defaultJobTag = "software-dev";
      recommendedCareers = [
        {
          title: "Teknisi Jaringan & IT Infrastructure Support",
          description: "Instalasi dan pemeliharaan jaringan fiber optic, konfigurasi routing jaringan, dan troubleshooting perangkat.",
          suitableIndustries: "Telekomunikasi, ISP, Data Center",
          jobTag: "software-dev",
        },
        {
          title: "Junior Web & Mobile Developer",
          description: "Membangun antarmuka web interaktif, integrasi API, dan rekayasa perangkat lunak modern.",
          suitableIndustries: "Software House, Startup Teknologi",
          jobTag: "software-dev",
        },
        {
          title: "Warehouse Logistics & Automation Operator",
          description: "Mengoperasikan sistem manajemen pergudangan otomatis, pengawasan stok cerdas, dan kontrol mutasi fisik.",
          suitableIndustries: "Pusat Logistik, E-commerce Fulfillment Hub",
          jobTag: "data",
        },
      ];
    }

    const defaultPersona = {
      archetype,
      riasecCode,
      riasecBreakdown: {
        Realistic: Math.min(95, Math.max(20, scores.Realistic + 20)),
        Investigative: Math.min(95, Math.max(25, scores.Investigative + 25)),
        Artistic: Math.min(95, Math.max(20, scores.Artistic + 20)),
        Social: Math.min(95, Math.max(20, scores.Social + 20)),
        Enterprising: Math.min(95, Math.max(20, scores.Enterprising + 20)),
        Conventional: Math.min(95, Math.max(25, scores.Conventional + 25)),
      },
      topStrengths: [
        `Dominasi tipe ${top1} dengan daya penalaran yang kuat`,
        `Kecakapan orientasi kerja pada dimensi ${top2}`,
        "Kemampuan adaptasi cepat terhadap tantangan baru",
      ],
      recommendedCareers,
      recommendedScholarshipTrack:
        top1 === "Investigative" || top1 === "Realistic"
          ? "STEM & Teknik (Beasiswa BCA PPTI, Beasiswa APERTI BUMN, MEXT Jepang, BIM Kemendikbud)"
          : top1 === "Artistic"
          ? "Desain, Komunikasi & Humaniora (Beasiswa Unggulan, OSC Medcom, Stipendium Hungaricum)"
          : "Bisnis, Manajemen & Sosial (Beasiswa BI GenBI, Tanoto TELADAN, Djarum Plus, Sobat Bumi)",
      adviceForStudent: `Berdasarkan kombinasi Holland RIASEC (${riasecCode}), kamu memiliki potensi terbaik saat bekerja di lingkungan yang terstruktur dan selaras dengan minat alaminmu. Maksimalkan portofolio proyek mandiri dan pilih jalur beasiswa yang sesuai dengan bidang ${top1}.`,
    };

    const apiKey = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        assessment: defaultPersona,
      });
    }

    try {
      const prompt = `
Anda adalah Pakar Psikologi Pendidikan & Konsultan Karir Masa Depan SMA/SMK (NALARA Future Career Intelligence).
Analisis 12 jawaban asesmen Holland RIASEC siswa (${studentName}) dengan skor belajar (${masteryScore}/100):

Jawaban Asesmen Lengkap:
${JSON.stringify(answers, null, 2)}

Skor Awal RIASEC:
${JSON.stringify(scores, null, 2)}

Berikan output JSON komprehensif persis sesuai format berikut (tanpa markdown, hanya JSON murni valid):
{
  "archetype": "Nama Profil Karakter Profesional (contoh: Creative Systems Architect / Dynamic Strategic Communicator)",
  "riasecCode": "Kode Holland RIASEC 2 Tipe Teratas (contoh: Investigative - Artistic)",
  "riasecBreakdown": {
    "Realistic": 0-100,
    "Investigative": 0-100,
    "Artistic": 0-100,
    "Social": 0-100,
    "Enterprising": 0-100,
    "Conventional": 0-100
  },
  "topStrengths": [
    "Kekuatan Utama 1 (deskriptif dan mendalam)",
    "Kekuatan Utama 2",
    "Kekuatan Utama 3"
  ],
  "recommendedCareers": [
    {
      "title": "Nama Profesi 1",
      "description": "Deskripsi spesifik profesi",
      "suitableIndustries": "Industri terkait",
      "jobTag": "pilih salah satu dari: 'data', 'writing', 'customer-support', 'design', 'software-dev', 'marketing', 'finance', 'hr'"
    },
    {
      "title": "Nama Profesi 2",
      "description": "Deskripsi spesifik profesi",
      "suitableIndustries": "Industri terkait",
      "jobTag": "pilih salah satu dari: 'data', 'writing', 'customer-support', 'design', 'software-dev', 'marketing', 'finance', 'hr'"
    },
    {
      "title": "Nama Profesi 3",
      "description": "Deskripsi spesifik profesi",
      "suitableIndustries": "Industri terkait",
      "jobTag": "pilih salah satu dari: 'data', 'writing', 'customer-support', 'design', 'software-dev', 'marketing', 'finance', 'hr'"
    }
  ],
  "recommendedScholarshipTrack": "Rekomendasi rumpun jurusan kuliah & program beasiswa yang paling pas",
  "adviceForStudent": "Nasihat pengembangan karir taktis dan inspiratif bagi siswa (2-3 kalimat)."
}
`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);

        return NextResponse.json({
          success: true,
          assessment: {
            ...defaultPersona,
            ...parsed,
            riasecBreakdown: parsed.riasecBreakdown || defaultPersona.riasecBreakdown,
          },
        });
      }
    } catch (aiErr) {
      console.warn("Gemini career assess fallback:", aiErr);
    }

    return NextResponse.json({
      success: true,
      assessment: defaultPersona,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
