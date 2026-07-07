import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

/**
 * Server-side admin gate. Redirects to /login if unauthenticated,
 * or to / if the user is not an admin. Returns the admin user.
 */
export async function requireAdmin() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.profile.role !== "admin") redirect("/");
  return me;
}

export async function isAdmin(): Promise<boolean> {
  const me = await getCurrentUser();
  return me?.profile.role === "admin";
}
