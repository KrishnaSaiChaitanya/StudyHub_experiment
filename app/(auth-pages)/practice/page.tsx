"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import MockExam from "@/components/MockExam";
import PerformanceHistory from "@/components/PerformanceHistory";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ClipboardCheck, Clock, Award, Lock, Crown, X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { ProFeatureLock } from "@/components/ProFeatureLock";


const resources = [
  { icon: FileText, title: "Mock Test Papers (MTP)", count: "120+ Papers", description: "ICAI-aligned mock test papers for Foundation, Intermediate, and Final levels.", link:"/practice/mtp", isDisabled: false },
  { icon: FileText, title: "Revision Test Papers (RTP)", count: "80+ Papers", description: "Official revision test papers with detailed solutions and explanations.", link:"/practice/rtp", isDisabled: false },
  { icon: FileText, title: "Previous Year Questions", count: "200+ Papers", description: "Comprehensive PYQ bank organized by subject, chapter, and difficulty.", link:"/practice/pyq", isDisabled: false },
  { icon: ClipboardCheck, title: "Online Mock Exams", count: "50+ Tests", description: "Full-length timed mock exams with auto-grading and performance analysis.", link:"/practice/online", isDisabled: true },
];

const Practice = () => {
  const router = useRouter();

  return (
    <div className="bg-background w-full">
      <main className="pb-12">
      <section className="bg-primary py-20">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl text-center">
            <h1 className="text-4xl font-bold text-primary-foreground">Practice & <span className="text-gradient-blue">Excel</span></h1>
            <p className="mt-4 text-sm text-primary-foreground/50">Access MTPs, RTPs, PYQs, and take mock exams to sharpen your skills.</p>
          </motion.div>
        </div>
      </section>
      <section className="container py-16">
        <div className="grid gap-4 md:grid-cols-2 mb-12"> 
          {resources.map((res, i) => (
            <Link href={res.link} key={res.title}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <res.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground">{res.title}</h3>
                  <span className="text-xs font-medium text-accent">{res.count}</span>
                </div>
              </div>
              <p className="mt-3 flex-1 text-xs text-muted-foreground">{res.description}</p>
              <Button variant="outline" size="sm" className="mt-4 w-full text-xs">Browse Papers</Button>
            </motion.div>
            </Link>
          ))}
        </div>

        <ProFeatureLock>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-xl bg-primary p-8 text-center"
          >
            <Award className="mx-auto h-8 w-8 text-accent" />
            <h3 className="mt-4 text-xl font-bold text-primary-foreground">Take a Full Mock Exam</h3>
            <p className="mt-2 text-xs text-primary-foreground/50">Simulate real CA exam conditions with timed, full-length tests.</p>
            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-primary-foreground/40">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 30 Minutes</span>
              <span>10 Questions</span>
              <span>Instant Results</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={() => router.push('/practice/mock-exams')} className="bg-accent text-accent-foreground shadow-accent hover:bg-accent/90">View Mock Exams</Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/practice/performance')} className="border-accent/30 text-accent hover:bg-accent/10">View My Performance</Button>
            </div>
          </motion.div>
        </ProFeatureLock>
      </section>
      </main>
      <Footer />
    </div>
  );
};

export default Practice;
