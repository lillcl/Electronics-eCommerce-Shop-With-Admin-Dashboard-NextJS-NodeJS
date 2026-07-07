"use client";

import { AuthProvider } from "@/components/AuthProvider";

/**
 * Backwards-compatible alias for the old NextAuth SessionProvider.
 * Wrap your app in <SessionProvider> (or now <AuthProvider>) to enable auth state.
 */
export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
