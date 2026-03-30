import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import { BookmarkItem, DbNote } from "./types";
import { redirect } from "next/navigation";
import type { StudentLevel } from "@/utils/supabase/types";
import { SUBJECT_MAPPING } from "@/utils/subjects";

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

  const { data: profileData } = await supabase
    .from("profiles")
    .select("student_type")
    .eq("id", user.id)
    .single();

  const studentType = profileData?.student_type as StudentLevel | null;
  const subjects = studentType ? SUBJECT_MAPPING[studentType] : SUBJECT_MAPPING.foundation;

  // Fetch Notes
  const { data: notesData } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  // Fetch Bookmarks (Join with Planners, Practice Papers, and Questions)
  const { data: bookmarksData } = await supabase
    .from("user_bookmarks")
    .select(`
      id,
      created_at,
      study_planners ( title, category, pdf_url ),
      practice_papers ( title, subject, type, pdf_url ),
      questions ( id, question_text, test_id, tests ( name, category ) )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const filteredBookmarksData = (bookmarksData || []).filter((b: any) => {
    if (b.study_planners?.category) {
      return subjects.includes(b.study_planners.category);
    }
    if (b.practice_papers?.subject) {
      return subjects.includes(b.practice_papers.subject);
    }
    if (b.questions?.tests?.category) {
      return subjects.includes(b.questions.tests.category);
    }
    return true;
  });

  const formattedBookmarks: BookmarkItem[] = filteredBookmarksData.map((b: any) => {
    if (b.study_planners) {
      return {
        id: b.id,
        title: b.study_planners.title,
        type: "pdf" as const,
        source: formatSubjectName(b.study_planners.category),
        savedAt: new Date(b.created_at).toISOString().split('T')[0],
        url: b.study_planners.pdf_url
      };
    } else if (b.practice_papers) {
      return {
        id: b.id,
        title: b.practice_papers.title,
        type: b.practice_papers.type as "rtp" | "pyq" | "mtp",
        source: formatSubjectName(b.practice_papers.subject),
        savedAt: new Date(b.created_at).toISOString().split('T')[0],
        url: b.practice_papers.pdf_url
      };
    } else if (b.questions) {
      const q = b.questions;
      return {
        id: b.id,
        title: q.question_text.substring(0, 60) + (q.question_text.length > 60 ? "..." : ""),
        type: "question" as const,
        source: q.tests ? `${q.tests.name} (${formatSubjectName(q.tests.category)})` : "Mock Test",
        savedAt: new Date(b.created_at).toISOString().split('T')[0],
        targetId: q.test_id
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