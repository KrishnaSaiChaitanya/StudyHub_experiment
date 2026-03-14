import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Play, Pause, RotateCcw, Flame, Clock, CalendarDays,
  BookOpen, Plus, Check, Filter, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SUBJECTS = ["Accounting", "Taxation", "Law", "Auditing", "Costing", "Economics"];

const SUBJECT_COLORS: Record<string, string> = {
  Accounting: "hsl(197 100% 50%)",
  Taxation: "hsl(142 71% 45%)",
  Law: "hsl(38 92% 50%)",
  Auditing: "hsl(280 67% 55%)",
  Costing: "hsl(350 80% 55%)",
  Economics: "hsl(210 60% 50%)",
};

const dailyData = [
  { subject: "Accounting", hours: 2.5 },
  { subject: "Taxation", hours: 1.5 },
  { subject: "Law", hours: 1 },
  { subject: "Auditing", hours: 0.5 },
];

const totalHours = dailyData.reduce((s, d) => s + d.hours, 0);

interface Todo {
  id: string;
  text: string;
  subject: string;
  done: boolean;
}

const initialTodos: Todo[] = [
  { id: "1", text: "Complete Chapter 5 problems", subject: "Accounting", done: false },
  { id: "2", text: "Revise GST amendments", subject: "Taxation", done: true },
  { id: "3", text: "Read Companies Act notes", subject: "Law", done: false },
  { id: "4", text: "Practice cost sheet questions", subject: "Costing", done: false },
  { id: "5", text: "Mock test - Audit standards", subject: "Auditing", done: false },
];

// Pie chart SVG component
const PieChart = () => {
  let cumulative = 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="180" height="180" viewBox="0 0 200 200">
        {dailyData.map((item) => {
          const fraction = item.hours / totalHours;
          const dashLength = fraction * circumference;
          const dashOffset = -(cumulative / totalHours) * circumference;
          cumulative += item.hours;
          return (
            <circle
              key={item.subject}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={SUBJECT_COLORS[item.subject]}
              strokeWidth="24"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-700"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
          );
        })}
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-bold text-card-foreground">{totalHours}h</p>
        <p className="text-[10px] text-muted-foreground">Today</p>
      </div>
    </div>
  );
};

interface Props {
  onBack: () => void;
}

