import { useState, useEffect, useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { PersonData } from '@/data/mockData';

export interface SavedFace {
  id: string;
  personData: PersonData;
  descriptor: Float32Array;
  imageUrl: string;
}

const MODELS_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
const MATCH_THRESHOLD = 0.6;

export const useFaceRecognition = () => {
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedFaces, setSavedFaces] = useState<SavedFace[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URL),
        ]);
        setIsModelsLoaded(true);
        setError(null);
      } catch (err) {
        console.error('Error loading face-api models:', err);
        setError('Failed to load face recognition models');
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();

    // Load saved faces from localStorage
    const stored = localStorage.getItem('memoryanchor_faces');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const restored = parsed.map((face: any) => ({
          ...face,
          descriptor: new Float32Array(face.descriptor),
        }));
        setSavedFaces(restored);
      } catch (e) {
        console.error('Error loading saved faces:', e);
      }
    }
  }, []);

  // Save faces to localStorage whenever they change
  useEffect(() => {
    if (savedFaces.length > 0) {
      const toStore = savedFaces.map(face => ({
        ...face,
        descriptor: Array.from(face.descriptor),
      }));
      localStorage.setItem('memoryanchor_faces', JSON.stringify(toStore));
    }
  }, [savedFaces]);

  const startCamera = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      videoElement.srcObject = stream;
      videoRef.current = videoElement;
      streamRef.current = stream;
      return true;
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please grant camera permissions.');
      return false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current = null;
    }
  }, []);

  const detectFace = useCallback(async (videoElement: HTMLVideoElement): Promise<faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>> | null> => {
    if (!isModelsLoaded) return null;

    const detection = await faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    return detection || null;
  }, [isModelsLoaded]);

  const extractDescriptorFromImage = useCallback(async (imageFile: File): Promise<Float32Array | null> => {
    if (!isModelsLoaded) return null;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const detection = await faceapi
            .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection) {
            resolve(detection.descriptor);
          } else {
            resolve(null);
          }
        } catch (err) {
          console.error('Error extracting face descriptor:', err);
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = URL.createObjectURL(imageFile);
    });
  }, [isModelsLoaded]);

  const addFace = useCallback(async (imageFile: File, personData: PersonData): Promise<boolean> => {
    const descriptor = await extractDescriptorFromImage(imageFile);
    if (!descriptor) {
      setError('No face detected in the uploaded image');
      return false;
    }

    const imageUrl = URL.createObjectURL(imageFile);
    const newFace: SavedFace = {
      id: personData.id,
      personData,
      descriptor,
      imageUrl,
    };

    setSavedFaces(prev => {
      // Replace if same ID exists
      const filtered = prev.filter(f => f.id !== personData.id);
      return [...filtered, newFace];
    });

    return true;
  }, [extractDescriptorFromImage]);

  const removeFace = useCallback((id: string) => {
    setSavedFaces(prev => prev.filter(f => f.id !== id));
    const stored = localStorage.getItem('memoryanchor_faces');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((f: any) => f.id !== id);
        localStorage.setItem('memoryanchor_faces', JSON.stringify(filtered));
      } catch (e) {
        console.error('Error removing face from storage:', e);
      }
    }
  }, []);

  const matchFace = useCallback((descriptor: Float32Array): SavedFace | null => {
    if (savedFaces.length === 0) return null;

    let bestMatch: SavedFace | null = null;
    let bestDistance = Infinity;

    for (const savedFace of savedFaces) {
      const distance = faceapi.euclideanDistance(descriptor, savedFace.descriptor);
      if (distance < bestDistance && distance < MATCH_THRESHOLD) {
        bestDistance = distance;
        bestMatch = savedFace;
      }
    }

    return bestMatch;
  }, [savedFaces]);

  const scanAndMatch = useCallback(async (videoElement: HTMLVideoElement): Promise<PersonData | null> => {
    const detection = await detectFace(videoElement);
    if (!detection) return null;

    const match = matchFace(detection.descriptor);
    return match ? match.personData : null;
  }, [detectFace, matchFace]);

  return {
    isModelsLoaded,
    isLoading,
    error,
    setError,
    savedFaces,
    startCamera,
    stopCamera,
    detectFace,
    addFace,
    removeFace,
    matchFace,
    scanAndMatch,
  };
};
