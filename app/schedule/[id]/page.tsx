"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, User, Clock, Users, ArrowLeft, Phone, Mail, MessageCircle, Award } from "lucide-react";

// Import gambar WhatsApp
import Image from "next/image";

interface Schedule {
  id: string;
  title: string;
  description: string | null;
  fullDescription?: string | null;
  date: string;
  time?: string;
  location: string | null;
  pemateri: string | null;
  pemateriAvatar?: string | null;
  pemateriSpecialization?: string | null;
  status?: string;
  image?: string;
  instructorId?: string;
}

const ScheduleDetail = () => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const scheduleId = params.id as string;

  useEffect(() => {
    if (scheduleId) {
      fetchScheduleDetail();
    }
  }, [scheduleId]);

  const fetchScheduleDetail = async () => {
    try {
      const response = await fetch(`/api/schedules/${scheduleId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch schedule");
      }
      const data = await response.json();
      
      // Map status from database to display format
      const mappedSchedule = {
        ...data,
        instructorId: data.instructorId,
        status: data.status === "segera_hadir" 
          ? "Segera hadir" 
          : data.status === "ongoing" 
          ? "Sedang berlangsung" 
          : "Acara telah dilaksanakan",
        pemateriAvatar: data.instructor?.name 
          ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.instructor.name}`
          : null,
        pemateriSpecialization: data.instructor?.bidangKeahlian || "Instruktur",
        image: data.thumbnailUrl || `https://picsum.photos/seed/event${data.id}/800/400`,
      };
      
      setSchedule(mappedSchedule);
    } catch (error) {
      console.error("Error loading schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, string> = {
      "Segera hadir": "bg-emerald-100 text-emerald-700 border-emerald-200",
      "Sedang berlangsung": "bg-blue-100 text-blue-700 border-blue-200",
      "Acara telah dilaksanakan": "bg-slate-100 text-slate-600 border-slate-200"
    };

    const color = statusConfig[status] || statusConfig["Segera hadir"];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
        <DashboardHeader />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center py-12">
                <p className="text-slate-500">Memuat detail event...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
        <DashboardHeader />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-5xl mx-auto">
              <button
                onClick={() => router.push('/schedule')}
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </button>
              <Card className="text-center py-12">
                <CardContent className="space-y-4">
                  <p className="text-slate-600 text-lg">Event tidak ditemukan</p>
                  <p className="text-sm text-slate-500">ID: {scheduleId}</p>
                  <button
                    onClick={() => router.push('/schedule')}
                    className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    Lihat Semua Event
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <ChatbotButton />
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <button
              onClick={() => router.push('/schedule')}
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Jadwal
            </button>

            {/* Hero Image & Title */}
            <Card className="overflow-hidden">
              <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden bg-linear-to-br from-teal-500 to-cyan-600">
                <img
                  src={schedule.image || "https://picsum.photos/seed/event1/1200/600"}
                  alt={schedule.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                  <div className="mb-3">
                    {getStatusBadge(schedule.status || "")}
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                    {schedule.title}
                  </h1>
                  <p className="text-slate-100 text-sm sm:text-base max-w-2xl">
                    {schedule.description}
                  </p>
                </div>
              </div>
            </Card>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Event Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Detail Event</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                        <Calendar className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Tanggal</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {new Date(schedule.date).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      {schedule.time && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                          <Clock className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">Waktu</p>
                            <p className="text-sm font-semibold text-slate-800">{schedule.time}</p>
                          </div>
                        </div>
                      )}

                      {schedule.location && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                          <MapPin className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">Lokasi</p>
                            <p className="text-sm font-semibold text-slate-800">{schedule.location}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Description Section */}
                {schedule.fullDescription && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">Tentang Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 leading-relaxed text-base">
                        {schedule.fullDescription}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Instructor Contact */}
              <div className="space-y-6">
                <Card className="overflow-hidden border-slate-200 shadow-sm">
                  <div className="p-8 text-center">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        {schedule.pemateriAvatar ? (
                          <img
                            src={schedule.pemateriAvatar}
                            alt={schedule.pemateri || "Pemateri"}
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-teal-100 shadow-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-linear-to-br from-teal-500 to-cyan-600 p-0.5 flex items-center justify-center">
                            <User className="h-12 w-12 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name & Specialization */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-slate-800 mb-1">
                        {schedule.pemateri || "-"}
                      </h3>
                      <p className="text-slate-600 text-sm font-semibold">
                        {schedule.pemateriSpecialization || "Instruktur"}
                      </p>
                    </div>

                    {/* Contact Section Title */}
                    <p className="text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
                      Hubungi instruktur untuk informasi lebih lanjut
                    </p>

                    {/* Contact Buttons */}
                    <div className="space-y-3">
                      <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors group"
                      >
                        <div className="p-2 bg-green-500 text-white rounded-lg shrink-0">
                          <Image
                            src="/WhatsApp.svg.webp"
                            alt="WhatsApp"
                            width={20}
                            height={20}
                            className="h-5 w-5 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs text-slate-600 font-medium">WhatsApp</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">+62 812-3456-7890</p>
                        </div>
                        <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </a>

                      <a
                        href="mailto:instruktur@irmaverse.local"
                        className="flex items-center gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors group"
                      >
                        <div className="p-2 bg-blue-500 text-white rounded-lg shrink-0">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs text-slate-600 font-medium">Email</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">instruktur@irmaverse.local</p>
                        </div>
                        <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </a>

                      <a
                        href="tel:+6281234567890"
                        className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors group"
                      >
                        <div className="p-2 bg-slate-600 text-white rounded-lg shrink-0">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs text-slate-600 font-medium">Telepon</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">+62 812-3456-7890</p>
                        </div>
                        <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </Card>

                {/* Info Note */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-semibold text-amber-900 mb-1">Informasi Penting!</p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Hubungi instruktur untuk detail materi dan persiapan yang diperlukan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetail;
