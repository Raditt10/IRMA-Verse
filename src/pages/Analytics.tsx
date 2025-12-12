import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, ClipboardCheck, Trophy, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Analytics = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAbsensi: 0,
    totalQuizAttempts: 0,
    avgQuizScore: 0,
  });
  const [absensiData, setAbsensiData] = useState<any[]>([]);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [attendanceByMonth, setAttendanceByMonth] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (error || !roles) {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki akses admin",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      fetchAnalytics();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const [profiles, absensi, quizAttempts] = await Promise.all([
        supabase.from("profiles").select("id"),
        supabase.from("absensi").select("*"),
        supabase.from("quiz_attempts").select("score, created_at"),
      ]);

      // Basic stats
      const totalUsers = profiles.data?.length || 0;
      const totalAbsensi = absensi.data?.length || 0;
      const totalQuizAttempts = quizAttempts.data?.length || 0;
      const avgQuizScore = quizAttempts.data && quizAttempts.data.length > 0
        ? Math.round(quizAttempts.data.reduce((sum, a) => sum + a.score, 0) / quizAttempts.data.length)
        : 0;

      setStats({ totalUsers, totalAbsensi, totalQuizAttempts, avgQuizScore });

      // Absensi by status
      const absensiByStatus = absensi.data?.reduce((acc: any, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});

      setAbsensiData(
        Object.entries(absensiByStatus || {}).map(([status, count]) => ({
          name: status,
          value: count,
        }))
      );

      // Quiz participation
      const quizParticipation = quizAttempts.data?.reduce((acc: any, item) => {
        const passed = item.score >= 70;
        const key = passed ? "Lulus" : "Tidak Lulus";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      setQuizData(
        Object.entries(quizParticipation || {}).map(([status, count]) => ({
          name: status,
          value: count,
        }))
      );

      // Attendance by month
      const monthlyData: Record<string, number> = {};
      absensi.data?.forEach((item) => {
        const month = new Date(item.created_at).toLocaleDateString("id-ID", { month: "short", year: "numeric" });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      });

      setAttendanceByMonth(
        Object.entries(monthlyData).map(([month, count]) => ({
          month,
          count,
        }))
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dashboard Analytics
          </h1>
          <p className="text-muted-foreground">
            Statistik dan laporan aktivitas IRMAVerse
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Member</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Absensi</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAbsensi}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Dikerjakan</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuizAttempts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Skor</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgQuizScore}%</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="absensi" className="space-y-4">
          <TabsList>
            <TabsTrigger value="absensi">Absensi</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="trends">Tren</TabsTrigger>
          </TabsList>

          <TabsContent value="absensi">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Status Absensi</CardTitle>
                <CardDescription>Breakdown absensi berdasarkan status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={absensiData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {absensiData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle>Partisipasi Quiz</CardTitle>
                <CardDescription>Perbandingan yang lulus dan tidak lulus</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={quizData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Tren Absensi Bulanan</CardTitle>
                <CardDescription>Jumlah absensi per bulan</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
