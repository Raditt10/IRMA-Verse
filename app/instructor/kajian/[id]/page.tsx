"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, ArrowLeft, Tag, BookOpen, Edit, Trash2, UserPlus } from "lucide-react";

interface Kajian {
  id: string;
  title: string;
  pemateri: string;
  summary: string;
  fullDescription?: string;
  date: string;
  time: string;
  category: string;
  classLevel: string;
  participants: number;
  thumbnail?: string;
  registeredStudents?: { id: string; name: string; avatar: string }[];
}

const KajianDetail = () => {
  const [kajian, setKajian] = useState<Kajian | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const kajianId = params.id as string;

  useEffect(() => {
    loadUser();
    if (kajianId) {
      fetchKajianDetail();
    }
  }, [kajianId]);

  const loadUser = async () => {
    setUser({
      id: "instructor-123",
      full_name: "Ustadz Ahmad Zaki",
      email: "ahmad.zaki@irmaverse.local",
      avatar: "AZ"
    });
  };

  const fetchKajianDetail = async () => {
    try {
      // Mock data - sesuaikan dengan ID
      const mockKajian: Kajian[] = [
        {
          id: "1",
          title: "Kedudukan Akal dan Wahyu",
          pemateri: "Ustadz Ahmad Zaki",
          summary: "Pengantar akal & wahyu untuk santri pemula",
          fullDescription: "Dalam kajian ini, kita akan membahas secara mendalam tentang hubungan antara akal dan wahyu dalam Islam. Bagaimana akal manusia berperan dalam memahami wahyu Allah, serta batasan-batasan akal dalam mengkaji agama. Kajian ini sangat penting sebagai fondasi untuk memahami Islam secara menyeluruh dan komprehensif.",
          date: "2024-11-25",
          time: "13:00 - 15:00",
          category: "Program Wajib",
          classLevel: "Kelas 10",
          participants: 45,
          thumbnail: "https://picsum.photos/seed/kajian1/800/400",
          registeredStudents: [
            { id: "1", name: "Ahmad Fadhil", avatar: "AF" },
            { id: "2", name: "Siti Aisyah", avatar: "SA" },
            { id: "3", name: "Muhammad Rizki", avatar: "MR" },
            { id: "4", name: "Fatimah Zahra", avatar: "FZ" },
            { id: "5", name: "Ali Imran", avatar: "AI" }
          ]
        },
        {
          id: "2",
          title: "Fiqih Ibadah Sehari-hari",
          pemateri: "Ustadzah Fatimah",
          summary: "Fiqih dasar wudhu, shalat, dan thaharah",
          fullDescription: "Kajian praktis tentang fiqih ibadah yang dibutuhkan dalam kehidupan sehari-hari. Meliputi tata cara wudhu yang benar, syarat dan rukun shalat, serta berbagai masalah thaharah yang sering dijumpai. Peserta akan mendapatkan pemahaman yang jelas dan praktis untuk diterapkan dalam ibadah harian.",
          date: "2024-11-28",
          time: "14:00 - 16:00",
          category: "Program Wajib",
          classLevel: "Kelas 11",
          participants: 38,
          thumbnail: "https://picsum.photos/seed/kajian2/800/400",
          registeredStudents: [
            { id: "6", name: "Khadijah", avatar: "KH" },
            { id: "7", name: "Umar Faruq", avatar: "UF" },
            { id: "8", name: "Zainab", avatar: "ZN" }
          ]
        },
        {
          id: "3",
          title: "Tafsir Surah Al-Baqarah",
          pemateri: "Ustadz Muhammad Rizki",
          summary: "Pendalaman tafsir tematik Al-Baqarah",
          fullDescription: "Kajian mendalam tentang Surah Al-Baqarah, surah terpanjang dalam Al-Quran yang mengandung berbagai tema penting. Mulai dari kisah penciptaan, perintah Allah, hukum-hukum syariat, hingga hikmah di balik setiap ayat. Peserta akan mendapatkan pemahaman komprehensif tentang surah yang penuh berkah ini.",
          date: "2024-12-01",
          time: "15:00 - 17:00",
          category: "Program Next Level",
          classLevel: "Kelas 12",
          participants: 52,
          thumbnail: "https://picsum.photos/seed/kajian3/800/400",
          registeredStudents: [
            { id: "9", name: "Hamzah", avatar: "HZ" },
            { id: "10", name: "Maryam", avatar: "MY" }
          ]
        }
      ];

      const found = mockKajian.find(k => k.id === kajianId);
      setKajian(found || null);
    } catch (error) {
      console.error("Error loading kajian:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus kajian ini?")) {
      // Logic untuk delete
      alert("Kajian berhasil dihapus!");
      router.push("/instructor-dashboard/kajian");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Memuat detail kajian...</p>
      </div>
    );
  }

  if (!kajian) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Kajian tidak ditemukan</p>
          <Button onClick={() => router.push("/instructor-dashboard/kajian")}>
            Kembali ke Daftar Kajian
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.push("/instructor-dashboard/kajian")}
              className="inline-flex items-center gap-2 text-light-green-600 hover:text-light-green-700 mb-6 font-medium transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Kembali
            </button>

            {/* Header dengan Thumbnail */}
            <Card className="overflow-hidden mb-8">
              <div className="relative h-80 overflow-hidden bg-linear-to-br from-light-green-500 to-emerald-600">
                <img
                  src={kajian.thumbnail}
                  alt={kajian.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-4 py-2 rounded-full bg-light-green-500 text-white text-sm font-semibold shadow-lg">
                      {kajian.category}
                    </span>
                    <span className="px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-semibold shadow-lg">
                      {kajian.classLevel}
                    </span>
                  </div>
                  <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
                    {kajian.title}
                  </h1>
                  <p className="text-lg text-white/90 drop-shadow-md">
                    {kajian.summary}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Deskripsi Lengkap */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-light-green-600" />
                      Deskripsi Kajian
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {kajian.fullDescription || kajian.summary}
                    </p>
                  </CardContent>
                </Card>

                {/* Info Detail */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Detail Informasi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                        <Calendar className="h-5 w-5 text-light-green-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Tanggal</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {new Date(kajian.date).toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                        <Clock className="h-5 w-5 text-light-green-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Waktu</p>
                          <p className="text-sm font-semibold text-slate-800">{kajian.time}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                        <Users className="h-5 w-5 text-light-green-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Peserta Terdaftar</p>
                          <p className="text-sm font-semibold text-slate-800">{kajian.participants} santri</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                        <Tag className="h-5 w-5 text-light-green-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Pemateri</p>
                          <p className="text-sm font-semibold text-slate-800">{kajian.pemateri}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Daftar Peserta */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-light-green-600" />
                        Daftar Peserta ({kajian.registeredStudents?.length || 0})
                      </span>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/instructor-dashboard/kajian/invite?kajianId=${kajian.id}`)}
                        className="bg-light-green-500 hover:bg-light-green-600 text-white"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Undang Murid
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {kajian.registeredStudents && kajian.registeredStudents.length > 0 ? (
                      <div className="space-y-3">
                        {kajian.registeredStudents.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                          >
                            <div className="h-10 w-10 rounded-full bg-linear-to-br from-light-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                              {student.avatar}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                              <p className="text-xs text-slate-500">Santri</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-slate-500 py-8">
                        Belum ada peserta terdaftar
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Actions */}
              <div className="space-y-6">
                {/* Action Buttons */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Kelola Kajian</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full bg-light-green-500 hover:bg-light-green-600 text-white"
                      onClick={() => router.push(`/instructor-dashboard/kajian/edit/${kajian.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Kajian
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-light-green-500 text-light-green-600 hover:bg-light-green-50"
                      onClick={() => router.push(`/instructor-dashboard/kajian/invite?kajianId=${kajian.id}`)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Undang Peserta
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-red-500 text-red-600 hover:bg-red-50"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus Kajian
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="bg-linear-to-br from-light-green-50 to-emerald-50 border-light-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Statistik</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Total Peserta</span>
                      <span className="text-2xl font-bold text-light-green-600">{kajian.participants}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Status</span>
                      <span className="text-sm font-semibold text-emerald-600">Aktif</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Tingkat</span>
                      <span className="text-sm font-semibold text-slate-900">{kajian.classLevel}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatbotButton />
    </div>
  );
};

export default KajianDetail;
