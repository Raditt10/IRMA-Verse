import Link from "next/link";
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Settings,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserPlus,
  FileText,
  Shield,
  Activity,
  Database,
  Bell,
  DollarSign,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import DashboardHeader from "@/components/ui/Header";
import ChatbotButton from "@/components/ui/Chatbot";

export default function AdminDashboard() {
  // Static data for frontend preview only

  const stats = {
    totalUsers: 1245,
    totalInstructors: 42,
    activeCourses: 28,
    totalRevenue: 15400000,
  };

  const recentUsers = [
    {
      id: 1,
      name: "Ahmad Zaki",
      email: "ahmad@irma.com",
      role: "INSTRUCTOR",
      joinedAt: "2 jam lalu",
    },
    {
      id: 2,
      name: "Fatimah Zahra",
      email: "fatimah@irma.com",
      role: "USER",
      joinedAt: "5 jam lalu",
    },
    {
      id: 3,
      name: "Muhammad Rayan",
      email: "rayan@irma.com",
      role: "USER",
      joinedAt: "1 hari lalu",
    },
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "Storage mencapai 85% kapasitas",
      time: "2 jam lalu",
    },
    {
      id: 2,
      type: "info",
      message: "Backup sistem berhasil dilakukan",
      time: "6 jam lalu",
    },
    {
      id: 3,
      type: "success",
      message: "Semua sistem berjalan normal",
      time: "1 hari lalu",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <DashboardHeader />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-lg text-gray-600">
                Kelola sistem IRMA Verse dengan penuh kontrol dan transparansi
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
                    <span className="text-xs font-semibold text-blue-600 bg-blue-500/10 px-3 py-1 rounded-full">
                      +48
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm font-medium mb-1">
                    Total Pengguna
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.totalUsers.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,1)]">
                      <BookOpen className="h-6 w-6 text-slate-700" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                      +3
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm font-medium mb-1">
                    Total Instruktur
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.totalInstructors}
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,1)]">
                      <Calendar className="h-6 w-6 text-slate-700" />
                    </div>
                    <span className="text-xs font-semibold text-purple-600 bg-purple-500/10 px-3 py-1 rounded-full">
                      Aktif
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm font-medium mb-1">
                    Kajian Aktif
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.activeCourses}
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,1)]">
                      <TrendingUp className="h-6 w-6 text-slate-700" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                      +12%
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm font-medium mb-1">
                    Pendapatan Total
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    Rp {(stats.totalRevenue / 1000000).toLocaleString("id-ID")}M
                  </p>
                </div>
              </div>
            </div>

            {/* Management Actions */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="h-7 w-7 text-blue-600" />
                Management Sistem
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                  href="/admin/users"
                  className="p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-blue-100 group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Kelola Pengguna
                      </h3>
                      <p className="text-sm text-gray-600">
                        Atur hak akses dan data pengguna
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/instructors"
                  className="p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-emerald-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-emerald-100 group-hover:scale-110 transition-transform">
                      <BookOpen className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Kelola Instruktur
                      </h3>
                      <p className="text-sm text-gray-600">
                        Kelola dan verifikasi instruktur
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/courses"
                  className="p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-purple-100 group-hover:scale-110 transition-transform">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Kelola Kajian</h3>
                      <p className="text-sm text-gray-600">
                        Monitor dan kontrol semua kajian
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/reports"
                  className="p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-orange-100 group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Laporan Sistem
                      </h3>
                      <p className="text-sm text-gray-600">
                        Lihat analitik dan statistik
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/settings"
                  className="p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-indigo-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-indigo-100 group-hover:scale-110 transition-transform">
                      <Settings className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Pengaturan Sistem
                      </h3>
                      <p className="text-sm text-gray-600">
                        Konfigurasi sistem IRMA Verse
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/monitoring"
                  className="p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-red-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-red-100 group-hover:scale-110 transition-transform">
                      <Activity className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Monitoring Sistem
                      </h3>
                      <p className="text-sm text-gray-600">
                        Monitor performa dan status
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Users */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <UserPlus className="h-7 w-7 text-blue-600" />
                  Pengguna Terbaru
                </h2>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user.joinedAt}
                        </p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                        {user.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Alerts */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Bell className="h-7 w-7 text-orange-600" />
                  Alert Sistem
                </h2>
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-4 p-4 rounded-xl ${
                        alert.type === "warning"
                          ? "bg-yellow-50"
                          : alert.type === "success"
                            ? "bg-green-50"
                            : "bg-blue-50"
                      }`}
                    >
                      <div
                        className={`mt-1 ${
                          alert.type === "warning"
                            ? "text-yellow-600"
                            : alert.type === "success"
                              ? "text-green-600"
                              : "text-blue-600"
                        }`}
                      >
                        {alert.type === "warning" && (
                          <AlertCircle className="h-5 w-5" />
                        )}
                        {alert.type === "success" && (
                          <CheckCircle2 className="h-5 w-5" />
                        )}
                        {alert.type === "info" && <Clock className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ChatbotButton />
    </div>
  );
}
