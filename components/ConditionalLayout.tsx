"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { StudyTimerPill } from "@/components/StudyTimerPill";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isComingSoon = pathname === "/comming-soon";

  return (
    <div className="w-full flex flex-col min-h-screen">
      {!isComingSoon && <Navbar />}
      <div className="flex-1 w-full flex flex-col">
        {children}
      </div>
      {!isComingSoon && <StudyTimerPill />}
    </div>
  );
}
