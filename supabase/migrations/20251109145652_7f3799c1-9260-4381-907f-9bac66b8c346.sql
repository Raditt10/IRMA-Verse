-- Create badges table
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL, -- 'quiz', 'attendance', 'achievement'
  requirement_type TEXT NOT NULL, -- 'quiz_score', 'quiz_count', 'attendance_count', 'achievement_count'
  requirement_value INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  materi_id UUID REFERENCES public.materi_kajian(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Badges policies
CREATE POLICY "Anyone can view badges"
ON public.badges FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage badges"
ON public.badges FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- User badges policies
CREATE POLICY "Users can view all badges earned"
ON public.user_badges FOR SELECT
USING (true);

CREATE POLICY "System can award badges"
ON public.user_badges FOR INSERT
WITH CHECK (true);

-- Chat rooms policies
CREATE POLICY "Anyone can view chat rooms"
ON public.chat_rooms FOR SELECT
USING (true);

CREATE POLICY "Admin and pemateri can create rooms"
ON public.chat_rooms FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pemateri'::app_role));

CREATE POLICY "Admin and pemateri can update rooms"
ON public.chat_rooms FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pemateri'::app_role));

CREATE POLICY "Only admins can delete rooms"
ON public.chat_rooms FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Chat messages policies
CREATE POLICY "Anyone can view messages"
ON public.chat_messages FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can send messages"
ON public.chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages"
ON public.chat_messages FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
ON public.chat_messages FOR DELETE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Triggers
CREATE TRIGGER update_chat_rooms_updated_at
BEFORE UPDATE ON public.chat_rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Insert default badges
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, points) VALUES
('Pemula Quiz', 'Selesaikan 1 quiz pertama', '🎯', 'quiz', 'quiz_count', 1, 10),
('Ahli Quiz', 'Selesaikan 5 quiz', '🏆', 'quiz', 'quiz_count', 5, 50),
('Master Quiz', 'Selesaikan 10 quiz', '👑', 'quiz', 'quiz_count', 10, 100),
('Nilai Sempurna', 'Dapatkan skor 100% pada quiz', '⭐', 'quiz', 'quiz_score', 100, 75),
('Kehadiran Rajin', 'Hadir 5 kali kajian', '📚', 'attendance', 'attendance_count', 5, 50),
('Kehadiran Super', 'Hadir 10 kali kajian', '🔥', 'attendance', 'attendance_count', 10, 100),
('Berprestasi', 'Raih 1 prestasi', '🌟', 'achievement', 'achievement_count', 1, 25);