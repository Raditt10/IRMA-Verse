"use client";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Star, BookOpen, Users, MessageCircle, Award, Plus } from "lucide-react";
import Link from "next/link";

interface Instructor {
  id: string;
  name: string;
  specialization: string;
  description: string;
  avatar: string;
  rating: number;
  studentsCount: number;
  kajianCount: number;
  tags: string[];
  verified: boolean;
  featured?: boolean;
}

const Instructors = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
    fetchInstructors();
  }, []);

  const loadUser = async () => {
    setUser({
      id: "user-123",
      full_name: "Rafaditya Syahputra",
      email: "rafaditya@irmaverse.local",
      avatar: "RS"
    });
  };

  const fetchInstructors = async () => {
    try {
      const mockInstructors: Instructor[] = [
        {
          id: "1",
          name: "Ustadz Ahmad Zaki",
          specialization: "Ahli Akhlak & Tasawuf",
          description: "Lulusan Al-Azhar University dengan pengalaman mengajar 10 tahun",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
          rating: 4.9,
          studentsCount: 245,
          kajianCount: 32,
          tags: ["Akhlak", "Tasawuf", "Adab"],
          verified: true
        },
        {
          id: "2",
          name: "Ustadzah Fatimah",
          specialization: "Pakar Fiqih Wanita",
          description: "Spesialis fiqih wanita dan hukum keluarga Islam",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatimah",
          rating: 4.8,
          studentsCount: 198,
          kajianCount: 28,
          tags: ["Fiqih", "Ibadah", "Hukum Islam"],
          verified: true,
          featured: true
        },
        {
          id: "3",
          name: "Ustadz Muhammad Rizki",
          specialization: "Ahli Tafsir Al-Quran",
          description: "Hafidz 30 juz dengan sanad qiraah dari Mesir",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rizki",
          rating: 5.0,
          studentsCount: 312,
          kajianCount: 45,
          tags: ["Tafsir", "Ulumul Quran", "Tahfidz"],
          verified: true
        },
        {
          id: "4",
          name: "Ustadz Abdullah Hakim",
          specialization: "Sejarah Islam & Sirah",
          description: "Pakar sejarah peradaban Islam dan biografi Nabi",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abdullah",
          rating: 4.7,
          studentsCount: 167,
          kajianCount: 24,
          tags: ["Sejarah", "Sirah", "Peradaban"],
          verified: true
        },
        {
          id: "5",
          name: "Ustadzah Khadijah",
          specialization: "Aqidah & Tauhid",
          description: "Lulusan Universitas Islam Madinah bidang Aqidah",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Khadijah",
          rating: 4.9,
          studentsCount: 203,
          kajianCount: 31,
          tags: ["Aqidah", "Tauhid", "Manhaj"],
          verified: true
        },
        {
          id: "6",
          name: "Ustadz Umar Faruq",
          specialization: "Hadits & Ilmu Hadits",
          description: "Ahli hadits dengan sanad dari Darul Hadits Yemen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Umar",
          rating: 4.8,
          studentsCount: 189,
          kajianCount: 27,
          tags: ["Hadits", "Ulumul Hadits", "Riwayat"],
          verified: true
        }
      ];
      setInstructors(mockInstructors);
    } catch (error: any) {
      console.error("Error fetching instructors:", error);
    } finally {
      setLoading(false);
    }
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
        <div className="flex-1 px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl font-black text-slate-800 mb-1">
                  Daftar Instruktur
                </h1>
                <p className="text-slate-600 text-lg">
                  Para instruktur terbaik kami yang siap membimbing kamu!
                </p>
              </div>

              <Link
                href="/instructor-dashboard/kajian"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-teal-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Buat Kajian Baru
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Memuat instruktur...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className={`bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2 ${
                      instructor.featured ? 'ring-2 ring-teal-500/50' : ''
                    }`}
                  >
                    <div className="p-6">
                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-teal-100 shadow-lg">
                            <img
                              src={instructor.avatar}
                              alt={instructor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {instructor.verified && (
                            <div className="absolute bottom-0 right-0 w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                              <Award className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Name & Specialization */}
                      <div className="text-center mb-4">
                        <h3 className={`text-xl font-bold mb-1 ${
                          instructor.featured ? 'text-teal-600' : 'text-slate-800'
                        }`}>
                          {instructor.name}
                        </h3>
                        <p className="text-slate-600 text-sm font-semibold">
                          {instructor.specialization}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-slate-500 text-sm text-center mb-4 line-clamp-2">
                        {instructor.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {instructor.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-slate-100">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-bold">{instructor.rating}</span>
                          </div>
                          <p className="text-xs text-slate-500">Rating</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <span className="font-bold text-slate-700">{instructor.studentsCount}</span>
                          </div>
                          <p className="text-xs text-slate-500">Murid</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <span className="font-bold text-slate-700">{instructor.kajianCount}</span>
                          </div>
                          <p className="text-xs text-slate-500">Kajian</p>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="space-y-2">
                        <button className="w-full py-3 rounded-xl bg-linear-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Mulai Chat
                        </button>
                        <button className="w-full py-3 rounded-xl bg-white border-2 border-teal-500 text-teal-600 font-semibold hover:bg-teal-50 transition-all duration-300 flex items-center justify-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Lihat Kajian
                        </button>
                      </div>
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

export default Instructors;