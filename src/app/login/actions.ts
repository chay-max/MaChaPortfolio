"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { allowedOwner } from "@/lib/validation";
export async function login(_previous: { error: string }, form: FormData) {
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  if (!email || !password || email.length > 254 || password.length > 512)
    return { error: "Isi email dan kata sandi dengan benar." };
  const db = await createClient();
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error || !data.user)
    return { error: "Email atau kata sandi tidak cocok. Coba lagi." };
  if (!allowedOwner(data.user.id, process.env.OWNER_USER_ID)) {
    await db.auth.signOut();
    return { error: "Akun ini tidak memiliki akses pemilik." };
  }
  redirect("/dashboard");
}
