import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, CameraOff, ArrowLeft, Loader2, ImagePlus } from "lucide-react";
import { Link } from "react-router-dom";
import PersonInfoPanel from "@/components/PersonInfoPanel";
import { useCamera } from "@/hooks/useCamera";
import { useFaceRecognition } from "@/hooks/useFaceRecognition";
import { useSnapshot } from "@/hooks/useSnapshot";

const Recognition = () => {
  const { isActive, videoRef, startCamera, stopCamera } = useCamera();
  const { 
    isInitialized, 
    isDetecting, 
    recognizedPerson, 
    startDetection, 
    stopDetection,
    loadPeople 
  } = useFaceRecognition(videoRef);
  const { captureSnapshot, isSaving } = useSnapshot();

  // Start/stop detection when camera state changes
  useEffect(() => {
    if (isActive && isInitialized) {
      // Wait a bit for video to stabilize
      const timeout = setTimeout(() => {
        startDetection();
      }, 1000);
      return () => clearTimeout(timeout);
    } else {
      stopDetection();
    }
  }, [isActive, isInitialized, startDetection, stopDetection]);

  const handleStartCamera = async () => {
    await startCamera();
  };

  const handleStopCamera = () => {
    stopCamera();
    stopDetection();
  };

  const handleTakeSnapshot = async () => {
    if (!videoRef.current || !recognizedPerson) return;
    
    const success = await captureSnapshot(
      videoRef.current,
      recognizedPerson.id,
      recognizedPerson.name
    );

    if (success) {
      // Reload people data to get updated embeddings
      await loadPeople();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-display font-bold text-foreground">Memory Anchor</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Video Area */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-soft">
              <div className="aspect-video bg-muted relative flex items-center justify-center">
                {!isActive ? (
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Camera className="w-12 h-12 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold mb-2 text-foreground">
                        Camera Not Active
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        Start the camera to begin recognizing people
                      </p>
                      <Button 
                        size="lg"
                        onClick={handleStartCamera}
                        className="rounded-xl"
                        disabled={!isInitialized}
                      >
                        {!isInitialized ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Loading AI Models...
                          </>
                        ) : (
                          <>
                            <Camera className="w-5 h-5 mr-2" />
                            Start Camera
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Video element for camera feed */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {/* Status overlay */}
                    <div className="absolute top-4 left-4 space-y-2 z-10">
                      <div className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Camera Active
                      </div>
                      
                      {isDetecting && (
                        <div className="bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing faces...
                        </div>
                      )}
                      
                      {recognizedPerson && (
                        <div className="bg-green-600/90 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                          ✓ Recognized: {recognizedPerson.name}
                        </div>
                      )}
                    </div>
                    
                    {/* Control buttons */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-3">
                      {recognizedPerson && (
                        <Button 
                          variant="secondary"
                          size="lg"
                          onClick={handleTakeSnapshot}
                          disabled={isSaving}
                          className="rounded-xl shadow-lg"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <ImagePlus className="w-5 h-5 mr-2" />
                              Save Snapshot
                            </>
                          )}
                        </Button>
                      )}
                      <Button 
                        variant="destructive"
                        size="lg"
                        onClick={handleStopCamera}
                        className="rounded-xl shadow-lg"
                      >
                        <CameraOff className="w-5 h-5 mr-2" />
                        Stop Camera
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Instructions */}
            <Card className="mt-6 p-6 bg-accent/10 border-accent/20">
              <h3 className="font-display font-bold text-lg mb-3 text-foreground">
                How to use Recognition
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">1.</span>
                  <span>Add people with photos in the "Manage People" section first</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">2.</span>
                  <span>Click "Start Camera" and allow camera access when prompted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">3.</span>
                  <span>Look at a person - AI will detect and match their face</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">4.</span>
                  <span>Their information appears on the right panel when recognized</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Person Info Panel */}
          <div className="lg:col-span-1">
            <PersonInfoPanel person={recognizedPerson} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recognition;
