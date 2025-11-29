import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import AddPersonDialog from "@/components/AddPersonDialog";

const People = () => {
  const { signOut } = useAuth();
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPeople = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('people')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPeople(data || []);
    } catch (error) {
      console.error('Error loading people:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeople();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

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
          <div className="flex items-center gap-2">
            <AddPersonDialog onPersonAdded={loadPeople} />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {people.map((person) => (
                <Card key={person.id} className="p-6 shadow-soft hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    {person.photo_url ? (
                      <img 
                        src={person.photo_url} 
                        alt={person.name}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-display font-bold text-foreground mb-1">
                        {person.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {person.relationship}
                      </p>
                      {person.face_embeddings && (
                        <p className="text-xs text-green-600 font-medium">
                          ✓ Face recognition enabled
                        </p>
                      )}
                    </div>
                  </div>
                  {person.notes && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                      {person.notes}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}

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
                Start building your directory by adding the people in your life with their photos
              </p>
              <AddPersonDialog onPersonAdded={loadPeople} />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default People;
