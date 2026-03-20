"use client"
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Bookmark, BookmarkCheck, Download, Eye, Filter, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export interface Paper {
  id: string;
  title: string;
  subject: string;
  year: string;
  level: string;
  pages: number;
}

interface PaperBrowserProps {
  title: string;
  subtitle: string;
  papers: Paper[];
  accentLabel?: string;
}

const PaperBrowser = ({ title, subtitle, papers, accentLabel }: PaperBrowserProps) => {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const subjects = useMemo(() => [...new Set(papers.map((p) => p.subject))], [papers]);
  const levels = useMemo(() => [...new Set(papers.map((p) => p.level))], [papers]);

  const filtered = useMemo(() => {
    return papers.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.subject.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = subjectFilter === "all" || p.subject === subjectFilter;
      const matchesLevel = levelFilter === "all" || p.level === levelFilter;
      return matchesSearch && matchesSubject && matchesLevel;
    });
  }, [papers, search, subjectFilter, levelFilter]);

  const toggleBookmark = (id: string, paperTitle: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast({ title: "Bookmark removed", description: paperTitle });
      } else {
        next.add(id);
        toast({ title: "Bookmarked!", description: paperTitle });
      }
      return next;
    });
  };

  return (
    <div className="container py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {accentLabel && (
            <Badge className="bg-accent/15 text-accent border-accent/30 text-xs">{accentLabel}</Badge>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search papers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {levels.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Results count */}
      <p className="mb-4 text-xs text-muted-foreground">{filtered.length} paper{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Paper list */}
      <ScrollArea className="h-[calc(100vh-380px)] min-h-[300px]">
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <FileText className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm">No papers match your search.</p>
            </div>
          )}
          {filtered.map((paper, i) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-card-foreground truncate">{paper.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">{paper.subject}</Badge>
                  <Badge variant="outline" className="text-[10px]">{paper.level}</Badge>
                  <span className="text-[10px] text-muted-foreground">{paper.year} • {paper.pages} pages</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleBookmark(paper.id, paper.title)}
                  title={bookmarked.has(paper.id) ? "Remove bookmark" : "Bookmark"}
                >
                  {bookmarked.has(paper.id) ? (
                    <BookmarkCheck className="h-4 w-4 text-accent" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toast({ title: "Opening paper...", description: paper.title })}
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toast({ title: "Downloading...", description: paper.title })}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PaperBrowser;
