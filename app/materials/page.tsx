"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, User, Users, Clock, Play, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react"; 

interface Material {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category?: string;
  grade?: string;
  startedAt?: string;
  date: string;
  participants?: number;
  thumbnailUrl?: string;
  isJoined: boolean;
}


const Materials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [selectedProgram, setSelectedProgram] = useState("Semua");
  const [selectedGrade, setSelectedGrade] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  
  const programCategories = ["Semua", "Program Wajib", "Program Ekstra", "Program Next Level"];
  const classCategories = ["Semua", "Kelas 10", "Kelas 11", "Kelas 12"];

  const { data: session } = useSession({
      required: true,
      onUnauthenticated() {
          if (typeof window !== "undefined") {
              window.location.href = "/auth";
          }
      }
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [materials, selectedProgram, selectedGrade, searchQuery]);

  const filterMaterials = async () => {
    const filtered = materials.filter((material) => {
      const matchesProgram =
        selectedProgram === "Semua" || material.category === selectedProgram;
      const matchesGrade =
        selectedGrade === "Semua" || material.grade === selectedGrade;
      const matchesSearch =
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesProgram && matchesGrade && matchesSearch;
    });

    setFilteredMaterials(filtered);
  };

  const fetchMaterials = async () => {
    try {
      const res = await fetch("/api/materials");
      if (!res.ok) throw new Error("Failed fetch materials");

      const data = await res.json()

      setMaterials(data);
      setFilteredMaterials(data);
    } catch (error: any) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-black text-slate-800 mb-2">
                Kajian Mingguanku
              </h1>
              <p className="text-slate-600 text-lg">
                Ikuti kajian mingguan bersama para pemateri berpengalaman
              </p>
            </div>

            {/* Filters */}
            <div className="grid gap-3 mb-6 sm:grid-cols-2">
              <div className="flex flex-wrap gap-3">
                {programCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedProgram(category)}
                    className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                      selectedProgram === category
                        ? "bg-linear-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105"
                        : "bg-white text-slate-700 hover:bg-slate-100 shadow-sm"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {classCategories.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                      selectedGrade === grade
                        ? "bg-linear-to-r from-emerald-500 to-lime-400 text-white shadow-lg scale-105"
                        : "bg-white text-slate-700 hover:bg-slate-100 shadow-sm"
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cari kajian..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 rounded-xl border-2 border-slate-200 focus:border-teal-500 shadow-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Memuat kajian...</p>
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Tidak ada kajian ditemukan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden bg-slate-200">
                      <img
                        src={material.thumbnailUrl}
                        alt={material.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                      {/* Tanda Kajian telah diikuti di foto kajian */}
                      {material.isJoined && (
                        <span className="absolute left-4 bottom-4 px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md z-10">
                          Kajian telah diikuti
                        </span>
                      )}

                      {/* Tanda Merah buat kajian baru */}
                      {!material.isJoined && (
                        <span className="absolute top-4 right-4 w-4 h-4 rounded-full bg-red-600 shadow-lg animate-pulse z-10 border-2 border-white" />
                      )}

                      {/* Category + Class Badges */}
                      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                        <span className="px-4 py-1.5 rounded-full bg-teal-500 text-white text-sm font-semibold shadow-lg">
                          {material.category}
                        </span>
                        {material.grade && (
                          <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 shadow-md">
                            {material.grade}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 relative">
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                        {material.title}
                      </h3>
                      <p className="text-slate-600 mb-4">{material.description}</p>

                      {/* Info */}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(material.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        {material.startedAt && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4" />
                            <span>{material.startedAt}</span>
                          </div>
                        )}
                        {material.participants && (
                          <div className="h-0" aria-hidden="true"></div>
                        )}
                      </div>

                      {/* Button */}

                      {(material.isJoined) ? (
                        <button
                          onClick={() => router.push(`/materials/${material.id}/rekapan`)}
                          className="w-full py-3 rounded-xl bg-linear-to-r from-teal-700 to-cyan-800 text-white font-semibold hover:from-teal-800 hover:to-cyan-900 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Lihat Rekapan Materi
                        </button>
                      ) : (
                        <button
                          onClick={() => router.push(`/materials/${material.id}/absensi`)}
                          className="w-full py-3 rounded-xl bg-linear-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Aku ikut!
                        </button>
                      )}
                      {/* {(session?.user?.role === "admin" || session?.user?.role === "instruktur") && (
                        <button
                          onClick={() => router.push(`/materials/${material.id}/invite`)}
                          className="w-full py-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 mt-2"
                        >
                          Undang Peserta
                        </button>          //experiment
                      )} */}
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