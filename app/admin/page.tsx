"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function DashboardOverview() {
  const [counts, setCounts] = useState({ planners: 0, tests: 0, faculty: 0 });
  const supabase = createClient();

  useEffect(() => {
    async function fetchCounts() {
      const [pRes, tRes, fRes] = await Promise.all([
        supabase.from('study_planners').select('*', { count: 'exact', head: true }),
        supabase.from('tests').select('*', { count: 'exact', head: true }),
        supabase.from('faculty').select('*', { count: 'exact', head: true })
      ]);
      setCounts({
        planners: pRes.count || 0,
        tests: tRes.count || 0,
        faculty: fRes.count || 0
      });
    }
    fetchCounts();
  }, []);

  return (
   <div>
  {/* Header Section with Redirect Button */}
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-bold text-foreground tracking-tight">Overview</h1>
      <p className="text-muted-foreground text-lg">
        Welcome to the StudyHub admin dashboard. Manage content and users here.
      </p>
    </div>

    <a
      href="/dashboard"
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-sm w-fit"
    >
      {/* Optional Icon for a professional look */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" height="18" 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
      Main Application
    </a>
  </div>

  {/* Stats Grid */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg text-foreground mb-2">Study Planners</h3>
      <p className="text-4xl font-bold text-primary mb-1">{counts.planners}</p>
      <p className="text-sm text-muted-foreground">Total planners available</p>
    </div>

    <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg text-foreground mb-2">Tests & MCQs</h3>
      <p className="text-4xl font-bold text-blue-500 mb-1">{counts.tests}</p>
      <p className="text-sm text-muted-foreground">Active mock tests</p>
    </div>

    <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg text-foreground mb-2">Faculty</h3>
      <p className="text-4xl font-bold text-green-500 mb-1">{counts.faculty}</p>
      <p className="text-sm text-muted-foreground">Registered faculty members</p>
    </div>
  </div>
</div>
  );
}
