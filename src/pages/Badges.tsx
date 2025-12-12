import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BadgesSkeleton } from "@/components/LoadingSkeletons";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement_value: number;
  points: number;
  earned: boolean;
  earned_at?: string;
  progress?: number;
}

const Badges = () => {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchBadges();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchBadges = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch all badges
      const { data: allBadges, error: badgesError } = await supabase
        .from("badges")
        .select("*")
        .order("points", { ascending: true });

      if (badgesError) throw badgesError;

      // Fetch user's earned badges
      const { data: userBadges, error: userBadgesError } = await supabase
        .from("user_badges")
        .select("badge_id, earned_at")
        .eq("user_id", session.user.id);

      if (userBadgesError) throw userBadgesError;

      // Fetch user stats for progress
      const [quizAttempts, absensi] = await Promise.all([
        supabase.from("quiz_attempts").select("score").eq("user_id", session.user.id),
        supabase.from("absensi").select("id").eq("user_id", session.user.id),
      ]);

      const quizCount = quizAttempts.data?.length || 0;
      const attendanceCount = absensi.data?.length || 0;
      const maxScore = quizAttempts.data && quizAttempts.data.length > 0
        ? Math.max(...quizAttempts.data.map(a => a.score))
        : 0;

      const earnedBadgeIds = new Set(userBadges?.map(b => b.badge_id) || []);
      
      const badgesWithProgress = allBadges?.map(badge => {
        const earned = earnedBadgeIds.has(badge.id);
        const userBadge = userBadges?.find(ub => ub.badge_id === badge.id);
        
        let progress = 0;
        if (!earned) {
          if (badge.requirement_type === 'quiz_count') {
            progress = Math.min((quizCount / badge.requirement_value) * 100, 100);
          } else if (badge.requirement_type === 'attendance_count') {
            progress = Math.min((attendanceCount / badge.requirement_value) * 100, 100);
          } else if (badge.requirement_type === 'quiz_score') {
            progress = Math.min((maxScore / badge.requirement_value) * 100, 100);
          }
        }

        return {
          ...badge,
          earned,
          earned_at: userBadge?.earned_at,
          progress,
        };
      }) || [];

      setBadges(badgesWithProgress);
      
      const points = badgesWithProgress
        .filter(b => b.earned)
        .reduce((sum, b) => sum + b.points, 0);
      setTotalPoints(points);

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'quiz':
        return 'bg-blue-500';
      case 'attendance':
        return 'bg-green-500';
      case 'achievement':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Badge & Achievements
            </h1>
          </div>
          <p className="text-muted-foreground">
            Kumpulkan badge dengan mengikuti kajian, quiz, dan meraih prestasi
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Total Poin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{totalPoints} Poin</div>
            <p className="text-muted-foreground mt-2">
              {badges.filter(b => b.earned).length} dari {badges.length} badge terkumpul
            </p>
          </CardContent>
        </Card>

        {loading ? (
          <BadgesSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <Card
                key={badge.id}
                className={`${
                  badge.earned
                    ? 'border-2 border-primary shadow-lg'
                    : 'opacity-75'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-6xl">{badge.earned ? badge.icon : <Lock className="h-16 w-16 text-muted-foreground" />}</div>
                    <Badge className={getCategoryColor(badge.category)}>
                      {badge.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardTitle className="text-lg">{badge.name}</CardTitle>
                  <CardDescription>{badge.description}</CardDescription>
                  
                  {!badge.earned && badge.progress !== undefined && (
                    <div className="space-y-1">
                      <Progress value={badge.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Progress: {Math.round(badge.progress)}%
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-primary">
                      +{badge.points} poin
                    </span>
                    {badge.earned && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(badge.earned_at!).toLocaleDateString("id-ID")}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Badges;
