import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Globe, MapPin, Star, Users, BookOpen, Play, Clock, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

interface FacultyData {
  id?: string;
  name: string;
  subject: string;
  rating: number;
  students: string;
  level: string;
}

interface FacultyProfileProps {
  faculty: FacultyData;
  onBack: () => void;
}

const FacultyProfile = ({ faculty, onBack }: FacultyProfileProps) => {
  const [planners, setPlanners] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacultyData = async () => {
      if (!faculty.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const supabase = createClient();

      // Parallel fetching
      const [
        { data: plannersData },
        { data: videosData },
        { data: coursesData }
      ] = await Promise.all([
        supabase.from("study_planners").select("*").eq("faculty_id", faculty.id),
        supabase.from("faculty_videos").select("*").eq("faculty_id", faculty.id),
        supabase.from("faculty_courses").select("*").eq("faculty_id", faculty.id)
      ]);

      if (plannersData) setPlanners(plannersData);
      if (videosData) setVideos(videosData);
      if (coursesData) setCourses(coursesData);

      setLoading(false);
    };

    fetchFacultyData();
  }, [faculty.id]);

  const initials = faculty.name.split(" ").slice(-1)[0][0] || "F";

  const getThumbnailText = (title: string) => {
    return title.split(" ")
      .slice(0, 2)
      .map(word => word[0])
      .join("")
      .toUpperCase();
  };

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
              {initials}
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
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-accent" />{faculty.name.split(" ")[1]?.toLowerCase() || 'faculty'}@castudy.in</span>
                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-accent" />+91 98XXX XXXXX</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-accent" />New Delhi</span>
                <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-accent" />castudy.in</span>
              </div>
            </div>
            {/* <Button className="bg-accent text-accent-foreground hover:bg-accent/90" size="sm">Follow</Button> */}
          </div>
        </Card>
      </motion.div>

      {loading ? (
        <div className="flex h-40 items-center justify-center mt-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Study Planners */}
          {planners.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-8">
              <h2 className="mb-4 text-lg font-semibold text-card-foreground">Study Planners</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {planners.map((plan) => (
                  <Card key={plan.id} className="border-border bg-card p-4 transition-all hover:border-accent/30 flex flex-col justify-between">
                    <div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                        <Calendar className="h-4 w-4 text-accent" />
                      </div>
                      <h3 className="mt-3 text-sm font-semibold text-card-foreground">{plan.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                        <span className="rounded-full bg-secondary px-2 py-0.5">{plan.pages} Pages</span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 flex items-center gap-1">
                          <Star className="h-2.5 w-2.5 fill-muted-foreground" /> {plan.rating}
                        </span>
                        <span className="rounded-full bg-secondary px-2 py-0.5">{plan.downloads} DLs</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 w-full text-xs"
                      onClick={() => window.open(plan.pdf_url, '_blank')}
                    >
                      View Plan
                    </Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* YouTube Videos */}
          {videos.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
              <h2 className="mb-4 text-lg font-semibold text-card-foreground">Popular Videos</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {videos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="group flex cursor-pointer items-center gap-4 border-border bg-card p-4 transition-all hover:border-accent/30"
                    onClick={() => window.open(video.url, '_blank')}
                  >
                    <div className="relative flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-primary">
                      <span className="text-xs font-bold text-primary-foreground/60">{getThumbnailText(video.name)}</span>
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-accent/0 transition-all group-hover:bg-accent/20">
                        <Play className="h-5 w-5 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium text-card-foreground">{video.name}</h3>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />
                           {video.duration_minutes ? `${video.duration_minutes}m` : 'Unknown'}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Lectures to Enroll */}
          {courses.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
              <h2 className="mb-4 text-lg font-semibold text-card-foreground">Lectures & Courses</h2>
              <div className="space-y-3">
                {courses.map((course) => (
                  <Card key={course.id} className="flex flex-col gap-4 border-border bg-card p-5 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-card-foreground">{course.name}</h3>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                        <span>{course.sessions_count} Sessions</span>
                        <span>{course.hours_count} Hours</span>
                        <span>{course.enrolled_count} Enrolled</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-accent">₹{course.price}</span>
                      <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">Enroll Now</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
          
          {planners.length === 0 && videos.length === 0 && courses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground mt-8 border rounded-lg border-dashed">
              <BookOpen className="h-8 w-8 mb-3 opacity-20" />
              <p>No content available for this faculty member yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FacultyProfile;
