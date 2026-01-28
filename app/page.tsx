"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import SearchBar from "@/components/ui/SearchBar";
import {
  ArrowRight,
  Award,
  BarChart,
  Bell,
  BookOpen,
  Calendar,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Facebook,
  Heart,
  Instagram,
  MapPin,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Youtube,
  Zap,
} from "lucide-react";

export default function Home() {
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [latestNews, setLatestNews] = useState<Array<{ id: string; title: string; category: string | null; deskripsi?: string; slug: string; image?: string | null }>>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  
  // State untuk Galeri
  const [currentSlide, setCurrentSlide] = useState(0);

  // Data Gambar Galeri
  const galleryItems = [
    {
      src: "https://picsum.photos/seed/kegiatan1/800/400",
      title: "Kajian Akbar Bulanan",
      description: "Serunya belajar bersama ustadz tamu di Masjid Sekolah."
    },
    {
      src: "https://picsum.photos/seed/kegiatan2/800/400",
      title: "Rihlah Alam Terbuka",
      description: "Mentadaburi alam sambil mempererat ukhuwah antar anggota."
    },
    {
      src: "https://picsum.photos/seed/kegiatan3/800/400",
      title: "Latihan Marawis",
      description: "Persiapan penampilan untuk acara perpisahan sekolah."
    },
    {
      src: "https://picsum.photos/seed/kegiatan4/800/400",
      title: "Bakti Sosial IRMA",
      description: "Berbagi kebahagiaan dengan masyarakat sekitar sekolah."
    }
  ];

  // Auto slide logic
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setGalleryLoading(true);
      setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [galleryItems.length]);

  const nextSlide = () => {
    setGalleryLoading(true);
    setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
  };

  const prevSlide = () => {
    setGalleryLoading(true);
    setCurrentSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const features = [
    {
      icon: Bell,
      title: "Pengumuman",
      description: "Dapatkan informasi terbaru tentang kegiatan IRMA",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: "Jadwal Kajian",
      description: "Lihat jadwal kajian per kelas dan materi",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: BookOpen,
      title: "Kajian Mingguan",
      description: "Akses materi kajian yang telah dirangkum",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      title: "Anggota & Pengurus",
      description: "Kenali pengurus IRMA SMK Negeri 13 Bandung",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Award,
      title: "Prestasi",
      description: "Catat dan lihat prestasi anggota IRMA",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: BarChart,
      title: "Rating Pemateri",
      description: "Berikan feedback untuk pemateri kajian",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Terorganisir dengan Baik",
      description:
        "Sistem yang terstruktur untuk mengelola seluruh kegiatan IRMA dengan efisien",
    },
    {
      icon: Clock,
      title: "Hemat Waktu",
      description:
        "Akses informasi kapan saja, di mana saja tanpa perlu hadir secara fisik",
    },
    {
      icon: TrendingUp,
      title: "Tracking Progress",
      description:
        "Pantau perkembangan pembelajaran dan pencapaian pribadi secara real-time",
    },
    {
      icon: Heart,
      title: "Komunitas Solid",
      description: "Membangun ikatan yang kuat dengan sesama anggota IRMA",
    },
  ];

  const today = new Date();
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const tanggalStr = `${hari[today.getDay()]}, ${today.getDate()} ${
    bulan[today.getMonth()]
  } ${today.getFullYear()}`;

  const [userLocation, setUserLocation] = useState<string>("Lokasi tidak diketahui");
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            setUserLocation(
              data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.state ||
                data.display_name ||
                "Lokasi ditemukan"
            );
          } catch {
            setUserLocation("Lokasi ditemukan");
          }
        },
        () => setUserLocation("Lokasi tidak diketahui")
      );
    }
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setNewsLoading(true);
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (Array.isArray(data)) {
          setLatestNews(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to load news", error);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-500 text-white relative" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}>
      {/* Background patterns */}
      <div
        className="absolute inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22), transparent 38%), radial-gradient(circle at 78% 12%, rgba(59,130,246,0.28), transparent 32%), radial-gradient(circle at 68% 72%, rgba(16,185,129,0.42), transparent 32%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative w-full">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 text-sm text-white/80 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="text-xs sm:text-sm">{tanggalStr}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-white/70">
            <MapPin className="h-4 w-4" />
            <span>{userLocation}</span>
          </div>
        </div>

        {/* Header & Hero Section */}
        <div className="flex flex-col gap-4 pb-12">
          {/* Navbar */}
          <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 sm:gap-3 hover:scale-105 transition-transform duration-300">
              
              {/* LOGO TANPA CARD */}
              <img 
                src="/logo.png" 
                alt="IRMA Verse" 
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain drop-shadow-md" 
              />
              
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-white/70 font-bold">Platform Rohis</p>
                <h1 className="text-lg sm:text-2xl font-bold leading-tight" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.1)" }}>IRMA Verse</h1>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-white/90">
              {['Beranda', 'Profil', 'Informasi', 'Galeri', 'FAQ', 'Kontak'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="hover:text-white hover:scale-110 transition-all hover:drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]">
                  {item}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 text-white/70">
                <Instagram className="h-5 w-5 hover:scale-125 transition-transform cursor-pointer hover:text-white" />
                <Youtube className="h-5 w-5 hover:scale-125 transition-transform cursor-pointer hover:text-white" />
                <Facebook className="h-5 w-5 hover:scale-125 transition-transform cursor-pointer hover:text-white" />
              </div>
              <Link href="/auth">
                <Button
                  size="sm"
                  variant="secondary"
                  className="relative overflow-hidden px-5 sm:px-7 py-2 text-sm font-bold rounded-2xl border-b-[4px] border-emerald-600 bg-white text-emerald-700 shadow-xl group transition-all duration-200 active:border-b-0 active:translate-y-1 hover:brightness-110"
                >
                  <span className="flex items-center gap-2 z-10 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span>Login</span>
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 border-2 border-white/30 text-white text-xs sm:text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transform -rotate-1 hover:rotate-0 transition-all">
                Official Website <span className="text-emerald-100 bg-emerald-600 px-1 rounded">IRMA13</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm sm:text-base font-bold text-white/80 tracking-wide">ROHIS DIGITAL SEKOLAH</p>
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.15)]">
                  IRMA <span className="bg-gradient-to-r from-emerald-200 via-white to-cyan-200 bg-clip-text text-transparent">VERSE</span>
                </h2>
              </div>

              <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed max-w-lg drop-shadow-sm">
                Platform digital yang menghubungkan seluruh anggota IRMA dengan sistem terorganisir, modern, dan efisien untuk pembelajaran Islami yang lebih baik.
              </p>

              <div className="w-full max-w-md bg-white/20 rounded-2xl p-2 border-2 border-white/20 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] backdrop-blur-sm">
                <SearchBar />
              </div>

              <Card className="bg-white border-[3px] border-emerald-200 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] p-4 max-w-[280px] sm:max-w-xs transform hover:scale-105 hover:-rotate-1 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-50 rounded-2xl border-2 border-slate-100">
                    <img src="/logo13.png" alt="SMKN 13" className="h-10 w-auto object-contain" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-tight">Platform Ekskul</p>
                    <p className="text-sm font-bold text-slate-800">SMKN 13 Bandung</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Hero Image Model Fixed: HIDDEN ON MOBILE (hidden lg:flex) */}
            <div className="relative mt-8 lg:mt-0 hidden lg:flex justify-center lg:justify-end">
               <div className="absolute inset-0 bg-emerald-400/20 blur-[80px] rounded-full pointer-events-none" />
               <img
                src="/model.png"
                alt="Role model IRMA"
                className="relative h-[300px] sm:h-[400px] lg:h-[600px] w-auto object-contain z-0 hover:scale-105 transition-transform duration-500"
                style={{ 
                  filter: "drop-shadow(5px 5px 0px #ffffff) drop-shadow(15px 15px 0px rgba(0,0,0,0.25))" 
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Icons Section */}
      <section className="py-20 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2 sm:mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">Fitur Tersedia</h2>
            <p className="text-lg text-slate-600 font-medium">Berbagai fitur yang memudahkan aktivitas IRMA Anda</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center gap-3 group cursor-pointer">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] bg-white border-[3px] border-emerald-100 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)] group-hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,0.3)] group-hover:-translate-y-2 group-hover:rotate-3 transition-all duration-300">
                  <feature.icon className="h-7 w-7 sm:h-9 sm:w-9 text-slate-700 group-hover:text-emerald-600 transition-colors duration-300 stroke-[2.5px]" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-700 text-center leading-tight group-hover:text-emerald-600">
                  {feature.title}
                </p>
              </div>
            ))}

            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-20 h-20 rounded-[1.5rem] bg-white border-[3px] border-emerald-100 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)] group-hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,0.3)] group-hover:-translate-y-2 group-hover:-rotate-3 transition-all duration-300">
                <Zap className="h-9 w-9 text-slate-700 group-hover:text-emerald-600 transition-colors duration-300 stroke-[2.5px]" />
              </div>
              <p className="text-sm font-bold text-gray-700 text-center leading-tight">Event Terbaru</p>
            </div>

            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-20 h-20 rounded-[1.5rem] bg-white border-[3px] border-emerald-100 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)] group-hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,0.3)] group-hover:-translate-y-2 group-hover:rotate-3 transition-all duration-300">
                <Target className="h-9 w-9 text-slate-700 group-hover:text-emerald-600 transition-colors duration-300 stroke-[2.5px]" />
              </div>
              <p className="text-sm font-bold text-gray-700 text-center leading-tight">Program Kurikulum</p>
            </div>

            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-20 h-20 rounded-[1.5rem] bg-white border-[3px] border-emerald-100 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)] group-hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,0.3)] group-hover:-translate-y-2 group-hover:-rotate-3 transition-all duration-300">
                <CalendarDays className="h-9 w-9 text-slate-700 group-hover:text-emerald-600 transition-colors duration-300 stroke-[2.5px]" />
              </div>
              <p className="text-sm font-bold text-gray-700 text-center leading-tight">Absensi Kajian</p>
            </div>

            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-20 h-20 rounded-[1.5rem] bg-white border-[3px] border-emerald-100 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)] group-hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,0.3)] group-hover:-translate-y-2 group-hover:rotate-3 transition-all duration-300">
                <Heart className="h-9 w-9 text-slate-700 group-hover:text-emerald-600 transition-colors duration-300 stroke-[2.5px]" />
              </div>
              <p className="text-sm font-bold text-gray-700 text-center leading-tight">Fitur Keren Lainnya</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-white/20 border-2 border-white/30 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] backdrop-blur-md transform rotate-2">
              <Target className="h-5 w-5 text-emerald-300 animate-pulse stroke-[3px]" />
              <span className="text-sm font-extrabold text-white uppercase tracking-wider">Keunggulan</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
              Mengapa Memilih <span className="bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">IRMAVerse?</span>
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
              Rasakan pengalaman berbeda dalam mengelola kegiatan organisasi Islami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="group relative p-8 rounded-[2rem] bg-white/10 backdrop-blur-md border-[3px] border-white/20 hover:border-emerald-300 hover:bg-white/20 transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:rotate-1">
                <div className="relative">
                  <div className="inline-flex p-4 rounded-2xl bg-white/20 mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 border-2 border-white/10">
                    <benefit.icon className="h-8 w-8 text-emerald-300 stroke-[2.5px]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed font-medium">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARTOON GALLERY SECTION */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-white/10 border-2 border-white/20 rounded-2xl backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transform -rotate-2 hover:rotate-0 transition-all duration-300">
              <Camera className="h-5 w-5 text-yellow-300 stroke-[3px]" />
              <span className="text-sm font-extrabold text-white uppercase tracking-wider">Dokumentasi</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
              Galeri <span className="bg-gradient-to-r from-yellow-200 to-amber-300 bg-clip-text text-transparent" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.2)" }}>Keseruan</span> Kami
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-bold">
              Intip momen-momen seru kegiatan IRMA yang penuh warna dan keceriaan!
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Frame Kartun */}
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] border-[8px] border-white/40 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] bg-black/20 backdrop-blur-sm overflow-hidden transform hover:scale-[1.01] transition-transform duration-500 group">
              {/* Slides */}
              {galleryItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                >
                  <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                  {/* TEXT OVERLAY (PADDING DI PERBESAR LAGI px-16) */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-16 py-4 sm:p-6 md:p-10 text-white">
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold mb-1 sm:mb-2 text-yellow-300 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] leading-tight">{item.title}</h3>
                    <p className="text-xs sm:text-sm md:text-lg text-white font-bold max-w-2xl drop-shadow-md line-clamp-2 sm:line-clamp-none">{item.description}</p>
                  </div>
                </div>
              ))}

              {/* BUTTONS DIPERBESAR (p-3 jadi p-4, h-6 w-6 jadi h-8 w-8) */}
              <button onClick={prevSlide} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white text-emerald-700 p-3 sm:p-4 rounded-2xl border-b-[4px] border-emerald-800 shadow-lg hover:bg-gray-100 active:border-b-0 active:translate-y-1 transition-all z-10">
                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 stroke-[4px]" />
              </button>
              
              <button onClick={nextSlide} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white text-emerald-700 p-3 sm:p-4 rounded-2xl border-b-[4px] border-emerald-800 shadow-lg hover:bg-gray-100 active:border-b-0 active:translate-y-1 transition-all z-10">
                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 stroke-[4px]" />
              </button>
            </div>

            {/* Decoration Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {galleryItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-4 md:h-5 rounded-full transition-all duration-300 border-[3px] border-white/40 shadow-sm ${
                    currentSlide === index ? "w-10 md:w-12 bg-yellow-400 scale-110" : "w-4 md:w-5 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-yellow-400 rounded-full blur-xl opacity-60 animate-bounce"></div>
            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-cyan-400 rounded-full blur-2xl opacity-60 animate-pulse delay-700"></div>
          </div>
        </div>
      </section>

      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/40 via-teal-600/40 to-cyan-600/40" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(white 2px, transparent 2px), linear-gradient(90deg, white 2px, transparent 2px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 bg-white/20 border-[3px] border-white/30 rounded-2xl backdrop-blur-md shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
            <Target className="h-5 w-5 text-white animate-pulse stroke-[3px]" />
            <span className="text-sm font-extrabold text-white uppercase tracking-wider">Bergabung Sekarang</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-8 leading-tight drop-shadow-lg">
            Siap Memulai Perjalanan <br />
            <span className="relative inline-block mt-2 transform -rotate-1">
              <span className="relative z-10">Pembelajaran Islami?</span>
              <div className="absolute bottom-1 left-0 w-full h-4 bg-emerald-500/50 rounded-full -z-0" />
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-bold drop-shadow-md">
            Daftar sekarang dan dapatkan akses ke semua fitur untuk pengalaman yang lebih terorganisir, modern, dan menyenangkan
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/auth" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 text-lg group font-extrabold bg-white text-emerald-800 rounded-2xl border-b-[8px] border-emerald-900 active:border-b-0 active:translate-y-2 transition-all duration-150 flex items-center justify-center gap-3 hover:brightness-105 shadow-2xl">
                <Sparkles className="h-6 w-6 stroke-[3px]" />
                <span>Daftar Sekarang - Gratis!</span>
                <ArrowRight className="h-6 w-6 stroke-[3px] group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/90 font-bold">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border-2 border-white/10">
              <Shield className="h-6 w-6 stroke-[2.5px]" />
              <span className="text-base">100% Aman</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border-2 border-white/10">
              <Users className="h-6 w-6 stroke-[2.5px]" />
              <span className="text-base">150+ Anggota Aktif</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border-2 border-white/10">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400 stroke-[2.5px]" />
              <span className="text-base">Rating 5.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black/20 backdrop-blur-sm border-t-[4px] border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12 mb-12">
            <div className="flex-1 flex flex-col gap-4 min-w-[220px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] border-2 border-white/20">
                  <img src="/logo.png" alt="IRMA" className="w-9 h-9 object-contain" />
                </div>
                <div>
                  <div className="font-extrabold text-xl sm:text-2xl text-white drop-shadow-md">IRMAVerse</div>
                  <div className="text-xs text-white/80 font-bold bg-white/20 px-2 py-0.5 rounded-md inline-block mt-1">Platform Digital IRMA</div>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed text-sm mb-2 max-w-xs font-medium">
                Menghubungkan anggota IRMA dengan teknologi modern untuk pengalaman pembelajaran Islami yang lebih baik.
              </p>
              <div className="flex gap-3 mt-2">
                <a href="https://facebook.com" target="_blank" rel="noopener" className="text-white/70 hover:text-white hover:scale-110 transition-all"><Facebook className="h-6 w-6 stroke-[2.5px]" /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener" className="text-white/70 hover:text-white hover:scale-110 transition-all"><Instagram className="h-6 w-6 stroke-[2.5px]" /></a>
                <a href="https://youtube.com" target="_blank" rel="noopener" className="text-white/70 hover:text-white hover:scale-110 transition-all"><Youtube className="h-6 w-6 stroke-[2.5px]" /></a>
              </div>
            </div>
            <div className="flex-1 min-w-[180px]">
              <h3 className="font-extrabold text-white text-lg mb-4 drop-shadow-sm">Quick Links</h3>
              <ul className="space-y-3">
                {['Login / Register', 'Struktur Organisasi', 'Jadwal Kajian', 'Pengumuman', 'Galeri', 'Kontak'].map((link, i) => (
                    <li key={i}><Link href="#" className="text-white/80 hover:text-white font-bold transition-colors duration-300 text-sm flex items-center gap-2 group"><ArrowRight className="h-4 w-4 stroke-[3px] group-hover:translate-x-1 transition-transform" />{link}</Link></li>
                ))}
              </ul>
            </div>
            <div className="flex-1 min-w-[200px]">
              <h3 className="font-extrabold text-white text-lg mb-4 drop-shadow-sm">Contact Us</h3>
              <p className="text-sm text-white/80 font-medium mb-2">Jl. SMK Negeri 13 Bandung, Kota Bandung, Jawa Barat</p>
              <p className="text-sm text-white/80 font-medium mb-2">Email: 1CtJ3@example.com</p>
              <p className="text-sm text-white/80 font-medium">Telepon: 0812-3456-7890</p>
            </div>
          </div>
          <p className="text-center text-white/60 text-xs mt-8 border-t-2 border-white/10 pt-6 font-bold">
            &copy; {new Date().getFullYear()} <span className="text-white">IRMAVerse</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}