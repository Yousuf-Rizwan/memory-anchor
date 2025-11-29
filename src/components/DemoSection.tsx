import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import PatientScreen from "./PatientScreen";
import { mockPeople, demoSequence } from "@/data/mockData";
import { Play, RotateCcw, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

const DemoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const currentPerson = mockPeople[demoSequence[currentStep].personId];

  const totalDuration = demoSequence.reduce((acc, step) => acc + step.duration, 0);

  const resetDemo = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    setIsTransitioning(false);
    setElapsedTime(0);
  }, []);

  const playDemo = useCallback(() => {
    resetDemo();
    setIsPlaying(true);
  }, [resetDemo]);

  const pauseDemo = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    let accumulatedTime = 0;
    for (let i = 0; i < currentStep; i++) {
      accumulatedTime += demoSequence[i].duration;
    }

    const currentStepDuration = demoSequence[currentStep].duration;
    const timeInCurrentStep = elapsedTime - accumulatedTime;

    if (timeInCurrentStep >= currentStepDuration) {
      if (currentStep < demoSequence.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
          setIsTransitioning(false);
        }, 300);
      } else {
        setIsPlaying(false);
      }
    }
  }, [elapsedTime, currentStep, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 100);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const getStepProgress = (stepIndex: number) => {
    let stepStart = 0;
    for (let i = 0; i < stepIndex; i++) {
      stepStart += demoSequence[i].duration;
    }
    const stepEnd = stepStart + demoSequence[stepIndex].duration;

    if (elapsedTime >= stepEnd) return 100;
    if (elapsedTime <= stepStart) return 0;
    return ((elapsedTime - stepStart) / (stepEnd - stepStart)) * 100;
  };

  return (
    <section id="demo" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-lavender-light text-secondary-foreground font-medium text-sm mb-4">
            Interactive Demo
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            See it in action in <span className="text-lavender">30 seconds</span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch how MemoryAnchor provides context as different visitors enter the room.
          </p>
        </div>

        {/* Demo area */}
        <div className="max-w-4xl mx-auto">
          {/* Controls */}
          <div className="flex justify-center gap-4 mb-8">
            {!isPlaying && currentStep === 0 && elapsedTime === 0 ? (
              <Button variant="warm" size="lg" onClick={playDemo} className="group">
                <Play className="w-5 h-5" />
                Play Guided Demo
              </Button>
            ) : (
              <>
                {isPlaying ? (
                  <Button variant="outline" size="lg" onClick={pauseDemo}>
                    <Pause className="w-5 h-5" />
                    Pause
                  </Button>
                ) : (
                  <Button variant="hero" size="lg" onClick={() => setIsPlaying(true)}>
                    <Play className="w-5 h-5" />
                    Resume
                  </Button>
                )}
                <Button variant="outline" size="lg" onClick={resetDemo}>
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </Button>
              </>
            )}
          </div>

          {/* Timeline */}
          <div className="mb-12">
            <div className="flex items-center justify-between gap-2 mb-4">
              {demoSequence.map((step, index) => (
                <div key={step.label} className="flex-1 flex flex-col items-center">
                  <div
                    className={cn(
                      "w-full h-2 rounded-full bg-border overflow-hidden transition-all duration-300",
                      currentStep === index && "ring-2 ring-primary ring-offset-2"
                    )}
                  >
                    <div
                      className="h-full gradient-accent transition-all duration-100"
                      style={{ width: `${getStepProgress(index)}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-sm font-medium transition-colors",
                      currentStep === index ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{Math.floor(elapsedTime / 1000)}s</span>
              <span>{Math.floor(totalDuration / 1000)}s total</span>
            </div>
          </div>

          {/* Patient Screen */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Status indicator */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    isPlaying
                      ? "bg-primary text-primary-foreground animate-pulse-soft"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isPlaying ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                      Live Demo
                    </span>
                  ) : elapsedTime >= totalDuration ? (
                    "Demo Complete ✓"
                  ) : (
                    "Ready to play"
                  )}
                </div>
              </div>

              <PatientScreen
                person={currentPerson}
                isTransitioning={isTransitioning}
                className="mt-6"
              />
            </div>
          </div>

          {/* Demo explanation */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              <strong className="text-foreground">Current scene:</strong>{" "}
              {currentStep === 0
                ? "Patient is alone, screen shows calm default state"
                : `${demoSequence[currentStep].label} has entered — showing their profile and context`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
