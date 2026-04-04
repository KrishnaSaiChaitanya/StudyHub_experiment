"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SubjectCategory } from "@/utils/supabase/types";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useStudent } from "./StudentTypeProvider";

interface StudyTimerContextType {
  seconds: number;
  running: boolean;
  activeSubject: SubjectCategory | null;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setActiveSubject: (subject: SubjectCategory) => void;
  saveSession: () => Promise<boolean>;
  isSaving: boolean;
}

const StudyTimerContext = createContext<StudyTimerContextType | undefined>(undefined);

export const useStudyTimer = () => {
  const context = useContext(StudyTimerContext);
  if (!context) {
    throw new Error("useStudyTimer must be used within a StudyTimerProvider");
  }
  return context;
};

export const StudyTimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [activeSubject, setActiveSubjectState] = useState<SubjectCategory | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { subjects } = useStudent();
  const { toast } = useToast();
  const supabase = createClient();

  // Load from localStorage on mount
  useEffect(() => {
    const savedSeconds = localStorage.getItem("studyTimer_seconds");
    const savedRunning = localStorage.getItem("studyTimer_running");
    const savedSubject = localStorage.getItem("studyTimer_activeSubject");
    const savedTime = localStorage.getItem("studyTimer_lastSavedTime");

    if (savedSeconds) {
      let secs = parseInt(savedSeconds, 10);
      
      // Calculate elapsed time if it was running before reload for accuracy
      if (savedRunning === "true" && savedTime) {
         const elapsed = Math.floor((Date.now() - parseInt(savedTime, 10)) / 1000);
         secs += elapsed;
      }
      setSeconds(secs);
    }
    
    if (savedSubject) setActiveSubjectState(savedSubject as SubjectCategory);
    
    // Always start in paused state on page reload as requested
    setRunning(false);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("studyTimer_seconds", seconds.toString());
    localStorage.setItem("studyTimer_running", running.toString());
    if (activeSubject) localStorage.setItem("studyTimer_activeSubject", activeSubject);
    localStorage.setItem("studyTimer_lastSavedTime", Date.now().toString());
  }, [seconds, running, activeSubject]);

  // Set default subject if none selected
  useEffect(() => {
    if (subjects.length > 0 && !activeSubject) {
      setActiveSubjectState(subjects[0]);
    } else if (subjects.length > 0 && activeSubject && !subjects.includes(activeSubject)) {
      setActiveSubjectState(subjects[0]);
    }
  }, [subjects, activeSubject]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (running) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const startTimer = useCallback(() => setRunning(true), []);
  const pauseTimer = useCallback(() => setRunning(false), []);
  const resetTimer = useCallback(() => {
    setRunning(false);
    setSeconds(0);
  }, []);

  const setActiveSubject = useCallback((subject: SubjectCategory) => {
    if (!running) {
      setSeconds(0); // If user changes subject while not running, reset timer
    }
    setActiveSubjectState(subject);
  }, [running]);

  const saveSession = useCallback(async () => {
    if (seconds === 0 || !activeSubject) return false;
    
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({ title: "Please sign in to save your progress", variant: "destructive" });
      setIsSaving(false);
      return false;
    }

    const { error } = await supabase.from('study_sessions').insert({
      user_id: user.id,
      category: activeSubject,
      duration_seconds: seconds
    });

    if (error) {
      toast({ title: "Failed to save session", variant: "destructive" });
      setIsSaving(false);
      return false;
    }

    toast({ title: "Session saved successfully!" });
    setSeconds(0);
    setRunning(false);
    setIsSaving(false);
    return true;
  }, [seconds, activeSubject, supabase, toast]);

  return (
    <StudyTimerContext.Provider
      value={{
        seconds,
        running,
        activeSubject,
        startTimer,
        pauseTimer,
        resetTimer,
        setActiveSubject,
        saveSession,
        isSaving,
      }}
    >
      {children}
    </StudyTimerContext.Provider>
  );
};
