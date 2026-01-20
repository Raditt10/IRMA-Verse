"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, User, Clock, Users, ArrowLeft, Phone, Mail, MessageCircle, Award } from "lucide-react";

// Import gambar WhatsApp
import Image from "next/image";

interface Schedule {
  id: string;
  title: string;
  description: string | null;
  fullDescription?: string | null;
  date: string;
  time?: string;
  location: string | null;
  pemateri: string | null;
  pemateriAvatar?: string | null;
  pemateriSpecialization?: string | null;
  registeredCount?: number;
  status?: string;
  image?: string;
  maxParticipants?: number;
}

const ScheduleDetail = () => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const scheduleId = params.id as string;

  useEffect(() => {
    loadUser();
    if (scheduleId) {
      fetchScheduleDetail();
    }
  }, [scheduleId]);

  const loadUser = async () => {
    setUser({
      id: "user-123",
      full_name: "Rafaditya Syahputra",
      email: "rafaditya@irmaverse.local",
      avatar: "RS"
    });
  };

  const fetchScheduleDetail = async () => {
    try {
      const mockSchedules: Schedule[] = [
        {
          id: "1",
          title: "Semesta 1",
          description: "Belajar strategi dakwah di era digital",
          fullDescription: "Dalam era digital yang terus berkembang, dakwah Islam memerlukan strategi baru yang inovatif dan adaptif. Event ini menghadirkan pembahasan mendalam tentang bagaimana mengembangkan strategi dakwah yang efektif di platform digital, termasuk media sosial, website, podcast, dan berbagai tools digital lainnya. Peserta akan mempelajari teknik content marketing Islam, community engagement, dan cara membangun jama'ah online yang solid. Melalui kombinasi teori dan praktik langsung, peserta akan mendapatkan insight berharga tentang peluang dan tantangan dakwah di era digital serta solusi konkret untuk mengatasinya.",
          date: "2024-11-25",
          time: "13:00 WIB",
          location: "Aula Utama",
          pemateri: "Ustadz Ahmad Zaki",
          pemateriAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
          pemateriSpecialization: "Alumni SMKN 13 Bandung",
          registeredCount: 45,
          maxParticipants: 100,
          status: "Acara telah dilaksanakan",
          image: "https://picsum.photos/seed/event1/800/400"
        },
        {
          id: "2",
          title: "Semesta 2",
          description: "Persiapan menyambut bulan suci",
          fullDescription: "Bulan Ramadhan adalah bulan yang istimewa dengan berkah dan rahmat yang berlipat ganda. Acara ini dirancang khusus untuk mempersiapkan diri secara fisik, mental, dan spiritual dalam menyambut bulan yang mulia. Kami akan membahas berbagai aspek persiapan Ramadhan mulai dari niat ibadah, pemahaman fiqih puasa, adab berdoa, hingga manajemen waktu untuk memaksimalkan ibadah. Peserta juga akan mendapatkan tips praktis tentang jadwal mengaji, program menghafal, kegiatan keluarga, dan strategi berdakwah di bulan Ramadhan. Dengan bimbingan langsung dari ustadzah yang berpengalaman, diharapkan setiap peserta dapat mempersiapkan diri dengan baik untuk menjalani Ramadhan yang bermakna.",
          date: "2024-11-28",
          time: "14:00 WIB",
          location: "Musholla",
          pemateri: "Ustadzah Fatimah",
          pemateriAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatimah",
          pemateriSpecialization: "Alumni SMKN 13 Bandung",
          registeredCount: 67,
          maxParticipants: 100,
          status: "Segera hadir",
          image: "https://picsum.photos/seed/event2/800/400"
        },
        {
          id: "3",
          title: "Buka Puasa Bersama",
          description: "Meningkatkan kemampuan menghafal Al-Quran",
          fullDescription: "Tahfidz Al-Quran adalah pencapaian spiritual tertinggi yang dapat diraih seorang Muslim. Program intensif ini dirancang untuk membantu peserta mengembangkan kemampuan menghafal Al-Quran dengan metode yang telah terbukti efektif. Melalui kombinasi teknik mnemonic, pengulangan terstruktur, dan bimbingan individual dari instruktur bersertifikat, peserta akan belajar cara efisien menghafal dan mempertahankan hafalan. Program mencakup tips mengatasi kesulitan hafalan, manajemen waktu belajar, teknik review yang efektif, serta motivasi spiritual untuk menjaga konsistensi. Peserta juga akan mendapatkan akses ke tools pembelajaran digital dan komunitas tahfidz untuk saling mendukung dalam perjalanan menghafalkan firman Allah. Komitmen dan dedikasi adalah kunci sukses dalam program ini.",
          date: "2024-12-01",
          time: "15:00 WIB",
          location: "Ruang Tahfidz",
          pemateri: "Ustadz Muhammad Rizki",
          pemateriAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rizki",
          pemateriSpecialization: "Alumni SMKN 13 Bandung",
          registeredCount: 32,
          maxParticipants: 80,
          status: "Sedang berlangsung",
          image: "https://picsum.photos/seed/event3/800/400"
        },
        {
          id: "4",
          title: "Seminar Akhlak Pemuda",
          description: "Membangun karakter islami generasi muda",
          fullDescription: "Generasi muda adalah pilar masa depan umat Islam. Seminar ini menghadirkan diskusi mendalam tentang pembangunan karakter Islami yang kuat di tengah tantangan zaman modern. Peserta akan mempelajari nilai-nilai akhlak mulia menurut Al-Quran dan Hadis, serta aplikasinya dalam kehidupan sehari-hari di sekolah, keluarga, dan masyarakat. Melalui studi kasus nyata, sharing pengalaman mentor, dan workshop interaktif, peserta akan mendapatkan pemahaman holistik tentang bagaimana membangun kepribadian yang santun, bertanggung jawab, dan berakhlak mulia. Topik khusus mencakup manajemen emosi, pergaulan sehat, etika digital, kepemimpinan bagi pemuda, dan strategi menjadi teladan bagi sekitar. Seminar ini sangat cocok bagi pelajar dan mahasiswa yang ingin mengembangkan karakter Islami yang autentik dan relevan dengan konteks kehidupan mereka.",
          date: "2024-12-05",
          time: "09:00 WIB",
          location: "Aula Besar",
          pemateri: "Ustadz Abdullah Hakim",
          pemateriAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abdullah",
          pemateriSpecialization: "Alumni SMKN 13 Bandung",
          registeredCount: 89,
          maxParticipants: 150,
          status: "Acara telah dilaksanakan",
          image: "https://picsum.photos/seed/event4/800/400"
        },
        {
          id: "5",
          title: "Mentoring Calon Hafidz",
          description: "Program intensif bimbingan hafalan Al-Quran personal",
          fullDescription: "Program mentoring khusus ini dirancang untuk calon hafidz yang ingin menyelesaikan hafalan Al-Quran dengan bimbingan intensif dari hafidz berpengalaman. Setiap peserta akan mendapatkan mentor personal yang akan membimbing proses pembelajaran, memantau perkembangan, dan memberikan motivasi spiritual. Program mencakup teknik muroja'ah yang efisien, manajemen waktu belajar, strategi mengatasi lupa, hingga persiapan ujian tahfidz. Dengan pendekatan personal dan fleksibel, peserta dapat belajar sesuai kecepatan mereka sendiri sambil tetap mendapat dukungan penuh dari mentor.",
          date: "2024-12-08",
          time: "16:00 WIB",
          location: "Ruang Belajar Privat",
          pemateri: "Ustadz Qur'ani Ibrahim",
          pemateriAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Qurani",
          registeredCount: 20,
          maxParticipants: 25,
          status: "Segera hadir",
          image: "https://picsum.photos/seed/event5/800/400"
        },
        {
          id: "6",
          title: "Workshop Parenting Islami",
          description: "Memahami pola asuh anak menurut perspektif Islam",
          fullDescription: "Orang tua memiliki peran fundamental dalam membentuk kepribadian dan akhlak anak. Workshop ini menghadirkan pembahasan mendalam tentang prinsip-prinsip parenting Islami berdasarkan Al-Quran dan Hadis. Peserta akan belajar tentang strategi mendidik anak dengan kasih sayang, penetapan batas yang jelas namun penuh empati, mengatasi tantangan perkembangan anak di setiap tahap, hingga membangun komunikasi yang sehat dalam keluarga. Melalui sesi diskusi interaktif, sharing pengalaman sesama orang tua, dan konsultasi dengan ahli, peserta akan mendapatkan tools praktis untuk menjalankan peran sebagai orang tua dengan lebih efektif dan Islami.",
          date: "2024-12-12",
          time: "10:00 WIB",
          location: "Aula Keluarga",
          pemateri: "Ustadzah Dr. Nurfitrianti, M.Psi",
          pemateriAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nurfitrianti",
          registeredCount: 54,
          maxParticipants: 80,
          status: "Segera hadir",
          image: "https://picsum.photos/seed/event6/800/400"
        },
        {
          id: "7",
          title: "Fikih Muamalah Praktis",
          description: "Pemahaman hukum Islam dalam transaksi bisnis modern",
          fullDescription: "Dalam era ekonomi digital, pemahaman tentang fikih muamalah menjadi semakin penting. Program ini menghadirkan pembahasan praktis tentang bagaimana menjalankan transaksi bisnis sesuai dengan hukum Islam dalam berbagai konteks modern. Topik mencakup riba dan cara menghindarinya, kontrak bisnis yang halal, asuransi Islami, fintech Syariah, e-commerce Islami, hingga etika berbisnis menurut Islam. Peserta akan belajar melalui studi kasus nyata, analisis produk finansial modern, dan diskusi interaktif dengan praktisi bisnis Islami. Program ini ideal untuk pengusaha, profesional di bidang keuangan, dan siapa saja yang ingin menjalankan transaksi bisnis dengan hati yang tenang.",
          date: "2024-12-15",
          time: "14:00 WIB",
          location: "Aula Utama",
          pemateri: "Ustadz Dr. Didi Junaedi, M.A",
          pemateriAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Didi",
          registeredCount: 38,
          maxParticipants: 60,
          status: "Segera hadir",
          image: "https://picsum.photos/seed/event7/800/400"
        },
        {
          id: "8",
          title: "Qira'at Al-Quran 7 Metode",
          description: "Pembelajaran variasi bacaan Al-Quran dari berbagai qira'at",
          fullDescription: "Al-Quran dapat dibaca dengan berbagai qira'at yang semuanya sahih dan diterima. Program ini memberikan pengenalan mendalam tentang tujuh qira'at utama (Qira'atul 'Asharah) beserta perbedaan-perbedaannya. Peserta akan belajar sejarah qira'at, karakteristik masing-masing metode, praktik langsung membaca dengan qira'at berbeda, dan pemahaman tentang kaidah-kaidah yang membedakan setiap qira'at. Dengan pendekatan yang terstruktur dan bimbingan instruktur bersertifikat, peserta akan memperluas wawasan tentang kekayaan bacaan Al-Quran yang telah diwariskan sejak zaman Rasulullah.",
          date: "2024-12-18",
          time: "17:00 WIB",
          location: "Ruang Tajwid Premium",
          pemateri: "Qari Mahmud Al-Banawi",
          pemateriAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mahmud",
          registeredCount: 25,
          maxParticipants: 40,
          status: "Segera hadir",
          image: "https://picsum.photos/seed/event8/800/400"
        }
      ];

      const foundSchedule = mockSchedules.find(s => s.id === scheduleId);
      setSchedule(foundSchedule || null);
    } catch (error) {
      console.error("Error loading schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, string> = {
      "Segera hadir": "bg-emerald-100 text-emerald-700 border-emerald-200",
      "Sedang berlangsung": "bg-blue-100 text-blue-700 border-blue-200",
      "Acara telah dilaksanakan": "bg-slate-100 text-slate-600 border-slate-200"
    };

    const color = statusConfig[status] || statusConfig["Segera hadir"];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>
        {status}
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
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
        <DashboardHeader user={user} />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center py-12">
                <p className="text-slate-500">Memuat detail event...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
        <DashboardHeader user={user} />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-5xl mx-auto">
              <button
                onClick={() => router.push('/schedule')}
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </button>
              <Card className="text-center py-12">
                <CardContent className="space-y-4">
                  <p className="text-slate-600 text-lg">Event tidak ditemukan</p>
                  <p className="text-sm text-slate-500">ID: {scheduleId}</p>
                  <button
                    onClick={() => router.push('/schedule')}
                    className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    Lihat Semua Event
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
      <DashboardHeader user={user} />
      <div className="flex">
        <Sidebar />
        <ChatbotButton />
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <button
              onClick={() => router.push('/schedule')}
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Jadwal
            </button>

            {/* Hero Image & Title */}
            <Card className="overflow-hidden">
              <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden bg-linear-to-br from-teal-500 to-cyan-600">
                <img
                  src={schedule.image || "https://picsum.photos/seed/event1/1200/600"}
                  alt={schedule.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                  <div className="mb-3">
                    {getStatusBadge(schedule.status || "")}
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                    {schedule.title}
                  </h1>
                  <p className="text-slate-100 text-sm sm:text-base max-w-2xl">
                    {schedule.description}
                  </p>
                </div>
              </div>
            </Card>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Event Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Detail Event</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                        <Calendar className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Tanggal</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {new Date(schedule.date).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      {schedule.time && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                          <Clock className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">Waktu</p>
                            <p className="text-sm font-semibold text-slate-800">{schedule.time}</p>
                          </div>
                        </div>
                      )}

                      {schedule.location && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                          <MapPin className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">Lokasi</p>
                            <p className="text-sm font-semibold text-slate-800">{schedule.location}</p>
                          </div>
                        </div>
                      )}

                      {schedule.registeredCount !== undefined && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                          <Users className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">Pendaftar</p>
                            <p className="text-sm font-semibold text-slate-800">
                              {schedule.registeredCount}
                              {schedule.maxParticipants && ` / ${schedule.maxParticipants}`}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Description Section */}
                {schedule.fullDescription && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">Tentang Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 leading-relaxed text-base">
                        {schedule.fullDescription}
                      </p>
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
                        {schedule.pemateriAvatar ? (
                          <img
                            src={schedule.pemateriAvatar}
                            alt={schedule.pemateri || "Pemateri"}
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-teal-100 shadow-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-linear-to-br from-teal-500 to-cyan-600 p-0.5 flex items-center justify-center">
                            <User className="h-12 w-12 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name & Specialization */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-slate-800 mb-1">
                        {schedule.pemateri || "-"}
                      </h3>
                      <p className="text-slate-600 text-sm font-semibold">
                        {schedule.pemateriSpecialization || "Instruktur"}
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

                {/* Info Note */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-semibold text-amber-900 mb-1">Informasi Penting!</p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Hubungi instruktur untuk detail materi dan persiapan yang diperlukan.
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

export default ScheduleDetail;
