import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, UserCheck, UserX, ScanFace } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PersonData, mockPeople } from '@/data/mockData';
import { useFaceRecognition } from '@/hooks/useFaceRecognition';

interface FaceScannerProps {
  onPersonDetected: (person: PersonData | null) => void;
  isScanning: boolean;
  onScanningChange: (scanning: boolean) => void;
  className?: string;
}

const FaceScanner = ({ onPersonDetected, isScanning, onScanningChange, className }: FaceScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [lastMatch, setLastMatch] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'detected' | 'unknown'>('idle');

  const {
    isModelsLoaded,
    isLoading,
    error,
    savedFaces,
    startCamera,
    stopCamera,
    scanAndMatch,
    detectFace,
  } = useFaceRecognition();

  const handleStartScanning = useCallback(async () => {
    if (!videoRef.current || !isModelsLoaded) return;

    const success = await startCamera(videoRef.current);
    if (success) {
      setCameraReady(true);
      onScanningChange(true);
      setScanStatus('scanning');
    }
  }, [isModelsLoaded, startCamera, onScanningChange]);

  const handleStopScanning = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    stopCamera();
    setCameraReady(false);
    onScanningChange(false);
    setScanStatus('idle');
    setLastMatch(null);
    onPersonDetected(mockPeople.alone);
  }, [stopCamera, onScanningChange, onPersonDetected]);

  // Continuous face scanning
  useEffect(() => {
    if (!isScanning || !cameraReady || !videoRef.current) return;

    const scan = async () => {
      if (!videoRef.current) return;

      // First check if any face is detected
      const detection = await detectFace(videoRef.current);
      
      if (detection) {
        // Face detected, try to match
        const matchedPerson = await scanAndMatch(videoRef.current);
        
        if (matchedPerson && matchedPerson.id !== 'alone') {
          if (lastMatch !== matchedPerson.id) {
            setLastMatch(matchedPerson.id);
            setScanStatus('detected');
            onPersonDetected(matchedPerson);
          }
        } else {
          // Face detected but not recognized
          if (lastMatch !== 'unknown') {
            setLastMatch('unknown');
            setScanStatus('unknown');
            onPersonDetected({
              id: 'unknown',
              name: 'Unknown Visitor',
              relation: 'Not in database',
              lastVisit: 'First visit',
              conversationSummary: 'This person is not yet registered in the system.',
              currentUpdate: 'Consider adding their profile for future recognition.',
              avatar: '❓',
            });
          }
        }

        // Draw face box on canvas
        if (canvasRef.current && videoRef.current) {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const box = detection.detection.box;
            ctx.strokeStyle = scanStatus === 'detected' ? '#22c55e' : '#eab308';
            ctx.lineWidth = 3;
            ctx.strokeRect(box.x, box.y, box.width, box.height);
          }
        }
      } else {
        // No face detected
        if (lastMatch !== null) {
          setLastMatch(null);
          setScanStatus('scanning');
          onPersonDetected(mockPeople.alone);
        }
        
        // Clear canvas
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }
      }
    };

    scanIntervalRef.current = setInterval(scan, 500);

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [isScanning, cameraReady, detectFace, scanAndMatch, lastMatch, onPersonDetected, scanStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handleStopScanning();
    };
  }, [handleStopScanning]);

  if (isLoading) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border", className)}>
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading face recognition models...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 bg-destructive/10 rounded-2xl border border-destructive/20", className)}>
        <UserX className="w-8 h-8 text-destructive mb-4" />
        <p className="text-destructive text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Video container */}
      <div className="relative w-full max-w-md aspect-[4/3] bg-muted rounded-2xl overflow-hidden border-2 border-border shadow-elegant">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            cameraReady ? "opacity-100" : "opacity-0"
          )}
          onLoadedMetadata={() => {
            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        
        {/* Overlay when not scanning */}
        {!cameraReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 backdrop-blur-sm">
            <Camera className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center px-4">
              Camera preview will appear here
            </p>
          </div>
        )}

        {/* Status indicator */}
        {cameraReady && (
          <div className={cn(
            "absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors",
            scanStatus === 'detected' && "bg-green-500/90 text-white",
            scanStatus === 'unknown' && "bg-yellow-500/90 text-white",
            scanStatus === 'scanning' && "bg-primary/90 text-primary-foreground"
          )}>
            {scanStatus === 'detected' && (
              <>
                <UserCheck className="w-4 h-4" />
                Person Recognized
              </>
            )}
            {scanStatus === 'unknown' && (
              <>
                <ScanFace className="w-4 h-4" />
                Unknown Face
              </>
            )}
            {scanStatus === 'scanning' && (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning...
              </>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col items-center gap-3">
        {!isScanning ? (
          <Button
            variant="warm"
            size="lg"
            onClick={handleStartScanning}
            disabled={!isModelsLoaded}
            className="group"
          >
            <ScanFace className="w-5 h-5 mr-2" />
            Start Face Scan
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            onClick={handleStopScanning}
          >
            Stop Scanning
          </Button>
        )}

        {savedFaces.length === 0 && (
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            No faces registered yet. Add people in the "Manage Faces" section below to enable recognition.
          </p>
        )}

        {savedFaces.length > 0 && !isScanning && (
          <p className="text-sm text-muted-foreground">
            {savedFaces.length} face{savedFaces.length !== 1 ? 's' : ''} registered
          </p>
        )}
      </div>
    </div>
  );
};

export default FaceScanner;
