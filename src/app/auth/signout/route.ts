import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return new Response("Forbidden", { status: 403 });
  const db = await createClient();
  await db.auth.signOut();
  return NextResponse.redirect(new URL("/login", request.url), 303);
}
