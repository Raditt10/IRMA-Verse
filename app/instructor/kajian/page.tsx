"use client";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Calendar, Clock, Users, Plus, Search, Tag, Sparkles } from "lucide-react";

interface Kajian {
  id: string;
  title: string;
  pemateri: string;
  summary: string;
  date: string;
  time: string;
  category: string;
  classLevel: string;
  participants: number;
  thumbnail?: string;
}

const defaultKajian: Kajian[] = [
  {
    id: "1",
    title: "Kedudukan Akal dan Wahyu",
    pemateri: "Ustadz Ahmad Zaki",
    summary: "Pengantar akal & wahyu untuk santri pemula",
    date: "2024-11-25",
    time: "13:00 - 15:00",
    category: "Program Wajib",
    classLevel: "Kelas 10",
    participants: 45,
    thumbnail: "https://picsum.photos/seed/kajian1/400/300"
  },
  {
    id: "2",
    title: "Fiqih Ibadah Sehari-hari",
    pemateri: "Ustadzah Fatimah",
    summary: "Fiqih dasar wudhu, shalat, dan thaharah",
    date: "2024-11-28",
    time: "14:00 - 16:00",
    category: "Program Wajib",
    classLevel: "Kelas 11",
    participants: 38,
    thumbnail: "https://picsum.photos/seed/kajian2/400/300"
  },
  {
    id: "3",
    title: "Tafsir Surah Al-Baqarah",
    pemateri: "Ustadz Muhammad Rizki",
    summary: "Pendalaman tafsir tematik Al-Baqarah",
    date: "2024-12-01",
    time: "15:00 - 17:00",
    category: "Program Next Level",
    classLevel: "Kelas 12",
    participants: 52,
    thumbnail: "https://picsum.photos/seed/kajian3/400/300"
  }
];

const programCategories = ["Program Wajib", "Program Ekstra", "Program Next Level"];
const classCategories = ["Kelas 10", "Kelas 11", "Kelas 12"];

