"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Video, FileText, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarEvent {
  date: number;
  month: number;
  year: number;
  title: string;
  type: "exam" | "webinar" | "deadline" | "workshop";
  time?: string;
  description?: string;
}

const eventTypeConfig = {
  exam: { color: "bg-destructive/15 text-destructive border-destructive/30", icon: GraduationCap, label: "Exam" },
  webinar: { color: "bg-accent/15 text-accent border-accent/30", icon: Video, label: "Webinar" },
  deadline: { color: "bg-orange-500/15 text-orange-600 border-orange-500/30", icon: FileText, label: "Deadline" },
  workshop: { color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", icon: BookOpen, label: "Workshop" },
};

const fixedEvents: CalendarEvent[] = [
  { date: 3, month: 2, year: 2026, title: "CA Foundation – Paper 1", type: "exam", time: "10:00 AM", description: "Principles and Practice of Accounting" },
  { date: 5, month: 2, year: 2026, title: "CA Foundation – Paper 2", type: "exam", time: "10:00 AM", description: "Business Laws and Business Correspondence" },
  { date: 7, month: 2, year: 2026, title: "CA Foundation – Paper 3", type: "exam", time: "10:00 AM", description: "Business Mathematics and Statistics" },
  { date: 9, month: 2, year: 2026, title: "CA Foundation – Paper 4", type: "exam", time: "10:00 AM", description: "Business Economics" },
  { date: 12, month: 2, year: 2026, title: "Tax Planning Webinar", type: "webinar", time: "4:00 PM", description: "Live session on advanced tax planning strategies" },
  { date: 15, month: 2, year: 2026, title: "Assignment Submission", type: "deadline", time: "11:59 PM", description: "Corporate Law case study submission" },
  { date: 20, month: 2, year: 2026, title: "Audit Workshop", type: "workshop", time: "2:00 PM", description: "Hands-on auditing techniques with faculty" },
  { date: 25, month: 2, year: 2026, title: "Mock Test Series", type: "exam", time: "9:00 AM", description: "Full-length mock test – CA Intermediate Group 1" },
  { date: 28, month: 2, year: 2026, title: "Registration Deadline", type: "deadline", time: "5:00 PM", description: "Last date for May exam registration" },
  // April events
  { date: 5, month: 3, year: 2026, title: "GST Webinar", type: "webinar", time: "3:00 PM", description: "Updates on GST compliance and filing" },
  { date: 10, month: 3, year: 2026, title: "CA Inter – Mock Test", type: "exam", time: "9:00 AM", description: "Practice mock for Intermediate Group 2" },
  { date: 18, month: 3, year: 2026, title: "Accounting Workshop", type: "workshop", time: "11:00 AM", description: "Advanced accounting standards deep-dive" },
  { date: 22, month: 3, year: 2026, title: "Project Report Deadline", type: "deadline", time: "11:59 PM", description: "Final project report submission" },
  // May events
  { date: 1, month: 4, year: 2026, title: "CA Inter – Group 1 Paper 1", type: "exam", time: "10:00 AM", description: "Advanced Accounting" },
  { date: 3, month: 4, year: 2026, title: "CA Inter – Group 1 Paper 2", type: "exam", time: "10:00 AM", description: "Corporate and Other Laws" },
  { date: 8, month: 4, year: 2026, title: "Ethics Webinar", type: "webinar", time: "5:00 PM", description: "Professional ethics and CA responsibilities" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface Props {
  onBack: () => void;
}

const ExamCalendarView = ({ onBack }: Props) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthEvents = fixedEvents.filter(
    (e) => e.month === month && e.year === year && (!filterType || e.type === filterType)
  );

  const getEventsForDay = (day: number) => monthEvents.filter((e) => e.date === day);

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  const upcomingEvents = [...fixedEvents]
    .filter((e) => new Date(e.year, e.month, e.date) >= new Date(2026, 2, 1))
    .sort((a, b) => new Date(a.year, a.month, a.date).getTime() - new Date(b.year, b.month, b.date).getTime())
    .slice(0, 5);

  // Build calendar grid
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-8">
      <Button variant="ghost" onClick={onBack} className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Study Tools
      </Button>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Exam Calendar</h2>
        <p className="mt-1 text-sm text-muted-foreground">Track exam dates, webinars, deadlines, and workshops</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filterType === null ? "default" : "outline"}
          onClick={() => setFilterType(null)}
          className={filterType === null ? "bg-accent text-accent-foreground" : ""}
        >
          All Events
        </Button>
        {Object.entries(eventTypeConfig).map(([key, cfg]) => (
          <Button
            key={key}
            size="sm"
            variant={filterType === key ? "default" : "outline"}
            onClick={() => setFilterType(filterType === key ? null : key)}
            className={filterType === key ? "bg-accent text-accent-foreground" : ""}
          >
            <cfg.icon className="mr-1.5 h-3.5 w-3.5" />
            {cfg.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Calendar */}
        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between pb-4">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-lg">{MONTHS[month]} {year}</CardTitle>
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
                const isToday = day === 16 && month === 2 && year === 2026; // mock today
                return (
                  <motion.button
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(isSelected ? null : day)}
                    className={`relative flex aspect-square flex-col items-center justify-start rounded-lg p-1 text-sm transition-colors
                      ${isSelected ? "bg-accent text-accent-foreground ring-2 ring-accent" : "hover:bg-secondary"}
                      ${isToday && !isSelected ? "ring-1 ring-accent/50" : ""}
                    `}
                  >
                    <span className={`text-xs font-medium ${isToday ? "font-bold" : ""}`}>{day}</span>
                    {dayEvents.length > 0 && (
                      <div className="mt-0.5 flex flex-wrap justify-center gap-0.5">
                        {dayEvents.slice(0, 3).map((ev, idx) => (
                          <span
                            key={idx}
                            className={`h-1.5 w-1.5 rounded-full ${
                              ev.type === "exam" ? "bg-destructive" :
                              ev.type === "webinar" ? "bg-accent" :
                              ev.type === "deadline" ? "bg-orange-500" : "bg-emerald-500"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Selected day events */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 space-y-2 border-t border-border pt-4"
              >
                <h4 className="text-sm font-semibold text-foreground">
                  {MONTHS[month]} {selectedDate}, {year}
                </h4>
                {selectedDayEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No events scheduled</p>
                ) : (
                  selectedDayEvents.map((ev, idx) => {
                    const cfg = eventTypeConfig[ev.type];
                    return (
                      <div key={idx} className={`rounded-lg border p-3 ${cfg.color}`}>
                        <div className="flex items-center gap-2">
                          <cfg.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{ev.title}</span>
                        </div>
                        {ev.time && <p className="mt-1 text-xs opacity-80">{ev.time}</p>}
                        {ev.description && <p className="mt-0.5 text-xs opacity-70">{ev.description}</p>}
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar – upcoming events */}
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((ev, idx) => {
                const cfg = eventTypeConfig[ev.type];
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${cfg.color}`}>
                      <cfg.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">{ev.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {MONTHS[ev.month]} {ev.date} · {ev.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(eventTypeConfig).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    key === "exam" ? "bg-destructive" :
                    key === "webinar" ? "bg-accent" :
                    key === "deadline" ? "bg-orange-500" : "bg-emerald-500"
                  }`} />
                  <span className="text-xs text-muted-foreground">{cfg.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ExamCalendarView;
