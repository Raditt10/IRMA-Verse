import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import DashboardHeader from "@/components/ui/DashboardHeader";
import ChatbotButton from "@/components/ui/ChatbotButton";
import {
  Trophy,
  Medal,
  Crown,
  Search,
  Filter,
  ArrowUp,
  Minus,
  ArrowDown,
  Sparkles,
  ShieldCheck
} from "lucide-react";

// Mock Data (Nanti bisa diganti dengan fetch dari Database Prisma)
// Di real case, kamu akan query: await prisma.user.findMany({ orderBy: { points: 'desc' } })
const MOCK_LEADERBOARD = [
  { id: "1", name: "Ahmad Syarif", role: "Ketua", points: 5240, avatarId: 10, badges: 15, trend: "up" },
  { id: "2", name: "Fatimah Zahra", role: "Sekretaris", points: 4950, avatarId: 22, badges: 12, trend: "up" },
  { id: "3", name: "Rizki Pratama", role: "Anggota", points: 4100, avatarId: 35, badges: 10, trend: "down" },
  { id: "4", name: "Siti Aminah", role: "Anggota", points: 3850, avatarId: 41, badges: 9, trend: "stable" },
  { id: "5", name: "Budi Santoso", role: "Anggota", points: 3200, avatarId: 55, badges: 8, trend: "up" },
  { id: "6", name: "Dewi Sartika", role: "Bendahara", points: 2900, avatarId: 64, badges: 7, trend: "down" },
  { id: "7", name: "Rafaditya S.", role: "Admin", points: 2450, avatarId: 70, badges: 8, trend: "up" }, // Asumsi ini user yang login
  { id: "8", name: "Hendra Gunawan", role: "Anggota", points: 2100, avatarId: 82, badges: 5, trend: "stable" },
  { id: "9", name: "Maya Putri", role: "Anggota", points: 1800, avatarId: 91, badges: 4, trend: "down" },
  { id: "10", name: "Eko Kurniawan", role: "Anggota", points: 1500, avatarId: 100, badges: 3, trend: "stable" },
];

