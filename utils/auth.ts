import { getCurrentUser } from "@/lib/auth";

export async function isAdmin(): Promise<boolean> {
  const me = await getCurrentUser();
  return me?.profile.role === "admin";
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error("Admin access required");
  }
}
