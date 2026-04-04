"use client"

import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { BookOpen, Timer, CalendarDays, Target, BarChart3, ClipboardList } from "lucide-react";
import Link from "next/link";

const tools = [
  { icon: BookOpen, title: "Study Resources", description: "Create personalized study plans aligned with your exam schedule.", badge: "Popular", path: "/study/planner" },
  { icon: Timer, title: "Focus Timer", description: "Pomodoro-based timer with session tracking and insights.", path: "/study/progress" },
  { icon: Target, title: "Task Manager", description: "Break down syllabus into actionable tasks and track completion.", path: "/study/progress" },
  { icon: BarChart3, title: "Progress Dashboard", description: "Visualize preparation across subjects with analytics.", path: "/study/progress" },
  { icon: CalendarDays, title: "Exam Calendar", description: "ICAI exam dates, registration deadlines, and reminders.", badge: "New", path: "/study/events" },
  { icon: ClipboardList, title: "Notes & Bookmarks", description: "Save notes, bookmark resources, and organize materials.", path: "/bookmarks" },
];

const Study = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col w-full">
      <div className="flex-1 w-full">
        <section className="bg-primary py-20 w-full">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl text-center">
              <h1 className="text-4xl font-bold text-primary-foreground">Study <span className="text-gradient-blue">Smarter</span></h1>
              <p className="mt-4 text-sm text-primary-foreground/50">Plan, focus, and track your CA preparation with powerful tools.</p>
            </motion.div>
          </div>
        </section>
        <section className="container py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group cursor-pointer rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:border-accent/30"
              >
                <Link href={tool.path ?? ""} className="block w-full h-full">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <tool.icon className="h-5 w-5 text-accent" />
                    </div>
                    {tool.badge && (
                      <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-medium text-accent">{tool.badge}</span>
                    )}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-card-foreground">{tool.title}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground">{tool.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Study;
