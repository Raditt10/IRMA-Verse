"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/Chatbot";
import CartoonNotification from "@/components/ui/Notification";
import EmptyState from "@/components/ui/EmptyState";
import CategoryFilter from "@/components/ui/CategoryFilter";
import SearchInput from "@/components/ui/SearchInput";
import MaterialInstructorActions from "@/components/ui/AbsensiButton";
import MaterialUserActions from "@/components/ui/ButtonUserAbsenMaterial";
import Loading from "@/components/ui/Loading";
import SuccessDataFound from "@/components/ui/SuccessDataFound";
import { Calendar, Clock, BookOpen, Plus, Sparkles } from "lucide-react";
import AddButton from "@/components/ui/AddButton";
import DeleteButton from "@/components/ui/DeleteButton";

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
  attendedAt?: string;
}


const Materials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [selectedProgram, setSelectedProgram] = useState("Semua");
  const [selectedGrade, setSelectedGrade] = useState("Semua");
  const [selectedInstructor, setSelectedInstructor] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);
  const router = useRouter();

  const { data: session } = useSession({
      required: true,
      onUnauthenticated() {
          if (typeof window !== "undefined") {
              window.location.href = "/auth";
          }
      }
  });

  // Cek Role: Apakah Admin atau Instruktur?
  const isPrivileged = session?.user?.role === "instruktur" || session?.user?.role === "admin";
  const programCategories = ["Semua", "Program Wajib", "Program Ekstra", "Program Next Level"];
  const classCategories = ["Semua", "Kelas 10", "Kelas 11", "Kelas 12"];

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [materials, selectedProgram, selectedGrade, selectedInstructor, searchQuery]);

  const filterMaterials = async () => {
    const filtered = materials.filter((material) => {
      const matchesProgram =
        selectedProgram === "Semua" || material.category === selectedProgram;
      const matchesGrade =
        selectedGrade === "Semua" || material.grade === selectedGrade;
      const matchesSearch =
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesProgram && matchesGrade && matchesSearch;
    });

    setFilteredMaterials(filtered);
  };

  const fetchMaterials = async () => {
    try {
      const res = await fetch("/api/materials");
      if (!res.ok) throw new Error("Failed fetch materials");

      const data = await res.json()

      // Fetch attendance status for each material
      const materialsWithAttendance = await Promise.all(
        data.map(async (material: Material) => {
          try {
            const attendanceRes = await fetch(
              `/api/materials/attendance?materialId=${material.id}`
            );
            if (attendanceRes.ok) {
              const attendanceData = await attendanceRes.json();
              return {
                ...material,
                isJoined: attendanceData.isAttended,
                attendedAt: attendanceData.attendedAt,
              };
            }
            return material;
          } catch (error) {
            console.error("Error fetching attendance:", error);
            return material;
          }
        })
      );

      setMaterials(materialsWithAttendance);
      setFilteredMaterials(materialsWithAttendance);
    } catch (error: any) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    try {
      const res = await fetch(`/api/materials/${materialId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menghapus kajian");
      }

      setMaterials(materials.filter(m => m.id !== materialId));
      setNotification({
        type: "success",
        title: "Berhasil!",
        message: "Kajian berhasil dihapus",
      });
    } catch (error: any) {
      console.error("Error deleting material:", error);
      setNotification({
        type: "error",
        title: "Gagal Menghapus",
        message: error.message || "Gagal menghapus kajian",
      });
    }
  };

  // Get today's material for instructor
  const getTodayMaterial = () => {
    if (!isPrivileged || materials.length === 0) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayMaterial = materials.find(m => {
      const materialDate = new Date(m.date);
      materialDate.setHours(0, 0, 0, 0);
      return materialDate.getTime() === today.getTime();
    });
    
    return todayMaterial || null;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            
            {/* --- HEADER --- */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
                  {isPrivileged ? "Kelola Kajian" : "Jadwal Kajianku"}
                </h1>
                <p className="text-slate-500 text-lg font-medium">
                  {isPrivileged 
                    ? "Atur jadwal dan materi kajian untuk anggota"
                    : "Ikuti kajian seru bareng teman-teman!"
                  }
                </p>
              </div>
              
              {/* Tombol Buat Kajian untuk Instruktur/Admin */}
              {isPrivileged && (
                <AddButton
                  label="Buat Kajian"
                  onClick={() => router.push("/materials/create")}
                  icon={<Plus className="h-5 w-5" />}
                  color="emerald"
                  hideIcon={false}
                />
              )}
            </div>

            {/* Latest Material Card untuk Instruktur */}
            {isPrivileged && getTodayMaterial() && (
              <div className="mb-10 bg-linear-to-br from-teal-50 to-cyan-50 rounded-[2.5rem] border-2 border-teal-200 p-6 shadow-[0_4px_0_0_#cbd5e1]">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-teal-500" strokeWidth={2} />
                  <h2 className="text-lg font-black text-slate-800">Jadwal Kajianmu Hari Ini</h2>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-800 mb-2">{getTodayMaterial()?.title}</h3>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-teal-500" />
                        {new Date(getTodayMaterial()!.date).toLocaleDateString("id-ID")}
                      </span>
                      {getTodayMaterial()?.startedAt && (
                        <>
                          <span className="w-px h-4 bg-slate-300" />
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-teal-500" />
                            {getTodayMaterial()?.startedAt}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push(`/materials/${getTodayMaterial()?.id}/edit`)}
                      className="px-6 py-2 rounded-xl bg-teal-400 text-white font-bold border-2 border-teal-600 border-b-3 hover:bg-teal-500 active:border-b-2 active:translate-y-0.5 transition-all"
                    >
                      Edit
                    </button>
                    <DeleteButton
                      label="Hapus"
                      onClick={() => handleDeleteMaterial(getTodayMaterial()!.id)}
                      variant="with-label"
                      showConfirm={true}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="grid gap-6 mb-8 lg:grid-cols-[1fr_auto]">
              <div className="space-y-4">
                <CategoryFilter
                  categories={programCategories}
                  subCategories={classCategories}
                  selectedCategory={selectedProgram}
                  selectedSubCategory={selectedGrade}
                  onCategoryChange={setSelectedProgram}
                  onSubCategoryChange={setSelectedGrade}
                />
              </div>

              {/* Search Bar */}
              <SearchInput
                placeholder="Cari materi / ustadz..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>

            {/* Content Grid */}
            {loading ? (
              <div className="text-center py-20">
                <Loading text="Memuat kajian..." />
              </div>
            ) : filteredMaterials.length === 0 ? (
              <EmptyState
                icon={materials.length === 0 ? "calendar" : "search"}
                title={materials.length === 0 ? "Yah, tidak ada kajian tersedia sekarang" : "Yah, kajian tidak ditemukan..."}
                description={materials.length === 0 ? "Belum ada kajian yang dibuat. Cek lagi nanti ya!" : "Coba cari dengan kata kunci atau filter lain ya!"}
                actionLabel={materials.length === 0 ? undefined : "Reset Filter"}
                onAction={materials.length === 0 ? undefined : () => {setSelectedProgram("Semua"); setSelectedGrade("Semua"); setSearchQuery("")}}
              />
            ) : (
              <>
                {searchQuery && (
                  <SuccessDataFound 
                    message={`Ditemukan ${filteredMaterials.length} kajian sesuai pencarian`}
                    icon="sparkles"
                  />
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-[0_8px_0_0_#cbd5e1] hover:border-emerald-400 hover:shadow-[0_8px_0_0_#34d399] transition-all duration-300 overflow-hidden group hover:-translate-y-2 flex flex-col h-full"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-52 overflow-hidden border-b-2 border-slate-100">
                      <img
                        src={material.thumbnailUrl}
                        alt={material.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

                      {/* Badge: Baru */}
                      {!material.isJoined && (
                        <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-white shadow-md animate-bounce">
                          BARU!
                        </span>
                      )}

                      {/* Badge: Category */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-lg bg-emerald-400 text-white text-xs font-bold border-2 border-emerald-600 shadow-[0_2px_0_0_#065f46]">
                          {material.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex-1">
                        {/* Class Badge Inline */}
                        {material.grade && (
                          <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-200 mb-2 uppercase tracking-wide">
                            {material.grade}
                          </span>
                        )}
                        
                        <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {material.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-4">
                           <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                             <span className="text-xs">👤</span>
                           </div>
                           <p className="text-slate-500 font-bold text-sm">{material.instructor || "TBA"}</p>
                        </div>

                        {/* Info Row */}
                        <div className="flex items-center gap-4 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                            <Calendar className="h-4 w-4 text-emerald-400" />
                            <span>
                              {new Date(material.date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
                          <div className="w-px h-4 bg-slate-300"></div>
                          {material.startedAt && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                              <Clock className="h-4 w-4 text-emerald-400" />
                              <span>{material.startedAt}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* --- BUTTON ACTION DINAMIS --- */}
                      <div className="mt-auto">
                        {isPrivileged ? (
                          <MaterialInstructorActions
                            materialId={material.id}
                            onDelete={handleDeleteMaterial}
                          />
                        ) : (
                          <MaterialUserActions
                            materialId={material.id}
                            isJoined={material.isJoined}
                            attendedAt={material.attendedAt}
                            materialDate={material.date}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <ChatbotButton />

      {/* Notification */}
      {notification && (
        <CartoonNotification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.type === "success" ? 3000 : 5000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Materials;