import { PersonData } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface PatientScreenProps {
  person: PersonData;
  isTransitioning?: boolean;
  className?: string;
}

const PatientScreen = ({ person, isTransitioning = false, className }: PatientScreenProps) => {
  const isAlone = !person.name;

  return (
    <div
      className={cn(
        "relative w-full max-w-sm mx-auto bg-card rounded-3xl border-4 border-border/50 overflow-hidden transition-all duration-500",
        isTransitioning && "scale-95 opacity-80",
        className
      )}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Screen bezel effect */}
      <div className="absolute inset-0 rounded-3xl border border-border/20 pointer-events-none" />
      
      {/* Screen content */}
      <div className={cn(
        "p-6 lg:p-8 min-h-[400px] lg:min-h-[480px] flex flex-col transition-all duration-500",
        isAlone ? "bg-gradient-to-br from-teal-light via-background to-lavender-light" : "bg-card"
      )}>
        {isAlone ? (
          /* Alone/Default State */
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-muted flex items-center justify-center mb-6 animate-pulse-soft">
              <span className="text-4xl lg:text-5xl">🏠</span>
            </div>
            <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-2">
              All is calm
            </h3>
            <p className="text-muted-foreground text-base lg:text-lg">
              Waiting for a visitor...
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
              <span>System ready</span>
            </div>
          </div>
        ) : (
          /* Active Person State */
          <div className="flex-1 flex flex-col animate-fade-in">
            {/* Header with avatar and name */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-teal-light to-lavender-light flex items-center justify-center flex-shrink-0">
                <span className="text-3xl lg:text-4xl">{person.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl lg:text-2xl font-bold text-foreground whitespace-normal break-words leading-tight">
                  {person.name}
                </h3>
                <p className="text-primary font-medium text-base lg:text-lg whitespace-normal break-words">
                  {person.relation} {person.age && `· Age ${person.age}`}
                </p>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span>Last visit:</span>
                  <span className="font-medium text-foreground">{person.lastVisit}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/50 mb-5" />

            {/* Last conversation */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💬</span>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Last Conversation
                </h4>
              </div>
              <p className="text-foreground text-base lg:text-lg leading-relaxed">
                {person.conversationSummary}
              </p>
            </div>

            {/* Current update */}
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">✨</span>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Current Update
                </h4>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-light to-lavender-light border border-primary/10">
                <p className="text-foreground text-base lg:text-lg leading-relaxed font-medium">
                  {person.currentUpdate}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar (like a device) */}
      <div className="h-2 bg-border/30" />
    </div>
  );
};

export default PatientScreen;
