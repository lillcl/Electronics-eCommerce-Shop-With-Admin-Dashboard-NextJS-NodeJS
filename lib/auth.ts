import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import type { Profile, UserRole } from "@/lib/supabase/types";

/**
 * Get the current authenticated user + profile, or null.
 * Safe to call from server components, server actions, and route handlers.
 */
export async function getCurrentUser(): Promise<
  { user: { id: string; email: string }; profile: Profile } | null
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) return null;
  return { user: { id: user.id, email: user.email! }, profile };
}

export async function requireUser() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  return me;
}

export async function requireAdmin() {
  const me = await requireUser();
  if (me.profile.role !== "admin") redirect("/");
  return me;
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: error.message };
  return { data };
}

export async function signUpWithPassword(
  email: string,
  password: string,
  fullName?: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName ?? null },
    },
  });
  if (error) return { error: error.message };
  return { data };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

/** Server-only: promote a user to admin by email. */
export async function setUserRoleByEmail(email: string, role: UserRole) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .update({ role })
    .eq("email", email)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
