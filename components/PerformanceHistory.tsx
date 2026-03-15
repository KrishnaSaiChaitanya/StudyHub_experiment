import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Target, Clock, Calendar, BarChart3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/utils/supabase/client";

interface Attempt {
  id: string;
  score: number;
  total_questions: number;
  completed_at: string;
  tests: {
    name: string;
    category: string;
  };
}

interface PerformanceHistoryProps {
  onBack: () => void;
}

const formatCategory = (category: string) => {
  if (!category) return "";
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const PerformanceHistory = ({ onBack }: PerformanceHistoryProps) => {
  const [history, setHistory] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('test_attempts')
          .select(`
            id,
            score,
            total_questions,
            completed_at,
            tests (
              name,
              category
            )
          `)
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (error) throw error;
        setHistory(data as unknown as Attempt[] || []);
      } catch (error) {
        console.error("Error fetching performance history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [supabase]);

  const totalTests = history.length;
  // Make sure we calculate valid percentages
  const percentages = history.map(t => Math.round((t.score / Math.max(t.total_questions, 1)) * 100));
  const avgScore = totalTests > 0 ? Math.round(percentages.reduce((a, b) => a + b, 0) / totalTests) : 0;
  const bestScore = totalTests > 0 ? Math.max(...percentages) : 0;

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "text-accent";
    if (pct >= 60) return "text-yellow-400";
    return "text-destructive";
  };

  const getScoreBadge = (pct: number) => {
    if (pct >= 80) return { label: "Excellent", cls: "bg-accent/10 text-accent border-accent/20" };
    if (pct >= 60) return { label: "Good", cls: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20" };
    return { label: "Needs Work", cls: "bg-destructive/10 text-destructive border-destructive/20" };
  };

  if (loading) {
    return (
      <div className="container max-w-3xl py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading performance data...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-6 gap-1 text-xs text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Practice
        </Button>

        <h2 className="text-2xl font-semibold text-foreground">My Performance</h2>
        <p className="mt-1 text-sm text-muted-foreground">Track your mock exam history and progress</p>

        {/* Stats overview */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: BarChart3, label: "Tests Taken", value: totalTests.toString() },
            { icon: Target, label: "Avg Score", value: `${avgScore}%` },
            { icon: TrendingUp, label: "Best Score", value: `${bestScore}%` },
            { icon: Clock, label: "Avg Time", value: "N/A" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border bg-card p-4 text-center">
                <stat.icon className="mx-auto h-4 w-4 text-accent" />
                <p className="mt-2 text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {totalTests === 0 ? (
          <Card className="mt-10 border-border bg-card p-12 text-center">
            <h3 className="text-lg font-semibold text-foreground">No Performance Data</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              You haven't completed any mock exams yet. Take your first test to see your performance stats here.
            </p>
            <Button onClick={onBack} className="mt-6 bg-accent text-accent-foreground">
              Go to Mock Exams
            </Button>
          </Card>
        ) : (
          <>
            {/* Score trend */}
            <Card className="mt-6 border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground">Score Trend</h3>
              <div className="mt-4 flex items-end gap-2" style={{ height: 120 }}>
                {/* Visualizing from oldest to newest. We map over the array slice.reverse() */}
                {history.slice().reverse().map((test, i) => {
                  const pct = Math.round((test.score / Math.max(test.total_questions, 1)) * 100);
                  return (
                    <motion.div
                      key={test.id}
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="group relative flex-1 cursor-pointer rounded-t-md bg-accent/20 transition-colors hover:bg-accent/40 flex flex-col justify-end"
                    >
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                        {pct}%
                      </div>
                      <div className="w-full rounded-t-md bg-accent" style={{ height: `${pct}%` }} />
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-2 flex gap-2 overflow-hidden">
                {history.slice().reverse().map((test) => (
                  <p key={test.id} className="flex-1 text-center text-[9px] text-muted-foreground truncate">
                    {new Date(test.completed_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </p>
                ))}
              </div>
            </Card>

            {/* Test history */}
            <h3 className="mt-8 text-sm font-semibold text-foreground">Test History</h3>
            <div className="mt-3 space-y-2">
              {history.map((test, i) => {
                const pct = Math.round((test.score / Math.max(test.total_questions, 1)) * 100);
                const badge = getScoreBadge(pct);
                return (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card className="border-border bg-card p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-medium text-foreground">{test.tests?.name}</h4>
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${badge.cls}`}>
                              {badge.label}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              {formatCategory(test.tests?.category)}
                            </span>
                            <span className="flex items-center gap-1 before:content-['•'] before:mr-2">
                              <Calendar className="h-3 w-3" />
                              {new Date(test.completed_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <p className={`text-lg font-bold ${getScoreColor(pct)}`}>
                            {test.score}/{test.total_questions}
                          </p>
                          <Progress value={pct} className="mt-1 h-1.5 w-16" />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PerformanceHistory;