const InstructorKajian = () => {
  const [user, setUser] = useState<any>(null);
  const [kajianList, setKajianList] = useState<Kajian[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    pemateri: "",
    summary: "",
    date: "",
    time: "",
    category: programCategories[0],
    classLevel: classCategories[0],
    thumbnail: ""
  });

  useEffect(() => {
    // Mock user
    setUser({
      id: "instructor-1",
      full_name: "Ustadz Ahmad Zaki",
      email: "ahmad.zaki@irmaverse.local",
      avatar: "AZ",
      role: "instructor"
    });
    setKajianList(defaultKajian);
  }, []);

  const filteredKajian = useMemo(() => {
    if (!search) return kajianList;
    const key = search.toLowerCase();
    return kajianList.filter(
      (k) =>
        k.title.toLowerCase().includes(key) ||
        k.pemateri.toLowerCase().includes(key) ||
        k.category.toLowerCase().includes(key)
    );
  }, [kajianList, search]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = () => {
    if (!form.title || !form.pemateri || !form.date || !form.time) return;
    const newKajian: Kajian = {
      id: (kajianList.length + 1).toString(),
      title: form.title,
      pemateri: form.pemateri,
      summary: form.summary || "-",
      date: form.date,
      time: form.time,
      category: form.category,
      classLevel: form.classLevel,
      participants: Math.floor(Math.random() * 30) + 20,
      thumbnail: form.thumbnail || "https://picsum.photos/seed/newkajian/400/300"
    };
    setKajianList((prev) => [newKajian, ...prev]);
    setForm({
      title: "",
      pemateri: "",
      summary: "",
      date: "",
      time: "",
      category: programCategories[0],
      classLevel: classCategories[0],
      thumbnail: ""
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100"
      style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}
    >
      <DashboardHeader />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <Sparkles className="h-4 w-4" />
                Kelola Kajian Anda
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-800 mb-1">Kelola & Buat Kajian</h1>
                <p className="text-slate-600 text-lg">Tambah jadwal kajian, materi, dan pemateri dalam satu tempat.</p>
              </div>
            </div>

            {/* CTA */}
            <Card className="p-5 border-slate-200 shadow-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Tambah Kajian Baru</h2>
                  <p className="text-sm text-slate-600">Klik untuk membuka formulir.</p>
                </div>
              </div>
              <Button
                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200"
                onClick={() => setShowForm((prev) => !prev)}
              >
                {showForm ? "Tutup Form" : "Buka Form"}
              </Button>
            </Card>

            {/* Form (hidden until CTA) */}
            {showForm && (
              <Card className="p-6 shadow-sm border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-slate-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Isi Detail Kajian</h2>
                    <p className="text-sm text-slate-600">Upload kajian setelah melengkapi data.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Judul Kajian</label>
                    <Input
                      value={form.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Contoh: Adab Menuntut Ilmu"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Pemateri</label>
                    <Input
                      value={form.pemateri}
                      onChange={(e) => handleChange("pemateri", e.target.value)}
                      placeholder="Nama pemateri"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Tanggal</label>
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Waktu</label>
                    <Input
                      value={form.time}
                      onChange={(e) => handleChange("time", e.target.value)}
                      placeholder="13:00 - 15:00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Thumbnail (opsional)</label>
                    <Input
                      value={form.thumbnail}
                      onChange={(e) => handleChange("thumbnail", e.target.value)}
                      placeholder="URL gambar"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Kategori</label>
                    <select
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                    >
                      {programCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Kelas</label>
                    <select
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={form.classLevel}
                      onChange={(e) => handleChange("classLevel", e.target.value)}
                    >
                      {classCategories.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Ringkasan</label>
                  <textarea
                    value={form.summary}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      handleChange("summary", e.target.value)
                    }
                    placeholder="Gambaran singkat materi kajian"
                    className="min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  />
                </div>

                {/* Link to invite page */}
                <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Undang Murid</h3>
                    <p className="text-sm text-slate-600">Kelola undangan murid di halaman khusus.</p>
                  </div>
                  <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    <a href="/instructor-dashboard/kajian/invite">Buka Halaman Undangan</a>
                  </Button>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button onClick={handleCreate} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200">
                    Upload Kajian
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setForm({
                      title: "",
                      pemateri: "",
                      summary: "",
                      date: "",
                      time: "",
                      category: programCategories[0],
                      classLevel: classCategories[0],
                      thumbnail: ""
                    })}
                  >
                    Reset
                  </Button>
                </div>
              </Card>
            )}

            {/* Filter & Search */}
            <Card className="p-5 border-slate-200">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-3 flex-wrap">
                  {programCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSearch(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                        search === cat
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari judul / pemateri"
                    className="pl-9"
                  />
                </div>
              </div>
            </Card>

            {/* List Kajian */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredKajian.map((k) => (
                <div
                  key={k.id}
                  className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-slate-200">
                    {k.thumbnail && (
                      <img
                        src={k.thumbnail}
                        alt={k.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                    {/* Category + Class Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                      <span className="px-4 py-1.5 rounded-full bg-light-green-500 text-white text-sm font-semibold shadow-lg">
                        {k.category}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 shadow-md">
                        {k.classLevel}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-light-green-600 transition-colors">
                      {k.title}
                    </h3>
                    <p className="text-slate-600 mb-4">{k.summary}</p>

                    {/* Info */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(k.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span>{k.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="h-4 w-4" />
                        <span>{k.participants} peserta terdaftar</span>
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => window.location.href = `/instructor-dashboard/kajian/${k.id}`}
                      className="w-full py-3 rounded-xl bg-linear-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Lihat Detail
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {filteredKajian.length === 0 && (
                <div className="col-span-full text-center text-slate-500 py-12">
                  Tidak ada kajian yang cocok.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <ChatbotButton />
    </div>
  );
};

export default InstructorKajian;
