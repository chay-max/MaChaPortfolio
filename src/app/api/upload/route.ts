import { createClient } from "@/lib/supabase/server";
import { allowedOwner } from "@/lib/validation";
import { NextResponse, type NextRequest } from "next/server";
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json(
      { error: "Permintaan tidak diizinkan." },
      { status: 403 },
    );
  const db = await createClient();
  const { data } = await db.auth.getUser();
  if (!data.user || !allowedOwner(data.user.id, process.env.OWNER_USER_ID))
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 6 * 1024 * 1024)
    return NextResponse.json(
      { error: "Ukuran maksimal 5 MB." },
      { status: 413 },
    );
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size > 5 * 1024 * 1024 || file.size < 12)
    return NextResponse.json(
      { error: "Pilih gambar hingga 5 MB." },
      { status: 400 },
    );
  const bytes = new Uint8Array(await file.arrayBuffer());
  let ext = "";
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) ext = "jpg";
  else if (
    bytes[0] === 137 &&
    bytes[1] === 80 &&
    bytes[2] === 78 &&
    bytes[3] === 71
  )
    ext = "png";
  else if (
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  )
    ext = "webp";
  if (!ext)
    return NextResponse.json(
      { error: "Gunakan JPEG, PNG, atau WebP." },
      { status: 400 },
    );
  const path = `${data.user.id}/${crypto.randomUUID()}.${ext}`;
  const { error } = await db.storage
    .from("portfolio")
    .upload(path, bytes, {
      contentType: ext === "jpg" ? "image/jpeg" : `image/${ext}`,
      upsert: false,
    });
  if (error)
    return NextResponse.json(
      { error: "Upload gagal. Pastikan akses Storage sudah aktif." },
      { status: 400 },
    );
  return NextResponse.json({
    url: db.storage.from("portfolio").getPublicUrl(path).data.publicUrl,
  });
}
