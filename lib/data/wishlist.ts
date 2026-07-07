"use client";

import { createClient } from "@/lib/supabase/client";
import type { Wishlist } from "@/lib/supabase/types";

export async function listWishlist(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("wishlists")
    .select(
      "id, product:products(*, category:categories(id, name), merchant:merchants(id, name), product_images(id, image))"
    )
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addToWishlist(userId: string, productId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("wishlists")
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();
  if (error) {
    if (error.code === "23505") return { data: null, error: null };
    throw new Error(error.message);
  }
  return { data: data as Wishlist, error: null };
}

export async function removeFromWishlist(userId: string, productId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
  if (error) throw new Error(error.message);
}
