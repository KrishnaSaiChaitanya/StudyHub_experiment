"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Loader2, CheckCircle, ArrowLeft, Send, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SUBJECT_MAPPING, formatSubjectName } from "@/utils/subjects";
import Link from "next/link";

export default function CommunityUploadPage() {
  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [facultyList, setFacultyList] = useState<any[]>([]);

  // Form State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [plannerDate, setPlannerDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const allSubjects = [
    ...SUBJECT_MAPPING.foundation,
    ...SUBJECT_MAPPING.intermediate,
    ...SUBJECT_MAPPING.final
  ];

  useEffect(() => {
    const fetchFaculty = async () => {
      const { data } = await supabase.from('faculty').select('id, name');
      if (data) setFacultyList(data);
    };
    fetchFaculty();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "Please select a PDF file", variant: "destructive" });
      return;
    }

    if (file.type !== 'application/pdf') {
      toast({ title: "Only PDF files are supported", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Failed to upload file');
      const { url } = await uploadRes.json();

      // 2. Save to Supabase
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { error } = await supabase.from('community_submissions').insert({
        user_id: userData.user.id,
        title,
        category: categoryId,
        faculty_id: facultyId || null,
        planner_date: plannerDate,
        pdf_url: url,
        status: 'pending'
      });

      if (error) throw error;

      // 3. Send confirmation email
      await fetch('/api/emails/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: userData.user.id, 
          type: "received", 
          title: title 
        }),
      });

      setSubmitted(true);
      toast({ title: "Submission successful!", description: "Your material has been sent for admin approval." });
    } catch (error: any) {
      toast({ title: "Error submitting material", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="text-center p-8 border-2 border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-primary animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold mb-4">Upload Completed!</CardTitle>
            <CardDescription className="text-base text-muted-foreground mb-8">
              Thank you for contributing to the community library. Your material is now under review and will be visible once approved by our admin team.
            </CardDescription>
            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/community">Back to Community</Link>
              </Button>
              <Button variant="outline" onClick={() => setSubmitted(false)} className="w-full">
                Upload Another
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
  <div className="max-w-3xl mx-auto">
    <div className="mb-8">
      <Link 
        href="/community" 
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Community
      </Link>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="border shadow-lg bg-card overflow-hidden">
        {/* Decorative Top Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
        
        <CardHeader className="text-center pb-8 pt-10">
          <div className="flex justify-center mb-5">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center rotate-3 transition-transform hover:rotate-6">
              <FileUp className="h-8 w-8 text-primary -rotate-3" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Community Library <span className="text-primary">Upload</span>
          </CardTitle>
          <CardDescription className="max-w-md mx-auto mt-3 text-base">
            Share your study materials, planners, and resources to help fellow aspirants succeed.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 sm:px-10 pb-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              
              {/* Title Input */}
              <div className="space-y-2.5">
                <label className="text-sm font-medium text-foreground">Title of Material</label>
                <Input 
                  required 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g., Accounts Revision Planner" 
                  className="h-11 bg-muted/40 transition-colors focus-visible:bg-background"
                />
              </div>

              {/* Category Select */}
              <div className="space-y-2.5">
                <label className="text-sm font-medium text-foreground">Subject / Category</label>
                <Select required value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="h-11 bg-muted/40 transition-colors focus:bg-background">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allSubjects.map(sub => (
                      <SelectItem key={sub} value={sub}>{formatSubjectName(sub as any)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Faculty Select */}
              <div className="space-y-2.5">
                <label className="text-sm font-medium text-foreground flex items-center justify-between">
                  Related Faculty <span className="text-xs text-muted-foreground font-normal">Optional</span>
                </label>
                <Select value={facultyId} onValueChange={setFacultyId}>
                  <SelectTrigger className="h-11 bg-muted/40 transition-colors focus:bg-background">
                    <SelectValue placeholder="Select Faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {facultyList.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Input */}
              <div className="space-y-2.5">
                <label className="text-sm font-medium text-foreground">Material Date</label>
                <Input 
                  required 
                  type="date" 
                  value={plannerDate} 
                  onChange={e => setPlannerDate(e.target.value)} 
                  className="h-11 bg-muted/40 transition-colors focus-visible:bg-background block w-full"
                />
              </div>

              {/* File Upload Dropzone */}
              <div className="col-span-1 sm:col-span-2 space-y-2.5 mt-2">
                <label className="text-sm font-medium text-foreground">PDF Document</label>
                <div 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className={`relative group flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl transition-all cursor-pointer overflow-hidden ${
                    file 
                      ? "border-primary/50 bg-primary/5 hover:bg-primary/10" 
                      : "border-muted-foreground/25 bg-muted/20 hover:bg-muted/40 hover:border-primary/40"
                  }`}
                >
                  {file ? (
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="p-3 bg-primary/10 rounded-full mb-1">
                         <FileCheck className="h-8 w-8 text-primary" /> 
                      </div>
                      <p className="text-sm font-semibold text-foreground truncate max-w-[250px] sm:max-w-xs">{file.name}</p>
                      <p className="text-xs text-muted-foreground">Click to change document</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="p-3 bg-background rounded-full shadow-sm mb-1 group-hover:scale-105 transition-transform duration-300">
                        <FileUp className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-primary">Click to upload</span>
                        <span className="text-muted-foreground"> or drag and drop</span>
                      </div>
                      <p className="text-xs text-muted-foreground/70">PDF documents up to 10MB</p>
                    </div>
                  )}
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    accept="application/pdf" 
                    className="hidden" 
                    onChange={e => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-4 space-y-4">
              <Button 
                type="submit" 
                size="lg"
                className="w-full h-12 text-base font-semibold group" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    Submit for Admin Approval 
                    <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                By submitting, you confirm this material does not violate copyright laws.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  </div>
</div>
  );
}
