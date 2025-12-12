-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('prestasi-images', 'prestasi-images', true),
  ('gallery-images', 'gallery-images', true);

-- Storage policies for prestasi-images
CREATE POLICY "Anyone can view prestasi images"
ON storage.objects FOR SELECT
USING (bucket_id = 'prestasi-images');

CREATE POLICY "Admin and pemateri can upload prestasi images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'prestasi-images' 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pemateri'::app_role))
);

CREATE POLICY "Admin and pemateri can delete prestasi images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'prestasi-images' 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pemateri'::app_role))
);

-- Storage policies for gallery-images
CREATE POLICY "Anyone can view gallery images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery-images');

CREATE POLICY "Admin and pemateri can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery-images' 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pemateri'::app_role))
);

CREATE POLICY "Admin and pemateri can delete gallery images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gallery-images' 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pemateri'::app_role))
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Gallery RLS policies
CREATE POLICY "Anyone can view gallery"
ON public.gallery FOR SELECT
USING (true);

CREATE POLICY "Admin and pemateri can create gallery"
ON public.gallery FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pemateri'::app_role));

CREATE POLICY "Admin and pemateri can update gallery"
ON public.gallery FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pemateri'::app_role));

CREATE POLICY "Only admins can delete gallery"
ON public.gallery FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for gallery updated_at
CREATE TRIGGER update_gallery_updated_at
BEFORE UPDATE ON public.gallery
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();