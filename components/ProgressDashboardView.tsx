"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Play, Pause, RotateCcw, Flame, Clock, CalendarDays,
  BookOpen, Plus, Check, Filter, Trash2, Save, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { SubjectCategory } from "@/utils/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { useStudent } from "./StudentTypeProvider";
import { formatSubjectName } from "@/utils/subjects";

const SUBJECT_COLORS = [
  "hsl(197 100% 50%)",
  "hsl(142 71% 45%)",
  "hsl(38 92% 50%)",
  "hsl(280 67% 55%)",
  "hsl(350 80% 55%)",
  "hsl(210 60% 50%)",
  "hsl(160 50% 45%)",
  "hsl(20 80% 60%)"
];


interface TodoType {
  id: string;
  description: string;
  category: SubjectCategory;
  status: 'pending' | 'completed';
}

interface StudySessionType {
  id: string;
  category: SubjectCategory;
  duration_seconds: number;
  created_at: string;
}

interface Props {
  onBack: () => void;
}

const PieChart = ({ dailyData, totalHours, getSubjectColor }: { dailyData: { category: string; hours: number }[]; totalHours: number; getSubjectColor: (val: string) => string }) => {
  let cumulative = 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="180" height="180" viewBox="0 0 200 200">
        {totalHours === 0 ? (
          <circle cx="100" cy="100" r={radius} fill="none" stroke="hsl(var(--secondary))" strokeWidth="24" />
        ) : (
          dailyData.map((item) => {
            const fraction = item.hours / totalHours;
            const dashLength = fraction * circumference;
            const dashOffset = -(cumulative / totalHours) * circumference;
            cumulative += item.hours;
            return (
              <circle
                key={item.category}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={getSubjectColor(item.category)}
                strokeWidth="24"
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="transition-all duration-700"
                style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
              />
            );
          })
        )}
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-bold text-card-foreground">{totalHours.toFixed(1)}h</p>
        <p className="text-[10px] text-muted-foreground">Today</p>
      </div>
    </div>
  );
};

