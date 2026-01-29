"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, User, Clock, Users, Search, Filter, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
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
      
      // Map status from database to display format
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
      filtered = filtered.filter(schedule => schedule.status === "Segera hadir");
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-black text-slate-800 mb-2">
                    Event & Kegiatan
                  </h1>
                  <p className="text-slate-600 text-lg">
                    Daftar event dan kegiatan rohani yang akan datang
                  </p>
                </div>
                {session?.user?.role === "instruktur" && (
                  <button
                    onClick={() => router.push("/schedule/create")}
                    className="px-6 py-3 rounded-xl bg-linear-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all"
                  >
                    + Buat Jadwal
                  </button>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cari event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-3 border-b border-slate-200">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-4 py-3 font-semibold transition-colors ${
                  activeTab === "upcoming"
                    ? "text-teal-600 border-b-2 border-teal-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Akan Datang
              </button>
              <button
                onClick={() => setActiveTab("finished")}
                className={`px-4 py-3 font-semibold transition-colors ${
                  activeTab === "finished"
                    ? "text-teal-600 border-b-2 border-teal-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Selesai
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Memuat jadwal...</p>
              </div>
            ) : filteredSchedules.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500 mb-3">Tidak ada event ditemukan</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("upcoming");
                  }}
                  className="text-teal-600 hover:text-teal-700 font-semibold"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        {/* Event Image */}
                        <div className="shrink-0 w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                          <img 
                            src={(schedule as any).thumbnail} 
                            alt={schedule.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          {/* Status Badge */}
                          {schedule.status && (
                            <span className="inline-block px-3 py-1 mb-2 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">
                              {schedule.status}
                            </span>
                          )}
                          
                          {/* Title */}
                          <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-teal-600 transition-colors">
                            {schedule.title}
                          </h3>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-2.5 mb-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>
                            {new Date(schedule.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        
                        {schedule.time && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span>{schedule.time}</span>
                          </div>
                        )}
                        
                        {schedule.location && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span>{schedule.location}</span>
                          </div>
                        )}
                        
                        {schedule.registeredCount && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Users className="h-4 w-4 text-slate-400" />
                            <span>{schedule.registeredCount} peserta terdaftar</span>
                          </div>
                        )}
                      </div>

                      {/* Button */}
                      <button 
                        onClick={() => router.push(`/schedule/${schedule.id}`)}
                        className="w-full py-3 rounded-xl bg-linear-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <span>Lihat Detail</span>
                        <ArrowRight className="h-5 w-5" />
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