"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { ArrowRight, Trophy, Calendar, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";

interface CompetitionItem {
  id: string;
  title: string;
  date: string;
  prize: string;
  category: "Tahfidz" | "Seni" | "Bahasa" | "Lainnya";
  image: string;
}

const competitions: CompetitionItem[] = [
  {
    id: "1",
    title: "Lomba Tahfidz Tingkat Nasional",
    date: "15 Des 2024",
    prize: "Rp 10.000.000",
    category: "Tahfidz",
    image: "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "2",
    title: "Kompetisi Kaligrafi Islam",
    date: "20 Des 2024",
    prize: "Rp 5.000.000",
    category: "Seni",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "3",
    title: "Lomba Pidato Bahasa Arab",
    date: "25 Des 2024",
    prize: "Rp 7.500.000",
    category: "Bahasa",
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1000&q=80"
  }
];

const badgeStyles: Record<CompetitionItem["category"], string> = {
  Tahfidz: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Seni: "bg-purple-100 text-purple-700 border-purple-200",
  Bahasa: "bg-cyan-100 text-cyan-700 border-cyan-200",
  Lainnya: "bg-slate-100 text-slate-700 border-slate-200"
};

const Competitions = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Simulasi fetch user
    setUser({
      id: "user-123",
      full_name: "Rafaditya Syahputra",
      email: "rafaditya@irmaverse.local",
      avatar: "RS"
    });
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="h-10 w-10 text-teal-400 animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse">Memuat data lomba...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#FDFBF7]"
      style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}
    >
      <DashboardHeader/>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
                  Info Perlombaan
                </h1>
                <p className="text-slate-500 text-lg font-medium">
                  Tunjukkan bakatmu di ajang bergengsi ini! 🏆
                </p>
              </div>
              {session?.user?.role === "instruktur" && (
                <button
                  onClick={() => router.push("/competitions/create")}
                  className="px-6 py-3 rounded-2xl bg-teal-400 text-white font-black border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-[2px] transition-all shadow-lg hover:shadow-teal-200"
                >
                  + Tambah Lomba
                </button>
              )}
            </div>

            {/* Grid */}
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {competitions.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-[0_8px_0_0_#cbd5e1] hover:border-teal-400 hover:shadow-[0_8px_0_0_#34d399] transition-all duration-300 overflow-hidden group hover:-translate-y-2 flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative h-60 border-b-2 border-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Badge Category */}
                    <span
                      className={`absolute top-4 left-4 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wide border-2 shadow-sm ${badgeStyles[item.category]}`}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-black text-slate-800 leading-tight mb-4 group-hover:text-teal-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-500 font-bold">
                          <Calendar className="w-4 h-4 text-teal-400" />
                          <span>Tanggal</span>
                        </div>
                        <span className="text-slate-800 font-black">{item.date}</span>
                      </div>
                      
                      <div className="w-full h-px bg-slate-200 dashed"></div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-500 font-bold">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <span>Hadiah</span>
                        </div>
                        <span className="text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {item.prize}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => router.push(`/competitions/${item.id}`)}
                      className="w-full mt-auto py-3 rounded-2xl bg-teal-400 text-white font-black border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-teal-100"
                    >
                      <span>Lihat Detail Lomba</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ChatbotButton />
    </div>
  );
};

export default Competitions;