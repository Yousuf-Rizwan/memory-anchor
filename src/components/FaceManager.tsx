import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Trash2, UserPlus, X, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PersonData } from '@/data/mockData';
import { useFaceRecognition, SavedFace } from '@/hooks/useFaceRecognition';
import { useToast } from '@/hooks/use-toast';

interface FaceManagerProps {
  className?: string;
}

const FaceManager = ({ className }: FaceManagerProps) => {
  const { savedFaces, addFace, removeFace, isModelsLoaded, isLoading } = useFaceRecognition();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddingFace, setIsAddingFace] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    age: '',
    lastVisit: '',
    conversationSummary: '',
    currentUpdate: '',
    avatar: '👤',
  });

  const avatarOptions = ['👤', '👩', '👨', '👵', '👴', '👩‍🦰', '👨‍🦱', '👩‍🦳', '👨‍⚕️', '👩‍⚕️', '🧑‍🏫', '👷'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file (JPG, PNG, etc.)',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: 'No image selected',
        description: 'Please upload a photo of the person.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter the person\'s name.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    const personData: PersonData = {
      id: `person_${Date.now()}`,
      name: formData.name.trim(),
      relation: formData.relation.trim() || 'Unknown relation',
      age: formData.age ? parseInt(formData.age) : undefined,
      lastVisit: formData.lastVisit.trim() || 'Not recorded',
      conversationSummary: formData.conversationSummary.trim() || 'No previous conversation recorded.',
      currentUpdate: formData.currentUpdate.trim() || 'No current updates.',
      avatar: formData.avatar,
    };

    const success = await addFace(selectedFile, personData);

    if (success) {
      toast({
        title: 'Face registered!',
        description: `${personData.name} has been added to the system.`,
      });
      resetForm();
    } else {
      toast({
        title: 'Face not detected',
        description: 'Could not detect a face in the image. Please try a clearer photo.',
        variant: 'destructive',
      });
    }

    setIsProcessing(false);
  };

  const resetForm = () => {
    setIsAddingFace(false);
    setPreviewUrl(null);
    setSelectedFile(null);
    setFormData({
      name: '',
      relation: '',
      age: '',
      lastVisit: '',
      conversationSummary: '',
      currentUpdate: '',
      avatar: '👤',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFace = (face: SavedFace) => {
    removeFace(face.id);
    toast({
      title: 'Face removed',
      description: `${face.personData.name} has been removed from the system.`,
    });
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Manage Faces</h3>
          <p className="text-sm text-muted-foreground">
            Upload photos and add information about people to recognize
          </p>
        </div>
        {!isAddingFace && (
          <Button onClick={() => setIsAddingFace(true)} disabled={!isModelsLoaded}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Person
          </Button>
        )}
      </div>

      {/* Add Face Form */}
      {isAddingFace && (
        <Card className="border-primary/20 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Add New Person</CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image upload */}
                <div className="space-y-2">
                  <Label>Photo *</Label>
                  <div
                    className={cn(
                      "relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors hover:border-primary/50",
                      previewUrl ? "border-primary bg-primary/5" : "border-border"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewUrl ? (
                      <div className="relative aspect-square max-w-[200px] mx-auto">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <p className="text-white text-sm">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload a clear face photo
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Sarah Johnson"
                    />
                  </div>
                  <div>
                    <Label htmlFor="relation">Relation</Label>
                    <Input
                      id="relation"
                      value={formData.relation}
                      onChange={(e) => setFormData(prev => ({ ...prev, relation: e.target.value }))}
                      placeholder="e.g., Daughter, Nurse, Friend"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                        placeholder="e.g., 32"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastVisit">Last Visit</Label>
                      <Input
                        id="lastVisit"
                        value={formData.lastVisit}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastVisit: e.target.value }))}
                        placeholder="e.g., 3 days ago"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Avatar selection */}
              <div>
                <Label>Avatar Icon</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {avatarOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar: emoji }))}
                      className={cn(
                        "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                        formData.avatar === emoji
                          ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversation details */}
              <div>
                <Label htmlFor="conversationSummary">Last Conversation Summary</Label>
                <Textarea
                  id="conversationSummary"
                  value={formData.conversationSummary}
                  onChange={(e) => setFormData(prev => ({ ...prev, conversationSummary: e.target.value }))}
                  placeholder="What did they talk about during their last visit?"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="currentUpdate">Current Update</Label>
                <Textarea
                  id="currentUpdate"
                  value={formData.currentUpdate}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentUpdate: e.target.value }))}
                  placeholder="Any recent news or updates about this person?"
                  rows={2}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Save Person
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Saved Faces Grid */}
      {savedFaces.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedFaces.map((face) => (
            <Card key={face.id} className="overflow-hidden">
              <div className="aspect-[4/3] relative bg-muted">
                <img
                  src={face.imageUrl}
                  alt={face.personData.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => handleRemoveFace(face)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{face.personData.avatar}</span>
                  <h4 className="font-semibold text-foreground">{face.personData.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{face.personData.relation}</p>
                {face.personData.age && (
                  <p className="text-xs text-muted-foreground">Age: {face.personData.age}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {savedFaces.length === 0 && !isAddingFace && (
        <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-2xl">
          <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="font-medium text-foreground mb-2">No faces registered</h4>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
            Add photos and information about people the patient knows to enable face recognition.
          </p>
          <Button onClick={() => setIsAddingFace(true)} disabled={!isModelsLoaded}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Your First Person
          </Button>
        </div>
      )}
    </div>
  );
};

export default FaceManager;
