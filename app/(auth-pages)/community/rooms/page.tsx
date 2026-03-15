"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Video, ArrowLeft } from "lucide-react";
import Link from "next/link";

const subjects = [
  { title: "Advanced Accounting", meetUrl: "https://meet.google.com/new" },
  { title: "Corporate and Other Laws", meetUrl: "https://meet.google.com/new" },
  { title: "Taxation", meetUrl: "https://meet.google.com/new" },
  { title: "Cost and Management Accounting", meetUrl: "https://meet.google.com/new" },
  { title: "Auditing and Ethics", meetUrl: "https://meet.google.com/new" },
  { title: "Financial Management and Strategic Management", meetUrl: "https://meet.google.com/new" },
];

const CommunityRooms = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black">
      <main className="container py-12">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl text-center">
            <Link href="/community" className="inline-flex items-center text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Community
            </Link>
            <h1 className="text-4xl font-bold text-primary-foreground">Study <span className="text-gradient-blue">Rooms</span></h1>
            <p className="mt-4 text-sm text-primary-foreground/50">Join subject-specific Google Meet rooms to study with peers.</p>
          </motion.div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-8">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <Video className="h-6 w-6" />
                </div>
                <h3 className="line-clamp-2 text-lg font-semibold text-card-foreground">
                  {subject.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Live discussion and study group for CA Intermediate {subject.title}.
                </p>
              </div>
              <Button asChild className="mt-6 w-full bg-primary hover:bg-blue-700 text-white">
                <a href={subject.meetUrl} target="_blank" rel="noopener noreferrer">
                  Join Room
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CommunityRooms;
