"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/Chatbot";
import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import Loading from "@/components/ui/Loading";
import DetailButton from "@/components/ui/DetailButton";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import CartoonNotification from "@/components/ui/Notification";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CalendarX
} from "lucide-react";
import AddButton from "@/components/ui/AddButton";

interface Schedule {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time?: string;
  location: string | null;
  pemateri: string | null;
  registeredCount?: number;
  status?: string;
  image?: string;
  category?: string;
}

const Schedule = () => {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  const statusOptions = ["Semua", "Segera hadir", "Sedang berlangsung", "Acara telah dilaksanakan"];

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [schedules, searchQuery, selectedStatus]);
  
  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/schedules");
      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }
      const data = await response.json();
      
      const mappedSchedules = data.map((schedule: any) => ({
        ...schedule,
        status: schedule.status === "segera_hadir" 
          ? "Segera hadir" 
          : schedule.status === "ongoing" 
          ? "Sedang berlangsung" 
          : "Acara telah dilaksanakan",
        thumbnail: schedule.thumbnailUrl || `https://picsum.photos/seed/event${schedule.id}/200/200`,
      }));
      
      setSchedules(mappedSchedules);
      setFilteredSchedules(mappedSchedules);
    } catch (error: any) {
      console.error("Error loading schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSchedules = () => {
    let filtered = schedules;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(schedule =>
        schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== "Semua") {
      filtered = filtered.filter(schedule => schedule.status === selectedStatus);
    }

    setFilteredSchedules(filtered);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    setScheduleToDelete(scheduleId);
    setShowConfirmDelete(true);
  };

  const confirmDeleteSchedule = async () => {
    if (!scheduleToDelete) return;

    setDeletingId(scheduleToDelete);
    try {
      const response = await fetch(`/api/schedules/${scheduleToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus jadwal");
      }

      setNotification({
        type: "success",
        title: "Berhasil!",
        message: "Jadwal berhasil dihapus",
      });
      setSchedules(schedules.filter(s => s.id !== scheduleToDelete));
      setShowConfirmDelete(false);
      setScheduleToDelete(null);
    } catch (error: any) {
      console.error("Error deleting schedule:", error);
      setNotification({
        type: "error",
        title: "Gagal!",
        message: error.message || "Terjadi kesalahan saat menghapus jadwal",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const { data: session } = useSession({
    required: false,
    onUnauthenticated() {
      window.location.href = "/auth";
    }
  });


  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-6 lg:px-8 py-12 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
                  Event & Kegiatan
                </h1>
                <p className="text-slate-500 text-lg font-medium">
                  Daftar event dan kegiatan rohani yang akan datang 
                </p>
              </div>
              {session?.user?.role === "instruktur" && (
                <AddButton
                  label="Tambahkan Event"
                  onClick={() => window.location.href = "/schedule/create"}
                  color="teal"
                />
              )}
            </div>

            {/* Filter & Search Bar */}
            {!loading && schedules.length > 0 && (
              <div className="grid gap-6 mb-8 lg:grid-cols-[1fr_auto]">
                <div className="space-y-4">
                  {/* Status Filter Buttons */}
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`px-4 lg:px-6 py-2 lg:py-3 rounded-full font-bold transition-all border-2 ${
                          selectedStatus === status
                            ? "bg-teal-500 text-white border-teal-600 shadow-[0_4px_0_0_#0d9488]"
                            : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 shadow-sm hover:shadow-md"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative w-full lg:w-80 self-start">
                  <SearchInput
                    placeholder="Cari event seru atau topik..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                  />
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-20">
                <Loading text="Memuat jadwal..." />
              </div>
            ) : schedules.length === 0 ? (
               <EmptyState
                 icon="calendar"
                 title="Yah, tidak ada event tersedia sekarang"
                 description="Belum ada kegiatan yang dijadwalkan. Cek lagi nanti ya!"
               />
            ) : filteredSchedules.length === 0 ? (
              <EmptyState
                icon="search"
                title="Yah, event tidak ditemukan..."
                description="Coba cari dengan kata kunci lain atau ubah filternya ya!"
                actionLabel="Reset Filter"
                onAction={() => {
                  setSearchQuery("");
                  setSelectedStatus("Semua");
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="bg-white rounded-4xl border-2 border-slate-200 shadow-[0_6px_0_0_#cbd5e1] hover:border-teal-400 hover:shadow-[0_6px_0_0_#34d399] transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-5 mb-5">
                        {/* Event Image */}
                        <div className="shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                          <img 
                            src={(schedule as any).thumbnail} 
                            alt={schedule.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {/* Status Badge */}
                          {schedule.status && (
                            <span className={`inline-block px-3 py-1 mb-2 rounded-lg text-[10px] font-black uppercase tracking-wide border-2 ${
                                schedule.status === "Segera hadir" || schedule.status === "Sedang berlangsung"
                                ? "bg-amber-100 text-amber-700 border-amber-200" 
                                : "bg-emerald-100 text-emerald-700 border-emerald-200"
                            }`}>
                              {schedule.status}
                            </span>
                          )}
                          
                          {/* Title */}
                          <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-teal-600 transition-colors line-clamp-2">
                            {schedule.title}
                          </h3>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border-2 border-slate-100">
                        <div className="flex items-center gap-3 text-sm text-slate-600 font-bold">
                          <Calendar className="h-4 w-4 text-teal-500" />
                          <span>
                            {new Date(schedule.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        
                        {schedule.time && (
                          <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                            <Clock className="h-4 w-4 text-teal-500" />
                            <span>{schedule.time}</span>
                          </div>
                        )}
                        
                        {schedule.location && (
                          <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                            <MapPin className="h-4 w-4 text-teal-500" />
                            <span className="truncate">{schedule.location}</span>
                          </div>
                        )}
                        
                        {schedule.registeredCount !== undefined && (
                          <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                            <Users className="h-4 w-4 text-teal-500" />
                            <span>{schedule.registeredCount} peserta</span>
                          </div>
                        )}
                      </div>

                      {/* Button */}
                      <DetailButton
                        role={session?.user?.role as any}
                        onClick={() => router.push(`/schedule/${schedule.id}`)}
                        onEdit={() => router.push(`/schedule/${schedule.id}/edit`)}
                        onDelete={() => handleDeleteSchedule(schedule.id)}
                        label="Lihat Detail"
                        editLabel="Edit"
                        deleteLabel={deletingId === schedule.id ? "Menghapus..." : "Hapus"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ChatbotButton />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        type="warning"
        title="Hapus Data?"
        message="Apakah Anda yakin ingin menghapus jadwal ini?"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isOpen={showConfirmDelete}
        onConfirm={confirmDeleteSchedule}
        onCancel={() => {
          setShowConfirmDelete(false);
          setScheduleToDelete(null);
        }}
      />

      {/* Notification */}
      {notification && (
        <CartoonNotification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={3000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Schedule;