import "server-only";
import { createClient as supabaseClient } from "@supabase/supabase-js";
import type { Profile, Project } from "./types";
// Anonymous client deliberately has no user cookies: public pages never receive drafts.
function publicClient() {
  return supabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
export async function getPublicContent() {
  const db = publicClient();
  const [profile, projects] = await Promise.all([
    db.from("profile").select("*").eq("id", 1).single(),
    db
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("sort_order"),
  ]);
  if (profile.error || projects.error)
    throw new Error("Portfolio content is temporarily unavailable.");
  return {
    profile: profile.data as Profile,
    projects: projects.data as Project[],
  };
}
