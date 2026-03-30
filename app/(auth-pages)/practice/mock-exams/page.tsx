"use client"

import { useState, useEffect } from "react";
import MockExam from "@/components/MockExam";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { FileText, Clock, ChevronRight, BookOpen, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useStudent } from "@/components/StudentTypeProvider";
import { toast } from "sonner";

interface Test {
  id: string;
  name: string;
  category: string;
  questions_count: number;
}

export default function MockExamsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const { subjects, loading: studentLoading } = useStudent();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        let testQuery = supabase.from('tests').select('*');

        if (subjects.length > 0) {
          testQuery = testQuery.in('category', subjects);
        }

        const { data, error } = await testQuery.order('created_at', { ascending: false });
        
        if (error) throw error;
        setTests(data || []);
      } catch (error: any) {
        console.error('Error fetching tests:', error.message);
        toast.error('Failed to load tests');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [supabase, subjects, studentLoading]);

  const handleStartTest = (testId: string) => {
    router.push(`/practice/mock-exams/${testId}`);
  };

  const formatCategory = (category: string) => {
    if (!category) return "";
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
    <div className="min-h-[calc(100vh-4rem)] bg-background w-full flex flex-col">
      <main className="flex-1 pb-12">
        <section className="bg-primary py-20 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[150%] rounded-full bg-accent/5 blur-3xl" />
          </div>
          
          <div className="container relative z-10">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl text-center">
              <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/20 border-accent/20 px-3 py-1 text-sm">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Premium Mock Tests
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground tracking-tight">Available <span className="text-gradient-blue text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Mock Exams</span></h1>
              <p className="mt-4 text-base text-primary-foreground/70 leading-relaxed">Select a test below to start your simulated exam experience. Track your performance and identify areas for improvement.</p>
            </motion.div>
          </div>
        </section>

        <section className="container py-16">
          <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">All Tests</h2>
              <p className="text-sm text-muted-foreground mt-1">Choose from our curated list of ICAI-aligned mock exams</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/practice')} className="hover:border-primary">
              Back to Practice Center
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center p-24"
              >
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-r-2 border-indigo-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <p className="mt-4 text-muted-foreground text-sm font-medium">Loading premium tests...</p>
              </motion.div>
            ) : tests.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/30 p-16 text-center shadow-sm"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary/50 text-muted-foreground/50 mb-6">
                  <FileText className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">No tests available</h3>
                <p className="mt-2 text-muted-foreground max-w-md">We're currently updating our test bank. Please check back later for new mock exams.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {tests.map((test, i) => (
                 <motion.div
  key={test.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ y: -5 }} // Subtle lift
  transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 20 }}
  className="group relative flex flex-col overflow-hidden rounded-[24px] border border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 border-accent/40 hover:shadow-[0_20px_40px_-15px_rgba(var(--accent),0.15)]"
>
  {/* Top Accent Line - appears on hover */}
  <div className="absolute top-0 left-0 h-[2px] w-0 bg-accent transition-all duration-500 group-hover:w-full" />

  <div className="flex flex-1 flex-col p-6">
    {/* Header: Icon & Metadata */}
    <div className="mb-6 flex items-center justify-between">
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-accent/20 blur-lg transition-opacity opacity-0 group-hover:opacity-100" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/80 text-accent ring-1 ring-inset ring-white/10 shadow-sm">
          <BookOpen className="h-6 w-6 transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-110" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge variant="outline" className="border-accent/20 bg-accent/5 text-[10px] uppercase tracking-wider text-accent">
          {test.questions_count} Questions
        </Badge>
      </div>
    </div>

    {/* Title & Category */}
    <div className="mb-6">
      <h3 className="text-xl font-bold tracking-tight text-card-foreground line-clamp-2 leading-[1.3] transition-colors group-hover:text-accent">
        {test.name}
      </h3>
      <div className="mt-2 flex items-center gap-2 text-xs font-medium text-muted-foreground/80">
        <span className="rounded-full bg-secondary px-2.5 py-0.5">
          {formatCategory(test.category)}
        </span>
      </div>
    </div>

    {/* Stats Row */}
    <div className="mt-auto grid grid-cols-2 gap-4 border-t border-border/50 pt-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
          <Clock className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-muted-foreground font-semibold">Duration</span>
          <span className="text-sm font-bold">{test.questions_count * 1.5}m</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-muted-foreground font-semibold">Level</span>
          <span className="text-sm font-bold">Standard</span>
        </div>
      </div>
    </div>

    {/* Modern Action Button */}
    <Button 
      onClick={() => handleStartTest(test.id)}
      className="mt-6 w-full group/btn relative overflow-hidden rounded-xl bg-primary h-12 transition-all hover:bg-primary/90"
    >
      <span className="relative z-10 flex items-center font-bold tracking-wide">
        Start Mock Exam 
        <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
      </span>
      {/* Button Shine Effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full" />
    </Button>
  </div>
</motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
    <Footer/>
    </>
  );
}
