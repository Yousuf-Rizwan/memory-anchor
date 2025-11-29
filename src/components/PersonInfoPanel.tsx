import { Card } from "@/components/ui/card";
import { User, Calendar, MessageSquare, Heart } from "lucide-react";

interface PersonInfo {
  name: string;
  relationship: string;
  lastSeen: string;
  notes: string;
  photoUrl: string | null;
}

interface PersonInfoPanelProps {
  person: PersonInfo | null;
}

const PersonInfoPanel = ({ person }: PersonInfoPanelProps) => {
  if (!person) {
    return (
      <Card className="p-8 shadow-soft h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground mb-2">
              No person detected
            </p>
            <p className="text-sm text-muted-foreground">
              Start the camera to begin recognition
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-soft space-y-6 animate-in fade-in slide-in-from-right duration-500">
      {/* Photo */}
      <div className="flex justify-center">
        <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
          {person.photoUrl ? (
            <img 
              src={person.photoUrl} 
              alt={person.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-16 h-16 text-white" />
          )}
        </div>
      </div>

      {/* Name */}
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold text-foreground mb-2">
          {person.name}
        </h2>
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <Heart className="w-4 h-4" />
          <span>{person.relationship}</span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 pt-4">
        <InfoRow 
          icon={<Calendar className="w-5 h-5" />}
          label="Last Seen"
          value={person.lastSeen}
        />
        
        <div className="pt-4 border-t border-border">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold text-foreground mb-1">
                Notes & Memories
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                {person.notes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="mt-6 p-4 bg-secondary/50 rounded-2xl">
        <p className="text-sm text-muted-foreground text-center">
          <span className="font-semibold text-foreground">Tip:</span> Take your time to read through the information at your own pace
        </p>
      </div>
    </Card>
  );
};

const InfoRow = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
}) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-display font-semibold text-foreground text-lg">{value}</p>
    </div>
  </div>
);

export default PersonInfoPanel;
