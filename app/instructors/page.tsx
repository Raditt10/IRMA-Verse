"use client";
import { useEffect, useState, useRef } from "react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { 
  Star, 
  BookOpen, 
  Users, 
  MessageCircle, 
  Sparkles, 
  SearchX, 
  RefreshCcw, 
  ChevronDown 
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

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
  
  // State untuk Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: session } = useSession();

  // Menutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const res = await fetch("/api/instructors");
      if (!res.ok) throw new Error("Gagal mengambil data instruktur");
      const data = await res.json();
      
      const mapped = data.map((u: any) => ({
        id: u.id,
        name: u.name || "-",
        specialization: u.bidangKeahlian || "-",
        description: u.pengalaman || "-",
        avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name || "user"}`,
        rating: u.rating || 0,
        studentsCount: u.studentsCount || 0,
        kajianCount: u.kajianCount || 0,
        tags: ["Fiqih", "Tafsir", "Hadits"],
        verified: true,
        featured: u.featured || false,
      }));
      setInstructors(mapped);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mendapatkan list spesialisasi unik untuk dropdown
  const uniqueSpecializations = ["all", ...new Set(instructors.map(i => i.specialization))];

  // Logic Filtering
  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          instructor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = specializationFilter === "all" || instructor.specialization === specializationFilter;
    
    return matchesSearch && matchesFilter;
  });

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-slate-500 font-bold animate-pulse">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
                  Daftar Instruktur
                </h1>
                <p className="text-slate-500 text-lg font-medium">
                  Para instruktur terbaik kami yang siap membimbing kamu! 
                </p>
              </div>
            </div>

            {/* Filter & Search Section */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative group">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama instruktur atau keahlian..."
                  className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 shadow-[0_4px_0_0_#e2e8f0] focus:outline-none focus:border-teal-400 focus:shadow-[0_4px_0_0_#34d399] transition-all font-medium placeholder:text-slate-400"
                />
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`
                    w-full flex items-center justify-between rounded-2xl border-2 bg-white px-5 py-4 
                    font-bold text-slate-700 transition-all cursor-pointer
                    ${isDropdownOpen 
                      ? 'border-teal-400 shadow-[0_4px_0_0_#34d399] translate-y-[-2px]' 
                      : 'border-slate-200 shadow-[0_4px_0_0_#e2e8f0] hover:border-teal-300'
                    }
                  `}
                >
                  <span className="capitalize">
                    {specializationFilter === "all" ? "Semua Keahlian" : specializationFilter}
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-teal-500' : ''}`} 
                    strokeWidth={3} 
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-white border-2 border-slate-200 rounded-2xl shadow-[0_6px_0_0_#cbd5e1] overflow-hidden max-h-60 overflow-y-auto">
                    <div className="p-1.5 space-y-1">
                      {uniqueSpecializations.map((spec) => (
                        <button
                          key={spec}
                          onClick={() => {
                            setSpecializationFilter(spec);
                            setIsDropdownOpen(false);
                          }}
                          className={`
                            w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all capitalize
                            ${specializationFilter === spec 
                              ? 'bg-teal-50 text-teal-600' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }
                          `}
                        >
                          {spec === "all" ? "Semua Keahlian" : spec}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <Sparkles className="h-10 w-10 text-teal-400 animate-spin mx-auto mb-4" />
                <p className="text-slate-500 font-bold">Mencari instruktur...</p>
              </div>
            ) : (
              <>
                {filteredInstructors.length === 0 ? (
                  /* ---- EMPTY STATE ---- */
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-dashed border-slate-300 mb-6">
                        <SearchX className="h-12 w-12 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-700 mb-2">
                      Yah, instruktur tidak ditemukan...
                    </h3>
                    <p className="text-slate-500 font-medium max-w-md mb-8">
                      Coba cari dengan kata kunci lain atau ubah filter keahliannya ya!
                    </p>
                    <button 
                      onClick={() => { setSearchTerm(""); setSpecializationFilter("all"); }}
                      className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl shadow-[0_4px_0_0_#e2e8f0] hover:border-teal-400 hover:text-teal-600 hover:shadow-[0_4px_0_0_#34d399] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      <span>Reset Pencarian</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* ---- SUCCESS HEADER ---- */}
                    {(searchTerm || specializationFilter !== "all") && (
                      <div className="mb-8">
                        <div className="inline-flex items-center gap-3 bg-teal-50 border-2 border-teal-100 px-5 py-3 rounded-2xl shadow-sm">
                           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-teal-200 shrink-0">
                              <Sparkles className="h-4 w-4 text-teal-500" />
                           </div>
                           <p className="text-teal-800 font-bold text-sm">
                             Hore! Ditemukan <span className="underline decoration-wavy decoration-teal-400">{filteredInstructors.length} instruktur</span> yang cocok!
                           </p>
                        </div>
                      </div>
                    )}

                    {/* ---- GRID CONTENT ---- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredInstructors.map((instructor) => (
                        <div
                          key={instructor.id}
                          className={`bg-white rounded-[2.5rem] border-2 transition-all duration-300 overflow-hidden group hover:-translate-y-2 flex flex-col relative ${
                            instructor.featured 
                              ? 'border-amber-400 shadow-[0_8px_0_0_#fbbf24]' 
                              : 'border-slate-200 shadow-[0_8px_0_0_#cbd5e1] hover:border-teal-400 hover:shadow-[0_8px_0_0_#34d399]'
                          }`}
                        >
                          {/* Featured Badge */}
                          {instructor.featured && (
                            <div className="absolute top-4 right-4 z-10 bg-amber-400 text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-amber-500 shadow-sm flex items-center gap-1 animate-pulse">
                              <Star className="w-3 h-3 fill-white" strokeWidth={3} />
                              <span>POPULER</span>
                            </div>
                          )}

                          <div className="p-6 flex-1 flex flex-col">
                            {/* Avatar */}
                            <div className="flex justify-center mb-4 mt-2">
                              <div className="relative group-hover:scale-105 transition-transform duration-300">
                                <div className={`w-28 h-28 rounded-full overflow-hidden border-4 shadow-lg ${
                                   instructor.featured ? 'border-amber-200' : 'border-teal-100'
                                }`}>
                                  <img
                                    src={instructor.avatar}
                                    alt={instructor.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Name & Specialization */}
                            <div className="text-center mb-4">
                              <h3 className="text-xl font-black text-slate-800 mb-1 leading-tight">
                                {instructor.name}
                              </h3>
                              <p className="text-teal-600 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full inline-block border-2 border-teal-100">
                                {instructor.specialization}
                              </p>
                            </div>

                            {/* Description */}
                            <p className="text-slate-500 text-sm text-center mb-5 line-clamp-2 font-medium px-2 leading-relaxed">
                              {instructor.description}
                            </p> 

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                              {instructor.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 rounded-xl bg-slate-50 text-slate-500 text-[10px] font-bold border-2 border-slate-200"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            {/* Stats Widget */}
                            <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50 p-3 rounded-2xl border-2 border-slate-100">
                              <div className="text-center border-r-2 border-slate-200">
                                <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="font-black text-lg text-slate-700">{instructor.rating}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Rating</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-0.5">
                                  <span className="font-black text-lg text-slate-700">{instructor.kajianCount}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Kajian</p>
                              </div>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3 mt-auto">
                              {session?.user?.id !== instructor.id ? (
                                <>
                                  <Link
                                    href={`/instructors/chat?instructorId=${encodeURIComponent(instructor.id)}`}
                                    className="w-full py-3 rounded-2xl bg-teal-400 text-white font-black border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-teal-200"
                                  >
                                    <MessageCircle className="w-5 h-5 group-hover/btn:animate-bounce" strokeWidth={2.5} />
                                    Mulai Chat
                                  </Link>
                                  
                                  <button className="w-full py-3 rounded-2xl bg-white text-slate-600 font-bold border-2 border-slate-200 border-b-4 hover:bg-slate-50 hover:text-slate-800 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Lihat Kajian
                                  </button>
                                </>
                              ) : (
                                <button className="w-full py-3 rounded-2xl bg-teal-400 text-white font-black border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 shadow-lg">
                                  Lihat Profile Saya
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <ChatbotButton />
    </div>
  );
};

export default Instructors;