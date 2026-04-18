"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Loader2, RefreshCw, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SUBJECT_MAPPING, formatSubjectName } from "@/utils/subjects";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TableFilters } from "@/components/admin/TableFilters";

export default function PracticePapersDashboard() {
  const supabase = createClient();
  const { toast } = useToast();
  
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({ column: "title", value: "" });

  // Form State
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [examYear, setExamYear] = useState("");
  const [level, setLevel] = useState("");
  const [pages, setPages] = useState("");
  const [type, setType] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isSolution, setIsSolution] = useState(false);
  const [testNo, setTestNo] = useState("");

  const allSubjects = [
    ...SUBJECT_MAPPING.foundation,
    ...SUBJECT_MAPPING.intermediate,
    ...SUBJECT_MAPPING.final
  ];

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('practice_papers').select('*').order('created_at', { ascending: false });

    if (data) setPapers(data);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (paper: any) => {
    setTitle(paper.title);
    setSubject(paper.subject);
    setExamYear(paper.exam_year);
    setLevel(paper.level);
    setPages(paper.pages.toString());
    setType(paper.type);
    setPdfUrl(paper.pdf_url || "");
    setIsSolution(paper.is_solution || false);
    setTestNo(paper.test_no || "");
    setEditingId(paper.id);
    setShowAdd(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      subject,
      exam_year: examYear,
      level,
      pages: parseInt(pages) || 0,
      type,
      pdf_url: pdfUrl,
      is_solution: isSolution,
      test_no: testNo || null
    };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from('practice_papers').update(payload).eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('practice_papers').insert(payload);
      error = insertError;
    }

    if (error) {
      toast({ title: `Error ${editingId ? 'updating' : 'adding'} practice paper`, description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Practice paper ${editingId ? 'updated' : 'added'}!` });
      setTitle(""); setSubject(""); setExamYear(""); setLevel(""); setPages(""); setType(""); setPdfUrl(""); setIsSolution(false); setTestNo("");
      setEditingId(null);
      setShowAdd(false);
      fetchData();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const { error } = await supabase.from('practice_papers').delete().eq('id', id);
    if (!error) fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Practice Papers</h1>
          <p className="text-muted-foreground mt-1">Manage RTPs, PYQs, and MTPs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData}><RefreshCw className="h-4 w-4" /></Button>
          <Button onClick={() => { setEditingId(null); setTitle(""); setSubject(""); setExamYear(""); setLevel(""); setPages(""); setType(""); setPdfUrl(""); setIsSolution(false); setTestNo(""); setShowAdd(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Add Paper
          </Button>
        </div>
      </div>

      <TableFilters 
        columns={[
          { key: "title", label: "Title" },
          { key: "subject", label: "Subject" },
          { key: "exam_year", label: "Year" },
          { key: "level", label: "Level" },
          { key: "type", label: "Type" },
          { key: "test_no", label: "Test No" },
          { key: "is_solution", label: "Is Solution" }
        ]} 
        onFilterChange={setFilters}
        placeholder="Filter papers..."
      />

      <Dialog open={showAdd} onOpenChange={(open) => {
        setShowAdd(open);
        if (!open) {
          setEditingId(null);
          setTitle(""); setSubject(""); setExamYear(""); setLevel(""); setPages(""); setType(""); setPdfUrl("");
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Practice Paper" : "Add New Practice Paper"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Paper Title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select required value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                <SelectContent>
                  {allSubjects.map(sub => (
                    <SelectItem key={sub} value={sub}>{formatSubjectName(sub as any)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Exam Year</label>
              <Input required value={examYear} onChange={e => setExamYear(e.target.value)} placeholder="e.g., May 2025" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Select required value={level} onValueChange={setLevel}>
                <SelectTrigger><SelectValue placeholder="Select Level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="foundation">Foundation</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pages</label>
              <Input type="number" required min="0" value={pages} onChange={e => setPages(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select required value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rtp">RTP</SelectItem>
                  <SelectItem value="pyq">PYQ</SelectItem>
                  <SelectItem value="mtp">MTP</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Test No (Optional)</label>
              <Input value={testNo} onChange={e => setTestNo(e.target.value)} placeholder="e.g., 1" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Is Solution?</label>
              <Select 
                required 
                value={type === "rtp" ? "false" : (isSolution ? "true" : "false")} 
                onValueChange={(v) => setIsSolution(v === "true")}
                disabled={type === "rtp"}
              >
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Question</SelectItem>
                  <SelectItem value="true">Solution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-full">
              <label className="text-sm font-medium">PDF URL</label>
              <Input required type="url" value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} placeholder="https://..." />
            </div>

            <div className="col-span-full pt-4">
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingId ? "Update Practice Paper" : "Save Practice Paper")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Exam Year</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Test No</TableHead>
                <TableHead>Paper Category</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {papers.filter(p => {
                if (!filters.value) return true;
                const field = p[filters.column];
                if (filters.column === "subject") {
                   const subjectName = formatSubjectName(p.subject as any);
                   return subjectName.toLowerCase().includes(filters.value.toLowerCase());
                }
                return field?.toString().toLowerCase().includes(filters.value.toLowerCase());
              }).length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">No practice papers found matching your filter.</TableCell>
                </TableRow>
              )}
              {papers.filter(p => {
                if (!filters.value) return true;
                const field = p[filters.column];
                if (filters.column === "subject") {
                   const subjectName = formatSubjectName(p.subject as any);
                   return subjectName.toLowerCase().includes(filters.value.toLowerCase());
                }
                return field?.toString().toLowerCase().includes(filters.value.toLowerCase());
              }).map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell>{formatSubjectName(p.subject as any)}</TableCell>
                  <TableCell>{p.exam_year}</TableCell>
                  <TableCell className="capitalize">{p.level}</TableCell>
                  <TableCell className="uppercase">{p.type}</TableCell>
                  <TableCell>{p.test_no || "-"}</TableCell>
                  <TableCell>
                    {p.type !== 'rtp' ? (
                      <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${p.is_solution ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                        {p.is_solution ? "Solution" : "Question"}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(p)} className="text-muted-foreground hover:text-primary">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
