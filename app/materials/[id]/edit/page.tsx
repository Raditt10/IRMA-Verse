"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardHeader from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/Chatbot";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import CategoryFilter from "@/components/ui/CategoryFilter";
import CartoonNotification from "@/components/ui/Notification";
import {
  Upload,
  X,
  Calendar,
  Type,
  Sparkles,
  Save,
  ArrowLeft,
} from "lucide-react";

const EditMaterial = () => {
  const router = useRouter();
  const params = useParams();
  const materialId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    date: "",
    time: "",
    category: "Program Wajib",
    grade: "Semua",
    thumbnailUrl: "",
  });

  // Fetch material data
  useEffect(() => {
    async function fetchMaterial() {
      try {
        const res = await fetch(`/api/materials?id=${materialId}`);
        if (!res.ok) throw new Error("Gagal mengambil data kajian");
        const data = await res.json();
        
        if (data && data.length > 0) {
          const material = data[0];
          // Map display labels back to form values
          const categoryMap: Record<string, string> = {
            "Program Wajib": "Program Wajib",
            "Program Ekstra": "Program Ekstra",
            "Program Next Level": "Program Next Level",
            "Program Susulan": "Program Susulan",
          };

          const gradeMap: Record<string, string> = {
            "Kelas 10": "Kelas 10",
            "Kelas 11": "Kelas 11",
            "Kelas 12": "Kelas 12",
          };

          setFormData({
            title: material.title || "",
            description: material.description || "",
            date: material.date || "",
            time: material.startedAt || "",
            category: material.category || "Program Wajib",
            grade: material.grade || "Semua",
            thumbnailUrl: material.thumbnailUrl || "",
          });
        }
      } catch (err: any) {
        console.error(err);
        setNotification({
          type: "error",
          title: "Gagal Memuat Data",
          message: err.message || "Tidak bisa memuat data kajian",
        });
      } finally {
        setLoading(false);
      }
    }

    if (materialId) {
      fetchMaterial();
    }
  }, [materialId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    // Frontend validation
    if (!formData.title.trim()) {
      setNotification({
        type: "warning",
        title: "Data Belum Lengkap",
        message: "Judul kajian tidak boleh kosong",
      });
      return;
    }
    if (formData.title.trim().length < 3) {
      setNotification({
        type: "warning",
        title: "Data Tidak Valid",
        message: "Judul kajian minimal 3 karakter",
      });
      return;
    }
    if (!formData.description.trim()) {
      setNotification({
        type: "warning",
        title: "Data Belum Lengkap",
        message: "Deskripsi kajian tidak boleh kosong",
      });
      return;
    }
    if (formData.description.trim().length < 10) {
      setNotification({
        type: "warning",
        title: "Data Tidak Valid",
        message: "Deskripsi kajian minimal 10 karakter",
      });
      return;
    }
    if (!formData.date) {
      setNotification({
        type: "warning",
        title: "Data Belum Lengkap",
        message: "Tanggal kajian harus dipilih",
      });
      return;
    }
    if (!formData.time) {
      setNotification({
        type: "warning",
        title: "Data Belum Lengkap",
        message: "Jam kajian harus dipilih",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...formData };
      console.log("Payload yang dikirim:", payload);

      const res = await fetch(`/api/materials/${materialId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = `HTTP Error: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Response is not JSON, use default error message
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await res.json();
      } catch (e) {
        // Response is not JSON but status was OK, treat as success
        data = null;
      }

      setNotification({
        type: "success",
        title: "Berhasil!",
        message: "Kajian berhasil diperbarui. Redirecting...",
      });
      setTimeout(() => router.push("/materials"), 2000);
    } catch (error: any) {
      console.error("Error updating material:", error);
      setNotification({
        type: "error",
        title: "Gagal Memperbarui Kajian",
        message: error.message || "Terjadi kesalahan saat memperbarui kajian",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-slate-500">Memuat data kajian...</p>
      </div>
    );
  }

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
                  Edit Jadwal Kajianmu
                </h1>
                <p className="text-slate-500 font-medium text-sm lg:text-lg">
                  Update detail kajian yang sudah dibuat.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* --- KOLOM KIRI: FORM UTAMA --- */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                <div className="bg-white p-5 lg:p-8 rounded-3xl lg:rounded-[2.5rem] border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] lg:shadow-[0_8px_0_0_#cbd5e1]">
                  <h2 className="text-lg lg:text-xl font-black text-slate-700 mb-4 lg:mb-6 flex items-center gap-2">
                    <Type className="h-5 w-5 lg:h-6 lg:w-6 text-teal-500" /> Informasi Dasar
                  </h2>

                  <div className="space-y-4 lg:space-y-6">
                    <div className="space-y-2">
                      <label className="block text-xs lg:text-sm font-bold text-slate-600 ml-1">
                        Judul Kajian
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Contoh: Tadabbur Alam & Quran"
                        className="w-full rounded-xl lg:rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 lg:px-5 lg:py-4 text-sm lg:text-base font-bold text-slate-700 focus:outline-none focus:border-teal-400 focus:bg-white focus:shadow-[0_4px_0_0_#34d399] transition-all placeholder:text-slate-400 placeholder:font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs lg:text-sm font-bold text-slate-600 ml-1">
                        Deskripsi & Materi
                      </label>
                      <textarea
                        name="description"
                        required
                        rows={5}
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Jelaskan apa yang akan dipelajari..."
                        className="w-full rounded-xl lg:rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 lg:px-5 lg:py-4 text-sm lg:text-base font-medium text-slate-700 focus:outline-none focus:border-teal-400 focus:bg-white focus:shadow-[0_4px_0_0_#34d399] transition-all placeholder:text-slate-400 resize-none"
                      />
                    </div>

                    <div className="pt-6 border-t-2 border-slate-100">
                      <CategoryFilter
                        categories={["Program Wajib", "Program Ekstra", "Program Next Level"]}
                        subCategories={["Kelas 10", "Kelas 11", "Kelas 12"]}
                        selectedCategory={formData.category}
                        selectedSubCategory={formData.grade}
                        onCategoryChange={(val) => setFormData({ ...formData, category: val })}
                        onSubCategoryChange={(val) => setFormData({ ...formData, grade: val })}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Waktu */}
                <div className="bg-white p-5 lg:p-8 rounded-3xl lg:rounded-[2.5rem] border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] lg:shadow-[0_8px_0_0_#cbd5e1]">
                  <h2 className="text-lg lg:text-xl font-black text-slate-700 mb-4 lg:mb-6 flex items-center gap-2">
                    <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-500" /> Waktu Pelaksanaan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <DatePicker
                      label="Tanggal Pelaksanaan"
                      value={formData.date}
                      onChange={(date) => setFormData({ ...formData, date })}
                      placeholder="Pilih tanggal"
                    />
                    <TimePicker
                      label="Jam Mulai"
                      value={formData.time}
                      onChange={(time) => setFormData({ ...formData, time })}
                    />
                  </div>
                </div>
              </div>

              {/* --- KOLOM KANAN: MEDIA --- */}
              <div className="space-y-6 lg:space-y-8">
                {/* Upload Thumbnail */}
                <div className="bg-white p-5 lg:p-6 rounded-3xl lg:rounded-[2.5rem] border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] lg:shadow-[0_8px_0_0_#cbd5e1] text-center">
                  <label className="block text-xs lg:text-sm font-bold text-slate-600 mb-3 lg:mb-4">
                    Thumbnail Kajian
                  </label>
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
                        <img
                          src={formData.thumbnailUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, thumbnailUrl: "" })
                          }
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="upload-thumb"
                        className="flex flex-col items-center justify-center w-full h-40 lg:h-48 rounded-2xl lg:rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 group-hover:border-teal-400 group-hover:bg-teal-50 transition-all"
                      >
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-teal-500 mb-2" />
                        <p className="text-xs lg:text-sm font-bold text-slate-500">
                          {uploading ? "Uploading..." : "Unggah Gambar"}
                        </p>
                      </label>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl lg:rounded-3xl px-6 py-3 lg:py-4 border-2 lg:border-4 border-emerald-700 border-b-4 lg:border-b-8 shadow-[0_4px_0_0_#047857] active:translate-y-0.5 active:border-b-2 active:shadow-none transition-all flex items-center justify-center gap-2 lg:gap-3 text-sm lg:text-lg"
                >
                  {submitting ? (
                    <>
                      <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 animate-spin" /> Memperbarui...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 lg:w-6 lg:h-6" /> Perbarui Kajian
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

export default EditMaterial;
