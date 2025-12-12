import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp } from "lucide-react";

interface MemberLevel {
  level_number: number;
  level_name: string;
  required_points: number;
  color: string;
  icon: string;
}

interface LevelDisplayProps {
  totalPoints: number;
}

const LevelDisplay = ({ totalPoints }: LevelDisplayProps) => {
  const [currentLevel, setCurrentLevel] = useState<MemberLevel | null>(null);
  const [nextLevel, setNextLevel] = useState<MemberLevel | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchLevels();
  }, [totalPoints]);

  const fetchLevels = async () => {
    const { data: levels } = await supabase
      .from("member_levels")
      .select("*")
      .order("level_number", { ascending: true });

    if (!levels || levels.length === 0) return;

    // Find current level
    let current = levels[0] as MemberLevel;
    for (let i = levels.length - 1; i >= 0; i--) {
      if (totalPoints >= (levels[i] as MemberLevel).required_points) {
        current = levels[i] as MemberLevel;
        break;
      }
    }
    setCurrentLevel(current);

    // Find next level
    const nextLevelIndex = levels.findIndex(l => (l as MemberLevel).level_number === current.level_number) + 1;
    if (nextLevelIndex < levels.length) {
      const next = levels[nextLevelIndex] as MemberLevel;
      setNextLevel(next);

      // Calculate progress
      const pointsInCurrentLevel = totalPoints - current.required_points;
      const pointsNeededForNext = next.required_points - current.required_points;
      const progressPercent = Math.min((pointsInCurrentLevel / pointsNeededForNext) * 100, 100);
      setProgress(progressPercent);
    } else {
      setNextLevel(null);
      setProgress(100);
    }
  };

  if (!currentLevel) return null;

  return (
    <Card className="border-2" style={{ borderColor: currentLevel.color }}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" style={{ color: currentLevel.color }} />
            <span>Level Member</span>
          </div>
          <Badge style={{ backgroundColor: currentLevel.color }} className="text-white">
            Level {currentLevel.level_number}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{currentLevel.icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold" style={{ color: currentLevel.color }}>
              {currentLevel.level_name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {totalPoints} poin total
            </p>
          </div>
        </div>

        {nextLevel && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Progress ke {nextLevel.level_name}
              </span>
              <span className="font-medium">
                {nextLevel.required_points - totalPoints} poin lagi
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{currentLevel.required_points} poin</span>
              <div className="flex-1 border-t border-dashed" />
              <span>{nextLevel.required_points} poin</span>
            </div>
          </div>
        )}

        {!nextLevel && (
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground">
              🎉 Level Maksimal Tercapai!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Kamu sudah mencapai level tertinggi
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LevelDisplay;
