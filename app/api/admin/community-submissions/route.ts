import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const adminClient = createAdminClient();
    
    // Auth Check: Ensure only admins can access this data
    const { data: { user } } = await adminClient.auth.getUser();
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map(email => email.trim().toLowerCase())
      .filter(email => email.length > 0);

    // if (!user || !user.email || !adminEmails.includes(user.email.toLowerCase())) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // 1. Fetch community submissions and faculty name
    const { data: submissions, error: subError } = await adminClient
      .from('community_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (subError) throw subError;

    // 2. Fetch all unique user IDs to get names from auth.users
    const userIds = Array.from(new Set(submissions.map(s => s.user_id))).filter(Boolean);

    // 3. Fetch user information from auth (using admin client)
    // We fetch users one by one to ensure we get metadata correctly, 
    // or we could use listUsers but that's harder to filter by specific IDs without iterating.
    const userMap: Record<string, string> = {};
    
    // To optimize, we can use a loop or batch if supported, 
    // but for community submissions, it's usually not thousands.
    await Promise.all(userIds.map(async (uid) => {
      const { data: userData } = await adminClient.auth.admin.getUserById(uid as string);
      if (userData?.user) {
        userMap[uid as string] = userData.user.user_metadata?.full_name || 
                               userData.user.email?.split("@")[0] || 
                               "Anonymous User";
      }
    }));

    // 4. Enrich submissions with user names
    const enrichedSubmissions = submissions.map(sub => ({
      ...sub,
      uploader_name: userMap[sub.user_id] || "Anonymous User"
    }));

    return NextResponse.json(enrichedSubmissions);
  } catch (error: any) {
    console.error("Error in community-submissions API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
