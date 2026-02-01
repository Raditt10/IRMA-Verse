"use client";
import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Bell,
  Award,
  Trophy,
  MessageCircle,
  TrendingUp,
  BarChart3,
  Sparkles,
  Flame,
  Star,
  MessageSquare,
  Newspaper,
  ArrowRight,
  Zap,
} from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import DashboardHeader from "@/components/ui/DashboardHeader";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// --- KOMPONEN LEVEL CARD YANG DIPERBARUI ---
const LevelCardContent = () => (
  <div className="bg-gradient-to-r from-teal-400 to-cyan-400 p-5 rounded-[2rem] text-white shadow-[0_6px_0_0_#0e7490] border-2 border-teal-600 relative overflow-hidden group transition-transform hover:scale-[1.02]">
    {/* Dekorasi background */}
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-sm" />
    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8 blur-sm" />
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div>
        <span className="font-black text-2xl tracking-tight drop-shadow-md block">LEVEL 5</span>
        <span className="text-[10px] font-bold text-teal-100 uppercase tracking-widest bg-teal-600/30 px-2 py-0.5 rounded-md">Explorer</span>
      </div>

      {/* --- BADGE MASHAALLAH SESUAI GAMBAR --- */}
      <div className="bg-amber-500 text-white px-5 py-1.5 rounded-full text-sm font-black shadow-[0_4px_0_0_#d97706] border-2 border-white transform rotate-3 flex items-center justify-center">
        Mashaallah
      </div>
    </div>

    {/* Progress Bar Kartun */}
    <div className="relative mt-2">
      <div className="flex justify-between text-[10px] font-bold mb-1 px-1 opacity-90">
        <span>2450 XP</span>
        <span>3000 XP</span>
      </div>
      <div className="h-5 bg-black/20 rounded-full overflow-hidden border-2 border-teal-600/30 p-[2px]">
        <div className="h-full bg-yellow-400 w-3/4 rounded-full shadow-[0_2px_0_0_#ca8a04] relative relative">
            {/* Kilau pada progress bar */}
            <div className="absolute top-0 right-2 w-2 h-full bg-white/40 rounded-full skew-x-[-20deg]" />
            <div className="absolute top-0 right-5 w-1 h-full bg-white/30 rounded-full skew-x-[-20deg]" />
        </div>
      </div>
    </div>
    
    <p className="text-[11px] mt-3 font-bold text-teal-50 text-center bg-teal-700/20 py-1.5 rounded-xl border border-teal-300/20">
       Semangat! 550 XP lagi naik level
    </p>
  </div>
);

