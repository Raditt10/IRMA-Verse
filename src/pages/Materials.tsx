import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import ChatbotButton from "@/components/ChatbotButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, User, Users, Clock, Play, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface Material {
  id: string;
  title: string;
  summary: string;
  content: string | null;
  date: string;
  pemateri: string | null;
  category?: string;
  time?: string;
  participants?: number;
  thumbnail?: string;
}

const Materials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = ["Semua", "Akhlak", "Fiqih", "Tafsir", "Sejarah", "Aqidah"];

  useEffect(() => {
    loadUser();
    fetchMaterials();
  }, []);

  const loadUser = async () => {
    // Gunakan data yang sama dengan Dashboard
    setUser({
      id: "user-123",
      full_name: "Rafaditya Syahputra",
      email: "rafaditya@irmaverse.local",
      avatar: "RS"
    });
  };

  const fetchMaterials = async () => {
    try {
      // Mock data untuk demo
      const mockMaterials: Material[] = [
        {
          id: "1",
          title: "Kedudukan Akal dan Wahyu",
          summary: "Ustadz Ahmad Zaki",
          content: "Materi tentang adab dalam Islam",
          date: "2024-11-25",
          time: "13:00 - 15:00",
          pemateri: "Ustadz Ahmad Zaki",
          category: "Akhlak",
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
          category: "Fiqih",
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
          category: "Tafsir",
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
          category: "Sejarah",
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
          category: "Aqidah",
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
          category: "Akhlak",
          participants: 55,
          thumbnail: "https://picsum.photos/seed/kajian6/400/300"
        }
      ];
      setMaterials(mockMaterials);
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

  const filteredMaterials = materials.filter((material) => {
    const matchesCategory = selectedCategory === "Semua" || material.category === selectedCategory;
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.pemateri?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
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
                Kajian Mingguan
              </h1>
              <p className="text-slate-600 text-lg">
                Ikuti kajian mingguan bersama para pemateri berpengalaman
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-3 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105"
                      : "bg-white text-slate-700 hover:bg-slate-100 shadow-sm"
                  }`}
                >
                  {category}
                </button>
              ))}
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
                        src={material.thumbnail}
                        alt={material.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-1.5 rounded-full bg-teal-500 text-white text-sm font-semibold shadow-lg">
                          {material.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                        {material.title}
                      </h3>
                      <p className="text-slate-600 mb-4">{material.summary}</p>

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
                        {material.time && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4" />
                            <span>{material.time}</span>
                          </div>
                        )}
                        {material.participants && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Users className="h-4 w-4" />
                            <span>{material.participants} peserta</span>
                          </div>
                        )}
                      </div>

                      {/* Button */}
                      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300">
                        Aku ikut!
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

export default Materials;
