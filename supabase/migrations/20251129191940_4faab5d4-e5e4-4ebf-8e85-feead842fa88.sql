-- Create storage bucket for person photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('person-photos', 'person-photos', true);

-- Storage policies for person photos
CREATE POLICY "Users can view their own person photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'person-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own person photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'person-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own person photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'person-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own person photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'person-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add face embeddings column to people table for ML matching
ALTER TABLE public.people
ADD COLUMN face_embeddings JSONB;

-- Add index for faster face embedding searches
CREATE INDEX idx_people_face_embeddings ON public.people USING gin(face_embeddings);