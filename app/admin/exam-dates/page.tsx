"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarDays, Save, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type ExamDate = {
  id: string;
  level: 'foundation' | 'intermediate' | 'final';
  exam_date: string;
};

export default function ExamDatesAdmin() {
  const [dates, setDates] = useState<ExamDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const supabase = createClient();

  const [inputDates, setInputDates] = useState<Record<string, string>>({});

  async function fetchDates() {
    setLoading(true);
    const { data, error } = await supabase
      .from('exam_dates')
      .select('*')
      .order('level');
    
    if (error) {
      console.error(error);
      toast.error("Failed to fetch exam dates");
    } else {
      setDates(data || []);
      const dateMap: Record<string, string> = {};
      data?.forEach(d => {
        dateMap[d.level] = d.exam_date;
      });
      setInputDates(dateMap);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchDates();
  }, []);

  const handleUpdateDate = async (level: string) => {
    const newDate = inputDates[level];
    if (!newDate) return;

    setSaving(level);
    const { error } = await supabase
      .from('exam_dates')
      .upsert({ level, exam_date: newDate }, { onConflict: 'level' });

    if (error) {
      toast.error(`Failed to update ${level} date`);
    } else {
      toast.success(`Updated ${level} date successfully`);
      fetchDates();
    }
    setSaving(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Exam Dates</h1>
          <p className="text-muted-foreground mt-1">Manage official exam dates for all levels</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDates} disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
            <p className="text-sm font-medium text-muted-foreground">Fetching dates...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {['foundation', 'intermediate', 'final'].map((level) => {
            const dateStr = inputDates[level] || "";
            return (
              <Card key={level} className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 capitalize">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CalendarDays className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg leading-tight">{level}</CardTitle>
                      <CardDescription className="text-xs">Update countdown target</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exam Date</label>
                    <Input
                      type="date"
                      value={dateStr}
                      onChange={(e) => setInputDates(prev => ({ ...prev, [level]: e.target.value }))}
                      className="border-border focus:ring-primary h-11"
                    />
                  </div>
                  <Button 
                    className="w-full gap-2 font-semibold" 
                    variant="default"
                    disabled={saving === level}
                    onClick={() => handleUpdateDate(level)}
                  >
                    {saving === level ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
