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
  MessageCircle,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Video,
  FileText,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface StudentProgress {
  id: string;
  name: string;
  avatar: string;
  progress: number;
  lastActive: string;
}

interface UpcomingClass {
  id: string;
  title: string;
  time: string;
  date: string;
  studentsEnrolled: number;
  type: "online" | "offline";
}

const InstructorDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect based on role
    if (status === "authenticated" && session?.user?.role) {
      if (session.user.role === "ADMIN") {
        router.push("/admin");
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
      id: "instructor-1",
      full_name: "Ustadz Ahmad Zaki",
      email: "ahmad.zaki@irmaverse.local",
      avatar: "AZ",
      role: "instructor",
      specialization: "Ahli Akhlak & Tasawuf"
    });
  };

  // Mock statistics
  const stats = [
    {
      title: "Total Siswa",
      value: "245",
      change: "+12",
      changeType: "increase" as const,
      icon: Users,
      color: "blue",
    },
    {
      title: "Kajian Aktif",
      value: "8",
      change: "+2",
      changeType: "increase" as const,
      icon: BookOpen,
      color: "green",
    },
    {
      title: "Rating Rata-rata",
      value: "4.9",
      change: "+0.2",
      changeType: "increase" as const,
      icon: Star,
      color: "yellow",
    },
    {
      title: "Jam Mengajar",
      value: "124",
      change: "+18",
      changeType: "increase" as const,
      icon: Clock,
      color: "purple",
    },
  ];

  const upcomingClasses: UpcomingClass[] = [
    {
      id: "1",
      title: "Kajian Akhlak - Adab Bertetangga",
      time: "13:00 - 14:30",
      date: "Hari ini",
      studentsEnrolled: 45,
      type: "online",
    },
    {
      id: "2",
      title: "Tasawuf Dasar - Tazkiyatun Nafs",
      time: "15:00 - 16:30",
      date: "Besok",
      studentsEnrolled: 38,
      type: "offline",
    },
    {
      id: "3",
      title: "Diskusi Tematik - Akhlak dalam Bisnis",
      time: "10:00 - 11:30",
      date: "Kamis, 9 Jan",
      studentsEnrolled: 52,
      type: "online",
    },
  ];

  const recentStudents: StudentProgress[] = [
    {
      id: "1",
      name: "Ahmad Fauzi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
      progress: 85,
      lastActive: "2 jam lalu",
    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
      progress: 92,
      lastActive: "5 jam lalu",
    },
    {
      id: "3",
      name: "Muhammad Ikhsan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ikhsan",
      progress: 78,
      lastActive: "1 hari lalu",
    },
    {
      id: "4",
      name: "Fatimah Azzahra",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatimah",
      progress: 95,
      lastActive: "3 jam lalu",
    },
  ];

  const quickActions = [
    {
      title: "Buat Materi Baru",
      description: "Upload materi pembelajaran",
      icon: FileText,
      link: "/instructor-dashboard/materials/new",
      color: "blue",
    },
    {
      title: "Jadwal Mengajar",
      description: "Kelola jadwal kajian",
      icon: Calendar,
      link: "/instructor-dashboard/schedule",
      color: "purple",
    },
    {
      title: "Pesan Siswa",
      description: "12 pesan baru",
      icon: MessageCircle,
      link: "/instructor-dashboard/messages",
      color: "green",
      badge: 12,
    },
    {
      title: "Statistik Kelas",
      description: "Lihat performa siswa",
      icon: BarChart3,
      link: "/instructor-dashboard/analytics",
      color: "orange",
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
                 ٱلسَّلَامُ عَلَيْكُمْ, {user?.full_name}
              </h1>
              <p className="text-gray-600 mt-2">
                Semangat mengajar hari ini! Berikut ringkasan aktivitas Anda
              </p>
            </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500 font-medium">
                        {stat.change} bulan ini
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-full bg-${stat.color}-100`}>
                    <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all cursor-pointer group hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${action.color}-100 group-hover:bg-${action.color}-200 transition-colors`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                  </div>
                  {action.badge && (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                      {action.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Card>
            ))}
          </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Classes */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                  Jadwal Mengajar
                </h2>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Lihat Semua
                </button>
              </div>
              <div className="space-y-4">
                {upcomingClasses.map((class_item) => (
                  <div
                    key={class_item.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{class_item.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          class_item.type === "online"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {class_item.type === "online" ? "Online" : "Offline"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="mr-4">{class_item.time}</span>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{class_item.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{class_item.studentsEnrolled} siswa terdaftar</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Students Activity */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Aktivitas Siswa Terbaru
                </h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Lihat Semua
                </button>
              </div>
              <div className="space-y-4">
                {recentStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.lastActive}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {student.progress}%
                        </span>
                      </div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Performance Overview */}
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
              Ringkasan Performa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900 mb-1">32</p>
                <p className="text-sm text-gray-600">Total Kajian Diberikan</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900 mb-1">89%</p>
                <p className="text-sm text-gray-600">Tingkat Kepuasan Siswa</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900 mb-1">4.2</p>
                <p className="text-sm text-gray-600">Rata-rata Waktu Respons (jam)</p>
              </div>
            </div>
          </Card>
        </main>
      </div>
      
      <ChatbotButton />
    </div>
  );
};

export default InstructorDashboard;
