import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { triggerBadgeConfetti, triggerAchievementConfetti } from '@/utils/confetti';

export const useAchievementNotifications = (userId: string | undefined) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('achievement-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${userId}`,
        },
        async (payload: any) => {
          // Fetch achievement details
          const { data: achievement } = await supabase
            .from('achievements' as any)
            .select('*')
            .eq('id', payload.new.achievement_id)
            .single() as any;

          if (achievement && typeof achievement === 'object') {
            const ach = achievement as any;
            // Show toast
            toast({
              title: "🎉 Achievement Unlocked!",
              description: `${ach.icon} ${ach.name} - ${ach.description} (+${ach.points} poin)`,
              duration: 5000,
            });

            // Trigger confetti based on rarity
            if (ach.rarity === 'legendary') {
              triggerAchievementConfetti(ach.color);
            } else {
              triggerBadgeConfetti();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, toast]);
};
