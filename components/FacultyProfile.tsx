import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Globe, MapPin, Star, Users, BookOpen, Play, Clock, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FacultyData {
  name: string;
  subject: string;
  rating: number;
  students: string;
  level: string;
}

const studyPlanners = [
  { title: "90-Day Foundation Crash Course", duration: "3 Months", chapters: 24, difficulty: "Beginner" },
  { title: "Intermediate Fast Track Plan", duration: "6 Months", chapters: 40, difficulty: "Intermediate" },
  { title: "Final Revision Sprint", duration: "45 Days", chapters: 18, difficulty: "Advanced" },
];

const youtubeVideos = [
  { title: "Accounting Standards Made Easy", views: "120K", duration: "45:30", thumbnail: "AS" },
  { title: "GST Simplified - Complete Series", views: "95K", duration: "1:02:15", thumbnail: "GST" },
  { title: "Audit Planning & Documentation", views: "78K", duration: "38:20", thumbnail: "AUD" },
  { title: "Cost Sheet Problems Solved", views: "65K", duration: "52:10", thumbnail: "CS" },
];

const lectures = [
  { title: "Complete Accounting Course", sessions: 48, hours: "120+", price: "₹8,999", enrolled: "2.1K", live: true },
  { title: "Taxation Masterclass", sessions: 36, hours: "90+", price: "₹7,499", enrolled: "1.8K", live: false },
  { title: "Audit & Assurance Pro", sessions: 30, hours: "75+", price: "₹6,999", enrolled: "1.5K", live: true },
];

interface FacultyProfileProps {
  faculty: FacultyData;
  onBack: () => void;
}

const FacultyProfile = ({ faculty, onBack }: FacultyProfileProps) => {
  return (
    <div className="container max-w-4xl py-8">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6 gap-1 text-xs text-muted-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Faculty
      </Button>

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border bg-card p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">
              {faculty.name.split(" ").slice(-1)[0][0]}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-card-foreground">{faculty.name}</h1>
              <p className="mt-1 text-sm text-accent">{faculty.subject} · {faculty.level}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{faculty.rating} Rating</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{faculty.students} Students</span>
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />10+ Years Exp</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-accent" />{faculty.name.split(" ")[1].toLowerCase()}@castudy.in</span>
                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-accent" />+91 98XXX XXXXX</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-accent" />New Delhi</span>
                <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-accent" />castudy.in</span>
              </div>
            </div>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" size="sm">Follow</Button>
          </div>
        </Card>
      </motion.div>

      {/* Study Planners */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-card-foreground">Study Planners</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {studyPlanners.map((plan) => (
            <Card key={plan.title} className="border-border bg-card p-4 transition-all hover:border-accent/30">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <Calendar className="h-4 w-4 text-accent" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-card-foreground">{plan.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                <span className="rounded-full bg-secondary px-2 py-0.5">{plan.duration}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5">{plan.chapters} Chapters</span>
                <span className="rounded-full bg-secondary px-2 py-0.5">{plan.difficulty}</span>
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full text-xs">View Plan</Button>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* YouTube Videos */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-card-foreground">Popular Videos</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {youtubeVideos.map((video) => (
            <Card key={video.title} className="group flex cursor-pointer items-center gap-4 border-border bg-card p-4 transition-all hover:border-accent/30">
              <div className="relative flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-primary">
                <span className="text-xs font-bold text-primary-foreground/60">{video.thumbnail}</span>
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-accent/0 transition-all group-hover:bg-accent/20">
                  <Play className="h-5 w-5 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-card-foreground">{video.title}</h3>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{video.views} views</span>
                  <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{video.duration}</span>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Lectures to Enroll */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-card-foreground">Lectures & Courses</h2>
        <div className="space-y-3">
          {lectures.map((lecture) => (
            <Card key={lecture.title} className="flex flex-col gap-4 border-border bg-card p-5 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-card-foreground">{lecture.title}</h3>
                  {lecture.live && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">LIVE</span>}
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                  <span>{lecture.sessions} Sessions</span>
                  <span>{lecture.hours} Hours</span>
                  <span>{lecture.enrolled} Enrolled</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-accent">{lecture.price}</span>
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">Enroll Now</Button>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FacultyProfile;
