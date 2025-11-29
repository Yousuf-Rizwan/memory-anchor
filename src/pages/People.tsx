import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, User } from "lucide-react";
import { Link } from "react-router-dom";

const People = () => {
  // Mock data - will be replaced with database later
  const people = [
    {
      id: "1",
      name: "Helen Johnson",
      relationship: "Sister",
      lastSeen: "5 days ago",
    },
    {
      id: "2",
      name: "Michael Chen",
      relationship: "Son",
      lastSeen: "2 days ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-display font-bold text-foreground">Manage People</h1>
          <Button size="sm" className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Add Person
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Info Banner */}
          <Card className="p-6 mb-8 bg-accent/10 border-accent/20">
            <h2 className="font-display font-bold text-lg mb-2 text-foreground">
              Your People Directory
            </h2>
            <p className="text-muted-foreground">
              Add photos and information about the people in your life. This helps Memory Anchor recognize them and show you helpful reminders.
            </p>
          </Card>

          {/* People Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {people.map((person) => (
              <Card key={person.id} className="p-6 shadow-soft hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold text-foreground mb-1">
                      {person.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {person.relationship}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last seen: {person.lastSeen}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State (shown when no people) */}
          {people.length === 0 && (
            <Card className="p-12 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2 text-foreground">
                No people added yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start building your directory by adding the people in your life
              </p>
              <Button size="lg" className="rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Person
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default People;
