"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Check, X, Loader2, RefreshCw, FileText, ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { formatSubjectName } from "@/utils/subjects";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function CommunitySubmissionsAdmin() {
  const supabase = createClient();
  const { toast } = useToast();
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Feedback Dialog
  const [showReject, setShowReject] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [feedback, setFeedback] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/community-submissions');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch submissions");
      }
      
      setSubmissions(data || []);
    } catch (error: any) {
      toast({ title: "Error fetching submissions", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [supabase]);

  const handleApprove = async (sub: any) => {
    setProcessingId(sub.id);
    try {
      // 1. Insert into study_planners
      const { error: insertError } = await supabase.from('study_planners').insert({
        title: sub.title,
        category: sub.category,
        faculty_id: sub.faculty_id,
        planner_date: sub.planner_date,
        pdf_url: sub.pdf_url,
        is_community: true,
        uploader_id: sub.user_id,
        pages: sub.pages || 0,
      });

      if (insertError) throw insertError;

      // 2. Update submission status
      const { error: updateError } = await supabase
        .from('community_submissions')
        .update({ status: 'approved' })
        .eq('id', sub.id);

      if (updateError) throw updateError;

      // 3. Send approval email
      await fetch('/api/emails/submission', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: sub.user_id, 
          type: "approved", 
          title: sub.title 
        }),
      });

      toast({ title: "Submission approved!", description: "Material added to study library and user notified." });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error approving submission", description: error.message, variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedSub) return;
    setProcessingId(selectedSub.id);
    try {
      const { error } = await supabase
        .from('community_submissions')
        .update({ status: 'rejected', admin_feedback: feedback })
        .eq('id', selectedSub.id);

      if (error) throw error;

      // 2. Send rejection email
      await fetch('/api/emails/submission', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: selectedSub.user_id, 
          type: "rejected", 
          title: selectedSub.title,
          feedback: feedback
        }),
      });

      toast({ title: "Submission rejected", description: "User will see your feedback and will be notified via email." });
      setShowReject(false);
      setFeedback("");
      fetchData();
    } catch (error: any) {
      toast({ title: "Error rejecting submission", description: error.message, variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Library Submissions</h1>
          <p className="text-muted-foreground mt-1 text-sm">Review and approve user-contributed study materials</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchData} className="rounded-full shadow-sm">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-card/60 backdrop-blur-sm">
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Title</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Uploader</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold text-center">Material</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                       <div className="flex flex-col items-center gap-2">
                          <FileText className="h-10 w-10 opacity-20" />
                          <p>No submissions found to review.</p>
                       </div>
                    </TableCell>
                  </TableRow>
                )}
                {submissions.map(sub => (
                  <TableRow key={sub.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium">{sub.title}</TableCell>
                    <TableCell>
                       <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-background/50">
                          {formatSubjectName(sub.category as any)}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground italic">
                      {sub.uploader_name || 'Anonymous User'}
                    </TableCell>
                    <TableCell className="text-xs">{new Date(sub.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10">
                        <a href={sub.pdf_url} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={sub.status === 'approved' ? 'default' : sub.status === 'rejected' ? 'destructive' : 'outline'}
                        className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      >
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex gap-2 justify-end">
                        {sub.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => { setSelectedSub(sub); setShowReject(true); }}
                              className="h-8 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive transition-all"
                              disabled={processingId === sub.id}
                            >
                               {processingId === sub.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <X className="h-3 w-3 mr-1" />}
                               Reject
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(sub)}
                              className="h-8 bg-green-500 hover:bg-green-600 text-white shadow-sm transition-all"
                              disabled={processingId === sub.id}
                            >
                               {processingId === sub.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />}
                               Approve
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject "{selectedSub?.title}"? Provide feedback to let the user know why.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-semibold mb-2 block">Reason for rejection (Optional)</label>
            <Input 
              value={feedback} 
              onChange={e => setFeedback(e.target.value)} 
              placeholder="e.g., File is not clear or content is incorrect..." 
              className="h-12"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowReject(false)} className="h-11">Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={processingId === selectedSub?.id} className="h-11">
               {processingId === selectedSub?.id ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <X className="h-4 w-4 mr-1" />}
               Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
