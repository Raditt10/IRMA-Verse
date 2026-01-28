"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, User, Clock, Users, Search, Filter, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"upcoming" | "finished">("upcoming");
  const router = useRouter();

  useEffect(() => {
    loadUser();
    fetchSchedules();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [schedules, searchQuery, activeTab]);

  const loadUser = async () => {
    setUser({
      id: "user-123",
      full_name: "Rafaditya Syahputra",
      email: "rafaditya@irmaverse.local",
      avatar: "RS"
    });
  };

  const fetchSchedules = async () => {
    try {
      // Mock data untuk demo
      const mockSchedules: Schedule[] = [
        {
          id: "1",
          title: "Semesta 1",
          description: "Belajar strategi dakwah di era digital",
          date: "2024-11-25",
          time: "13:00 WIB",
          location: "Aula Utama",
          pemateri: "Ustadz Ahmad Zaki",
          registeredCount: 45,
          status: "Acara telah dilaksanakan"
        },
        {
          id: "2",
          title: "Semesta 2",
          description: "Persiapan menyambut bulan suci",
          date: "2024-11-28",
          time: "14:00 WIB",
          location: "Musholla",
          pemateri: "Ustadzah Fatimah",
          registeredCount: 67,
          status: "Segera hadir"
        },
        {
          id: "3",
          title: "Buka Puasa Bersama",
          description: "Meningkatkan kemampuan menghafal Al-Quran",
          date: "2024-12-01",
          time: "15:00 WIB",
          location: "Ruang Tahfidz",
          pemateri: "Ustadz Muhammad Rizki",
          registeredCount: 32,
          status: "Sedang berlangsung"
        },
        {
          id: "4",
          title: "Seminar Akhlak Pemuda",
          description: "Membangun karakter islami generasi muda",
          date: "2024-12-05",
          time: "09:00 WIB",
          location: "Aula Besar",
          pemateri: "Ustadz Abdullah Hakim",
          registeredCount: 89,
          status: "Acara telah dilaksanakan"
        },
        {
          id: "5",
          title: "Mentoring Calon Hafidz",
          description: "Program intensif bimbingan hafalan Al-Quran personal",
          date: "2024-12-08",
          time: "16:00 WIB",
          location: "Ruang Belajar Privat",
          pemateri: "Ustadz Qur'ani Ibrahim",
          registeredCount: 20,
          status: "Segera hadir"
        },
        {
          id: "6",
          title: "Workshop Parenting Islami",
          description: "Memahami pola asuh anak menurut perspektif Islam",
          date: "2024-12-12",
          time: "10:00 WIB",
          location: "Aula Keluarga",
          pemateri: "Ustadzah Dr. Nurfitrianti, M.Psi",
          registeredCount: 54,
          status: "Segera hadir"
        },
        {
          id: "7",
          title: "Fikih Muamalah Praktis",
          description: "Pemahaman hukum Islam dalam transaksi bisnis modern",
          date: "2024-12-15",
          time: "14:00 WIB",
          location: "Aula Utama",
          pemateri: "Ustadz Dr. Didi Junaedi, M.A",
          registeredCount: 38,
          status: "Segera hadir"
        },
        {
          id: "8",
          title: "Qira'at Al-Quran 7 Metode",
          description: "Pembelajaran variasi bacaan Al-Quran dari berbagai qira'at",
          date: "2024-12-18",
          time: "17:00 WIB",
          location: "Ruang Tajwid Premium",
          pemateri: "Qari Mahmud Al-Banawi",
          registeredCount: 25,
          status: "Segera hadir"
        }
      ];
      // Add thumbnail images to each schedule
      mockSchedules.forEach((schedule, index) => {
        (schedule as any).thumbnail = `https://picsum.photos/seed/event${index + 1}/200/200`;
      });
      setSchedules(mockSchedules);
      setFilteredSchedules(mockSchedules);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-black text-slate-800 mb-2">
                Event & Kegiatan
              </h1>
              <p className="text-slate-600 text-lg">
                Daftar event dan kegiatan rohani yang akan datang
              </p>
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