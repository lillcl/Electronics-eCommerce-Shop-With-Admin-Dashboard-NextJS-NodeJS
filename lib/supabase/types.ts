/**
 * Hand-written database types for the Singitronic schema.
 * For a real project, regenerate with:
 *   npx supabase gen types typescript --project-id YOUR-REF > lib/supabase/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "user" | "admin" | "merchant";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type NotificationType =
  | "order_update"
  | "payment_status"
  | "promotion"
  | "system_alert";
export type NotificationPriority = "low" | "normal" | "high" | "urgent";
export type BulkUploadStatus = "pending" | "completed" | "partial" | "failed";
export type BulkUploadItemStatus = "created" | "updated" | "error";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Merchant {
  id: string;
  name: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  main_image: string | null;
  price: number;
  rating: number;
  description: string;
  manufacturer: string;
  in_stock: number;
  category_id: string | null;
  merchant_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  company: string | null;
  address: string;
  apartment: string | null;
  postal_code: string | null;
  city: string;
  country: string;
  order_notice: string | null;
  status: OrderStatus;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  priority: NotificationPriority;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
}

export interface BulkUploadBatch {
  id: string;
  user_id: string | null;
  file_name: string | null;
  status: BulkUploadStatus;
  item_count: number;
  error_count: number;
  created_at: string;
}

export interface BulkUploadItem {
  id: string;
  batch_id: string;
  product_id: string | null;
  title: string;
  slug: string;
  price: number;
  manufacturer: string | null;
  description: string | null;
  main_image: string | null;
  category_id: string;
  in_stock: number;
  status: BulkUploadItemStatus;
  error: string | null;
}
