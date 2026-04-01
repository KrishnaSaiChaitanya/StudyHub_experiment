import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      plan_id: requestedPlanId,
    } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET!;

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_payment_id + "|" + razorpay_subscription_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    const plan_id = requestedPlanId || process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID;
    const plan_name = body.plan_name || "Pro Plan";

    let expiry_date = null;
    if (plan_name.toLowerCase().includes("monthly")) {
      expiry_date = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString();
    } else if (plan_name.toLowerCase().includes("annual")) {
      expiry_date = new Date(Date.now() + 366 * 24 * 60 * 60 * 1000).toISOString();
    } else if (plan_name.toLowerCase().includes("attempt")) {
      // Fetch latest exam date
      const { data: examData } = await supabase
        .from("exam_date")
        .select("last_exam_date")
        .order("last_exam_date", { ascending: false })
        .limit(1)
        .single();
      
      if (examData?.last_exam_date) {
        expiry_date = new Date(examData.last_exam_date).toISOString();
      }
    }

    // Signature is valid, update Supabase
    const { error } = await supabase.from("subscriptions").upsert({
      id: user.id,
      razorpay_subscription_id,
      status: "active",
      plan_id: plan_id,
      plan_name,
      expiry_date,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json(
        { error: "Failed to update subscription status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
