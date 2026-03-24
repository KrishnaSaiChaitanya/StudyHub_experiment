"use client"
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BarChart3,
  Users,
  Clock,
  Flame,
  CheckCircle2,
  CalendarDays,
  FileText,
  Library,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

type DbPaper = {
  id: string;
  title: string;
  subject: string;
  level: string;
  type: string;
  created_at: string;
};

type DbEvent = {
  id: string;
  title: string;
  subject: string;
  level: string;
  type: string;
  created_at: string;
  event_month: number;
  event_year: number;
  event_date: number;
  event_time: string;
};

const quickLinks = [
  { icon: BarChart3, label: "Progress Dashboard", path: "/study/progress", color: "bg-accent/10 text-accent" },
  { icon: FileText, label: "Mock Exams", path: "/practice/mock-exams", color: "bg-accent/10 text-accent" },
  { icon: Library, label: "Community Library", path: "/community", color: "bg-accent/10 text-accent" },
  { icon: Users, label: "Group Study Rooms", path: "/community", color: "bg-accent/10 text-accent" },
];

// Utility: Format Enum to Title Case
const formatSubjectName = (subject: string | null) => {
  if (!subject) return "General";
  return subject.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

// Utility: Time Ago format
const timeAgo = (dateString: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// Calculate days left for main exam (Static target for now)
const examDate = new Date("2026-05-15");
const today = new Date();
const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

const Home = () => {
  const supabase = createClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Not authenticated");

      // Use email prefix or metadata name if available
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || "Student";
      const todayStr = new Date().toISOString().split('T')[0];

      // Fetch Stats, Events, and Papers concurrently
      const [
        profileRes,
        sessionsRes,
        todosRes,
        eventsRes,
        papersRes
      ] = await Promise.all([
        supabase.from('profiles').select('current_streak').eq('id', user.id).single(),
        supabase.from('study_sessions').select('duration_seconds').eq('user_id', user.id).eq('session_date', todayStr),
        supabase.from('todos').select('status').eq('user_id', user.id),
        supabase.from('calendar_events').select('*'),
        supabase.from('practice_papers').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      // Process Stats
      const totalSeconds = sessionsRes.data?.reduce((acc: number, curr: any) => acc + curr.duration_seconds, 0) || 0;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);

      const completed = todosRes.data?.filter((t: any) => t.status === 'completed').length || 0;
      const total = todosRes.data?.length || 0;

      // Process Events
      let upcoming: DbEvent[] = [];
      if (eventsRes.data) {
        const now = new Date();
        upcoming = eventsRes.data
          .map((e: any) => ({ ...e, fullDate: new Date(e.event_year, e.event_month - 1, e.event_date) }))
          .filter((e: any) => e.fullDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate())) // Today or future
          .sort((a: any, b: any) => a.fullDate.getTime() - b.fullDate.getTime())
          .slice(0, 5) as DbEvent[]; // Top 5
      }

      return {
        userName: name,
        stats: {
          streak: profileRes.data?.current_streak || 0,
          studyTime: `${hours}h ${minutes}m`,
          tasksDone: `${completed} / ${total}`
        },
        events: upcoming,
        recentPapers: (papersRes.data || []) as DbPaper[]
      };
    }
  });

  // Extract variables with fallbacks to prevent breaking the UI while loading
  const {
    userName = "Student",
    stats = { streak: 0, studyTime: "0h 0m", tasksDone: "0 / 0" },
    events = [],
    recentPapers = []
  } = data || {};

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* <Navbar /> */}

      <main className="container max-w-5xl py-10 lg:py-16 flex-1">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl capitalize">
            Welcome back, {userName}! 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's your study overview for today.
          </p>
        </motion.div>

        {/* Exam Countdown */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }} className="mt-10">
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-8 px-6">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Days Left for Exam
              </p>
              <p className="text-5xl font-extrabold text-accent">{daysLeft}</p>
              <p className="text-sm text-muted-foreground">CA Foundation — May 15, 2026</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Row */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Flame, label: "Day Streak", value: `${stats.streak} days` },
            { icon: Clock, label: "Today's Study", value: stats.studyTime },
            { icon: CheckCircle2, label: "Tasks Done", value: stats.tasksDone },
          ].map((stat, i) => (
            <Card key={i} className="border-border">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <stat.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  {isLoading ? (
                    <div className="h-6 w-16 mt-1 rounded bg-muted animate-pulse" />
                  ) : (
                    <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Left Column — Quick Access */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <h2 className="mb-4 text-base font-semibold text-foreground">Quick Access</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickLinks.map((link, i) => (
                  <Link href={link.path} key={i} prefetch={false}>
                    <Card className="group cursor-pointer border-border transition-shadow hover:shadow-md">
                      <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${link.color}`}>
                          <link.icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{link.label}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column — Upcoming Events */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Upcoming Events</h2>
              <Link href="/events" className="text-sm font-medium text-accent hover:underline" prefetch={false}>
                Calendar
              </Link>
            </div>
            <Card className="mt-4 border-border">
              <CardContent className="divide-y divide-border p-0 min-h-[200px]">
                {isLoading ? (
                  <div className="flex h-[200px] items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : events.length === 0 ? (
                  <div className="flex h-[200px] flex-col items-center justify-center text-muted-foreground">
                    <CalendarDays className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-xs">No upcoming events</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-4 transition-colors hover:bg-secondary/50">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-md border bg-card">
                        <span className="text-[10px] font-bold text-accent leading-none uppercase">
                          {new Date(event.event_year, event.event_month - 1).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-xs font-semibold leading-tight">{event.event_date}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">
                          {event.event_time} · {formatSubjectName(event.subject)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recently Uploaded — Practice Papers */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }} className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Recently Added Papers</h2>
            <Link href="/practice" className="text-sm font-medium text-accent hover:underline" prefetch={false}>
              View all
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 snap-x">
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="flex-shrink-0 w-52 border-border animate-pulse">
                  <CardContent className="p-0">
                    <div className="flex aspect-video w-full items-center justify-center bg-muted rounded-t-lg" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 w-3/4 bg-muted rounded" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : recentPapers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No recent papers available.</p>
            ) : (
              recentPapers.map((paper) => (
                <Card key={paper.id} className="group flex-shrink-0 w-52 snap-start cursor-pointer border-border transition-all hover:shadow-md hover:border-accent/30">
                  <CardContent className="p-0">
                    <div className="relative flex aspect-video w-full items-center justify-center bg-secondary rounded-t-lg border-b">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background shadow-sm">
                          <FileText className="h-5 w-5 text-accent" />
                        </div>
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-wider line-clamp-1">
                          {paper.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-3.5">
                      <p className="text-sm font-medium text-foreground leading-snug line-clamp-2 mb-2" title={paper.title}>
                        {paper.title}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <Badge variant="outline" className="text-[9px] px-1.5 font-medium border-border line-clamp-1">
                          {formatSubjectName(paper.subject)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span className="capitalize">{paper.level}</span>
                        <span>·</span>
                        <span>{timeAgo(paper.created_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;