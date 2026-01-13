"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Award,
  Trophy,
  Star,
  Target,
  Flame,
  BookOpen,
  MessageCircle,
  BarChart3,
  ArrowLeft,
  ArrowRight,
  Clock3,
} from "lucide-react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ProfileInformationForm from "./_components/ProfileInformationForm";

const Profile = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/auth";
    },
  });

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
      className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100"
      style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}
    >
      {session?.user && <DashboardHeader />}

      <div className="flex">
        <Sidebar />

        <div className="flex-1 px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link
            href="/overview"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Kembali ke Dashboard</span>
          </Link>

          {/* Profile Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Profile Saya</h1>
            <p className="text-lg text-slate-600">Kelola informasi dan preferensi akun Anda</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <ProfileInformationForm stats={stats || 0} level={stats.level || 0} rank={stats.rank || 0} />

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
                    <div className="flex items-center justify-between p-4 rounded-lg bg-linear-to-br from-amber-50 to-orange-50">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-5 w-5 text-slate-700" />
                        <span className="text-sm font-semibold text-slate-700">Total Poin</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900">{stats.totalPoints}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-linear-to-br from-blue-50 to-cyan-50">
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-slate-700" />
                        <span className="text-sm font-semibold text-slate-700">Badge</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900">{stats.totalBadges}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-linear-to-br from-purple-50 to-pink-50">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-slate-700" />
                        <span className="text-sm font-semibold text-slate-700">Quiz</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900">{stats.totalQuizzes}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-linear-to-br from-red-50 to-pink-50">
                      <div className="flex items-center gap-3">
                        <Flame className="h-5 w-5 text-slate-700" />
                        <span className="text-sm font-semibold text-slate-700">Streak</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900">{stats.streak} Hari</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-linear-to-br from-green-50 to-emerald-50">
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

                          <button className="mt-6 w-full py-2.5 rounded-lg bg-linear-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-cyan-600 transition-colors">
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