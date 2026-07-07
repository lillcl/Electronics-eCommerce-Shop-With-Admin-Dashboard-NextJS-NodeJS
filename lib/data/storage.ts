import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProductImage } from "@/lib/supabase/types";

const BUCKET = "product-images";

/**
 * Upload a product image to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadProductImage(
  file: File | Blob,
  filename: string
): Promise<string> {
  const admin = createAdminClient();
  const path = `${Date.now()}-${filename}`;
  const { error } = await admin.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, contentType: (file as File).type ?? "image/jpeg" });
  if (error) throw new Error(error.message);

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProductImage(path: string) {
  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}

export async function attachImageToProduct(
  productId: string,
  imageUrl: string
): Promise<ProductImage> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("product_images")
    .insert({ product_id: productId, image: imageUrl })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as ProductImage;
}