const Dashboard = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    }
  });
  const router = useRouter();

  // Redirect non-user roles away from overview
  React.useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "instruktur") {
        router.replace("/academy");
      } else if (session?.user?.role === "admin") {
        router.replace("/admin");
      }
    }
  }, [status, session, router]);
    
  const stats = {
    totalPoints: 2450,
    totalBadges: 8,
    totalQuizzes: 24,
    averageScore: 87,
    streak: 7,
  };

  const quickActions = [
    { title: "Pengumuman", icon: Bell, link: "/announcements" },
    { title: "Jadwal", icon: Calendar, link: "/materials" },
    { title: "Materi", icon: BookOpen, link: "/archivesch" },
    { title: "Kuis", icon: Trophy, link: "/quiz" },
    { title: "Diskusi", icon: MessageCircle, link: "/chat-rooms" },
    { title: "Peringkat", icon: TrendingUp, link: "/leaderboard" },
  ];

  const newsItems = [
    {
      id: 1,
      title: "Kegiatan Ramadhan 1446H Dimulai!",
      category: "Event",
      date: "12 Maret 2025",
      imageId: "10"
    },
    {
      id: 2,
      title: "Selamat Kepada Juara Lomba Adzan",
      category: "Prestasi",
      date: "10 Maret 2025",
      imageId: "15"
    }
  ];

  if (status === "loading") return null;
  if (session?.user?.role !== "user") return null;

  return (
    // Background hangat (Warm White)
    <div className="min-h-screen bg-[#FDFBF7]" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="w-full md:w-auto">
              <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">
                ٱلسَّلَامُ عَلَيْكُمْ, <span className="text-teal-500 underline decoration-wavy decoration-2 underline-offset-4">{session?.user?.name}</span>
              </h1>
              <p className="text-slate-500 mt-2 font-bold text-lg">Siap menambah ilmu hari ini?</p>
              
              {/* --- [MOBILE] CARD LEVEL --- */}
              <div className="mt-6 xl:hidden block w-full">
                <LevelCardContent />
              </div>
            </div>

            {/* Date Badge - Cartoon Style */}
            <div className="hidden md:flex items-center gap-2 bg-white px-5 py-3 rounded-full border-2 border-slate-200 shadow-[0_4px_0_0_#e2e8f0] transform hover:-translate-y-1 transition-transform">
              <Calendar className="w-5 h-5 text-teal-600" strokeWidth={3} />
              <span className="text-sm font-black text-slate-700">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* MAIN GRID LAYOUT */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
            {/* LEFT COLUMN */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Stat 1 */}
                <div className="bg-white p-5 rounded-[2rem] border-2 border-slate-100 shadow-[0_4px_0_0_#f1f5f9] hover:shadow-[0_4px_0_0_#cbd5e1] hover:border-slate-300 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-3 bg-amber-50 border-2 border-amber-100 rounded-2xl group-hover:scale-110 transition-transform">
                      <Award className="w-7 h-7 text-amber-500" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-black px-3 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200">Total</span>
                  </div>
                  <div className="text-3xl font-black text-slate-800 mb-1">{stats.totalBadges}</div>
                  <div className="text-sm text-slate-500 font-bold">Badges Dikoleksi</div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white p-5 rounded-[2rem] border-2 border-slate-100 shadow-[0_4px_0_0_#f1f5f9] hover:shadow-[0_4px_0_0_#cbd5e1] hover:border-slate-300 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-3 bg-emerald-50 border-2 border-emerald-100 rounded-2xl group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-7 h-7 text-emerald-500" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-black px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full border border-emerald-200">{stats.averageScore}%</span>
                  </div>
                  <div className="text-3xl font-black text-slate-800 mb-1">{stats.totalQuizzes}</div>
                  <div className="text-sm text-slate-500 font-bold">Kuis Selesai</div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white p-5 rounded-[2rem] border-2 border-slate-100 shadow-[0_4px_0_0_#f1f5f9] hover:shadow-[0_4px_0_0_#cbd5e1] hover:border-slate-300 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-3 bg-rose-50 border-2 border-rose-100 rounded-2xl group-hover:scale-110 transition-transform">
                      <Flame className="w-7 h-7 text-rose-500" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-black px-3 py-1 bg-rose-100 text-rose-600 rounded-full border border-rose-200">Mantap!</span>
                  </div>
                  <div className="text-3xl font-black text-slate-800 mb-1">{stats.streak} Hari</div>
                  <div className="text-sm text-slate-500 font-bold">Konsistensi</div>
                </div>
              </div>

              {/* FITUR PINTAR */}
              <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400" />
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-50 border-2 border-slate-200 rounded-2xl">
                    <Sparkles className="w-6 h-6 text-slate-800" strokeWidth={2.5} />
                  </div>
                  <span className="text-xl font-black text-slate-800">Fitur Pintar</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {quickActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <Link 
                        key={idx} 
                        href={action.link} 
                        className="
                          group flex flex-col items-center justify-center p-4 
                          bg-white rounded-[2rem] border-2 border-slate-100 
                          transition-all duration-300 ease-out
                          hover:bg-emerald-50 
                          hover:border-emerald-400 
                          hover:shadow-[0_6px_0_0_#34d399] 
                          hover:-translate-y-1.5
                          active:translate-y-0 active:shadow-none
                        "
                      >
                        <div className="
                          w-14 h-14 rounded-2xl bg-slate-50 border-2 border-slate-100 
                          flex items-center justify-center mb-3 
                          transition-all duration-300
                          group-hover:bg-white group-hover:border-emerald-200 group-hover:scale-110 group-hover:rotate-6
                        ">
                          <Icon className="w-7 h-7 text-slate-700 group-hover:text-emerald-500 transition-colors" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-bold text-slate-600 group-hover:text-emerald-700 text-center leading-tight">
                          {action.title}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* News Section */}
              <section>
                <div className="flex items-center gap-3 mb-5 px-2">
                  <div className="p-2 bg-white border-2 border-slate-200 rounded-xl shadow-[0_3px_0_0_#e2e8f0]">
                    <Newspaper className="w-5 h-5 text-slate-800" />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Kabar IRMA Terkini</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {newsItems.map((news) => (
                    <div key={news.id} className="flex gap-4 p-4 bg-white rounded-[2rem] border-2 border-slate-100 hover:border-teal-400 hover:shadow-[0_6px_0_0_#2dd4bf] hover:-translate-y-1 transition-all cursor-pointer group">
                      <div className="w-24 h-24 rounded-2xl bg-slate-200 overflow-hidden shrink-0 border-2 border-slate-100 group-hover:border-teal-200">
                        <img src={`https://picsum.photos/200/200?random=${news.imageId}`} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="inline-block w-fit px-2 py-0.5 rounded-md bg-teal-50 text-teal-600 text-[10px] font-black border border-teal-100 mb-2 uppercase tracking-wide">
                          {news.category}
                        </span>
                        <h3 className="font-bold text-slate-800 leading-snug mb-2 text-base group-hover:text-teal-600 transition-colors line-clamp-2">
                          {news.title}
                        </h3>
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> {news.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="xl:col-span-4 space-y-6">
              
              {/* --- [DESKTOP] CARD LEVEL --- */}
              <div className="hidden xl:block transform hover:scale-[1.02] transition-transform duration-300">
                <LevelCardContent />
              </div>

              {/* Feature Cards Stack */}
              <div className="space-y-4">
                
                {/* Daily Challenge Card */}
                <div className="bg-white p-5 rounded-[2rem] border-2 border-slate-100 shadow-sm flex items-center gap-4 hover:border-amber-300 hover:shadow-[0_4px_0_0_#fcd34d] transition-all group">
                  <div className="w-14 h-14 rounded-full bg-amber-50 border-2 border-amber-100 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                    <Zap className="w-7 h-7 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-800 text-lg">Tantangan Harian</h4>
                    <p className="text-xs text-slate-500 font-bold">Hafalan surat pendek</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-700 hover:scale-105 transition-all">
                    Mulai
                  </button>
                </div>

                {/* Ci Irma Chatbot Promo */}
                <div className="bg-[#f0f9ff] p-5 rounded-[2rem] border-2 border-cyan-200 relative overflow-hidden group">
                  {/* Decorative blobs */}
                  <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-cyan-200 rounded-full opacity-20 group-hover:scale-125 transition-transform" />
                  
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <img src="/ci irma.jpg" alt="AI" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-base">Ci Irma AI</h4>
                      <span className="text-xs text-emerald-600 flex items-center gap-1.5 font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-100 w-fit">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 font-bold relative z-10 leading-relaxed">
                    "Ada PR yang susah? Atau mau curhat? Irma siap bantu kamu!"
                  </p>
                  <button className="w-full py-3 bg-white text-slate-800 font-black text-sm rounded-2xl shadow-[0_4px_0_0_#cbd5e1] border-2 border-slate-200 hover:shadow-[0_2px_0_0_#cbd5e1] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 relative z-10">
                    <MessageSquare className="w-5 h-5 text-cyan-500" strokeWidth={3} /> Chat Sekarang
                  </button>
                </div>

                {/* Instruktur Promo */}
                <div className="bg-white p-5 rounded-[2rem] border-2 border-slate-100 shadow-sm hover:border-indigo-200 transition-colors">
                  <h4 className="font-black text-slate-800 mb-3 text-sm tracking-wide uppercase text-center bg-slate-100 rounded-lg py-1">Instruktur Pilihan</h4>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border-2 border-indigo-100 overflow-hidden shrink-0">
                      <img src="/instruktur.jpg" alt="Instruktur" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900">Ust. Ahmad</p>
                      <p className="text-xs text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 inline-block mt-1">Fiqih & Ibadah</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-slate-900 text-white text-sm font-black rounded-2xl shadow-lg hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all">
                    Jadwalkan Konsultasi
                  </button>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
      <ChatbotButton />
    </div>
  );
};

export default Dashboard;