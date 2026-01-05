import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit2,
  Save,
  X,
  Award,
  Trophy,
  Star,
  Target,
  Flame,
  BookOpen,
  MessageCircle,
  BarChart3,
  Camera,
  ArrowLeft,
  ArrowRight,
  Clock3,
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    id: "user-123",
    full_name: "Rafaditya Syahputra",
    email: "rafaditya@irmaverse.local",
    phone: "+62 812 3456 7890",
    location: "Jakarta, Indonesia",
    bio: "Pembelajar aktif yang terus berkembang dalam memahami ajaran Islam. Senang berdiskusi dan berbagi ilmu dengan sesama.",
    join_date: "Januari 2024",
    avatar: "RS",
  });

  const [editedUser, setEditedUser] = useState(user);
  const avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatimah";

  const stats = {
    totalPoints: 2450,
    totalBadges: 8,
    totalQuizzes: 24,
    averageScore: 87,
    streak: 7,
    level: 5,
    rank: 12,
  };

  const programs = [
    { id: "1", title: "Kedudukan akal dan wahyu", duration: "3 bulan", level: "Program Wajib", status: "in-progress" },
    { id: "2", title: "Kursus Bahasa Arab", duration: "6 bulan", level: "Program Wajib", status: "done" },
    { id: "3", title: "Training Imam & Khatib", duration: "2 bulan", level: "Lanjutan", status: "in-progress" },
    { id: "4", title: "Tahsin & Tajwid Intensif", duration: "4 bulan", level: "Program Wajib", status: "done" },
    { id: "5", title: "Manajemen Masjid Modern", duration: "3 bulan", level: "Lanjutan", status: "upcoming" },
    { id: "6", title: "Media Dakwah Digital", duration: "5 bulan", level: "Program Wajib", status: "upcoming" },
  ] as const;

  const activities = [
    { type: "quiz", title: "Menyelesaikan Quiz Dasar Islam", date: "Hari ini, 14:30", points: "+50" },
    { type: "badge", title: "Mendapat Badge Konsisten", date: "Hari ini, 09:00", points: "+100" },
    { type: "discussion", title: "Berkomentar di Diskusi Sholat", date: "Kemarin, 20:15", points: "+20" },
    { type: "material", title: "Membaca Materi Tauhid", date: "Kemarin, 18:00", points: "+30" },
    { type: "level", title: "Naik ke Level 5", date: "2 hari lalu", points: "+200" },
  ];

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return <BarChart3 className="h-4 w-4" />;
      case "badge":
        return <Award className="h-4 w-4" />;
      case "discussion":
        return <MessageCircle className="h-4 w-4" />;
      case "material":
        return <BookOpen className="h-4 w-4" />;
      case "level":
        return <Trophy className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100"
      style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}
    >
      <DashboardHeader user={user} />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 px-6 lg:px-8 py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Kembali ke Dashboard</span>
          </button>

          {/* Profile Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Profile Saya</h1>
            <p className="text-lg text-slate-600">Kelola informasi dan preferensi akun Anda</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
                <div className="flex items-start justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Informasi Profile</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        Simpan
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Batal
                      </button>
                    </div>
                  )}
                </div>

                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      <AvatarImage src={avatarUrl} alt={user.full_name} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white text-2xl font-bold">
                        {user.full_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{user.full_name}</h3>
                    <p className="text-slate-600 mb-2">{user.email}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 text-white text-sm font-semibold">
                        Level {stats.level}
                      </span>
                      <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm font-bold shadow-[0_6px_18px_-8px_rgba(249,168,37,0.9)]">
                        Mashaallah
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
                        Peringkat #{stats.rank}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <User className="h-4 w-4" />
                        Nama Lengkap
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.full_name}
                          onChange={(e) => setEditedUser({ ...editedUser, full_name: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                      ) : (
                        <p className="px-4 py-3 rounded-lg bg-slate-50 text-slate-900">{user.full_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                      ) : (
                        <p className="px-4 py-3 rounded-lg bg-slate-50 text-slate-900">{user.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <Phone className="h-4 w-4" />
                        Nomor Telepon
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedUser.phone}
                          onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                      ) : (
                        <p className="px-4 py-3 rounded-lg bg-slate-50 text-slate-900">{user.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <MapPin className="h-4 w-4" />
                        Lokasi
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.location}
                          onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                      ) : (
                        <p className="px-4 py-3 rounded-lg bg-slate-50 text-slate-900">{user.location}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <User className="h-4 w-4" />
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editedUser.bio}
                        onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                      />
                    ) : (
                      <p className="px-4 py-3 rounded-lg bg-slate-50 text-slate-900">{user.bio}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Calendar className="h-4 w-4" />
                      Bergabung Sejak
                    </label>
                    <p className="px-4 py-3 rounded-lg bg-slate-50 text-slate-900">{user.join_date}</p>
                  </div>
                </div>
              </div>

              {/* Activity History */}
              <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Aktivitas Terbaru</h2>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-slate-700">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{activity.title}</p>
                        <p className="text-sm text-slate-500">{activity.date}</p>
                      </div>
                      <span className="text-emerald-600 font-bold">{activity.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Badges */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Statistik</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50">
                    <div className="flex items-center gap-3">
                      <Trophy className="h-5 w-5 text-slate-700" />
                      <span className="text-sm font-semibold text-slate-700">Total Poin</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{stats.totalPoints}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-slate-700" />
                      <span className="text-sm font-semibold text-slate-700">Badge</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{stats.totalBadges}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-slate-700" />
                      <span className="text-sm font-semibold text-slate-700">Quiz</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{stats.totalQuizzes}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-red-50 to-pink-50">
                    <div className="flex items-center gap-3">
                      <Flame className="h-5 w-5 text-slate-700" />
                      <span className="text-sm font-semibold text-slate-700">Streak</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{stats.streak} Hari</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-slate-700" />
                      <span className="text-sm font-semibold text-slate-700">Rata-rata</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{stats.averageScore}%</span>
                  </div>
                </div>
              </div>

              {/* Programs Card */}
              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Program Kurikulum yang saya tuntaskan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {programs
                    .filter((program) => program.status === "done")
                    .map((program) => {
                    return (
                      <div
                        key={program.id}
                        className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm hover:shadow-md transition-all min-h-[190px]"
                      >
                        <div className="flex flex-col gap-4 pr-24">
                          <p className="text-base font-semibold text-slate-900 leading-snug">{program.title}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
                            <span className="flex items-center gap-1">
                              <Clock3 className="h-4 w-4 text-slate-700" />
                              {program.duration}
                            </span>
                            <span className="text-slate-700 font-medium">{program.level}</span>
                          </div>
                        </div>

                        <button className="mt-6 w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-cyan-600 transition-colors">
                          <span>Lihat Detail</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
