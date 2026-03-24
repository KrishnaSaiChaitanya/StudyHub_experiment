import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import { BookmarkItem, DbNote } from "./types";
import { redirect } from "next/navigation";

const BookmarksClient = dynamic(() => import("./BookmarksClient"), { ssr: true });

const formatSubjectName = (subject: string) => {
  if (!subject) return "";
  return subject.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export default async function BookmarksPage() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {}
        },
      },
      global: {
        fetch: (url, options) => fetch(url, { ...options, cache: "no-store", next: { revalidate: 0 } }),
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch Notes
  const { data: notesData } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  // Fetch Bookmarks (Join with Planners and Practice Papers)
  const { data: bookmarksData } = await supabase
    .from("user_bookmarks")
    .select(`
      id,
      created_at,
      study_planners ( title, category ),
      practice_papers ( title, subject, type )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const formattedBookmarks: BookmarkItem[] = (bookmarksData || []).map((b: any) => {
    if (b.study_planners) {
      return {
        id: b.id,
        title: b.study_planners.title,
        type: "pdf" as const,
        source: formatSubjectName(b.study_planners.category),
        savedAt: new Date(b.created_at).toISOString().split('T')[0]
      };
    } else if (b.practice_papers) {
      return {
        id: b.id,
        title: b.practice_papers.title,
        type: b.practice_papers.type,
        source: formatSubjectName(b.practice_papers.subject),
        savedAt: new Date(b.created_at).toISOString().split('T')[0]
      };
    }
    return null;
  }).filter(Boolean) as BookmarkItem[];

  return (
    <BookmarksClient 
      initialNotes={notesData || []} 
      initialBookmarks={formattedBookmarks} 
      userId={user.id} 
    />
  );
}