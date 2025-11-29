import { Button } from "@/components/ui/button";
import PatientScreen from "./PatientScreen";
import { mockPeople } from "@/data/mockData";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen pt-24 lg:pt-32 pb-16 lg:pb-24 gradient-hero overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-lavender/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-coral/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-light border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Hackathon Prototype · AI-Assisted Memory Support
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6">
              We can't cure Alzheimer's —{" "}
              <span className="bg-gradient-to-r from-primary via-teal to-lavender bg-clip-text text-transparent">
                but we can bring clarity
              </span>{" "}
              back to everyday conversations.
            </h1>

            {/* Description */}
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              MemoryAnchor provides live conversational context to Alzheimer's patients, 
              showing who they're speaking to, their relationship, last visit, and a 
              gentle reminder of their previous interaction.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="warm"
                size="lg"
                onClick={() => scrollToSection("#demo")}
                className="group"
              >
                Run 30-Second Demo
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection("#how-it-works")}
              >
                Learn How It Works
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>Privacy-first design</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lavender" />
                <span>Caregiver controlled</span>
              </div>
            </div>
          </div>

          {/* Right Content - Patient Screen Preview */}
          <div 
            className="flex justify-center lg:justify-end animate-fade-in-up" 
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative">
              {/* Floating decorations */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-coral/20 rounded-2xl rotate-12 animate-float" />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-lavender/30 rounded-full animate-float" style={{ animationDelay: "1s" }} />
              <div className="absolute top-1/2 -left-10 w-8 h-8 bg-primary/20 rounded-lg rotate-45 animate-float" style={{ animationDelay: "0.5s" }} />
              
              <PatientScreen 
                person={mockPeople.daughter} 
                className="shadow-glow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-pulse-soft">
        <span className="text-sm">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
          <div className="w-1.5 h-3 rounded-full bg-muted-foreground/50 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
