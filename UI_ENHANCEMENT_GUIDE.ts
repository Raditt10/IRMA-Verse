// UI Enhancement Guide - IRMAVerse
// Perubahan telah diterapkan ke file-file berikut dengan sukses:
// ✅ Index.tsx - Landing page dengan hero section yang stunning
// ✅ Dashboard.tsx - Dashboard dengan stats cards yang modern
// ✅ Announcements.tsx - Halaman pengumuman dengan card style baru
// ✅ Schedule.tsx - Jadwal dengan header yang lebih menarik
// ✅ index.css - Color palette dan animations yang diupdate

/* 
==============================================
WARNA BARU - HIJAU LEBIH MUDA & VIBRANT
==============================================
Primary: HSL(160, 75%, 50%) - Hijau mint fresh
Accent: HSL(165, 70%, 58%) - Hijau cyan cerah
Secondary: HSL(45, 92%, 60%) - Kuning cerah

Gradasi menggunakan 3 color stops untuk transisi lebih smooth
*/

/* 
==============================================
PATTERN UNTUK UPDATE FILE LAIN
==============================================

1. HEADER SECTION (Gunakan pattern ini untuk semua halaman):
*/
const HeaderPattern = `
<div className="mb-8 relative overflow-hidden p-8 rounded-3xl">
  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />
  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
  <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
  
  <div className="relative">
    <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15 border-2 border-primary/30 rounded-full backdrop-blur-md shadow-lg">
      <Icon className="h-4 w-4 text-primary animate-pulse" />
      <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent uppercase tracking-wider">
        Badge Text
      </span>
    </div>
    <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
      <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
        Page Title
      </span>
    </h1>
    <p className="text-lg md:text-xl text-muted-foreground font-light">
      Description ✨
    </p>
  </div>
</div>
`;

/*
2. CARD STYLE (Untuk semua card components):
*/
const CardPattern = `
<Card className="group relative overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-glow-primary hover:-translate-y-2 bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-xl">
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  
  {/* Shine Effect */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
  </div>
  
  <CardHeader className="relative">
    {/* Content */}
  </CardHeader>
</Card>
`;

/*
3. STATS CARD (Untuk dashboard-like components):
*/
const StatsCardPattern = `
<Card className="group relative overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-glow-primary bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-xl hover:-translate-y-1">
  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
  </div>
  
  <CardHeader className="pb-3 relative">
    <div className="flex items-center justify-between">
      <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="p-2 bg-primary/10 rounded-lg">
        <TrendIcon className="h-5 w-5 text-primary" />
      </div>
    </div>
  </CardHeader>
  
  <CardContent className="relative">
    <div className="text-3xl font-black bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-1">
      {value}
    </div>
    <p className="text-sm text-muted-foreground font-medium">{label}</p>
  </CardContent>
</Card>
`;

/*
4. BUTTON STYLE (Untuk CTA buttons):
*/
const ButtonPattern = `
<Button className="group relative overflow-hidden px-8 py-6 text-lg shadow-2xl hover:shadow-glow-primary transition-all duration-300 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:bg-right animate-gradient">
  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
  <Icon className="mr-2 h-5 w-5 relative z-10" />
  <span className="relative z-10">Button Text</span>
  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
</Button>
`;

/*
==============================================
FILES YANG MASIH PERLU DIUPDATE:
==============================================
- Materials.tsx
- Leaderboard.tsx
- Profile.tsx
- Badges.tsx
- Achievements.tsx
- ActivityHistory.tsx
- AdminPanel.tsx
- Analytics.tsx
- ChatRoom.tsx
- ChatRooms.tsx
- Gallery.tsx
- Quiz.tsx
- QuizBuilder.tsx
- QuizDetail.tsx
- Ratings.tsx
- Reports.tsx
- Structure.tsx
- NotFound.tsx
- Auth.tsx
- Absensi.tsx
- AdminAbsensi.tsx
- PemateriDashboard.tsx

==============================================
CARA CEPAT UPDATE:
==============================================
1. Ganti header section dengan HeaderPattern di atas
2. Ganti semua <Card> dengan CardPattern
3. Untuk stats/metrics, gunakan StatsCardPattern
4. Untuk CTA buttons, gunakan ButtonPattern
5. Pastikan warna gradient konsisten dengan palette baru

==============================================
ANIMASI YANG TERSEDIA:
==============================================
- animate-fade-in : Fade in dari bawah
- animate-gradient : Animasi gradient bergerak
- animate-float : Floating effect
- animate-glow : Glow pulsing
- animate-pulse : Pulse effect (built-in Tailwind)

==============================================
UTILITY CLASSES BARU:
==============================================
- bg-gradient-primary : Primary gradient
- bg-gradient-hero : Hero gradient
- bg-gradient-subtle : Subtle background
- bg-gradient-accent : Accent gradient
- bg-gradient-card : Card background
- shadow-glow : Glow shadow
- shadow-glow-primary : Primary glow shadow
- glass : Glassmorphism effect
*/

export {};
