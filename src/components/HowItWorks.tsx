import { howItWorksSteps } from "@/data/mockData";
import { ArrowRight } from "lucide-react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-light text-primary font-medium text-sm mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Simple, <span className="text-primary">gentle</span>, effective
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            MemoryAnchor works quietly in the background, providing context exactly when it's needed.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-4 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-24 left-[calc(33.33%-1rem)] right-[calc(33.33%-1rem)] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

          {howItWorksSteps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number */}
              <div className="w-12 h-12 rounded-full gradient-accent text-primary-foreground font-bold text-lg flex items-center justify-center mb-6 shadow-glow relative z-10">
                {step.step}
              </div>

              {/* Card */}
              <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 w-full">
                <div className="w-16 h-16 rounded-2xl bg-teal-light flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow for mobile */}
              {index < howItWorksSteps.length - 1 && (
                <div className="md:hidden my-4 text-primary/40">
                  <ArrowRight className="w-6 h-6 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Prototype note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-lavender-light border border-lavender/20">
            <span className="text-2xl">🔬</span>
            <p className="text-muted-foreground text-sm lg:text-base">
              <strong className="text-foreground">Prototype note:</strong> This demo uses simulated data to demonstrate the concept. 
              In a real implementation, this would connect to secure caregiver-managed profiles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
