"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useState } from "react";
import { SubscriptionProvider } from "./SubscriptionProvider";
import { StudentTypeProvider } from "./StudentTypeProvider";
import { StudyTimerProvider } from "./StudyTimerProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SubscriptionProvider>
          <StudentTypeProvider>
            <StudyTimerProvider>
              {children}
            </StudyTimerProvider>
            <Toaster />
            <Sonner />
          </StudentTypeProvider>
        </SubscriptionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
