import { problemCards } from "@/data/mockData";

const ProblemSection = () => {
  return (
    <section id="problem" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-coral-light text-coral font-medium text-sm mb-4">
            The Challenge
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Understanding the <span className="text-coral">struggle</span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Alzheimer's affects more than memory — it impacts the ability to connect 
            with loved ones during everyday moments.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {problemCards.map((card, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl bg-card border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-coral-light flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">{card.icon}</span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3">
                {card.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Empathy note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-muted/50 border border-border/50">
            <span className="text-2xl">💙</span>
            <p className="text-muted-foreground">
              <strong className="text-foreground">1 in 9 people</strong> over 65 are affected by Alzheimer's disease
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
