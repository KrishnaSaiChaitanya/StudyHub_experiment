import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Bookmark, BookOpen, Download, Eye, Star, ArrowLeft, FileText, Calendar, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const planners = [
  { id: 1, title: "CA Foundation - Complete Study Plan", faculty: "Prof. Rajesh Kumar", subject: "Accounting", date: "2026-02-15", pages: 24, downloads: 1240, rating: 4.8, bookmarked: false },
  { id: 2, title: "Taxation Module - 90 Day Planner", faculty: "CA Priya Sharma", subject: "Taxation", date: "2026-02-20", pages: 18, downloads: 980, rating: 4.6, bookmarked: true },
  { id: 3, title: "Law & Ethics - Chapter-wise Breakdown", faculty: "Prof. Anil Mehta", subject: "Law", date: "2026-03-01", pages: 32, downloads: 760, rating: 4.9, bookmarked: false },
  { id: 4, title: "Audit & Assurance - Revision Strategy", faculty: "CA Sneha Gupta", subject: "Auditing", date: "2026-03-05", pages: 20, downloads: 1100, rating: 4.7, bookmarked: true },
  { id: 5, title: "Cost Management - Exam Prep Guide", faculty: "Prof. Vikram Singh", subject: "Costing", date: "2026-01-28", pages: 16, downloads: 640, rating: 4.5, bookmarked: false },
  { id: 6, title: "Financial Reporting - Standards Quick Map", faculty: "CA Priya Sharma", subject: "Accounting", date: "2026-03-08", pages: 28, downloads: 890, rating: 4.8, bookmarked: false },
];

const subjects = ["All", "Accounting", "Taxation", "Law", "Auditing", "Costing"];

interface Props {
  onBack: () => void;
}

const StudyPlannerView = ({ onBack }: Props) => {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [bookmarks, setBookmarks] = useState<number[]>(planners.filter(p => p.bookmarked).map(p => p.id));

  const filtered = planners.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.faculty.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === "All" || p.subject === selectedSubject;
    const matchesBookmark = !showBookmarksOnly || bookmarks.includes(p.id);
    return matchesSearch && matchesSubject && matchesBookmark;
  });

  const toggleBookmark = (id: number) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-primary py-16">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={onBack} className="mb-4 flex items-center gap-1.5 text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Study Tools
            </button>
            <h1 className="text-3xl font-bold text-primary-foreground">Study <span className="text-gradient-blue">Planners</span></h1>
            <p className="mt-2 text-sm text-primary-foreground/50">Browse and download study planners shared by top faculty.</p>
          </motion.div>
        </div>
      </section>

      {/* Search + Actions */}
      <section className="container py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search planners by title or faculty..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="default"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </Button>
            <Button
              variant={showBookmarksOnly ? "default" : "outline"}
              size="default"
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className="gap-2"
            >
              <Bookmark className={`h-4 w-4 ${showBookmarksOnly ? "fill-current" : ""}`} />
              Bookmarks
            </Button>
          </div>
        </motion.div>

        {/* Filter chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex flex-wrap gap-2 overflow-hidden"
            >
              {subjects.map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    selectedSubject === sub
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <p className="mt-4 text-xs text-muted-foreground">{filtered.length} planner{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Planner cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((planner, i) => (
            <motion.div
              key={planner.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:border-accent/30"
            >
              {/* PDF icon + badge */}
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10">
                  <FileText className="h-5 w-5 text-destructive" />
                </div>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-medium text-accent">{planner.subject}</span>
              </div>

              {/* Title */}
              <h3 className="mt-4 text-sm font-semibold text-card-foreground leading-snug">{planner.title}</h3>

              {/* Meta */}
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="h-3 w-3" /> {planner.faculty}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" /> {new Date(planner.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{planner.pages} pages</span>
                  {/* {/* <span>•</span>
                  <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-accent text-accent" /> {planner.rating}</span> */}
                  <span>•</span>
                  <span>{planner.downloads} downloads</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2">
                <Button size="sm" className="flex-1 gap-1.5 text-xs">
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <Eye className="h-3.5 w-3.5" /> Preview
                </Button>
                <button
                  onClick={() => toggleBookmark(planner.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-secondary"
                >
                  <Bookmark className={`h-3.5 w-3.5 ${bookmarks.includes(planner.id) ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">No planners found matching your search.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default StudyPlannerView;
