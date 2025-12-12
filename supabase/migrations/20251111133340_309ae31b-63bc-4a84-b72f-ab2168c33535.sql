-- Enable realtime for absensi table
ALTER TABLE public.absensi REPLICA IDENTITY FULL;

-- Add absensi to realtime publication if not already added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'absensi'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.absensi;
  END IF;
END $$;