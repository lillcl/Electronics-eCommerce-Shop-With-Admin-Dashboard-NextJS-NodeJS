import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/lib/supabase/types";
import {
  toUiProduct,
  resolveImageSrc,
  type ProductWithRelations,
  type ProductForUi,
} from "@/lib/data/product-adapter";

export { toUiProduct, resolveImageSrc };
export type { ProductWithRelations, ProductForUi };

export async function listProducts(options?: {
  search?: string;
  categoryId?: string;
  limit?: number;
}): Promise<ProductWithRelations[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      "*, category:categories(id, name), merchant:merchants(id, name), product_images(id, image)"
    )
    .order("created_at", { ascending: false });

  if (options?.search) {
    query = query.ilike("title", `%${options.search}%`);
  }
  if (options?.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as ProductWithRelations[];
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, category:categories(id, name), merchant:merchants(id, name), product_images(id, image)"
    )
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as ProductWithRelations;
}

export async function createProduct(
  payload: Omit<Product, "id" | "created_at" | "updated_at">
) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("products")
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Product;
}

export async function updateProduct(id: string, patch: Partial<Product>) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("products")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Product;
}

export async function deleteProduct(id: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
