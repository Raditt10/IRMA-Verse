import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import ChatbotButton from "@/components/ChatbotButton";
import { ArrowRight, CheckCircle2, Clock3, Hourglass } from "lucide-react";

interface DiklatProgram {
  id: string;
  title: string;
  duration: string;
  level: string;
  quota: {
    filled: number;
    total: number;
  };
  status: "in-progress" | "done" | "upcoming";
}

const OurPrograms = () => {
  const [programs, setPrograms] = useState<DiklatProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadUser();
    fetchPrograms();
  }, []);

  const loadUser = async () => {
    setUser({
      id: "user-123",
      full_name: "Rafaditya Syahputra",
      email: "rafaditya@irmaverse.local",
      avatar: "RS"
    });
  };

  const fetchPrograms = async () => {
    try {
      const mockPrograms: DiklatProgram[] = [
        {
          id: "1",
          title: "Kedudukan akal dan wahyu",
          duration: "3 bulan",
          level: "Pemula",
          quota: {
            filled: 18,
            total: 30
          },
          status: "in-progress"
        },
        {
          id: "2",
          title: "Kursus Bahasa Arab",
          duration: "6 bulan",
          level: "Menengah",
          quota: {
            filled: 22,
            total: 25
          },
          status: "done"
        },
        {
          id: "3",
          title: "Training Imam & Khatib",
          duration: "2 bulan",
          level: "Lanjutan",
          quota: {
            filled: 15,
            total: 20
          },
          status: "in-progress"
        },
        {
          id: "4",
          title: "Tahsin & Tajwid Intensif",
          duration: "4 bulan",
          level: "Pemula",
          quota: {
            filled: 28,
            total: 35
          },
          status: "done"
        },
        {
          id: "5",
          title: "Manajemen Masjid Modern",
          duration: "3 bulan",
          level: "Lanjutan",
          quota: {
            filled: 12,
            total: 20
          },
          status: "upcoming"
        },
        {
          id: "6",
          title: "Media Dakwah Digital",
          duration: "5 bulan",
          level: "Menengah",
          quota: {
            filled: 20,
            total: 25
          },
          status: "upcoming"
        }
      ];
      
      // Add thumbnail images
      mockPrograms.forEach((program, index) => {
        (program as any).thumbnail = `https://picsum.photos/seed/program${index + 1}/400/250`;
      });
      
      setPrograms(mockPrograms);
    } catch (error: any) {
      console.error("Error fetching programs:", error);
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
                Program Kurikulum Kami
              </h1>
              <p className="text-slate-600 text-lg">
                Pendidikan dan pelatihan untuk meningkatkan kompetensi keagamaan
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/70 backdrop-blur rounded-xl shadow-sm">
                  <Clock3 className="h-5 w-5 text-amber-500" />
                  <span>Sedang berlangsung</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/70 backdrop-blur rounded-xl shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>Selesai</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/70 backdrop-blur rounded-xl shadow-sm">
                  <Hourglass className="h-5 w-5 text-slate-500" />
                  <span>Belum waktunya</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari program..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">Semua status</option>
                  <option value="in-progress">Sedang berlangsung</option>
                  <option value="done">Selesai</option>
                  <option value="upcoming">Belum waktunya</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Memuat program...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs
                  .filter((program) =>
                    program.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (statusFilter === "all" || program.status === statusFilter)
                  )
                  .map((program) => {
                  const statusMeta: Record<DiklatProgram["status"], { label: string; icon: any; color: string }> = {
                    "in-progress": { label: "Sedang berlangsung", icon: Clock3, color: "text-amber-600" },
                    done: { label: "Selesai", icon: CheckCircle2, color: "text-emerald-600" },
                    upcoming: { label: "Belum waktunya", icon: Hourglass, color: "text-slate-600" }
                  };
                  const meta = statusMeta[program.status];

                  return (
                  <div
                    key={program.id}
                    className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                  >
                    {/* Image with Overlay */}
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={(program as any).thumbnail}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-3 right-3 px-3 h-10 rounded-2xl bg-white/90 backdrop-blur flex items-center gap-2 shadow-md">
                        <meta.icon className={`h-5 w-5 ${meta.color}`} />
                        <span className="text-xs font-semibold text-slate-800">{meta.label}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-slate-800 mb-4 text-center group-hover:text-teal-600 transition-colors">
                        {program.title}
                      </h3>

                      {/* Button */}
                      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                        <span>Lihat Detail</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <ChatbotButton />
    </div>
  );
};

export default OurPrograms;
