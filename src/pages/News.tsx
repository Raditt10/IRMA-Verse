import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import ChatbotButton from "@/components/ChatbotButton";
import { ArrowRight, Calendar, Eye, Share2, Bookmark, Filter } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Prestasi" | "Kerjasama" | "Update" | "Event" | "Pengumuman";
  date: string;
  image: string;
  author: string;
  views: number;
  featured?: boolean;
}

const categoryStyles: Record<NewsItem["category"], string> = {
  Prestasi: "bg-emerald-500 text-white",
  Kerjasama: "bg-cyan-500 text-white",
  Update: "bg-blue-500 text-white",
  Event: "bg-purple-500 text-white",
  Pengumuman: "bg-amber-500 text-white"
};

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUser();
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [selectedCategory, searchTerm, news]);

  const loadUser = async () => {
    setUser({
      id: "user-123",
      full_name: "Rafaditya Syahputra",
      email: "rafaditya@irmaverse.local",
      avatar: "RS"
    });
  };

  const fetchNews = async () => {
    try {
      const mockNews: NewsItem[] = [
        {
          id: "1",
          title: "IRMA Verse Raih Penghargaan Platform Rohis Terbaik",
          excerpt: "Platform IRMA Verse berhasil meraih penghargaan sebagai platform rohis digital terbaik tingkat nasional...",
          content: "Platform IRMA Verse berhasil meraih penghargaan sebagai platform rohis digital terbaik tingkat nasional dalam ajang Digital Islamic Innovation Award 2024.",
          category: "Prestasi",
          date: "22 Nov 2024",
          image: "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?auto=format&fit=crop&w=800&q=80",
          author: "Tim IRMA",
          views: 1240,
          featured: true
        },
        {
          id: "2",
          title: "Kolaborasi dengan Pesantren Modern",
          excerpt: "IRMA Verse menjalin kerjasama dengan beberapa pesantren modern untuk program pertukaran pelajar...",
          content: "IRMA Verse menjalin kerjasama strategis dengan beberapa pesantren modern terkemuka untuk program pertukaran pelajar dan sharing knowledge.",
          category: "Kerjasama",
          date: "20 Nov 2024",
          image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
          author: "Humas IRMA",
          views: 856
        },
        {
          id: "3",
          title: "Update Fitur: Chatbot AI Ci Irma",
          excerpt: "Fitur chatbot AI terbaru diluncurkan untuk membantu anggota mendapatkan informasi dengan lebih cepat...",
          content: "Fitur chatbot AI Ci Irma terbaru diluncurkan dengan kemampuan Natural Language Processing untuk memberikan respons yang lebih akurat dan personal.",
          category: "Update",
          date: "18 Nov 2024",
          image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=80",
          author: "Tim Developer",
          views: 2150,
          featured: true
        },
        {
          id: "4",
          title: "Kajian Akbar Ramadan Bersama Ustadz Adi Hidayat",
          excerpt: "IRMA mengadakan kajian akbar spesial Ramadan yang akan diisi oleh Ustadz Adi Hidayat...",
          content: "IRMA menggelar kajian akbar spesial menyambut bulan Ramadan yang akan diisi langsung oleh Ustadz Adi Hidayat, Lc., MA dengan tema 'Meraih Keberkahan Ramadan'.",
          category: "Event",
          date: "15 Nov 2024",
          image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
          author: "Divisi Event",
          views: 3420
        },
        {
          id: "5",
          title: "Pendaftaran Program Tahfidz Intensif Dibuka",
          excerpt: "Pendaftaran program tahfidz intensif semester genap telah dibuka untuk semua anggota IRMA...",
          content: "Pendaftaran program tahfidz intensif semester genap telah dibuka dengan kuota terbatas. Program ini dirancang khusus untuk membantu anggota menghafal Al-Quran dengan metode yang efektif.",
          category: "Pengumuman",
          date: "12 Nov 2024",
          image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
          author: "Koordinator Kajian",
          views: 1890
        }
      ];
      setNews(mockNews);
      setFilteredNews(mockNews);
    } catch (error: any) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = news;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredNews(filtered);
  };

  const categories = ["all", "Prestasi", "Kerjasama", "Update", "Event", "Pengumuman"];

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
                Berita IRMA
              </h1>
              <p className="text-slate-600 text-lg">
                Berita terkini seputar kegiatan dan perkembangan IRMA Verse
              </p>
            </div>

            {/* Search & Filter */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari berita..."
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                      selectedCategory === cat
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105"
                        : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
                    }`}
                  >
                    {cat === "all" ? "Semua" : cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Memuat berita...</p>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl shadow-md">
                <p className="text-slate-500">Tidak ada berita ditemukan</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredNews.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group ${
                      item.featured ? 'ring-2 ring-teal-500/30' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="sm:w-64 h-56 sm:h-auto flex-shrink-0 relative overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <span
                          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${categoryStyles[item.category]}`}
                        >
                          {item.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{item.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{item.views.toLocaleString()} views</span>
                            </div>
                          </div>

                          <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                            {item.title}
                          </h2>

                          <p className="text-slate-600 mb-4 line-clamp-3">
                            {item.excerpt}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <span className="text-sm text-slate-500">Oleh: {item.author}</span>
                          <div className="flex gap-2">
                            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                              <Bookmark className="h-5 w-5" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                              <Share2 className="h-5 w-5" />
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 flex items-center gap-2">
                              <span>Baca Selengkapnya</span>
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
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

export default News;
