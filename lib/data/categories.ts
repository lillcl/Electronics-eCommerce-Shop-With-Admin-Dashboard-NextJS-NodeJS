import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Category } from "@/lib/supabase/types";

export async function listCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createCategory(name: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("categories")
    .insert({ name })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Category;
}

export async function deleteCategory(id: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
