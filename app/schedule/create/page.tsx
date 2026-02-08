"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/Chatbot";
import CartoonNotification from "@/components/ui/Notification";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import { Input } from "@/components/ui/InputText";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Clock, ArrowLeft, Upload, X, Save, Sparkles, Type } from "lucide-react";

const CreateSchedule = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Notification State
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    date: "",
    time: "",
    location: "",
    penanggungjawab: "",
    thumbnailUrl: "",
  });

  // Redirect if not instructor
  if (status === "authenticated" && session?.user?.role !== "instruktur") {
    router.push("/schedule");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!res.ok) {
          const error = await res.json();
          setNotification({
            type: "error",
            title: "Gagal Mengunggah",
            message: error.message || "Gagal mengunggah gambar",
          });
          return;
        }
        
        const data = await res.json();
        setFormData((prev) => ({ ...prev, thumbnailUrl: data.url }));
        setNotification({
          type: "success",
          title: "Berhasil!",
          message: "Gambar berhasil diunggah",
        });
      } catch (error) {
        setNotification({
          type: "error",
          title: "Gagal Mengunggah",
          message: "Gagal mengunggah gambar",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Detailed validation
    if (!formData.title.trim()) {
      setNotification({
        type: "warning",
        title: "Data Belum Lengkap",
        message: "Judul jadwal tidak boleh kosong",
      });
      return;
    }
    if (formData.title.trim().length < 3) {
      setNotification({
        type: "warning",
        title: "Data Tidak Valid",
        message: "Judul jadwal minimal 3 karakter",
      });
      return;
    }
    if (!formData.description.trim()) {
      setNotification({
        type: "warning",
        title: "Data Belum Lengkap",
        message: "Deskripsi jadwal tidak boleh kosong",
      });
      return;
    }
    if (!formData.date) {
      setNotification({
        type: "warning",
        title: "Data Belum Lengkap",
        message: "Tanggal jadwal harus dipilih",
      });
      return;
    }
    if (!formData.time) {
      setNotification({
        type: "warning",
        title: "Data Belum Lengkap",
        message: "Jam jadwal harus dipilih",
      });
      return;
    }
    if (!formData.location.trim()) {
      setNotification({
        type: "warning",
        title: "Data Belum Lengkap",
        message: "Lokasi jadwal tidak boleh kosong",
      });
      return;
    }
    if (!formData.penanggungjawab.trim()) {
      setNotification({
        type: "warning",
        title: "Data Belum Lengkap",
        message: "Penanggung jawab tidak boleh kosong",
      });
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
        throw new Error(error.error || "Gagal membuat jadwal");
      }

      const data = await response.json();
      setNotification({
        type: "success",
        title: "Berhasil!",
        message: "Jadwal berhasil dibuat. Redirecting...",
      });
      setTimeout(() => router.push(`/schedule/${data.id}`), 2000);
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      setNotification({
        type: "error",
        title: "Gagal Membuat Jadwal",
        message: error.message || "Terjadi kesalahan saat membuat jadwal",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <DashboardHeader />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-12 w-full max-w-[100vw] overflow-hidden">
          <div className="max-w-5xl mx-auto">
            {/* Header & Back Button */}
            <div className="flex flex-col gap-4 lg:gap-6 mb-6 lg:mb-8">
              <button
                onClick={() => router.back()}
                className="self-start inline-flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-500 font-bold hover:border-teal-400 hover:text-teal-600 hover:shadow-[0_4px_0_0_#cbd5e1] active:translate-y-0.5 active:shadow-none transition-all text-sm lg:text-base"
              >
                <ArrowLeft className="h-4 w-4 lg:h-5 lg:w-5" strokeWidth={3} />
                Kembali
              </button>
              <div>
                <h1 className="text-2xl lg:text-4xl font-black text-slate-800 tracking-tight mb-2 flex items-center gap-2 lg:gap-3">
                  Buat Jadwal Event
                </h1>
                <p className="text-slate-500 font-medium text-sm lg:text-lg">
                  Isi detail event dan upload gambar thumbnail.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* --- KOLOM KIRI: FORM UTAMA --- */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                {/* Card Informasi Dasar */}
                <div className="bg-white p-5 lg:p-8 rounded-3xl lg:rounded-[2.5rem] border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] lg:shadow-[0_8px_0_0_#cbd5e1]">
                  <h2 className="text-lg lg:text-xl font-black text-slate-700 mb-4 lg:mb-6 flex items-center gap-2">
                    <Type className="h-5 w-5 lg:h-6 lg:w-6 text-teal-500" /> Informasi Dasar
                  </h2>

                  <div className="space-y-4 lg:space-y-6">
                    <div className="space-y-2">
                      <label className="block text-xs lg:text-sm font-bold text-slate-600 ml-1">Judul Event</label>
                      <Input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Contoh: Seminar Akhlak Pemuda"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs lg:text-sm font-bold text-slate-600 ml-1">Deskripsi Singkat</label>
                      <Textarea
                        name="description"
                        required
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Jelaskan tentang event ini..."
                        maxLength={200}
                      />
                      <p className="text-xs text-slate-500 ml-1">{formData.description.length}/200 karakter</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs lg:text-sm font-bold text-slate-600 ml-1">Deskripsi Lengkap</label>
                      <Textarea
                        name="fullDescription"
                        rows={5}
                        value={formData.fullDescription}
                        onChange={handleChange}
                        placeholder="Deskripsi lengkap tentang event, materi yang akan dibahas, dll."
                      />
                    </div>
                  </div>
                </div>

                {/* Card Waktu & Tempat */}
                <div className="bg-white p-5 lg:p-8 rounded-3xl lg:rounded-[2.5rem] border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] lg:shadow-[0_8px_0_0_#cbd5e1]">
                  <h2 className="text-lg lg:text-xl font-black text-slate-700 mb-4 lg:mb-6 flex items-center gap-2">
                    <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-500" /> Waktu & Lokasi
                  </h2>
                  <div className="space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      <DatePicker
                        label="Tanggal Event"
                        value={formData.date}
                        onChange={(date) =>
                          setFormData({ ...formData, date })
                        }
                        placeholder="Pilih tanggal"
                      />
                      <TimePicker
                        label="Jam Mulai"
                        value={formData.time}
                        onChange={(time) =>
                          setFormData({ ...formData, time })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex text-xs lg:text-sm font-bold text-slate-600 ml-1 items-center gap-1">
                        <MapPin className="h-4 w-4" /> Lokasi
                      </label>
                      <Input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Contoh: Aula Utama"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs lg:text-sm font-bold text-slate-600 ml-1">Penanggung jawab</label>
                      <Input
                        type="text"
                        name="penanggungjawab"
                        required
                        value={formData.penanggungjawab}
                        onChange={handleChange}
                        placeholder="Contoh: Ustadz Ahmad Zaki"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* --- KOLOM KANAN: UPLOAD GAMBAR --- */}
              <div className="space-y-6 lg:space-y-8">
                {/* Upload Thumbnail */}
                <div className="bg-white p-5 lg:p-6 rounded-3xl lg:rounded-[2.5rem] border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] lg:shadow-[0_8px_0_0_#cbd5e1] text-center">
                  <label className="block text-xs lg:text-sm font-bold text-slate-600 mb-3 lg:mb-4">Thumbnail Event</label>
                  <div className="relative group cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="upload-thumb"
                    />
                    {formData.thumbnailUrl ? (
                      <div className="relative w-full h-40 lg:h-48 rounded-2xl lg:rounded-3xl overflow-hidden border-2 border-slate-200 group-hover:border-teal-400 transition-all">
                        <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setFormData((prev) => ({ ...prev, thumbnailUrl: "" }));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                        >
                          <X className="w-3 h-3 lg:w-4 lg:h-4" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="upload-thumb"
                        className="flex flex-col items-center justify-center w-full h-40 lg:h-48 rounded-2xl lg:rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-teal-50 hover:border-teal-400 transition-all cursor-pointer"
                      >
                        {uploading ? (
                          <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-teal-400 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 lg:w-8 lg:h-8 text-slate-400 mb-2 group-hover:text-teal-500" />
                            <span className="text-xs lg:text-sm font-bold text-slate-400">Klik untuk Upload</span>
                          </>
                        )}
                      </label>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 lg:py-4 rounded-2xl bg-teal-400 text-white font-black text-base lg:text-lg border-2 border-teal-600 border-b-4 lg:border-b-6 hover:bg-teal-500 active:border-b-2 active:translate-y-1 transition-all shadow-lg lg:shadow-xl hover:shadow-teal-200 flex items-center justify-center gap-2 lg:gap-3 disabled:opacity-70 disabled:cursor-not-allowed mb-8"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 lg:w-6 lg:h-6" /> Buat Jadwal
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ChatbotButton />

      {/* Notification */}
      {notification && (
        <CartoonNotification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.type === "success" ? 3000 : 5000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default CreateSchedule;
