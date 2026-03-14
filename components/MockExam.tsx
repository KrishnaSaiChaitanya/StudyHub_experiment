import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const sampleQuestions = [
  { id: 1, question: "Which of the following is NOT a fundamental accounting assumption?", options: ["Going Concern", "Consistency", "Prudence", "Accrual"], correct: 2 },
  { id: 2, question: "Under which section of the Companies Act, 2013 is the appointment of auditors governed?", options: ["Section 139", "Section 143", "Section 148", "Section 152"], correct: 0 },
  { id: 3, question: "What is the maximum number of partners allowed in a banking firm?", options: ["10", "20", "50", "No limit"], correct: 0 },
  { id: 4, question: "Which standard deals with 'Revenue Recognition' under Ind AS?", options: ["Ind AS 18", "Ind AS 115", "Ind AS 12", "Ind AS 37"], correct: 1 },
  { id: 5, question: "The concept of 'Materiality' is primarily associated with which of the following?", options: ["Auditing", "Cost Accounting", "Tax Law", "Company Law"], correct: 0 },
  { id: 6, question: "What is the due date for filing GSTR-3B for regular taxpayers?", options: ["10th of next month", "20th of next month", "25th of next month", "Last day of next month"], correct: 1 },
  { id: 7, question: "Which of the following is a direct tax?", options: ["GST", "Custom Duty", "Income Tax", "Excise Duty"], correct: 2 },
  { id: 8, question: "What is the threshold limit for tax audit under Section 44AB for businesses?", options: ["₹1 Crore", "₹5 Crore", "₹10 Crore", "₹2 Crore"], correct: 0 },
  { id: 9, question: "Which committee recommended the introduction of GST in India?", options: ["Kelkar Committee", "Vijay Kelkar Committee", "Raja Chelliah Committee", "Asim Dasgupta Committee"], correct: 3 },
  { id: 10, question: "The term 'Window Dressing' in accounting refers to:", options: ["Cleaning the office", "Manipulating financial statements", "Preparing budgets", "Tax planning"], correct: 1 },
];

const EXAM_DURATION = 30 * 60; // 30 minutes

interface MockExamProps {
  onExit: () => void;
}

const MockExam = ({ onExit }: MockExamProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); setSubmitted(true); setShowResults(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  const formatTime = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }, []);

  const score = sampleQuestions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
  const answered = Object.keys(answers).length;
  const q = sampleQuestions[currentQ];

  const handleSubmit = () => { setSubmitted(true); setShowResults(true); };

  if (submitted && showResults) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container max-w-2xl py-12">
        <Card className="border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            {score >= 7 ? <CheckCircle2 className="h-8 w-8 text-accent" /> : <XCircle className="h-8 w-8 text-destructive" />}
          </div>
          <h2 className="text-2xl font-semibold text-card-foreground">Exam Complete</h2>
          <p className="mt-2 text-sm text-muted-foreground">Here's how you performed</p>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-2xl font-bold text-accent">{score}/{sampleQuestions.length}</p>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-2xl font-bold text-card-foreground">{answered}/{sampleQuestions.length}</p>
              <p className="text-xs text-muted-foreground">Attempted</p>
            </div>
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-2xl font-bold text-card-foreground">{formatTime(EXAM_DURATION - timeLeft)}</p>
              <p className="text-xs text-muted-foreground">Time Taken</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-left">
            {sampleQuestions.map((sq, i) => (
              <div key={sq.id} className={`rounded-lg border p-3 ${answers[i] === sq.correct ? "border-accent/30 bg-accent/5" : "border-destructive/30 bg-destructive/5"}`}>
                <p className="text-xs font-medium text-card-foreground">{i + 1}. {sq.question}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your answer: <span className={answers[i] === sq.correct ? "text-accent" : "text-destructive"}>{answers[i] !== undefined ? sq.options[answers[i]] : "Not answered"}</span>
                  {answers[i] !== sq.correct && <> · Correct: <span className="text-accent">{sq.options[sq.correct]}</span></>}
                </p>
              </div>
            ))}
          </div>
          <Button onClick={onExit} className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">Back to Practice</Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onExit} className="gap-1 text-xs text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Exit
        </Button>
        <div className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${timeLeft < 300 ? "border-destructive/50 text-destructive" : "border-border text-card-foreground"}`}>
          <Clock className="h-4 w-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Question {currentQ + 1} of {sampleQuestions.length}</span>
        <span>{answered} answered</span>
      </div>
      <Progress value={((currentQ + 1) / sampleQuestions.length) * 100} className="mb-6 h-1.5" />

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <Card className="border-border bg-card p-6">
            <p className="text-xs font-medium text-accent">Question {currentQ + 1}</p>
            <h3 className="mt-2 text-base font-semibold text-card-foreground leading-relaxed">{q.question}</h3>
            <RadioGroup
              className="mt-6 space-y-3"
              value={answers[currentQ]?.toString()}
              onValueChange={(v) => setAnswers({ ...answers, [currentQ]: parseInt(v) })}
            >
              {q.options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                    answers[currentQ] === i ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <RadioGroupItem value={i.toString()} />
                  <span className="text-sm text-card-foreground">{opt}</span>
                </label>
              ))}
            </RadioGroup>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" size="sm" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)} className="gap-1">
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        {currentQ === sampleQuestions.length - 1 ? (
          <Button size="sm" onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Submit Exam
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setCurrentQ(currentQ + 1)} className="gap-1">
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Question map */}
      <div className="mt-6 flex flex-wrap gap-2">
        {sampleQuestions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQ(i)}
            className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-all ${
              i === currentQ ? "bg-accent text-accent-foreground" : answers[i] !== undefined ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MockExam;