const LeaderboardPage = async () => {
  const session = await auth();
  if (!session?.user) redirect("/auth");

  // Fetch current user untuk highlighting
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    select: { id: true, name: true, email: true },
  });

  if (!currentUser) redirect("/auth");

  // Pisahkan Top 3 dan Sisanya
  const topThree = MOCK_LEADERBOARD.slice(0, 3);
  const restOfUsers = MOCK_LEADERBOARD.slice(3);

  // Helper untuk Icon Trend
  const TrendIcon = ({ type }: { type: string }) => {
    if (type === "up") return <ArrowUp className="w-4 h-4 text-emerald-500" />;
    if (type === "down") return <ArrowDown className="w-4 h-4 text-rose-500" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div 
      className="min-h-screen bg-slate-50/50" 
      style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}
    >
      <DashboardHeader />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          
          {/* Header Page */}
          <div className="text-center mb-10 space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 md:w-10 md:h-10 text-amber-500 fill-amber-500" />
              Papan Peringkat
            </h1>
            <p className="text-slate-500 font-bold">Siapakah Santri Paling Aktif Minggu Ini?</p>
          </div>

          {/* --- TOP 3 PODIUM SECTION --- */}
          <div className="flex justify-center items-end gap-4 md:gap-8 mb-12 min-h-[320px]">
            
            {/* JUARA 2 (Kiri) */}
            <div className="relative group order-1 md:order-1">
               <div className="flex flex-col items-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-slate-300 shadow-xl overflow-hidden mb-[-20px] z-20 relative group-hover:scale-110 transition-transform">
                     <img src={`https://picsum.photos/200/200?random=${topThree[1].avatarId}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-gradient-to-b from-slate-200 to-slate-300 w-24 md:w-32 h-40 rounded-t-2xl flex flex-col items-center justify-start pt-8 pb-4 shadow-lg relative z-10 border-t border-white/50">
                     <div className="bg-slate-100 text-slate-600 font-black text-xl w-8 h-8 rounded-full flex items-center justify-center shadow-inner mb-2">2</div>
                     <p className="font-bold text-slate-700 text-sm text-center px-2 line-clamp-1">{topThree[1].name}</p>
                     <p className="text-xs font-bold text-slate-500 mt-1">{topThree[1].points} Pts</p>
                  </div>
               </div>
            </div>

            {/* JUARA 1 (Tengah - Paling Tinggi) */}
            <div className="relative group order-2 md:order-2 -mt-10">
               <div className="absolute -top-14 left-1/2 -translate-x-1/2 animate-bounce">
                  <Crown className="w-10 h-10 text-amber-400 fill-amber-400 drop-shadow-lg" />
               </div>
               <div className="flex flex-col items-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-amber-400 shadow-2xl shadow-amber-400/30 overflow-hidden mb-[-25px] z-20 relative group-hover:scale-110 transition-transform">
                     <img src={`https://picsum.photos/200/200?random=${topThree[0].avatarId}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-gradient-to-b from-amber-300 to-amber-500 w-28 md:w-40 h-52 rounded-t-3xl flex flex-col items-center justify-start pt-10 pb-4 shadow-xl shadow-amber-500/20 relative z-10 border-t border-white/50">
                     <div className="bg-white/90 text-amber-600 font-black text-2xl w-10 h-10 rounded-full flex items-center justify-center shadow-inner mb-3">1</div>
                     <p className="font-bold text-white text-base md:text-lg text-center px-2 line-clamp-1">{topThree[0].name}</p>
                     <div className="bg-black/10 px-3 py-1 rounded-full mt-1">
                        <p className="text-sm font-black text-white">{topThree[0].points} Pts</p>
                     </div>
                  </div>
               </div>
            </div>


            <div className="relative group order-3 md:order-3">
               <div className="flex flex-col items-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-orange-300 shadow-xl overflow-hidden mb-[-20px] z-20 relative group-hover:scale-110 transition-transform">
                     <img src={`https://picsum.photos/200/200?random=${topThree[2].avatarId}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-gradient-to-b from-orange-200 to-orange-300 w-24 md:w-32 h-32 rounded-t-2xl flex flex-col items-center justify-start pt-8 pb-4 shadow-lg relative z-10 border-t border-white/50">
                     <div className="bg-orange-100 text-orange-700 font-black text-xl w-8 h-8 rounded-full flex items-center justify-center shadow-inner mb-2">3</div>
                     <p className="font-bold text-orange-900 text-sm text-center px-2 line-clamp-1">{topThree[2].name}</p>
                     <p className="text-xs font-bold text-orange-800 mt-1">{topThree[2].points} Pts</p>
                  </div>
               </div>
            </div>
          </div>

          {/* --- MAIN LIST SECTION --- */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            
            {/* Filter / Search Bar */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-500" /> Semua Peringkat
              </h3>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input 
                      type="text" 
                      placeholder="Cari teman..." 
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-bold text-sm text-slate-600 placeholder:font-normal"
                   />
                </div>
                <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                   <Filter className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider text-center sm:text-left">
               <div className="col-span-2 sm:col-span-1 text-center">#</div>
               <div className="col-span-6 sm:col-span-5">User</div>
               <div className="col-span-2 hidden sm:block text-center">Badge</div>
               <div className="col-span-2 hidden sm:block text-center">Trend</div>
               <div className="col-span-4 sm:col-span-2 text-right pr-4">Poin</div>
            </div>

            {/* List Items */}
            <div className="divide-y divide-slate-100">
              {restOfUsers.map((user, index) => {
                const rank = index + 4;
                // Cek apakah ini user yang sedang login (untuk highlight)
                // Di sini saya pakai nama "Rafaditya S." sebagai simulasi user login
                const isCurrentUser = user.name.includes("Rafaditya"); 

                return (
                  <div 
                    key={user.id} 
                    className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-slate-50 ${isCurrentUser ? 'bg-teal-50/60' : ''}`}
                  >
                     {/* Rank */}
                     <div className="col-span-2 sm:col-span-1 flex justify-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${isCurrentUser ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                           {rank}
                        </div>
                     </div>

                     {/* Profile */}
                     <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100 shrink-0">
                           <img src={`https://picsum.photos/200/200?random=${user.avatarId}`} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <p className={`font-bold text-sm line-clamp-1 ${isCurrentUser ? 'text-teal-700' : 'text-slate-700'}`}>
                              {user.name} {isCurrentUser && <span className="text-[10px] bg-teal-100 text-teal-600 px-1.5 py-0.5 rounded ml-1">Kamu</span>}
                           </p>
                           <p className="text-xs text-slate-400 font-bold">{user.role}</p>
                        </div>
                     </div>

                     {/* Badges */}
                     <div className="col-span-2 hidden sm:flex justify-center items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-bold text-slate-600">{user.badges}</span>
                     </div>

                     {/* Trend */}
                     <div className="col-span-2 hidden sm:flex justify-center items-center">
                        <TrendIcon type={user.trend} />
                     </div>

                     {/* Points */}
                     <div className="col-span-4 sm:col-span-2 text-right pr-4">
                        <span className="font-black text-slate-800">{user.points}</span>
                        <span className="text-xs text-slate-400 font-bold ml-1">XP</span>
                     </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination / Load More */}
            <div className="p-4 border-t border-slate-100 text-center">
               <button className="text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline transition-all">
                  Muat Lebih Banyak
               </button>
            </div>

          </div>

          {/* User Sticky Rank (Mobile Only) - Jika user berada di posisi bawah */}
          <div className="xl:hidden fixed bottom-20 left-4 right-4 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 z-30">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-black text-sm">
                   12
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
                   {/* Avatar User Login */}
                   <div className="w-full h-full bg-slate-500 flex items-center justify-center font-bold">RS</div>
                </div>
                <div>
                   <p className="font-bold text-sm">Rafaditya S.</p>
                   <p className="text-xs text-slate-400 font-bold">Posisi Kamu</p>
                </div>
             </div>
             <div className="text-right">
                <span className="font-black text-lg">2,450</span>
                <span className="text-xs text-slate-400 font-bold ml-1">XP</span>
             </div>
          </div>

        </main>
      </div>

      <ChatbotButton />
    </div>
  );
};

export default LeaderboardPage; 