import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TipTapEditor } from "./TipTapEditor";

const CATEGORIES = ["Doubt", "Discussion", "Resource", "Articleship", "Exam Tips"];
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

export const CreatePost = ({ onBack, onSuccess, userId }: { onBack: () => void, onSuccess: () => void, userId: string | null }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Discussion");
  const [posting, setPosting] = useState(false);

  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Max 5MB allowed", variant: "destructive" });
      return null;
    }
    const effectiveUserId = userId || DEMO_USER_ID;
    const ext = file.name.split(".").pop();
    const path = `${effectiveUserId}/${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("forum-images").upload(path, file);
    if (uploadErr) {
      toast({ title: "Image upload failed", description: uploadErr.message, variant: "destructive" });
      return null;
    }
    const { data: urlData } = supabase.storage.from("forum-images").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleCreatePost = async () => {
    const effectiveUserId = userId || DEMO_USER_ID;
    if (!newTitle.trim() || !newContent.trim() || newContent === "<p></p>") {
      toast({ title: "Missing fields", description: "Title and content are required.", variant: "destructive" });
      return;
    }

    setPosting(true);
    const { error } = await supabase.from("forum_posts").insert({
      user_id: effectiveUserId,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
    });

    if (error) {
      toast({ title: "Failed to create post", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post created!" });
      onSuccess();
    }
    setPosting(false);
  };

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-1.5 text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Forum
      </Button>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-bold text-card-foreground mb-6">Create a Post</h2>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Badge
                  key={c}
                  variant={newCategory === c ? "default" : "secondary"}
                  className={`cursor-pointer text-xs px-3 py-1 ${newCategory === c ? "bg-accent text-accent-foreground hover:bg-accent/90" : "hover:bg-secondary/80"}`}
                  onClick={() => setNewCategory(c)}
                >
                  {c}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Title</label>
            <Input placeholder="Enter a descriptive title..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="h-11" />
          </div>
          
          <div>
            <label className="text-sm font-semibold mb-2 block">Content</label>
            <TipTapEditor content={newContent} onChange={setNewContent} onImageUpload={handleImageUpload} />
          </div>

          <div className="flex justify-end pt-4">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleCreatePost} disabled={posting}>
              {posting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {posting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
