"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Megaphone, ExternalLink, ArrowRight, Loader2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { renderHtmlPreview } from "@/lib/utils";

interface DBNotification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: string;
  reference_id: string | null;
  metadata: {
    post_id?: string;
    post_title?: string;
    author_name?: string;
    summary?: string;
    url?: string;
    tag?: string;
    date?: string;
  };
  is_viewed: boolean;
  created_at: string;
}

const tagColors: Record<string, string> = {
  "Exam Schedule": "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  "Syllabus": "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  "Registration": "bg-green-500/10 text-green-400 border border-green-500/20",
  "Event": "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  "Results": "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  "Study Material": "bg-teal-500/10 text-teal-400 border border-teal-500/20",
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const NotificationsPreview = () => {
  const [tab, setTab] = useState<"replies" | "announcements">("replies");
  const [userId, setUserId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<DBNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const fetchNotifications = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user || !active) return;
      setUserId(user.id);

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_viewed", false)
        .order("created_at", { ascending: false });

      if (!error && data && active) {
        setNotifications(data as DBNotification[]);
      }
      setLoading(false);
    };

    fetchNotifications();

    return () => {
      active = false;
    };
  }, []);

  // Real-time subscription to keep dashboard card updated
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`realtime:notifications_preview:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newNotif = payload.new as DBNotification;
            if (!newNotif.is_viewed) {
              setNotifications((prev) => [newNotif, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedNotif = payload.new as DBNotification;
            if (updatedNotif.is_viewed) {
              setNotifications((prev) => prev.filter((n) => n.id !== updatedNotif.id));
            }
          } else if (payload.eventType === "DELETE") {
            const { data } = await supabase
              .from("notifications")
              .select("*")
              .eq("user_id", userId)
              .eq("is_viewed", false)
              .order("created_at", { ascending: false });
            if (data) {
              setNotifications(data as DBNotification[]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const replies = useMemo(() => {
    return notifications.filter((n) => n.type === "reply").slice(0, 3);
  }, [notifications]);

  const announcementsList = useMemo(() => {
    return notifications.filter((n) => n.type === "announcement").slice(0, 3);
  }, [notifications]);

  const markAsViewed = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    setNotifications((prev) => prev.filter((n) => n.id !== id));

    await supabase
      .from("notifications")
      .update({ is_viewed: true })
      .eq("id", id);
  };

  const handleNotificationClick = async (notif: DBNotification) => {
    await markAsViewed(notif.id);
    if (notif.type === "reply") {
      router.push("/community");
    } else if (notif.type === "announcement" && notif.metadata.url) {
      window.open(notif.metadata.url, "_blank", "noopener,noreferrer");
    } else {
      router.push("/study");
    }
  };

  return (
    <Card className="border-border h-full bg-card shadow-sm rounded-xl overflow-hidden">
      <CardContent className="flex h-full flex-col p-0">
        {/* Header / tabs */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-secondary/20">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Notifications
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setTab("replies")}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                tab === "replies"
                  ? "bg-accent/10 text-accent font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              <MessageCircle className="h-3 w-3" /> Replies
            </button>
            <button
              onClick={() => setTab("announcements")}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                tab === "announcements"
                  ? "bg-accent/10 text-accent font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              <Megaphone className="h-3 w-3" /> Updates
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto min-h-[160px]">
          {loading ? (
            <div className="flex h-[160px] items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-accent" />
            </div>
          ) : tab === "replies" ? (
            replies.length === 0 ? (
              <div className="flex h-[160px] flex-col items-center justify-center text-muted-foreground/60">
                <MessageCircle className="h-7 w-7 mb-1.5 opacity-40" />
                <p className="text-[11px]">No new replies</p>
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {replies.map((r, i) => (
                  <motion.li
                    key={r.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleNotificationClick(r)}
                    className="cursor-pointer px-4 py-2.5 transition-colors hover:bg-secondary/40 flex items-start gap-2 group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-normal">
                        <span className="font-semibold">{r.metadata.author_name || "Someone"}</span>
                        <span className="text-muted-foreground"> replied to </span>
                        <span className="font-medium">"{r.metadata.post_title}"</span>
                      </p>
                      <div 
                        className="mt-0.5 text-xs text-muted-foreground line-clamp-1 [&_p]:inline [&_p]:m-0 [&_p]:after:content-['\00a0'] [&_ul]:inline [&_ol]:inline [&_li]:inline"
                        dangerouslySetInnerHTML={{ __html: renderHtmlPreview(r.content) }}
                      />
                      <p className="mt-0.5 text-[10px] text-muted-foreground/80">{timeAgo(r.created_at)}</p>
                    </div>
                    <button
                      onClick={(e) => markAsViewed(r.id, e)}
                      className="opacity-0 group-hover:opacity-100 flex items-center justify-center h-5 w-5 rounded hover:bg-accent/15 hover:text-accent text-muted-foreground transition-all shrink-0"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  </motion.li>
                ))}
              </ul>
            )
          ) : announcementsList.length === 0 ? (
            <div className="flex h-[160px] flex-col items-center justify-center text-muted-foreground/60">
              <Megaphone className="h-7 w-7 mb-1.5 opacity-40" />
              <p className="text-[11px]">No new updates</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {announcementsList.map((a, i) => (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleNotificationClick(a)}
                  className="cursor-pointer px-4 py-2.5 transition-colors hover:bg-secondary/40 flex items-start gap-2 group"
                >
                  <div className="flex-1 min-w-0">
                    {a.metadata.tag && (
                      <span
                        className={`inline-block rounded-full px-1.5 py-0.5 text-[9px] font-medium leading-none mb-1 ${
                          tagColors[a.metadata.tag] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {a.metadata.tag}
                      </span>
                    )}
                    <p className="text-xs font-semibold text-foreground line-clamp-1">
                      {a.title}
                    </p>
                    {a.metadata.summary && (
                      <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                        {a.metadata.summary}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-accent transition-colors" />
                    <button
                      onClick={(e) => markAsViewed(a.id, e)}
                      className="opacity-0 group-hover:opacity-100 flex items-center justify-center h-5 w-5 rounded hover:bg-accent/15 hover:text-accent text-muted-foreground transition-all"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <button
          onClick={() => router.push(tab === "replies" ? "/study/announcements" : "/community/forum")}
          className="flex items-center justify-center gap-1 border-t border-border px-4 py-2 text-[11px] font-medium text-accent hover:bg-accent/5 transition-colors w-full bg-secondary/10"
        >
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </CardContent>
    </Card>
  );
};

export default NotificationsPreview;
