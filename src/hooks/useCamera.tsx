import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

export const useCamera = () => {
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      console.log('Camera access granted', mediaStream);
      
      setStream(mediaStream);
      setIsActive(true);

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video metadata to load before playing
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
            console.log('Video playback started');
          } catch (error) {
            console.error('Error playing video:', error);
          }
        };
      }

      toast({
        title: "Camera started",
        description: "Video feed is now active",
      });

    } catch (error) {
      console.error('Camera access error:', error);
      
      let errorMessage = "Could not access camera";
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = "Camera permission denied. Please allow camera access in your browser settings.";
        } else if (error.name === 'NotFoundError') {
          errorMessage = "No camera found on this device";
        } else if (error.name === 'NotReadableError') {
          errorMessage = "Camera is already in use by another application";
        }
      }

      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track);
      });
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);

    toast({
      title: "Camera stopped",
      description: "Video feed has been deactivated",
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    isActive,
    videoRef,
    startCamera,
    stopCamera,
  };
};
