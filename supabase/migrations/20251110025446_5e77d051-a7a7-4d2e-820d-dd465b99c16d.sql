-- Add bio and avatar_url to profiles (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
    ALTER TABLE public.profiles ADD COLUMN bio text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url text;
  END IF;
END $$;

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for avatars bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can view all avatars'
  ) THEN
    CREATE POLICY "Users can view all avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload their own avatar'
  ) THEN
    CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'avatars' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update their own avatar'
  ) THEN
    CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'avatars' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete their own avatar'
  ) THEN
    CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'avatars' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

-- Create member levels table
CREATE TABLE IF NOT EXISTS public.member_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number integer NOT NULL UNIQUE,
  level_name text NOT NULL,
  required_points integer NOT NULL,
  color text NOT NULL,
  icon text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on member_levels
ALTER TABLE public.member_levels ENABLE ROW LEVEL SECURITY;

-- Anyone can view levels
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'member_levels' 
    AND policyname = 'Anyone can view member levels'
  ) THEN
    CREATE POLICY "Anyone can view member levels"
    ON public.member_levels FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'member_levels' 
    AND policyname = 'Only admins can manage levels'
  ) THEN
    CREATE POLICY "Only admins can manage levels"
    ON public.member_levels FOR ALL
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Insert default levels
INSERT INTO public.member_levels (level_number, level_name, required_points, color, icon) VALUES
(1, 'Pemula', 0, '#94a3b8', '🌱'),
(2, 'Aktif', 100, '#22c55e', '🌿'),
(3, 'Rajin', 300, '#3b82f6', '🌳'),
(4, 'Berprestasi', 600, '#a855f7', '⭐'),
(5, 'Teladan', 1000, '#f59e0b', '🏆'),
(6, 'Master', 1500, '#ef4444', '👑')
ON CONFLICT (level_number) DO NOTHING;