"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardHeader from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/Chatbot";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import CategoryFilter from "@/components/ui/CategoryFilter";
import SearchInput from "@/components/ui/SearchInput";
import Toast from "@/components/ui/Toast";
import Loading from "@/components/ui/Loading";
import {
  Upload,
  X,
  Calendar,
  Type,
  Sparkles,
  Save,
  ArrowLeft,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/InputText";
import { Textarea } from "@/components/ui/textarea";

const EditMaterial = () => {
  const router = useRouter();
  const params = useParams();
  const materialId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  // --- Invite State ---
  const [inviteInput, setInviteInput] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]); // New invites (emails)
  const [existingInvites, setExistingInvites] = useState<
    {
      email: string;
      name: string | null;
      avatar: string | null;
      status: string;
    }[]
  >([]); // Already invited users with status
  const [userOptions, setUserOptions] = useState<
    { value: string; label: string; avatar?: string; email: string }[]
  >([]);
  const [searchResults, setSearchResults] = useState<
    { value: string; label: string; avatar?: string; email: string }[]
  >([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  // Fetch Users List (untuk pencarian)
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

  // Fetch Existing Material Data
  useEffect(() => {
    async function fetchMaterial() {
      try {
        const res = await fetch(`/api/materials/${materialId}`);
        if (!res.ok) throw new Error("Gagal mengambil data kajian");
        const data = await res.json();

        // API may return either a single object or an array (older endpoints).
        const material = Array.isArray(data) ? data[0] : data;

        if (material) {
          // Normalize date to YYYY-MM-DD for the DatePicker
          let normalizedDate = "";
          if (material.date) {
            try {
              normalizedDate = String(material.date).slice(0, 10);
            } catch (e) {
              normalizedDate = material.date || "";
            }
          }

          setFormData({
            title: material.title || "",
            description: material.description || "",
            date: normalizedDate,
            time: material.startedAt || material.time || "",
            category: material.category || "Program Wajib",
            grade: material.grade || "Semua",
            thumbnailUrl: material.thumbnailUrl || "",
          });

          // Load existing invite details with status
          if (material.inviteDetails && Array.isArray(material.inviteDetails)) {
            setExistingInvites(
              material.inviteDetails.map((inv: any) => ({
                email: inv.email || "",
                name: inv.name || null,
                avatar: inv.avatar || null,
                status: inv.status || "pending",
              })),
            );
          }
          // New invites start empty (only newly added users)
          setInvitedUsers([]);
        }
      } catch (err: any) {
        console.error(err);
        showToast(err.message || "Tidak bisa memuat data kajian", "error");
      } finally {
        setLoading(false);
      }
    }

    if (materialId) {
      fetchMaterial();
    }
  }, [materialId]);

  // --- Handlers ---
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
          showToast(error.message || "Gagal mengunggah gambar", "error");
          return;
        }

        const data = await res.json();
        setFormData((prev) => ({ ...prev, thumbnailUrl: data.url }));
        showToast("Gambar berhasil diunggah", "success");
      } catch (error) {
        showToast("Gagal mengunggah gambar", "error");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSearchInvite = (query: string) => {
    setInviteInput(query);
    if (query.trim()) {
      const existingEmails = existingInvites.map((inv) => inv.email);
      const filtered = userOptions.filter(
        (u) =>
          (u.label.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())) &&
          !invitedUsers.includes(u.value) &&
          !existingEmails.includes(u.value),
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
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

    if (!formData.title.trim()) {
      showToast("Judul kajian tidak boleh kosong", "error");
      return;
    }
    if (!formData.description.trim()) {
      showToast("Deskripsi kajian tidak boleh kosong", "error");
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

    setSubmitting(true);
    try {
      // Only send newly added invites, existing invites are already tracked server-side
      const payload = { ...formData, invites: invitedUsers };

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
        } catch (e) {}
        throw new Error(errorMessage);
      }

      showToast("Kajian berhasil diperbarui. Mengalihkan...", "success");
      setTimeout(() => router.push(`/materials/${materialId}`), 1500);
    } catch (error: any) {
      console.error("Error updating material:", error);
      showToast(
        error.message || "Terjadi kesalahan saat memperbarui kajian",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loading text="Memuat data kajian..." size="lg" />
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

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {/* --- KOLOM KIRI: FORM UTAMA --- */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                {/* Card 1: Informasi Dasar */}
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

                {/* Card 2: Waktu Pelaksanaan */}
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

              {/* --- KOLOM KANAN: MEDIA & UNDANG PESERTA --- */}
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

                {/* --- INVITING SECTION (BARU) --- */}
                <div className="bg-white p-5 lg:p-6 rounded-3xl lg:rounded-[2.5rem] border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] lg:shadow-[0_8px_0_0_#cbd5e1]">
                  <h2 className="text-lg font-black text-slate-700 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-amber-500" /> Kelola Peserta
                  </h2>

                  <div className="space-y-3 lg:space-y-4">
                    {/* Existing Invites with Status */}
                    {existingInvites.length > 0 && (
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                          Peserta yang Sudah Diundang
                        </label>
                        <div className="bg-slate-50 rounded-2xl border-2 border-slate-100 p-3 space-y-2 max-h-48 overflow-y-auto">
                          {existingInvites.map((inv, idx) => {
                            const statusConfig: Record<
                              string,
                              {
                                label: string;
                                color: string;
                                icon: React.ReactNode;
                              }
                            > = {
                              pending: {
                                label: "Menunggu",
                                color:
                                  "bg-amber-100 text-amber-700 border-amber-200",
                                icon: <Clock className="w-3.5 h-3.5" />,
                              },
                              accepted: {
                                label: "Diterima",
                                color:
                                  "bg-emerald-100 text-emerald-700 border-emerald-200",
                                icon: <CheckCircle className="w-3.5 h-3.5" />,
                              },
                              rejected: {
                                label: "Ditolak",
                                color: "bg-red-100 text-red-700 border-red-200",
                                icon: <XCircle className="w-3.5 h-3.5" />,
                              },
                            };
                            const cfg =
                              statusConfig[inv.status] || statusConfig.pending;
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200"
                              >
                                <div className="flex items-center gap-2">
                                  {inv.avatar ? (
                                    <img
                                      src={inv.avatar}
                                      alt={inv.name || inv.email}
                                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                    />
                                  ) : (
                                    <span className="w-7 h-7 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 text-xs font-bold">
                                      {(inv.name || inv.email)
                                        .charAt(0)
                                        .toUpperCase()}
                                    </span>
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-700 truncate">
                                      {inv.name || inv.email}
                                    </p>
                                    {inv.name && (
                                      <p className="text-[10px] text-slate-400 truncate">
                                        {inv.email}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${cfg.color}`}
                                >
                                  {cfg.icon} {cfg.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Search for new invites */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                        Undang Peserta Baru
                      </label>
                      <div className="relative">
                        <SearchInput
                          placeholder="Cari nama atau email peserta..."
                          value={inviteInput}
                          onChange={(value) => handleSearchInvite(value)}
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
                      </div>
                    </div>

                    {/* New Invited Chips List */}
                    <div className="min-h-16 bg-slate-50 rounded-2xl border-2 border-slate-100 p-3">
                      {invitedUsers.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 text-xs font-bold py-2 text-center">
                          <Users className="w-6 h-6 mb-1 opacity-50" />
                          Cari dan tambah peserta baru di atas
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
                                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg bg-white border-2 border-teal-200 text-teal-700 text-[10px] lg:text-xs font-bold shadow-sm animate-in zoom-in duration-200 max-w-full"
                              >
                                {user?.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.label}
                                    className="w-6 h-6 rounded-full object-cover border border-teal-300"
                                  />
                                ) : (
                                  <span className="w-6 h-6 flex items-center justify-center bg-teal-100 rounded-full text-teal-500 font-bold">
                                    👤
                                  </span>
                                )}
                                <span className="truncate max-w-30">
                                  {user?.label || userEmail}
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[9px] bg-teal-50 text-teal-600 border border-teal-200">
                                  Baru
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl lg:rounded-3xl px-6 py-3 lg:py-4 border-2 lg:border-4 border-emerald-700 border-b-4 lg:border-b-8 shadow-[0_4px_0_0_#047857] active:translate-y-0.5 active:border-b-2 active:shadow-none transition-all flex items-center justify-center gap-2 lg:gap-3 text-sm lg:text-lg"
                >
                  {submitting ? (
                    <>
                      <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 animate-spin" />{" "}
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 lg:w-6 lg:h-6" /> Simpan
                      Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ChatbotButton />
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default EditMaterial;
