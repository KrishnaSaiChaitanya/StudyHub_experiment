"use server";

import { createAdminClient } from "@/utils/supabase/admin";

export async function deleteFlashcardRequest(requestId: string) {
  const supabaseAdmin = createAdminClient();
  
  const { error } = await supabaseAdmin
    .from("flashcard_requests")
    .delete()
    .eq("id", requestId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
