import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  Bell, 
  Award, 
  Trophy, 
  MessageCircle, 
  TrendingUp,
  Users,
  BarChart3,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import LevelDisplay from "@/components/LevelDisplay";
import { useRealtimeAnnouncements } from "@/hooks/useRealtimeAnnouncements";
import { useAchievementNotifications } from "@/hooks/useAchievementNotifications";
import { DashboardSkeleton } from "@/components/LoadingSkeletons";
import { OnboardingTour, useOnboarding } from "@/components/OnboardingTour";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPoints: 0,
    totalBadges: 0,
    totalQuizzes: 0,
    averageScore: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Onboarding tour
  const { showTour, loading: tourLoading, completeOnboarding } = useOnboarding();

  // Enable realtime notifications
  useRealtimeAnnouncements(user?.id);
  useAchievementNotifications(user?.id);

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const fetchDashboardData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch user badges
    const { data: userBadges } = await supabase
      .from("user_badges")
      .select("badges(points)")
      .eq("user_id", session.user.id);

    const totalPoints = userBadges?.reduce((sum, ub: any) => sum + (ub.badges?.points || 0), 0) || 0;
    const totalBadges = userBadges?.length || 0;

    // Fetch quiz stats
    const { data: quizAttempts } = await supabase
      .from("quiz_attempts")
      .select("score")
      .eq("user_id", session.user.id);

    const totalQuizzes = quizAttempts?.length || 0;
    const averageScore = totalQuizzes > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / totalQuizzes)
      : 0;

    setStats({ totalPoints, totalBadges, totalQuizzes, averageScore });

    // Fetch recent activities
    const { data: recentBadges } = await supabase
      .from("user_badges")
      .select("earned_at, badges(name, icon)")
      .eq("user_id", session.user.id)
      .order("earned_at", { ascending: false })
      .limit(3);

    setRecentActivities(recentBadges || []);
    setLoading(false);
  };

  const quickActions = [
    {
      title: "Pengumuman",
      description: "Lihat info terbaru",
      icon: Bell,
      link: "/announcements",
      color: "from-blue-500 to-cyan-500",
      badge: "Baru"
    },
    {
      title: "Jadwal Kajian",
      description: "Cek jadwal hari ini",
      icon: Calendar,
      link: "/schedule",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Materi Kajian",
      description: "Pelajari materi",
      icon: BookOpen,
      link: "/materials",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Quiz",
      description: "Uji pemahamanmu",
      icon: Trophy,
      link: "/quiz",
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Chat Rooms",
      description: "Diskusi bersama",
      icon: MessageCircle,
      link: "/chat-rooms",
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Leaderboard",
      description: "Lihat peringkat",
      icon: TrendingUp,
      link: "/leaderboard",
      color: "from-red-500 to-pink-500",
    },
  ];

  if (!user || loading || tourLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Onboarding Tour */}
      <OnboardingTour run={showTour} onComplete={completeOnboarding} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome Section */}
        <div className="mb-8 relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 bg-gradient-primary bg-clip-text text-transparent">
              Assalamualaikum, {user.user_metadata?.full_name || user.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Selamat datang kembali. Semangat belajarnya hari ini!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-tour="dashboard-stats">
          <Card className="border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-gradient-card backdrop-blur-sm group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{stats.totalPoints}</div>
              <p className="text-sm text-muted-foreground">Total Poin</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-gradient-card backdrop-blur-sm group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{stats.totalBadges}</div>
              <p className="text-sm text-muted-foreground">Badge Terkumpul</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-gradient-card backdrop-blur-sm group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <BarChart3 className="h-5 w-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{stats.totalQuizzes}</div>
              <p className="text-sm text-muted-foreground">Quiz Dikerjakan</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-gradient-card backdrop-blur-sm group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <Users className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{stats.averageScore}%</div>
              <p className="text-sm text-muted-foreground">Rata-rata Skor</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6" data-tour="quick-actions">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Akses Cepat
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Card
                    key={index}
                    className="group relative overflow-hidden border-2 border-transparent hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 bg-gradient-card backdrop-blur-sm cursor-pointer"
                    onClick={() => navigate(action.link)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <CardHeader className="relative pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-3 bg-gradient-to-br ${action.color} rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        {action.badge && (
                          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {action.title}
                      </CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="relative pt-0">
                      <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                        <span className="text-sm">Buka</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="space-y-6" data-tour="level-display">
            {/* Level Display */}
            <LevelDisplay totalPoints={stats.totalPoints} />

            {/* Recent Activities */}
            <Card className="border-2 border-border/50 bg-gradient-card backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Aktivitas Terakhir
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Belum ada aktivitas
                  </p>
                ) : (
                  recentActivities.map((activity: any, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-2xl">{activity.badges?.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity.badges?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.earned_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
