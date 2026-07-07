import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, OrderItem } from "@/lib/supabase/types";

export interface OrderWithItems extends Order {
  order_items: (OrderItem & {
    product: { id: string; title: string; main_image: string | null; price: number };
  })[];
}

export interface CreateOrderInput {
  userId: string | null;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  company?: string;
  address: string;
  apartment?: string;
  postalCode?: string;
  city: string;
  country: string;
  orderNotice?: string;
  total: number;
  items: { productId: string; quantity: number }[];
}

export async function createOrder(input: CreateOrderInput) {
  const supabase = await createClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: input.userId,
      name: input.name,
      lastname: input.lastname,
      phone: input.phone,
      email: input.email,
      company: input.company ?? null,
      address: input.address,
      apartment: input.apartment ?? null,
      postal_code: input.postalCode ?? null,
      city: input.city,
      country: input.country,
      order_notice: input.orderNotice ?? null,
      total: input.total,
    })
    .select()
    .single();
  if (orderError) throw new Error(orderError.message);

  const items = input.items.map((i) => ({
    order_id: order.id,
    product_id: i.productId,
    quantity: i.quantity,
  }));
  const { error: itemsError } = await supabase.from("order_items").insert(items);
  if (itemsError) throw new Error(itemsError.message);

  return order as Order;
}

export async function listMyOrders(userId: string): Promise<OrderWithItems[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "*, order_items(*, product:products(id, title, main_image, price))"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as OrderWithItems[];
}

export async function listAllOrders(): Promise<OrderWithItems[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select(
      "*, order_items(*, product:products(id, title, main_image, price))"
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as OrderWithItems[];
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
