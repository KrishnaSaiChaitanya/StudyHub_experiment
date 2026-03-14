import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Target, Clock, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const mockHistory = [
  { id: 1, date: "2026-03-08", subject: "Accounting", score: 8, total: 10, timeTaken: "22:14", percentage: 80 },
  { id: 2, date: "2026-03-05", subject: "Taxation", score: 6, total: 10, timeTaken: "28:45", percentage: 60 },
  { id: 3, date: "2026-03-01", subject: "Auditing", score: 9, total: 10, timeTaken: "18:30", percentage: 90 },
  { id: 4, date: "2026-02-25", subject: "Company Law", score: 7, total: 10, timeTaken: "25:10", percentage: 70 },
  { id: 5, date: "2026-02-20", subject: "Accounting", score: 5, total: 10, timeTaken: "29:50", percentage: 50 },
  { id: 6, date: "2026-02-15", subject: "Taxation", score: 8, total: 10, timeTaken: "20:05", percentage: 80 },
];

interface PerformanceHistoryProps {
  onBack: () => void;
}

const PerformanceHistory = ({ onBack }: PerformanceHistoryProps) => {
  const totalTests = mockHistory.length;
  const avgScore = Math.round(mockHistory.reduce((a, t) => a + t.percentage, 0) / totalTests);
  const bestScore = Math.max(...mockHistory.map((t) => t.percentage));
  const totalTime = mockHistory.reduce((a, t) => {
    const [m, s] = t.timeTaken.split(":").map(Number);
    return a + m * 60 + s;
  }, 0);
  const avgTime = Math.round(totalTime / totalTests / 60);

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
            { icon: Clock, label: "Avg Time", value: `${avgTime} min` },
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

        {/* Score trend */}
        <Card className="mt-6 border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">Score Trend</h3>
          <div className="mt-4 flex items-end gap-2" style={{ height: 120 }}>
            {mockHistory.slice().reverse().map((test, i) => (
              <motion.div
                key={test.id}
                initial={{ height: 0 }}
                animate={{ height: `${test.percentage}%` }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group relative flex-1 cursor-pointer rounded-t-md bg-accent/20 transition-colors hover:bg-accent/40"
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  {test.percentage}%
                </div>
                <div className="absolute bottom-0 left-0 right-0 rounded-t-md bg-accent" style={{ height: `${test.percentage}%` }} />
              </motion.div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            {mockHistory.slice().reverse().map((test) => (
              <p key={test.id} className="flex-1 text-center text-[9px] text-muted-foreground">
                {new Date(test.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
              </p>
            ))}
          </div>
        </Card>

        {/* Test history */}
        <h3 className="mt-8 text-sm font-semibold text-foreground">Test History</h3>
        <div className="mt-3 space-y-2">
          {mockHistory.map((test, i) => {
            const badge = getScoreBadge(test.percentage);
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
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-foreground">{test.subject}</h4>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(test.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {test.timeTaken}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getScoreColor(test.percentage)}`}>
                        {test.score}/{test.total}
                      </p>
                      <Progress value={test.percentage} className="mt-1 h-1 w-16" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceHistory;