const ProgressDashboardView = ({ onBack }: Props) => {
  const supabase = createClient();
  const { toast } = useToast();
  const { subjects, loading: studentLoading } = useStudent();
  
  const dynamicSubjects = useMemo(() => {
    return subjects.map((subj, idx) => ({
      label: formatSubjectName(subj),
      value: subj,
      color: SUBJECT_COLORS[idx % SUBJECT_COLORS.length]
    }));
  }, [subjects]);

  const getSubjectLabel = useCallback((val: string) => dynamicSubjects.find(s => s.value === val)?.label || formatSubjectName(val as SubjectCategory), [dynamicSubjects]);
  const getSubjectColor = useCallback((val: string) => dynamicSubjects.find(s => s.value === val)?.color || "hsl(0 0% 50%)", [dynamicSubjects]);

  const [userId, setUserId] = useState<string | null>(null);
  
  // Timer state
  const [activeSubject, setActiveSubject] = useState<SubjectCategory>(subjects[0]);

  useEffect(() => {
    if (subjects.length > 0 && !subjects.includes(activeSubject)) {
      setActiveSubject(subjects[0]);
    }
  }, [subjects, activeSubject]);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [isSavingSession, setIsSavingSession] = useState(false);

  // Todo state
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [todoFilter, setTodoFilter] = useState<string>("All");
  const [newTodo, setNewTodo] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  // Stats state
  const [sessions, setSessions] = useState<StudySessionType[]>([]);
  const [totalSessionsCount, setTotalSessionsCount] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (running) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    const initData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchTodos(user.id);
        fetchSessions(user.id);
        fetchProfile(user.id);
      }
    };
    initData();
  }, [supabase.auth]);

  const fetchTodos = async (uid: string) => {
    const { data } = await supabase.from('todos').select('*').eq('user_id', uid).order('created_at', { ascending: false });
    if (data) setTodos(data);
  };

  const fetchSessions = async (uid: string) => {
    // Today's sessions
    const today = new Date().toLocaleDateString('en-CA'); // Gets YYYY-MM-DD local
    const { data: todaySessions } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', uid)
      .gte('session_date', today)
      .order('created_at', { ascending: false });
      
    if (todaySessions) setSessions(todaySessions);

    // Total sessions count
    const { count } = await supabase.from('study_sessions').select('*', { count: 'exact', head: true }).eq('user_id', uid);
    if (count !== null) setTotalSessionsCount(count);
  };

  const fetchProfile = async (uid: string) => {
    const { data } = await supabase.from('profiles').select('current_streak').eq('id', uid).single();
    if (data) setStreak(data.current_streak || 0);
  };

  const formatTime = useCallback((s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }, []);

  // Todo Actions
  const toggleTodo = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    setTodos((t) => t.map((todo) => (todo.id === id ? { ...todo, status: newStatus } : todo)));
    const { error } = await supabase.from('todos').update({ status: newStatus }).eq('id', id);
    if (error) {
      // Revert on error
      setTodos((t) => t.map((todo) => (todo.id === id ? { ...todo, status: currentStatus as any } : todo)));
      toast({ title: "Failed to update task", variant: "destructive" });
    }
  };

  const deleteTodo = async (id: string) => {
    setTodos((t) => t.filter((todo) => todo.id !== id));
    await supabase.from('todos').delete().eq('id', id);
  };

  const addTodo = async () => {
    if (!newTodo.trim() || !userId) return;
    setIsAddingTodo(true);
    const category = todoFilter === "All" ? subjects[0] : (todoFilter as SubjectCategory);
    
    const { data, error } = await supabase.from('todos').insert({
      user_id: userId,
      description: newTodo.trim(),
      category: category,
      status: 'pending'
    }).select().single();

    if (!error && data) {
      setTodos([{ ...data }, ...todos]);
      setNewTodo("");
    } else {
      toast({ title: "Failed to add task", variant: "destructive" });
    }
    setIsAddingTodo(false);
  };

  // Timer Actions
  const handleSaveSession = async () => {
    if (!userId || seconds === 0) return;
    setIsSavingSession(true);
    setRunning(false);

    const { data, error } = await supabase.from('study_sessions').insert({
      user_id: userId,
      category: activeSubject,
      duration_seconds: seconds
    }).select().single();

    if (!error && data) {
      setSessions([data, ...sessions]);
      setSeconds(0);
      setTotalSessionsCount(prev => prev + 1);
      toast({ title: "Session saved successfully!" });
    } else {
      toast({ title: "Failed to save session", variant: "destructive" });
    }
    setIsSavingSession(false);
  };

  // Derived data
  const filteredTodos = todoFilter === "All" ? todos : todos.filter((t) => t.category === todoFilter);
  
  const dailyDataMap = sessions.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = 0;
    acc[curr.category] += curr.duration_seconds;
    return acc;
  }, {} as Record<string, number>);

  const dailyData = Object.entries(dailyDataMap).map(([category, duration_seconds]) => ({
    category,
    hours: duration_seconds / 3600
  })).filter(x => x.hours > 0).sort((a,b) => b.hours - a.hours);

  const totalHours = dailyData.reduce((s, d) => s + d.hours, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card">
        <div className="container flex items-center gap-3 py-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">Progress Dashboard</h1>
            <p className="text-xs text-muted-foreground">Track your daily study progress</p>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid gap-5 lg:grid-cols-[280px_1fr_300px]">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <h2 className="text-sm font-semibold mb-4">Daily Summary</h2>
              <PieChart dailyData={dailyData} totalHours={totalHours} getSubjectColor={getSubjectColor} />
              <div className="mt-4 space-y-2">
                {dailyData.map((item) => (
                  <div key={item.category} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: getSubjectColor(item.category) }}
                      />
                      <span className="text-muted-foreground">{getSubjectLabel(item.category)}</span>
                    </div>
                    <span className="font-medium text-card-foreground">{item.hours.toFixed(1)}h</span>
                  </div>
                ))}
                {dailyData.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-2">No sessions today. Start studying!</div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <h2 className="text-sm font-semibold mb-4">Statistics</h2>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                  <Flame className="h-4.5 w-4.5 text-accent" />
                </div>
                <div>
                  <p className="text-lg font-bold">{streak} Days</p>
                  <p className="text-[10px] text-muted-foreground">Current Streak</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { icon: BookOpen, label: "Total Sessions", value: totalSessionsCount.toString() },
                  { icon: Clock, label: "Hours Today", value: totalHours.toFixed(1) },
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

          {/* MIDDLE COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col items-center"
          >
            <h2 className="text-sm font-semibold mb-5 self-start">Study Timer</h2>

            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {dynamicSubjects.map((s) => (
                <button
                  key={s.value}
                  onClick={() => {
                    setActiveSubject(s.value);
                    if (!running) setSeconds(0);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    activeSubject === s.value
                      ? "text-primary-foreground shadow-sm"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                  style={activeSubject === s.value ? { backgroundColor: s.color } : {}}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center flex-1 w-full max-w-sm">
              <div className="relative mb-8">
                <svg width="220" height="220" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="95" fill="none" className="stroke-secondary" strokeWidth="6" />
                  <motion.circle
                    cx="110"
                    cy="110"
                    r="95"
                    fill="none"
                    stroke={getSubjectColor(activeSubject)}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 95}
                    strokeDashoffset={-(2 * Math.PI * 95 * ((Math.min(seconds, 3600) / 3600)))}
                    style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-mono font-bold tracking-wider">
                    {formatTime(seconds)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">{getSubjectLabel(activeSubject)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full border-border"
                  title="Reset Counter"
                  onClick={() => {
                    setSeconds(0);
                    setRunning(false);
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <Button
                  className="h-14 w-14 rounded-full shadow-md"
                  style={{ backgroundColor: getSubjectColor(activeSubject) }}
                  onClick={() => setRunning(!running)}
                >
                  {running ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white ml-0.5" />}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full border-border bg-accent/10 hover:bg-accent/20 text-accent"
                  title="Save Session"
                  onClick={handleSaveSession}
                  disabled={seconds === 0 || isSavingSession}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-8 w-full text-left">
                <h3 className="text-xs font-semibold mb-3">Today's Sessions</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {sessions.slice(0, 10).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: getSubjectColor(session.category) }}
                        />
                        <span className="text-xs font-medium">{getSubjectLabel(session.category)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-xs font-semibold">
                          {formatTime(session.duration_seconds)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center">No sessions yet.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div
             initial={{ opacity: 0, y: 12 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.16 }}
             className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col h-[700px] max-h-[calc(100vh-10rem)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">To-Do List</h2>
              <div className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{filteredTodos.length} tasks</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4 max-h-24 overflow-y-auto shrink-0">
              <button
                onClick={() => setTodoFilter("All")}
                className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-all ${
                  todoFilter === "All"
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {dynamicSubjects.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setTodoFilter(s.value)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-all ${
                    todoFilter === s.value
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-4 shrink-0">
              <input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                placeholder="Add a task..."
                disabled={isAddingTodo}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
              />
              <Button size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={addTodo} disabled={ 
                 isAddingTodo
                }>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
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
                      onClick={() => toggleTodo(todo.id, todo.status)}
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                        todo.status === 'completed'
                          ? "border-accent bg-accent"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      {todo.status === 'completed' && <Check className="h-2.5 w-2.5 text-accent-foreground" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs leading-relaxed ${
                          todo.status === 'completed' ? "text-muted-foreground line-through" : "text-card-foreground"
                        }`}
                      >
                        {todo.description}
                      </p>
                      <span
                        className="inline-block mt-1 rounded-full px-2 py-0.5 text-[9px] font-medium"
                        style={{
                          backgroundColor: `${getSubjectColor(todo.category)}20`,
                          color: getSubjectColor(todo.category),
                        }}
                      >
                        {getSubjectLabel(todo.category)}
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
                {filteredTodos.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No tasks found.</p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressDashboardView;
