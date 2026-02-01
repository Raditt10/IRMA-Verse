"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Calendar, Clock, Search, BookOpen, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Material {
  id: string;
  title: string;
  summary: string;
  content: string | null;
  date: string;
  pemateri: string | null;
  category?: string;
  classLevel?: string;
  time?: string;
  participants?: number;
  thumbnail?: string;
}

const Materials = () => {
  const { data: session } = useSession();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState("Semua");
  const [selectedClass, setSelectedClass] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Cek Role: Apakah Admin atau Instruktur?
  const isPrivileged = session?.user?.role === "instruktur" || session?.user?.role === "admin";

  const programCategories = ["Semua", "Program Wajib", "Program Ekstra", "Program Next Level"];
  const classCategories = ["Semua", "Kelas 10", "Kelas 11", "Kelas 12"];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      // Mock data
      const mockMaterials: Material[] = [
        {
          id: "1",
          title: "Kedudukan Akal dan Wahyu",
          summary: "Ustadz Ahmad Zaki",
          content: "Materi tentang adab dalam Islam",
          date: "2024-11-25",
          time: "13:00 - 15:00",
          pemateri: "Ustadz Ahmad Zaki",
          category: "Program Wajib",
          classLevel: "Kelas 10",
          participants: 45,
          thumbnail: "https://picsum.photos/seed/kajian1/400/300"
        },
        {
          id: "2",
          title: "Fiqih Ibadah Sehari-hari",
          summary: "Ustadzah Fatimah",
          content: "Materi tentang fiqih ibadah",
          date: "2024-11-28",
          time: "14:00 - 16:00",
          pemateri: "Ustadzah Fatimah",
          category: "Program Wajib",
          classLevel: "Kelas 11",
          participants: 38,
          thumbnail: "https://picsum.photos/seed/kajian2/400/300"
        },
        {
          id: "3",
          title: "Tafsir Al-Quran: Surah Al-Baqarah",
          summary: "Ustadz Muhammad Rizki",
          content: "Materi tentang tafsir Al-Quran",
          date: "2024-12-01",
          time: "15:00 - 17:00",
          pemateri: "Ustadz Muhammad Rizki",
          category: "Program Next Level",
          classLevel: "Kelas 12",
          participants: 52,
          thumbnail: "https://picsum.photos/seed/kajian3/400/300"
        },
        {
          id: "4",
          title: "Sejarah Khulafaur Rasyidin",
          summary: "Ustadz Abdullah",
          content: "Materi tentang sejarah Islam",
          date: "2024-12-05",
          time: "13:00 - 15:00",
          pemateri: "Ustadz Abdullah",
          category: "Program Ekstra",
          classLevel: "Kelas 10",
          participants: 41,
          thumbnail: "https://picsum.photos/seed/kajian4/400/300"
        },
        {
          id: "5",
          title: "Rukun Iman dan Implementasinya",
          summary: "Ustadz Ali Hasan",
          content: "Materi tentang aqidah",
          date: "2024-12-08",
          time: "14:00 - 16:00",
          pemateri: "Ustadz Ali Hasan",
          category: "Program Ekstra",
          classLevel: "Kelas 11",
          participants: 47,
          thumbnail: "https://picsum.photos/seed/kajian5/400/300"
        },
        {
          id: "6",
          title: "Akhlak kepada Orang Tua",
          summary: "Ustadzah Khadijah",
          content: "Materi tentang akhlak",
          date: "2024-12-10",
          time: "15:00 - 17:00",
          pemateri: "Ustadzah Khadijah",
          category: "Program Next Level",
          classLevel: "Kelas 12",
          participants: 55,
          thumbnail: "https://picsum.photos/seed/kajian6/400/300"
        }
      ];
      setMaterials(mockMaterials);
    } catch (error: any) {
      console.error("Error loading materials:", error);
    } finally {
      setLoading(false);
    }
  };

  let filteredMaterials = materials.filter((material) => {
    const matchesProgram = selectedProgram === "Semua" || material.category === selectedProgram;
    const matchesClass = selectedClass === "Semua" || material.classLevel === selectedClass;
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          material.pemateri?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProgram && matchesClass && matchesSearch;
  });

  // Sort: Kajian yang sudah lewat/diikuti ditaruh bawah
  filteredMaterials = [
    ...filteredMaterials.filter(m => !["3","4"].includes(m.id)),
    ...filteredMaterials.filter(m => ["3","4"].includes(m.id))
  ];

  if (!session) {
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
            
            {/* --- HEADER --- */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
                  {isPrivileged ? "Kelola Kajian" : "Kajian Mingguanku"}
                </h1>
                <p className="text-slate-500 text-lg font-medium">
                  {isPrivileged 
                    ? "Atur jadwal dan materi kajian untuk anggota 📝"
                    : "Ikuti kajian seru bareng teman-teman!"
                  }
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="grid gap-6 mb-8 lg:grid-cols-[1fr_auto]">
              <div className="space-y-4">
                {/* Program Filter */}
                <div className="flex flex-wrap gap-3">
                  {programCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedProgram(category)}
                      className={`px-5 py-2 rounded-xl font-bold border-2 transition-all duration-200 ${
                        selectedProgram === category
                          ? "bg-teal-400 text-white border-teal-600 shadow-[0_4px_0_0_#0d9488] -translate-y-1"
                          : "bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-500 hover:shadow-[0_4px_0_0_#cbd5e1] hover:-translate-y-1"
                      } active:translate-y-0 active:shadow-none`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Class Filter */}
                <div className="flex flex-wrap gap-3">
                  {classCategories.map((kelas) => (
                    <button
                      key={kelas}
                      onClick={() => setSelectedClass(kelas)}
                      className={`px-4 py-1.5 rounded-xl font-bold border-2 text-sm transition-all duration-200 ${
                        selectedClass === kelas
                          ? "bg-emerald-400 text-white border-emerald-600 shadow-[0_3px_0_0_#059669] -translate-y-0.5"
                          : "bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-500 hover:shadow-[0_3px_0_0_#cbd5e1] hover:-translate-y-0.5"
                      } active:translate-y-0 active:shadow-none`}
                    >
                      {kelas}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:w-80 self-start">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cari materi / ustadz..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 rounded-2xl border-2 border-slate-200 focus:border-teal-400 focus:shadow-[0_0_0_3px_rgba(45,212,191,0.2)] bg-white"
                />
              </div>
            </div>

            {/* Content Grid */}
            {loading ? (
              <div className="text-center py-20">
                <Sparkles className="h-10 w-10 text-teal-400 animate-spin mx-auto mb-4" />
                <p className="text-slate-500 font-bold">Sedang memuat kajian...</p>
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-slate-100 border-dashed">
                <p className="text-slate-400 font-bold text-xl">Yah, tidak ada kajian yang cocok 😔</p>
                <button 
                  onClick={() => {setSelectedProgram("Semua"); setSelectedClass("Semua"); setSearchQuery("")}}
                  className="mt-4 text-teal-500 font-bold underline decoration-wavy hover:text-teal-600"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-[0_8px_0_0_#cbd5e1] hover:border-emerald-400 hover:shadow-[0_8px_0_0_#34d399] transition-all duration-300 overflow-hidden group hover:-translate-y-2 flex flex-col h-full"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-52 overflow-hidden border-b-2 border-slate-100">
                      <img
                        src={material.thumbnail}
                        alt={material.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Badge: Baru */}
                      {["1","2"].includes(material.id) && (
                        <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-white shadow-md animate-bounce">
                          BARU!
                        </span>
                      )}

                      {/* Badge: Category */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-lg bg-teal-400 text-white text-xs font-bold border-2 border-teal-600 shadow-[0_2px_0_0_#0f766e]">
                          {material.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex-1">
                        {/* Class Badge Inline */}
                        {material.classLevel && (
                          <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-200 mb-2 uppercase tracking-wide">
                            {material.classLevel}
                          </span>
                        )}
                        
                        <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight group-hover:text-teal-600 transition-colors line-clamp-2">
                          {material.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-4">
                           <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                             <span className="text-xs">👤</span>
                           </div>
                           <p className="text-slate-500 font-bold text-sm">{material.pemateri || "TBA"}</p>
                        </div>

                        {/* Info Row */}
                        <div className="flex items-center gap-4 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                            <Calendar className="h-4 w-4 text-teal-400" />
                            <span>
                              {new Date(material.date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
                          <div className="w-px h-4 bg-slate-300"></div>
                          {material.time && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                              <Clock className="h-4 w-4 text-teal-400" />
                              <span>{material.time}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* --- BUTTON ACTION DINAMIS --- */}
                      <div className="mt-auto">
                        {isPrivileged ? (
                          // Tombol untuk Instruktur/Admin (Pop Style Green)
                           <button
                             onClick={() => router.push(`/materials/edit/${material.id}`)}
                             className="w-full py-3 rounded-xl bg-emerald-400 text-white font-black border-2 border-emerald-600 border-b-4 hover:bg-emerald-500 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 group/btn"
                           >
                             <Sparkles className="w-4 h-4 group-hover/btn:animate-spin" /> Edit Kajian
                           </button>
                        ) : (
                          // Tombol untuk User Biasa
                          ["3","4"].includes(material.id) ? (
                            <div className="space-y-3">
                               <div className="flex items-center justify-center gap-2 text-emerald-500 font-bold text-xs bg-emerald-50 py-1 rounded-lg">
                                  <span>✅ Kamu sudah ikut</span>
                               </div>
                               <button
                                 onClick={() => router.push(`/rekapan/${material.id}`)}
                                 className="w-full py-3 rounded-xl bg-cyan-400 text-white font-black border-2 border-cyan-600 border-b-4 hover:bg-cyan-500 active:border-b-2 active:translate-y-[2px] transition-all"
                               >
                                 Lihat Rekapan
                               </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => router.push("/materials/absensi")}
                              className="w-full py-3 rounded-xl bg-teal-400 text-white font-black border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-[2px] transition-all shadow-lg hover:shadow-teal-200"
                            >
                              Aku Ikut! ✋
                            </button>
                          )
                        )}
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

export default Materials;