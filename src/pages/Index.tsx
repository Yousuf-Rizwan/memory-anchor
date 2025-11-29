import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Eye, Clock, Brain } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            <span>Supporting Memory, Strengthening Connections</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-display font-bold text-foreground leading-tight">
            Memory
            <span className="text-primary"> Anchor</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A compassionate companion for Alzheimer's patients, helping them recognize and remember the people they love through intelligent facial and voice recognition.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button 
              asChild 
              size="lg" 
              className="text-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/recognition">Start Recognition</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 rounded-2xl border-2"
            >
              <Link to="/people">Manage People</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Eye className="w-8 h-8" />}
            title="Facial Recognition"
            description="Instantly identify loved ones through advanced face tracking technology"
            delay="0"
          />
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="Voice Patterns"
            description="Recognize familiar voices and speech patterns for deeper connection"
            delay="200"
          />
          <FeatureCard
            icon={<Clock className="w-8 h-8" />}
            title="Interaction History"
            description="Track recent meetings, birthdays, and special moments shared together"
            delay="400"
          />
        </div>

        {/* How It Works */}
        <div className="mt-32 max-w-4xl mx-auto">
          <h2 className="text-4xl font-display font-bold text-center mb-16 text-foreground">
            How It Works
          </h2>
          
          <div className="space-y-12">
            <Step
              number="1"
              title="Add Your Loved Ones"
              description="Create profiles with photos, names, relationships, and special memories"
            />
            <Step
              number="2"
              title="Start Video Recognition"
              description="The app uses your camera to identify people in real-time"
            />
            <Step
              number="3"
              title="See Helpful Information"
              description="Name, relationship, recent interactions, and important notes appear instantly"
            />
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 py-20 mt-32">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-foreground">
            Ready to stay connected?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Memory Anchor helps you remember what matters most: the people you love.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="text-lg px-8 py-6 rounded-2xl shadow-lg"
          >
            <Link to="/recognition">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: string;
}) => (
  <div 
    className="bg-card rounded-3xl p-8 shadow-soft hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-display font-bold mb-3 text-foreground">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const Step = ({ 
  number, 
  title, 
  description 
}: { 
  number: string; 
  title: string; 
  description: string; 
}) => (
  <div className="flex gap-6 items-start">
    <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-xl font-bold">
      {number}
    </div>
    <div className="flex-1">
      <h3 className="text-2xl font-display font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-lg text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default Index;
