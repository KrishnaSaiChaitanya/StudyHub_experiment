"use client"
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client"; // Adjust to your Supabase client path
import { useRouter } from "next/navigation";


type DbCalendarEvent = {
  id: string;
  title: string;
  category: "Exam" | "Mocks" | "Deadlines" | "Sessions";
  type: string;
  description: string;
  created_at: string;
  event_month: number;
  event_year: number;
  event_date: number;
  event_time: string;
};



const EVENT_CATEGORIES = ["Exam", "Mocks", "Deadlines", "Sessions"] as const;
type EventCategory = typeof EVENT_CATEGORIES[number];

const CATEGORY_COLORS: Record<EventCategory, string> = {
  "Exam": "bg-rose-500/15 text-rose-600 border-rose-500/30 ring-rose-500 shadow-rose-100",
  "Mocks": "bg-blue-500/15 text-blue-600 border-blue-500/30 ring-blue-500 shadow-blue-100",
  "Deadlines": "bg-orange-500/15 text-orange-600 border-orange-500/30 ring-orange-500 shadow-orange-100",
  "Sessions": "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 ring-emerald-500 shadow-emerald-100",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const formatSubjectName = (subject: string) => {
  return subject.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const ExamCalendarView = () => {
  const supabase = createClient();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<EventCategory | null>(null);
  
  const [events, setEvents] = useState<DbCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use a ref to handle closing the popup when clicking outside
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: calendarEvents } = await supabase
          .from("calendar_events")
          .select("*");

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

  // Filter events for the current month and selected category filter
  const monthEvents = events.filter(
    (e) => e.event_month === month && e.event_year === year && (!filterCategory || e.category === filterCategory)
  );

  const getEventsForDay = (day: number) => monthEvents.filter((e) => e.event_date === day);

  const onBack = () => {
    router.push("/study");
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  if (isLoading) return  <motion.div 
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
                <p className="mt-4 text-muted-foreground text-sm font-medium">Loading Calendar Events...</p>
              </motion.div>;

  return (
    <><section className="bg-primary py-16 mx-auto w-full text-center">
            <div className="container">
              <div className="mx-auto">
                <button onClick={onBack} className="mb-4 flex items-center gap-1.5 text-xs text-primary-foreground/50  mx-auto hover:text-primary-foreground transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Study Tools
                </button>
                <h1 className="text-3xl font-bold text-primary-foreground">Calendar <span className="text-gradient-blue">Events</span></h1>
                <p className="mt-2 text-sm text-primary-foreground/50">Browse and download study planners shared by top faculty.</p>
              </div>
            </div>
          </section>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-8">
      {/* <Button variant="ghost" onClick={onBack} className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Study Tools
      </Button> */}

     

      {/* Category Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filterCategory === null ? "default" : "outline"}
          onClick={() => setFilterCategory(null)}
          className={filterCategory === null ? "bg-accent text-accent-foreground" : ""}
        >
          All Events
        </Button>
        {EVENT_CATEGORIES.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={filterCategory === cat ? "default" : "outline"}
            onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
            className={filterCategory === cat ? "bg-accent" : ""}
          >
            {cat}
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
      const categoryColor = CATEGORY_COLORS[ev.category] || "bg-primary";

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
                          className="absolute left-[-50%] top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-xl border bg-background p-4 shadow-xl"
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
                                <div key={ev.id} className={`rounded-lg border p-2.5 ${CATEGORY_COLORS[ev.category] || "bg-secondary text-secondary-foreground"}`}>
                                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                                    {ev.category}
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
                  <div className={`flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border ${CATEGORY_COLORS[ev.category] || ""}`}>
                    <span className="text-xs font-bold leading-none">{ev.event_date}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">{ev.title}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {ev.category}
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
    </>
  );
};

export default ExamCalendarView;