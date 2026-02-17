"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/Chatbot";
import Toast from "@/components/ui/Toast";
import CartoonConfirmDialog from "@/components/ui/ConfirmDialog"; // Import Confirm Dialog
import Loading from "@/components/ui/Loading";
import {
  Calendar,
  MapPin,
  User,
  Clock,
  ArrowLeft,
  Mail,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Target,
  MessageCircle,
  Tag,
  Share2,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface InviteDetail {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  status: string;
  createdAt: string;
}

interface Material {
  id: string;
  title: string;
  description: string;
  date: string;
  startedAt: string;
  location: string;
  instructor: string;
  instructorAvatar?: string;
  category: string;
  grade: string;
  thumbnailUrl?: string;
  isJoined?: boolean;
  points?: string[];
  attendedAt?: string;
  inviteDetails?: InviteDetail[];
}

const MaterialDetail = () => {
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const router = useRouter();
  const params = useParams();
  const materialId = params.id as string;

  // 1. Session Check & Redirect
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    },
  });

  const isPrivileged =
    session?.user?.role === "instruktur" || session?.user?.role === "admin";

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    if (materialId) {
      fetchMaterialDetail();
    }
  }, [materialId]);

  const fetchMaterialDetail = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/materials/${materialId}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Kajian tidak ditemukan");
        }
        const err = await res
          .json()
          .catch(() => ({ error: "Gagal mengambil data" }));
        throw new Error(err.error || "Gagal mengambil data kajian");
      }

      const data = await res.json();

      const mapped: Material = {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.date,
        startedAt: data.startedAt || "",
        location: data.location || "",
        instructor: data.instructor || (data.instructorName ?? "TBA"),
        instructorAvatar: data.instructorAvatar || null,
        category: data.category || "",
        grade: data.grade || "",
        thumbnailUrl: data.thumbnailUrl || null,
        isJoined: data.isJoined ?? false,
        points: data.points || [],
        attendedAt: data.attendedAt || undefined,
        inviteDetails: data.inviteDetails || [],
      };

      setMaterial(mapped);
    } catch (error: any) {
      console.error("Error loading material:", error);
      showToast(error.message || "Gagal memuat detail kajian", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/materials/${materialId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal menghapus kajian");
      }

      showToast("Kajian berhasil dihapus", "success");
      setTimeout(() => router.push("/materials"), 1500);
    } catch (error: any) {
      console.error("Delete Error:", error);
      showToast(error.message || "Terjadi kesalahan saat menghapus", "error");
    } finally {
      setShowConfirmDelete(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    let style = "bg-slate-100 text-slate-700 border-slate-200";
    if (category === "Program Wajib")
      style = "bg-rose-100 text-rose-700 border-rose-200";
    if (category === "Program Ekstra")
      style = "bg-purple-100 text-purple-700 border-purple-200";
    if (category === "Program Next Level")
      style = "bg-amber-100 text-amber-700 border-amber-200";

    return (
      <div
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase border-2 shadow-sm ${style}`}
      >
        <Tag className="w-3.5 h-3.5" strokeWidth={3} />
        {category}
      </div>
    );
  };

  // --- STATE LOADING ---
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <DashboardHeader />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
            <Loading text="Sedang memuat detail kajian..." size="lg" />
          </div>
        </div>
      </div>
    );
  }

  // --- STATE DATA NOT FOUND ---
  if (!material) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <DashboardHeader />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-dashed border-slate-300 mb-6">
              <Target className="h-10 w-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-700 mb-2">
              Kajian Tidak Ditemukan
            </h2>
            <p className="text-slate-500 mb-6">
              Mungkin kajian ini sudah dihapus atau ID-nya salah.
            </p>
            <button
              onClick={() => router.push("/materials")}
              className="mt-4 px-6 py-3 rounded-xl bg-teal-400 text-white font-black border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-0.5 transition-all"
            >
              Kembali ke Daftar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-12 w-full max-w-[100vw] overflow-x-hidden">
          <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8">
            {/* Back Button */}
            <button
              onClick={() => router.push("/materials")}
              className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold transition-all group px-4 py-2 rounded-xl border-2 border-transparent hover:border-slate-200 hover:bg-white hover:shadow-sm"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform stroke-3" />
              Kembali
            </button>

            {/* --- HERO SECTION --- */}
            <div className="relative bg-white rounded-4xl lg:rounded-[2.5rem] border-2 border-slate-200 shadow-[0_8px_0_0_#cbd5e1] overflow-hidden group">
              <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden border-b-2 border-slate-200">
                <img
                  src={
                    material.thumbnailUrl || "https://picsum.photos/1200/600"
                  }
                  alt={material.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3 mb-3 lg:mb-4">
                    {getCategoryBadge(material.category)}
                    <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-white/90 text-slate-800 border-2 border-white uppercase tracking-wide backdrop-blur-sm">
                      Kelas: {material.grade}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-3 drop-shadow-md leading-tight">
                    {material.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* --- GRID LAYOUT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* LEFT COLUMN (Details) */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                {/* Quick Stats Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center mb-3 border-2 border-teal-100">
                      <Calendar
                        className="h-6 w-6 text-teal-500"
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Tanggal
                    </span>
                    <span className="text-slate-800 font-black text-sm px-2 leading-tight">
                      {new Date(material.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3 border-2 border-indigo-100">
                      <Clock
                        className="h-6 w-6 text-indigo-500"
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Waktu
                    </span>
                    <span className="text-slate-800 font-black text-sm px-2 leading-tight">
                      {material.startedAt} WIB
                    </span>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-3 border-2 border-rose-100">
                      <MapPin
                        className="h-6 w-6 text-rose-500"
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Lokasi
                    </span>
                    <span className="text-slate-800 font-black text-sm px-2 leading-tight">
                      {material.location}
                    </span>
                  </div>
                </div>

                {/* Deskripsi & Poin Pembahasan */}
                <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-[0_6px_0_0_#cbd5e1]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2.5 bg-blue-100 rounded-2xl border-2 border-blue-200">
                      <BookOpen
                        className="h-6 w-6 text-blue-600"
                        strokeWidth={3}
                      />
                    </div>
                    <h2 className="text-xl lg:text-2xl font-black text-slate-800">
                      Detail Materi
                    </h2>
                  </div>

                  <p className="text-slate-600 font-medium leading-relaxed mb-6 whitespace-pre-line text-sm md:text-base">
                    {material.description}
                  </p>

                  {material.points && material.points.length > 0 && (
                    <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                      <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-teal-500" />
                        Poin Pembahasan
                      </h3>
                      <ul className="space-y-3">
                        {material.points.map((point, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm font-semibold text-slate-600"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN (Instructor & CTA) */}
              <div className="space-y-6 lg:space-y-8">
                {/* Instructor Card */}
                <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-[0_6px_0_0_#cbd5e1] overflow-hidden p-6 lg:p-8 text-center">
                  <div className="w-28 h-28 mx-auto bg-slate-100 rounded-full mb-4 border-4 border-teal-100 overflow-hidden relative shadow-sm">
                    {material.instructorAvatar ? (
                      <img
                        src={material.instructorAvatar}
                        alt={material.instructor}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-teal-500 text-white">
                        <User className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-slate-800 leading-tight mb-1">
                    {material.instructor}
                  </h3>
                  <p className="text-teal-600 text-xs font-bold uppercase tracking-wider mb-6 bg-teal-50 inline-block px-3 py-1 rounded-full border border-teal-100">
                    Pemateri Kajian
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={() =>
                        router.push(
                          `/instructors/chat?name=${encodeURIComponent(material.instructor)}`,
                        )
                      }
                      className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-indigo-600 bg-indigo-500 text-white shadow-[0_4px_0_0_#4338ca] hover:bg-indigo-600 hover:shadow-[0_4px_0_0_#3730a3] active:translate-y-0.5 active:shadow-none transition-all group"
                    >
                      <MessageCircle
                        className="w-5 h-5 group-hover:animate-bounce"
                        strokeWidth={3}
                      />
                      <span className="font-black">Chat Pemateri</span>
                    </button>

                    <button className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-600 hover:bg-white hover:shadow-sm transition-all bg-white">
                      <Share2 className="w-5 h-5" strokeWidth={2.5} />
                      <span className="font-bold text-sm">Bagikan Kajian</span>
                    </button>
                  </div>
                </div>

                {/* Invite Status Card - Instructor Only */}
                {isPrivileged &&
                  material.inviteDetails &&
                  material.inviteDetails.length > 0 && (
                    <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-[0_6px_0_0_#cbd5e1] overflow-hidden p-6 lg:p-8">
                      <h3 className="text-lg font-black text-slate-800 mb-1 flex items-center gap-2">
                        <Users className="w-5 h-5 text-amber-500" /> Status
                        Undangan
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold mb-4">
                        {
                          material.inviteDetails.filter(
                            (i) => i.status === "accepted",
                          ).length
                        }{" "}
                        diterima ·{" "}
                        {
                          material.inviteDetails.filter(
                            (i) => i.status === "pending",
                          ).length
                        }{" "}
                        menunggu ·{" "}
                        {
                          material.inviteDetails.filter(
                            (i) => i.status === "rejected",
                          ).length
                        }{" "}
                        ditolak
                      </p>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {material.inviteDetails.map((inv) => {
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
                              key={inv.id}
                              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {inv.avatar ? (
                                  <img
                                    src={inv.avatar}
                                    alt={inv.name || inv.email}
                                    className="w-8 h-8 rounded-full object-cover border-2 border-slate-200"
                                  />
                                ) : (
                                  <span className="w-8 h-8 flex items-center justify-center bg-slate-200 rounded-full text-slate-500 text-xs font-bold">
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
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 ${cfg.color}`}
                              >
                                {cfg.icon} {cfg.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* CTA / Action Box */}
                {isPrivileged ? (
                  <div className="bg-slate-50 rounded-[2.5rem] p-6 text-center border-2 border-slate-200 border-dashed">
                    <p className="text-slate-500 text-sm font-bold mb-4">
                      Kelola Kajian Ini
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() =>
                          router.push(`/materials/${material.id}/edit`)
                        }
                        className="w-full py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold hover:border-amber-400 hover:text-amber-600 transition-all shadow-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setShowConfirmDelete(true)}
                        className="w-full py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold hover:border-red-400 hover:text-red-600 transition-all shadow-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-linear-to-br from-teal-400 to-cyan-400 rounded-[2.5rem] p-6 lg:p-8 text-white border-2 border-teal-600 shadow-[0_6px_0_0_#0f766e] text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>

                    <h3 className="text-2xl font-black mb-2 relative z-10">
                      Siap Hadir?
                    </h3>
                    <p className="text-teal-50 text-sm font-bold mb-6 leading-relaxed relative z-10">
                      Jangan lupa isi absensi saat kegiatan berlangsung untuk
                      mencatat kehadiranmu.
                    </p>
                    <button
                      onClick={() =>
                        router.push(`/materials/${material.id}/attendance`)
                      }
                      className="w-full py-4 rounded-2xl bg-white text-teal-600 font-black border-2 border-teal-100 shadow-lg hover:bg-teal-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative z-10"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Isi Absensi
                    </button>
                  </div>
                )}
              </div>
            </div>
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

      {/* Confirm Dialog */}
      <CartoonConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Hapus Kajian?"
        message="Apakah Anda yakin ingin menghapus kajian ini? Tindakan ini tidak dapat dibatalkan."
        type="warning"
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />
    </div>
  );
};

export default MaterialDetail;
