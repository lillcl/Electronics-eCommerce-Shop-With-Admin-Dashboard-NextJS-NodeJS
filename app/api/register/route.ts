/**
 * Backwards-compatible JSON registration endpoint.
 * Real signup now happens client-side via supabase.auth.signUp().
 * This endpoint is kept for any external client still calling /api/register.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let body: { email?: string; password?: string; name?: string; lastname?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password;
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: [body.name, body.lastname].filter(Boolean).join(" ").trim() || null,
      },
    },
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ message: "User registered successfully", userId: data.user?.id });
}
