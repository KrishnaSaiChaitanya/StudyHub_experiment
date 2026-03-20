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
      <h1 className="text-3xl font-bold mb-2 text-foreground tracking-tight">Overview</h1>
      <p className="text-muted-foreground mb-8 text-lg">Welcome to the StudyHub admin dashboard. Manage content and users here.</p>

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
