import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import ChatbotButton from "@/components/ChatbotButton";
import { UserCircle2, MessageCircle } from "lucide-react";

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

  useEffect(() => {
    loadUser();
    fetchMembers();
  }, []);

  const loadUser = async () => {
    setUser({
      id: "user-123",
      full_name: "Rafaditya Syahputra",
      email: "rafaditya@irmaverse.local",
      avatar: "RS"
    });
  };

  const fetchMembers = async () => {
    try {
      const mockMembers: Member[] = [
        {
          id: "1",
          name: "Ahmad Syarif",
          role: "Ketua IRMA",
          class: "XII IPA 1",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
          points: 850,
          status: "Aktif"
        },
        {
          id: "2",
          name: "Fatimah Zahra",
          role: "Sekretaris",
          class: "XII IPA 2",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatimah",
          points: 780,
          status: "Aktif"
        },
        {
          id: "3",
          name: "Muhammad Rizki",
          role: "Bendahara",
          class: "XII IPS 1",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rizki",
          points: 720,
          status: "Aktif"
        },
        {
          id: "4",
          name: "Aisyah Putri",
          role: "Koordinator Kajian",
          class: "XI IPA 3",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisyah",
          points: 690,
          status: "Aktif"
        },
        {
          id: "5",
          name: "Abdullah Aziz",
          role: "Koordinator Event",
          class: "XI IPA 2",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abdullah",
          points: 650,
          status: "Aktif"
        },
        {
          id: "6",
          name: "Khadijah",
          role: "Anggota",
          class: "XI IPS 1",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Khadijah",
          points: 580,
          status: "Aktif"
        }
      ];
      setMembers(mockMembers);
    } catch (error: any) {
      console.error("Error fetching members:", error);
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
                Daftar Anggota
              </h1>
              <p className="text-slate-600 text-lg">
                Anggota aktif IRMA Verse dan kontribusi mereka
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Memuat anggota...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                  >
                    <div className="p-6">
                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-teal-100 shadow-lg">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full ring-2 ring-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
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
                        <p className="text-slate-500 text-sm">
                          {member.class}
                        </p>
                      </div>

                      {/* Points & Status */}
                      <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Poin Keaktifan</p>
                          <p className="text-2xl font-bold text-teal-600">{member.points}</p>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                          {member.status}
                        </div>
                      </div>

                      {/* Button */}
                      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                        <UserCircle2 className="h-5 w-5" />
                        Lihat Profile
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

export default Members;
