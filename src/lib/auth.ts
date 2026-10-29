import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { allowedOwner } from "./validation";
export async function requireOwner() {
  const db = await createClient();
  const { data, error } = await db.auth.getUser();
  if (error || !data.user) redirect("/login");
  if (!allowedOwner(data.user.id, process.env.OWNER_USER_ID))
    redirect("/login?error=forbidden");
  const { data: owner, error: ownerError } = await db
    .from("portfolio_owner")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (ownerError || !owner) redirect("/login?error=forbidden");
  return { db, user: data.user };
}
