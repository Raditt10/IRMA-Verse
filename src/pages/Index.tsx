import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Award, Calendar, Bell, BarChart, ArrowRight, Sparkles, Zap, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
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
    { icon: Users, label: "Member Aktif", value: "150+", color: "text-blue-500" },
    { icon: BookOpen, label: "Materi Kajian", value: "50+", color: "text-green-500" },
    { icon: Award, label: "Badge Tersedia", value: "30+", color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section - Enhanced */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="absolute inset-0 opacity-5">
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full backdrop-blur-sm animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Platform Digital IRMA SMK N 13 Bandung</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in leading-tight">
              Selamat Datang di{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent inline-block">
                IRMAVerse
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Platform digital untuk mengelola kegiatan, pembelajaran, dan membangun komunitas
              <span className="text-primary font-semibold"> Islami yang lebih modern</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/80">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/structure">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 hover:bg-muted/50">
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-gradient-card border border-border/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform`} />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-primary/10 rounded-full">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Fitur Unggulan</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kelola semua aktivitas IRMA dengan mudah, efisien, dan menyenangkan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 border-transparent hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 bg-gradient-card backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <CardHeader className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative">
                  <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                    <span className="text-sm">Pelajari lebih lanjut</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
            <Target className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Bergabung Sekarang</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Siap Memulai Perjalanan
            <br />
            Pembelajaran Islami?
          </h2>
          
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Daftar sekarang dan dapatkan akses ke semua fitur untuk pengalaman yang lebih terorganisir dan modern
          </p>
          
          <Link to="/auth">
            <Button 
              size="lg" 
              variant="secondary"
              className="group shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              Daftar Sekarang - Gratis!
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="relative bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="IRMA" className="w-10 h-10 object-contain" />
              <div>
                <div className="font-bold text-lg text-foreground">IRMAVerse</div>
                <div className="text-sm text-muted-foreground">Platform Digital IRMA</div>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-muted-foreground text-sm">
                &copy; 2024 IRMAVerse - Ikatan Remaja Masjid
              </p>
              <p className="text-muted-foreground text-sm">
                SMK Negeri 13 Bandung
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
