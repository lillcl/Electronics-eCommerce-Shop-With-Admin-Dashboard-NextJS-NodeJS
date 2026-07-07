import type { Product, ProductImage } from "@/lib/supabase/types";

export interface ProductWithRelations extends Product {
  category: { id: string; name: string } | null;
  merchant: { id: string; name: string } | null;
  product_images: Pick<ProductImage, "id" | "image">[];
}

/** camelCase shape consumed by the storefront UI components. */
export interface ProductForUi {
  id: string;
  slug: string;
  title: string;
  mainImage: string;
  price: number;
  rating: number;
  description: string;
  manufacturer: string;
  inStock: number;
  categoryId: string;
  category: { id: string; name: string } | null;
  merchant: { id: string; name: string } | null;
  images: { imageID: string; image: string }[];
}

export function resolveImageSrc(src: string | null): string | null {
  if (!src) return null;
  return /^https?:\/\//.test(src) ? src : `/${src}`;
}

export function toUiProduct(p: ProductWithRelations): ProductForUi {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    mainImage: resolveImageSrc(p.main_image) ?? "/product_placeholder.jpg",
    price: p.price,
    rating: p.rating,
    description: p.description,
    manufacturer: p.manufacturer,
    inStock: p.in_stock,
    categoryId: p.category_id ?? "",
    category: p.category ?? null,
    merchant: p.merchant ?? null,
    images: (p.product_images ?? []).map((img) => ({
      imageID: img.id,
      image: resolveImageSrc(img.image) ?? "",
    })),
  };
}
