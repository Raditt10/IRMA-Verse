import Link from "next/link";
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  MessageCircle,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Video,
  FileText,
  Activity,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/ui/Sidebar";
import DashboardHeader from "@/components/ui/DashboardHeader";
import ChatbotButton from "@/components/ui/ChatbotButton";

export default function InstructorAcademy() {
  // Static data for frontend preview only

  const stats = {
    totalStudents: 156,
    activeCourses: 8,
    completedSessions: 45,
    averageRating: 4.8,
  };

  const upcomingClasses = [
    {
      id: 1,
      title: "Kajian Akhlak Islami",
      time: "Senin, 10:00 - 11:30",
      students: 28,
      room: "Ruang Masjid",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Tahsin Al-Quran",
      time: "Rabu, 14:00 - 15:30",
      students: 35,
      room: "Ruang Multimedia",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Fiqih Kontemporer",
      time: "Jumat, 13:00 - 14:30",
      students: 42,
      room: "Aula Utama",
      status: "pending",
    },
  ];

  const recentActivities = [
    { id: 1, title: "Materi baru ditambahkan ke Kajian Fiqih", time: "2 jam yang lalu" },
    { id: 2, title: "15 siswa baru mendaftar ke kelas Anda", time: "5 jam yang lalu" },
    { id: 3, title: "Sesi Kajian Akhlak selesai", time: "1 hari yang lalu" },
    { id: 4, title: "Penilaian quiz Tafsir tersedia", time: "2 hari yang lalu" },
  ];

  const coursesOverview = [
    { id: 1, title: "Kajian Akhlak Islami", students: 28, progress: 75, sessions: "8/12", rating: 4.9 },
    { id: 2, title: "Tahsin Al-Quran", students: 35, progress: 60, sessions: "6/10", rating: 4.8 },
    { id: 3, title: "Fiqih Kontemporer", students: 42, progress: 40, sessions: "4/10", rating: 4.7 },
  ];

  return (
    <div
      className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100"
      style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}
    >
      <DashboardHeader />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                 Academy 
                </h1>
              </div>
              <p className="text-lg text-gray-600">
                Kelola kajian dan bimbing siswa dengan penuh dedikasi
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,1)]">
                      <Users className="h-6 w-6 text-slate-700" />
                    </div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-500/10 px-3 py-1 rounded-full">+15</span>
                  </div>
                  <p className="text-slate-600 text-sm font-medium mb-1">Total Siswa</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.totalStudents}</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,1)]">
                      <BookOpen className="h-6 w-6 text-slate-700" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">Aktif</span>
                  </div>
                  <p className="text-slate-600 text-sm font-medium mb-1">Kajian Aktif</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.activeCourses}</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,1)]">
                      <CheckCircle2 className="h-6 w-6 text-slate-700" />
                    </div>
                    <span className="text-xs font-semibold text-purple-600 bg-purple-500/10 px-3 py-1 rounded-full">Selesai</span>
                  </div>
                  <p className="text-slate-600 text-sm font-medium mb-1">Sesi Selesai</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.completedSessions}</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,1)]">
                      <Star className="h-6 w-6 text-slate-700" />
                    </div>
                    <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full">Bagus</span>
                  </div>
                  <p className="text-slate-600 text-sm font-medium mb-1">Rating Rata-rata</p>
                  <p className="text-3xl font-bold text-slate-900">⭐ {stats.averageRating}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="h-7 w-7 text-emerald-600" />
                Aksi Cepat
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                  href="/instructor/kajian"
                  className="p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-emerald-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-emerald-100 group-hover:scale-110 transition-transform">
                      <BookOpen className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Kelola Kajian</h3>
                      <p className="text-sm text-gray-600">Atur dan kelola kajian Anda</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/schedule"
                  className="p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-blue-100 group-hover:scale-110 transition-transform">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Jadwal Mengajar</h3>
                      <p className="text-sm text-gray-600">Lihat jadwal mengajar</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/members"
                  className="p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-purple-100 group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Daftar Siswa</h3>
                      <p className="text-sm text-gray-600">Kelola data siswa</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/instructor-dashboard"
                  className="p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-orange-100 group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Laporan & Analitik</h3>
                      <p className="text-sm text-gray-600">Lihat performa mengajar</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Upcoming Classes */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="h-7 w-7 text-blue-600" />
                  Kelas Mendatang
                </h2>
                <div className="space-y-4">
                  {upcomingClasses.map((kls) => (
                    <div
                      key={kls.id}
                      className="p-5 rounded-xl bg-gradient-to-r from-slate-50 to-white border-2 border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900 text-lg">{kls.title}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          kls.status === "upcoming" 
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {kls.status === "upcoming" ? "Segera" : "Pending"}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{kls.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{kls.students} siswa</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          <span>{kls.room}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Activity className="h-7 w-7 text-purple-600" />
                  Aktivitas Terkini
                </h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-blue-100 flex-shrink-0 mt-1">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{activity.title}</h3>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Courses Overview */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="h-7 w-7 text-emerald-600" />
                Overview Kajian
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coursesOverview.map((course) => (
                  <div
                    key={course.id}
                    className="p-6 rounded-xl border-2 border-gray-100 hover:border-emerald-300 hover:shadow-lg transition-all"
                  >
                    <h3 className="font-bold text-gray-900 text-lg mb-4">{course.title}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Siswa</span>
                        <span className="font-bold text-gray-900">{course.students}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Sesi</span>
                        <span className="font-bold text-gray-900">{course.sessions}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Rating</span>
                        <span className="font-bold text-amber-600">⭐ {course.rating}</span>
                      </div>
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-bold text-gray-900">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-600 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/instructor/kajian/${course.id}`}
                      className="flex items-center justify-center gap-2 mt-4 text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                    >
                      Kelola Kajian <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <ChatbotButton />
    </div>
  );
}
