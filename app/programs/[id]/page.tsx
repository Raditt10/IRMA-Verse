"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  Users, 
  ArrowLeft, 
  Phone, 
  Mail, 
  MessageCircle,
  BookOpen,
  Target,
  Award,
  CheckCircle2
} from "lucide-react";

// Import gambar WhatsApp
import Image from "next/image";

interface Program {
  id: string;
  title: string;
  description: string | null;
  duration: string;
  level: string;
  startDate?: string;
  endDate?: string;
  schedule?: string;
  location: string | null;
  instructor: string | null;
  quota: {
    filled: number;
    total: number;
  };
  status: "in-progress" | "done" | "upcoming";
  image?: string;
  syllabus?: string[];
  requirements?: string[];
  benefits?: string[];
}

const ProgramDetail = () => {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const programId = params.id as string;

  useEffect(() => {
    loadUser();
    if (programId) {
      fetchProgramDetail();
    }
  }, [programId]);

  const loadUser = async () => {
    setUser({
      id: "user-123",
      full_name: "Rafaditya Syahputra",
      email: "rafaditya@irmaverse.local",
      avatar: "RS"
    });
  };

  const fetchProgramDetail = async () => {
    try {
      const mockPrograms: Program[] = [
        {
          id: "1",
          title: "Kedudukan akal dan wahyu",
          description: "Program pelatihan komprehensif untuk memahami hubungan akal dan wahyu dalam Islam. Peserta akan mempelajari berbagai pendekatan filosofis dan teologis dalam memahami kedudukan akal sebagai instrumen pemahaman wahyu.",
          duration: "3 bulan",
          level: "Pemula",
          startDate: "2024-12-01",
          endDate: "2025-02-28",
          schedule: "Setiap Sabtu, 14:00 - 16:00 WIB",
          location: "Aula Utama IRMA",
          instructor: "Ustadz Dr. Ahmad Zaki, M.Ag",
          quota: {
            filled: 18,
            total: 30
          },
          status: "in-progress",
          image: "https://picsum.photos/seed/program1/1200/600",
          syllabus: [
            "Pengantar Epistemologi Islam",
            "Hakikat Akal dalam Perspektif Al-Quran",
            "Wahyu sebagai Sumber Pengetahuan",
            "Integrasi Akal dan Wahyu",
            "Studi Kasus: Isu Kontemporer"
          ],
          requirements: [
            "Telah mengikuti orientasi IRMA",
            "Memiliki pengetahuan dasar agama Islam",
            "Komitmen mengikuti seluruh sesi",
            "Membawa Al-Quran dan alat tulis"
          ],
          benefits: [
            "Pemahaman mendalam tentang epistemologi Islam",
            "Sertifikat resmi dari IRMA",
            "Modul pembelajaran digital",
            "Konsultasi dengan instruktur",
            "Akses ke perpustakaan digital"
          ]
        },
        {
          id: "2",
          title: "Kursus Bahasa Arab",
          description: "Program intensif pembelajaran Bahasa Arab dari tingkat dasar hingga mahir. Fokus pada kemampuan membaca, menulis, berbicara, dan memahami teks-teks Arab klasik maupun modern.",
          duration: "6 bulan",
          level: "Menengah",
          startDate: "2024-11-01",
          endDate: "2025-04-30",
          schedule: "Senin & Kamis, 18:30 - 20:00 WIB",
          location: "Ruang Multimedia",
          instructor: "Ustadz Muhammad Ali, Lc., M.A",
          quota: {
            filled: 22,
            total: 25
          },
          status: "done",
          image: "https://picsum.photos/seed/program2/1200/600",
          syllabus: [
            "Nahwu dan Shorof Dasar",
            "Mufrodat dan Muhadatsah",
            "Membaca Kitab Kuning",
            "Gramatika Arab Lanjutan",
            "Praktik Komunikasi Arab"
          ],
          requirements: [
            "Mampu membaca huruf hijaiyah",
            "Memiliki kamus Arab-Indonesia",
            "Mengerjakan tugas mingguan",
            "Minimal kehadiran 80%"
          ],
          benefits: [
            "Kemampuan membaca kitab kuning",
            "Sertifikat kemahiran Bahasa Arab",
            "Buku panduan dan modul",
            "Workshop dengan native speaker",
            "Rekomendasi studi lanjut"
          ]
        },
        {
          id: "3",
          title: "Training Imam & Khatib",
          description: "Pelatihan khusus untuk calon imam dan khatib masjid. Materi mencakup fiqih sholat, adab imam, teknik berkhutbah, hingga manajemen masjid.",
          duration: "2 bulan",
          level: "Lanjutan",
          startDate: "2024-12-15",
          endDate: "2025-02-15",
          schedule: "Sabtu & Minggu, 08:00 - 12:00 WIB",
          location: "Musholla Al-Ikhlas",
          instructor: "Ustadz Abdullah Hakim, M.Pd.I",
          quota: {
            filled: 15,
            total: 20
          },
          status: "in-progress",
          image: "https://picsum.photos/seed/program3/1200/600",
          syllabus: [
            "Fiqih Sholat Imam",
            "Adab dan Etika Imam",
            "Teknik Berkhutbah Efektif",
            "Menyusun Materi Khutbah",
            "Praktik Langsung"
          ],
          requirements: [
            "Hafal minimal 2 juz Al-Quran",
            "Lancar membaca Al-Quran",
            "Memiliki pengalaman mengajar",
            "Direkomendasikan DKM setempat"
          ],
          benefits: [
            "Sertifikat Imam & Khatib",
            "Buku panduan khutbah",
            "Database materi khutbah",
            "Networking dengan DKM",
            "Peluang penempatan"
          ]
        },
        {
          id: "4",
          title: "Tahsin & Tajwid Intensif",
          description: "Program intensif untuk memperbaiki bacaan Al-Quran sesuai kaidah tajwid yang benar. Dilengkapi dengan praktik langsung dan bimbingan individual.",
          duration: "4 bulan",
          level: "Pemula",
          startDate: "2024-10-01",
          endDate: "2025-01-31",
          schedule: "Selasa & Jumat, 16:00 - 17:30 WIB",
          location: "Ruang Tahfidz",
          instructor: "Ustadzah Fatimah Azzahra, S.Pd.I",
          quota: {
            filled: 28,
            total: 35
          },
          status: "done",
          image: "https://picsum.photos/seed/program4/1200/600",
          syllabus: [
            "Makharijul Huruf",
            "Hukum Nun Sukun dan Tanwin",
            "Hukum Mim Sukun",
            "Mad dan Macamnya",
            "Waqaf dan Ibtida"
          ],
          requirements: [
            "Memiliki mushaf Al-Quran",
            "Niat belajar dengan sungguh-sungguh",
            "Rajin berlatih mandiri",
            "Mengikuti ujian tahapan"
          ],
          benefits: [
            "Bacaan Al-Quran yang tartil",
            "Sertifikat Tahsin",
            "Buku tajwid bergambar",
            "Rekaman bacaan pribadi",
            "Evaluasi berkala"
          ]
        },
        {
          id: "5",
          title: "Manajemen Masjid Modern",
          description: "Program pelatihan manajemen masjid dengan pendekatan modern. Mencakup administrasi, keuangan, SDM, program kerja, hingga digitalisasi layanan masjid.",
          duration: "3 bulan",
          level: "Lanjutan",
          startDate: "2025-01-10",
          endDate: "2025-04-10",
          schedule: "Minggu, 09:00 - 12:00 WIB",
          location: "Gedung Serbaguna",
          instructor: "Ustadz Ir. Rifqi Maulana, M.M",
          quota: {
            filled: 12,
            total: 20
          },
          status: "upcoming",
          image: "https://picsum.photos/seed/program5/1200/600",
          syllabus: [
            "Visi Misi Masjid",
            "Manajemen Keuangan Masjid",
            "Pengelolaan SDM",
            "Program dan Kegiatan Masjid",
            "Digitalisasi Masjid"
          ],
          requirements: [
            "Pengurus atau calon pengurus masjid",
            "Memiliki laptop",
            "Pengalaman organisasi minimal 1 tahun",
            "Membawa data masjid"
          ],
          benefits: [
            "Sertifikat Manajemen Masjid",
            "Template administrasi masjid",
            "Software manajemen gratis",
            "Konsultasi berkelanjutan",
            "Networking pengurus masjid"
          ]
        },
        {
          id: "6",
          title: "Media Dakwah Digital",
          description: "Pelatihan dakwah di era digital menggunakan berbagai platform media sosial. Peserta akan belajar content creation, storytelling, editing, hingga strategi viral.",
          duration: "5 bulan",
          level: "Menengah",
          startDate: "2025-02-01",
          endDate: "2025-06-30",
          schedule: "Rabu, 19:00 - 21:00 WIB",
          location: "Studio Digital IRMA",
          instructor: "Ustadz Fauzan Hakim, S.Kom",
          quota: {
            filled: 20,
            total: 25
          },
          status: "upcoming",
          image: "https://picsum.photos/seed/program6/1200/600",
          syllabus: [
            "Prinsip Dakwah Digital",
            "Content Creation for Social Media",
            "Video Editing & Motion Graphics",
            "Copywriting Islami",
            "Strategi Viral & Engagement"
          ],
          requirements: [
            "Memiliki smartphone atau laptop",
            "Aktif di media sosial",
            "Kreatif dan inovatif",
            "Paham dasar Islam"
          ],
          benefits: [
            "Sertifikat Media Dakwah Digital",
            "Software editing premium",
            "Template konten siap pakai",
            "Channel dakwah sendiri",
            "Kolaborasi dengan da'i digital"
          ]
        }
      ];

      const foundProgram = mockPrograms.find(p => p.id === programId);
      setProgram(foundProgram || null);
    } catch (error) {
      console.error("Error loading program:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Program["status"]) => {
    const statusConfig: Record<Program["status"], { label: string; color: string }> = {
      "in-progress": { label: "Sedang Berlangsung", color: "bg-amber-100 text-amber-700 border-amber-200" },
      "done": { label: "Selesai", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
      "upcoming": { label: "Segera Dibuka", color: "bg-blue-100 text-blue-700 border-blue-200" }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Memuat...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
        <DashboardHeader />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center py-12">
                <p className="text-slate-500">Memuat detail program...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
        <DashboardHeader />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-5xl mx-auto">
              <button
                onClick={() => router.push('/programs')}
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </button>
              <Card className="text-center py-12">
                <CardContent className="space-y-4">
                  <p className="text-slate-600 text-lg">Program tidak ditemukan</p>
                  <p className="text-sm text-slate-500">ID: {programId}</p>
                  <button
                    onClick={() => router.push('/programs')}
                    className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    Lihat Semua Program
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <ChatbotButton />
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <button
              onClick={() => router.push('/programs')}
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Program
            </button>

            {/* Hero Image & Title */}
            <Card className="overflow-hidden">
              <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden bg-linear-to-br from-teal-500 to-cyan-600">
                <img
                  src={program.image || "https://picsum.photos/seed/program/1200/600"}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {getStatusBadge(program.status)}
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800">
                      {program.level}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                    {program.title}
                  </h1>
                  <p className="text-slate-100 text-sm sm:text-base max-w-2xl">
                    {program.description}
                  </p>
                </div>
              </div>
            </Card>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Program Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Info Cards */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Informasi Program</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                        <Clock className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Durasi</p>
                          <p className="text-sm font-semibold text-slate-800">{program.duration}</p>
                        </div>
                      </div>

                      {program.schedule && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                          <Calendar className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">Jadwal Kesepakatan peserta</p>
                            <p className="text-sm font-semibold text-slate-800">{program.schedule}</p>
                          </div>
                        </div>
                      )}

                      {program.location && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                          <MapPin className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">Lokasi</p>
                            <p className="text-sm font-semibold text-slate-800">{program.location}</p>
                          </div>
                        </div>
                      )}

                    </div>
                  </CardContent>
                </Card>

                {/* Syllabus */}
                {program.syllabus && program.syllabus.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        Silabus Program
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {program.syllabus.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-sm text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Requirements */}
                {program.requirements && program.requirements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        Persyaratan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {program.requirements.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50">
                            <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Benefits */}
                {program.benefits && program.benefits.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        Manfaat Program
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {program.benefits.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50">
                            {/* Ikon Award dihapus */}
                            <span className="text-sm text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Instructor Contact */}
              <div className="space-y-6">
                <Card className="overflow-hidden border-slate-200 shadow-sm">
                  <div className="p-8 text-center">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-teal-500 to-cyan-600 p-0.5 flex items-center justify-center">
                          <User className="h-12 w-12 text-white" />
                        </div>
                        {/* Ikon Award di avatar dihapus */}
                      </div>
                    </div>

                    {/* Name & Specialization */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-slate-800 mb-1">
                        {program.instructor || "-"}
                      </h3>
                      <p className="text-slate-600 text-sm font-semibold">
                        Instruktur Program
                      </p>
                    </div>

                    {/* Contact Section Title */}
                    <p className="text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
                      Hubungi instruktur untuk informasi lebih lanjut
                    </p>

                    {/* Contact Buttons */}
                    <div className="space-y-3">
                      <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors group"
                      >
                        <div className="p-2 bg-green-500 text-white rounded-lg shrink-0">
                          <Image
                            src="/WhatsApp.svg.webp"
                            alt="WhatsApp"
                            width={20}
                            height={20}
                            className="h-5 w-5 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs text-slate-600 font-medium">WhatsApp</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">+62 812-3456-7890</p>
                        </div>
                        <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </a>

                      <a
                        href="mailto:instruktur@irmaverse.local"
                        className="flex items-center gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors group"
                      >
                        <div className="p-2 bg-blue-500 text-white rounded-lg shrink-0">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs text-slate-600 font-medium">Email</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">instruktur@irmaverse.local</p>
                        </div>
                        <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </a>

                      <a
                        href="tel:+6281234567890"
                        className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors group"
                      >
                        <div className="p-2 bg-slate-600 text-white rounded-lg shrink-0">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs text-slate-600 font-medium">Telepon</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">+62 812-3456-7890</p>
                        </div>
                        <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </Card>

                {/* Registration CTA */}
                {program.status !== "done" && (
                  <Card className="overflow-hidden border-teal-200 bg-linear-to-br from-teal-50 to-cyan-50">
                    <CardContent className="p-6 text-center">
                      {/* Ikon Award di CTA dihapus */}
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Tertarik Bergabung?</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Daftar sekarang dan tingkatkan kemampuan Anda bersama kami!
                      </p>
                      <button className="w-full py-3 rounded-xl bg-linear-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300">
                        Konsultasikan dengan Instruktur
                      </button>
                      <p className="text-xs text-slate-500 mt-3">
                        Sekarang giliran kamu!
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Info Note */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-semibold text-amber-900 mb-1">Informasi</p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Hubungi instruktur untuk detail materi dan persiapan yang diperlukan sebelum mengikuti program.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
