import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BarChart,
  Bell,
  BookOpen,
  Calendar,
  CalendarDays,
  Clock,
  Facebook,
  Heart,
  Instagram,
  MapPin,
  Quote,
  Search,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Youtube,
  Zap,
} from "lucide-react";

const Index = () => {
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
      title: "Ringkasan Materi",
      description: "Akses materi kajian yang telah dirangkum",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      title: "Struktur Organisasi",
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
      description: "Sistem yang terstruktur untuk mengelola seluruh kegiatan IRMA dengan efisien",
    },
    {
      icon: Clock,
      title: "Hemat Waktu",
      description: "Akses informasi kapan saja, di mana saja tanpa perlu hadir secara fisik",
    },
    {
      icon: TrendingUp,
      title: "Tracking Progress",
      description: "Pantau perkembangan pembelajaran dan pencapaian pribadi secara real-time",
    },
    {
      icon: Heart,
      title: "Komunitas Solid",
      description: "Membangun ikatan yang kuat dengan sesama anggota IRMA",
    },
  ];

  const testimonials = [
    {
      name: "Ahmad Fauzi",
      role: "Anggota IRMA",
      content: "IRMAVerse memudahkan saya mengakses materi kajian dan mengikuti kegiatan IRMA. Platform yang sangat membantu!",
      rating: 5,
    },
    {
      name: "Siti Aisyah",
      role: "Pengurus IRMA",
      content: "Dengan IRMAVerse, koordinasi kegiatan jadi lebih mudah. Fitur-fiturnya lengkap dan mudah digunakan.",
      rating: 5,
    },
    {
      name: "Muhammad Rizki",
      role: "Pemateri",
      content: "Sistem rating dan feedback membantu saya meningkatkan kualitas materi kajian yang saya sampaikan.",
      rating: 5,
    },
  ];

  const today = new Date();
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const tanggalStr = `${hari[today.getDay()]}, ${today.getDate()} ${bulan[today.getMonth()]} ${today.getFullYear()}`;

  const [userLocation, setUserLocation] = React.useState<string>("Lokasi tidak diketahui");
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setUserLocation(data.address.city || data.address.town || data.address.village || data.address.state || data.display_name || "Lokasi ditemukan");
        } catch {
          setUserLocation("Lokasi ditemukan");
        }
      }, () => setUserLocation("Lokasi tidak diketahui"));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 38%), radial-gradient(circle at 78% 12%, rgba(59,130,246,0.12), transparent 32%), radial-gradient(circle at 68% 72%, rgba(16,185,129,0.15), transparent 32%)"
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "72px 72px"
      }} />

      <div className="relative w-full">
        <div className="flex items-center justify-between py-4 text-sm text-white/70 max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>{tanggalStr}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-white/60">
            <MapPin className="h-4 w-4" />
            <span>{userLocation}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 overflow-hidden">
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full px-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center">
                <img src="/logo.png" alt="IRMA Verse" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Platform Rohis Digital</p>
                <h1 className="text-2xl font-black leading-tight">IRMA Verse</h1>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-white/70">
              <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
              <Link to="/profile" className="hover:text-white transition-colors">Profil</Link>
              <Link to="/announcements" className="hover:text-white transition-colors">Informasi</Link>
              <Link to="/gallery" className="hover:text-white transition-colors">Galeri</Link>
              <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Kontak</Link>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-white/60">
                <Instagram className="h-5 w-5 hover:text-white/90 transition-colors cursor-pointer" />
                <Youtube className="h-5 w-5 hover:text-white/90 transition-colors cursor-pointer" />
                <Facebook className="h-5 w-5 hover:text-white/90 transition-colors cursor-pointer" />
              </div>
              <Link to="/auth">
                <button className="bg-white/95 text-emerald-900 hover:bg-white px-6 py-3 font-semibold shadow-lg rounded-lg transition-all">
                  Login
                </button>
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr,auto] gap-8 items-end pt-4 pb-2 max-w-7xl mx-auto w-full px-4">
            <div className="space-y-5 lg:pr-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-semibold shadow-lg">
                Official Website <span className="bg-gradient-to-r from-emerald-200 via-white to-cyan-100 bg-clip-text text-transparent">IRMA13</span>
              </div>

              <div className="space-y-2">
                <p className="text-lg text-white/70 font-medium">ROHIS DIGITAL SEKOLAH</p>
                <div className="text-left">
                  <span className="text-5xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight drop-shadow-xl whitespace-nowrap align-top">
                    IRMA <span className="bg-gradient-to-r from-emerald-200 via-white to-cyan-100 bg-clip-text text-transparent align-top">VERSE</span>
                  </span>
                </div>
              </div>

              <p className="text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">
                Platform digital yang menghubungkan seluruh anggota IRMA dengan sistem terorganisir, modern, dan efisien untuk pembelajaran Islami yang lebih baik.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-3 shadow-inner backdrop-blur-sm">
                <div className="flex items-center gap-3 w-full">
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Search className="h-5 w-5 text-white/70" />
                  </div>
                  <input
                    className="flex-1 bg-transparent focus:outline-none placeholder:text-white/50 text-white text-base"
                    placeholder="Cari informasi yang anda inginkan di sini..."
                  />
                </div>
                <button className="w-full sm:w-auto px-6 py-3 bg-white/95 text-emerald-900 font-semibold hover:bg-white rounded-lg transition-all">
                  Cari
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg flex flex-col items-center justify-center py-8 px-6 min-h-[260px]">
                  <div className="flex flex-col items-center w-full">
                    <div className="flex items-center justify-center mb-4">
                      <div className="rounded-xl bg-white/95 shadow p-2">
                        <img src="/logo13.png" alt="SMKN 13 Bandung" className="h-14 w-auto object-contain" />
                      </div>
                    </div>
                    <div className="text-center w-full">
                      <div className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">Platform Ekskul IRMA</div>
                      <div className="text-lg font-bold text-white mb-1">SMKN 13 Bandung</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative -mr-6 -mb-4 self-end">
              <div className="absolute -inset-6 bg-gradient-to-br from-white/10 via-emerald-200/10 to-cyan-200/10 blur-3xl" />
              <div className="relative h-[500px] sm:h-[600px] md:h-[700px] w-auto max-w-none flex items-end">
                <img
                  src="/model.png"
                  alt="Role model IRMA"
                  className="h-full w-auto object-cover object-bottom drop-shadow-[0_25px_80px_rgba(0,0,0,0.6)] block"
                  style={{ display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div className={`w-20 h-20 rounded-[2rem] border-2 border-white/20 bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <p className="text-sm font-semibold text-white/90 text-center leading-tight">
                  {feature.title}
                </p>
              </div>
            ))}

            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-20 h-20 rounded-[2rem] border-2 border-white/20 bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <p className="text-sm font-semibold text-white/90 text-center leading-tight">
                Kegiatan
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 group cursor-pointer">
             <div className="w-20 h-20 rounded-[2rem] border-2 border-white/20 bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                <Target className="h-10 w-10 text-white" />
              </div>
              <p className="text-sm font-semibold text-white/90 text-center leading-tight">
                Program
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-20 h-20 rounded-[2rem] border-2 border-white/20 bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                <CalendarDays className="h-10 w-10 text-white" />
              </div>
              <p className="text-sm font-semibold text-white/90 text-center leading-tight">
                Event
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 group cursor-pointer">
             <div className="w-20 h-20 rounded-[2rem] border-2 border-white/20 bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <p className="text-sm font-semibold text-white/90 text-center leading-tight">
                Donasi
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-white/10 border border-white/20 rounded-full backdrop-blur-md shadow-lg">
              <Target className="h-4 w-4 text-emerald-300 animate-pulse" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Keunggulan</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Mengapa Memilih <span className="bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">IRMAVerse?</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Rasakan pengalaman berbeda dalam mengelola kegiatan organisasi Islami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border-2 border-white/10 hover:border-emerald-400/50 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-cyan-500/0 group-hover:from-emerald-500/10 group-hover:to-cyan-500/10 rounded-3xl transition-all duration-500" />

                <div className="relative">
                  <div className="inline-flex p-4 rounded-2xl bg-white/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <benefit.icon className="h-8 w-8 text-emerald-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-white/10 border border-white/20 rounded-full backdrop-blur-md shadow-lg">
              <Star className="h-4 w-4 text-emerald-300 animate-pulse" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Testimoni</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Apa Kata <span className="bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">Mereka?</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Dengarkan pengalaman anggota IRMA yang telah menggunakan IRMAVerse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border-2 border-white/10 hover:border-emerald-400/50 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-cyan-500/0 group-hover:from-emerald-500/10 group-hover:to-cyan-500/10 rounded-3xl transition-all duration-500" />

                <div className="relative">
                  <Quote className="h-10 w-10 text-white/20 mb-4" />

                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-white/90 leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-sm text-white/60">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/40 via-teal-600/40 to-cyan-600/40" />

        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-white/10 border border-white/20 rounded-full backdrop-blur-md shadow-lg">
            <Target className="h-4 w-4 text-white animate-pulse" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Bergabung Sekarang</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-tight">
            Siap Memulai Perjalanan
            <br />
            <span className="relative inline-block mt-2">
              <span className="relative">Pembelajaran Islami?</span>
              <div className="absolute bottom-0 left-0 w-full h-2 bg-white/20 rounded-full" />
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Daftar sekarang dan dapatkan akses ke semua fitur untuk pengalaman yang lebih terorganisir, modern, dan menyenangkan
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <button className="w-full sm:w-auto px-10 py-7 text-lg group shadow-2xl transition-all duration-300 hover:scale-110 font-bold bg-white/95 text-emerald-900 hover:bg-white rounded-lg flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5" />
                Daftar Sekarang - Gratis!
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/70">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">100% Aman</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">150+ Anggota Aktif</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-white/70" />
              <span className="text-sm font-medium">Rating 5.0</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative bg-black/20 backdrop-blur-sm border-t-2 border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <img src="/logo.png" alt="IRMA" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <div className="font-black text-xl bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">IRMAVerse</div>
                  <div className="text-xs text-white/60 font-medium">Platform Digital IRMA</div>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed text-sm">
                Menghubungkan anggota IRMA dengan teknologi modern untuk pengalaman pembelajaran Islami yang lebih baik
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/auth" className="text-white/70 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Login / Register
                  </Link>
                </li>
                <li>
                  <Link to="/structure" className="text-white/70 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Struktur Organisasi
                  </Link>
                </li>
                <li>
                  <Link to="/schedule" className="text-white/70 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Jadwal Kajian
                  </Link>
                </li>
                <li>
                  <Link to="/announcements" className="text-white/70 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Pengumuman
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-white/70 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Galeri
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white/70 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Contact Us</h3>
              <p className="text-sm text-white/70 mb-2">
                Jl. SMK Negeri 13 Bandung, Kota Bandung, Jawa Barat
              </p>
              <p className="text-sm text-white/70 mb-2">
                Email: 1CtJ3@example.com
              </p>
              <p className="text-sm text-white/70">
                Telepon: 0812-3456-7890
              </p>
            </div>
          </div>
          <p className="text-center text-white/60 text-sm">
            &copy; {new Date().getFullYear()} IRMAVerse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
  