import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 lg:py-16 bg-muted/50 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground mb-6">
            <span className="text-3xl">🧠</span>
            <span className="bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">
              MemoryAnchor
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Built as a hackathon prototype exploring how AI can support Alzheimer's 
            patients with dignity and clarity during everyday conversations.
          </p>

          {/* Divider */}
          <div className="h-px bg-border/50 max-w-xs mx-auto mb-8" />

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-coral fill-coral" /> for those who need it most
            </span>
            <span className="hidden sm:block">·</span>
            <span>© {new Date().getFullYear()} MemoryAnchor Prototype</span>
          </div>

          {/* Accessibility note */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-light text-sm text-primary">
            <span>♿</span>
            <span>Designed with accessibility in mind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
