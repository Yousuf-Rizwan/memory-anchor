import { useState, useEffect, useCallback, useRef } from 'react';
import { detectFaces, extractFaceEmbedding, compareFaceEmbeddings, cropFaceFromVideo, initializeFaceDetection } from '@/lib/faceRecognition';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Person {
  id: string;
  name: string;
  relationship: string;
  notes: string | null;
  face_embeddings: any;
  photo_url: string | null;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useFaceRecognition = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [recognizedPerson, setRecognizedPerson] = useState<Person | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load people from database
  const loadPeople = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('people')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      console.log('Loaded people from database:', data?.length || 0);
      setPeople(data || []);
    } catch (error) {
      console.error('Error loading people:', error);
    }
  }, []);

  // Initialize face detection
  useEffect(() => {
    const init = async () => {
      try {
        console.log('Initializing face recognition...');
        await initializeFaceDetection();
        setIsInitialized(true);
        console.log('Face recognition initialized');
        
        toast({
          title: "AI Ready",
          description: "Face recognition models loaded",
        });
      } catch (error) {
        console.error('Failed to initialize:', error);
        toast({
          title: "AI Error",
          description: "Could not load face recognition models",
          variant: "destructive",
        });
      }
    };

    init();
    loadPeople();
  }, [loadPeople]);

  // Find best matching person
  const findMatchingPerson = useCallback((faceEmbedding: number[]): Person | null => {
    let bestMatch: Person | null = null;
    let bestSimilarity = 0;

    for (const person of people) {
      if (!person.face_embeddings || person.face_embeddings.length === 0) {
        continue;
      }

      // Compare with all stored embeddings for this person
      for (const storedEmbedding of person.face_embeddings) {
        const similarity = compareFaceEmbeddings(faceEmbedding, storedEmbedding);
        
        console.log(`Similarity with ${person.name}:`, similarity);

        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
          bestMatch = person;
        }
      }
    }

    // Threshold for recognition (adjust based on testing)
    const RECOGNITION_THRESHOLD = 0.7;
    
    if (bestSimilarity > RECOGNITION_THRESHOLD) {
      console.log(`Recognized: ${bestMatch?.name} (similarity: ${bestSimilarity})`);
      return bestMatch;
    }

    console.log('No match found above threshold');
    return null;
  }, [people]);

  // Detect and recognize faces
  const detectAndRecognize = useCallback(async () => {
    if (!videoRef.current || !isInitialized || isDetecting) return;

    setIsDetecting(true);

    try {
      // Detect faces in video
      const faces = await detectFaces(videoRef.current);
      
      if (faces && faces.length > 0) {
        console.log(`Detected ${faces.length} face(s)`);
        
        // Process the first detected face
        const face = faces[0];
        
        // Crop face from video
        const faceCanvas = cropFaceFromVideo(videoRef.current, face.box);
        
        // Extract face embedding
        const embedding = await extractFaceEmbedding(faceCanvas);
        
        // Find matching person
        const matchedPerson = findMatchingPerson(embedding);
        
        setRecognizedPerson(matchedPerson);
      } else {
        setRecognizedPerson(null);
      }
    } catch (error) {
      console.error('Detection error:', error);
    } finally {
      setIsDetecting(false);
    }
  }, [videoRef, isInitialized, isDetecting, findMatchingPerson]);

  // Start continuous detection
  const startDetection = useCallback(() => {
    if (detectionIntervalRef.current) return;

    console.log('Starting face detection...');
    
    // Run detection every 2 seconds
    detectionIntervalRef.current = setInterval(() => {
      detectAndRecognize();
    }, 2000);
  }, [detectAndRecognize]);

  // Stop detection
  const stopDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      console.log('Stopping face detection...');
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
      setRecognizedPerson(null);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  return {
    isInitialized,
    isDetecting,
    recognizedPerson,
    startDetection,
    stopDetection,
    loadPeople,
  };
};
