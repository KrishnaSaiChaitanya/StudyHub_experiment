import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, MessageCircle, ArrowBigUp, ArrowBigDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Post, Profile } from "./types";

interface Props {
  userId: string;
  currentUserId: string | null;
  onBack: () => void;
  onPostClick: (post: Post) => void;
  onEditClick: (post: Post) => void;
}

export const UserProfile = ({ userId, currentUserId, onBack, onPostClick, onEditClick }: Props) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    setLoading(true);
    // Fetch profile
    const { data: profData } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", userId)
      .single();
    
    if (profData) {
      setProfile(profData as Profile);
    } else {
      setProfile({ full_name: "Anonymous" });
    }

    // Fetch posts by user
    const { data: postsData } = await supabase
      .from("forum_posts")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (postsData) {
      // Need to attach vote counts etc. For simplicity, just showing base posts.
      setPosts(postsData.map((p: any) => ({
        ...p,
        profiles: profData || { full_name: "Anonymous" },
        reply_count: 0, upvotes: 0, downvotes: 0, myVote: 0
      })) as Post[]);
    }
    setLoading(false);
  };

  const getInitials = (name: string | null) => (name ? name.slice(0, 2).toUpperCase() : "CA");
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 text-muted-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8">
        <Avatar className="h-24 w-24 border-4 border-accent/20">
          <AvatarFallback className="bg-secondary text-2xl">{getInitials(profile?.full_name || null)}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-card-foreground">{profile?.full_name || "Anonymous"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{posts.length} Posts</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">User's Posts</h3>
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">This user hasn't posted anything yet.</p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="cursor-pointer rounded-xl border border-border bg-card p-4 hover:border-accent/50 transition-colors flex justify-between items-center"
                >
                  <div className="flex-1 min-w-0" onClick={() => onPostClick(post)}>
                    <h3 className="text-sm font-semibold text-card-foreground truncate">{post.title}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(post.created_at)}</span>
                      <span className="rounded-full bg-secondary px-2 py-0.5">{post.category}</span>
                    </div>
                  </div>
                  {currentUserId === userId && (
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onEditClick(post); }}>
                      Edit
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
