import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingTourProps {
  run: boolean;
  onComplete: () => void;
}

export const OnboardingTour = ({ run, onComplete }: OnboardingTourProps) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Selamat Datang di IRMAVerse! 🎉</h2>
          <p className="text-muted-foreground">
            Mari kita kenalan dengan fitur-fitur utama platform ini. Tutorial ini hanya memakan waktu 1 menit!
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="dashboard-stats"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Statistik Kamu 📊</h3>
          <p className="text-sm text-muted-foreground">
            Di sini kamu bisa melihat total poin, badge yang terkumpul, quiz yang sudah dikerjakan, dan rata-rata skormu.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="quick-actions"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Akses Cepat ⚡</h3>
          <p className="text-sm text-muted-foreground">
            Klik kartu ini untuk langsung mengakses fitur-fitur utama seperti pengumuman, jadwal, materi, quiz, dan chat!
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="level-display"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Level Member 🏆</h3>
          <p className="text-sm text-muted-foreground">
            Kumpulkan poin dari quiz dan aktivitas untuk naik level! Semakin tinggi levelmu, semakin banyak badge yang bisa kamu unlock.
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="notifications"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Notifikasi 🔔</h3>
          <p className="text-sm text-muted-foreground">
            Kamu akan mendapat notifikasi saat ada pengumuman baru, quiz baru, atau saat mendapatkan badge!
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="profile"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Profil Kamu 👤</h3>
          <p className="text-sm text-muted-foreground">
            Klik di sini untuk melihat dan edit profilmu, termasuk foto profil, bio, dan riwayat aktivitas lengkap!
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Siap Memulai! 🚀</h2>
          <p className="text-muted-foreground">
            Sekarang kamu sudah tahu fitur-fitur utama IRMAVerse. Selamat belajar dan semoga bermanfaat!
          </p>
          <p className="text-sm text-muted-foreground italic">
            Psst... Coba kerjakan quiz untuk mendapatkan badge pertamamu! 🎯
          </p>
        </div>
      ),
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      onComplete();
    }

    if (type === 'step:after') {
      setStepIndex(index + 1);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: 'hsl(158 64% 35%)',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: '12px',
          padding: '20px',
        },
        buttonNext: {
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '600',
        },
        buttonBack: {
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
          marginRight: '8px',
        },
        buttonSkip: {
          color: 'hsl(158 20% 45%)',
          fontSize: '14px',
        },
      }}
      locale={{
        back: 'Kembali',
        close: 'Tutup',
        last: 'Selesai',
        next: 'Lanjut',
        skip: 'Lewati',
      }}
    />
  );
};

export const useOnboarding = () => {
  const [showTour, setShowTour] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!hasChecked) {
      checkOnboarding();
    }
  }, [hasChecked]);

  const checkOnboarding = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        setHasChecked(true);
        return;
      }

      // Check session storage first to avoid spam
      const sessionKey = `onboarding_shown_${session.user.id}`;
      const shownInSession = sessionStorage.getItem(sessionKey);
      
      if (shownInSession === 'true') {
        setLoading(false);
        setHasChecked(true);
        return;
      }

      // Check if user has completed onboarding in database
      const { data: preferences } = await supabase
        .from('user_preferences' as any)
        .select('onboarding_completed')
        .eq('user_id', session.user.id)
        .single() as any;

      if (!preferences) {
        // Create preferences record and show tour
        await supabase
          .from('user_preferences' as any)
          .insert({ user_id: session.user.id, onboarding_completed: false });
        
        setShowTour(true);
        sessionStorage.setItem(sessionKey, 'true');
      } else if (preferences && typeof preferences === 'object') {
        const pref = preferences as any;
        if (!pref.onboarding_completed) {
          setShowTour(true);
          sessionStorage.setItem(sessionKey, 'true');
        }
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
    } finally {
      setLoading(false);
      setHasChecked(true);
    }
  };

  const completeOnboarding = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase
        .from('user_preferences' as any)
        .update({ onboarding_completed: true })
        .eq('user_id', session.user.id);

      setShowTour(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return { showTour, loading, completeOnboarding };
};
