import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  total_score: number;
  quiz_count: number;
  avg_score: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchLeaderboard();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchLeaderboard = async () => {
    try {
      // Fetch all quiz attempts
      const { data: quizData, error: quizError } = await supabase
        .from("quiz_attempts")
        .select("user_id, score")
        .order("score", { ascending: false });

      if (quizError) throw quizError;

      // Get unique user IDs
      const userIds = [...new Set(quizData?.map(attempt => attempt.user_id) || [])];

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      if (profilesError) throw profilesError;

      // Create a map of user_id to full_name
      const profileMap = new Map(profilesData?.map(p => [p.user_id, p.full_name]) || []);

      // Aggregate data by user
      const userScores: Record<string, { scores: number[]; full_name: string }> = {};
      
      quizData?.forEach((attempt) => {
        if (!userScores[attempt.user_id]) {
          userScores[attempt.user_id] = {
            scores: [],
            full_name: profileMap.get(attempt.user_id) || "Unknown User",
          };
        }
        userScores[attempt.user_id].scores.push(attempt.score);
      });

      // Calculate leaderboard
      const leaderboardData: LeaderboardEntry[] = Object.entries(userScores).map(([user_id, data]) => {
        const total_score = data.scores.reduce((sum, score) => sum + score, 0);
        const quiz_count = data.scores.length;
        const avg_score = Math.round(total_score / quiz_count);
        
        return {
          user_id,
          full_name: data.full_name,
          total_score,
          quiz_count,
          avg_score,
        };
      });

      // Sort by average score
      leaderboardData.sort((a, b) => b.avg_score - a.avg_score);
      
      setLeaderboard(leaderboardData);
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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">🥇 Juara 1</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400">🥈 Juara 2</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600">🥉 Juara 3</Badge>;
    return <Badge variant="secondary">#{rank}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8 text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Leaderboard Quiz
          </h1>
          <p className="text-muted-foreground">
            Ranking berdasarkan rata-rata skor quiz
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memuat leaderboard...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Belum ada data leaderboard</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              return (
                <Card key={entry.user_id} className={`${rank <= 3 ? 'border-2 border-primary' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12">
                        {getRankIcon(rank) || (
                          <span className="text-2xl font-bold text-muted-foreground">
                            {rank}
                          </span>
                        )}
                      </div>
                      
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {entry.full_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{entry.full_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {entry.quiz_count} quiz dikerjakan
                        </p>
                      </div>

                      <div className="text-right space-y-1">
                        {getRankBadge(rank)}
                        <p className="text-2xl font-bold text-primary">
                          {entry.avg_score}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Rata-rata
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
