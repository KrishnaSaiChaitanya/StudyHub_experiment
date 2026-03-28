"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Video, Loader2, RefreshCw, Save, CheckCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SUBJECT_MAPPING, formatSubjectName } from "@/utils/subjects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function StudyRoomsAdmin() {
  const supabase = createClient();
  const { toast } = useToast();
  
  const [links, setLinks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('subject_meet_links').select('*');

    if (data) {
      const linksMap: Record<string, string> = {};
      data.forEach(item => {
        linksMap[item.subject_id] = item.meet_url;
      });
      setLinks(linksMap);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateLink = async (subjectId: string) => {
    setSavingId(subjectId);
    const meetUrl = links[subjectId] || "https://meet.google.com/new";

    const { error } = await supabase
      .from('subject_meet_links')
      .upsert({ 
        subject_id: subjectId, 
        meet_url: meetUrl,
        updated_at: new Date().toISOString()
      });

    if (error) {
      toast({ 
        title: "Error updating room link", 
        description: error.message, 
        variant: "destructive" 
      });
    } else {
      toast({ 
        title: "Link updated successfully!",
        description: `Updated link for ${formatSubjectName(subjectId as any)}`
      });
    }
    setSavingId(null);
  };

  const handleInputChange = (subjectId: string, value: string) => {
    setLinks(prev => ({
      ...prev,
      [subjectId]: value
    }));
  };

  const renderSubjectList = (level: 'foundation' | 'intermediate' | 'final') => (
    <div className="grid gap-4 md:grid-cols-2 mt-4">
      {SUBJECT_MAPPING[level].map((subjectId) => (
        <Card key={subjectId} className="overflow-hidden border-border bg-card/50">
          <CardHeader className="pb-3 border-b border-border/50 bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold truncate">
                {formatSubjectName(subjectId)}
              </CardTitle>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                {level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Globe className="h-3.3 w-3.3" />
                Meet Link
              </label>
              <div className="flex gap-2">
                <Input 
                  value={links[subjectId] || ""} 
                  onChange={(e) => handleInputChange(subjectId, e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="bg-background/50"
                />
                <Button 
                  size="icon" 
                  onClick={() => handleUpdateLink(subjectId)}
                  disabled={savingId === subjectId}
                  className="shrink-0"
                >
                  {savingId === subjectId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Video className="h-10 w-10 text-primary" />
            Study Rooms
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage subject-specific Google Meet links for student study groups.
          </p>
        </div>
        <Button variant="outline" size="lg" onClick={fetchData} className="gap-2 shadow-sm">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading room details...</p>
        </div>
      ) : (
        <Tabs defaultValue="foundation" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-14 p-1.5 bg-muted/40 backdrop-blur-sm border border-border rounded-xl">
            <TabsTrigger value="foundation" className="text-sm font-bold uppercase tracking-wide rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
              Foundation
            </TabsTrigger>
            <TabsTrigger value="intermediate" className="text-sm font-bold uppercase tracking-wide rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
              Intermediate
            </TabsTrigger>
            <TabsTrigger value="final" className="text-sm font-bold uppercase tracking-wide rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
              Final
            </TabsTrigger>
          </TabsList>

          <TabsContent value="foundation" className="animate-in fade-in-50 duration-500">
            {renderSubjectList('foundation')}
          </TabsContent>
          <TabsContent value="intermediate" className="animate-in fade-in-50 duration-500">
            {renderSubjectList('intermediate')}
          </TabsContent>
          <TabsContent value="final" className="animate-in fade-in-50 duration-500">
            {renderSubjectList('final')}
          </TabsContent>
        </Tabs>
      )}

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 mt-12 shadow-sm animate-in slide-in-from-bottom-4 duration-700">
        <div className="bg-primary/10 p-4 rounded-full">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Admin Best Practice</h3>
          <p className="text-muted-foreground max-w-2xl mt-1 text-base">
            These links are shared with all students at their respective levels. 
            Ensure links are set to "Public" or "Anyone with link" in Google Meet settings to avoid access issues.
          </p>
        </div>
      </div>
    </div>
  );
}
