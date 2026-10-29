import { z } from "zod";
export const safeUrl = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (v) => !v || /^https:\/\//i.test(v),
    "Gunakan URL https:// yang valid.",
  )
  .refine((v) => !v || URL.canParse(v), "URL tidak valid.");
export const imageUrl = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (v) =>
      /^\/images\/[a-zA-Z0-9_.-]+$/.test(v) ||
      (/^https:\/\//i.test(v) && URL.canParse(v)),
    "Gunakan URL gambar HTTPS atau /images/nama-file.",
  );
export const profileSchema = z.object({
  full_name: z.string().trim().min(3).max(100),
  headline: z.string().trim().min(3).max(160),
  intro: z.string().trim().max(400),
  bio: z.string().trim().max(3000),
  location: z.string().trim().max(100),
  learning: z.array(z.string().trim().min(1).max(40)).max(12),
  photo_url: imageUrl,
  photo_is_demo: z.boolean(),
  email: z.union([z.literal(""), z.email()]),
  github_url: safeUrl,
  instagram_url: safeUrl,
  availability: z.string().trim().max(120),
});
export const projectSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(100),
  title: z.string().trim().min(2).max(120),
  summary: z.string().trim().min(5).max(300),
  description: z.string().trim().max(10000),
  role: z.string().trim().max(100),
  year: z.number().int().min(2000).max(2100),
  tags: z.array(z.string().trim().min(1).max(40)).max(12),
  cover_url: imageUrl,
  cover_is_concept: z.boolean(),
  live_url: safeUrl,
  source_url: safeUrl,
  status: z.enum(["draft", "published"]),
  sort_order: z.number().int().min(0).max(9999),
});
export function allowedOwner(userId: string, ownerId: string | undefined) {
  return Boolean(ownerId && userId === ownerId);
}
