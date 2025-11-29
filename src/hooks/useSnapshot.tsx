import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extractFaceEmbedding } from '@/lib/faceRecognition';
import { toast } from '@/hooks/use-toast';

export const useSnapshot = () => {
  const [isSaving, setIsSaving] = useState(false);

  const captureSnapshot = async (
    videoElement: HTMLVideoElement,
    personId: string,
    personName: string
  ): Promise<boolean> => {
    setIsSaving(true);

    try {
      // Create canvas to capture video frame
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Draw current video frame to canvas
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create blob'));
          },
          'image/jpeg',
          0.9
        );
      });

      // Extract face embedding from the snapshot
      const embedding = await extractFaceEmbedding(canvas);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get current person data to merge embeddings
      const { data: personData, error: fetchError } = await supabase
        .from('people')
        .select('face_embeddings, photo_url')
        .eq('id', personId)
        .single();

      if (fetchError) throw fetchError;

      // Delete old photo if it exists
      if (personData.photo_url) {
        const oldPath = personData.photo_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('person-photos')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new photo to Supabase Storage
      const fileName = `${personId}-${Date.now()}.jpg`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('person-photos')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('person-photos')
        .getPublicUrl(filePath);

      // Merge new embedding with existing embeddings
      const existingEmbeddings = Array.isArray(personData.face_embeddings) 
        ? personData.face_embeddings 
        : [];
      const updatedEmbeddings = [...existingEmbeddings, embedding];

      // Update person record with new photo and embeddings
      const { error: updateError } = await supabase
        .from('people')
        .update({
          photo_url: publicUrl,
          face_embeddings: updatedEmbeddings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', personId);

      if (updateError) throw updateError;

      toast({
        title: "Snapshot saved!",
        description: `Updated ${personName}'s profile with new photo and face data`,
      });

      return true;
    } catch (error) {
      console.error('Error saving snapshot:', error);
      toast({
        title: "Snapshot failed",
        description: error instanceof Error ? error.message : "Could not save snapshot",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    captureSnapshot,
    isSaving,
  };
};
