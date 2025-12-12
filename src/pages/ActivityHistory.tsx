import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Award, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ActivityItem {
  id: string;
  type: 'quiz' | 'attendance' | 'badge' | 'chat';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
  metadata?: any;
}

const ActivityHistory = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchActivities();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchActivities = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const allActivities: ActivityItem[] = [];

      // Fetch quiz attempts
      const { data: quizAttempts } = await supabase
        .from("quiz_attempts")
        .select("*, quiz(title)")
        .eq("user_id", session.user.id)
        .order("completed_at", { ascending: false });

      quizAttempts?.forEach((attempt: any) => {
        allActivities.push({
          id: attempt.id,
          type: 'quiz',
          title: `Quiz: ${attempt.quiz?.title || 'Unknown'}`,
          description: `Skor: ${attempt.score}% (${attempt.total_points} poin)`,
          timestamp: attempt.completed_at,
          icon: <Trophy className="h-5 w-5" />,
          color: attempt.score >= 70 ? 'text-green-500' : 'text-orange-500',
          metadata: { score: attempt.score, passed: attempt.score >= 70 }
        });
      });

      // Fetch attendance
      const { data: attendanceData } = await supabase
        .from("absensi")
        .select("*, jadwal_kajian(title, date)")
        .eq("user_id", session.user.id)
        .order("waktu_absen", { ascending: false });

      attendanceData?.forEach((record: any) => {
        allActivities.push({
          id: record.id,
          type: 'attendance',
          title: `Absensi: ${record.jadwal_kajian?.title || 'Unknown'}`,
          description: `Status: ${record.status}`,
          timestamp: record.waktu_absen,
          icon: <Calendar className="h-5 w-5" />,
          color: record.status === 'hadir' ? 'text-blue-500' : 'text-gray-500',
          metadata: { status: record.status, method: record.metode }
        });
      });

      // Fetch badges earned
      const { data: userBadges } = await supabase
        .from("user_badges")
        .select("*, badges(name, points, icon)")
        .eq("user_id", session.user.id)
        .order("earned_at", { ascending: false });

      userBadges?.forEach((ub: any) => {
        allActivities.push({
          id: ub.id,
          type: 'badge',
          title: `Badge Diraih: ${ub.badges?.name || 'Unknown'}`,
          description: `+${ub.badges?.points || 0} poin`,
          timestamp: ub.earned_at,
          icon: <Award className="h-5 w-5" />,
          color: 'text-yellow-500',
          metadata: { badgeIcon: ub.badges?.icon }
        });
      });

      // Fetch recent chat messages
      const { data: chatMessages } = await supabase
        .from("chat_messages")
        .select("*, chat_rooms(name)")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      chatMessages?.forEach((msg: any) => {
        allActivities.push({
          id: msg.id,
          type: 'chat',
          title: `Chat di ${msg.chat_rooms?.name || 'Unknown Room'}`,
          description: msg.message.substring(0, 50) + (msg.message.length > 50 ? '...' : ''),
          timestamp: msg.created_at,
          icon: <MessageCircle className="h-5 w-5" />,
          color: 'text-purple-500',
          metadata: {}
        });
      });

      // Sort all activities by timestamp
      allActivities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(allActivities);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityBadge = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'quiz':
        return (
          <Badge variant={activity.metadata?.passed ? "default" : "secondary"}>
            Quiz
          </Badge>
        );
      case 'attendance':
        return <Badge variant="outline">Absensi</Badge>;
      case 'badge':
        return <Badge className="bg-yellow-500 text-white">Badge</Badge>;
      case 'chat':
        return <Badge variant="secondary">Chat</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `Hari ini, ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (days === 1) {
      return `Kemarin, ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (days < 7) {
      return `${days} hari lalu`;
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Riwayat Aktivitas
          </h1>
          <p className="text-muted-foreground">
            Timeline lengkap semua aktivitasmu di IRMAVerse
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memuat aktivitas...</p>
          </div>
        ) : activities.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Belum ada aktivitas</p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

            {/* Activity items */}
            <div className="space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="relative flex gap-6">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-card border-2 border-border ${activity.color}`}>
                    {activity.icon}
                  </div>

                  {/* Activity card */}
                  <Card className="flex-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{activity.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {activity.description}
                          </CardDescription>
                        </div>
                        {getActivityBadge(activity)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(activity.timestamp)}</span>
                      </div>
                      {activity.type === 'quiz' && activity.metadata && (
                        <div className="mt-2 flex items-center gap-2">
                          {activity.metadata.passed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="text-sm">
                            {activity.metadata.passed ? 'Lulus' : 'Belum Lulus'}
                          </span>
                        </div>
                      )}
                      {activity.type === 'badge' && activity.metadata?.badgeIcon && (
                        <div className="mt-2 text-3xl">
                          {activity.metadata.badgeIcon}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHistory;
