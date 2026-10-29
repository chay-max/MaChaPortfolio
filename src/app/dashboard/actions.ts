"use server";
import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import { profileSchema, projectSchema } from "@/lib/validation";
import { z } from "zod";
export async function saveProfile(payload: unknown) {
  const { db } = await requireOwner();
  const parsed = profileSchema.safeParse(payload);
  if (!parsed.success)
    return {
      error: parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("\n"),
    };
  const { error } = await db.from("profile").update(parsed.data).eq("id", 1);
  if (error)
    return {
      error:
        "Could not save your profile. Check your connection and try again.",
    };
  revalidatePath("/");
  return { success: "Profile saved successfully." };
}
export async function saveProject(id: string | null, payload: unknown) {
  const { db } = await requireOwner();
  const parsed = projectSchema.safeParse(payload);
  if (!parsed.success)
    return {
      error: parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("\n"),
    };
  if (id && !z.uuid().safeParse(id).success)
    return { error: "Invalid project ID." };
  const result = id
    ? await db.from("projects").update(parsed.data).eq("id", id)
    : await db.from("projects").insert(parsed.data);
  if (result.error)
    return {
      error:
        result.error.code === "23505"
          ? "Another project already uses this slug."
          : "Could not save the project. Check your connection and try again.",
    };
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/projects/${parsed.data.slug}`);
  return { success: "Project saved successfully." };
}
export async function archiveProject(id: string) {
  const { db } = await requireOwner();
  if (!z.uuid().safeParse(id).success) return { error: "Invalid project ID." };
  const { error } = await db
    .from("projects")
    .update({ status: "draft" })
    .eq("id", id);
  if (error) return { error: "Could not archive the project." };
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/projects/[slug]", "page");
  return { success: "Project moved to drafts." };
}
