"use client";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { ArrowRight, Calendar, Eye, Share2, Bookmark, Filter, Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NewsItem {
  id: string;
  title: string;
  deskripsi: string;
  content: string;
  category: "Prestasi" | "Kerjasama" | "Update" | "Event" | "Pengumuman";
  createdAt: string;
  image: string | null;
  slug: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
}

const categoryStyles: Record<NewsItem["category"], string> = {
  Prestasi: "bg-emerald-500 text-white",
  Kerjasama: "bg-cyan-500 text-white",
  Update: "bg-blue-500 text-white",
  Event: "bg-purple-500 text-white",
  Pengumuman: "bg-amber-500 text-white"
};

const News = () => {
  const { data: session } = useSession();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

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
      const response = await fetch("/api/news");
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      setNews(data);
      setFilteredNews(data);
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
        item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredNews(filtered);
  };

  const handleDelete = (id: string) => {
    setSelectedNewsId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedNewsId) return;

    setDeleteDialogOpen(false);

    try {
      const response = await fetch(`/api/news?id=${selectedNewsId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(`Error: ${error.error}`);
        return;
      }

      toast.success("Berita berhasil dihapus!");
      setSelectedNewsId(null);
      // Refresh news list
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Gagal menghapus berita. Silakan coba lagi.");
    }
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
      <DashboardHeader/>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-black text-slate-800 mb-2">
                    Berita IRMA
                  </h1>
                  <p className="text-slate-600 text-lg">
                    Berita terkini seputar kegiatan dan perkembangan IRMA Verse
                  </p>
                </div>
                
                {/* Admin Create Button */}
                {session?.user?.role === "admin" && (
                  <Link
                    href="/news/create"
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-5 w-5" />
                    Buat Berita
                  </Link>
                )}
              </div>
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
                    className={`bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="sm:w-64 h-56 sm:h-auto flex-shrink-0 relative overflow-hidden">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1633613286991-611bcfb63dba?auto=format&fit=crop&w=800&q=80"}
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
                              <span>{new Date(item.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}</span>
                            </div>
                          </div>

                          <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                            {item.title}
                          </h2>

                          <p className="text-slate-600 mb-4 line-clamp-3">
                            {item.deskripsi}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <span className="text-sm text-slate-500">Oleh: {item.author.name || item.author.email}</span>
                          <div className="flex gap-2">
                            {/* Admin Actions */}
                            {session?.user?.role === "admin" && (
                              <>
                                <Link
                                  href={`/news/edit/${item.id}`}
                                  className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-gray-600"
                                  title="Edit berita"
                                >
                                  <Pencil className="h-5 w-5" />
                                </Link>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-gray-600"
                                  title="Hapus berita"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </>
                            )}
                            
                            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                              <Bookmark className="h-5 w-5" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                              <Share2 className="h-5 w-5" />
                            </button>
                            <Link
                              href={`/news/${item.slug}`}
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 flex items-center gap-2"
                            >
                              <span>Baca Selengkapnya</span>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Berita</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
            >
              Hapus
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster position="top-right" richColors />
    </div>
  );
};

export default News;