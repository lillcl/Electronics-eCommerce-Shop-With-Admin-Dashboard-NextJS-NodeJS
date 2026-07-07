"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/lib/supabase/types";

/** Hook to read the current user's notifications + unread count. */
export function useNotifications() {
  const { user } = useAuth();
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setNotifications((data ?? []) as Notification[]);
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { notifications, loading, refresh: fetch };
}

/** Hook for the unread count badge in the header. Polls every 30s. */
export function useUnreadCount() {
  const { user } = useAuth();
  const supabase = createClient();
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    setUnreadCount(count ?? 0);
  }, [user, supabase]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { unreadCount, refreshUnreadCount: refresh };
}
