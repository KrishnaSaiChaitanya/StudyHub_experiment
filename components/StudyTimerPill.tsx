"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Play, Pause } from "lucide-react";
import { useStudyTimer } from "./StudyTimerProvider";
import { getSubjectColor } from "@/utils/subjects";

export const StudyTimerPill = () => {
  const { seconds, running, activeSubject } = useStudyTimer();
  const router = useRouter();
  const pathname = usePathname();

  // Don't show pill on the progress page itself? 
  // Actually, the user said "show and pill on every page of websie in top right corner"
  // but if they are already on the page, maybe it's redundant but let's stick to "every page".
  // Wait, "if clicked on it should redirect the /study/progress page"
  // If we're already there, it's fine.

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const subjectColor = activeSubject ? getSubjectColor(activeSubject) : "hsl(var(--accent))";

  if (seconds === 0 && !running) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: 20 }}
        className="flex items-center gap-2 fixed bottom-6 right-4 z-100 "
      >
       
        <button
          onClick={() => router.push("/study/progress")}
          className="group relative flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 backdrop-blur-md transition-all hover:bg-card hover:shadow-md"
          title="Go to Study Progress"
        >
          <div 
            className="flex h-5 w-5 items-center justify-center rounded-full"
            style={{ backgroundColor: `${subjectColor}20` }}
          >
            {running ? (
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               >
                 <Clock className="h-3 w-3" style={{ color: subjectColor }} />
               </motion.div>
            ) : (
              <Pause className="h-3 w-3" style={{ color: subjectColor }} />
            )}
          </div>
          <span className="text-xs font-mono font-bold text-foreground">
            {formatTime(seconds)}
          </span>
          {activeSubject && (
            <span 
              className="text-[10px] font-semibold text-muted-foreground transition-colors group-hover:text-foreground"
            >
              {activeSubject.toUpperCase().slice(0, 3)}
            </span>
          )}
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
