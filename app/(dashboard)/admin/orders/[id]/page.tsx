"use client";
import { DashboardSidebar } from "@/components";
import { createClient } from "@/lib/supabase/client";
import { isValidEmailAddressFormat, isValidNameOrLastname } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface OrderProduct {
  id: string;
  customerOrderId: string;
  productId: string;
  quantity: number;
  product: {
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
  };
}

const AdminSingleOrder = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>();
  const [order, setOrder] = useState<Order>({
    id: "",
    address: "",
    apartment: "",
    company: "",
    dateTime: "",
    email: "",
    lastname: "",
    name: "",
    phone: "",
    postalCode: "",
    city: "",
    country: "",
    orderNotice: "",
    status: "processing",
    total: 0,
  });
  const params = useParams<{ id: string }>();

  const router = useRouter();

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!params?.id) return;
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select(
          "*, order_items(id, quantity, product_id, product:products(id, slug, title, main_image, price, rating, description, manufacturer, in_stock, category_id))"
        )
        .eq("id", params.id)
        .single();

      if (error || !data) return;

      setOrder({
        id: data.id,
        address: data.address ?? "",
        apartment: data.apartment ?? "",
        company: data.company ?? "",
        dateTime: data.created_at ?? "",
        email: data.email ?? "",
        lastname: data.lastname ?? "",
        name: data.name ?? "",
        phone: data.phone ?? "",
        postalCode: data.postal_code ?? "",
        city: data.city ?? "",
        country: data.country ?? "",
        orderNotice: data.order_notice ?? "",
        status: data.status ?? "processing",
        total: data.total ?? 0,
      });

      const products: OrderProduct[] = (data.order_items ?? []).map(
        (item: any) => ({
          id: item.id,
          customerOrderId: data.id,
          productId: item.product_id,
          quantity: item.quantity,
          product: {
            id: item.product?.id,
            slug: item.product?.slug,
            title: item.product?.title,
            mainImage: item.product?.main_image,
            price: item.product?.price,
            rating: item.product?.rating,
            description: item.product?.description,
            manufacturer: item.product?.manufacturer,
            inStock: item.product?.in_stock,
            categoryId: item.product?.category_id,
          },
        })
      );
      setOrderProducts(products);
    };

    fetchOrderData();
  }, [params?.id]);

  const updateOrder = async () => {
    if (
      order?.name.length > 0 &&
      order?.lastname.length > 0 &&
      order?.phone.length > 0 &&
      order?.email.length > 0 &&
      order?.company.length > 0 &&
      order?.address.length > 0 &&
      order?.apartment.length > 0 &&
      order?.city.length > 0 &&
      order?.country.length > 0 &&
      order?.postalCode.length > 0
    ) {
      if (!isValidNameOrLastname(order?.name)) {
        toast.error("You entered invalid name format");
        return;
      }

      if (!isValidNameOrLastname(order?.lastname)) {
        toast.error("You entered invalid lastname format");
        return;
      }

      if (!isValidEmailAddressFormat(order?.email)) {
        toast.error("You entered invalid email format");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({
          name: order.name,
          lastname: order.lastname,
          phone: order.phone,
          email: order.email,
          company: order.company,
          address: order.address,
          apartment: order.apartment,
          postal_code: order.postalCode,
          city: order.city,
          country: order.country,
          order_notice: order.orderNotice,
          status: order.status,
        })
        .eq("id", order.id);

      if (error) {
        toast.error("There was an error while updating a order");
        return;
      }
      toast.success("Order updated successfuly");
    } else {
      toast.error("Please fill all fields");
    }
  };

  const deleteOrder = async () => {
    const supabase = createClient();
    await supabase.from("order_items").delete().eq("order_id", order?.id);
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", order?.id);
    if (error) {
      toast.error("There was an error while deleting a order");
      return;
    }
    toast.success("Order deleted successfully");
    router.push("/admin/orders");
  };

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:ml-5 w-full max-xl:px-5">
        <h1 className="text-3xl font-semibold">Order details</h1>
        <div className="mt-5">
          <label className="w-full">
            <div>
              <span className="text-xl font-bold">Order ID:</span>
              <span className="text-base"> {order?.id}</span>
            </div>
          </label>
        </div>
        <div className="flex gap-x-2 max-sm:flex-col">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Name:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.name}
                onChange={(e) => setOrder({ ...order, name: e.target.value })}
              />
            </label>
          </div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Lastname:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.lastname}
                onChange={(e) =>
                  setOrder({ ...order, lastname: e.target.value })
                }
              />
            </label>
          </div>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Phone number:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={order?.phone}
              onChange={(e) => setOrder({ ...order, phone: e.target.value })}
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email address:</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full max-w-xs"
              value={order?.email}
              onChange={(e) => setOrder({ ...order, email: e.target.value })}
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Company (optional):</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={order?.company}
              onChange={(e) => setOrder({ ...order, company: e.target.value })}
            />
          </label>
        </div>

        <div className="flex gap-x-2 max-sm:flex-col">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Address:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.address}
                onChange={(e) => setOrder({ ...order, address: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Apartment, suite, etc. :</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.apartment}
                onChange={(e) =>
                  setOrder({ ...order, apartment: e.target.value })
                }
              />
            </label>
          </div>
        </div>

        <div className="flex gap-x-2 max-sm:flex-col">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">City:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.city}
                onChange={(e) => setOrder({ ...order, city: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Country:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.country}
                onChange={(e) =>
                  setOrder({ ...order, country: e.target.value })
                }
              />
            </label>
          </div>

          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Postal Code:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.postalCode}
                onChange={(e) =>
                  setOrder({ ...order, postalCode: e.target.value })
                }
              />
            </label>
          </div>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Order status</span>
            </div>
            <select
              className="select select-bordered"
              value={order?.status}
              onChange={(e) =>
                setOrder({
                  ...order,
                  status: e.target.value as
                    | "processing"
                    | "delivered"
                    | "canceled",
                })
              }
            >
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </label>
        </div>
        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Order notice:</span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24"
              value={order?.orderNotice || ""}
              onChange={(e) =>
                setOrder({ ...order, orderNotice: e.target.value })
              }
            ></textarea>
          </label>
        </div>
        <div>
          {orderProducts?.map((product) => (
            <div className="flex items-center gap-x-4" key={product?.id}>
              <Image
                src={product?.product?.mainImage ? `/${product?.product?.mainImage}` : "/product_placeholder.jpg"}
                alt={product?.product?.title}
                width={50}
                height={50}
                className="w-auto h-auto"
              />
              <div>
                <Link href={`/product/${product?.product?.slug}`}>
                  {product?.product?.title}
                </Link>
                <p>
                  ${product?.product?.price} * {product?.quantity} items
                </p>
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-y-2 mt-10">
            <p className="text-2xl">Subtotal: ${order?.total}</p>
            <p className="text-2xl">Tax 20%: ${order?.total / 5}</p>
            <p className="text-2xl">Shipping: $5</p>
            <p className="text-3xl font-semibold">
              Total: ${order?.total + order?.total / 5 + 5}
            </p>
          </div>
          <div className="flex gap-x-2 max-sm:flex-col mt-5">
            <button
              type="button"
              className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
              onClick={updateOrder}
            >
              Update order
            </button>
            <button
              type="button"
              className="uppercase bg-red-600 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
              onClick={deleteOrder}
            >
              Delete order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSingleOrder;
