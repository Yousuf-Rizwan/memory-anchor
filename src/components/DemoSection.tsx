import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientScreen from "./PatientScreen";
import FaceScanner from "./FaceScanner";
import FaceManager from "./FaceManager";
import { mockPeople, PersonData } from "@/data/mockData";
import { ScanFace, Settings, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const DemoSection = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<PersonData>(mockPeople.alone);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("demo");

  const handlePersonDetected = useCallback((person: PersonData | null) => {
    if (!person) {
      setCurrentPerson(mockPeople.alone);
      return;
    }
    
    if (person.id !== currentPerson.id) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPerson(person);
        setIsTransitioning(false);
      }, 300);
    }
  }, [currentPerson.id]);

  const handleStartDemo = () => {
    setActiveTab("demo");
    setIsScanning(true);
  };

  return (
    <section id="demo" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-lavender-light text-secondary-foreground font-medium text-sm mb-4">
            Live Face Recognition Demo
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            See it in action with <span className="text-lavender">real-time scanning</span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Use your camera to test face recognition. Add people in the "Manage Faces" tab, then scan to see them recognized.
          </p>
        </div>

        {/* Tabs for Demo and Face Management */}
        <div className="max-w-5xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="demo" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Live Demo
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Manage Faces
              </TabsTrigger>
            </TabsList>

            <TabsContent value="demo" className="space-y-8">
              {/* Quick start button if not scanning */}
              {!isScanning && (
                <div className="text-center mb-8">
                  <Button 
                    variant="warm" 
                    size="lg" 
                    onClick={handleStartDemo}
                    className="group"
                  >
                    <ScanFace className="w-5 h-5 mr-2" />
                    Run 30-Second Demo
                  </Button>
                </div>
              )}

              {/* Main demo area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Face Scanner */}
                <div className="order-2 lg:order-1">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-primary" />
                    Camera Feed
                  </h3>
                  <FaceScanner
                    onPersonDetected={handlePersonDetected}
                    isScanning={isScanning}
                    onScanningChange={setIsScanning}
                  />
                </div>

                {/* Patient Screen */}
                <div className="order-1 lg:order-2">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <ScanFace className="w-5 h-5 text-primary" />
                    Patient Display
                  </h3>
                  <div className="relative">
                    {/* Status indicator */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                      <div
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                          isScanning
                            ? "bg-primary text-primary-foreground animate-pulse-soft"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isScanning ? (
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                            Scanning Live
                          </span>
                        ) : (
                          "Ready to scan"
                        )}
                      </div>
                    </div>

                    <PatientScreen
                      person={currentPerson}
                      isTransitioning={isTransitioning}
                      className="mt-8"
                    />
                  </div>
                </div>
              </div>

              {/* Demo explanation */}
              <div className="mt-8 text-center p-6 bg-card rounded-2xl border border-border">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">How it works:</strong>{" "}
                  {currentPerson.id === "alone"
                    ? "No face detected — showing calm default state"
                    : currentPerson.id === "unknown"
                    ? "Face detected but not recognized — consider adding this person"
                    : `${currentPerson.name} recognized! Showing their profile and context.`}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="manage">
              <FaceManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
