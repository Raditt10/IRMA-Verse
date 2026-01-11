import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Bell,
  Award,
  Trophy,
  MessageCircle,
  TrendingUp,
  Users,
  BarChart3,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  Flame,
  Star,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
  MessageSquare,
  Newspaper,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "@/components/ui/Sidebar";
import DashboardHeader from "@/components/ui/DashboardHeader";
import ChatbotButton from "@/components/ui/ChatbotButton";

const Dashboard = async () => {
  // Get session from server side
  const session = await auth();
  
  // Redirect to auth if not authenticated
  if (!session?.user) {
    redirect("/auth");
  }

  // Get user data from database
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id as string,
    },
    select: {
      id: true,
      name: true,
      email: true,
      notelp: true,
      address: true,
      bio: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/auth");
  }

  // Redirect based on role - dashboard is for all users but let's keep role-specific pages
  if (user.role === "INSTRUCTOR") {
    redirect("/instructor");
  } else if (user.role === "USER") {
    redirect("/overview");
  } else if (user.role === "ADMIN") {
    redirect("/admin");
  }

  const stats = {
    totalPoints: 2450,
    totalBadges: 8,
    totalQuizzes: 24,
    averageScore: 87,
    streak: 7,
  };

  const quickActions = [
    {
      title: "Pengumuman umum",
      description: "Lihat informasi terbaru",
      icon: Bell,
      link: "/announcements",
      color: "blue",
      count: 3,
    },
    {
      title: "Jadwal Kajian Kamu",
      description: "Cek jadwal minggu ini",
      icon: Calendar,
      link: "/schedule",
      color: "purple",
    },
    {
      title: "Materi Kajian",
      description: "Akses materi pembelajaran",
      icon: BookOpen,
      link: "/materials",
      color: "green",
    },
    {
      title: "Quiz & Kuis",
      description: "Uji pemahaman Anda",
      icon: Trophy,
      link: "/quiz",
      color: "amber",
      count: 2,
    },
    {
      title: "Diskusi IRMA",
      description: "Bergabung dalam diskusi",
      icon: MessageCircle,
      link: "/chat-rooms",
      color: "indigo",
    },
    {
      title: "Peringkat Pengguna",
      description: "Lihat peringkat peserta",
      icon: TrendingUp,
      link: "/leaderboard",
      color: "red",
    },
  ];

  const recentActivities = [
    { badge: "🎯", name: "Selesai Quiz Dasar Islam", date: "Hari ini" },
    { badge: "⭐", name: "Mendapat Badge Konsisten", date: "Kemarin" },
    { badge: "🏆", name: "Naik ke Level 5", date: "2 hari lalu" },
  ];

  const colorMap = {
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    green: "from-green-500 to-emerald-500",
    amber: "from-amber-500 to-orange-500",
    indigo: "from-indigo-500 to-blue-500",
    red: "from-red-500 to-pink-500",
  };

  const colorMapBg = {
    blue: "bg-blue-500/20 hover:bg-blue-500/30",
    purple: "bg-purple-500/20 hover:bg-purple-500/30",
    green: "bg-green-500/20 hover:bg-green-500/30",
    amber: "bg-amber-500/20 hover:bg-amber-500/30",
    indigo: "bg-indigo-500/20 hover:bg-indigo-500/30",
    red: "bg-red-500/20 hover:bg-red-500/30",
  };

  const colorMapText = {
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    green: "text-green-600 dark:text-green-400",
    amber: "text-amber-600 dark:text-amber-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
    red: "text-red-600 dark:text-red-400",
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      {/* Header */}
      <DashboardHeader user={user} />

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 px-6 lg:px-8 py-12">
          <div className="mb-12">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">          
              ٱلسَّلَامُ عَلَيْكُمْ, {user.name}
              </h1>
              <p className="text-lg text-slate-600">
                Tingkatkan pengetahuan dan raih prestasi bersama IRMA Verse
              </p>
            </div>

            {/* Stats Grid - 4 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Points Stat */}
            <div className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl">
              <div className="absolute inset-0 bg-linear-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/5 group-hover:to-orange-500/5 transition-colors duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,1)]">
                    <Trophy className="h-6 w-6 text-slate-700" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">+240</span>
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">Total Poin</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalPoints.toLocaleString('id-ID')}</p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500">Poin bulan ini</p>
                </div>
              </div>
            </div>

            {/* Badges Stat */}
            <div className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-colors duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,1)]">
                    <Award className="h-6 w-6 text-slate-700" />
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-500/10 px-3 py-1 rounded-full">Lengkap</span>
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">Badge Terkumpul</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalBadges}</p>
                <div className="mt-4 pt-4 border-t border-slate-200 flex gap-1">
                  {[...Array(stats.totalBadges)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* Quiz Stat */}
            <div className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl">
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-colors duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,1)]">
                    <BarChart3 className="h-6 w-6 text-slate-700" />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-500/10 px-3 py-1 rounded-full">+3</span>
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">Quiz Dikerjakan</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalQuizzes}</p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500">Rata-rata {stats.averageScore}%</p>
                </div>
              </div>
            </div>

            {/* Streak Stat */}
            <div className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl">
              <div className="absolute inset-0 bg-linear-to-br from-red-500/0 to-pink-500/0 group-hover:from-red-500/5 group-hover:to-pink-500/5 transition-colors duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,1)]">
                    <Flame className="h-6 w-6 text-slate-700" />
                  </div>
                  <span className="text-xs font-semibold text-red-600 bg-red-500/10 px-3 py-1 rounded-full">Aktif</span>
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">Konsistensi</p>
                <p className="text-3xl font-bold text-slate-900">{stats.streak} Hari</p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500">Jangan putus! 💪</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions - 2 columns */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,1)]">
                  <Sparkles className="h-5 w-5 text-slate-700" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Akses Cepat</h2>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;

                  return (
                    <Link
                      key={index}
                      href={action.link}
                      className="group relative flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.9)] group-hover:shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,1)] transition-all duration-300">
                          <IconComponent className="h-7 w-7 text-slate-700 group-hover:text-slate-900 transition-colors duration-300" />
                        </div>
                        {action.count && (
                          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                            {action.count}
                          </span>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-900 leading-tight">
                          {action.title}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Berita IRMA Section */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,1)]">
                  <Newspaper className="h-5 w-5 text-slate-700" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Liputan Berita IRMA Singkat</h2>
              </div>
              <div className="overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex gap-4 min-w-max">
                  {[
                    { id: 1, title: "Lorem Ipsum Dolor Sit Amet", date: "2 Hari Lalu", category: "Event", image: "https://picsum.photos/500/300?random=1" },
                    { id: 2, title: "Lorem Ipsum Dolor Sit Amet", date: "1 Minggu Lalu", category: "Pencapaian", image: "https://picsum.photos/500/300?random=2" },
                    { id: 3, title: "Lorem Ipsum Dolor Sit Amet", date: "Hari Ini", category: "Tips", image: "https://picsum.photos/500/300?random=3" },
                  ].map((news) => (
                    <div
                      key={news.id}
                      className="shrink-0 w-64 rounded-xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    >
                      <img src={news.image} alt={news.title} className="h-32 w-full object-cover bg-slate-200" />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                            {news.category}
                          </span>
                          <span className="text-xs text-slate-500">{news.date}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-2">
                          {news.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chatbot AI Card */}
              <div className="rounded-2xl border border-teal-200 bg-linear-to-br from-teal-50 to-cyan-50 p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0">
                    <img src="/ci irma.jpg" alt="Ci Irma" className="h-12 w-12 object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Chatbot AI Ci Irma</h3>
                    <p className="text-sm text-slate-600">Tanya jawab seputar kegiatan IRMA, jadwal kajian, dan informasi lainnya dengan AI assistant</p>
                  </div>
                </div>
                <button className="mt-4 px-6 py-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm transition-colors flex items-center gap-2">
                  Mulai Chat
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>

              {/* Konsultasi Instruktur Card */}
              <div className="rounded-2xl border border-teal-200 bg-linear-to-br from-teal-50 to-cyan-50 p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0">
                    <img src="/instruktur.jpg" alt="Instruktur" className="h-12 w-12 object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Konsultasi Instruktur</h3>
                    <p className="text-sm text-slate-600">Hubungi langsung instruktur pilihan untuk bimbingan spiritual dan pendampingan belajar</p>
                  </div>
                </div>
                <button className="mt-4 px-6 py-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm transition-colors flex items-center gap-2">
                  Mulai Konsultasi
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Card */}
            <div className="relative overflow-hidden rounded-2xl p-8 bg-white border border-slate-200">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-500 to-cyan-500 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <p className="text-slate-600 text-sm font-medium mb-3">Tingkat Pencapaian</p>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-6 py-3 rounded-2xl bg-linear-to-br from-emerald-400 via-teal-400 to-cyan-500 shadow-[3px_3px_8px_rgba(20,184,166,0.4),-2px_-2px_6px_rgba(255,255,255,0.9)] border-2 border-white">
                    <h3 className="text-4xl font-black text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)] tracking-wide" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>Level 5</h3>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-linear-to-r from-amber-400 to-amber-500 shadow-[2px_2px_6px_rgba(251,191,36,0.3),-1px_-1px_4px_rgba(255,255,255,0.8)] border border-amber-300">
                    <span className="text-sm font-bold text-white drop-shadow-md" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>Mashaallah</span>
                  </div>
                </div>
                
                <p className="text-emerald-600 text-sm font-semibold mb-6">Pembelajar Aktif</p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-600 font-medium">Progres Level</span>
                      <span className="text-xs text-slate-900 font-bold">75%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200 overflow-hidden shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.7)]">
                      <div className="h-full w-3/4 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 shadow-[0_2px_4px_rgba(16,185,129,0.3)] relative">
                        <div className="absolute inset-0 bg-linear-to-t from-transparent to-white/20 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-400 mb-1">42</div>
                      <p className="text-xs text-slate-500">Poin Bulan Ini</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400 mb-1">8</div>
                      <p className="text-xs text-slate-500">Badge Baru</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">7</div>
                      <p className="text-xs text-slate-500">Hari Konsisten</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Floating Chatbot Button */}
      <ChatbotButton />
    </div>
  );
};

export default Dashboard;