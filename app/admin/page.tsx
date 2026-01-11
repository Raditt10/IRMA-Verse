"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
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
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinedAt: string;
}

interface SystemAlert {
  id: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
  time: string;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect based on role
    if (status === "authenticated" && session?.user?.role) {
      if (session.user.role === "INSTRUCTOR") {
        router.push("/instructor");
      } else if (session.user.role === "USER") {
        router.push("/overview");
      }
    } else if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, session, router]);

  useEffect(() => {
    loadUser();
    setLoading(false);
  }, []);

  const loadUser = async () => {
    // Mock data - nanti akan diambil dari API
    setUser({
      id: "admin-1",
      full_name: "Administrator",
      email: "admin@irmaverse.local",
      avatar: "AD",
      role: "admin"
    });
  };

  // Mock statistics
  const stats = [
    {
      title: "Total Pengguna",
      value: "1,245",
      change: "+48",
      changeType: "increase" as const,
      icon: Users,
      color: "blue",
      description: "Pengguna aktif",
    },
    {
      title: "Total Instruktur",
      value: "42",
      change: "+3",
      changeType: "increase" as const,
      icon: Award,
      color: "green",
      description: "Instruktur terverifikasi",
    },
    {
      title: "Total Kajian",
      value: "156",
      change: "+12",
      changeType: "increase" as const,
      icon: BookOpen,
      color: "purple",
      description: "Kajian aktif",
    },
    {
      title: "Revenue",
      value: "Rp 24.5M",
      change: "+18%",
      changeType: "increase" as const,
      icon: DollarSign,
      color: "yellow",
      description: "Bulan ini",
    },
  ];

  const recentUsers: RecentUser[] = [
    {
      id: "1",
      name: "Ahmad Fauzi",
      email: "ahmad@example.com",
      role: "member",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
      joinedAt: "2 jam lalu",
    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      email: "siti@example.com",
      role: "member",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
      joinedAt: "5 jam lalu",
    },
    {
      id: "3",
      name: "Ustadz Muhammad",
      email: "muhammad@example.com",
      role: "instructor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Muhammad",
      joinedAt: "1 hari lalu",
    },
    {
      id: "4",
      name: "Fatimah Azzahra",
      email: "fatimah@example.com",
      role: "member",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatimah",
      joinedAt: "2 hari lalu",
    },
  ];

  const systemAlerts: SystemAlert[] = [
    {
      id: "1",
      type: "warning",
      message: "Server load tinggi - 85% CPU usage",
      time: "10 menit lalu",
    },
    {
      id: "2",
      type: "success",
      message: "Backup database berhasil",
      time: "2 jam lalu",
    },
    {
      id: "3",
      type: "info",
      message: "3 instruktur baru menunggu verifikasi",
      time: "5 jam lalu",
    },
    {
      id: "4",
      type: "error",
      message: "Payment gateway sempat down 5 menit",
      time: "1 hari lalu",
    },
  ];

  const quickActions = [
    {
      title: "Kelola Pengguna",
      description: "Lihat dan kelola pengguna",
      icon: Users,
      link: "/admin-dashboard/users",
      color: "blue",
    },
    {
      title: "Kelola Instruktur",
      description: "Verifikasi & kelola instruktur",
      icon: Award,
      link: "/admin-dashboard/instructors",
      color: "green",
      badge: 3,
    },
    {
      title: "Kelola Konten",
      description: "Moderasi kajian & materi",
      icon: BookOpen,
      link: "/admin-dashboard/content",
      color: "purple",
    },
    {
      title: "Pengaturan Sistem",
      description: "Konfigurasi platform",
      icon: Settings,
      link: "/admin-dashboard/settings",
      color: "gray",
    },
    {
      title: "Laporan & Analitik",
      description: "Statistik platform",
      icon: BarChart3,
      link: "/admin-dashboard/analytics",
      color: "orange",
    },
    {
      title: "Pengumuman",
      description: "Buat pengumuman baru",
      icon: Bell,
      link: "/admin-dashboard/announcements",
      color: "red",
    },
    {
      title: "Keuangan",
      description: "Transaksi & pembayaran",
      icon: DollarSign,
      link: "/admin-dashboard/finance",
      color: "yellow",
    },
    {
      title: "Keamanan",
      description: "Log & security",
      icon: Shield,
      link: "/admin-dashboard/security",
      color: "indigo",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100"
      style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}
    >
      <DashboardHeader />
      
      <div className="flex">
        <Sidebar />

        <main className="flex-1 px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Admin
              </h1>
              <p className="text-gray-600 mt-2">
                Kelola seluruh sistem IrmaVerse dari sini
              </p>
            </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className="flex items-center text-green-500 text-sm font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  className="p-5 hover:shadow-lg transition-all cursor-pointer group hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-lg bg-${action.color}-100 group-hover:bg-${action.color}-200 transition-colors`}>
                      <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                    </div>
                    {action.badge && (
                      <span className="px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </Card>
              ))}
            </div>
          </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
                  Pengguna Terbaru
                </h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Lihat Semua
                </button>
              </div>
              <div className="space-y-4">
                {recentUsers.map((recentUser) => (
                  <div
                    key={recentUser.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={recentUser.avatar}
                        alt={recentUser.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{recentUser.name}</p>
                        <p className="text-sm text-gray-600">{recentUser.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          recentUser.role === "instructor"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {recentUser.role}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{recentUser.joinedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* System Alerts */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-orange-600" />
                  Notifikasi Sistem
                </h2>
                <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  Lihat Semua
                </button>
              </div>
              <div className="space-y-3">
                {systemAlerts.map((alert) => {
                  const alertStyles = {
                    info: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "text-blue-500" },
                    warning: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", icon: "text-yellow-500" },
                    error: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "text-red-500" },
                    success: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: "text-green-500" },
                  };

                  const style = alertStyles[alert.type];

                  return (
                    <div
                      key={alert.id}
                      className={`p-4 ${style.bg} border ${style.border} rounded-lg`}
                    >
                      <div className="flex items-start space-x-3">
                        <AlertCircle className={`w-5 h-5 ${style.icon} shrink-0 mt-0.5`} />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${style.text}`}>
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* System Overview */}
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Database className="w-5 h-5 mr-2 text-purple-600" />
              Status Sistem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">Server Status</p>
                <p className="text-lg font-bold text-green-600">Online</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <Database className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">Database</p>
                <p className="text-lg font-bold text-blue-600">Healthy</p>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                <Activity className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">CPU Usage</p>
                <p className="text-lg font-bold text-yellow-600">65%</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">Uptime</p>
                <p className="text-lg font-bold text-purple-600">99.9%</p>
              </div>
            </div>
          </Card>
        </main>
      </div>

      <ChatbotButton />
    </div>
  );
};

export default AdminDashboard;
