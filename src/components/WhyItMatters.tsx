import { whatWeProvide, whatWeDont } from "@/data/mockData";
import { Check, X } from "lucide-react";

const WhyItMatters = () => {
  return (
    <section id="why-it-matters" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-light text-primary font-medium text-sm mb-4">
            Responsible Design
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Why it <span className="text-primary">matters</span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            We believe technology should support human connection, not replace it. 
            Here's our commitment to responsible design.
          </p>
        </div>

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {/* What we provide */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-teal-light to-background border border-primary/10 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center">
                <Check className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">What we provide</h3>
            </div>
            <ul className="space-y-4">
              {whatWeProvide.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What we don't do */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-coral-light to-background border border-coral/10 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-coral/20 flex items-center justify-center">
                <X className="w-6 h-6 text-coral" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">What we don't do</h3>
            </div>
            <ul className="space-y-4">
              {whatWeDont.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-coral/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-coral" />
                  </div>
                  <span className="text-foreground text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Closing statement */}
        <div className="mt-16 text-center">
          <div className="inline-block p-8 rounded-3xl bg-muted/50 border border-border/50 max-w-2xl">
            <span className="text-4xl mb-4 block">🤝</span>
            <p className="text-lg text-foreground leading-relaxed">
              MemoryAnchor is designed to{" "}
              <strong className="text-primary">support dignified conversations</strong> — 
              helping patients feel confident and connected, while giving families and 
              caregivers peace of mind.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyItMatters;
