"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Clock, ArrowLeft, Image as ImageIcon } from "lucide-react";

const CreateSchedule = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    date: "",
    time: "",
    location: "",
    pemateri: "",
    thumbnailUrl: "",
  });

  // Redirect if not instructor
  if (status === "authenticated" && session?.user?.role !== "instruktur") {
    router.push("/schedule");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Memuat...</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.pemateri) {
      alert("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create schedule");
      }

      const data = await response.json();
      alert("Jadwal berhasil dibuat!");
      router.push(`/schedule/${data.id}`);
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      alert(error.message || "Terjadi kesalahan saat membuat jadwal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12 lg:ml-0">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.push("/schedule")}
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 font-medium transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Jadwal
            </button>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-black text-slate-800 mb-2">
                Buat Jadwal Baru
              </h1>
              <p className="text-slate-600 text-lg">
                Tambahkan event atau kegiatan baru untuk peserta
              </p>
            </div>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Informasi Event</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                      Judul Event <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Contoh: Seminar Akhlak Pemuda"
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
                      Deskripsi Singkat <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Deskripsi singkat tentang event (maks 200 karakter)"
                      className="w-full min-h-[80px]"
                      maxLength={200}
                      required
                    />
                    <p className="text-xs text-slate-500">
                      {formData.description.length}/200 karakter
                    </p>
                  </div>

                  {/* Full Description */}
                  <div className="space-y-2">
                    <Label htmlFor="fullDescription" className="text-sm font-semibold text-slate-700">
                      Deskripsi Lengkap
                    </Label>
                    <Textarea
                      id="fullDescription"
                      name="fullDescription"
                      value={formData.fullDescription}
                      onChange={handleChange}
                      placeholder="Deskripsi lengkap tentang event, materi yang akan dibahas, dll."
                      className="w-full min-h-[150px]"
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-semibold text-slate-700">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Tanggal <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-sm font-semibold text-slate-700">
                        <Clock className="inline h-4 w-4 mr-1" />
                        Waktu <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="time"
                        name="time"
                        type="text"
                        value={formData.time}
                        onChange={handleChange}
                        placeholder="Contoh: 14:00 WIB"
                        className="w-full"
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-semibold text-slate-700">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Lokasi <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Contoh: Aula Utama"
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Pemateri */}
                  <div className="space-y-2">
                    <Label htmlFor="pemateri" className="text-sm font-semibold text-slate-700">
                      Pemateri <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pemateri"
                      name="pemateri"
                      type="text"
                      value={formData.pemateri}
                      onChange={handleChange}
                      placeholder="Contoh: Ustadz Ahmad Zaki"
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Thumbnail URL */}
                  <div className="space-y-2">
                    <Label htmlFor="thumbnailUrl" className="text-sm font-semibold text-slate-700">
                      <ImageIcon className="inline h-4 w-4 mr-1" />
                      URL Gambar Thumbnail
                    </Label>
                    <Input
                      id="thumbnailUrl"
                      name="thumbnailUrl"
                      type="url"
                      value={formData.thumbnailUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full"
                    />
                    <p className="text-xs text-slate-500">
                      Opsional. Jika tidak diisi, akan menggunakan gambar default.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => router.push("/schedule")}
                      className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 px-4 rounded-xl bg-linear-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                      {loading ? "Menyimpan..." : "Buat Jadwal"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ChatbotButton />
    </div>
  );
};

export default CreateSchedule;
