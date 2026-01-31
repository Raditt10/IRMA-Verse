"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { UserCircle2, UserPlus, Check, X, Search, Sparkles } from "lucide-react"; // Tambah icon Sparkles

interface Member {
  id: string;
  name: string;
  role: string;
  class: string;
  avatar: string;
  points: number;
  status: "Aktif" | "Tidak Aktif";
}

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ show: boolean; message: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    loadUser();
    fetchMembers();
  }, []);

  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadUser = async () => {
    setUser({
      id: "user-123",
      full_name: "Rafaditya Syahputra",
      email: "rafaditya@irmaverse.local",
      avatar: "RS",
    });
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      if (!res.ok) throw new Error("Gagal mengambil data anggota");
      const data = await res.json();
      const mapped = data.map((u: any) => ({
        id: u.id,
        name: u.name || "-",
        role: u.role || "-",
        class: u.class || "-",
        avatar: u.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (u.name || "user"),
        points: u.points || 0,
        status: u.status || "Aktif",
      }));
      setMembers(mapped);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = search
    ? members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    : members;

  const handleAddFriend = (name: string) => {
    setToast({
      show: true,
      message: `Permintaan dikirim ke ${name}`,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}
    >
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-10 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl font-black text-slate-800 mb-3">Daftar Anggota</h1>
              <p className="text-slate-600 text-lg mb-6">Semua anggota IRMA aktif</p>
              
              {/* --- SEARCH BAR --- */}
              <div className="relative w-full max-w-md group mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Cari nama anggota..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition-all shadow-sm hover:shadow-md outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {/* --- FITUR: MUNGKIN INI YANG KAMU MAKSUD --- */}
              {search && filteredMembers.length > 0 && (
                <div className="flex items-center gap-2 mb-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <Sparkles className="h-4 w-4 text-teal-500" />
                    <p className="text-slate-500 text-sm font-medium">
                        Mungkin ini yang kamu maksud: <span className="text-teal-600 font-bold">"{filteredMembers[0].name}"</span>
                        {filteredMembers.length > 1 && <span className="font-normal text-slate-400"> dan {filteredMembers.length - 1} lainnya</span>}
                    </p>
                </div>
              )}

            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Memuat anggota...</p>
              </div>
            ) : (
              <>
                {/* --- GRID ANGGOTA --- */}
                {filteredMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member) => (
                      <div
                        key={member.id}
                        className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2 border border-slate-100"
                      >
                        <div className="p-6">
                          {/* Avatar */}
                          <div className="flex justify-center mb-4">
                            <div className="relative">
                              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-teal-50 shadow-lg group-hover:ring-teal-100 transition-all">
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Name & Role */}
                          <div className="text-center mb-3">
                            <h3 className="text-xl font-bold text-slate-800 mb-1">
                              {member.name}
                            </h3>
                            <p className="text-teal-600 text-sm font-semibold mb-1">
                              {member.role}
                            </p>
                            <p className="text-slate-500 text-sm">{member.class}</p>
                          </div>

                          {/* Points & Status */}
                          <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-100">
                            <div>
                              <p className="text-xs text-slate-500 mb-1">
                                Poin Keaktifan
                              </p>
                              <p className="text-2xl font-bold text-teal-600">
                                {member.points}
                              </p>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-100">
                              {member.status}
                            </div>
                          </div>

                          {/* Buttons */}
                          <button
                            onClick={() => router.push(`/members/${member.id}`)}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-teal-500/20 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <UserCircle2 className="h-5 w-5" />
                            Lihat Profile
                          </button>
                          
                          <button
                            className="w-full mt-3 py-3 rounded-xl bg-white border-2 border-slate-100 text-slate-600 font-semibold hover:border-teal-200 hover:text-teal-600 hover:bg-teal-50 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                            onClick={() => handleAddFriend(member.name)}
                          >
                            <UserPlus className="h-5 w-5" />
                            Tambahkan Teman
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* --- EMPTY STATE (Jika tidak ada hasil) --- */
                  <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <Search className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-700 mb-2">
                        Anggota Tidak Ditemukan
                    </h3>
                    <p className="text-slate-500 max-w-md">
                        Kami tidak dapat menemukan anggota dengan nama <span className="font-semibold text-teal-600">"{search}"</span>. Coba gunakan kata kunci lain.
                    </p>
                    <button 
                        onClick={() => setSearch("")}
                        className="mt-6 px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors font-semibold"
                    >
                        Hapus Pencarian
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <ChatbotButton />

      {/* --- NOTIFIKASI TOAST --- */}
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="flex items-center gap-3 bg-slate-900/95 backdrop-blur-sm text-white px-5 py-3 rounded-full shadow-2xl animate-[slideDown_0.4s_ease-out] border border-white/10">
                <div className="bg-emerald-500 rounded-full p-1 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white stroke-[3]" />
                </div>
                <span className="text-sm font-medium tracking-wide pr-2" style={{ fontFamily: "sans-serif" }}>
                    {toast.message}
                </span>
                <button 
                    onClick={() => setToast(null)}
                    className="ml-2 text-slate-400 hover:text-white transition-colors border-l border-white/10 pl-3"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
};

export default Members;