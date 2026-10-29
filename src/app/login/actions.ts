"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { allowedOwner } from "@/lib/validation";
export async function login(_previous: { error: string }, form: FormData) {
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  if (!email || !password || email.length > 254 || password.length > 512)
    return { error: "Enter a valid email address and password." };
  const db = await createClient();
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error || !data.user)
    return { error: "Incorrect email or password. Please try again." };
  if (!allowedOwner(data.user.id, process.env.OWNER_USER_ID)) {
    await db.auth.signOut();
    return { error: "This account does not have owner access." };
  }
  redirect("/dashboard");
}
