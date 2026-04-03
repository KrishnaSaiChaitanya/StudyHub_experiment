import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { sendEmail, getSubmissionReceivedEmail, getSubmissionStatusEmail } from "@/utils/email";

export async function POST(req: Request) {
  try {
    const { userId, type, title, feedback } = await req.json();

    if (!userId || !type || !title) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !userData?.user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = userData.user.email;
    const fullName = userData.user.user_metadata?.full_name || email?.split("@")[0] || "Student";

    if (!email) {
        return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    let result;
    if (type === "received") {
        result = await sendEmail({
            to: email,
            subject: `Submission Received: ${title}`,
            html: getSubmissionReceivedEmail(fullName, title),
        });
    } else if (type === "approved" || type === "rejected") {
        result = await sendEmail({
            to: email,
            subject: `Update on your submission: ${title}`,
            html: getSubmissionStatusEmail(fullName, title, type as "approved" | "rejected", feedback),
        });
    } else {
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
    }

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error: any) {
    console.error("API error for email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
