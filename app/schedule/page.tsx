"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  Sparkles, 
  SearchX, 
  CalendarX // Import icon baru untuk empty state global
} from "lucide-react";
import { useSession } from "next-auth/react";

interface Schedule {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time?: string;
  location: string | null;
  pemateri: string | null;
  registeredCount?: number;
  status?: string;
  image?: string;
  category?: string;
}

const Schedule = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"upcoming" | "finished">("upcoming");
  const router = useRouter();

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [schedules, searchQuery, activeTab]);
  
  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/schedules");
      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }
      const data = await response.json();
      
      const mappedSchedules = data.map((schedule: any) => ({
        ...schedule,
        status: schedule.status === "segera_hadir" 
          ? "Segera hadir" 
          : schedule.status === "ongoing" 
          ? "Sedang berlangsung" 
          : "Acara telah dilaksanakan",
        thumbnail: schedule.thumbnailUrl || `https://picsum.photos/seed/event${schedule.id}/200/200`,
      }));
      
      setSchedules(mappedSchedules);
      setFilteredSchedules(mappedSchedules);
    } catch (error: any) {
      console.error("Error loading schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSchedules = () => {
    let filtered = schedules;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(schedule =>
        schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tab
    if (activeTab === "upcoming") {
      filtered = filtered.filter(schedule => schedule.status === "Segera hadir" || schedule.status === "Sedang berlangsung");
    } else if (activeTab === "finished") {
      filtered = filtered.filter(schedule => schedule.status === "Acara telah dilaksanakan");
    }

    setFilteredSchedules(filtered);
  };

  const { data: session } = useSession({
    required: false,
    onUnauthenticated() {
      window.location.href = "/auth";
    }
  });


  return (
    <div className="min-h-screen bg-[#FDFBF7]" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
                  Event & Kegiatan
                </h1>
                <p className="text-slate-500 text-lg font-medium">
                  Daftar event dan kegiatan rohani yang akan datang 
                </p>
              </div>
              {session?.user?.role === "instruktur" && (
                <button
                  onClick={() => router.push("/schedule/create")}
                  className="px-6 py-3 rounded-2xl bg-teal-400 text-white font-black border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-[2px] transition-all shadow-lg hover:shadow-teal-200"
                >
                  + Tambahkan Event
                </button>
              )}
            </div>

            {/* Search Bar & Tabs (Hanya tampil jika ada data di database) */}
            {!loading && schedules.length > 0 && (
              <>
                <div className="mb-8">
                   <input
                     type="text"
                     placeholder="Cari event seru atau topik kajian..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 shadow-[0_4px_0_0_#e2e8f0] focus:outline-none focus:border-teal-400 focus:shadow-[0_4px_0_0_#34d399] transition-all font-medium placeholder:text-slate-400"
                   />
                </div>

                <div className="mb-8 flex gap-3 border-b-2 border-slate-100 pb-1">
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-6 py-3 font-bold rounded-t-xl transition-all relative top-[2px] border-b-4 ${
                      activeTab === "upcoming"
                        ? "text-teal-600 border-teal-500 bg-teal-50"
                        : "text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-50"
                    }`}
                  >
                    Akan Datang
                  </button>
                  <button
                    onClick={() => setActiveTab("finished")}
                    className={`px-6 py-3 font-bold rounded-t-xl transition-all relative top-[2px] border-b-4 ${
                      activeTab === "finished"
                        ? "text-teal-600 border-teal-500 bg-teal-50"
                        : "text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-50"
                    }`}
                  >
                    Selesai
                  </button>
                </div>
              </>
            )}

            {loading ? (
              <div className="text-center py-20">
                <Sparkles className="h-10 w-10 text-teal-400 animate-spin mx-auto mb-4" />
                <p className="text-slate-500 font-bold">Memuat jadwal...</p>
              </div>
            ) : schedules.length === 0 ? (
               /* ---- EMPTY STATE GLOBAL (Database Kosong) ---- */
               <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-dashed border-slate-300 mb-6">
                     <CalendarX className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-700 mb-2">
                    Yah, tidak ada event tersedia sekarang
                  </h3>
                  <p className="text-slate-500 font-medium max-w-md">
                    Belum ada kegiatan yang dijadwalkan. Cek lagi nanti ya!
                  </p>
               </div>
            ) : filteredSchedules.length === 0 ? (
              /* ---- EMPTY STATE FILTER (Pencarian tidak ketemu) ---- */
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                 <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-dashed border-slate-300 mb-6">
                    <SearchX className="h-12 w-12 text-slate-400" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-700 mb-2">
                   Yah, event tidak ditemukan...
                 </h3>
                 <p className="text-slate-500 font-medium max-w-md mb-8">
                   Coba cari dengan kata kunci lain atau ubah tab statusnya ya!
                 </p>
                 <button
                   onClick={() => {
                     setSearchQuery("");
                     setActiveTab("upcoming");
                   }}
                   className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl shadow-[0_4px_0_0_#e2e8f0] hover:border-teal-400 hover:text-teal-600 hover:shadow-[0_4px_0_0_#34d399] active:translate-y-[2px] active:shadow-none transition-all"
                 >
                   Reset Filter
                 </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="bg-white rounded-[2rem] border-2 border-slate-200 shadow-[0_6px_0_0_#cbd5e1] hover:border-teal-400 hover:shadow-[0_6px_0_0_#34d399] transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-5 mb-5">
                        {/* Event Image */}
                        <div className="shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                          <img 
                            src={(schedule as any).thumbnail} 
                            alt={schedule.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {/* Status Badge */}
                          {schedule.status && (
                            <span className={`inline-block px-3 py-1 mb-2 rounded-lg text-[10px] font-black uppercase tracking-wide border-2 ${
                                schedule.status === "Segera hadir" || schedule.status === "Sedang berlangsung"
                                ? "bg-amber-100 text-amber-700 border-amber-200" 
                                : "bg-emerald-100 text-emerald-700 border-emerald-200"
                            }`}>
                              {schedule.status}
                            </span>
                          )}
                          
                          {/* Title */}
                          <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-teal-600 transition-colors line-clamp-2">
                            {schedule.title}
                          </h3>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border-2 border-slate-100">
                        <div className="flex items-center gap-3 text-sm text-slate-600 font-bold">
                          <Calendar className="h-4 w-4 text-teal-500" />
                          <span>
                            {new Date(schedule.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        
                        {schedule.time && (
                          <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                            <Clock className="h-4 w-4 text-teal-500" />
                            <span>{schedule.time}</span>
                          </div>
                        )}
                        
                        {schedule.location && (
                          <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                            <MapPin className="h-4 w-4 text-teal-500" />
                            <span className="truncate">{schedule.location}</span>
                          </div>
                        )}
                        
                        {schedule.registeredCount !== undefined && (
                          <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                            <Users className="h-4 w-4 text-teal-500" />
                            <span>{schedule.registeredCount} peserta</span>
                          </div>
                        )}
                      </div>

                      {/* Button */}
                      <button 
                        onClick={() => router.push(`/schedule/${schedule.id}`)}
                        className="w-full py-3.5 rounded-2xl bg-teal-400 text-white font-black text-sm border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <span>Lihat Detail Event</span>
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ChatbotButton />
    </div>
  );
};

export default Schedule;