"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Play, Pause, RotateCcw, Flame, Clock, CalendarDays,
  BookOpen, Plus, Check, Filter, Trash2, Save, Loader2,
  Lock, Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { SubjectCategory } from "@/utils/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { useStudent } from "./StudentTypeProvider";
import { useStudyTimer } from "./StudyTimerProvider";
import { formatSubjectName, getSubjectAbbreviation, SUBJECT_COLORS, getSubjectColor as getGlobalSubjectColor } from "@/utils/subjects";
import { ProFeatureLock } from "@/components/ProFeatureLock";
import { useSubscription } from "@/components/SubscriptionProvider";





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
  const { isSubscribed } = useSubscription()
  
  const dynamicSubjects = useMemo(() => {
    return subjects.map((subj) => ({
      label: formatSubjectName(subj),
      value: subj,
      color: getGlobalSubjectColor(subj)
    }));
  }, [subjects]);

  const getSubjectLabel = useCallback((val: string) => dynamicSubjects.find(s => s.value === val)?.label || formatSubjectName(val as SubjectCategory), [dynamicSubjects]);
  const getSubjectColor = useCallback((val: string) => dynamicSubjects.find(s => s.value === val)?.color || getGlobalSubjectColor(val as SubjectCategory), [dynamicSubjects]);

  const {
    seconds,
    remaining,
    running,
    activeSubject,
    timerMode,
    timerDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    setActiveSubject,
    setTimerMode,
    setTimerDuration,
    saveSession,
    isSaving: isSavingSession
  } = useStudyTimer();

  const [inputHours, setInputHours] = useState(0);
  const [inputMinutes, setInputMinutes] = useState(0);

  const applyCustomDuration = () => {
    const totalSeconds = (inputHours * 3600) + (inputMinutes * 60);
    if (totalSeconds > 0) {
      setTimerDuration(totalSeconds);
      // We need a way to set 'remaining' in the provider too. 
      // I'll update the provider to handle this when setTimerDuration is called.
    }
  };

  // Redirect if no active subject and subjects available
  useEffect(() => {
    if (subjects.length > 0 && !activeSubject) {
      setActiveSubject(subjects[0]);
    }
  }, [subjects, activeSubject, setActiveSubject]);

  const [userId, setUserId] = useState<string | null>(null);
  
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
    if (studentLoading) return;

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
  }, [supabase.auth, subjects, studentLoading]);

  const fetchTodos = async (uid: string) => {
    let todosQuery = supabase.from('todos').select('*').eq('user_id', uid).order('created_at', { ascending: false });
    if (subjects.length > 0) {
      todosQuery = todosQuery.in('category', [...subjects, "general"]);
    }
    const { data } = await todosQuery;
    if (data) setTodos(data);
  };

  const fetchSessions = async (uid: string) => {
    // Today's sessions
    const today = new Date().toUTCString(); // Gets YYYY-MM-DD local
    let sessionsQuery = supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });



    if (subjects.length > 0) {
      sessionsQuery = sessionsQuery.in('category', subjects);
    }

    const { data: todaySessions } = await sessionsQuery;
    if (todaySessions) setSessions(todaySessions.filter((session) => new Date(session.session_date).toDateString() === today));

    // Total sessions count
    let countQuery = supabase.from('study_sessions').select('*', { count: 'exact', head: true }).eq('user_id', uid);
    if (subjects.length > 0) {
      countQuery = countQuery.in('category', subjects);
    }
    const { count } = await countQuery;
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
    const category = todoFilter === "All" ? 'general' as SubjectCategory : (todoFilter as SubjectCategory);
    
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
    const success = await saveSession();
    if (success) {
      if (userId) fetchSessions(userId);
    }
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

  const totalHours = sessions.reduce((s, d) => s + d.duration_seconds, 0) / 3600;

  return (
   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      {/* HEADER SECTION */}
      <section className="bg-primary py-16 mx-auto">
  <div className="container">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex flex-col items-center text-center"
    >
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Study Tools
      </button>
      <h1 className="text-3xl font-bold text-primary-foreground">
        Progress <span className="text-gradient-blue">Dashboard</span>
      </h1>
      <p className="mt-2 text-sm text-primary-foreground/50">
        Track focus, manage tasks, and analyze performance in one dashboard
      </p>
    </motion.div>
  </div>
</section>

      <div className="container py-6">
        <div className="grid gap-5 lg:grid-cols-[280px_1fr_300px]">
          
          {/* LEFT COLUMN: Summary & Stats */}
          <div className="space-y-5">
            {/* Daily Summary Card */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 pb-0 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Daily Summary</h2>
                {!isSubscribed && <Lock className="h-3 w-3 text-muted-foreground/50" />}
              </div>
              <ProFeatureLock label="Unlock daily summary with a Pro Subscription">
                <div className="p-5 pt-4">
                  <PieChart dailyData={dailyData} totalHours={totalHours} getSubjectColor={getSubjectColor} />
                  <div className="mt-4 space-y-2">
                    {dailyData.map((item) => (
                      <div key={item.category} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getSubjectColor(item.category) }} />
                          <span className="text-muted-foreground">{getSubjectLabel(item.category)}</span>
                        </div>
                        <span className="font-medium text-card-foreground">{item.hours.toFixed(1)}h</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ProFeatureLock>
            </div>

            {/* Statistics Card */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 pb-0 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Statistics</h2>
                {!isSubscribed && <span className="text-[10px] font-bold text-accent">PRO</span>}
              </div>
              <ProFeatureLock label="Unlock statistics with a Pro Subscription">
                <div className="p-5 pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                      <Flame className="h-4.5 w-4.5 text-accent" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">{streak} Days</p>
                      <p className="text-[10px] text-muted-foreground">Current Streak</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <BookOpen className="mx-auto h-4 w-4 text-accent mb-1" />
                      <p className="text-sm font-bold">{totalSessionsCount}</p>
                      <p className="text-[9px] text-muted-foreground">Total Sessions</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <Clock className="mx-auto h-4 w-4 text-accent mb-1" />
                      <p className="text-sm font-bold">{totalHours.toFixed(1)}</p>
                      <p className="text-[9px] text-muted-foreground">Total Hours</p>
                    </div>
                  </div>
                </div>
              </ProFeatureLock>
            </div>
          </div>

          {/* MIDDLE COLUMN: Study Timer */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 pb-0">
               <h2 className="text-sm font-semibold">Study Timer</h2>
            </div>
            <ProFeatureLock label="Unlock Study timer with Pro Subscription">
              <div className="p-6 flex flex-col items-center">
                {/* Mode Toggle */}
                <div className="flex justify-center mb-5">
                  <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
                    <button
                      onClick={() => setTimerMode("stopwatch")}
                      className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all disabled:opacity-50 ${
                        timerMode === "stopwatch"
                          ? "bg-accent text-accent-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                       disabled={running}
                    >
                      <Clock className="h-3.5 w-3.5" /> Stopwatch
                    </button>
                    <button
                      onClick={() => setTimerMode("timer")}
                      className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all disabled:opacity-50 ${
                        timerMode === "timer"
                          ? "bg-accent text-accent-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                       disabled={running}
                    >
                      <Timer className="h-3.5 w-3.5" /> Timer
                    </button>
                  </div>
                </div>

                {/* Custom Duration Input (only in timer mode) */}
                {timerMode === "timer" && (
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={23}
                        value={inputHours}
                        onChange={(e) => setInputHours(Math.max(0, Math.min(23, Number(e.target.value) || 0)))}
                        disabled={running}
                        className="w-14 rounded-lg border border-input bg-background px-2 py-1.5 text-center text-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <span className="text-xs text-muted-foreground">hr</span>
                    </div>
                    <span className="text-muted-foreground font-bold">:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={59}
                        value={inputMinutes}
                        onChange={(e) => setInputMinutes(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
                        disabled={running}
                        className="w-14 rounded-lg border border-input bg-background px-2 py-1.5 text-center text-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <span className="text-xs text-muted-foreground">min</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={applyCustomDuration}
                      disabled={running || (inputHours === 0 && inputMinutes === 0)}
                      className="ml-1 text-xs h-8"
                    >
                      Set
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                  {dynamicSubjects.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => { setActiveSubject(s.value); }}
                      disabled={running}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        activeSubject === s.value ? "text-white shadow-sm" : "bg-secondary text-muted-foreground"
                      } ${running ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
                      style={activeSubject === s.value ? { backgroundColor: running ? "#94a3b8" : s.color } : {}}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="relative mb-8">
                  <svg width="200" height="200" viewBox="0 0 220 220">
                    <circle cx="110" cy="110" r="95" fill="none" className="stroke-secondary" strokeWidth="6" />
                    <motion.circle
                      cx="110" cy="110" r="95" fill="none" stroke={getSubjectColor(activeSubject || subjects[0])}
                      strokeWidth="6" strokeLinecap="round" strokeDasharray={2 * Math.PI * 95}
                      strokeDashoffset={
                        timerMode === 'stopwatch' 
                        ? -(2 * Math.PI * 95 * ((Math.min(seconds, 3600) / 3600)))
                        : -(2 * Math.PI * 95 * (1 - (timerDuration > 0 ? remaining / timerDuration : 0)))
                      }
                      style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                      animate={{ 
                        strokeDashoffset: timerMode === 'stopwatch' 
                          ? -(2 * Math.PI * 95 * ((Math.min(seconds, 3600) / 3600)))
                          : -(2 * Math.PI * 95 * (1 - (timerDuration > 0 ? remaining / timerDuration : 0)))
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-mono font-bold">
                      {formatTime(timerMode === 'stopwatch' ? seconds : remaining)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-[120px]">{activeSubject ? getSubjectAbbreviation(activeSubject) : ""}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-border"
                    title="Reset Counter"
                    onClick={resetTimer}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    className="h-14 w-14 rounded-full shadow-md"
                    style={{ backgroundColor: getSubjectColor(activeSubject || subjects[0]) }}
                    onClick={() => running ? pauseTimer() : startTimer()}
                    disabled={timerMode === "timer" && remaining === 0}
                  >
                    {running ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white ml-0.5" />}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-border bg-accent/10 hover:bg-accent/20 text-accent"
                    title="Save Session"
                    onClick={handleSaveSession}
                    disabled={(timerMode === 'stopwatch' ? seconds === 0 : (timerDuration - remaining) === 0) || isSavingSession}
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
                          <span className="text-xs font-medium">{getSubjectAbbreviation(session.category)}</span>
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
            </ProFeatureLock>
          </div>

          {/* RIGHT COLUMN: To-Do List (Un-Locked by default) */}
          <motion.div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col h-[700px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">To-Do List</h2>
              <span className="text-[10px] text-muted-foreground">{filteredTodos.length} tasks</span>
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
              {[{ value: 'general', label: 'General', color: getSubjectColor('general' as SubjectCategory) }, ...dynamicSubjects].map((s) => {
                const isSelected = todoFilter === s.value;
                const subjColor = s.color;
                return (
                  <button
                    key={s.value}
                    onClick={() => setTodoFilter(s.value)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-all ${
                      isSelected
                        ? "text-white shadow-sm"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                    style={isSelected ? { backgroundColor: subjColor } : {}}
                  >
                    {s.label}
                  </button>
                );
              })}
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
                        {getSubjectAbbreviation(todo.category)}
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
