import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import ChatbotButton from "@/components/ChatbotButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
}

const Schedule = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadUser();
    fetchSchedules();
  }, []);

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
          status: "Pendaftaran Dibuka"
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
          status: "Pendaftaran Dibuka"
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
          status: "Pendaftaran Dibuka"
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
          status: "Pendaftaran Dibuka"
        }
      ];
      // Add thumbnail images to each schedule
      mockSchedules.forEach((schedule, index) => {
        (schedule as any).thumbnail = `https://picsum.photos/seed/event${index + 1}/200/200`;
      });
      setSchedules(mockSchedules);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <DashboardHeader user={user} />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12">
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

            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Memuat jadwal...</p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Belum ada event terdaftar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        {/* Event Image */}
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
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
                      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300">
                        Daftar Event
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
