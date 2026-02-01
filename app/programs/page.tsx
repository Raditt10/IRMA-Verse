"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock3, 
  Hourglass, 
  BookOpen, 
  Sparkles, 
  ChevronDown,
  SearchX, 
  RefreshCcw 
} from "lucide-react";

interface Program {
  id: string;
  title: string;
  description?: string;
  duration: string;
  level: string;
  quota: {
    filled: number;
    total: number;
  };
  status: "in-progress" | "done" | "upcoming";
  thumbnail?: string;
}

const OurPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Hardcode user sementara
  const user = { id: "user-123" };

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "in-progress", label: "Sedang Berlangsung" },
    { value: "done", label: "Selesai" },
    { value: "upcoming", label: "Mendatang" },
  ];

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
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const mockPrograms: Program[] = [
        {
          id: "1",
          title: "Kedudukan Akal dan Wahyu",
          description: "Memahami hubungan akal dan wahyu dalam Islam dengan pendekatan modern.",
          duration: "3 bulan",
          level: "Kelas 10",
          quota: { filled: 18, total: 30 },
          status: "in-progress"
        },
        {
          id: "2",
          title: "Kursus Bahasa Arab",
          description: "Menguasai bahasa Arab dasar untuk pemahaman kitab dan hadits sehari-hari.",
          duration: "6 bulan",
          level: "Kelas 11",
          quota: { filled: 22, total: 25 },
          status: "done"
        },
        {
          id: "3",
          title: "Training Imam & Khatib",
          description: "Pelatihan intensif public speaking dan fiqih shalat untuk calon imam muda.",
          duration: "2 bulan",
          level: "Kelas 12",
          quota: { filled: 15, total: 20 },
          status: "in-progress"
        },
        {
          id: "4",
          title: "Tahsin & Tajwid Intensif",
          description: "Memperbaiki bacaan Al-Quran dengan kaidah tajwid yang benar dan tartil.",
          duration: "4 bulan",
          level: "Kelas 10",
          quota: { filled: 28, total: 35 },
          status: "done"
        },
        {
          id: "5",
          title: "Manajemen Masjid Modern",
          description: "Strategi mengelola masjid dengan manajemen profesional dan teknologi terkini.",
          duration: "3 bulan",
          level: "Kelas 12",
          quota: { filled: 12, total: 20 },
          status: "upcoming"
        },
        {
          id: "6",
          title: "Media Dakwah Digital",
          description: "Belajar membuat konten dakwah kreatif untuk media sosial masa kini.",
          duration: "5 bulan",
          level: "Kelas 11",
          quota: { filled: 20, total: 25 },
          status: "upcoming"
        }
      ];
      
      // Add thumbnail images
      mockPrograms.forEach((program, index) => {
        program.thumbnail = `https://picsum.photos/seed/program${index + 1}/400/250`;
      });
      
      setPrograms(mockPrograms);
    } catch (error: any) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter((program) =>
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === "all" || program.status === statusFilter)
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-slate-500 font-bold">Memuat...</p>
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
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
                  Program Kurikulum
                </h1>
                <p className="text-slate-500 text-lg font-medium">
                  Pendidikan dan pelatihan untuk meningkatkan kompetensi keagamaan 
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border-2 border-amber-200 shadow-sm transition-transform hover:scale-105">
                  <Clock3 className="h-4 w-4" />
                  <span>Berlangsung</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border-2 border-emerald-200 shadow-sm transition-transform hover:scale-105">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Selesai</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl border-2 border-slate-200 shadow-sm transition-transform hover:scale-105">
                  <Hourglass className="h-4 w-4" />
                  <span>Mendatang</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative group">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari program seru..."
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
                  <span>
                    {statusOptions.find(opt => opt.value === statusFilter)?.label || "Semua Status"}
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-teal-500' : ''}`} 
                    strokeWidth={3} 
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-white border-2 border-slate-200 rounded-2xl shadow-[0_6px_0_0_#cbd5e1] overflow-hidden">
                    <div className="p-1.5 space-y-1">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setStatusFilter(option.value);
                            setIsDropdownOpen(false);
                          }}
                          className={`
                            w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all
                            ${statusFilter === option.value 
                              ? 'bg-teal-50 text-teal-600' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }
                          `}
                        >
                          {option.label}
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
                <p className="text-slate-500 font-bold">Menyiapkan program...</p>
              </div>
            ) : (
              <>
                {filteredPrograms.length === 0 ? (
                  /* ---- EMPTY STATE (Tanpa Animasi Masuk) ---- */
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-dashed border-slate-300 mb-6">
                        <SearchX className="h-12 w-12 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-700 mb-2">
                      Yah, tidak ada program yang cocok...
                    </h3>
                    <p className="text-slate-500 font-medium max-w-md mb-8">
                      Coba cari dengan kata kunci lain atau ubah filter statusnya ya!
                    </p>
                    <button 
                      onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
                      className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl shadow-[0_4px_0_0_#e2e8f0] hover:border-teal-400 hover:text-teal-600 hover:shadow-[0_4px_0_0_#34d399] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      <span>Reset Pencarian</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* ---- SUCCESS HEADER (Tanpa Animasi Masuk) ---- */}
                    {searchTerm && (
                      <div className="mb-8">
                        <div className="inline-flex items-center gap-3 bg-teal-50 border-2 border-teal-100 px-5 py-3 rounded-2xl shadow-sm">
                           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-teal-200 shrink-0">
                              <Sparkles className="h-4 w-4 text-teal-500" />
                           </div>
                           <p className="text-teal-800 font-bold text-sm">
                             Hore! Ditemukan <span className="underline decoration-wavy decoration-teal-400">{filteredPrograms.length} program</span> yang cocok!
                           </p>
                        </div>
                      </div>
                    )}

                    {/* ---- GRID CONTENT (Tanpa Animasi Staggered) ---- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredPrograms.map((program) => {
                        const statusMeta: Record<Program["status"], { label: string; icon: any; color: string; bg: string; border: string }> = {
                          "in-progress": { label: "Berlangsung", icon: Clock3, color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-300" },
                          done: { label: "Selesai", icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-300" },
                          upcoming: { label: "Mendatang", icon: Hourglass, color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-300" }
                        };
                        const meta = statusMeta[program.status];

                        return (
                          <div
                            key={program.id}
                            className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-[0_8px_0_0_#cbd5e1] hover:border-teal-400 hover:shadow-[0_8px_0_0_#34d399] transition-all overflow-hidden group hover:-translate-y-2 flex flex-col h-full"
                          >
                            {/* Image Area */}
                            <div className="relative h-48 overflow-hidden border-b-2 border-slate-100">
                              <img 
                                src={program.thumbnail}
                                alt={program.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              
                              <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full flex items-center gap-1.5 border-2 shadow-sm ${meta.bg} ${meta.border}`}>
                                <meta.icon className={`h-3.5 w-3.5 ${meta.color}`} strokeWidth={3} />
                                <span className={`text-[10px] font-black uppercase tracking-wide ${meta.color}`}>{meta.label}</span>
                              </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-6 flex flex-col justify-between flex-1">
                              <div className="mb-6">
                                <div className="mb-3">
                                   <span className="inline-block px-3 py-1 rounded-xl bg-teal-50 text-teal-600 text-[10px] font-black border border-teal-200 uppercase tracking-wider mb-2">
                                     {program.level}
                                   </span>
                                   <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-teal-600 transition-colors line-clamp-2">
                                     {program.title}
                                   </h3>
                                </div>
                                
                                {program.description && (
                                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4 line-clamp-3">
                                    {program.description}
                                  </p>
                                )}
                                
                                <div className="pt-4 border-t-2 border-slate-100 flex items-center gap-4 text-xs font-bold text-slate-400">
                                  <div className="flex items-center gap-1.5">
                                     <Clock3 className="h-4 w-4 text-teal-400" />
                                     <span>{program.duration}</span>
                                  </div>
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                  <div className="flex items-center gap-1.5">
                                     <BookOpen className="h-4 w-4 text-teal-400" />
                                     <span>{program.quota.filled}/{program.quota.total} Siswa</span>
                                  </div>
                                </div>
                              </div>

                              <button 
                                onClick={() => router.push(`/programs/${program.id}`)}
                                className="w-full py-3 rounded-2xl bg-teal-400 text-white font-black text-sm border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 mt-auto"
                              >
                                <span>Lihat Detail</span>
                                <ArrowRight className="h-4 w-4" strokeWidth={3} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
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

export default OurPrograms;