const ProgressDashboardView = ({ onBack }: Props) => {
  // Timer state
  const [activeSubject, setActiveSubject] = useState(SUBJECTS[0]);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  // Todo state
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [todoFilter, setTodoFilter] = useState<string>("All");
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (running) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = useCallback((s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }, []);

  const toggleTodo = (id: string) =>
    setTodos((t) => t.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)));

  const deleteTodo = (id: string) => setTodos((t) => t.filter((todo) => todo.id !== id));

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos((t) => [
      ...t,
      { id: Date.now().toString(), text: newTodo.trim(), subject: todoFilter === "All" ? "Accounting" : todoFilter, done: false },
    ]);
    setNewTodo("");
  };

  const filteredTodos = todoFilter === "All" ? todos : todos.filter((t) => t.subject === todoFilter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container flex items-center gap-3 py-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Progress Dashboard</h1>
            <p className="text-xs text-muted-foreground">Track your daily study progress</p>
          </div>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="container py-6">
        <div className="grid gap-5 lg:grid-cols-[280px_1fr_300px]">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            {/* Daily Summary Pie */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <h2 className="text-sm font-semibold text-card-foreground mb-4">Daily Summary</h2>
              <PieChart />
              <div className="mt-4 space-y-2">
                {dailyData.map((item) => (
                  <div key={item.subject} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: SUBJECT_COLORS[item.subject] }}
                      />
                      <span className="text-muted-foreground">{item.subject}</span>
                    </div>
                    <span className="font-medium text-card-foreground">{item.hours}h</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <h2 className="text-sm font-semibold text-card-foreground mb-4">Statistics</h2>

              {/* Weekly Streak */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                  <Flame className="h-4.5 w-4.5 text-accent" />
                </div>
                <div>
                  <p className="text-lg font-bold text-card-foreground">5 Days</p>
                  <p className="text-[10px] text-muted-foreground">Weekly Streak</p>
                </div>
              </div>

              {/* Streak dots */}
              <div className="flex gap-1.5 mb-5">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div key={day + i} className="flex flex-col items-center gap-1">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-medium ${
                        i < 5
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {day}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: BookOpen, label: "Sessions", value: "24" },
                  { icon: Clock, label: "Hours", value: "38.5" },
                  { icon: CalendarDays, label: "Days", value: "12" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-secondary p-3 text-center">
                    <stat.icon className="mx-auto h-4 w-4 text-accent mb-1" />
                    <p className="text-sm font-bold text-card-foreground">{stat.value}</p>
                    <p className="text-[9px] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* MIDDLE COLUMN - Study Timer */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="text-sm font-semibold text-card-foreground mb-5">Study Timer</h2>

            {/* Subject selector */}
            <div className="flex flex-wrap gap-2 mb-8">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setActiveSubject(s);
                    setSeconds(0);
                    setRunning(false);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    activeSubject === s
                      ? "text-accent-foreground shadow-sm"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                  style={activeSubject === s ? { backgroundColor: SUBJECT_COLORS[s] } : {}}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Timer display */}
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <svg width="220" height="220" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="95" fill="none" className="stroke-secondary" strokeWidth="6" />
                  <motion.circle
                    cx="110"
                    cy="110"
                    r="95"
                    fill="none"
                    stroke={SUBJECT_COLORS[activeSubject]}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 95}
                    strokeDashoffset={2 * Math.PI * 95 * (1 - Math.min(seconds / 3600, 1))}
                    style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 95 * (1 - Math.min(seconds / 3600, 1)) }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-mono font-bold text-card-foreground tracking-wider">
                    {formatTime(seconds)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activeSubject}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full border-border"
                  onClick={() => {
                    setSeconds(0);
                    setRunning(false);
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  className="h-14 w-14 rounded-full shadow-md"
                  style={{ backgroundColor: SUBJECT_COLORS[activeSubject] }}
                  onClick={() => setRunning(!running)}
                >
                  {running ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white ml-0.5" />}
                </Button>
              </div>

              {/* Today's sessions */}
              <div className="mt-8 w-full">
                <h3 className="text-xs font-semibold text-card-foreground mb-3">Today's Sessions</h3>
                <div className="space-y-2">
                  {[
                    { subject: "Accounting", duration: "1h 20m", time: "9:00 AM" },
                    { subject: "Taxation", duration: "45m", time: "11:30 AM" },
                    { subject: "Law", duration: "30m", time: "2:15 PM" },
                  ].map((session) => (
                    <div
                      key={session.time}
                      className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: SUBJECT_COLORS[session.subject] }}
                        />
                        <span className="text-xs font-medium text-card-foreground">{session.subject}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground">{session.time}</span>
                        <span className="text-xs font-semibold text-card-foreground">{session.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN - To-Do List */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-card-foreground">To-Do List</h2>
              <div className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{filteredTodos.length} tasks</span>
              </div>
            </div>

            {/* Subject filters */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {["All", ...SUBJECTS].map((s) => (
                <button
                  key={s}
                  onClick={() => setTodoFilter(s)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-all ${
                    todoFilter === s
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Add todo */}
            <div className="flex gap-2 mb-4">
              <input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                placeholder="Add a task..."
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={addTodo}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Todo items */}
            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              <AnimatePresence>
                {filteredTodos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="group flex items-start gap-2.5 rounded-lg px-3 py-2.5 hover:bg-secondary/60 transition-colors"
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                        todo.done
                          ? "border-accent bg-accent"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      {todo.done && <Check className="h-2.5 w-2.5 text-accent-foreground" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs leading-relaxed ${
                          todo.done ? "text-muted-foreground line-through" : "text-card-foreground"
                        }`}
                      >
                        {todo.text}
                      </p>
                      <span
                        className="inline-block mt-1 rounded-full px-2 py-0.5 text-[9px] font-medium"
                        style={{
                          backgroundColor: `${SUBJECT_COLORS[todo.subject]}20`,
                          color: SUBJECT_COLORS[todo.subject],
                        }}
                      >
                        {todo.subject}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressDashboardView;
