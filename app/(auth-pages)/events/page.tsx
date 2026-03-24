"use client"
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client"; // Adjust to your Supabase client path
import { StudentLevel, SubjectCategory } from "@/utils/supabase/types";


type DbCalendarEvent = {
  id: string;
  title: string;
  subject: SubjectCategory;
  level: StudentLevel;
  type: string;
  description: string;
  created_at: string;
  event_month: number;
  event_year: number;
  event_date: number;
  event_time: string;
};



// Map levels to their respective subjects to filter DB queries easily
const LEVEL_SUBJECTS: Record<StudentLevel, SubjectCategory[]> = {
  foundation: [
    'principles_and_practice_of_accounting', 'business_laws', 
    'business_math_logical_reasoning_and_statistics', 'business_economics'
  ],
  intermediate: [
    'advanced_accounting', 'corporate_and_other_laws', 'taxation', 
    'cost_and_management_accounting', 'auditing_and_ethics', 'financial_management_and_strategic_management'
  ],
  final: [
    'financial_reporting', 'advanced_financial_management', 'advanced_auditing_assurance_and_professional_ethics', 
    'direct_tax_laws', 'indirect_tax_laws', 'integrated_business_solutions'
  ]
};

// Generate a color palette for subjects
const SUBJECT_COLORS = [
  "bg-blue-500/15 text-blue-600 border-blue-500/30 ring-blue-500",
  "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 ring-emerald-500",
  "bg-purple-500/15 text-purple-600 border-purple-500/30 ring-purple-500",
  "bg-orange-500/15 text-orange-600 border-orange-500/30 ring-orange-500",
  "bg-rose-500/15 text-rose-600 border-rose-500/30 ring-rose-500",
  "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 ring-cyan-500",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const formatSubjectName = (subject: string) => {
  return subject.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const ExamCalendarView = () => {
  const supabase = createClient();
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [filterSubject, setFilterSubject] = useState<SubjectCategory | null>(null);
  
  const [events, setEvents] = useState<DbCalendarEvent[]>([]);
  const [userLevel, setUserLevel] = useState<StudentLevel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use a ref to handle closing the popup when clicking outside
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get user profile to determine their level
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("student_type")
          .eq("id", user.id)
          .single();

        const level = profile?.student_type as StudentLevel || "foundation"; // Fallback to foundation
        setUserLevel(level);

        const allowedSubjects = LEVEL_SUBJECTS[level];

        // 2. Fetch events matching those subjects
        const { data: calendarEvents } = await supabase
          .from("calendar_events")
          .select("*")
          .in("subject", allowedSubjects);

        if (calendarEvents) {
          setEvents(calendarEvents);
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12 matching DB schema (event_month)
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
    setSelectedDate(null);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
    setSelectedDate(null);
  };

  // Filter events for the current month and selected subject filter
  const monthEvents = events.filter(
    (e) => e.event_month === month && e.event_year === year && (!filterSubject || e.subject === filterSubject)
  );

  const getEventsForDay = (day: number) => monthEvents.filter((e) => e.event_date === day);

  // Dynamic config object for subject colors
  const activeSubjects = userLevel ? LEVEL_SUBJECTS[userLevel] : [];
  const getSubjectColor = (subject: SubjectCategory | null) => {
    if (!subject) return SUBJECT_COLORS[0];
    const index = activeSubjects.indexOf(subject);
    return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  if (isLoading) return <div className="p-8 h-[800px] w-full text-center text-muted-foreground animate-pulse"><p className="h-full">Loading calendar...</p></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-8">
      {/* <Button variant="ghost" onClick={onBack} className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Study Tools
      </Button> */}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Study <span className="text-gradient-to-r from-primary to-secondary">Calendar</span></h2>
        {/* <p className="mt-1 text-sm text-muted-foreground">
          Showing events for <span className="font-semibold text-primary capitalize">{userLevel}</span> level subjects.
        </p> */}
      </div>

      {/* Dynamic Subject Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filterSubject === null ? "default" : "outline"}
          onClick={() => setFilterSubject(null)}
          className={filterSubject === null ? "bg-accent text-accent-foreground" : ""}
        >
          All Subjects
        </Button>
        {activeSubjects.map((subject, idx) => (
          <Button
            key={subject}
            size="sm"
            variant={filterSubject === subject ? "default" : "outline"}
            onClick={() => setFilterSubject(filterSubject === subject ? null : subject)}
            className={filterSubject === subject ? "bg-accent" : ""}
          >
            <BookOpen className="mr-1.5 h-3.5 w-3.5" />
            {formatSubjectName(subject)}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Calendar */}
        <Card className="shadow-card" ref={calendarRef}>
          <CardHeader className="flex-row items-center justify-between pb-4">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-lg">{MONTHS[month - 1]} {year}</CardTitle>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
              ))}
            </div>
            
            {/* Date cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} className="aspect-square" />;
                
                const dayEvents = getEventsForDay(day);
                const isSelected = selectedDate === day;
                const isToday = day === new Date().getDate() && month === new Date().getMonth() + 1 && year === new Date().getFullYear();

                return (
                  <div key={day} className="relative aspect-square">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(isSelected ? null : day)}
                      className={`h-full w-full flex flex-col items-center justify-start rounded-lg p-1 text-sm transition-colors
                        ${isSelected ? "bg-accent text-accent-foreground ring-2 ring-accent" : "hover:bg-secondary"}
                        ${isToday && !isSelected ? "ring-1 ring-accent/50" : ""}
                      `}
                    >
                      <span className={`text-xs font-medium ${isToday ? "font-bold" : ""}`}>{day}</span>
                     {dayEvents.length > 0 && (
  <div className="mt-1 flex w-full flex-col gap-1 px-1">
    {dayEvents.slice(0, 3).map((ev) => {
      const colorClasses = getSubjectColor(ev.subject)
      const bgColor = colorClasses.split(' ').find(c => c.startsWith('bg-')) || 'bg-primary'

      return (
        <div
          key={ev.id}
          className={`w-full truncate rounded-md px-1.5 py-[2px] text-[10px] font-medium text-white bg-primary`}
        >
          {ev.event_time ? `${ev.event_time} ` : ''}
          {ev.title}
        </div>
      )
    })}

    {dayEvents.length > 3 && (
      <span className="text-[9px] font-medium text-muted-foreground pl-1">
        +{dayEvents.length - 3} more
      </span>
    )}
  </div>
)}
                    </motion.button>

                    {/* IN-CALENDAR POPOVER / TOOLTIP */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-xl border bg-background p-4 shadow-xl"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-foreground">
                              {MONTHS[month - 1]} {day}, {year}
                            </h4>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedDate(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="max-h-[200px] space-y-3 overflow-y-auto pr-1">
                            {dayEvents.length === 0 ? (
                              <p className="text-xs text-muted-foreground">No events scheduled.</p>
                            ) : (
                              dayEvents.map((ev) => (
                                <div key={ev.id} className={`rounded-lg border p-2.5 ${getSubjectColor(ev.subject)}`}>
                                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                                    {ev.subject ? formatSubjectName(ev.subject) : "General"}
                                  </span>
                                  <p className="mt-0.5 text-sm font-medium leading-tight">{ev.title}</p>
                                  {ev.event_time && (
                                    <div className="mt-1.5 flex items-center gap-1 opacity-80">
                                      <Clock className="h-3 w-3" />
                                      <span className="text-[10px]">{ev.event_time}</span>
                                    </div>
                                  )}
                                  {ev.description && <p className="mt-1 text-xs opacity-70">{ev.description}</p>}
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar - Quick Upcoming Events */}
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Upcoming This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {monthEvents
                .filter(e => e.event_date >= new Date().getDate() || month !== (new Date().getMonth() + 1))
                .sort((a, b) => a.event_date - b.event_date)
                .slice(0, 5)
                .map((ev) => (
                <div key={ev.id} className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border ${getSubjectColor(ev.subject)}`}>
                    <span className="text-xs font-bold leading-none">{ev.event_date}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">{ev.title}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {ev.subject ? formatSubjectName(ev.subject) : "General"}
                    </p>
                  </div>
                </div>
              ))}
              {monthEvents.length === 0 && (
                <p className="text-xs text-muted-foreground">No upcoming events this month.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ExamCalendarView;