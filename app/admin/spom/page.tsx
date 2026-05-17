"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function SpomAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contentId, setContentId] = useState<string | null>(null);
  
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase.from("spom_content").select("*").limit(1).single();
      if (data) {
        setContentId(data.id);
        setRoadmap(data.roadmap || []);
        setPapers(data.papers || []);
        setMaterials(data.materials || []);
        setFaqs(data.faqs || []);
      } else if (error && error.code !== "PGRST116") {
        toast({ title: "Error fetching SPOM content", description: error.message, variant: "destructive" });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (contentId) {
        const { error } = await supabase
          .from("spom_content")
          .update({ roadmap, papers, materials, faqs, updated_at: new Date().toISOString() })
          .eq("id", contentId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("spom_content")
          .insert([{ roadmap, papers, materials, faqs }])
          .select()
          .single();
        if (error) throw error;
        setContentId(data.id);
      }
      toast({ title: "SPOM content updated successfully!" });
    } catch (e: any) {
      toast({ title: "Error saving SPOM content", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const updateItem = (setter: any, index: number, field: string, value: string | number) => {
    setter((prev: any[]) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeItem = (setter: any, index: number) => {
    setter((prev: any[]) => prev.filter((_, i) => i !== index));
  };

  const addItem = (setter: any, defaultItem: any) => {
    setter((prev: any[]) => [...prev, defaultItem]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">SPOM Content Management</h1>
            <p className="text-sm text-muted-foreground">Manage the content for the Self-Paced Online Modules page.</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Content
        </Button>
      </div>

      <Tabs defaultValue="roadmap" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-muted/50 p-1">
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="papers">Papers</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roadmap" className="space-y-4 mt-4">
          {roadmap.map((item, i) => (
            <Card key={i} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5 grid gap-5 relative bg-card">
                <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-destructive hover:bg-destructive/10" onClick={() => removeItem(setRoadmap, i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-2 gap-4 mr-10">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Step</Label>
                    <Input value={item.step} onChange={(e) => updateItem(setRoadmap, i, 'step', e.target.value)} placeholder="e.g. 01" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</Label>
                    <Input value={item.title} onChange={(e) => updateItem(setRoadmap, i, 'title', e.target.value)} placeholder="e.g. Eligibility Check" className="bg-background" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Body</Label>
                  <Textarea value={item.body} onChange={(e) => updateItem(setRoadmap, i, 'body', e.target.value)} className="min-h-[80px] bg-background resize-y" placeholder="Step description..." />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="w-full gap-2 border-dashed border-2 py-6 text-muted-foreground hover:text-foreground" onClick={() => addItem(setRoadmap, { step: '', title: '', body: '' })}>
            <Plus className="h-4 w-4" /> Add Roadmap Item
          </Button>
        </TabsContent>

        <TabsContent value="papers" className="space-y-4 mt-4">
          {papers.map((item, i) => (
            <Card key={i} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5 grid gap-5 relative bg-card">
                <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-destructive hover:bg-destructive/10" onClick={() => removeItem(setPapers, i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mr-10">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code</Label>
                    <Input value={item.code} onChange={(e) => updateItem(setPapers, i, 'code', e.target.value)} placeholder="e.g. Set A" className="bg-background" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</Label>
                    <Input value={item.title} onChange={(e) => updateItem(setPapers, i, 'title', e.target.value)} placeholder="e.g. Set A — Integrated..." className="bg-background" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Summary</Label>
                  <Textarea value={item.summary} onChange={(e) => updateItem(setPapers, i, 'summary', e.target.value)} className="min-h-[80px] bg-background resize-y" placeholder="Summary..." />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Color Class (Tailwind)</Label>
                  <Input value={item.color} onChange={(e) => updateItem(setPapers, i, 'color', e.target.value)} placeholder="e.g. from-accent/20 to-accent/5" className="bg-background font-mono text-sm" />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="w-full gap-2 border-dashed border-2 py-6 text-muted-foreground hover:text-foreground" onClick={() => addItem(setPapers, { code: '', title: '', summary: '', color: 'from-accent/20 to-accent/5' })}>
            <Plus className="h-4 w-4" /> Add Paper
          </Button>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4 mt-4">
          {materials.map((item, i) => (
            <Card key={item.id || i} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5 grid gap-5 relative bg-card">
                <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-destructive hover:bg-destructive/10" onClick={() => removeItem(setMaterials, i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mr-10">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</Label>
                    <Input value={item.id} onChange={(e) => updateItem(setMaterials, i, 'id', e.target.value)} placeholder="e.g. spom-a-1" className="bg-background font-mono text-sm" />
                  </div>
                  <div className="space-y-2 lg:col-span-3">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</Label>
                    <Input value={item.title} onChange={(e) => updateItem(setMaterials, i, 'title', e.target.value)} className="bg-background" placeholder="Material title" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Paper</Label>
                    <Input value={item.paper} onChange={(e) => updateItem(setMaterials, i, 'paper', e.target.value)} placeholder="e.g. Set A" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</Label>
                    <Input value={item.type} onChange={(e) => updateItem(setMaterials, i, 'type', e.target.value)} placeholder="e.g. Module" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pages</Label>
                    <Input type="number" value={item.pages} onChange={(e) => updateItem(setMaterials, i, 'pages', parseInt(e.target.value) || 0)} className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">URL</Label>
                    <Input value={item.url} onChange={(e) => updateItem(setMaterials, i, 'url', e.target.value)} className="bg-background" placeholder="https://" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="w-full gap-2 border-dashed border-2 py-6 text-muted-foreground hover:text-foreground" onClick={() => addItem(setMaterials, { id: `spom-new-${Date.now()}`, title: '', paper: '', type: 'Module', pages: 0, url: '' })}>
            <Plus className="h-4 w-4" /> Add Material
          </Button>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4 mt-4">
          {faqs.map((item, i) => (
            <Card key={i} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5 grid gap-5 relative bg-card">
                <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-destructive hover:bg-destructive/10" onClick={() => removeItem(setFaqs, i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="space-y-2 mr-10">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Question</Label>
                  <Input value={item.q} onChange={(e) => updateItem(setFaqs, i, 'q', e.target.value)} className="bg-background font-medium" placeholder="FAQ Question" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Answer</Label>
                  <Textarea value={item.a} onChange={(e) => updateItem(setFaqs, i, 'a', e.target.value)} className="min-h-[80px] bg-background resize-y" placeholder="FAQ Answer" />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="w-full gap-2 border-dashed border-2 py-6 text-muted-foreground hover:text-foreground" onClick={() => addItem(setFaqs, { q: '', a: '' })}>
            <Plus className="h-4 w-4" /> Add FAQ
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
