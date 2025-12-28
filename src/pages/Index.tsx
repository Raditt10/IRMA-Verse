import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import heroImage from "@/assets/hero-image.jpg";

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

  const stats = [
    { icon: Users, label: "Member Aktif", value: "150+" },
    { icon: BookOpen, label: "Materi Kajian", value: "50+" },
    { icon: Award, label: "Badge Tersedia", value: "30+" },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-500 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-35" style={{
        backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22), transparent 38%), radial-gradient(circle at 78% 12%, rgba(59,130,246,0.28), transparent 32%), radial-gradient(circle at 68% 72%, rgba(16,185,129,0.42), transparent 32%)"
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "72px 72px"
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between py-4 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Ahad, 28 Desember 2025</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-white/70">
            <MapPin className="h-4 w-4" />
            <span>Bandung, Indonesia</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center">
                <img src="/logo.png" alt="IRMA Verse" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Platform Rohis Digital</p>
                <h1 className="text-2xl font-black leading-tight">IRMA Verse</h1>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-white/80">
              <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
              <Link to="/profile" className="hover:text-white transition-colors">Profil</Link>
              <Link to="/announcements" className="hover:text-white transition-colors">Informasi</Link>
              <Link to="/gallery" className="hover:text-white transition-colors">Galeri</Link>
              <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Kontak</Link>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-white/70">
                <Instagram className="h-5 w-5" />
                <Youtube className="h-5 w-5" />
                <Facebook className="h-5 w-5" />
              </div>
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="bg-white text-emerald-900 hover:bg-white/90 px-6 py-3 font-semibold shadow-lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center pt-6">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/90 text-sm font-semibold shadow-lg">
                Official Website <span className="bg-gradient-to-r from-emerald-300 via-white to-cyan-200 bg-clip-text text-transparent">IRMA13</span>
              </div>

              <div className="space-y-2">
                <p className="text-lg text-white/80 font-medium">ROHIS DIGITAL SEKOLAH</p>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.95] drop-shadow-xl">
                  IRMA <span className="bg-gradient-to-r from-emerald-300 via-white to-cyan-200 bg-clip-text text-transparent">VERSE</span>
                </h2>
              </div>

              <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-3 shadow-inner">
                <div className="flex items-center gap-3 w-full">
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Search className="h-5 w-5 text-white/80" />
                  </div>
                  <input
                    className="flex-1 bg-transparent focus:outline-none placeholder:text-white/60 text-white text-base"
                    placeholder="Cari informasi yang anda inginkan di sini..."
                  />
                </div>
                <Button className="w-full sm:w-auto px-6 py-3 bg-white text-emerald-900 font-semibold hover:bg-white/90">
                  Cari
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="bg-white/10 border-white/10 text-white shadow-xl">
                  <CardContent className="p-5 text-base leading-relaxed">
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-400 to-cyan-400 text-emerald-950 border-0 shadow-xl">
                  <CardContent className="p-5">
                    <p className="text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-white via-white/85 to-white/70 bg-clip-text text-transparent">Platform IRMA</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">SMKN 13 Bandung</p>
                    <div className="mt-3 flex items-center justify-center">
                      <div className="p-2 rounded-xl border border-white/40 bg-white/10 backdrop-blur shadow-lg">
                        <img src="/logo13.png" alt="SMKN 13 Bandung" className="h-10 w-auto object-contain" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-white/25 via-emerald-200/25 to-cyan-200/25 blur-3xl" />
              <div className="relative h-full min-h-[360px] rounded-[28px] overflow-hidden border border-white/15 shadow-[0_30px_120px_rgba(0,0,0,0.35)] bg-white/5 backdrop-blur flex items-end justify-center p-4">
                <img
                  src="/model.png"
                  alt="Role model IRMA"
                  className="max-h-[400px] w-full object-contain drop-shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src = heroImage;
                    e.currentTarget.onerror = null;
                  }}
                />
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-white/85 text-emerald-900 px-3 py-2 rounded-full text-sm font-semibold shadow-md">
                  <span>IRMA Role Model</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="relative z-10 -mt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm uppercase tracking-wide text-white/70">{stat.label}</p>
              </div>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-28 relative bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15 border-2 border-primary/30 rounded-full backdrop-blur-md shadow-xl">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent uppercase tracking-wider">Fitur Unggulan</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Semua yang <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">Kamu Butuhkan</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Kelola semua aktivitas IRMA dengan mudah, efisien, dan menyenangkan dalam satu platform terintegrasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-card via-card to-muted/20 backdrop-blur-xl animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                </div>
                
                <CardHeader className="relative pb-4">
                  <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                    <feature.icon className="h-8 w-8 text-white relative z-10" />
                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed pt-2 text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative pt-0">
                  <div className="flex items-center text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                    <span className="text-sm uppercase tracking-wider">Pelajari lebih lanjut</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - New */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full backdrop-blur-md shadow-lg">
              <Target className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">Keunggulan</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Mengapa Memilih <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">IRMAVerse?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Rasakan pengalaman berbeda dalam mengelola kegiatan organisasi Islami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-card via-card to-muted/30 border-2 border-border hover:border-primary/50 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 rounded-3xl transition-all duration-500" />
                
                <div className="relative">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - New */}
      <section className="py-28 relative bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full backdrop-blur-md shadow-lg">
              <Star className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">Testimoni</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Apa Kata <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Mereka?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Dengarkan pengalaman anggota IRMA yang telah menggunakan IRMAVerse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-card via-card to-muted/30 border-2 border-border hover:border-primary/50 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 rounded-3xl transition-all duration-500" />
                
                <div className="relative">
                  <Quote className="h-10 w-10 text-primary/20 mb-4" />
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-foreground leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-28 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary" />
        
        {/* Animated Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid Pattern */}
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
              <div className="absolute bottom-0 left-0 w-full h-2 bg-white/30 rounded-full" />
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Daftar sekarang dan dapatkan akses ke semua fitur untuk pengalaman yang lebih terorganisir, modern, dan menyenangkan
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button 
                size="lg" 
                variant="secondary"
                className="w-full sm:w-auto px-10 py-7 text-lg group shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-110 font-bold"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Daftar Sekarang - Gratis!
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">100% Aman</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">150+ Anggota Aktif</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-white/80" />
              <span className="text-sm font-medium">Rating 5.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="relative bg-gradient-to-br from-card via-muted/20 to-card border-t-2 border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <img src="/logo.png" alt="IRMA" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <div className="font-black text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">IRMAVerse</div>
                  <div className="text-xs text-muted-foreground font-medium">Platform Digital IRMA</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Menghubungkan anggota IRMA dengan teknologi modern untuk pengalaman pembelajaran Islami yang lebih baik
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Login / Register
                  </Link>
                </li>
                <li>
                  <Link to="/structure" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Struktur Organisasi
                  </Link>
                </li>
                <li>
                  <Link to="/announcements" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Pengumuman
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-foreground mb-4">Kontak Kami</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="leading-relaxed">
                  <span className="font-semibold text-foreground">IRMA SMK Negeri 13 Bandung</span>
                  <br />
                  Jl. Soekarno-Hatta, Bandung
                </p>
                <div className="flex items-center gap-2 pt-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs">Made with love by IRMA Team</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <p className="text-muted-foreground text-sm">
                &copy; 2024 IRMAVerse - Ikatan Remaja Masjid SMK Negeri 13 Bandung. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20">
                  <span className="text-xs font-semibold text-primary">v1.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
