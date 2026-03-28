"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Video, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useStudent } from "@/components/StudentTypeProvider";
import { createClient } from "@/utils/supabase/client";
import { formatSubjectName } from "@/utils/subjects";
import { SubjectCategory } from "@/utils/supabase/types";

interface SubjectWithLink {
  title: string;
  meetUrl: string;
  category: SubjectCategory;
}

const CommunityRooms = () => {
  const { studentLevel, subjects, loading: studentLoading } = useStudent();
  const [meetLinks, setMeetLinks] = useState<Record<string, string>>({});
  const [loadingLinks, setLoadingLinks] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchMeetLinks = async () => {
      setLoadingLinks(true);
      const { data, error } = await supabase
        .from("subject_meet_links")
        .select("subject_id, meet_url");
      
      if (!error && data) {
        const links: Record<string, string> = {};
        data.forEach((item) => {
          links[item.subject_id] = item.meet_url;
        });
        setMeetLinks(links);
      }
      setLoadingLinks(false);
    };

    fetchMeetLinks();
  }, [supabase]);

  if (studentLoading || loadingLinks) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displaySubjects: SubjectWithLink[] = subjects.map((subject) => ({
    title: formatSubjectName(subject),
    category: subject,
    meetUrl: meetLinks[subject] || "https://meet.google.com/new",
  }));

  return (
    <div className="min-h-[calc(100vh-4rem)] ">
      <main className=" py-12  bg-black">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl text-center ">
            <Link href="/community" className="inline-flex items-center text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Community
            </Link>
            <h1 className="text-4xl font-bold text-primary-foreground">Study <span className="text-gradient-blue">Rooms</span></h1>
            <p className="mt-4 text-sm text-primary-foreground/50">Join subject-specific Google Meet rooms to study with peers.</p>
            <div className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20 capitalize">
              {studentLevel} Level
            </div>
          </motion.div>
        </div>
       
      </main>
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-8 container pb-12">
          {displaySubjects.map((subject, index) => (
            <motion.div
              key={subject.category}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">
                  <Video className="h-6 w-6" />
                </div>
                <h3 className="line-clamp-2 text-lg font-semibold text-card-foreground">
                  {subject.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Live discussion and study group for {studentLevel?.charAt(0).toUpperCase()}{studentLevel?.slice(1)} {subject.title}.
                </p>
              </div>
              <Button asChild className="mt-6 w-full bg-primary hover:bg-primary/90 text-white">
                <a href={subject.meetUrl} target="_blank" rel="noopener noreferrer">
                  Join Room
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
    </div>
  );
};

export default CommunityRooms;
