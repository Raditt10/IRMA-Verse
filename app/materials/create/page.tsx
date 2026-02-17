"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import BackButton from "@/components/ui/BackButton";
import ChatbotButton from "@/components/ui/Chatbot";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import { Input } from "@/components/ui/InputText";
import { Textarea } from "@/components/ui/textarea";
import CategoryFilter from "@/components/ui/CategoryFilter";
import SearchInput from "@/components/ui/SearchInput";
import Toast from "@/components/ui/Toast"; // Menggunakan Toast baru
import {
  Upload,
  X,
  Plus,
  Calendar,
  Type,
  Users,
  Sparkles,
  Save,
  ArrowLeft,
} from "lucide-react";

const CreateMaterial = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    category: "Program Wajib",
    grade: "Semua",
    thumbnailUrl: "",
  });

  const [inviteInput, setInviteInput] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [userOptions, setUserOptions] = useState<
    { value: string; label: string; avatar?: string; email: string }[]
  >([]);
  const [searchResults, setSearchResults] = useState<
    { value: string; label: string; avatar?: string; email: string }[]
  >([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Helper Toast
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Gagal mengambil data user");
        const data = await res.json();
        const formattedUsers = data.map((u: any) => ({
          value: u.email,
          label: u.name || u.email,
          avatar: u.avatar,
          email: u.email,
        }));
        setUserOptions(formattedUsers);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, []);

  const handleSearchInvite = (query: string) => {
    setInviteInput(query);
    if (query.trim()) {
      const filtered = userOptions.filter(
        (u) =>
          (u.label.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())) &&
          !invitedUsers.includes(u.value),
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
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
          showToast(error.error || "Gagal mengunggah gambar", "error");
          return;
        }

        const data = await res.json();
        setFormData((prev) => ({ ...prev, thumbnailUrl: data.url }));
        showToast("Gambar berhasil diunggah", "success");
      } catch (error: any) {
        showToast("Terjadi kesalahan saat mengunggah gambar", "error");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddInvite = (userEmail: string) => {
    if (!invitedUsers.includes(userEmail)) {
      setInvitedUsers([...invitedUsers, userEmail]);
    }
    setInviteInput("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleRemoveInvite = (index: number) => {
    setInvitedUsers(invitedUsers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.title.trim()) {
      showToast("Judul kajian tidak boleh kosong", "error");
      return;
    }
    if (formData.title.trim().length < 3) {
      showToast("Judul kajian minimal 3 karakter", "error");
      return;
    }
    if (!formData.description.trim()) {
      showToast("Deskripsi kajian tidak boleh kosong", "error");
      return;
    }
    if (formData.description.trim().length < 10) {
      showToast("Deskripsi kajian minimal 10 karakter", "error");
      return;
    }
    if (!formData.date) {
      showToast("Tanggal kajian harus dipilih", "error");
      return;
    }
    if (!formData.time) {
      showToast("Jam kajian harus dipilih", "error");
      return;
    }
    if (invitedUsers.length === 0) {
      showToast("Minimal 1 anggota harus diundang ke dalam kajian", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, invites: invitedUsers };

      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = `HTTP Error: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      showToast("Kajian berhasil dibuat. Mengalihkan...", "success");

      // PERUBAHAN DI SINI: Redirect ke /materials
      setTimeout(() => router.push("/materials"), 1500);
    } catch (error: any) {
      console.error("Error creating material:", error);
      showToast(
        error.message || "Terjadi kesalahan saat membuat kajian",
        "error",
      );
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
                  Buat Jadwal Kajianmu
                </h1>
                <p className="text-slate-500 font-medium text-sm lg:text-lg">
                  Isi detail kajian kamu dan undang peserta kajian.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {/* --- KOLOM KIRI: FORM UTAMA --- */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                <div className="bg-white p-5 lg:p-8 rounded-3xl lg:rounded-[2.5rem] border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] lg:shadow-[0_8px_0_0_#cbd5e1]">
                  <h2 className="text-lg lg:text-xl font-black text-slate-700 mb-4 lg:mb-6 flex items-center gap-2">
                    <Type className="h-5 w-5 lg:h-6 lg:w-6 text-teal-500" />{" "}
                    Informasi Dasar
                  </h2>

                  <div className="space-y-4 lg:space-y-6">
                    <div className="space-y-2">
                      <label className="block text-xs lg:text-sm font-bold text-slate-600 ml-1">
                        Judul Kajian
                      </label>
                      <Input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Contoh: Tadabbur Alam & Quran"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs lg:text-sm font-bold text-slate-600 ml-1">
                        Deskripsi & Materi
                      </label>
                      <Textarea
                        name="description"
                        required
                        rows={5}
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Jelaskan apa yang akan dipelajari..."
                      />
                    </div>

                    {/* --- CATEGORY FILTER --- */}
                    <div className="pt-6 border-t-2 border-slate-100">
                      <CategoryFilter
                        categories={[
                          "Program Wajib",
                          "Program Ekstra",
                          "Program Next Level",
                        ]}
                        subCategories={["Kelas 10", "Kelas 11", "Kelas 12"]}
                        selectedCategory={formData.category}
                        selectedSubCategory={formData.grade}
                        onCategoryChange={(val) =>
                          setFormData({ ...formData, category: val })
                        }
                        onSubCategoryChange={(val) =>
                          setFormData({ ...formData, grade: val })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Card Waktu & Tempat */}
                <div className="bg-white p-5 lg:p-8 rounded-3xl lg:rounded-[2.5rem] border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] lg:shadow-[0_8px_0_0_#cbd5e1]">
                  <h2 className="text-lg lg:text-xl font-black text-slate-700 mb-4 lg:mb-6 flex items-center gap-2">
                    <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-500" />{" "}
                    Waktu Pelaksanaan
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

              {/* --- KOLOM KANAN: MEDIA & INVITE --- */}
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
                          onClick={(e) => {
                            e.preventDefault();
                            setFormData((prev) => ({
                              ...prev,
                              thumbnailUrl: "",
                            }));
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
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
                            <span className="text-xs lg:text-sm font-bold text-slate-400">
                              Klik untuk Upload
                            </span>
                          </>
                        )}
                      </label>
                    )}
                  </div>
                </div>

                {/* --- INVITING SECTION --- */}
                <div className="bg-white p-5 lg:p-6 rounded-3xl lg:rounded-[2.5rem] border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] lg:shadow-[0_8px_0_0_#cbd5e1]">
                  <h2 className="text-lg font-black text-slate-700 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-amber-500" /> Undang Peserta{" "}
                    <span className="text-red-400 text-sm">(wajib min. 1)</span>
                  </h2>

                  <div className="space-y-3 lg:space-y-4">
                    <div className="relative">
                      <SearchInput
                        placeholder="Cari nama atau email peserta..."
                        value={inviteInput}
                        onChange={(value) => {
                          handleSearchInvite(value);
                        }}
                        className="w-full"
                      />

                      {/* Search Results Dropdown */}
                      {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-amber-200 rounded-2xl shadow-lg z-10 max-h-64 overflow-y-auto">
                          {searchResults.map((user) => (
                            <button
                              key={user.value}
                              type="button"
                              onClick={() => handleAddInvite(user.value)}
                              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-amber-50 border-b border-amber-100 last:border-b-0 transition-colors text-left"
                            >
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.label}
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-700">
                                  {user.label.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="flex-1 text-left">
                                <p className="font-bold text-slate-700 text-sm">
                                  {user.label}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {user.email}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {showSearchResults &&
                        inviteInput &&
                        searchResults.length === 0 && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-amber-200 rounded-2xl shadow-lg z-10 p-4 text-center">
                            <p className="text-sm text-slate-500 font-semibold">
                              Tidak ada peserta yang cocok
                            </p>
                          </div>
                        )}
                    </div>

                    {/* Invited Chips List */}
                    <div className="min-h-20 lg:min-h-25 bg-slate-50 rounded-2xl border-2 border-slate-100 p-3">
                      {invitedUsers.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 text-xs lg:text-sm font-bold py-2 lg:py-4 text-center">
                          <Users className="w-6 h-6 lg:w-8 lg:h-8 mb-1 opacity-50" />
                          Belum ada peserta
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {invitedUsers.map((userEmail, idx) => {
                            const user = userOptions.find(
                              (u) => u.value === userEmail,
                            );
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg bg-white border-2 border-amber-200 text-amber-700 text-[10px] lg:text-xs font-bold shadow-sm animate-in zoom-in duration-200 max-w-full"
                              >
                                {user?.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.label}
                                    className="w-6 h-6 rounded-full object-cover border border-amber-300"
                                  />
                                ) : (
                                  <span className="w-6 h-6 flex items-center justify-center bg-amber-100 rounded-full text-amber-500 font-bold">
                                    👤
                                  </span>
                                )}
                                <span className="truncate max-w-30">
                                  {user?.label || userEmail}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveInvite(idx)}
                                  className="p-0.5 hover:bg-red-100 hover:text-red-500 rounded-md transition-colors shrink-0"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 lg:py-4 rounded-2xl bg-teal-400 text-white font-black text-base lg:text-lg border-2 border-teal-600 border-b-4 lg:border-b-6 hover:bg-teal-500 active:border-b-2 active:translate-y-1 transition-all shadow-lg lg:shadow-xl hover:shadow-teal-200 flex items-center justify-center gap-2 lg:gap-3 disabled:opacity-70 disabled:cursor-not-allowed mb-8"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 animate-spin" />{" "}
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 lg:w-6 lg:h-6" /> Terbitkan
                      Kajian
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ChatbotButton />

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default CreateMaterial;
