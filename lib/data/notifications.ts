import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Notification, NotificationType, NotificationPriority } from "@/lib/supabase/types";

export async function listMyNotifications(userId: string): Promise<Notification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function markNotificationRead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  metadata?: Record<string, unknown>;
}

export async function createNotification(input: CreateNotificationInput) {
  const admin = createAdminClient();
  const { error } = await admin.from("notifications").insert({
    user_id: input.userId,
    title: input.title,
    message: input.message,
    type: input.type,
    priority: input.priority ?? "normal",
    metadata: input.metadata ?? null,
  });
  if (error) throw new Error(error.message);
}
