"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SUBJECT_MAPPING, formatSubjectName } from "@/utils/subjects";

export default function PlannersDashboard() {
  const supabase = createClient();
  const { toast } = useToast();
  
  const [planners, setPlanners] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [plannerDate, setPlannerDate] = useState("");
  const [pages, setPages] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const allSubjects = [
    ...SUBJECT_MAPPING.foundation,
    ...SUBJECT_MAPPING.intermediate,
    ...SUBJECT_MAPPING.final
  ];

  const fetchData = async () => {
    setLoading(true);
    const [pRes, fRes] = await Promise.all([
      supabase.from('study_planners').select('*, faculty:faculty_id(name)').order('created_at', { ascending: false }),
      supabase.from('faculty').select('id, name')
    ]);

    if (pRes.data) setPlanners(pRes.data);
    if (fRes.data) setFaculty(fRes.data);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from('study_planners').insert({
      title,
      category: categoryId,
      faculty_id: facultyId || null,
      planner_date: plannerDate,
      pages: parseInt(pages) || 0,
      pdf_url: pdfUrl
    });

    if (error) {
      toast({ title: "Error adding planner", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Planner added!" });
      setTitle(""); setCategoryId(""); setFacultyId(""); setPlannerDate(""); setPages(""); setPdfUrl("");
      setShowAdd(false);
      fetchData();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const { error } = await supabase.from('study_planners').delete().eq('id', id);
    if (!error) fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Study Planners</h1>
          <p className="text-muted-foreground mt-1">Manage PDF planners and study materials</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData}><RefreshCw className="h-4 w-4" /></Button>
          <Button onClick={() => setShowAdd(!showAdd)} className="gap-2">
            <Plus className="h-4 w-4" /> {showAdd ? "Cancel" : "Add Planner"}
          </Button>
        </div>
      </div>

      {showAdd && (
        <Card className="border-border">
          <CardHeader><CardTitle>Add New Planner</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Planner Title" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category / Subject</label>
                <Select required value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    {allSubjects.map(sub => (
                      <SelectItem key={sub} value={sub}>{formatSubjectName(sub as any)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Faculty (Optional)</label>
                <Select value={facultyId} onValueChange={setFacultyId}>
                  <SelectTrigger><SelectValue placeholder="Select Faculty" /></SelectTrigger>
                  <SelectContent>
                    {faculty.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Planner Date</label>
                <Input required type="date" value={plannerDate} onChange={e => setPlannerDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pages</label>
                <Input type="number" required min="1" value={pages} onChange={e => setPages(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">PDF URL</label>
                <Input required type="url" value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} placeholder="https://..." />
              </div>

              <div className="col-span-full pt-2">
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Planner"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">No planners found.</TableCell>
                </TableRow>
              )}
              {planners.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell>{formatSubjectName(p.category as any)}</TableCell>
                  <TableCell>{p.faculty?.name || '-'}</TableCell>
                  <TableCell>{new Date(p.planner_date).toLocaleDateString()}</TableCell>
                  <TableCell>{p.pages}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
