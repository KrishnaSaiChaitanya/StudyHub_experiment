"use client"
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BarChart3,
  Users,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2,
  CalendarDays,
  FileText,
  BookOpen,
  Play,
  Library,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const quickLinks = [
  { icon: BarChart3, label: "Progress Dashboard", path: "/study/progress", color: "bg-accent/10 text-accent" },
  { icon: FileText, label: "Mock Exams", path: "/practice/mock-exams", color: "bg-accent/10 text-accent" },
  { icon: Library, label: "Community Library", path: "/community", color: "bg-accent/10 text-accent" },
  { icon: Users, label: "Group Study Rooms", path: "/community", color: "bg-accent/10 text-accent" },
];

const upcomingEvents = [
  { title: "CA Foundation — Paper 1", date: "May 15, 2026", type: "Exam" },
  { title: "Tax Law Webinar", date: "Mar 22, 2026", type: "Webinar" },
  { title: "Mock Test Series — Accounting", date: "Apr 1, 2026", type: "Mock" },
];

const recentUploads = [
  { title: "Advanced Accounting — Ch. 12 Summary", type: "PDF", author: "Priya S.", time: "2h ago" },
  { title: "GST Amendment Explained", type: "Video", author: "CA Raj Mehta", time: "5h ago" },
  { title: "Cost Accounting Formulas Sheet", type: "PDF", author: "Ankit R.", time: "1d ago" },
  { title: "Auditing Standards Revision", type: "Video", author: "CA Sneha K.", time: "1d ago" },
];

// Calculate days left for exam (May 15, 2026)
const examDate = new Date("2026-05-15");
const today = new Date();
const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

const Home = () => {
  return (
    <div className="min-h-screen bg-background">


      <main className="container max-w-5xl py-10 lg:py-16">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Welcome back! 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's your study overview for today.
          </p>
        </motion.div>

        {/* Exam Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mt-10"
        >
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-8 px-6">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Days Left for Exam
              </p>
              <p className="text-5xl font-extrabold text-accent">{daysLeft}</p>
              <p className="text-sm text-muted-foreground">
                CA Foundation — May 15, 2026
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            { icon: Flame, label: "Day Streak", value: "7 days" },
            { icon: Clock, label: "Today's Study", value: "2h 15m" },
            { icon: CheckCircle2, label: "Tasks Done", value: "4 / 8" },
          ].map((stat, i) => (
            <Card key={i} className="border-border">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <stat.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Left Column — Quick Access */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="mb-4 text-base font-semibold text-foreground">Quick Access</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickLinks.map((link) => (
                  <Link href={link.path}>
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
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Upcoming Events</h2>
              <Link href="/events"  className="text-sm font-medium text-accent hover:underline">
                Calendar
              </Link>
            </div>
            <Card className="mt-4 border-border">
              <CardContent className="divide-y divide-border p-0">
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="flex items-start gap-3 p-4">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10">
                      <CalendarDays className="h-4 w-4 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {event.date} · {event.type}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recently Uploaded — Horizontal scroll */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Recently Uploaded</h2>
            <Link href={"/study-planner"} className="text-sm font-medium text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {recentUploads.map((item, i) => (
              <Card
                key={i}
                className="group flex-shrink-0 w-48 cursor-pointer border-border transition-all hover:shadow-md hover:border-accent/30"
              >
                <CardContent className="p-0">
                  {/* Square thumbnail area */}
                  <div className="relative flex aspect-square w-full items-center justify-center bg-primary rounded-t-lg">
                    {item.type === "Video" ? (
                      <>
                        <span className="text-lg font-bold text-primary-foreground/40">
                          {item.title.split(" ").map(w => w[0]).slice(0, 3).join("")}
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center rounded-t-lg bg-accent/0 transition-all group-hover:bg-accent/20">
                          <Play className="h-8 w-8 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                          <FileText className="h-6 w-6 text-destructive" />
                        </div>
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                          PDF
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-3.5">
                    <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">{item.title}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{item.author}</span>
                      <span>·</span>
                      <span>{item.time}</span>
                    </div>
                    <Badge variant="secondary" className="mt-2 text-[10px]">
                      {item.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
